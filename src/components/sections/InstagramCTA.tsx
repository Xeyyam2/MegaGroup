import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export async function InstagramCTA({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "instagram" });

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <ScrollReveal direction="scale">
      <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
        <div className="gradient-mesh absolute inset-0 opacity-30" aria-hidden />
        <div className="relative z-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
            <InstagramIcon size={32} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">@mega_xaricde_tehsil_merkezi</p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/60">{t("desc")}</p>
          <a
            href="https://www.instagram.com/mega_xaricde_tehsil_merkezi/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-7 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
          >
            <InstagramIcon size={20} /> {t("follow")}
          </a>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}