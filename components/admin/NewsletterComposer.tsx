"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// Adds a `width` attribute (rendered as inline style) on top of the stock Image extension, so a
// selected image can be resized from the toolbar. Kept local to this composer rather than shared
// with the blog editor — the newsletter's HTML goes through styleTiptapHtml's email-safe styling,
// which the blog post editor doesn't need.
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes: { width?: string | null }) => {
          if (!attributes.width) return {};
          return { style: `width: ${attributes.width}` };
        },
      },
    };
  },
});

const IMAGE_SIZES: { label: string; value: string }[] = [
  { label: "S", value: "30%" },
  { label: "M", value: "50%" },
  { label: "L", value: "75%" },
  { label: "100%", value: "100%" },
];

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testError, setTestError] = useState("");
  const [testSent, setTestSent] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
  });

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo subir la imagen.");
      editor?.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  function handleAddLink() {
    if (!editor) return;
    const url = window.prompt("URL del enlace:");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function getComposedContent(): { subject: string; html: string } | null {
    const html = editor?.getHTML() ?? "";
    const isEmpty = !editor || editor.isEmpty;
    if (!subject.trim() || isEmpty) return null;
    return { subject: subject.trim(), html };
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
    if (!confirm(`¿Enviar este correo a los ${subscriberCount} suscriptores activos? Esta acción no se puede deshacer.`)) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composed),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar.");
      setResult(data);
      setSubject("");
      setTestSent(false);
      editor?.commands.setContent("<p></p>");
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
        Se envía a los {subscriberCount} contactos suscritos (no incluye a quienes se dieron de baja). Tu nombre, saludo y
        enlace de baja se agregan automáticamente.
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

        <div>
          <span className="text-sm font-semibold block mb-1.5">Contenido</span>
          {editor && (
            <div className="border border-[rgba(20,25,43,0.15)] rounded-[3px] bg-white">
              <div className="flex flex-wrap items-center gap-1 border-b border-[rgba(20,25,43,0.1)] p-2">
                <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                  B
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                  I
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  H2
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                  • Lista
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                  Cita
                </ToolbarButton>
                <ToolbarButton active={editor.isActive("link")} onClick={handleAddLink}>
                  Enlace
                </ToolbarButton>
                <ToolbarButton active={false} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? "Subiendo..." : "Imagen"}
                </ToolbarButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />

                <span className="w-px h-5 bg-[rgba(20,25,43,0.15)] mx-1" />

                <ToolbarButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                  ⇤
                </ToolbarButton>
                <ToolbarButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                  ⇹
                </ToolbarButton>
                <ToolbarButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                  ⇥
                </ToolbarButton>

                {editor.isActive("image") && (
                  <>
                    <span className="w-px h-5 bg-[rgba(20,25,43,0.15)] mx-1" />
                    <span className="text-[10px] font-mono opacity-50 mr-0.5">Tamaño</span>
                    {IMAGE_SIZES.map((size) => (
                      <ToolbarButton
                        key={size.value}
                        active={editor.getAttributes("image").width === size.value}
                        onClick={() => editor.chain().focus().updateAttributes("image", { width: size.value }).run()}
                      >
                        {size.label}
                      </ToolbarButton>
                    ))}
                  </>
                )}
              </div>
              <EditorContent editor={editor} className="prose-post px-4 py-3 min-h-[220px] [&_.ProseMirror]:outline-none" />
            </div>
          )}
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}
        {result && (
          <p className="text-sage text-sm">
            Enviado a {result.sent} de {result.total} suscriptores.
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
          {sending ? "Enviando..." : `Enviar a ${subscriberCount} suscriptores`}
        </button>
      </div>
    </div>
  );
}

function ToolbarButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-mono px-2.5 py-1.5 rounded-[3px] ${active ? "bg-ink text-paper" : "bg-paper-soft text-ink"}`}
    >
      {children}
    </button>
  );
}
