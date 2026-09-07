import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function page(title: string, message: string) {
  return `<!doctype html>
<html lang="es">
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

  if (!email || !EMAIL_RE.test(email)) {
    return new NextResponse(page("Solicitud inválida", "Ese enlace no incluye un correo válido."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
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
    return new NextResponse(page("Algo salió mal", "Intenta de nuevo en un momento, o escríbeme directamente a hello@carlamontano.io."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(
    page("Listo, te diste de baja", `${email} no recibirá más correos de Reiniciar Sin Mapa.`),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
