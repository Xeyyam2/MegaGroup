import type { Locale } from "@/types";

/**
 * seo.md 1.2 + 9 (P1): Ölkə alt-səhifə siloları.
 * Hər ölkə × alt-mövzu kombinasiyası ayrıca landing page-dir (1 keyword = 1 səhifə).
 * Mətnlər şablonlardan generasiya olunur: {country} = ölkə adı (lokal),
 * {loc} = AZ lokativ forma ("Türkiyədə"/"Rusiyada"), {year} = cari il
 * (seo.md 6.3 — cari il heç vaxt statik yazılmır).
 * Məzmun bloklarının əsas hissəsi real DB datasından (universitet/fee/fakültə)
 * render olunur — thin-copy deyil.
 *
 * AZ/RU/EN: title/meta/intro hər dil üçün ayrıca şablondur (topicCopy), RU-da
 * ölkə adları hal formaları ilə verilir (в Турции/Турции/Турция) — səhv qrammatika
 * axtarış keyfiyyətini və etibarı zəiflədər.
 */

export interface CountryTopic {
  slug: string;
  /** AZ lokativdən asılı title — məs. "Türkiyədə Tibb Təhsili" */
  title: (loc: string, year: number) => string;
  h1: (loc: string, year: number) => string;
  metaDescription: (loc: string, name: string, year: number) => string;
  intro: (loc: string, name: string, year: number) => string[];
}

export interface CountryTopicCopy {
  title: string;
  h1: string;
  metaDescription: string;
  intro: string[];
}

/** RU ölkə adlarının hal formaları (prep = "в ...", gen = yiyəlik, nom = adlıq). */
export interface RuCountryForms {
  nom: string;
  gen: string;
  prep: string;
}

export const RU_COUNTRY_FORMS: Record<string, RuCountryForms> = {
  turkiye: { nom: "Турция", gen: "Турции", prep: "в Турции" },
  rusiya: { nom: "Россия", gen: "России", prep: "в России" },
  ukrayna: { nom: "Украина", gen: "Украины", prep: "в Украине" },
  gurcustan: { nom: "Грузия", gen: "Грузии", prep: "в Грузии" },
  qazaxistan: { nom: "Казахстан", gen: "Казахстана", prep: "в Казахстане" },
  almaniya: { nom: "Германия", gen: "Германии", prep: "в Германии" },
  polsa: { nom: "Польша", gen: "Польши", prep: "в Польше" },
};

export function ruCountryForms(slug: string, fallbackNom?: string): RuCountryForms {
  return (
    RU_COUNTRY_FORMS[slug] ?? {
      nom: fallbackNom ?? slug,
      gen: fallbackNom ?? slug,
      prep: `в ${fallbackNom ?? slug}`,
    }
  );
}

export const COUNTRY_TOPICS: CountryTopic[] = [
  {
    slug: "universitetler",
    title: (loc, y) => `${loc} Universitetləri ${y} — Siyahı, Fakültələr və Təhsil Haqları | MegaGroup`,
    h1: (loc, y) => `${loc} Universitetləri ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} universitetləri ${y}: dövlət və özəl universitetlərin siyahısı, fakültələr, təhsil haqları və attestatla qəbul imkanları. ${name} təhsili üçün tam bələdçi.`,
    intro: (loc) => [
      `${loc} universitetləri Azərbaycanlı tələbələr arasında ən çox maraq görən seçimlərdəndir. Aşağıdakı siyahıda dövlət və özəl universitetlər, fakültə təklifləri və illik təhsil haqları bir yerdə toplanıb.`,
      "Hər universitetin adına kliklədikcə attestatla qəbul şərtləri, sənədlər, yataqxana və yaşayış xərcləri haqqında ətraflı profili açırsınız. Hansı universitetin sizə uyğun olduğunu seçərkən təhsil dili, ixtisas reytinqi və illik büdcəni birlikdə qiymətləndirmək tövsiyə olunur.",
    ],
  },
  {
    slug: "tehsil-haqqi",
    title: (loc, y) => `${loc} Təhsil Haqqı ${y} — Universitet Qiymətləri | MegaGroup`,
    h1: (loc, y) => `${loc} Təhsil Haqqı ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} təhsil haqqı ${y}: universitetlər üzrə illik qiymətlər USD ilə, bakalavr və magistr xərcləri, ən ucuz və ən bahalı proqramların müqayisəsi. ${name} təhsil büdcəsi.`,
    intro: (loc) => [
      `${loc} təhsil haqqı universitetdən, ixtisasdən və tədris dilindən asılı olaraq dəyişir. Aşağıdakı cədvəldə universitetlər üzrə illik təhsil haqqı diapazonları real qiymət datası əsasında göstərilir.`,
      "Qiymətlər hər il yenilənir — universitetin rəsmi qəbul səhifəsi ilə birlikdə yoxlamaq tövsiyə olunur. Ümumi büdcəni planlaşdırarkən təhsil haqqına əlavə olaraq yataqxana, qida və nəqliyyat xərclərini də hesablayın.",
    ],
  },
  {
    slug: "tibb",
    title: (loc, y) => `${loc} Tibb Təhsili ${y} — Universitetlər, Qiymətlər, Qəbul | MegaGroup`,
    h1: (loc, y) => `${loc} Tibb Təhsili ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} tibb təhsili ${y}: tibb fakültəsi olan universitetlər, müddət, tədris dili, illik qiymətlər və attestatla qəbul şərtləri. ${name} həkim təhsili üçün tam bələdçi.`,
    intro: (loc) => [
      `${loc} tibb təhsili həm müddətinin beynəlxalq standartlara uyğunluğu, həm də diplomun tanınması baxımından Azərbaycanlı tələbələr üçün cəlbedici seçimdir. Aşağıda tibb fakültəsi təklif edən universitetlər, müddət və tədris dilləri ilə göstərilib.`,
      "Tibb proqramları adətən rəqabətli olur — sənədləri əvvəlcədən hazırlamaq və qəbul tələblərini universitet profilindən dəqiqləşdirmək vacibdir. Qiymətlər universitet səhifəsində daha ətraflı verilir.",
    ],
  },

  {
    slug: "attestatla-qebul",
    title: (loc, y) => `${loc} Attestatla Təhsil ${y} — İmtahansız Qəbul | MegaGroup`,
    h1: (loc, y) => `${loc} Attestatla Təhsil ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} attestatla təhsil ${y}: imtahansız və ya minimal imtahanla qəbul şərtləri, tələb olunan sənədlər, müraciət prosesi və müddətləri. ${name} attestatla qəbul bələdçisi.`,
    intro: (loc) => [
      `${loc} attestatla təhsil — orta məktəb attestatı əsasında, imtahansız və ya minimal imtahanla universitetə qəbul deməkdir. Bu, DIM və ya digər mərkəzləşdirilmiş imtahanlar tələb etməyən qəbul yoludur və Azərbaycanlı tələbələr üçün ən sürətli marşrutdur.`,
      "Qəbul üçün əsas şərtlər: tam orta təhsil attestatı, pasport və universitetin tələb etdiyi sənəd dəsti. Aşağıda bu ölkədə attestatla qəbul qəbul edən universitetlər və tələb olunan sənədlər göstərilib.",
    ],
  },
  {
    slug: "teqaud",
    title: (loc, y) => `${loc} Təqaüd İmkanları ${y} — Burslar və Şərtlər | MegaGroup`,
    h1: (loc, y) => `${loc} Təqaüd İmkanları ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} təqaüd imkanları ${y}: universitet daxili burslar, ən aşağı təhsil haqlı proqramlar və büdcəni azaltmaq yolları. ${name} təhsilində qənaət bələdçisi.`,
    intro: (loc) => [
      `${loc} təhsildə təqaüd imkanları üç qrupda toplanır: universitetin öz akademik bursları, dövlət proqramları və müqavilə əsaslı endirimlər (gpa bursu, qardaş ölkə endirimləri).`,
      "Real praktikada ən böyük qənaət əvvəldən düzgün universitet seçimidir — aşağıda illik təhsil haqqına görə ən əlçatan universitetlər sıralanıb. Büdcənizi hesablarkən yataqxana və yaşayış xərcləri səhifəsindən də istifadə edin.",
    ],
  },
  {
    slug: "yasayis-xercleri",
    title: (loc, y) => `${loc} Yaşayış Xərcləri ${y} — Tələbə Büdcəsi | MegaGroup`,
    h1: (loc, y) => `${loc} Yaşayış Xərcləri ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} yaşayış xərcləri ${y}: yataqxana, qida, nəqliyyat və şəxsi xərclər ayda/ildə nə qədərdir? ${name} tələbə büdcəsi real rəqəmlərlə.`,
    intro: (loc) => [
      `${loc} yaşayış xərcləri təhsil haqqından ayrı planlaşdırılmalıdır. Aşağıdakı cədvəldə universitetlər üzrə yataqxana, qida, nəqliyyat və şəxsi xərc diapazonları ay ərzində göstərilir.`,
      "Rəqəmlər orta göstəricilərdir — şəhər (paytaxt/kənar), yaşayış forması (yataqxana/kirayə) və həyat tərzindən asılı olaraq dəyişə bilər. Təhsil haqqı ilə birlikdə illik ümumi büdcəni qarşılaşdırmaq üçün təhsil haqqı səhifəsinə keçid edin.",
    ],
  },
];

/** RU — hər topic üçün title/meta/intro (f: hal formaları). */
const TOPIC_RU: Record<
  string,
  (f: RuCountryForms, y: number) => { title: string; metaDescription: string; intro: string[] }
> = {
  universitetler: (f, y) => ({
    title: `Университеты ${f.gen} ${y} — список, факультеты и стоимость обучения | MegaGroup`,
    metaDescription: `Университеты ${f.gen} ${y}: государственные и частные вузы, факультеты, стоимость обучения и условия поступления по аттестату. Полный гид для абитуриентов.`,
    intro: [
      `Университеты ${f.gen} — один из самых востребованных вариантов среди азербайджанских абитуриентов. Ниже собраны государственные и частные вузы страны, их факультеты и годовая стоимость обучения.`,
      "Кликните на название вуза, чтобы открыть подробный профиль: условия поступления по аттестату, список документов, общежитие и расходы на проживание. При выборе учитывайте язык обучения, рейтинг специальности и годовой бюджет.",
    ],
  }),
  "tehsil-haqqi": (f, y) => ({
    title: `Стоимость обучения ${f.prep} ${y} — цены университетов | MegaGroup`,
    metaDescription: `Стоимость обучения ${f.prep} ${y}: годовые цены по вузам в USD, расходы на бакалавриат и магистратуру, сравнение самых доступных программ. Бюджет на обучение.`,
    intro: [
      `Стоимость обучения ${f.prep} зависит от вуза, специальности и языка преподавания. В таблице ниже приведены годовые диапазоны цен по университетам на основе актуальных данных.`,
      "Цены обновляются ежегодно — сверяйтесь с официальной страницей приёма вуза. При планировании общего бюджета учитывайте также общежитие, питание и транспорт.",
    ],
  }),
  tibb: (f, y) => ({
    title: `Медицинское образование ${f.prep} ${y} — вузы, цены и поступление | MegaGroup`,
    metaDescription: `Медицинское образование ${f.prep} ${y}: университеты с медицинскими факультетами, срок обучения, язык, годовая стоимость и поступление по аттестату. Гид для будущих врачей.`,
    intro: [
      `Медицинское образование ${f.prep} привлекает азербайджанских абитуриентов международными стандартами обучения и признанием диплома. Ниже — вузы с медицинскими факультетами, срок и языки преподавания.`,
      "Медицинские программы обычно конкурентны — готовьте документы заранее и уточняйте требования на странице конкретного вуза. Стоимость подробно указана в профиле университета.",
    ],
  }),
  "attestatla-qebul": (f, y) => ({
    title: `Поступление по аттестату ${f.prep} ${y} — без экзаменов | MegaGroup`,
    metaDescription: `Поступление по аттестату ${f.prep} ${y}: условия приёма без экзаменов или с минимальными тестами, необходимые документы, сроки и процесс подачи заявки. Полный гид.`,
    intro: [
      `Поступление по аттестату ${f.prep} — это приём в университет на основе школьного аттестата, без централизованных вступительных экзаменов или с минимальными тестами. Это самый быстрый маршрут для абитуриентов из Азербайджана.`,
      "Основные условия: аттестат о полном среднем образовании, паспорт и комплект документов вуза. Ниже — вузы, принимающие по аттестату в этой стране, и список необходимых документов.",
    ],
  }),
  teqaud: (f, y) => ({
    title: `Стипендии и гранты ${f.prep} ${y} — условия и бонусы | MegaGroup`,
    metaDescription: `Стипендии ${f.prep} ${y}: академические стипендии вузов, государственные программы и способы снизить стоимость обучения. Гид по грантам для студентов.`,
    intro: [
      `Стипендиальные возможности ${f.prep} делятся на три группы: академические стипендии самих вузов, государственные программы и договорные скидки (за GPA, по соглашениям с Азербайджаном).`,
      "На практике наибольшая экономия — это правильный выбор вуза с самого начала: ниже университеты отсортированы по годовой стоимости обучения. При расчёте бюджета используйте также страницу расходов на проживание.",
    ],
  }),
  "yasayis-xercleri": (f, y) => ({
    title: `Расходы на проживание ${f.prep} ${y} — бюджет студента | MegaGroup`,
    metaDescription: `Расходы на проживание ${f.prep} ${y}: общежитие, питание, транспорт и личные расходы — сколько стоит месяц студента? Реальный бюджет с цифрами.`,
    intro: [
      `Расходы на проживание ${f.prep} нужно планировать отдельно от стоимости обучения. В таблице ниже — месячные диапазоны затрат на общежитие, питание, транспорт и личные нужды по университетам.`,
      "Цифры средние и зависят от города, типа жилья (общежитие или аренда) и образа жизни. Чтобы сравнить полный годовой бюджет вместе со стоимостью обучения, перейдите на страницу стоимости обучения.",
    ],
  }),
};

/** EN — hər topic üçün title/meta/intro. */
const TOPIC_EN: Record<
  string,
  (name: string, y: number) => { title: string; metaDescription: string; intro: string[] }
> = {
  universitetler: (name, y) => ({
    title: `Universities in ${name} ${y} — List, Faculties and Tuition Fees | MegaGroup`,
    metaDescription: `Universities in ${name} ${y}: public and private universities, faculties, tuition fees and certificate-based admission options. A complete guide for applicants.`,
    intro: [
      `Universities in ${name} are among the most popular choices for Azerbaijani students. The list below brings together public and private universities, faculty offerings and annual tuition fees.`,
      "Click a university name to open its detailed profile: certificate-based admission requirements, documents, dormitory and living costs. When choosing, weigh the language of instruction, programme reputation and your annual budget together.",
    ],
  }),
  "tehsil-haqqi": (name, y) => ({
    title: `Tuition Fees in ${name} ${y} — University Prices | MegaGroup`,
    metaDescription: `Tuition fees in ${name} ${y}: annual university prices in USD, bachelor's and master's costs, and a comparison of the cheapest and most expensive programmes. Study budget.`,
    intro: [
      `Tuition fees in ${name} vary by university, programme and language of instruction. The table below shows annual fee ranges for each university based on real data.`,
      "Fees are updated every year — always verify them on the university's official admission page. When planning your total budget, add dormitory, food and transport costs on top of tuition.",
    ],
  }),
  tibb: (name, y) => ({
    title: `Medical Education in ${name} ${y} — Universities, Fees, Admission | MegaGroup`,
    metaDescription: `Medical education in ${name} ${y}: universities with medical faculties, duration, language of instruction, annual fees and certificate-based admission. A guide for future doctors.`,
    intro: [
      `Medical education in ${name} attracts Azerbaijani students thanks to internationally recognised training standards and diploma recognition. Below are universities with medical faculties, shown with durations and languages of instruction.`,
      "Medical programmes are competitive — prepare your documents early and check each university's requirements on its profile page, where fees are detailed.",
    ],
  }),
  "attestatla-qebul": (name, y) => ({
    title: `Certificate-Based Admission in ${name} ${y} — No Entrance Exams | MegaGroup`,
    metaDescription: `Certificate-based admission in ${name} ${y}: entry with a school certificate — no exams or minimal testing, required documents, deadlines and the application process.`,
    intro: [
      `Certificate-based admission in ${name} means entering university on the basis of your secondary school certificate — without centralised entrance exams. It is the fastest route for Azerbaijani school leavers.`,
      "Key requirements: a full secondary education certificate, passport and the university's required document set. Below are universities accepting certificate-based applicants in this country and the documents you will need.",
    ],
  }),
  teqaud: (name, y) => ({
    title: `Scholarships in ${name} ${y} — Grants and Conditions | MegaGroup`,
    metaDescription: `Scholarships in ${name} ${y}: university academic grants, state programmes and ways to lower your tuition costs. A student funding guide.`,
    intro: [
      `Scholarship opportunities in ${name} fall into three groups: the universities' own academic scholarships, state programmes and contractual discounts (GPA-based, partner-country agreements).`,
      "In practice, the biggest saving comes from choosing the right university from the start — below are the most affordable universities by annual tuition. When planning your budget, also use the living costs page.",
    ],
  }),
  "yasayis-xercleri": (name, y) => ({
    title: `Living Costs in ${name} ${y} — Student Budget | MegaGroup`,
    metaDescription: `Living costs in ${name} ${y}: dormitory, food, transport and personal expenses — what does a month cost? A realistic student budget with figures.`,
    intro: [
      `Living costs in ${name} should be planned separately from tuition fees. The table below shows monthly ranges for dormitory, food, transport and personal expenses across universities.`,
      "Figures are averages and may vary with the city, type of housing (dormitory or rent) and lifestyle. To compare your full annual budget together with tuition, visit the tuition fees page.",
    ],
  }),
};

/** Topic üçün hər dilə uyğun tam copy (title/meta/intro). */
export function topicCopy(
  topic: CountryTopic,
  locale: Locale,
  opts: { azLoc: string; azName: string; enName: string; slug: string },
  year: number,
): CountryTopicCopy {
  if (locale === "az") {
    return {
      title: topic.title(opts.azLoc, year),
      h1: topic.h1(opts.azLoc, year),
      metaDescription: topic.metaDescription(opts.azLoc, opts.azName, year),
      intro: topic.intro(opts.azLoc, opts.azName, year),
    };
  }
  const az = topic.h1(opts.azLoc, year);
  const azMeta = topic.metaDescription(opts.azLoc, opts.azName, year);
  const azIntro = topic.intro(opts.azLoc, opts.azName, year);
  if (locale === "ru") {
    const f = ruCountryForms(opts.slug, opts.azName);
    const t = TOPIC_RU[topic.slug];
    if (t) {
      const c = t(f, year);
      return { title: c.title, h1: topicHeading(topic, locale, f.nom, opts.slug, year), metaDescription: c.metaDescription, intro: c.intro };
    }
    return { title: az, h1: az, metaDescription: azMeta, intro: azIntro };
  }
  const t = TOPIC_EN[topic.slug];
  if (t) {
    const c = t(opts.enName, year);
    return { title: c.title, h1: topicHeading(topic, locale, opts.enName, opts.slug, year), metaDescription: c.metaDescription, intro: c.intro };
  }
  return { title: az, h1: az, metaDescription: azMeta, intro: azIntro };
}

export function getCountryTopic(slug: string): CountryTopic | undefined {
  return COUNTRY_TOPICS.find((t) => t.slug === slug);
}

/** AZ lokativ forma — sait ahəngi qaydası (bax: src/lib/seo.ts). */
export function azLocative(nameAz: string, slug: string): string {
  const known: Record<string, string> = {
    turkiye: "Türkiyədə",
    rusiya: "Rusiyada",
    ukrayna: "Ukraynada",
    gurcustan: "Gürcüstanda",
    qazaxistan: "Qazaxıstanda",
    almaniya: "Almaniyada",
    polsa: "Polşada",
  };
  if (known[slug]) return known[slug];
  return /ə$/.test(nameAz) ? `${nameAz}də` : `${nameAz}da`;
}

/** Lokal ölkə adı — topic başlıqları üçün. */
export function countryNameByLocale(
  c: { name_az: string; name_ru: string; name_en: string },
  locale: Locale,
): string {
  return locale === "ru" ? c.name_ru : locale === "en" ? c.name_en : c.name_az;
}

/** Lokallaşdırılmış H1 (və chip label) — qrammatik RU formaları ilə. */
export function topicHeading(
  topic: CountryTopic,
  locale: Locale,
  name: string,
  slug: string,
  year: number,
): string {
  const az = azLocative(name, slug);
  switch (locale) {
    case "ru": {
      const f = ruCountryForms(slug, name);
      switch (topic.slug) {
        case "universitetler":
          return `Университеты ${f.gen} ${year}`;
        case "tibb":
          return `Медицинское образование ${f.prep} ${year}`;
        case "attestatla-qebul":
          return `Поступление по аттестату ${f.prep} ${year}`;
        case "tehsil-haqqi":
          return `Стоимость обучения ${f.prep} ${year}`;
        case "teqaud":
          return `Стипендии и гранты ${f.prep} ${year}`;
        default:
          return `Расходы на проживание ${f.prep} ${year}`;
      }
    }
    case "en":
      switch (topic.slug) {
        case "universitetler":
          return `Universities in ${name} ${year}`;
        case "tibb":
          return `Medical Education in ${name} ${year}`;
        case "attestatla-qebul":
          return `Certificate-Based Admission in ${name} ${year}`;
        case "tehsil-haqqi":
          return `Tuition Fees in ${name} ${year}`;
        case "teqaud":
          return `Scholarships in ${name} ${year}`;
        default:
          return `Living Costs in ${name} ${year}`;
      }
    default:
      return topic.h1(az, year);
  }
}
