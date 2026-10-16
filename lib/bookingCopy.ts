// Server-side text for Stripe checkout and the confirmation emails, in the visitor's language.
import type { Locale } from "@/lib/i18n/config";
import { MENTORIA_PACK_PRODUCT, MENTORIA_SESSION_PRODUCT, TECH_SOS_PRODUCT } from "@/lib/pricing";

type BookingProduct = typeof MENTORIA_SESSION_PRODUCT | typeof MENTORIA_PACK_PRODUCT | typeof TECH_SOS_PRODUCT;

const CHECKOUT: Record<Locale, Record<BookingProduct, { name: string; description: (slotLabel: string) => string }>> = {
  en: {
    [TECH_SOS_PRODUCT]: { name: "Tech SOS — 30-minute support call", description: (slot) => `Video call — ${slot}.` },
    [MENTORIA_SESSION_PRODUCT]: { name: "1:1 Session — 60 minutes", description: (slot) => `Video session — ${slot}.` },
    [MENTORIA_PACK_PRODUCT]: { name: "1:1 Sessions — package of 4 (60 min each)", description: () => "Includes one month of the community as a gift." },
  },
  es: {
    [TECH_SOS_PRODUCT]: { name: "Tech SOS — llamada de soporte de 30 min", description: (slot) => `Videollamada — ${slot}.` },
    [MENTORIA_SESSION_PRODUCT]: { name: "Sesión 1:1 — 60 minutos", description: (slot) => `Sesión por videollamada — ${slot}.` },
    [MENTORIA_PACK_PRODUCT]: { name: "Sesiones 1:1 — Paquete de 4 (60 min c/u)", description: () => "Incluye 1 mes de membresía de la comunidad de regalo." },
  },
};

export function checkoutLine(locale: Locale, product: BookingProduct, slotLabel = "") {
  const c = CHECKOUT[locale][product];
  return { name: c.name, description: c.description(slotLabel) };
}

/** Human-readable slot time, in Venezuela time (where sessions are held) — the confirmation also carries the video link by email. */
export function formatSlotLabel(locale: Locale, iso: string): string {
  return new Date(iso).toLocaleString(locale, {
    timeZone: "America/Caracas",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function slotConfirmationEmail(locale: Locale, product: string, name: string, slotLabel: string) {
  const sos = product === TECH_SOS_PRODUCT;
  if (locale === "es") {
    return {
      subject: sos ? "Confirmación de tu sesión Tech SOS" : "Confirmación de tu sesión 1:1",
      text: `Hola ${name},\n\nConfirmamos tu sesión${sos ? " Tech SOS (30 min)" : ""} el ${slotLabel}. Te comparto el enlace de la videollamada antes de la sesión.\n\n¿Necesitas reagendar? Escríbeme a hello@carlamontano.io.\n\nNos vemos pronto,\nCarla`,
    };
  }
  return {
    subject: sos ? "Your Tech SOS session is confirmed" : "Your 1:1 session is confirmed",
    text: `Hi ${name},\n\nYour ${sos ? "30-minute Tech SOS" : "1:1"} session is confirmed for ${slotLabel}. I'll send you the video call link before we meet.\n\nNeed to reschedule? Write to hello@carlamontano.io.\n\nTalk soon,\nCarla`,
  };
}

export function packConfirmationEmail(locale: Locale, name: string) {
  if (locale === "es") {
    return {
      subject: "Confirmación de tu paquete de 4 sesiones",
      text: `Hola ${name},\n\n¡Gracias por tu compra! Confirmamos tu paquete de 4 sesiones 1:1, que incluye 1 mes de membresía de la comunidad de regalo.\n\nTe escribo pronto para coordinar tus horarios.\n\nSaludos,\nCarla`,
    };
  }
  return {
    subject: "Your 4-session package is confirmed",
    text: `Hi ${name},\n\nThank you for your purchase! Your package of four 1:1 sessions is confirmed, and it includes one month of the community as a gift.\n\nI'll write to you soon to schedule your sessions.\n\nBest,\nCarla`,
  };
}

/** Sent when payment arrived but the chosen time was no longer free — Carla follows up personally. */
export function slotConflictEmail(locale: Locale, name: string) {
  if (locale === "es") {
    return {
      subject: "Recibimos tu pago — necesitamos acordar el horario",
      text: `Hola ${name},\n\nRecibimos tu pago, pero el horario que elegiste fue tomado justo antes de confirmarse. Te escribo personalmente hoy para acordar otro horario que te convenga (o reembolsarte si prefieres).\n\nDisculpa el inconveniente,\nCarla`,
    };
  }
  return {
    subject: "We received your payment — let's agree on a time",
    text: `Hi ${name},\n\nWe received your payment, but the time you picked was taken just before it could be confirmed. I'll write to you personally today to find another time that works for you (or refund you if you prefer).\n\nSorry for the inconvenience,\nCarla`,
  };
}
