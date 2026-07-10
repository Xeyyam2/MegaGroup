import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing, locales } from "@/i18n/routing";
import { isSupabaseConfigured } from "@/lib/data/config";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_BASE = "/admin";
// Accept the old "/dashboard" name too, and any locale-prefixed variant of
// either (e.g. someone types "/az/admin" or "/ru/dashboard/login"), and
// normalize all of them to the canonical, locale-independent "/admin/...".
// The admin panel isn't translated, so it never needs a locale prefix.
const LOCALE_GROUP = locales.join("|");
const LOCALE_PREFIXED_ADMIN = new RegExp(`^/(?:${LOCALE_GROUP})(/(?:admin|dashboard))(/.*)?$`);
const LEGACY_DASHBOARD = /^\/dashboard(\/.*)?$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // "/az/admin", "/ru/dashboard/login", etc. -> redirect to "/admin/..."
  const localeMatch = pathname.match(LOCALE_PREFIXED_ADMIN);
  if (localeMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `${ADMIN_BASE}${localeMatch[2] ?? ""}`;
    return NextResponse.redirect(url);
  }

  // Old "/dashboard" links -> redirect to "/admin"
  const legacyMatch = pathname.match(LEGACY_DASHBOARD);
  if (legacyMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `${ADMIN_BASE}${legacyMatch[1] ?? ""}`;
    return NextResponse.redirect(url);
  }

  // Admin panel — auth guard (next-intl bura islemir)
  if (pathname.startsWith(ADMIN_BASE)) {
    // Login və reset-password açıqdır ( recovery linki brauzerdən gəlir)
    if (pathname === `${ADMIN_BASE}/login` || pathname === `${ADMIN_BASE}/reset-password`) {
      return NextResponse.next();
    }
    // Supabase konfiqurasiya olunmayibsa login sehifesine yonlendir
    if (!isSupabaseConfigured()) {
      const url = request.nextUrl.clone();
      url.pathname = `${ADMIN_BASE}/login`;
      return NextResponse.redirect(url);
    }
    const response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `${ADMIN_BASE}/login`;
      return NextResponse.redirect(url);
    }
    // Yalnız admin rolu olan istifadecilere icaze verilir
    if (session.user.app_metadata?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = `${ADMIN_BASE}/login`;
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Public — next-intl locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
