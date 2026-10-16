import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { resolveTranslationGroup } from "@/lib/postTranslations";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.slug || !body?.content || !body?.pillar) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const group = await resolveTranslationGroup(body.translation_of);
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      // Only sent when set, so creating a plain Spanish post keeps working before migration 0018.
      ...(body.locale === "en" ? { locale: "en" } : {}),
      ...(group ? { translation_group: group } : {}),
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
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
