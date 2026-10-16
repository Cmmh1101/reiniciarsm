"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions, RichToolbar } from "@/components/admin/richText";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";
import { pillarLabel } from "@/lib/taxonomy";
import { PILLARS, ARC_PHASES, ARC_PHASE_NOT_APPLICABLE } from "@/lib/taxonomy";
import { slugify } from "@/lib/slug";
import type { BlogPost } from "@/lib/posts";

interface Props {
  post?: BlogPost;
}

type Lang = "en" | "es";
interface LangFields {
  title: string;
  excerpt: string;
  content: string;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const { locale, t: all } = useAdminI18n();
  const t = all.blog.editor;
  const LANG_LABEL: Record<Lang, string> = { en: all.common.english, es: all.common.spanish };
  const isEditing = !!post;

  // Each language keeps its own title, excerpt and body; switching tabs swaps them in and out of the editor.
  // The original columns hold Spanish; a post written only in English starts on the English tab.
  const [fields, setFields] = useState<Record<Lang, LangFields>>({
    es: { title: post?.title ?? "", excerpt: post?.excerpt ?? "", content: post?.content ?? "" },
    en: { title: post?.title_en ?? "", excerpt: post?.excerpt_en ?? "", content: post?.content_en ?? "" },
  });
  const [lang, setLang] = useState<Lang>(post && !post.title && post.title_en ? "en" : post ? "es" : "en");

  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [pillar, setPillar] = useState(post?.pillar ?? PILLARS[0]);
  const [arcPhase, setArcPhase] = useState(post?.arc_phase ?? ARC_PHASE_NOT_APPLICABLE);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image_url ?? "");
  const [readingTime, setReadingTime] = useState(post?.reading_time_minutes?.toString() ?? "");
  const [published, setPublished] = useState(!!post?.published_at);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: buildExtensions(),
    content: fields[lang].content || "<p></p>",
    immediatelyRender: false,
  });

  /** Fields with whatever is currently in the editor folded into the active language. */
  function currentFields(): Record<Lang, LangFields> {
    return { ...fields, [lang]: { ...fields[lang], content: editor ? editor.getHTML() : fields[lang].content } };
  }

  function switchLang(next: Lang) {
    if (next === lang) return;
    const saved = currentFields();
    setFields(saved);
    setLang(next);
    editor?.commands.setContent(saved[next].content || "<p></p>");
  }

  function updateField(field: "title" | "excerpt", value: string) {
    setFields((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
    // The URL follows the first title typed (English preferred), until the slug is edited by hand.
    if (field === "title" && !slugTouched && (lang === "en" || !fields.en.title)) setSlug(slugify(value));
  }

  const isEmpty = (l: Lang) => !fields[l].title.trim() && (l === lang ? !editor || editor.isEmpty : !fields[l].content.replace(/<[^>]*>/g, "").trim());

  async function handleSave() {
    setError("");
    const saved = currentFields();
    const writtenIn = (["en", "es"] as Lang[]).filter((l) => saved[l].title.trim() && saved[l].content.replace(/<[^>]*>/g, "").trim());
    if (!slug.trim()) {
      setError(t.errorSlug);
      return;
    }
    if (writtenIn.length === 0) {
      setError(t.errorContent);
      return;
    }

    setSaving(true);
    const payload = {
      title_es: saved.es.title.trim(),
      excerpt_es: saved.es.excerpt.trim(),
      content_es: saved.es.content,
      title_en: saved.en.title.trim(),
      excerpt_en: saved.en.excerpt.trim(),
      content_en: saved.en.content,
      slug: slug.trim(),
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
      if (!res.ok) throw new Error(data.error ?? t.errorSave);
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t.errorSave);
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing) return;
    if (!confirm(fmt(t.confirmDelete, { title: post!.title || post!.title_en || "" }))) return;

    const res = await fetch(`/api/admin/blog/${post!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      setError(t.errorDelete);
    }
  }

  return (
    <div className="p-10 max-w-3xl">
      <h1 className="font-display text-2xl mb-6">{isEditing ? t.editTitle : t.newTitle}</h1>

      {error && <p className="text-clay text-sm mb-4">{error}</p>}

      <div className="flex flex-col gap-4 mb-6">
        <div role="tablist" aria-label={t.languageTabs} className="flex gap-2">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => switchLang(l)}
              className={`font-mono text-xs px-4 py-2.5 rounded-[3px] border ${
                lang === l ? "bg-ink text-paper border-ink" : "bg-paper-soft border-[rgba(20,25,43,0.15)]"
              }`}
            >
              {LANG_LABEL[l]}
              {l !== lang && isEmpty(l) && <span className="opacity-60"> {fmt(t.emptyUse, { other: l === "es" ? LANG_LABEL.en : LANG_LABEL.es })}</span>}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{fmt(t.title, { lang: LANG_LABEL[lang] })}</span>
          <input
            value={fields[lang].title}
            onChange={(e) => updateField("title", e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.slug}</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="font-mono text-sm px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
          <span className="font-mono text-[11px] font-normal opacity-60">/resources/{slug || "…"} · /recursos/{slug || "…"}</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{fmt(t.excerpt, { lang: LANG_LABEL[lang] })}</span>
          <textarea
            value={fields[lang].excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={2}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.pillar}</span>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
              className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            >
              {PILLARS.map((p) => (
                <option key={p} value={p}>
                  {pillarLabel(p, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            <span>{t.arcPhase}</span>
            <select
              value={arcPhase}
              onChange={(e) => setArcPhase(e.target.value)}
              className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
            >
              <option value={ARC_PHASE_NOT_APPLICABLE}>{all.blog.arcPhases[ARC_PHASE_NOT_APPLICABLE] ?? ARC_PHASE_NOT_APPLICABLE}</option>
              {ARC_PHASES.map((p) => (
                <option key={all.blog.arcPhases[p] ?? p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ImageUploadField label={t.featuredImage} value={featuredImageUrl} onChange={setFeaturedImageUrl} />

        <label className="flex flex-col gap-1.5 text-sm font-semibold max-w-[200px]">
          <span>{t.readingTime}</span>
          <input
            type="number"
            min={1}
            value={readingTime}
            onChange={(e) => setReadingTime(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          />
        </label>
      </div>

      <div className="mb-6">
        <span className="text-sm font-semibold block mb-1.5">{fmt(t.content, { lang: LANG_LABEL[lang] })}</span>
        {editor && (
          <div className="border border-[rgba(20,25,43,0.15)] rounded-[3px] bg-white">
            <RichToolbar editor={editor} />
            <EditorContent editor={editor} className="prose-post px-4 py-3 min-h-[300px] [&_.ProseMirror]:outline-none" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 mb-6 text-sm font-semibold">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        {t.published}
      </label>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] bg-clay text-white disabled:opacity-60"
        >
          {saving ? t.saving : t.save}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] border border-clay text-clay"
          >
            {t.delete}
          </button>
        )}
      </div>
    </div>
  );
}
