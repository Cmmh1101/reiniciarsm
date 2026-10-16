import { getContactsWithSources } from "@/lib/contacts";
import ContactsTable from "@/components/admin/ContactsTable";
import { getAdminDictionary } from "@/lib/admin/dictionary";
import { getAdminLocale } from "@/lib/admin/i18n";

export default async function AdminContactosPage() {
  const contacts = await getContactsWithSources();
  const { contacts: t } = getAdminDictionary(getAdminLocale());

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">{t.title}</h1>
      <ContactsTable contacts={contacts} />
    </main>
  );
}
