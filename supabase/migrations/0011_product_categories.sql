-- Fixed category taxonomy for products (see lib/taxonomy.ts PRODUCT_CATEGORIES) — same "closed
-- dropdown, not free text" pattern as the blog's pillar/arc_phase, so values stay consistent for
-- filtering on the public /productos page.
alter table products add column category text not null default 'Ebook';
