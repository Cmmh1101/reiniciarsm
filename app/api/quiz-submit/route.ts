import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { computeWinner, isValidScores, type QuizScores } from "@/lib/diagnostic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const scores: QuizScores | null = isValidScores(body?.scores) ? body.scores : null;

  if (!name || !EMAIL_RE.test(email) || !scores) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  // Recompute the winner server-side — never trust a client-supplied archetype/tag.
  const winner = computeWinner(scores);

  const supabase = createSupabaseAdminClient();

  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .upsert(
      { email, name, tags: [winner.tag] },
      { onConflict: "email", ignoreDuplicates: false }
    )
    .select("id, tags")
    .single();

  if (contactError || !contact) {
    console.error("quiz-submit: failed to upsert contact", contactError);
    return NextResponse.json({ error: "No se pudo guardar tu diagnóstico." }, { status: 500 });
  }

  // Merge tags rather than overwrite, in case this contact already has others
  // (e.g. newsletter signup) from a previous event.
  const mergedTags = Array.from(new Set([...(contact.tags ?? []), winner.tag]));
  await supabase.from("contacts").update({ tags: mergedTags }).eq("id", contact.id);

  const { error: eventError } = await supabase.from("contact_events").insert({
    contact_id: contact.id,
    event_type: "quiz_completed",
    metadata: { archetype: winner.archetype, pillar: winner.key, tag: winner.tag, scores },
  });

  if (eventError) {
    console.error("quiz-submit: failed to insert contact_event", eventError);
  }

  // Hand off to n8n for the immediate result email + the delayed nurture
  // sequence (Resend is only ever called from n8n, never directly from here —
  // see docs/plan-migracion-stack-tecnico.md §5, Flujo 1). Best-effort: a
  // failed/missing n8n webhook shouldn't block the lead from seeing their result.
  const webhookUrl = process.env.N8N_QUIZ_WEBHOOK_URL;
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({
        name,
        email,
        archetype: winner.archetype,
        pillar: winner.key,
        tag: winner.tag,
        scores,
      }),
    }).catch((err) => console.error("quiz-submit: n8n webhook failed", err));
  }

  return NextResponse.json({ pillar: winner.key, archetype: winner.archetype });
}
