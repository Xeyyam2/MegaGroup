import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import { SWRegister } from "@/components/SWRegister";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: "DsAlnBZ_mxgAGoRglX8BFBCJ1g28VbsvIqtuAKqdXJo",
    yandex: "8f6d02f3c166693e",
  },
  // Branded MG monogram — replaces the framework-default favicon so
  // MegaGroup shows its own mark in Google search results and browser tabs.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The root layout sits above the [locale] segment, but next-intl's
  // middleware already resolves the locale for this request, so getLocale()
  // works here too. Search engines and screen readers use <html lang> to
  // know which language the page is in — leaving it hardcoded to "az" was
  // telling Google every /ru and /en page was actually Azerbaijani content.
  const locale = await getLocale();
  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {/*
          <html lang> statik (force-static/ISR) səhifələrdə build zamanı
          yalnız default locale ilə (az) bake olunur — çünki root layout
          [locale] segment paramını görə bilmir. Bu səbəbdən /ru və /en
          səhifələri Google-a "az" dili kimi görünürdü (ciddi i18n SEO
          xətası). Bu skript brauzerdə URL-dən düzgün lokali oxuyub lang
          atributunu ilk boyanmadan əvvəl düzəldir — həm istifadəçi, həm
          JS-render edən crawler (Googlebot) doğru dili görür.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=window.location.pathname.match(/^\\/(az|ru|en)(?:\\/|$)/);if(m&&document.documentElement.lang!==m[1]){document.documentElement.lang=m[1];}}catch(e){}})();",
          }}
        />
        <div className="grain-overlay" aria-hidden />
        {children}
        <SWRegister />
      </body>
    </html>
  );
}