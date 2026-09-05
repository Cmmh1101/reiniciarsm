"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PILLARS, ARC_PHASES, ARC_PHASE_NOT_APPLICABLE } from "@/lib/taxonomy";
import { slugify } from "@/lib/slug";
import type { BlogPost } from "@/lib/posts";

interface Props {
  post?: BlogPost;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [pillar, setPillar] = useState(post?.pillar ?? PILLARS[0]);
  const [arcPhase, setArcPhase] = useState(post?.arc_phase ?? ARC_PHASE_NOT_APPLICABLE);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image_url ?? "");
  const [readingTime, setReadingTime] = useState(post?.reading_time_minutes?.toString() ?? "");
  const [published, setPublished] = useState(!!post?.published_at);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.content ?? "<p></p>",
    immediatelyRender: false,
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSave() {
    setError("");
    if (!title.trim() || !slug.trim() || !editor) {
      setError("Título y slug son requeridos.");
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: editor.getHTML(),
      pillar,
      arc_phase: arcPhase === ARC_PHASE_NOT_APPLICABLE ? null : arcPhase,
      featured_image_url: featuredImageUrl.trim(),
      reading_time_minutes: readingTime ? Number(readingTime) : null,
      published,
    };

    try {
      const res = await fetch(isEditing ? `/api/admin/blog/${post!.id}` : "/api/admin/blog", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar.");
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing) return;
    if (!confirm(`¿Eliminar "${post!.title}"? Esta acción no se puede deshacer.`)) return;

    const res = await fetch(`/api/admin/blog/${post!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError("No se pudo eliminar el post.");
    }
  }

  return (
    <div className="p-10 max-w-3xl">
      <h1 className="font-display text-2xl mb-6">{isEditing ? "Editar post" : "Nuevo post"}</h1>

      {error && <p className="text-clay text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4 mb-6">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Título</span>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Slug</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="font-mono text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>Extracto</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Pilar</span>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
              className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            >
              {PILLARS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Fase del arco</span>
            <select
              value={arcPhase}
              onChange={(e) => setArcPhase(e.target.value)}
              className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            >
              <option value={ARC_PHASE_NOT_APPLICABLE}>{ARC_PHASE_NOT_APPLICABLE}</option>
              {ARC_PHASES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Imagen destacada (URL)</span>
            <input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="font-body text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>Minutos de lectura</span>
            <input
              type="number"
              min={1}
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            />
          </label>
        </div>
      </div>

      <div className="mb-6">
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
              <ToolbarButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                H3
              </ToolbarButton>
              <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                • Lista
              </ToolbarButton>
              <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                1. Lista
              </ToolbarButton>
              <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                Cita
              </ToolbarButton>
            </div>
            <EditorContent editor={editor} className="prose-post px-4 py-3 min-h-[300px] [&_.ProseMirror]:outline-none" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 mb-6 text-sm font-semibold">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publicado
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] bg-clay text-white disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] border border-clay text-clay"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
