-- Blog posts (docs/plan-migracion-stack-tecnico.md §4).
-- published_at IS NULL is the draft signal — no separate boolean needed.

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  pillar text not null,
  arc_phase text,
  featured_image_url text,
  published_at timestamptz,
  reading_time_minutes int,
  created_at timestamptz default now()
);

create index blog_posts_published_at_idx on blog_posts(published_at);
