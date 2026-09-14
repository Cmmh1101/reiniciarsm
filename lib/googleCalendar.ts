// Google Calendar's "quick add" URL — no OAuth or API credentials needed, just a link that
// pre-fills a new event for the user to confirm in their own calendar with one click.
export function buildGoogleCalendarLink({
  title,
  startISO,
  durationMinutes,
  details,
}: {
  title: string;
  startISO: string;
  durationMinutes: number;
  details?: string;
}): string {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (details) params.set("details", details);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
