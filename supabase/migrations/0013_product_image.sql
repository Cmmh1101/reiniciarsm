-- Optional product image (template homepage screenshot, ebook/guide cover) shown on the public
-- product detail page. Stored in the same public 'newsletter-images' bucket the newsletter
-- composer already uses — these images are meant to be publicly visible, unlike product files.
alter table products add column image_url text;
