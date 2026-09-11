import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import { recordEmailSend } from "@/lib/emailTracking";
import { getProductById } from "@/lib/products";

interface RecordProductPurchaseInput {
  email: string;
  name: string;
  productId: string;
  amountCents: number;
  stripePaymentId: string | null;
}

/** Called from the Stripe webhook once payment is confirmed. Creates the purchase row (which
 * mints the download token), logs a CRM event, and emails the customer their download link —
 * the same email is what the "gracias" page's download button also points at, so either path
 * works even if one fails. */
export async function recordProductPurchase({ email, name, productId, amountCents, stripePaymentId }: RecordProductPurchaseInput) {
  const supabase = createSupabaseAdminClient();

  const product = await getProductById(productId);
  if (!product) {
    console.error("recordProductPurchase: product not found", productId);
    throw new Error("Product not found");
  }

  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert({ email, name }, { onConflict: "email", ignoreDuplicates: false })
    .select("id")
    .single();

  if (contactError || !contact) {
    console.error("recordProductPurchase: failed to upsert contact", contactError);
    throw new Error("Failed to record contact");
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from("product_purchases")
    .insert({
      product_id: productId,
      contact_id: contact.id,
      stripe_payment_id: stripePaymentId,
      amount_cents: amountCents,
      status: "completed",
    })
    .select("id, download_token")
    .single();

  if (purchaseError || !purchase) {
    console.error("recordProductPurchase: failed to insert purchase", purchaseError);
    throw new Error("Failed to record purchase");
  }

  await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "product_purchased",
    metadata: { product_id: productId, product_name: product.name, amount_cents: amountCents, stripe_payment_id: stripePaymentId },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const downloadUrl = `${siteUrl}/api/download/${purchase.download_token}`;
  const subject = `Tu compra: ${product.name}`;
  const resendId = await sendConfirmationEmail(
    email,
    subject,
    `Hola ${name || ""},\n\n¡Gracias por tu compra! Aquí está tu enlace de descarga para "${product.name}":\n\n${downloadUrl}\n\nSi tienes cualquier problema para descargarlo, escríbeme a hello@carlamontano.io.\n\nSaludos,\nCarla`
  );
  await recordEmailSend({ resendId, contactId: contact.id, emailType: "transactional", subject });

  return { purchaseId: purchase.id, downloadToken: purchase.download_token };
}
