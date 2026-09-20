// Kept dependency-free (no Supabase import) so it can be shared by the client-side newsletter
// composer as well as the server-side send route and admin page.

// Audience segments selectable in /admin/newsletter — every segment is still filtered to
// subscribed=true underneath, so someone who unsubscribed never receives a broadcast regardless
// of which segment is picked.
export const NEWSLETTER_AUDIENCES = ["all", "clients", "non_buyers"] as const;
export type NewsletterAudience = (typeof NEWSLETTER_AUDIENCES)[number];

export const AUDIENCE_LABELS: Record<NewsletterAudience, string> = {
  all: "Todos los suscriptores",
  clients: "Clientes (compraron un producto)",
  non_buyers: "No han comprado ningún producto",
};
