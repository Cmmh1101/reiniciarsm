-- Public bucket for images embedded in newsletter/blog Tiptap content.
-- Public read (emails/blog posts need a plain URL any client can load);
-- writes only ever happen server-side via the service_role key.
insert into storage.buckets (id, name, public)
values ('newsletter-images', 'newsletter-images', true)
on conflict (id) do nothing;
