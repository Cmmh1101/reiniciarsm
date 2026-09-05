# Carla Montaño — Reiniciar Sin Mapa / NEXT YOU™

Migration of carlamontano.io from WordPress + Bricks + FluentCRM to a self-owned Next.js stack. See [`docs/plan-migracion-stack-tecnico.md`](docs/plan-migracion-stack-tecnico.md) (architecture, data model, n8n flows, phased roadmap) and [`docs/CM-plan-admin-crm-analytics.md`](docs/CM-plan-admin-crm-analytics.md) (admin panel, CRM, analytics, booking — supersedes the simpler CRM tables in the first doc).

Design reference (build to these, don't reinterpret): [`docs/CM-homepage-carlamontano-reiniciar-sin-mapa.html`](docs/CM-homepage-carlamontano-reiniciar-sin-mapa.html), [`docs/CM-pagina-mentorias.html`](docs/CM-pagina-mentorias.html), [`docs/CM-blog-archivo.html`](docs/CM-blog-archivo.html), [`docs/CM-blog-post-individual.html`](docs/CM-blog-post-individual.html).

Content ready to migrate: [`docs/CM-3-blog-posts-nuevos.md`](docs/CM-3-blog-posts-nuevos.md) (blog posts), [`docs/CM-diagnostico-quiz-v3-completo.txt`](docs/CM-diagnostico-quiz-v3-completo.txt) + [`docs/CM-quiz-style-final.txt`](docs/CM-quiz-style-final.txt) (Diagnóstico Next You copy/scoring/archetypes), [`docs/CM-secuencia-bienvenida-newsletter.md`](docs/CM-secuencia-bienvenida-newsletter.md) (newsletter email sequence).

**Note on `docs/CM-prompt-agente-codigo-diagnostico-wordpress-fluentcrm.md`**: this is an earlier, superseded approach that builds the quiz inside WordPress/Bricks/FluentCRM instead of migrating to Next.js. Kept for reference only — reuse its quiz content (questions, scoring, archetypes, tag names) when building `/diagnostico-next-you`, but not its WordPress-based architecture.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS — brand tokens in `tailwind.config.ts` / `app/globals.css` (ink `#14192B`, paper `#EDE6D8`, clay `#BE5A34`, sage `#6E7F5C`, gold `#C9A227`; Fraunces/Inter/IBM Plex Mono)
- Supabase (contacts + contact_events CRM, blog posts, mentoría slots/bookings — server-side only via service role key)
- Resend (transactional email)
- Stripe (Mentoría 1:1 payments — Fase 3)
- n8n (automation: email sequences, Google Calendar sync, GA4 sync — replaces FluentCRM)
- Deployed on Netlify

This scaffold was bootstrapped from the config/auth patterns proven in the `Montano-system-launch` repo (a different, unrelated site) — single-admin Supabase Auth gate via `middleware.ts`, server-only service-role client. Everything content-, design-, and data-model-specific (colors, pages, CRM schema, blog editor) is built fresh for this project per the plan docs above.

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`, then:

```bash
npm run dev
```

## Status

Repo skeleton only — configs, Tailwind theme, Supabase client helpers, and the single-admin auth middleware are in place. No pages, tables, or API routes yet. Next step per the roadmap (`docs/plan-migracion-stack-tecnico.md` §9): Fase 1 — Home, Diagnóstico Next You, `contacts`/`contact_events` tables, and the quiz-submit → n8n → Resend flow.
