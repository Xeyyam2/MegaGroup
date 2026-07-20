import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CounterAnimation } from "@/components/motion/CounterAnimation";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { CTASection } from "@/components/sections/CTASection";
import { CheckCircle, FileText, Plane, MessageCircle } from "lucide-react";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: locale === "az" ? "Haqqımızda | MegaGroup" : locale === "ru" ? "О нас | MegaGroup" : "About | MegaGroup",
    description:
      locale === "az"
        ? "MegaGroup — Azərbaycanlı tələbələr üçün xaricdə təhsil mərkəzi. 2018-ci ildən minlərlə tələbəyə xaricdə təhsil imkanı yaradırıq."
        : locale === "ru"
          ? "MegaGroup — центр обучения за рубежом для азербайджанских студентов."
          : "MegaGroup — study abroad center for Azerbaijani students.",
    alternates: {
      canonical: `${siteUrl}/${locale}/haqqimizda`,
      languages: {
        az: `${siteUrl}/az/haqqimizda`,
        ru: `${siteUrl}/ru/haqqimizda`,
        en: `${siteUrl}/en/haqqimizda`,
        "x-default": `${siteUrl}/az/haqqimizda`,
      },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });

  const STATS = [
    { end: 1000, suffix: "+", label: t("statStudents") },
    { end: 7, suffix: "", label: t("statCountries") },
    { end: 200, suffix: "+", label: t("statUnis") },
    { end: 6, suffix: "", label: t("statYears") },
  ];

  const SERVICES = [
    { icon: MessageCircle, title: t("service1Title"), desc: t("service1Desc") },
    { icon: FileText, title: t("service2Title"), desc: t("service2Desc") },
    { icon: CheckCircle, title: t("service3Title"), desc: t("service3Desc") },
    { icon: Plane, title: t("service4Title"), desc: t("service4Desc") },
  ];

  return (
    <>
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="relative z-10 px-6 py-24 text-center">
          <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">{t("intro")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <FadeInUp key={s.label} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="font-heading text-3xl font-bold text-brand-primary sm:text-4xl">
                  <CounterAnimation end={s.end} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-xs text-foreground/60 sm:text-sm">{s.label}</div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t("missionTitle")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/80">{t("mission")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-center font-heading text-3xl font-bold text-foreground">{t("servicesTitle")}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <FadeInUp key={s.title} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/20 text-brand-primary">
                  <s.icon size={24} />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{s.desc}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}