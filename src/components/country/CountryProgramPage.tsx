import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { getCountryBySlug } from "@/lib/data/countries";
import { getUniversitiesByCountry } from "@/lib/data/universities";
import { getFAQsByCountry } from "@/lib/data/faqs";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/types";
import { azLocative, countryNameByLocale, type CountryTopic } from "@/data/country-topics";
import {
  PROGRAMS,
  matchFaculties,
  programH1,
  programName,
  type Program,
} from "@/data/country-programs";

export const revalidate = 3600;

interface ProgramPageProps {
  locale: Locale;
  country: string;
  program: Program;
}

export async function CountryProgramPage({ locale, country, program }: ProgramPageProps) {
  setRequestLocale(locale);
  const c = await getCountryBySlug(country, locale);
  if (!c) notFound();

  const unis = await getUniversitiesByCountry(country, locale);
  const faqs = (await getFAQsByCountry(country, locale)).slice(0, 8);
  const name = countryNameByLocale(c, locale);
  const year = new Date().getFullYear();
  const az = azLocative(c.name_az, country);
  const pName = programName(program, locale);
  const heading = programH1(program, az, year);
  const basePath = `xaricde-tehsil/${c.slug}`;
  const programPath = `${basePath}/ixtisas/${program.slug}`;

  // Yalnız bu ixtisası təklif edən universitetlər + uyğun fakültələr.
  const matches = unis
    .map((u) => ({ u, fs: matchFaculties(u.faculties, program) }))
    .filter((m) => m.fs.length > 0);

  const crumbRoot =
    locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbRoot, item: `${siteUrl}/${locale}/xaricde-tehsil` },
      { "@type": "ListItem", position: 2, name: name, item: `${siteUrl}/${locale}/${basePath}` },
      { "@type": "ListItem", position: 3, name: heading, item: `${siteUrl}/${locale}/${programPath}` },
    ],
  };

  const LBL = {
    university: locale === "az" ? "Universitet" : locale === "ru" ? "Вуз" : "University",
    city: locale === "az" ? "Şəhər" : locale === "ru" ? "Город" : "City",
    tuition: locale === "az" ? "Təhsil haqqı" : locale === "ru" ? "Обучение" : "Tuition",
    duration: locale === "az" ? "Müddət" : locale === "ru" ? "Срок" : "Duration",
    language: locale === "az" ? "Dil" : locale === "ru" ? "Язык" : "Language",
    perYear: locale === "az" ? "/il" : locale === "ru" ? "/год" : "/yr",
    years: locale === "az" ? "il" : locale === "ru" ? "лет" : "yrs",
  };

  const intro =
    locale === "az"
      ? [
          `${az} ${pName.toLowerCase()} təhsili almaq istəyən tələbələr üçün aşağıda bu ixtisası təklif edən universitetlər, uyğun fakültələr, müddət, tədris dili və illik təhsil haqları bir cədvəldə toplanıb.`,
          "Hər universitetin adına kliklədikcə attestatla qəbul şərtləri, sənədlər, yataqxana və ümumi yaşayış xərcləri haqqında ətraflı profili açırsınız. Rəqəmlər MegaGroup bazasından götürülür və mütəmadi yenilənir.",
        ]
      : locale === "ru"
        ? [
            `Ниже — вузы ${name}, предлагающие направление «${pName}»: соответствующие факультеты, срок обучения, язык и годовая стоимость.`,
            "Кликнув по названию вуза, вы откроете подробный профиль: условия поступления по аттестату, документы, общежитие и расходы.",
          ]
        : [
            `Below — universities in ${name} offering ${pName}: matching faculties, duration, language of instruction and annual tuition.`,
            "Click a university name to open its detailed profile: certificate-based admission, documents, dormitory and living costs.",
          ];

  const otherPrograms = PROGRAMS.filter((p) => p.slug !== program.slug);
  const otherTopics: Pick<CountryTopic, "slug">[] = [
    { slug: "universitetler" },
    { slug: "tehsil-haqqi" },
    { slug: "attestatla-qebul" },
    { slug: "teqaud" },
    { slug: "yasayis-xercleri" },
  ];


  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
          <li>
            <Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">{crumbRoot}</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/${locale}/${basePath}`} className="hover:text-brand-primary">{name}</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">{heading}</li>
        </ol>
      </nav>

      <section className="mx-auto max-w-3xl px-6 pt-12">
        <h1 className="text-balance font-heading text-4xl font-extrabold text-foreground sm:text-5xl">{heading}</h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Digər ixtisaslar — programmatic internal linking. */}
      <nav aria-label={locale === "az" ? "İxtisaslar" : locale === "ru" ? "Направления" : "Programs"} className="mx-auto max-w-3xl px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          {otherPrograms.map((p) => (
            <Link
              key={p.slug}
              href={`/${locale}/${basePath}/ixtisas/${p.slug}`}
              className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {programName(p, locale)}
            </Link>
          ))}
          {otherTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/${locale}/${basePath}/${t.slug}`}
              className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {t.slug === "universitetler"
                ? locale === "az" ? "Universitetlər" : locale === "ru" ? "Университеты" : "Universities"
                : t.slug === "tehsil-haqqi"
                  ? locale === "az" ? "Təhsil haqqı" : locale === "ru" ? "Стоимость" : "Tuition fees"
                  : t.slug === "attestatla-qebul"
                    ? locale === "az" ? "Attestatla qəbul" : locale === "ru" ? "По аттестату" : "Certificate admission"
                    : t.slug === "teqaud"
                      ? locale === "az" ? "Təqaüdlər" : locale === "ru" ? "Стипендии" : "Scholarships"
                      : locale === "az" ? "Yaşayış xərcləri" : locale === "ru" ? "Расходы на проживание" : "Living costs"}
            </Link>
          ))}
        </div>
      </nav>


      {matches.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az"
              ? `${pName} təklif edən universitetlər`
              : locale === "ru"
                ? `Вузы с направлением «${pName}»`
                : `Universities offering ${pName}`}
          </h2>
          <div className="glass mt-8 overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-foreground/70">
                <tr>
                  <th className="px-5 py-3">{LBL.university}</th>
                  <th className="px-5 py-3">{LBL.city}</th>
                  <th className="px-5 py-3">{LBL.duration}</th>
                  <th className="px-5 py-3">{LBL.language}</th>
                  <th className="px-5 py-3">{LBL.tuition}</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(({ u, fs }) => {
                  const f = fs[0];
                  return (
                    <tr key={u.slug} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-3">
                        <Link href={`/${locale}/${basePath}/${u.slug}`} className="font-medium text-foreground hover:text-brand-primary">
                          {u.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-foreground/70">{u.city}</td>
                      <td className="px-5 py-3 text-foreground/70">{f.duration_years} {LBL.years}</td>
                      <td className="px-5 py-3 text-foreground/70">{f.language}</td>
                      <td className="px-5 py-3 text-foreground/70">
                        {u.fees?.tuition_min_usd
                          ? u.fees.tuition_min_usd !== u.fees.tuition_max_usd
                            ? `$${u.fees.tuition_min_usd}–$${u.fees.tuition_max_usd} ${LBL.perYear}`
                            : `$${u.fees.tuition_min_usd} ${LBL.perYear}`
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-foreground/50">
            {locale === "az"
              ? "Rəqəmlər MegaGroup bazasından götürülür və mütəmadi yenilənir — dəqiqləşdirmə üçün universitetin rəsmi saytını yoxlayın."
              : locale === "ru"
                ? "Данные из базы MegaGroup, регулярно обновляются — проверяйте официальный сайт вуза."
                : "Data from the MegaGroup database, updated regularly — verify with the university's official website."}
          </p>
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-foreground/70">
            {locale === "az"
              ? "Bu ölkədə həmin ixtisas hazırda bazamızda qeydiyyatdan keçmiş universitetlər tərəfindən təklif olunmur — konsultasiya üçün bizimlə əlaqə saxlayın."
              : locale === "ru"
                ? "В настоящее время это направление не предлагается зарегистрированными вузами — свяжитесь с нами."
                : "This program is not currently offered by registered universities — contact us for a consultation."}
          </p>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Tez-tez Verilən Suallar" : locale === "ru" ? "Часто задаваемые вопросы" : "FAQ"}
          </h2>
          <div className="mt-8">
            <FAQSection faqs={faqs} />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
