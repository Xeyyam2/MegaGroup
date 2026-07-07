import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ARTICLES } from "@/data/articles";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "az") return {};
  return {
    title: "Xaricdə Təhsil Bloqu — Ölkələr, Universitetlər və Qəbul Bələdçiləri",
    description:
      "Xaricdə təhsil, Türkiyədə təhsil, Rusiyada təhsil, Gürcüstanda təhsil və Ukraynada təhsil haqqında ətraflı bələdçilər. MegaGroup ekspertlərindən faydalı məqalələr.",
    alternates: { canonical: `${siteUrl}/az/bloq` },
    openGraph: {
      title: "Xaricdə Təhsil Bloqu | MegaGroup",
      description: "Ölkələr, universitetlər və qəbul prosesi haqqında ətraflı bələdçilər.",
      type: "website",
      url: `${siteUrl}/az/bloq`,
    },
  };
}

export default async function BlogIndexPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  if (locale !== "az") notFound();
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Səhifə", item: `${siteUrl}/az` },
      { "@type": "ListItem", position: 2, name: "Bloq", item: `${siteUrl}/az/bloq` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-balance font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          Xaricdə Təhsil Bloqu
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
          Ölkə seçimi, qəbul şərtləri, xərclər və sənəd prosesi haqqında ətraflı, faydalı bələdçilər — hamısı
          MegaGroup komandasının real təcrübəsinə əsaslanır.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ARTICLES.map((a, i) => (
            <FadeInUp key={a.slug} delay={i * 0.08}>
              <Link
                href={`/az/bloq/${a.slug}`}
                className="glass shadow-brand-hover block h-full rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <div className="text-3xl">{a.heroEmoji}</div>
                <h2 className="mt-3 font-heading text-xl font-bold text-foreground">{a.title}</h2>
                <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-foreground/50">
                  <span>{a.readingMinutes} dəq oxu</span>
                  <span>·</span>
                  <span>{new Date(a.updatedAt).toLocaleDateString("az-AZ")}</span>
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">Oxu →</span>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </section>
    </>
  );
}
