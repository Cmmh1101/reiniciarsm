import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n/config";

interface UpsertContactInput {
  email: string;
  name?: string;
  // The language the person is using right now. It becomes their preferred language, so someone
  // who later switches site language gets later emails in the new one.
  locale?: Locale;
  extra?: Record<string, unknown>;
  select?: string;
}

export interface UpsertedContact {
  id: string;
  tags?: string[] | null;
}

/**
 * Creates or updates a contact by email. Writes preferred_language (migration 0019) when a locale
 * is given, and retries without it on a database that hasn't run that migration yet.
 */
export async function upsertContact(
  supabase: SupabaseClient,
  { email, name, locale, extra = {}, select = "id" }: UpsertContactInput
): Promise<{ data: UpsertedContact | null; error: PostgrestError | null }> {
  const base = { email, ...(name !== undefined ? { name } : {}), ...extra };
  const run = async (row: Record<string, unknown>) => {
    const res = await supabase.from("contacts").upsert(row, { onConflict: "email", ignoreDuplicates: false }).select(select).single();
    return { data: res.data as unknown as UpsertedContact | null, error: res.error };
  };

  if (!locale) return run(base);
  const withLanguage = await run({ ...base, preferred_language: locale });
  if (!withLanguage.error) return withLanguage;
  // 42703 = undefined column: the migration hasn't been applied yet.
  if (withLanguage.error.code === "42703") return run(base);
  return withLanguage;
}
