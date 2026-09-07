import { notFound } from "next/navigation";
import { getContactById, getContactEvents, EVENT_TYPE_INFO, type ContactEvent } from "@/lib/contacts";
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
  return null;
}

export default async function AdminContactDetailPage({ params }: { params: { id: string } }) {
  const contact = await getContactById(params.id);
  if (!contact) notFound();

  const events = await getContactEvents(params.id);

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
        <p className="opacity-60">Sin eventos todavía.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {events.map((e) => {
            const info = EVENT_TYPE_INFO[e.event_type];
            const caption = eventCaption(e);
            return (
              <li key={e.id} className="border-l-2 border-[rgba(20,25,43,0.12)] pl-4">
                <p className="text-sm font-semibold">{info?.label ?? e.event_type}</p>
                {caption && <p className="text-sm opacity-70">{caption}</p>}
                <p className="text-xs opacity-50 mt-0.5">
                  {new Date(e.created_at).toLocaleString("es", {
                    timeZone: "America/Caracas",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
