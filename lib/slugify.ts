// Pure string utility, no imports — safe to use from client components. Kept separate from
// lib/products.ts, which also exports server-only Supabase code (service-role client) that must
// never end up in a browser bundle.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (á -> a, ñ -> n, etc.)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
