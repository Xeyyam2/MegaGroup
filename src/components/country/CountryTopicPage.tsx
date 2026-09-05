import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { localizeLang } from "@/lib/localize-language";
import { getCountryBySlug } from "@/lib/data/countries";
import { getUniversitiesByCountry } from "@/lib/data/universities";
import { getFAQsByCountry } from "@/lib/data/faqs";
import { siteUrl } from "@/lib/site";
import type { Locale, University } from "@/types";
import {
  COUNTRY_TOPICS,
  azLocative,
  countryNameByLocale,
  topicCopy,
  topicHeading,
  type CountryTopic,
} from "@/data/country-topics";

export const revalidate = 3600;

interface TopicPageProps {
  locale: Locale;
  country: string;
  topic: CountryTopic;
}

/** Tibb/mühəndis kimi sahə fakültələrini filtr üçün açar sözlər. */
const MEDICAL_FACULTY_KEYS = [
  "tibb", "medicin", "medicine", "медицин", "лечеб", "стомат",
  "dent", "stomatologiya", "hekimlik", "diş", "əcza", "pharm", "фармац",
];

function hasMedicalFaculty(u: University): boolean {
  return u.faculties.some((f) => {
    const n = f.name.toLowerCase();
    return MEDICAL_FACULTY_KEYS.some((k) => n.includes(k));
  });
}

function fmtRange(min?: number | null, max?: number | null, suffix = "/il"): string {
  if (!min && !max) return "—";
  if (min && max && min !== max) return `$${min}–$${max} ${suffix}`;
  return `$${min ?? max} ${suffix}`;
}

export async function CountryTopicPage({ locale, country, topic }: TopicPageProps) {
  setRequestLocale(locale);
  const c = await getCountryBySlug(country, locale);
  if (!c) notFound();

  const unis = await getUniversitiesByCountry(country, locale);
  const faqs = (await getFAQsByCountry(country, locale)).slice(0, 8);
  const name = countryNameByLocale(c, locale);
  const year = new Date().getFullYear();
  const az = azLocative(c.name_az, country);
  // Hər dil üçün tam lokallaşdırılmış copy (title/h1/meta/intro) — seo.md 1.2.
  const copy = topicCopy(
    topic,
    locale,
    { azLoc: az, azName: c.name_az, enName: c.name_en, slug: c.slug },
    year,
  );
  const heading = copy.h1;
  const intro = copy.intro;

  const basePath = `xaricde-tehsil/${c.slug}`;
  const topicPath = `${basePath}/${topic.slug}`;

  // Topic-ə görə filtr: tibb → yalnız tibb fakültəli; teqaud → ucuzdan bahaya.
  let filtered = unis;
  if (topic.slug === "tibb") filtered = unis.filter(hasMedicalFaculty);
  if (topic.slug === "teqaud") {
    filtered = [...unis]
      .filter((u) => u.fees?.tuition_min_usd)
      .sort((a, b) => (a.fees?.tuition_min_usd ?? 0) - (b.fees?.tuition_min_usd ?? 0));
  }

  const otherTopics = COUNTRY_TOPICS.filter((t) => t.slug !== topic.slug);

  const crumbRoot =
    locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbRoot, item: `${siteUrl}/${locale}/xaricde-tehsil` },
      { "@type": "ListItem", position: 2, name: name, item: `${siteUrl}/${locale}/${basePath}` },
      { "@type": "ListItem", position: 3, name: heading, item: `${siteUrl}/${locale}/${topicPath}` },
    ],
  };

  const labels = {
    university: locale === "az" ? "Universitet" : locale === "ru" ? "Вуз" : "University",
    city: locale === "az" ? "Şəhər" : locale === "ru" ? "Город" : "City",
    tuition: locale === "az" ? "Təhsil haqqı" : locale === "ru" ? "Обучение" : "Tuition",
    dorm: locale === "az" ? "Yataqxana" : locale === "ru" ? "Общежитие" : "Dormitory",
    food: locale === "az" ? "Qida" : locale === "ru" ? "Питание" : "Food",
    transport: locale === "az" ? "Nəqliyyat" : locale === "ru" ? "Транспорт" : "Transport",
    personal: locale === "az" ? "Şəxsi xərclər" : locale === "ru" ? "Личные расходы" : "Personal",
    duration: locale === "az" ? "Müddət" : locale === "ru" ? "Срок" : "Duration",
    language: locale === "az" ? "Dil" : locale === "ru" ? "Язык" : "Language",
    faculty: locale === "az" ? "Fakültə" : locale === "ru" ? "Факультет" : "Faculty",
    viewProfile: locale === "az" ? "Profilə bax →" : locale === "ru" ? "Смотреть →" : "View profile →",
    perMonth: locale === "az" ? "/ay" : locale === "ru" ? "/мес" : "/mo",
    perYear: locale === "az" ? "/il" : locale === "ru" ? "/год" : "/yr",
    years: locale === "az" ? "il" : locale === "ru" ? "лет" : "yrs",
  };

  // Magistratura (master) topic-i üçün xüsusi bələdçi məzmunu — cədvəl
  // göstərmir, çünki fakültə müddətləri bakalavr səviyyəsinə aiddir.
  const master =
    locale === "az"
      ? {
          docsTitle: "Magistratura üçün tələb olunan sənədlər",
          stepsTitle: "Müraciət addımları",
          note: "Magistr proqramlarının müddəti ölkədən və ixtisasdan asılıdır (adətən 1-2 il) — dəqiq məlumat üçün universitetin rəsmi saytını yoxlayın.",
          docs: [
            "Bakalavr diplomu və əlavəsi (notarial tərcümə + apostil)",
            "Motivasiya məktubu",
            "CV (CV/Resume)",
            "Dil sertifikatı — IELTS 6.0+ / TOEFL və ya ölkə dilində B2",
            "İki tövsiyə məktubu",
            "Pasport və şəkillər",
            "Maliyyə sübutu (viza üçün)",
          ],
          steps: [
            "Proqram və universitet seçimi — ingilis dilli magistratura proqramlarına üstünlük verin",
            "Universitetin onlayn portalından müraciət",
            "Qəbul komissiyası ilə yazışma və qəbul məktubu",
            "Təhsil vizası üçün müraciət",
            "Yerləşmə və şəhərə gəliş",
          ],
        }
      : locale === "ru"
        ? {
            docsTitle: "Документы для поступления в магистратуру",
            stepsTitle: "Шаги подачи заявки",
            note: "Срок обучения в магистратуре зависит от страны и специальности (обычно 1–2 года) — уточняйте на официальном сайте университета.",
            docs: [
              "Диплом бакалавра с приложением (нотариальный перевод + апостиль)",
              "Мотивационное письмо",
              "Резюме (CV)",
              "Сертификат о знании языка — IELTS 6.0+ / TOEFL или B2 по языку страны",
              "Два рекомендательных письма",
              "Загранпаспорт и фотографии",
              "Подтверждение финансов (для визы)",
            ],
            steps: [
              "Выбор программы и вуза — отдайте предпочтение англоязычным магистерским программам",
              "Подача заявки через онлайн-портал университета",
              "Переписка с приёмной комиссией и письмо о зачислении",
              "Подача на учебную визу",
              "Размещение и приезд в город",
            ],
          }
        : {
            docsTitle: "Documents required for a master's application",
            stepsTitle: "Application steps",
            note: "Master's programme duration varies by country and field (usually 1–2 years) — always verify on the university's official website.",
            docs: [
              "Bachelor's diploma with transcript (notarised translation + apostille)",
              "Motivation letter",
              "CV / Resume",
              "Language certificate — IELTS 6.0+ / TOEFL or B2 in the country's language",
              "Two recommendation letters",
              "Passport and photos",
              "Proof of funds (for the visa)",
            ],
            steps: [
              "Choose a programme and university — prefer English-taught master's programmes",
              "Apply through the university's online portal",
              "Correspond with the admissions office and receive your acceptance letter",
              "Apply for a study visa",
              "Arrange accommodation and travel to the city",
            ],
          };

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

      {/* Silo nav — bütün alt-mövzu səhifələri bir-birinə keçidli (internal linking). */}
      <nav aria-label={locale === "az" ? "Mövzular" : locale === "ru" ? "Темы" : "Topics"} className="mx-auto max-w-3xl px-6 pt-8">
        <div className="flex flex-wrap gap-2">
          {otherTopics.map((t) => (
            <Link
              key={t.slug}
              href={`/${locale}/${basePath}/${t.slug}`}
              className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {topicHeading(t, locale, name, country, year)}
            </Link>
          ))}
        </div>
      </nav>

      {/* Attestatla qəbul üçün sənəd siyahısı — ölkə datasından. */}
      {topic.slug === "attestatla-qebul" && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Tələb olunan sənədlər" : locale === "ru" ? "Требуемые документы" : "Required documents"}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {c.documents_required.map((doc) => (
              <div key={doc} className="glass flex items-center gap-3 rounded-xl p-4 text-sm text-foreground/80">
                <span className="text-brand-primary">✓</span> {doc}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Magistratura — sənəd və addım bələdçisi (bakalavr cədvəli göstərilmir). */}
      {topic.slug === "magistr" && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">{master.docsTitle}</h2>
          <p className="mt-3 text-sm text-foreground/60">{master.note}</p>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {master.docs.map((doc) => (
              <div key={doc} className="glass flex items-center gap-3 rounded-xl p-4 text-sm text-foreground/80">
                <span className="text-brand-primary">✓</span> {doc}
              </div>
            ))}
          </div>
          <h2 className="mt-12 font-heading text-3xl font-bold text-foreground">{master.stepsTitle}</h2>
          <ol className="mt-6 space-y-4">
            {master.steps.map((step, i) => (
              <li key={step} className="glass flex items-start gap-4 rounded-xl p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm text-foreground/80">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Data cədvəli — universitetlər üzrə topic-a uyğun sütunlar. */}
      {topic.slug !== "attestatla-qebul" && topic.slug !== "magistr" && filtered.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {topic.slug === "universitetler"
              ? locale === "az" ? "Universitetlər" : locale === "ru" ? "Список вузов" : "University list"
              : topic.slug === "tibb"
                ? (locale === "az" ? "Tibb fakültəsi olan universitetlər" : locale === "ru" ? "Вузы с медицинскими факультетами" : "Universities with medical faculties")
                : topic.slug === "teqaud"
                  ? (locale === "az" ? "Ən əlçatan universitetlər (təhsil haqqına görə)" : locale === "ru" ? "Самые доступные вузы" : "Most affordable universities")
                  : heading}
          </h2>
          <div className="glass mt-8 overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-foreground/70">
                <tr>
                  <th className="px-5 py-3">{labels.university}</th>
                  <th className="px-5 py-3">{labels.city}</th>
                  {(topic.slug === "yasayis-xercleri"
                    ? [labels.dorm, labels.food, labels.transport, labels.personal]
                    : [labels.tuition]
                  ).map((h) => (
                    <th key={h} className="px-5 py-3">{h}</th>
                  ))}
                  {topic.slug === "tibb" && <th className="px-5 py-3">{labels.duration}</th>}
                  {topic.slug === "tibb" && <th className="px-5 py-3">{labels.language}</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.slug} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3">
                      <Link href={`/${locale}/${basePath}/${u.slug}`} className="font-medium text-foreground hover:text-brand-primary">
                        {u.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-foreground/70">{u.city}</td>
                    {topic.slug === "yasayis-xercleri" ? (
                      <>
                        <td className="px-5 py-3 text-foreground/70">{fmtRange(u.fees?.dorm_min_usd, u.fees?.dorm_max_usd, labels.perMonth)}</td>
                        <td className="px-5 py-3 text-foreground/70">{fmtRange(u.fees?.food_min_usd, u.fees?.food_max_usd, labels.perMonth)}</td>
                        <td className="px-5 py-3 text-foreground/70">{fmtRange(u.fees?.transport_min_usd, u.fees?.transport_max_usd, labels.perMonth)}</td>
                        <td className="px-5 py-3 text-foreground/70">{fmtRange(u.fees?.personal_min_usd, u.fees?.personal_max_usd, labels.perMonth)}</td>
                      </>
                    ) : (
                      <td className="px-5 py-3 text-foreground/70">{fmtRange(u.fees?.tuition_min_usd, u.fees?.tuition_max_usd, labels.perYear)}</td>
                    )}
                    {topic.slug === "tibb" && (
                      <>
                        <td className="px-5 py-3 text-foreground/70">
                          {u.faculties.find((f) => MEDICAL_FACULTY_KEYS.some((k) => f.name.toLowerCase().includes(k)))?.duration_years ?? "—"} {labels.years}
                        </td>
                        <td className="px-5 py-3 text-foreground/70">
                          {localizeLang(u.faculties.find((f) => MEDICAL_FACULTY_KEYS.some((k) => f.name.toLowerCase().includes(k)))?.language ?? "", locale) || "—"}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
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
      )}

      {topic.slug === "tibb" && filtered.length === 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-foreground/70">
            {locale === "az"
              ? "Bu ölkə üçün hazırda tibb fakültəsi qeydiyyatdan keçmiş universitet yoxdur — konsultasiya üçün bizimlə əlaqə saxlayın."
              : locale === "ru"
                ? "Для этой страны пока нет зарегистрированных вузов с медицинским факультетом — свяжитесь с нами."
                : "No registered medical faculties for this country yet — contact us for a consultation."}
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

