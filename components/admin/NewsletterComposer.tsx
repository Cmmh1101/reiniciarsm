"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ sent: number; total: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
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

  async function handleSend() {
    setError("");
    setResult(null);

    const html = editor?.getHTML() ?? "";
    const isEmpty = !editor || editor.isEmpty;
    if (!subject.trim() || isEmpty) {
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
        body: JSON.stringify({ subject: subject.trim(), html }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar.");
      setResult(data);
      setSubject("");
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
              <div className="flex flex-wrap gap-1 border-b border-[rgba(20,25,43,0.1)] p-2">
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
