// Date helpers for the availability calendar. Days are handled as "YYYY-MM-DD" keys in the admin's
// time zone, so a week always runs Monday–Sunday in that zone no matter where the browser is.

export interface ZonedParts {
  dateKey: string; // YYYY-MM-DD in the zone
  minutes: number; // minutes since local midnight
  weekday: number; // 0 = Sunday … 6 = Saturday
}

function partsOf(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) map[p.type] = p.value;
  return map;
}

export function zonedParts(input: string | Date, timeZone: string): ZonedParts {
  const date = typeof input === "string" ? new Date(input) : input;
  const p = partsOf(date, timeZone);
  const dateKey = `${p.year}-${p.month}-${p.day}`;
  return { dateKey, minutes: Number(p.hour) * 60 + Number(p.minute), weekday: new Date(`${dateKey}T12:00:00Z`).getUTCDay() };
}

export function todayKey(timeZone: string): string {
  return zonedParts(new Date(), timeZone).dateKey;
}

export function addDaysKey(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The Monday of the week containing dateKey. */
export function weekStartKey(dateKey: string): string {
  const weekday = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  return addDaysKey(dateKey, weekday === 0 ? -6 : 1 - weekday);
}

/** The UTC instant at which a calendar day starts in the given zone. */
export function zonedDayStartUtc(dateKey: string, timeZone: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  const p = partsOf(guess, timeZone);
  const asIfUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  const offsetMs = asIfUtc - guess.getTime(); // zone offset at that moment
  return new Date(guess.getTime() - offsetMs);
}

export function isDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime());
}
