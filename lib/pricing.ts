// Session pricing — confirmed with Carla 2026-09-07 (mentoring) and updated 2026-10-16 (Tech SOS, merged 1:1 session).

export const MENTORIA_SESSION_PRICE_CENTS = 10000; // $100 — single 60-min 1:1 session (tech help, strategy, career)
export const MENTORIA_PACK_PRICE_CENTS = 34000; // $340 — 4x 60-min sessions, includes 1 month Skool membership
export const TECH_SOS_PRICE_CENTS = 5000; // $50 — 30-min quick tech support (PROPOSED, confirm with Carla)

// Product ids are stored in stripe_payments.product — the session id keeps its original value so
// payments recorded before the Tech SOS launch stay valid.
export const MENTORIA_SESSION_PRODUCT = "mentoria_1_1";
export const MENTORIA_PACK_PRODUCT = "mentoria_pack_4";
export const TECH_SOS_PRODUCT = "tech_sos";

export const SESSION_DURATION_MINUTES = 60;
export const SOS_DURATION_MINUTES = 30;

export type SessionType = "session" | "sos";

export const ALT_PAYMENT_EMAIL = "hello@carlamontano.io";

/** Products that reserve a calendar slot (the pack is scheduled afterwards, by email). */
export function isSlotProduct(product: string): boolean {
  return product === MENTORIA_SESSION_PRODUCT || product === TECH_SOS_PRODUCT;
}

export function sessionTypeForProduct(product: string): SessionType {
  return product === TECH_SOS_PRODUCT ? "sos" : "session";
}
