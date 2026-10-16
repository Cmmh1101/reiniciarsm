-- Bilingual articles: one row per article, with an English version beside the original (Spanish)
-- fields. The slug is shared, so /en/resources/<slug> and /es/recursos/<slug> are the same article.
-- When one language is empty the site shows the other.
-- Additive only: existing posts keep their Spanish title/excerpt/content untouched.

alter table blog_posts add column if not exists title_en text;
alter table blog_posts add column if not exists excerpt_en text;
alter table blog_posts add column if not exists content_en text;

-- Remove the unused columns of an earlier per-language-row design (no-ops if they were never added).
drop index if exists blog_posts_locale_idx;
drop index if exists blog_posts_translation_group_idx;
alter table blog_posts drop column if exists locale;
alter table blog_posts drop column if exists translation_group;
