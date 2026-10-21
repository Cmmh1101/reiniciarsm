import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENT_CACHE_TAG } from "@/lib/supabaseAdmin";
import { adminError } from "@/lib/admin/apiError";
import { guardAdminWrite } from "@/lib/adminRequest";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { hasLanguage, readLanguages } from "@/lib/postPayload";

export async function POST(request: Request) {
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

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      // The original columns hold the Spanish version; an English-only post leaves them empty.
      title: es.title,
      excerpt: es.excerpt || null,
      content: es.content,
      // English columns only exist after migration 0018 — don't send them for a Spanish-only post.
      ...(en.title || en.content ? { title_en: en.title, excerpt_en: en.excerpt || null, content_en: en.content } : {}),
      slug: body.slug,
      pillar: body.pillar,
      arc_phase: body.arc_phase || null,
      featured_image_url: body.featured_image_url || null,
      reading_time_minutes: body.reading_time_minutes || null,
      published_at: body.published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    return error.code === "23505"
      ? adminError(400, "That slug already exists — choose another.", "Ese slug ya existe — elige otro.")
      : adminError(400, "Couldn't create the post.", "No se pudo crear el post.");
  }

  revalidateTag(CONTENT_CACHE_TAG);
  return NextResponse.json(data);
}
