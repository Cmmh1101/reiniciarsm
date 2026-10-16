import routesJson from "./routes.json";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

export type RouteKey = keyof typeof routesJson;

const ROUTES = routesJson as Record<RouteKey, Record<Locale, string>>;

/** Builds the public, localized path for a route, e.g. localizedPath("es", "shopProduct", { slug: "x" }) -> "/es/tienda/x". */
export function localizedPath(locale: Locale, key: RouteKey, params: Record<string, string> = {}): string {
  let path = ROUTES[key][locale];
  for (const [name, value] of Object.entries(params)) {
    path = path.replace(`:${name}`, encodeURIComponent(value));
  }
  return path ? `/${locale}/${path}` : `/${locale}`;
}

interface Match {
  key: RouteKey;
  params: Record<string, string>;
}

function matchPattern(pattern: string, segments: string[]): Record<string, string> | null {
  const parts = pattern === "" ? [] : pattern.split("/");
  if (parts.length !== segments.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(":")) params[parts[i].slice(1)] = segments[i];
    else if (parts[i] !== segments[i]) return null;
  }
  return params;
}

/** Finds which route a public pathname (without locale prefix) belongs to. Static routes win over param routes. */
export function matchRoute(locale: Locale, pathWithoutLocale: string): Match | null {
  const segments = pathWithoutLocale.split("/").filter(Boolean);
  const keys = (Object.keys(ROUTES) as RouteKey[]).sort(
    (a, b) => (ROUTES[a][locale].match(/:/g)?.length ?? 0) - (ROUTES[b][locale].match(/:/g)?.length ?? 0)
  );
  for (const key of keys) {
    const params = matchPattern(ROUTES[key][locale], segments);
    if (params) return { key, params };
  }
  return null;
}

/** Equivalent page in the other language, used by the language switcher. Falls back to that language's home. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const [, maybeLocale, ...rest] = pathname.split("/");
  const from = (LOCALES as readonly string[]).includes(maybeLocale) ? (maybeLocale as Locale) : DEFAULT_LOCALE;
  const match = matchRoute(from, rest.join("/"));
  return match ? localizedPath(to, match.key, match.params) : `/${to}`;
}
