import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Resend signs webhooks via Svix. Column to stamp per event type — anything
// else (email.sent, email.delivery_delayed) is acknowledged but not tracked.
const EVENT_COLUMN: Record<string, string> = {
  "email.delivered": "delivered_at",
  "email.opened": "opened_at",
  "email.clicked": "clicked_at",
  "email.bounced": "bounced_at",
  "email.complained": "complained_at",
};

export async function POST(request: Request) {
  const body = await request.text();
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    console.error("resend-webhook: RESEND_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  let event: { type: string; data: { email_id?: string } };
  try {
    event = new Webhook(secret).verify(body, svixHeaders) as typeof event;
  } catch (err) {
    console.error("resend-webhook: signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const column = EVENT_COLUMN[event.type];
  const resendId = event.data?.email_id;

  if (!column || !resendId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseAdminClient();
  // Never overwrite an already-recorded timestamp for this event type (e.g. a
  // second "opened" webhook from a re-open, or a duplicate delivery retry).
  const { data: existing } = await supabase.from("email_sends").select(column).eq("resend_id", resendId).single();

  if (existing && !existing[column as keyof typeof existing]) {
    const { error } = await supabase
      .from("email_sends")
      .update({ [column]: new Date().toISOString() })
      .eq("resend_id", resendId);
    if (error) console.error("resend-webhook: failed to update email_sends", error);
  }

  return NextResponse.json({ received: true });
}
