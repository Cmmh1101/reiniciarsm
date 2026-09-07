import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const CONTACT_STATUSES = ["nuevo", "contactado", "en_nutricion", "convertido"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const STATUS_LABELS: Record<ContactStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  en_nutricion: "En nutrición",
  convertido: "Convertido",
};

// Maps raw contact_events.event_type to a human label and a coarse "source"
// bucket, used for the /admin/contactos filter and the event timeline.
export const EVENT_TYPE_INFO: Record<string, { label: string; source: string }> = {
  quiz_completed: { label: "Completó el Diagnóstico Next You", source: "Diagnóstico" },
  newsletter_signup: { label: "Se suscribió al newsletter", source: "Newsletter" },
  booking_created: { label: "Reservó una sesión de Mentoría", source: "Mentoría" },
  payment_completed: { label: "Compró el paquete de Mentoría", source: "Mentoría" },
};

export interface Contact {
  id: string;
  email: string;
  name: string | null;
  tags: string[];
  status: string;
  created_at: string;
}

export interface ContactEvent {
  id: string;
  contact_id: string;
  event_type: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ContactWithSources extends Contact {
  sources: string[];
}

export async function getContactsWithSources(): Promise<ContactWithSources[]> {
  const supabase = createSupabaseAdminClient();
  const [{ data: contacts, error: contactsError }, { data: events, error: eventsError }] = await Promise.all([
    supabase.from("contacts").select("*").order("created_at", { ascending: false }),
    supabase.from("contact_events").select("contact_id, event_type"),
  ]);

  if (contactsError || !contacts) {
    console.error("getContactsWithSources: contacts query failed", contactsError);
    return [];
  }
  if (eventsError) {
    console.error("getContactsWithSources: events query failed", eventsError);
  }

  const sourcesByContact = new Map<string, Set<string>>();
  for (const event of events ?? []) {
    const source = EVENT_TYPE_INFO[event.event_type]?.source ?? event.event_type;
    if (!sourcesByContact.has(event.contact_id)) sourcesByContact.set(event.contact_id, new Set());
    sourcesByContact.get(event.contact_id)!.add(source);
  }

  return contacts.map((c) => ({ ...c, sources: [...(sourcesByContact.get(c.id) ?? [])] }));
}

export async function getContactById(id: string): Promise<Contact | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("contacts").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getContactEvents(contactId: string): Promise<ContactEvent[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_events")
    .select("*")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getContactEvents failed", error);
    return [];
  }
  return data ?? [];
}
