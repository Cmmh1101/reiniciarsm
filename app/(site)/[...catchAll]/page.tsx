import { notFound } from "next/navigation";

// Catches any URL that doesn't match a real route or a redirect (see next.config.js). Without
// this, an unmatched path falls through to Next's bare generic 404 instead of the branded
// not-found.tsx in this route group — this project has no shared root layout.tsx (Home and
// /admin each define their own <html> for the "multiple root layouts" pattern), so a root-level
// not-found.tsx isn't an option here; calling notFound() from within (site) is the supported way
// to get a branded 404 across the whole group.
export default function CatchAll(): never {
  notFound();
}
