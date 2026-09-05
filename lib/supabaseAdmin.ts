import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — bypasses RLS. Server-only: never import
 * this in a client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createSupabaseAdminClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
