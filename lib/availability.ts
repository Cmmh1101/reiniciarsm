// Venezuela has used a fixed UTC-4 offset with no DST since 2016, so a plain
// "-04:00" suffix is safe here — no timezone database needed for correctness.
const CARACAS_OFFSET = "-04:00";

export const WEEKDAYS = [
  { value: "sun", label: "Domingo", jsDay: 0 },
  { value: "mon", label: "Lunes", jsDay: 1 },
  { value: "tue", label: "Martes", jsDay: 2 },
  { value: "wed", label: "Miércoles", jsDay: 3 },
  { value: "thu", label: "Jueves", jsDay: 4 },
  { value: "fri", label: "Viernes", jsDay: 5 },
  { value: "sat", label: "Sábado", jsDay: 6 },
] as const;

export interface TimeWindow {
  start: string; // "HH:mm", Caracas local time
  end: string; // "HH:mm", Caracas local time
}

export interface GenerateSlotsInput {
  days: string[]; // subset of WEEKDAYS values, e.g. ["mon", "wed"]
  windows: TimeWindow[];
  rangeStart: string; // "YYYY-MM-DD"
  rangeEnd: string; // "YYYY-MM-DD"
  durationMinutes?: number;
}

/** Returns UTC ISO start_time strings for every 60-min slot the pattern implies. */
export function generateSlotTimes({ days, windows, rangeStart, rangeEnd, durationMinutes = 60 }: GenerateSlotsInput): string[] {
  const jsDays = new Set<number>(WEEKDAYS.filter((w) => days.includes(w.value)).map((w) => w.jsDay));
  const results: string[] = [];

  // Iterate calendar dates using UTC parsing of the plain date string, so we
  // don't accidentally shift by the machine's own local timezone.
  const cursor = new Date(`${rangeStart}T00:00:00Z`);
  const end = new Date(`${rangeEnd}T00:00:00Z`);

  while (cursor <= end) {
    const dateStr = cursor.toISOString().slice(0, 10);
    // The weekday of a Caracas calendar date, independent of the UTC cursor's own weekday.
    const caracasNoon = new Date(`${dateStr}T12:00:00${CARACAS_OFFSET}`);
    const weekday = caracasNoon.getUTCDay();

    if (jsDays.has(weekday)) {
      for (const window of windows) {
        let slotStart = new Date(`${dateStr}T${window.start}:00${CARACAS_OFFSET}`);
        const windowEnd = new Date(`${dateStr}T${window.end}:00${CARACAS_OFFSET}`);

        while (slotStart.getTime() + durationMinutes * 60_000 <= windowEnd.getTime()) {
          results.push(slotStart.toISOString());
          slotStart = new Date(slotStart.getTime() + durationMinutes * 60_000);
        }
      }
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return results;
}
