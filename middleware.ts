import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Netlify's CDN ("Durable" cache tier) was found to cache these pages regardless of Next.js's
// own `dynamic = "force-dynamic"` and Cache-Control headers — confirmed live: editing a product
// didn't show up on /productos for minutes, and a netlify.toml header rule alone didn't fix it
// (that mechanism doesn't reach pages routed through the Next.js runtime plugin). Setting the
// header here, in middleware, does reach the real response Netlify's edge sees. Every path below
// is force-dynamic because it reads Supabase at request time and must never go stale.
function isNoCachePath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/blog" || pathname === "/productos" || pathname === "/mentorias" || pathname === "/sitemap.xml") return true;
  return pathname.startsWith("/blog/") || pathname.startsWith("/productos/");
}

export async function middleware(request: NextRequest) {
  if (isNoCachePath(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    response.headers.set("Netlify-CDN-Cache-Control", "no-store");
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
  }

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

export const config = {
  matcher: ["/admin/:path*", "/", "/blog", "/blog/:path*", "/productos", "/productos/:path*", "/mentorias", "/sitemap.xml"],
};
