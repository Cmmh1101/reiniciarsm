import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Links already sent in emails have no lang parameter — they were all Spanish.
const COPY = {
  es: {
    invalidTitle: "Solicitud inválida",
    invalidBody: "Ese enlace no incluye un correo válido.",
    errorTitle: "Algo salió mal",
    errorBody: "Intenta de nuevo en un momento, o escríbeme directamente a hello@carlamontano.io.",
    doneTitle: "Listo, te diste de baja",
    doneBody: (email: string) => `${email} no recibirá más correos de Carla Montaño.`,
  },
  en: {
    invalidTitle: "Invalid request",
    invalidBody: "That link doesn't include a valid email address.",
    errorTitle: "Something went wrong",
    errorBody: "Please try again in a moment, or write to me directly at hello@carlamontano.io.",
    doneTitle: "Done — you've been unsubscribed",
    doneBody: (email: string) => `${email} won't receive any more emails from Carla Montaño.`,
  },
};

function page(lang: "en" | "es", title: string, message: string) {
  return `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body{font-family:'Inter',system-ui,sans-serif;background:#EDE6D8;color:#14192B;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center;}
  .card{max-width:420px;}
  h1{font-size:22px;margin-bottom:12px;}
  p{opacity:0.75;line-height:1.6;}
  a{color:#BE5A34;}
</style>
</head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body>
</html>`;
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";
  const lang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "es";
  const t = COPY[lang];

  if (!email || !EMAIL_RE.test(email)) {
    return new NextResponse(page(lang, t.invalidTitle, t.invalidBody), { status: 400, headers: { "Content-Type": "text/html" } });
  }

  const supabase = createSupabaseAdminClient();
  // Also stop any active drip sequence — no point continuing a sequence for
  // someone who just unsubscribed from all email.
  const { error } = await supabase
    .from("contacts")
    .update({ subscribed: false, sequence: null, sequence_next_send_at: null })
    .eq("email", email);

  if (error) {
    console.error("unsubscribe: update failed", error);
    return new NextResponse(page(lang, t.errorTitle, t.errorBody), { status: 500, headers: { "Content-Type": "text/html" } });
  }

  return new NextResponse(page(lang, t.doneTitle, t.doneBody(email)), { status: 200, headers: { "Content-Type": "text/html" } });
}
