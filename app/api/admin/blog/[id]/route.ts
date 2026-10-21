import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/supabaseAdmin";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { hasLanguage, readLanguages, readTags } from "@/lib/postPayload";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.pillar) {
    return adminError(400, "Required fields are missing.", "Faltan campos requeridos.");
  }
  const { es, en } = readLanguages(body);
  if (!hasLanguage(es) && !hasLanguage(en)) {
    return adminError(400, "Write a title and content in at least one language.", "Escribe título y contenido en al menos un idioma.");
  }

  const tags = readTags(body.tags);

  const supabase = createSupabaseAdminClient();

  // Publishing sets published_at once and leaves it alone on later edits, so
  // post dates don't shift every time a typo gets fixed. Unpublishing clears it.
  const { data: existing } = await supabase.from("blog_posts").select("*").eq("id", params.id).single();
  let published_at: string | null = null;
  if (body.published) {
    published_at = existing?.published_at ?? new Date().toISOString();
  }

  // The English columns exist after migration 0018 — only write them once they are there (or when English was written).
  const hasEnglishColumns = !!existing && "title_en" in existing;
  const wroteEnglish = !!(en.title || en.content);
  if (wroteEnglish && !hasEnglishColumns) {
    return adminError(400, "Run migration 0018 in Supabase to save English content.", "Falta correr la migración 0018 en Supabase para guardar contenido en inglés.");
  }

  // Tags exist after migration 0022 — only write them once the column is there (or when tags were added).
  const hasTagsColumn = !!existing && "tags" in existing;
  if (tags.length && !hasTagsColumn) {
    return adminError(400, "Run migration 0022 in Supabase to save tags.", "Falta correr la migración 0022 en Supabase para guardar etiquetas.");
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: es.title,
      excerpt: es.excerpt || null,
      content: es.content,
      slug: body.slug,
      pillar: body.pillar,
      featured_image_url: body.featured_image_url || null,
      reading_time_minutes: body.reading_time_minutes || null,
      published_at,
      ...(hasTagsColumn ? { tags } : {}),
      ...(hasEnglishColumns ? { title_en: en.title, excerpt_en: en.excerpt || null, content_en: en.content } : {}),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return error.code === "23505"
      ? adminError(400, "That slug already exists — choose another.", "Ese slug ya existe — elige otro.")
      : adminError(400, "Couldn't save the post.", "No se pudo guardar el post.");
  }

  revalidateTag(CONTENT_CACHE_TAG);
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const denied = await guardAdminWrite(request);
  if (denied) return denied;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);

  if (error) return adminError(400, "Couldn't delete the post.", "No se pudo eliminar el post.");
  revalidateTag(CONTENT_CACHE_TAG);
  return NextResponse.json({ ok: true });
}
