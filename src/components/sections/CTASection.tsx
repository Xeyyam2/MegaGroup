"use client";
import { MessageCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function CTASection({ whatsappUrl = "https://wa.me/994519999370" }: { whatsappUrl?: string }) {
  const locale = useLocale();
  const tCta = useTranslations("cta");
  const desc =
    locale === "az"
      ? "MegaGroup komandası sizə uyğun ölkə və universiteti seçməyə kömək edər. İlk konsultasiya tam pulsuzdur."
      : locale === "ru"
        ? "Команда MegaGroup поможет выбрать страну и университет. Первая консультация бесплатна."
        : "The MegaGroup team helps you choose the right country and university. First consultation is free.";

  return (
    <section className="relative my-16 overflow-hidden">
      <div className="gradient-mesh absolute inset-0 opacity-50" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 text-center">
        <ScrollReveal direction="scale">
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {tCta("freeConsult")}
          </h2>
          <p className="mt-3 text-foreground/75">{desc}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton href={`/${locale}/xaricde-tehsil/muraciet`} variant="primary">
              {tCta("apply")}
            </MagneticButton>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            >
              <MessageCircle size={20} /> WhatsApp
            </a>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}