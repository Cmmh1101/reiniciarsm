import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { isLocale, type Locale } from "@/lib/i18n/config";

// Enough time to actually use the product before being asked about it, per Carla's call.
const REVIEW_REQUEST_DELAY_DAYS = 6;

function reviewUrl(purchaseId: string, language: Locale) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // The Spanish link keeps its original path (it predates the language folders).
  return language === "en" ? `${siteUrl}/en/review/${purchaseId}` : `${siteUrl}/resenar/${purchaseId}`;
}

/** Called by the daily scheduled function — emails every completed purchase old enough to ask
 * about and not yet asked, then marks it asked so it's never picked up again (regardless of
 * whether they actually leave a review). */
export async function processDueReviewRequests(): Promise<{ candidates: number; sent: number }> {
  const supabase = createSupabaseAdminClient();
  const cutoff = new Date(Date.now() - REVIEW_REQUEST_DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // preferred_language comes from migration 0019; until it exists every contact is Spanish.
  type Related<T> = T | T[] | null;
  interface DuePurchase {
    id: string;
    contact_id: string;
    products: Related<{ name: string }>;
    contacts: Related<{ name: string | null; email: string; preferred_language?: string }>;
  }
  const query = async (contactColumns: string) => {
    const res = await supabase
      .from("product_purchases")
      .select(`id, contact_id, created_at, products(name), contacts(${contactColumns})`)
      .eq("status", "completed")
      .is("review_requested_at", null)
      .lte("created_at", cutoff);
    return { data: res.data as unknown as DuePurchase[] | null, error: res.error };
  };
  let result = await query("name, email, preferred_language");
  if (result.error) result = await query("name, email");
  const { data: due, error } = result;

  if (error) {
    console.error("processDueReviewRequests: query failed", error);
    return { candidates: 0, sent: 0 };
  }

  let sent = 0;
  for (const purchase of due ?? []) {
    const product = Array.isArray(purchase.products) ? purchase.products[0] : purchase.products;
    const contact = Array.isArray(purchase.contacts) ? purchase.contacts[0] : purchase.contacts;
    if (!contact?.email || !product?.name) continue;

    const name = contact.name?.trim();
    const language: Locale = isLocale(contact.preferred_language) ? contact.preferred_language : "es";
    const url = reviewUrl(purchase.id, language);
    const subject = language === "en" ? `What did you think of "${product.name}"?` : `¿Qué te pareció "${product.name}"?`;
    const text =
      language === "en"
        ? `${name ? `Hi ${name},` : "Hi,"}\n\n` +
          `A few days ago you bought "${product.name}" — I hope you've had a chance to use it.\n\n` +
          `Could you give me 2 minutes to tell me what you thought? Your review helps other people decide if it's for them too.\n\n` +
          `Leave my review → ${url}\n\n` +
          `Thank you for your support.\n\n—\nCarla`
        : `${name ? `Hola ${name},` : "Hola,"}\n\n` +
          `Hace unos días compraste "${product.name}" — espero que ya hayas tenido chance de usarlo.\n\n` +
          `¿Me regalas 2 minutos para contarme qué te pareció? Tu reseña ayuda a otras personas a decidir si es para ellas también.\n\n` +
          `Dejar mi reseña → ${url}\n\n` +
          `Gracias por tu apoyo.\n\n—\nCarla`;

    try {
      const resendId = await sendConfirmationEmail(contact.email, subject, text);
      await recordEmailSend({ resendId, contactId: purchase.contact_id, emailType: "transactional", subject });
      const { error: updateError } = await supabase
        .from("product_purchases")
        .update({ review_requested_at: new Date().toISOString() })
        .eq("id", purchase.id);
      if (updateError) console.error("processDueReviewRequests: failed to mark requested for", purchase.id, updateError);
      sent++;
    } catch (err) {
      console.error("processDueReviewRequests: failed for", contact.email, err);
    }
  }

  return { candidates: due?.length ?? 0, sent };
}
