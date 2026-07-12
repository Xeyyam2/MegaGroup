"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { countries } from "@/data/countries";
import type { Locale } from "@/i18n/routing";

function countryName(slug: string, locale: Locale): string {
  const c = countries.find((x) => x.slug === slug);
  if (!c) return slug;
  return locale === "ru" ? c.name_ru ?? c.name_az : locale === "en" ? c.name_en ?? c.name_az : c.name_az;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = useCallback(() => { if (closeTimer.current) clearTimeout(closeTimer.current); setStudyOpen(true); }, []);
  const closeMenu = useCallback(() => { closeTimer.current = setTimeout(() => setStudyOpen(false), 300); }, []);
  const cancelClose = useCallback(() => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");

  const tagline =
    locale === "az" ? "Xaricdə Təhsil Mərkəzi" : locale === "ru" ? "Центр обучения за рубежом" : "Study Abroad Center";

  const COUNTRY_SLUGS = ["turkiye", "rusiya", "gurcustan", "ukrayna", "qazaxistan", "almaniya", "polsa"];

  return (
    <header className="glass fixed top-0 z-50 w-full border-b border-white/20 shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-300">
      {/* Mobil: 2 sutun (logo | hamburger-sag) / Desktop: 3 sutun (logo | nav-merkez | dil-sag) */}
      <div className="mx-auto grid grid-cols-2 items-center px-4 py-3 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link href={`/${locale}`} className="flex flex-col leading-tight tracking-tight-display justify-self-start">
          <span className="font-heading text-xl font-bold text-on-surface">MegaGroup</span>
          <span className="text-[0.7rem] text-on-surface-variant">{tagline}</span>
        </Link>

        {/* MERKEZDE menular (desktop) */}
        <nav className="hidden items-center gap-6 justify-self-center md:flex" onMouseLeave={closeMenu}>
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {t("home")}
          </Link>

          {/* Xaricdə Təhsil — submenu ilə */}
          <div className="relative" onMouseEnter={openMenu}>
            <Link
              href={`/${locale}/xaricde-tehsil`}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {t("studyAbroad")}
              <ChevronDown size={14} className={cn("transition-transform", studyOpen && "rotate-180")} />
            </Link>
            {studyOpen && (
              <div onMouseEnter={cancelClose} onMouseLeave={closeMenu} className="glass absolute left-1/2 top-full z-50 mt-1 w-48 -translate-x-1/2 rounded-xl border border-white/20 p-1 shadow-xl">
                {COUNTRY_SLUGS.map((slug) => (
                  <Link
                    key={slug}
                    href={`/${locale}/xaricde-tehsil/${slug}`}
                    onClick={() => setStudyOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary"
                  >
                    {countryName(slug, locale)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/haqqimizda`}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {t("about")}
          </Link>
          {locale === "az" && (
            <Link
              href={`/${locale}/bloq`}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {t("blog")}
            </Link>
          )}
          <Link
            href={`/${locale}/xaricde-tehsil/muraciet`}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {t("apply")}
          </Link>
        </nav>

        {/* SAGDA: dil secici (desktop) + hamburger (mobil) */}
        <div className="flex items-center justify-end gap-2 justify-self-end">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menyu"
            aria-expanded={open}
            className="cursor-pointer rounded-lg p-2 text-foreground md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <nav className="flex flex-col gap-1 px-4 pb-4 sm:px-6">
          <Link
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary"
          >
            {t("home")}
          </Link>

          {/* Mobil: Xaricdə Təhsil + ölkə alt linkləri */}
          <div className="rounded-lg px-3 py-2">
            <Link
              href={`/${locale}/xaricde-tehsil`}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-foreground/80 transition-colors hover:text-brand-primary"
            >
              {t("studyAbroad")}
            </Link>
            <div className="mt-1 ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
              {COUNTRY_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/${locale}/xaricde-tehsil/${slug}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-primary"
                >
                  {countryName(slug, locale)}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={`/${locale}/haqqimizda`}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary"
          >
            {t("about")}
          </Link>
          {locale === "az" && (
            <Link
              href={`/${locale}/bloq`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary"
            >
              {t("blog")}
            </Link>
          )}
          <Link
            href={`/${locale}/xaricde-tehsil/muraciet`}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 hover:text-brand-primary"
          >
            {t("apply")}
          </Link>
          <div className="px-3 py-2">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}