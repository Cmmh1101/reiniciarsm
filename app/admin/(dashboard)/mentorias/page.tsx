import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

interface BookingRow {
  id: string;
  status: string;
  created_at: string;
  mentoria_slots: { start_time: string; duration_minutes: number } | null;
  contacts: { name: string | null; email: string } | null;
}

async function getBookings(): Promise<BookingRow[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("mentoria_bookings")
    .select("id, status, created_at, mentoria_slots(start_time, duration_minutes), contacts(name, email)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("admin getBookings failed", error);
    return [];
  }
  return (data ?? []) as unknown as BookingRow[];
}

export default async function AdminMentoriasPage() {
  const bookings = await getBookings();

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">Mentorías — Reservas</h1>

      {bookings.length === 0 ? (
        <p className="opacity-60">Todavía no hay reservas.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Contacto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Horario</th>
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
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>
                <td className="py-3 opacity-70">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
