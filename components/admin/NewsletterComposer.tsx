"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions, RichToolbar, ToolbarButton } from "@/components/admin/richText";
import {
  AUDIENCE_LABELS,
  LANGUAGE_LABELS,
  NEWSLETTER_AUDIENCES,
  NEWSLETTER_LANGUAGES,
  type NewsletterAudience,
  type NewsletterLanguage,
} from "@/lib/newsletterAudience";

export default function NewsletterComposer({ counts }: { counts: Record<NewsletterLanguage, Record<NewsletterAudience, number>> }) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [audience, setAudience] = useState<NewsletterAudience>("all");
  const [language, setLanguage] = useState<NewsletterLanguage>("all");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testError, setTestError] = useState("");
  const [testSent, setTestSent] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const audienceCounts = counts[language];
  const recipientCount = audienceCounts[audience];

  const editor = useEditor({
    extensions: buildExtensions(),
    // Starts with an editable greeting rather than a fixed one the server used to prepend — move
    // or delete it like any other line; {{Nombre}} works the same way anywhere else in the body.
    content: "<p>Hola {{Nombre}},</p><p></p>",
    immediatelyRender: false,
  });

  function handleInsertNameToken() {
    editor?.chain().focus().insertContent("{{Nombre}}").run();
  }

  function getComposedContent(): { subject: string; preheader: string; html: string } | null {
    const html = editor?.getHTML() ?? "";
    const isEmpty = !editor || editor.isEmpty;
    if (!subject.trim() || isEmpty) return null;
    return { subject: subject.trim(), preheader: preheader.trim(), html };
  }

  async function handleSendTest() {
    setTestError("");
    setTestSent(false);

    const composed = getComposedContent();
    if (!composed) {
      setTestError("Escribe un asunto y contenido antes de enviar la prueba.");
      return;
    }
    if (!testEmail.trim()) {
      setTestError("Ingresa un correo para recibir la prueba.");
      return;
    }

    setSendingTest(true);
    try {
      const res = await fetch("/api/admin/newsletter-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...composed, testEmail: testEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar la prueba.");
      setTestSent(true);
    } catch (err) {
      setTestError(err instanceof Error ? err.message : "No se pudo enviar la prueba.");
    } finally {
      setSendingTest(false);
    }
  }

  async function handleSend() {
    setError("");
    setResult(null);

    const composed = getComposedContent();
    if (!composed) {
      setError("Escribe un asunto y contenido.");
      return;
    }
    if (
      !confirm(
        `¿Enviar este correo a ${recipientCount} contactos (${AUDIENCE_LABELS[audience].toLowerCase()} · ${LANGUAGE_LABELS[language]})? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...composed, audience, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar.");
      setResult(data);
      setSubject("");
      setPreheader("");
      setTestSent(false);
      editor?.commands.setContent("<p>Hola {{Nombre}},</p><p></p>");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-2xl">
      <h2 className="font-semibold mb-1">Escribir newsletter</h2>
      <p className="text-xs opacity-60 mb-4">
        Elige a quién llega abajo — nunca incluye a quienes se dieron de baja. El saludo ya viene escrito en el editor
        (bórralo o muévelo si no lo quieres ahí); tu firma y el enlace de baja se agregan automáticamente al final.
      </p>

      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Asunto</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>
            Preheader <span className="font-normal opacity-60">(texto de vista previa, opcional)</span>
          </span>
          <input
            value={preheader}
            onChange={(e) => setPreheader(e.target.value)}
            maxLength={140}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
          <span className="text-xs font-normal opacity-60">
            Es la línea gris que se ve junto al asunto en la bandeja de entrada. Funciona mejor entre 40 y 100 caracteres ·{" "}
            {preheader.length}/140
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Idioma de los contactos</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as NewsletterLanguage)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          >
            {NEWSLETTER_LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {LANGUAGE_LABELS[l]} ({counts[l].all})
              </option>
            ))}
          </select>
          <span className="text-xs font-normal opacity-60">Escribe el correo en el idioma que elijas aquí. El enlace de baja se adapta al idioma de cada contacto.</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Enviar a</span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as NewsletterAudience)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          >
            {NEWSLETTER_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {AUDIENCE_LABELS[a]} ({audienceCounts[a]})
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-sm font-semibold block mb-1.5">Contenido</span>
          {editor && (
            <div className="border border-[rgba(20,25,43,0.15)] rounded-[3px] bg-white">
              <RichToolbar
                editor={editor}
                extra={
                  <ToolbarButton active={false} onClick={handleInsertNameToken}>
                    + Nombre
                  </ToolbarButton>
                }
              />
              <EditorContent editor={editor} className="prose-post px-4 py-3 min-h-[220px] [&_.ProseMirror]:outline-none" />
            </div>
          )}
          <p className="text-xs opacity-50 mt-1.5">
            &quot;+ Nombre&quot; inserta {"{{Nombre}}"} donde esté el cursor — al enviar, se reemplaza por el nombre de
            cada contacto (o &quot;amigo/a&quot; si no tiene uno registrado).
          </p>
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}
        {result && (
          <p className="text-sage text-sm">
            Enviado a {result.sent} de {result.total} contactos.
          </p>
        )}

        <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-[rgba(20,25,43,0.1)]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold flex-1 min-w-[220px]">
            <span>Enviar prueba a</span>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="font-body text-sm px-3.5 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <button
            type="button"
            onClick={handleSendTest}
            disabled={sendingTest}
            className="font-body font-semibold text-sm px-4 py-2.5 rounded-[3px] border border-ink disabled:opacity-60"
          >
            {sendingTest ? "Enviando prueba..." : "Enviar prueba"}
          </button>
        </div>
        {testError && <p className="text-clay text-sm">{testError}</p>}
        {testSent && <p className="text-sage text-sm">Prueba enviada a {testEmail}. Revisa tu bandeja.</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay text-white self-start disabled:opacity-60"
        >
          {sending ? "Enviando..." : `Enviar a ${recipientCount} contactos`}
        </button>
      </div>
    </div>
  );
}
