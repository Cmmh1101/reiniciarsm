-- Bilingual products: an English name and description beside the original (Spanish) ones.
-- When the English text is empty the site shows the Spanish text, so nothing changes for existing products.
-- Additive only.

alter table products add column if not exists name_en text;
alter table products add column if not exists description_en text;
