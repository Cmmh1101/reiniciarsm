import AvailabilityCalendar from "@/components/admin/AvailabilityCalendar";
import GenerateSlotsForm from "@/components/admin/GenerateSlotsForm";
import { ADMIN_TIMEZONE } from "@/lib/admin/constants";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import { addDaysKey, isDateKey, todayKey, weekStartKey, zonedDayStartUtc } from "@/lib/admin/time";
import { getSlotsForAdmin } from "@/lib/adminSlots";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

interface BookingRow {
  id: string;
  status: string;
  created_at: string;
  mentoria_slots: { start_time: string; duration_minutes: number; session_type?: string } | null;
  contacts: { name: string | null; email: string } | null;
}

async function getBookings(): Promise<BookingRow[]> {
  const supabase = createSupabaseAdminClient();
  // session_type exists once migration 0016 is applied; fall back to the original columns until then.
  const withType = await supabase
    .from("mentoria_bookings")
    .select("id, status, created_at, mentoria_slots(start_time, duration_minutes, session_type), contacts(name, email)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (!withType.error) return (withType.data ?? []) as unknown as BookingRow[];

  const legacy = await supabase
    .from("mentoria_bookings")
    .select("id, status, created_at, mentoria_slots(start_time, duration_minutes), contacts(name, email)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (legacy.error) {
    console.error("admin getBookings failed", legacy.error);
    return [];
  }
  return (legacy.data ?? []) as unknown as BookingRow[];
}

export default async function AdminSessionsPage({ searchParams }: { searchParams: { week?: string } }) {
  const locale = getAdminLocale();
  const { sessions: t } = getAdminDictionary(locale);

  // The calendar shows one Monday–Sunday week, in the admin's time zone.
  const today = todayKey(ADMIN_TIMEZONE);
  const weekStart = weekStartKey(isDateKey(searchParams.week) ? searchParams.week : today);
  const from = zonedDayStartUtc(weekStart, ADMIN_TIMEZONE).toISOString();
  const to = zonedDayStartUtc(addDaysKey(weekStart, 7), ADMIN_TIMEZONE).toISOString();

  const [{ slots, hasBlocking }, bookings] = await Promise.all([getSlotsForAdmin(from, to), getBookings()]);

  return (
    <main className="p-6 md:p-10 max-w-6xl">
      <h1 className="font-display text-2xl mb-6">{t.title}</h1>

      <AvailabilityCalendar slots={slots} weekStart={weekStart} todayKey={today} timeZone={ADMIN_TIMEZONE} hasBlocking={hasBlocking} />

      <details className="mb-12 group">
        <summary className="cursor-pointer font-mono text-xs uppercase tracking-wide underline opacity-70 hover:opacity-100 mb-4 list-none [&::-webkit-details-marker]:hidden">
          + {t.showAvailability}
        </summary>
        <GenerateSlotsForm timeZone={ADMIN_TIMEZONE} />
      </details>

      <h2 className="font-semibold mb-3">{t.bookings.title}</h2>
      {bookings.length === 0 ? (
        <p className="opacity-60">{t.bookings.none}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
                <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.bookings.columns.contact}</th>
                <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.bookings.columns.time}</th>
                <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.bookings.columns.type}</th>
                <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.bookings.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className={`border-b border-[rgba(20,25,43,0.08)] ${b.status === "cancelled" ? "opacity-50" : ""}`}>
                  <td className="py-3">
                    {b.contacts?.name ?? "—"}
                    <div className="text-xs opacity-60">{b.contacts?.email}</div>
                  </td>
                  <td className="py-3 opacity-70">
                    {b.mentoria_slots
                      ? new Date(b.mentoria_slots.start_time).toLocaleString(locale, {
                          timeZone: ADMIN_TIMEZONE,
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 opacity-70">{t.types[(b.mentoria_slots?.session_type as "sos" | "session") ?? "session"]}</td>
                  <td className="py-3 opacity-70">{t.bookings.statuses[b.status] ?? b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
