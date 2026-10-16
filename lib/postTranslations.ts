import { randomUUID } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

/**
 * Resolves the translation_group for a post being linked as the translation of another post.
 * Returns undefined when the form didn't touch the link, null to unlink, or the group id to join.
 */
export async function resolveTranslationGroup(translationOf: unknown): Promise<string | null | undefined> {
  if (translationOf === undefined) return undefined;
  if (translationOf === "" || translationOf === null) return null;
  if (typeof translationOf !== "string") return undefined;

  const supabase = createSupabaseAdminClient();
  const { data: target } = await supabase.from("blog_posts").select("id, translation_group").eq("id", translationOf).single();
  if (!target) return undefined;
  if (target.translation_group) return target.translation_group as string;

  const group = randomUUID();
  await supabase.from("blog_posts").update({ translation_group: group }).eq("id", target.id);
  return group;
}
