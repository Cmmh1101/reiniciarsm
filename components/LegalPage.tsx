import type { Dictionary } from "@/lib/i18n/dictionary";

type LegalDoc = Dictionary["legal"]["privacy"];

export default function LegalPage({ doc, updated, eyebrow }: { doc: LegalDoc; updated: string; eyebrow: string }) {
  return (
    <main>
      <header className="bg-ink text-paper px-page pt-[70px] pb-[50px]">
        <p className="font-mono text-xs uppercase tracking-widest text-clay-soft mb-4">{eyebrow}</p>
        <h1 className="font-display text-[clamp(28px,4vw,42px)] max-w-[24ch] mb-4 leading-[1.1]">{doc.title}</h1>
        {updated && <p className="font-mono text-xs opacity-70">{updated}</p>}
      </header>

      <article className="max-w-[680px] mx-auto px-page py-[70px] prose-post">
        <p>{doc.intro}</p>
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
