# Accessibility baseline / Base de accesibilidad

Target: **WCAG 2.1 level AA**. This file is the checklist to keep the site (and any template built from it) accessible.
Objetivo: **WCAG 2.1 nivel AA**. Esta es la lista para mantener accesible el sitio y cualquier plantilla que salga de él.

## Colors — use these, not the raw brand clay, for text

| Use | Token | Contrast |
|---|---|---|
| Text or button background with paper text, on light grounds | `clay-deep` `#984222` | 5.4:1 on paper, 4.7:1 on paper-soft |
| Terracotta text on dark (ink) grounds | `clay-soft` `#D98A66` | 6.5:1 on ink |
| Green text on light grounds | `sage-deep` `#566647` | 5.0:1 on paper |
| Decoration only (lines, dots, the arrow) | `clay` `#BE5A34` | 3.6:1 — **never** for small text |

Rules
1. **Never put `text-clay-deep` on a dark (`bg-ink`) section** — use `text-clay-soft` there.
2. **No text below `opacity-70`.** `opacity-50/60` on small text fails AA. When a paragraph contains a link, avoid opacity on the
   paragraph (opacity stacks on the link); tint the text color instead (see `.prose-post p`).
3. Don't nest opacity (`opacity-70` inside `opacity-70` is 49%).
4. Disabled controls are exempt from contrast, but keep them recognizable.
5. Placeholders are styled in `globals.css` (`::placeholder`) and never replace a label.

## Behavior
- Visible focus ring on everything focusable (`:focus-visible` in `globals.css`).
- `prefers-reduced-motion` disables smooth scroll, hover lifts and animations.
- Skip link to `#main-content` in the locale layout; `<html lang>` follows the page language.
- One `<h1>` per page and no skipped heading levels (footer headings are `h2`).
- Every form field has a label or `aria-label`; errors use `role="alert"` and say how to fix the problem.
- Decorative glyphs (✓, arrows drawn with CSS) are `aria-hidden`.
- External links that open a new tab use `rel="noopener noreferrer"`.

## How to re-check
- **Automated:** in the browser, walk every visible text node, compute the effective color (including opacity and stacked
  backgrounds) and flag anything under 4.5:1 (3:1 for large text). The audit used for the October 2026 review covered all public
  pages in English and Spanish, the quiz screens (cover, questions, capture, error, result) and the form error states.
- **Also check by hand:** keyboard-only navigation, a screen reader on the booking and quiz flows, 200% zoom, and the site on a phone.
- Automated checks catch roughly a third of problems. Real user feedback matters — the Accessibility Statement page tells people how to report one.

## Known gaps
- Admin panel colors were updated to the same tokens but the admin has not been audited screen by screen.
- Downloadable products (templates, ebooks, workbooks) have not been checked.
- Videos need captions; the About-page video slot has no caption track yet.
