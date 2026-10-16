-- Bilingual articles. Each post is written in one language; translations of the same article
-- share a translation_group so the site can link them (hreflang, language switcher).
-- Additive only: every existing post becomes Spanish ('es').

alter table blog_posts add column locale text not null default 'es' check (locale in ('en', 'es'));
alter table blog_posts add column translation_group uuid;

create index blog_posts_locale_idx on blog_posts(locale, published_at);
create index blog_posts_translation_group_idx on blog_posts(translation_group) where translation_group is not null;
