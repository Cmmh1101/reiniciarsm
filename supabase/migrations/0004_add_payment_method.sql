-- Tracks how a payment was collected — Stripe by default, or a manual
-- method (Zelle/PayPal/Pago Móvil) recorded by hand in /admin/pagos for
-- someone who couldn't pay by card.

alter table stripe_payments add column payment_method text not null default 'stripe';
