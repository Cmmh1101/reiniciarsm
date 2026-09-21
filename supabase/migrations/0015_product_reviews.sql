-- Real product reviews, requested a few days after purchase and moderated before going public —
-- see lib/productReviews.ts and lib/reviewRequests.ts. One review per purchase (not per
-- product/contact) so a repeat buyer can still be asked again on their next purchase.
create table product_reviews (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid references product_purchases(id) not null unique,
  product_id uuid references products(id) not null,
  contact_id uuid references contacts(id) not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending', -- pending | approved | rejected
  created_at timestamptz default now()
);

create index product_reviews_product_id_idx on product_reviews(product_id);
create index product_reviews_status_idx on product_reviews(status);

-- Tracks whether the "how was it?" request email already went out for a purchase, so the daily
-- scheduled function never asks twice.
alter table product_purchases add column review_requested_at timestamptz;
