-- Digital products: admin creates a product with a price and a file, customer pays via Stripe,
-- and only gets the file after payment is confirmed — via a per-purchase download token, never
-- a public URL to the file itself.

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price_cents int not null,
  file_path text not null,   -- path within the private 'product-files' storage bucket
  file_name text not null,   -- original filename, used for the download's Content-Disposition
  active boolean not null default true,
  created_at timestamptz default now()
);

create table product_purchases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) not null,
  contact_id uuid references contacts(id) not null,
  stripe_payment_id text,
  amount_cents int not null,
  download_token uuid not null default gen_random_uuid() unique,
  status text not null default 'completed',
  download_count int not null default 0,
  downloaded_at timestamptz,
  created_at timestamptz default now()
);

create index product_purchases_contact_id_idx on product_purchases(contact_id);
create index product_purchases_product_id_idx on product_purchases(product_id);

-- Private bucket — no public read. Files are only ever reached through /api/download/[token],
-- which checks product_purchases before minting a short-lived signed URL.
insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do nothing;
