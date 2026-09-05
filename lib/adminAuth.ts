import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

/**
 * Never trust middleware.ts alone for a page or write that matters — it only
 * gates routing. Every admin Server Component and every /api/admin/* handler
 * re-checks the session here.
 */
export async function getAdminUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

/** For Server Components/layouts — redirects instead of returning null. */
export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
