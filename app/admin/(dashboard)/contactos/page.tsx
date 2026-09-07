import { getContactsWithSources } from "@/lib/contacts";
import ContactsTable from "@/components/admin/ContactsTable";

export default async function AdminContactosPage() {
  const contacts = await getContactsWithSources();

  return (
    <main className="p-10">
      <h1 className="font-display text-2xl mb-6">Contactos</h1>
      <ContactsTable contacts={contacts} />
    </main>
  );
}
