import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { getAvailableSlots } from "@/lib/mentorias";
import GenerateSlotsForm from "@/components/admin/GenerateSlotsForm";

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
    .order("created_at", { ascending: false });
  if (!withType.error) return (withType.data ?? []) as unknown as BookingRow[];

  const legacy = await supabase
    .from("mentoria_bookings")
    .select("id, status, created_at, mentoria_slots(start_time, duration_minutes), contacts(name, email)")
    .order("created_at", { ascending: false });
  if (legacy.error) {
    console.error("admin getBookings failed", legacy.error);
    return [];
  }
  return (legacy.data ?? []) as unknown as BookingRow[];
}

const TYPE_LABEL: Record<string, string> = { sos: "Tech SOS · 30 min", session: "Sesión 1:1 · 60 min" };

export default async function AdminMentoriasPage() {
  const [bookings, availableSlots] = await Promise.all([getBookings(), getAvailableSlots()]);

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-1">Sesiones y mentorías</h1>
      <p className="text-xs opacity-60 mb-6">Horarios en hora de Venezuela (UTC-4).</p>

      <GenerateSlotsForm />

      <h2 className="font-semibold mb-3">
        Horarios disponibles <span className="opacity-50 font-normal">({availableSlots.length})</span>
      </h2>
      {availableSlots.length === 0 ? (
        <p className="opacity-60 mb-8">No hay horarios disponibles.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-8">
          {availableSlots.map((slot) => (
            <span key={slot.id} className="text-xs px-3 py-1.5 rounded-full border border-[rgba(20,25,43,0.15)]">
              {new Date(slot.start_time).toLocaleString("es", {
                timeZone: "America/Caracas",
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
              {slot.session_type === "sos" && <span className="ml-1.5 font-mono text-[10px] text-clay">SOS</span>}
            </span>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-3">Reservas</h2>
      {bookings.length === 0 ? (
        <p className="opacity-60">Todavía no hay reservas.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Contacto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Horario</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Tipo</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Estado</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-[rgba(20,25,43,0.08)]">
                <td className="py-3">
                  {b.contacts?.name ?? "—"}
                  <div className="text-xs opacity-60">{b.contacts?.email}</div>
                </td>
                <td className="py-3 opacity-70">
                  {b.mentoria_slots
                    ? new Date(b.mentoria_slots.start_time).toLocaleString("es", {
                        timeZone: "America/Caracas",
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="py-3 opacity-70">{TYPE_LABEL[b.mentoria_slots?.session_type ?? "session"]}</td>
                <td className="py-3 opacity-70">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
