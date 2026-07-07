import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { ApplicationForm } from "@/components/sections/ApplicationForm";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: locale === "az" ? "Müraciət" : locale === "ru" ? "Заявка" : "Apply",
    alternates: { canonical: `${siteUrl}/${locale}/xaricde-tehsil/muraciet` },
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {locale === "az"
            ? "Pulsuz Konsultasiya və Müraciət"
            : locale === "ru"
              ? "Бесплатная консультация и заявка"
              : "Free Consultation & Application"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
          {locale === "az"
            ? "Formu doldurun — MegaGroup konsultantı sizinlə əlaqə saxlayacaq. İlk konsultasiya tam pulsuzdur."
            : locale === "ru"
              ? "Заполните форму — консультант MegaGroup свяжется с вами. Первая консультация бесплатна."
              : "Fill the form — a MegaGroup consultant will contact you. First consultation is free."}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <ApplicationForm />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 text-center">
        <p className="text-foreground/70">
          {locale === "az" ? "Və ya birbaşa əlaqə:" : locale === "ru" ? "Или напрямую:" : "Or contact directly:"}
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/994519999370"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <MessageCircle size={20} /> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/mega_xaricde_tehsil_merkezi/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white"
          >
            <InstagramIcon size={20} /> Instagram
          </a>
          <a
            href="https://www.tiktok.com/@mega_xaricde_tehsil_merkezi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-500 px-6 py-3 font-semibold text-white"
          >
            <TikTokIcon size={20} /> TikTok
          </a>
        </div>
      </section>
    </>
  );
}
