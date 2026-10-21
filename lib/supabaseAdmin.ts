import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS. Server-only: never import
 * this in a client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createSupabaseAdminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Next.js caches fetch() responses in its data cache by default, which can serve stale posts,
    // products or slots after an edit. Everything read through this client is live data.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

/** Cache lifetime for public content (posts, products, reviews). Admin edits clear it immediately (revalidateTag). */
export const CONTENT_CACHE_SECONDS = 60;
export const CONTENT_CACHE_TAG = "content";

/**
 * Same service-role client, for READ-ONLY queries behind public pages (posts, products, approved reviews).
 * Its responses go into Next's data cache for a minute, and are cleared the moment the admin saves something,
 * so those pages can be served as static HTML from the CDN instead of being rendered on every visit.
 * Never use it for anything that must be live (bookings, slots, purchases, downloads, admin screens).
 */
export function createSupabasePublicReadClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: CONTENT_CACHE_SECONDS, tags: [CONTENT_CACHE_TAG] } }) },
  });
}
