// Two paths into the same branded shell:
// - textToEmailHtml: converts the plain-text bodies already used throughout
//   lib/sequences.ts (paragraphs, "Label → https://..." CTA lines, the
//   unsubscribe line) without touching that already-verified content.
// - wrapEmailShell: wraps real HTML (from the Tiptap newsletter composer)
//   directly.

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function linkifyEscaped(escaped: string): string {
  return escaped.replace(/(https?:\/\/[^\s<]+)/g, (url) => `<a href="${url}" style="color:#BE5A34;">${url}</a>`);
}

const CTA_LINE_RE = /^(.+?)\s*→\s*(https?:\/\/\S+?)\.?$/;

function renderParagraph(paragraph: string): string {
  const ctaMatch = paragraph.match(CTA_LINE_RE);
  if (ctaMatch) {
    const [, label, url] = ctaMatch;
    return (
      `<p style="text-align:center;margin:28px 0;">` +
      `<a href="${url}" style="background:#BE5A34;color:#EDE6D8;text-decoration:none;padding:14px 28px;border-radius:3px;display:inline-block;font-weight:600;">${escapeHtml(label.trim())} →</a>` +
      `</p>`
    );
  }

  const withBreaks = escapeHtml(paragraph).replace(/\n/g, "<br>");
  return `<p style="margin:0 0 20px;">${linkifyEscaped(withBreaks)}</p>`;
}

export function wrapEmailShell(bodyHtml: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#EDE6D8;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDE6D8;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:24px;">
          <span style="font-family:Georgia,serif;font-size:18px;color:#14192B;font-weight:600;">Reiniciar Sin Mapa</span>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:4px;padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#14192B;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#14192B;opacity:0.5;">
          Carla Montaño — Reiniciar Sin Mapa / NEXT YOU™
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Tiptap's raw output (h2, p, ul/li, blockquote, a, img) carries no inline
// styles, so it'd render with each email client's bare defaults. Inject brand
// styling onto the tags that need it — safe as simple string replacement
// since Tiptap's own output never sets a `style` attribute on these itself.
export function styleTiptapHtml(html: string): string {
  return html
    .replace(/<h2>/g, '<h2 style="font-family:Georgia,serif;font-size:22px;margin:28px 0 12px;color:#14192B;">')
    .replace(/<h3>/g, '<h3 style="font-family:Georgia,serif;font-size:19px;margin:24px 0 10px;color:#14192B;">')
    .replace(/<p>/g, '<p style="margin:0 0 18px;">')
    .replace(/<ul>/g, '<ul style="margin:0 0 18px;padding-left:22px;">')
    .replace(/<ol>/g, '<ol style="margin:0 0 18px;padding-left:22px;">')
    .replace(/<li>/g, '<li style="margin-bottom:8px;">')
    .replace(
      /<blockquote>/g,
      '<blockquote style="font-family:Georgia,serif;font-style:italic;color:#BE5A34;border-left:3px solid #BE5A34;padding-left:18px;margin:20px 0;">'
    )
    .replace(/<img /g, '<img style="max-width:100%;border-radius:4px;margin:12px 0;" ')
    .replace(/<a /g, '<a style="color:#BE5A34;" ');
}

export function textToEmailHtml(text: string): string {
  const paragraphs = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return wrapEmailShell(paragraphs.map(renderParagraph).join("\n"));
}

/** Strips tags for a plain-text fallback of Tiptap-authored HTML (Resend's `text` field). */
export function htmlToPlainTextFallback(html: string): string {
  return html
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
