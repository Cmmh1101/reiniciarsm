import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.title || !body?.slug || !body?.content || !body?.pillar) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // Publishing sets published_at once and leaves it alone on later edits, so
  // post dates don't shift every time a typo gets fixed. Unpublishing clears it.
  let published_at: string | null = null;
  if (body.published) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published_at")
      .eq("id", params.id)
      .single();
    published_at = existing?.published_at ?? new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content,
      pillar: body.pillar,
      arc_phase: body.arc_phase || null,
      featured_image_url: body.featured_image_url || null,
      reading_time_minutes: body.reading_time_minutes || null,
      published_at,
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
