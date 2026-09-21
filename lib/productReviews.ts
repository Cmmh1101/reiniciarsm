import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { sendConfirmationEmail } from "@/lib/resend";
import type { Product } from "@/lib/products";

// Below these, we simply don't show the number at all rather than round up or pad it —
// a product page with no badge reads as normal, not suspicious, and every number shown is real.
export const MIN_REVIEWS_TO_SHOW_RATING = 3;
export const MIN_PURCHASES_TO_SHOW_COUNT = 10;

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ProductStats {
  avgRating: number | null;
  reviewCount: number;
  purchaseCount: number;
}

export type ProductWithStats = Product & ProductStats;

const EMPTY_STATS: ProductStats = { avgRating: null, reviewCount: 0, purchaseCount: 0 };

/** Merges getProductStats()'s Map into a plain array — for passing to client components, which
 * can't receive a Map as a prop across the server/client boundary. */
export function withProductStats(products: Product[], stats: Map<string, ProductStats>): ProductWithStats[] {
  return products.map((p) => ({ ...p, ...(stats.get(p.id) ?? EMPTY_STATS) }));
}

export interface ApprovedReview {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewerName: string | null;
}

export interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  created_at: string;
  productName: string;
  contactName: string | null;
  contactEmail: string;
}

/** Per-product real counts for the storefront — raw numbers only, no padding. Callers decide
 * whether to render based on MIN_REVIEWS_TO_SHOW_RATING / MIN_PURCHASES_TO_SHOW_COUNT. */
export async function getProductStats(): Promise<Map<string, ProductStats>> {
  const supabase = createSupabaseAdminClient();
  const [{ data: reviews }, { data: purchases }] = await Promise.all([
    supabase.from("product_reviews").select("product_id, rating").eq("status", "approved"),
    supabase.from("product_purchases").select("product_id").eq("status", "completed"),
  ]);

  const stats = new Map<string, ProductStats>();
  const ratingSums = new Map<string, { sum: number; count: number }>();

  for (const r of reviews ?? []) {
    const agg = ratingSums.get(r.product_id) ?? { sum: 0, count: 0 };
    agg.sum += r.rating;
    agg.count += 1;
    ratingSums.set(r.product_id, agg);
  }
  for (const [productId, { sum, count }] of ratingSums) {
    stats.set(productId, { avgRating: sum / count, reviewCount: count, purchaseCount: 0 });
  }
  for (const p of purchases ?? []) {
    const existing = stats.get(p.product_id) ?? { avgRating: null, reviewCount: 0, purchaseCount: 0 };
    existing.purchaseCount += 1;
    stats.set(p.product_id, existing);
  }

  return stats;
}

export async function getApprovedReviewsForProduct(productId: string): Promise<ApprovedReview[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, rating, comment, created_at, contacts(name)")
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getApprovedReviewsForProduct failed", error);
    return [];
  }

  return data.map((r) => {
    const contact = Array.isArray(r.contacts) ? r.contacts[0] : r.contacts;
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      reviewerName: contact?.name ?? null,
    };
  });
}

/** Admin-only — every review regardless of status, for the moderation queue. */
export async function getAllReviewsForAdmin(): Promise<AdminReview[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, rating, comment, status, created_at, products(name), contacts(name, email)")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getAllReviewsForAdmin failed", error);
    return [];
  }

  return data.map((r) => {
    const product = Array.isArray(r.products) ? r.products[0] : r.products;
    const contact = Array.isArray(r.contacts) ? r.contacts[0] : r.contacts;
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      status: r.status as ReviewStatus,
      created_at: r.created_at,
      productName: product?.name ?? "(producto eliminado)",
      contactName: contact?.name ?? null,
      contactEmail: contact?.email ?? "",
    };
  });
}

interface PurchaseForReview {
  productName: string;
  alreadyReviewed: boolean;
}

/** For the public /resenar/[purchaseId] page — confirms the purchase is real and completed, and
 * whether it was already reviewed, before showing the form. */
export async function getPurchaseForReview(purchaseId: string): Promise<PurchaseForReview | null> {
  const supabase = createSupabaseAdminClient();
  const [{ data: purchase }, { data: existingReview }] = await Promise.all([
    supabase.from("product_purchases").select("id, status, products(name)").eq("id", purchaseId).eq("status", "completed").single(),
    supabase.from("product_reviews").select("id").eq("purchase_id", purchaseId).maybeSingle(),
  ]);

  if (!purchase) return null;
  const product = Array.isArray(purchase.products) ? purchase.products[0] : purchase.products;
  return { productName: product?.name ?? "tu compra", alreadyReviewed: !!existingReview };
}

export async function setReviewStatus(reviewId: string, status: "approved" | "rejected"): Promise<boolean> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("product_reviews").update({ status }).eq("id", reviewId);
  if (error) {
    console.error("setReviewStatus failed", error);
    return false;
  }
  return true;
}

interface SubmitReviewInput {
  purchaseId: string;
  rating: number;
  comment: string;
}

type SubmitReviewResult =
  | { ok: true }
  | { ok: false; error: "not_found" | "already_reviewed" | "invalid_rating" | "server_error" };

/** Called from the public /resenar/[purchaseId] page — no auth, the purchase id itself (an
 * unguessable uuid, same trust model as the download token) is what authorizes the submission. */
export async function submitReview({ purchaseId, rating, comment }: SubmitReviewInput): Promise<SubmitReviewResult> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "invalid_rating" };
  }

  const supabase = createSupabaseAdminClient();
  const { data: purchase, error: purchaseError } = await supabase
    .from("product_purchases")
    .select("id, product_id, contact_id, status, products(name), contacts(name, email)")
    .eq("id", purchaseId)
    .eq("status", "completed")
    .single();

  if (purchaseError || !purchase) {
    return { ok: false, error: "not_found" };
  }

  const { error: insertError } = await supabase.from("product_reviews").insert({
    purchase_id: purchase.id,
    product_id: purchase.product_id,
    contact_id: purchase.contact_id,
    rating,
    comment: comment.trim() || null,
    status: "pending",
  });

  if (insertError) {
    // Unique violation on purchase_id — they already left a review for this purchase.
    if (insertError.code === "23505") return { ok: false, error: "already_reviewed" };
    console.error("submitReview: insert failed", insertError);
    return { ok: false, error: "server_error" };
  }

  await supabase.from("contact_events").insert({
    contact_id: purchase.contact_id,
    event_type: "review_submitted",
    metadata: { product_id: purchase.product_id, rating },
  });

  const product = Array.isArray(purchase.products) ? purchase.products[0] : purchase.products;
  const contact = Array.isArray(purchase.contacts) ? purchase.contacts[0] : purchase.contacts;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendConfirmationEmail(
      adminEmail,
      `Nueva reseña pendiente: ${product?.name ?? "producto"} — ${rating}★`,
      `${contact?.name ?? contact?.email ?? "Alguien"} dejó una reseña de ${rating}★ para "${product?.name}".\n\n${
        comment.trim() || "(sin comentario)"
      }\n\nApruébala en /admin/resenas.`
    );
  }

  return { ok: true };
}
