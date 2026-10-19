import legacyRedirects from "./legacy-redirects.json";

interface Redirect {
  source: string;
  destination: string;
}

// Same pattern syntax as next.config.js redirects: ":name" is one path segment, ":name*" is the rest of the path.
function match(source: string, pathname: string): Record<string, string> | null {
  const pattern = source.split("/").filter(Boolean);
  const parts = pathname.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i];
    if (p.startsWith(":") && p.endsWith("*")) {
      params[p.slice(1, -1)] = parts.slice(i).join("/");
      return params;
    }
    if (i >= parts.length) return null;
    if (p.startsWith(":")) params[p.slice(1)] = parts[i];
    else if (p !== parts[i]) return null;
  }
  return parts.length === pattern.length ? params : null;
}

/** The new location for an old WordPress / pre-bilingual URL, or null if the path isn't one of them. */
export function legacyRedirectFor(pathname: string): string | null {
  for (const r of legacyRedirects as Redirect[]) {
    const params = match(r.source, pathname);
    if (params) {
      return r.destination.replace(/:(\w+)\*?/g, (_, name) => params[name] ?? "");
    }
  }
  return null;
}
