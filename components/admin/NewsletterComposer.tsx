"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import { buildExtensions, RichToolbar, ToolbarButton } from "@/components/admin/richText";
import { useAdminI18n } from "@/components/admin/AdminI18n";
import { fmt } from "@/lib/admin/dictionary";
import { NEWSLETTER_AUDIENCES, NEWSLETTER_LANGUAGES, type NewsletterAudience, type NewsletterLanguage } from "@/lib/newsletterAudience";

// The greeting the editor starts with — in the language of the email, not of the admin panel.
// {{Nombre}} is the token the server replaces with each contact's name.
const GREETINGS = {
  en: "<p>Hi {{Nombre}},</p><p></p>",
  es: "<p>Hola {{Nombre}},</p><p></p>",
};
const isDefaultGreeting = (html: string) => Object.values(GREETINGS).includes(html);

export default function NewsletterComposer({ counts }: { counts: Record<NewsletterLanguage, Record<NewsletterAudience, number>> }) {
  const router = useRouter();
  const { locale, t: all } = useAdminI18n();
  const t = all.newsletter.composer;
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
    // Starts with an editable greeting — move or delete it like any other line; {{Nombre}} works the
    // same way anywhere else in the body.
    content: GREETINGS[locale],
    immediatelyRender: false,
  });

  function handleLanguageChange(next: NewsletterLanguage) {
    setLanguage(next);
    // If the greeting is still the untouched default, match it to the language being written to.
    if (editor && next !== "all" && isDefaultGreeting(editor.getHTML())) editor.commands.setContent(GREETINGS[next]);
  }

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
      setTestError(t.testNeedContent);
      return;
    }
    if (!testEmail.trim()) {
      setTestError(t.testNeedEmail);
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
      if (!res.ok) throw new Error(data.error ?? t.testFailed);
      setTestSent(true);
    } catch (err) {
      setTestError(err instanceof Error ? err.message : t.testFailed);
    } finally {
      setSendingTest(false);
    }
  }

  async function handleSend() {
    setError("");
    setResult(null);

    const composed = getComposedContent();
    if (!composed) {
      setError(t.needContent);
      return;
    }
    if (!confirm(fmt(t.confirm, { count: recipientCount, audience: all.newsletter.audiences[audience].toLowerCase(), language: all.newsletter.languages[language] }))) {
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
      if (!res.ok) throw new Error(data.error ?? t.failed);
      setResult(data);
      setSubject("");
      setPreheader("");
      setTestSent(false);
      editor?.commands.setContent(GREETINGS[language === "all" ? locale : language]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-[rgba(20,25,43,0.12)] rounded-[3px] p-6 mb-8 max-w-2xl">
      <h2 className="font-semibold mb-1">{t.title}</h2>
      <p className="text-xs opacity-70 mb-4">{t.help}</p>

      <div className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.subject}</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>
            {t.preheader} <span className="font-normal opacity-70">{t.preheaderOptional}</span>
          </span>
          <input
            value={preheader}
            onChange={(e) => setPreheader(e.target.value)}
            maxLength={140}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
          />
          <span className="text-xs font-normal opacity-70">
            {t.preheaderHelp} · {preheader.length}/140
          </span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.contactLanguage}</span>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as NewsletterLanguage)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          >
            {NEWSLETTER_LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {all.newsletter.languages[l]} ({counts[l].all})
              </option>
            ))}
          </select>
          <span className="text-xs font-normal opacity-70">{t.contactLanguageHelp}</span>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          <span>{t.sendTo}</span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as NewsletterAudience)}
            className="font-body text-base px-3.5 py-3 rounded-[3px] border border-[rgba(20,25,43,0.15)] bg-white"
          >
            {NEWSLETTER_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {all.newsletter.audiences[a]} ({audienceCounts[a]})
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-sm font-semibold block mb-1.5">{t.content}</span>
          {editor && (
            <div className="border border-[rgba(20,25,43,0.15)] rounded-[3px] bg-white">
              <RichToolbar
                editor={editor}
                extra={
                  <ToolbarButton active={false} onClick={handleInsertNameToken}>
                    {t.nameButton}
                  </ToolbarButton>
                }
              />
              <EditorContent editor={editor} className="prose-post px-4 py-3 min-h-[220px] [&_.ProseMirror]:outline-none" />
            </div>
          )}
          <p className="text-xs opacity-70 mt-1.5">{t.nameHelp}</p>
        </div>

        {error && <p className="text-clay-deep text-sm">{error}</p>}
        {result && <p className="text-sage-deep text-sm">{fmt(t.sentResult, { sent: result.sent, total: result.total })}</p>}

        <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-[rgba(20,25,43,0.1)]">
          <label className="flex flex-col gap-1.5 text-sm font-semibold flex-1 min-w-[220px]">
            <span>{t.testTo}</span>
            <input
              type="email"
              placeholder={t.testPlaceholder}
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="font-body text-sm px-3.5 py-2.5 rounded-[3px] border border-[rgba(20,25,43,0.15)]"
            />
          </label>
          <button
            type="button"
            onClick={handleSendTest}
            disabled={sendingTest}
            className="font-body font-semibold text-sm px-4 py-2.5 rounded-[3px] border border-ink disabled:opacity-70"
          >
            {sendingTest ? t.sendingTest : t.sendTest}
          </button>
        </div>
        {testError && <p className="text-clay-deep text-sm">{testError}</p>}
        {testSent && <p className="text-sage-deep text-sm">{fmt(t.testSent, { email: testEmail })}</p>}

        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="font-body font-semibold text-sm px-5 py-2.5 rounded-[3px] bg-clay-deep text-white self-start disabled:opacity-70"
        >
          {sending ? t.sending : fmt(t.send, { count: recipientCount })}
        </button>
      </div>
    </div>
  );
}
