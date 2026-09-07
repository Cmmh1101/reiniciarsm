import { notFound } from "next/navigation";
import { getContactById, getContactEvents, EVENT_TYPE_INFO, type ContactEvent } from "@/lib/contacts";
import { getEmailSendsForContact, type EmailSend } from "@/lib/emailTracking";
import ContactStatusEditor from "@/components/admin/ContactStatusEditor";

function eventCaption(event: ContactEvent): string | null {
  const m = event.metadata;
  if (!m) return null;
  if (event.event_type === "quiz_completed" && m.archetype) {
    return `Arquetipo: ${m.archetype}`;
  }
  if ((event.event_type === "booking_created" || event.event_type === "payment_completed") && m.payment_method) {
    const method = m.payment_method === "stripe" ? "Stripe" : String(m.payment_method);
    return `Vía ${method}`;
  }
  if ((event.event_type === "sequence_email_sent" || event.event_type === "newsletter_sent") && m.subject) {
    return `"${m.subject}"`;
  }
  return null;
}

function emailStatus(send: EmailSend): { label: string; color: string } {
  if (send.bounced_at) return { label: "Rebotado", color: "text-clay" };
  if (send.complained_at) return { label: "Marcado como spam", color: "text-clay" };
  if (send.clicked_at) return { label: "Clic", color: "text-sage" };
  if (send.opened_at) return { label: "Abierto", color: "text-sage" };
  if (send.delivered_at) return { label: "Entregado", color: "opacity-70" };
  return { label: "Enviado", color: "opacity-50" };
}

const dateFmt: Intl.DateTimeFormatOptions = {
  timeZone: "America/Caracas",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

export default async function AdminContactDetailPage({ params }: { params: { id: string } }) {
  const contact = await getContactById(params.id);
  if (!contact) notFound();

  const [events, emailSends] = await Promise.all([getContactEvents(params.id), getEmailSendsForContact(params.id)]);

  return (
    <main className="p-10 max-w-2xl">
      <h1 className="font-display text-2xl mb-1">{contact.name || contact.email}</h1>
      <p className="opacity-60 mb-6">{contact.email}</p>

      <div className="flex items-center gap-6 mb-8">
        <ContactStatusEditor contactId={contact.id} status={contact.status} />
        {contact.tags.length > 0 && (
          <div className="flex gap-1.5">
            {contact.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-[rgba(20,25,43,0.15)]">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <h2 className="font-semibold mb-3">Historial</h2>
      {events.length === 0 ? (
        <p className="opacity-60 mb-8">Sin eventos todavía.</p>
      ) : (
        <ul className="flex flex-col gap-4 mb-8">
          {events.map((e) => {
            const info = EVENT_TYPE_INFO[e.event_type];
            const caption = eventCaption(e);
            return (
              <li key={e.id} className="border-l-2 border-[rgba(20,25,43,0.12)] pl-4">
                <p className="text-sm font-semibold">{info?.label ?? e.event_type}</p>
                {caption && <p className="text-sm opacity-70">{caption}</p>}
                <p className="text-xs opacity-50 mt-0.5">{new Date(e.created_at).toLocaleString("es", dateFmt)}</p>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="font-semibold mb-3">Correos enviados</h2>
      {emailSends.length === 0 ? (
        <p className="opacity-60">Sin correos todavía.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Asunto</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Estado</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {emailSends.map((send) => {
              const status = emailStatus(send);
              return (
                <tr key={send.id} className="border-b border-[rgba(20,25,43,0.08)]">
                  <td className="py-3">{send.subject}</td>
                  <td className={`py-3 ${status.color}`}>{status.label}</td>
                  <td className="py-3 opacity-70">{new Date(send.created_at).toLocaleDateString("es")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
