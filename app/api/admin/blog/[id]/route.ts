import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { hasLanguage, readLanguages } from "@/lib/postPayload";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.pillar) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }
  const { es, en } = readLanguages(body);
  if (!hasLanguage(es) && !hasLanguage(en)) {
    return NextResponse.json({ error: "Escribe título y contenido en al menos un idioma." }, { status: 400 });
  }

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
    return NextResponse.json({ error: "Falta correr la migración 0018 en Supabase para guardar contenido en inglés." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: es.title,
      excerpt: es.excerpt || null,
      content: es.content,
      slug: body.slug,
      pillar: body.pillar,
      arc_phase: body.arc_phase || null,
      featured_image_url: body.featured_image_url || null,
      reading_time_minutes: body.reading_time_minutes || null,
      published_at,
      ...(hasEnglishColumns ? { title_en: en.title, excerpt_en: en.excerpt || null, content_en: en.content } : {}),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    const message = error.code === "23505" ? "Ese slug ya existe — elige otro." : "No se pudo guardar el post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: "No se pudo eliminar el post." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
