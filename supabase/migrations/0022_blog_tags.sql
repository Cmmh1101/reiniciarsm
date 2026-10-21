-- Blog tags: free-form labels (several per post) for filtering and for pages that show only some
-- articles, e.g. a schools landing that lists posts tagged "schools". The category keeps living in
-- the existing `pillar` column (it now holds a category key); `arc_phase` is no longer written.
-- Additive only.

alter table blog_posts add column if not exists tags text[] not null default '{}';
create index if not exists blog_posts_tags_idx on blog_posts using gin (tags);
