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

// WordPress qalıqları — sayt WP-dən Next.js-ə miqrasiya edilib.
// Bu yollar artıq mövcud deyil; Googlebot-un dəfələrlə crawl etdiyi
// (və GSC-də 403/404 xətası sayılan) köhnə WP URL-larıdır.
// 410 Gone = "bir daha gəlmə" → Google 404-dən daha sürətlə növbədən çıxarır.
const WORDPRESS_REMNANTS = /^\/(?:wp-content|wp-admin|wp-includes|wp-json|wp-login\.php|cgi-sys)(?:\/|$)/;

// Köhnə WordPress slug-ları → yeni Next.js strukturuna 301 redirect.
// 301 = daimi yönləndirmə → link juice və autoritet yeni URL-a köçür.
// Format: [regex, hədəf path]. Hədəf `locale` qəbul edir (default /az).
const LEGACY_SLUGS: Array<[RegExp, (locale: string) => string]> = [
  // Köhnə "{ölkə}də-tehsil" səhifələri → /az/xaricde-tehsil/{ölkə}
  [/^\/ukraynada-tehsil\/?$/, () => "/xaricde-tehsil/ukrayna"],
  [/^\/rusiyada-tehsil\/?$/, () => "/xaricde-tehsil/rusiya"],
  [/^\/turkiyede-tehsil\/?$/, () => "/xaricde-tehsil/turkiye"],
  [/^\/gurcustanda-tehsil\/?$/, () => "/xaricde-tehsil/gurcustan"],
  [/^\/qazaxistanda-tehsil\/?$/, () => "/xaricde-tehsil/qazaxistan"],
  [/^\/almaniyada-tehsil\/?$/, () => "/xaricde-tehsil/almaniya"],
  [/^\/polsada-tehsil\/?$/, () => "/xaricde-tehsil/polsa"],
  // Əlaqə səhifəsi artıq yoxdur (CTASection-də WhatsApp/direct kontakt var)
  [/^\/elaqe\/?$/, () => ""],
  // Kiçik/böyük hərf varyasiyaları (CaseSensitive WP)
  [/^\/Haqqimizda\/?$/i, () => "/haqqimizda"],
  // WordPress attachment (şəkil) səhifələri → ana səhifə
  [/^\/logo-(?:\d+)\/?$/, () => ""],
  // WP tag/kateqoriya arxivləri
  [/^\/(?:tag|category|author)\/.*$/, () => ""],
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // WordPress qalıqları → 410 Gone (Google bunu 404-dən daha sürətli indexdən çıxarır)
  if (WORDPRESS_REMNANTS.test(pathname)) {
    return new NextResponse(null, {
      status: 410,
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  }

  // Köhnə WP slug-ları → /{locale}/yeni-yol 301 redirect
  for (const [re, buildPath] of LEGACY_SLUGS) {
    if (re.test(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = `/az${buildPath("az")}`;
      return NextResponse.redirect(url, 301);
    }
  }

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
  // İki əsas qayda:
  //   1. Normal public yollar (statik fayllar / Next internal istisna)
  //   2. WordPress qalıq faylları (`.js`, `.php` uzantılı olsalar belə middleware-dən keçir
  //      ki, yuxarıdakı 410 Gone qaydası işə düşsün — bu fayllar GSC-də 403/404 xətasıdır)
  // Çoxlu matcher OR-iddir — hər hansı biri uyğun gəlsə middleware işə düşür.
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/(wp-content|wp-includes|wp-admin|wp-json|cgi-sys)(/.*)?",
  ],
};
