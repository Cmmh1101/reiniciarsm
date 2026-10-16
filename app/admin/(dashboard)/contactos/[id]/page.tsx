import { notFound } from "next/navigation";
import { getContactById, getContactEvents, type ContactEvent } from "@/lib/contacts";
import { fmt, getAdminDictionary, type AdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";
import { ADMIN_TIMEZONE } from "@/lib/admin/constants";
import { getEmailSendsForContact, type EmailSend } from "@/lib/emailTracking";
import ContactStatusEditor from "@/components/admin/ContactStatusEditor";
import ContactLanguageEditor from "@/components/admin/ContactLanguageEditor";

function eventCaption(event: ContactEvent, t: AdminDictionary["contacts"]): string | null {
  const m = event.metadata;
  if (!m) return null;
  if (event.event_type === "quiz_completed" && m.archetype) {
    return fmt(t.archetype, { value: String(m.archetype) });
  }
  if (event.event_type === "next_step_completed" && m.profile) {
    return fmt(t.profile, { value: String(m.profile) });
  }
  if ((event.event_type === "booking_created" || event.event_type === "payment_completed") && m.payment_method) {
    const method = m.payment_method === "stripe" ? "Stripe" : String(m.payment_method);
    return fmt(t.via, { method });
  }
  if ((event.event_type === "sequence_email_sent" || event.event_type === "newsletter_sent") && m.subject) {
    return `"${m.subject}"`;
  }
  if (event.event_type === "contact_form_submitted" && m.subject) {
    return `"${m.subject}"`;
  }
  return null;
}

function emailStatus(send: EmailSend, t: AdminDictionary["contacts"]): { label: string; color: string } {
  if (send.bounced_at) return { label: t.emailStatus.bounced, color: "text-clay" };
  if (send.complained_at) return { label: t.emailStatus.complained, color: "text-clay" };
  if (send.clicked_at) return { label: t.emailStatus.clicked, color: "text-sage" };
  if (send.opened_at) return { label: t.emailStatus.opened, color: "text-sage" };
  if (send.delivered_at) return { label: t.emailStatus.delivered, color: "opacity-70" };
  return { label: t.emailStatus.sent, color: "opacity-50" };
}

const dateFmt: Intl.DateTimeFormatOptions = {
  timeZone: ADMIN_TIMEZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

export default async function AdminContactDetailPage({ params }: { params: { id: string } }) {
  const locale = getAdminLocale();
  const { contacts: t } = getAdminDictionary(locale);
  const contact = await getContactById(params.id);
  if (!contact) notFound();

  const [events, emailSends] = await Promise.all([getContactEvents(params.id), getEmailSendsForContact(params.id)]);

  return (
    <main className="p-10 max-w-2xl">
      <h1 className="font-display text-2xl mb-1">{contact.name || contact.email}</h1>
      <p className="opacity-60 mb-6">{contact.email}</p>

      <div className="flex items-center gap-6 mb-8">
        <ContactStatusEditor contactId={contact.id} status={contact.status} />
        <ContactLanguageEditor contactId={contact.id} language={contact.preferred_language === "en" ? "en" : "es"} />
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

      <h2 className="font-semibold mb-3">{t.history}</h2>
      {events.length === 0 ? (
        <p className="opacity-60 mb-8">{t.noEvents}</p>
      ) : (
        <ul className="flex flex-col gap-4 mb-8">
          {events.map((e) => {
            const caption = eventCaption(e, t);
            return (
              <li key={e.id} className="border-l-2 border-[rgba(20,25,43,0.12)] pl-4">
                <p className="text-sm font-semibold">{t.eventTypes[e.event_type] ?? e.event_type}</p>
                {caption && <p className="text-sm opacity-70">{caption}</p>}
                <p className="text-xs opacity-50 mt-0.5">{new Date(e.created_at).toLocaleString(locale, dateFmt)}</p>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="font-semibold mb-3">{t.emails}</h2>
      {emailSends.length === 0 ? (
        <p className="opacity-60">{t.noEmails}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-[rgba(20,25,43,0.12)]">
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.emailColumns.subject}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.emailColumns.status}</th>
              <th className="py-2 font-mono text-xs uppercase tracking-wide opacity-60">{t.emailColumns.date}</th>
            </tr>
          </thead>
          <tbody>
            {emailSends.map((send) => {
              const status = emailStatus(send, t);
              return (
                <tr key={send.id} className="border-b border-[rgba(20,25,43,0.08)]">
                  <td className="py-3">{send.subject}</td>
                  <td className={`py-3 ${status.color}`}>{status.label}</td>
                  <td className="py-3 opacity-70">{new Date(send.created_at).toLocaleDateString(locale)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
