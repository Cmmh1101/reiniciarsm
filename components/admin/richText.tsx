"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { useAdminI18n } from "@/components/admin/AdminI18n";

// Images need their own width/align/href handling — none of this works out of the box:
// - TextAlign only targets text-bearing nodes (paragraph/heading); an image is its own block
//   node with no text content for text-align to apply to.
// - The Link mark can't attach to a non-text node like an image, so "select image, click Link"
//   silently does nothing.
// Shared by the newsletter composer and the blog post editor. (The newsletter's HTML additionally goes
// through styleTiptapHtml's email-safe styling.)
const ALIGN_STYLES: Record<string, string> = {
  left: "display:block;margin:16px auto 16px 0;",
  center: "display:block;margin:16px auto;",
  right: "display:block;margin:16px 0 16px auto;",
};

export const ResizableImage = Image.extend({
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
      align: {
        default: null,
        renderHTML: (attributes: { align?: string | null }) => {
          if (!attributes.align || !ALIGN_STYLES[attributes.align]) return {};
          return { style: ALIGN_STYLES[attributes.align] };
        },
      },
      href: {
        default: null,
        parseHTML: (element: HTMLElement) => element.closest("a")?.getAttribute("href") ?? null,
        renderHTML: () => ({}),
      },
    };
  },
  // Used only for HTML export (getHTML()) — ProseMirror serializes from the schema's toDOM
  // regardless of what addNodeView() below renders, so the <a> wrap only ever reaches the actual
  // email HTML, never the live editing surface.
  renderHTML({ node, HTMLAttributes }) {
    const merged = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    const href = node.attrs.href as string | null;
    if (href) {
      return ["a", { href, target: "_blank", rel: "noopener noreferrer" }, ["img", merged]];
    }
    return ["img", merged];
  },
  // The live editing DOM must stay a single plain <img> — image is a leaf/atom node, and wrapping
  // its rendered DOM in an extra <a> (as renderHTML does for export) breaks ProseMirror's
  // position mapping around it: the image becomes unselectable/unable to navigate past, typing
  // and Enter stop working, and clicking away no longer deselects it. A dedicated NodeView keeps
  // editing visuals (width/align, a dashed outline standing in for the link) independent of the
  // exported markup.
  addNodeView() {
    return ({ node }) => {
      const img = document.createElement("img");
      const apply = (n: typeof node) => {
        img.setAttribute("src", n.attrs.src);
        if (n.attrs.alt) img.setAttribute("alt", n.attrs.alt);
        else img.removeAttribute("alt");

        let style = "";
        if (n.attrs.width) style += `width:${n.attrs.width};`;
        if (n.attrs.align && ALIGN_STYLES[n.attrs.align]) style += ALIGN_STYLES[n.attrs.align];
        if (n.attrs.href) {
          style += "outline:2px dashed #BE5A34;outline-offset:2px;";
          img.setAttribute("title", `Enlaza a: ${n.attrs.href}`);
        } else if (n.attrs.title) {
          img.setAttribute("title", n.attrs.title);
        } else {
          img.removeAttribute("title");
        }
        img.setAttribute("style", style);
      };
      apply(node);
      return {
        dom: img,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          apply(updatedNode as typeof node);
          return true;
        },
      };
    };
  },
});

export const IMAGE_SIZES: { label: string; value: string }[] = [
  { label: "S", value: "30%" },
  { label: "M", value: "50%" },
  { label: "L", value: "75%" },
  { label: "100%", value: "100%" },
];

export const IMAGE_ALIGNS: { label: string; value: string }[] = [
  { label: "⇤", value: "left" },
  { label: "⇹", value: "center" },
  { label: "⇥", value: "right" },
];


/** Extensions shared by every admin rich-text editor (blog posts, newsletter). */
export function buildExtensions() {
  return [StarterKit, ResizableImage, Link.configure({ openOnClick: false }), TextAlign.configure({ types: ["heading", "paragraph"] })];
}

export function ToolbarButton({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`text-xs font-mono px-2.5 py-1.5 rounded-[3px] ${active ? "bg-ink text-paper" : "bg-paper-soft text-ink"}`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="w-px h-5 bg-[rgba(20,25,43,0.15)] mx-1" />;

/**
 * Formatting toolbar: text styles, links, image upload, text alignment and — when an image is selected —
 * its size, alignment, alt text and link. `extra` slots in editor-specific buttons (e.g. the newsletter's
 * "+ Nombre").
 */
export function RichToolbar({ editor, extra }: { editor: Editor; extra?: React.ReactNode }) {
  const { t: all } = useAdminI18n();
  const t = all.editor;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.uploadFailed);
      // New images start at full width, centered — adjust with the size/align buttons once selected.
      editor.chain().focus().setImage({ src: data.url }).updateAttributes("image", { width: "100%", align: "center" }).run();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  function handleAddLink() {
    const url = window.prompt(t.linkPrompt);
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function handleImageLink() {
    const current = (editor.getAttributes("image").href as string | null) ?? "";
    const url = window.prompt(t.imageLinkPrompt, current);
    if (url === null) return;
    editor.chain().focus().updateAttributes("image", { href: url.trim() || null }).run();
  }

  function handleImageAlt() {
    const current = (editor.getAttributes("image").alt as string | null) ?? "";
    const alt = window.prompt(t.altPrompt, current);
    if (alt === null) return;
    editor.chain().focus().updateAttributes("image", { alt: alt.trim() || null }).run();
  }

  return (
    <div className="border-b border-[rgba(20,25,43,0.1)] p-2">
      <div className="flex flex-wrap items-center gap-1">
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
          {t.bullets}
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          {t.numbered}
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          {t.quote}
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={handleAddLink}>
          {t.link}
        </ToolbarButton>
        {extra}
        <ToolbarButton active={false} onClick={() => fileInputRef.current?.click()}>
          {uploading ? t.uploading : t.image}
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

        <Divider />
        <span className="text-[10px] font-mono opacity-50 mr-0.5">{t.textGroup}</span>
        <ToolbarButton title={t.alignLeft} active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          ⇤
        </ToolbarButton>
        <ToolbarButton title={t.alignCenter} active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          ⇹
        </ToolbarButton>
        <ToolbarButton title={t.alignRight} active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          ⇥
        </ToolbarButton>
      </div>

      {editor.isActive("image") && (
        <div className="flex flex-wrap items-center gap-1 mt-2 pt-2 border-t border-[rgba(20,25,43,0.08)]">
          <span className="text-[10px] font-mono opacity-50 mr-0.5">{t.imageGroup}</span>
          {IMAGE_SIZES.map((size) => (
            <ToolbarButton
              key={size.value}
              active={editor.getAttributes("image").width === size.value}
              onClick={() => editor.chain().focus().updateAttributes("image", { width: size.value }).run()}
            >
              {size.label}
            </ToolbarButton>
          ))}
          <span className="text-[10px] font-mono opacity-50 mx-0.5">{t.imageAlign}</span>
          {IMAGE_ALIGNS.map((align) => (
            <ToolbarButton
              key={align.value}
              active={editor.getAttributes("image").align === align.value}
              onClick={() => editor.chain().focus().updateAttributes("image", { align: align.value }).run()}
            >
              {align.label}
            </ToolbarButton>
          ))}
          <ToolbarButton active={!!editor.getAttributes("image").alt} onClick={handleImageAlt}>
            {t.altText}
          </ToolbarButton>
          <ToolbarButton active={!!editor.getAttributes("image").href} onClick={handleImageLink}>
            {t.imageLink}
          </ToolbarButton>
          <ToolbarButton active={false} onClick={() => editor.chain().focus().deleteSelection().run()}>
            {t.removeImage}
          </ToolbarButton>
        </div>
      )}
      {error && <p className="text-clay text-xs mt-2">{error}</p>}
    </div>
  );
}
