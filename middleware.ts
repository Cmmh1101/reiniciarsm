import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";
import { detectLocale } from "@/lib/i18n/detect";

async function adminGate(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request: { headers: request.headers } });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminUser = !!user && user.email === process.env.ADMIN_EMAIL;
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!isAdminUser && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isAdminUser && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

// Any public path without a /en or /es prefix is sent to the visitor's language: their saved
// choice, else browser language, else country, else English.
function localeRedirect(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) return NextResponse.next();

  const locale = detectLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    country: request.geo?.country,
  });

  const target = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
  const response = NextResponse.redirect(target, 307);
  // The destination depends on who is asking — keep caches from serving one visitor's redirect to another.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) return adminGate(request);
  return localeRedirect(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Everything public except API routes, static assets, metadata image routes and pages that stay unprefixed.
    "/((?!api|_next|admin|resenar|icon|apple-icon|opengraph-image|twitter-image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
