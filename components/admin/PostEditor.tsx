"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions, RichToolbar } from "@/components/admin/richText";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";
import { AUDIENCE_TAGS, BLOG_CATEGORIES, MAX_TAGS, categoryKey, normalizeTag } from "@/lib/taxonomy";
import { slugify } from "@/lib/slug";
import type { BlogPost } from "@/lib/posts";

interface Props {
  post?: BlogPost;
  /** Tags already used on other posts, offered as suggestions. */
  knownTags?: string[];
}

type Lang = "en" | "es";
interface LangFields {
  title: string;
  excerpt: string;
  content: string;
}

export default function PostEditor({ post, knownTags = [] }: Props) {
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
  // Posts saved before the categories existed hold an old pillar name; categoryKey maps it to the closest category.
  const [category, setCategory] = useState(post ? categoryKey(post.pillar) : BLOG_CATEGORIES[0].key);
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
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

  function addTag(raw: string) {
    const tag = normalizeTag(raw);
    setTagInput("");
    if (tag && !tags.includes(tag) && tags.length < MAX_TAGS) setTags([...tags, tag]);
  }

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((x) => x !== tag) : prev.length < MAX_TAGS ? [...prev, tag] : prev));
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
      pillar: category,
      tags,
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

      {error && <p className="text-clay-deep text-sm mb-4">{error}</p>}

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
              {l !== lang && isEmpty(l) && <span className="opacity-70"> {fmt(t.emptyUse, { other: l === "es" ? LANG_LABEL.en : LANG_LABEL.es })}</span>}
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
          <span className="font-mono text-[11px] font-normal opacity-70">/resources/{slug || "…"} · /recursos/{slug || "…"}</span>
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

        <label className="flex flex-col gap-1.5 text-sm font-semibold max-w-[320px]">
          <span>{t.category}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          >
            {BLOG_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c[locale]}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="text-sm font-semibold mb-1.5">{t.audience}</legend>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                aria-pressed={tags.includes(tag)}
                onClick={() => toggleTag(tag)}
                className={`font-mono text-xs uppercase tracking-wide px-3.5 py-2 rounded-full border ${
                  tags.includes(tag) ? "bg-ink text-paper border-ink" : "border-[rgba(20,25,43,0.25)] bg-white"
                }`}
              >
                {t.audienceLabels[tag] ?? tag}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="post-tag-input" className="text-sm font-semibold">
            {t.tags}
          </label>
          <p className="text-sm opacity-70 max-w-[60ch]">{t.tagsHint}</p>
          {tags.filter((tag) => !(AUDIENCE_TAGS as readonly string[]).includes(tag)).length > 0 && (
            <ul className="flex flex-wrap gap-2 my-1">
              {tags
                .filter((tag) => !(AUDIENCE_TAGS as readonly string[]).includes(tag))
                .map((tag) => (
                  <li key={tag} className="flex items-center gap-1.5 font-mono text-xs bg-white border border-[rgba(20,25,43,0.2)] rounded-full pl-3 pr-1.5 py-1">
                    {tag}
                    <button type="button" aria-label={fmt(t.removeTag, { tag })} onClick={() => toggleTag(tag)} className="w-5 h-5 rounded-full hover:bg-[rgba(20,25,43,0.1)]">
                      ×
                    </button>
                  </li>
                ))}
            </ul>
          )}
          <input
            id="post-tag-input"
            list="post-known-tags"
            value={tagInput}
            placeholder={t.tagsPlaceholder}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            onBlur={() => tagInput.trim() && addTag(tagInput)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white max-w-[320px]"
          />
          <datalist id="post-known-tags">
            {knownTags.filter((tag) => !tags.includes(tag)).map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
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
          className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] bg-clay-deep text-white disabled:opacity-70"
        >
          {saving ? t.saving : t.save}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="font-body font-semibold text-[15px] px-6 py-3 rounded-[3px] border border-clay text-clay-deep"
          >
            {t.delete}
          </button>
        )}
      </div>
    </div>
  );
}
