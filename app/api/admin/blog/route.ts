import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { hasLanguage, readLanguages } from "@/lib/postPayload";

export async function POST(request: Request) {
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
    const message = error.code === "23505" ? "Ese slug ya existe — elige otro." : "No se pudo crear el post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json(data);
}
