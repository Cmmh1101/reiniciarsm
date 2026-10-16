import { notFound } from "next/navigation";

// Catches any URL under /[locale] that doesn't match a real route or a redirect (see next.config.js),
// so unmatched paths render the branded not-found.tsx instead of Next's bare generic 404.
export default function CatchAll(): never {
  notFound();
}
