import type { Country } from "@/types";

type RawCountry = Omit<
  Country,
  "name" | "description" | "advantages_az" | "advantages_ru" | "advantages_en"
>;

const rawCountries: RawCountry[] = [
  {
    id: "c1",
    slug: "turkiye",
    name_az: "Türkiyə",
    name_ru: "Турция",
    name_en: "Turkey",
    flag_emoji: "🇹🇷",
    description_az:
      "Attestatla, DIM imtahanı olmadan qəbul — ən çox seçilən ölkə. Yaxın mədəniyyət, ucuz təhsil, keyfiyyətli universitetlər.",
    description_ru:
      "Поступление по аттестату, без экзамена DIM — самый популярный выбор. Близкая культура, доступное обучение, качественные университеты.",
    description_en:
      "Admission by certificate, without DIM exam — the most popular choice. Close culture, affordable education, quality universities.",
    hero_image_url:
      "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80",
    sort_order: 1,
    is_active: true,
    is_featured: true,
    quick_stats: {
      universities: 200,
      avg_tuition_usd: 1500,
      language: "Türkçe / İngilis",
      visa_difficulty: "easy",
    },
    advantages: [
      "Attestatla qəbul — DIM imtahanı tələb olunmur",
      "Mədəniyyət və mətbəx yaxın — adaptasiya asan",
      "Təhsil haqqı aşağı, burs imkanları çox",
      "Avropa kredit sistemi (ECTS) tanınır",
      "Tələbə vizi asan və sürətli",
      "Müqavilə əsaslı oxumaq mümkün",
    ],
    documents_required: [
      "Attestat (orijinal + tərcümə)",
      "Transkript (notar təsdiqli)",
      "Pasport (6 ay müddətli)",
      "6 foto (3x4)",
      "Dil sertifikatı (varsa)",
      "Bank spravka (maliyyə sübutu)",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Attestat, transkript və digər sənədləri toplayın." },
      { step: 2, title: "Universitet seçimi", description: "MegaGroup konsultantı sizə uyğun universitet seçir." },
      { step: 3, title: "Müraciət və qəbul məktubu", description: "Müraciət edilir, qəbul məktubu alınır." },
      { step: 4, title: "Viza və yola düşmə", description: "Tələbə vizası alınır və Türkiyəyə yola düşürsünüz." },
    ],
  },
  {
    id: "c2",
    slug: "rusiya",
    name_az: "Rusiya",
    name_ru: "Россия",
    name_en: "Russia",
    flag_emoji: "🇷🇺",
    description_az:
      "Rus dilində təhsil — keyfiyyətli tibb və mühəndislik ixtisasları. Azərbaycan tələbələri üçün ənənəvi seçim.",
    description_ru:
      "Обучение на русском языке — качественные медицинские и инженерные специальности. Традиционный выбор для азербайджанских студентов.",
    description_en:
      "Russian-language education — quality medical and engineering programs. A traditional choice for Azerbaijani students.",
    hero_image_url:
      "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80",
    sort_order: 2,
    is_active: true,
    is_featured: false,
    quick_stats: {
      universities: 150,
      avg_tuition_usd: 2500,
      language: "Rus dili",
      visa_difficulty: "easy",
    },
    advantages: [
      "Rus dili Azərbaycanlılar üçün tanış",
      "Tibb və mühəndislik güclü",
      "Dövlət kvotaları mövcuddur",
      "Yaşayış xərci ucuz",
      "Tanış mədəni mühit",
      "Diplom MDB-də tanınır",
    ],
    documents_required: [
      "Attestat (tərcümə və apostil)",
      "Transkript",
      "Pasport",
      "Tibbi sertifikat",
      "HIV testi",
      "4 foto",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Sənədləri toplayın və tərcümə edin." },
      { step: 2, title: "Universitet seçimi", description: "İxtisas və universitet seçin." },
      { step: 3, title: "Müraciət", description: "Müraciət və qəbul məktubu." },
      { step: 4, title: "Viza və yola düşmə", description: "Viza alıb yola düşün." },
    ],
  },
  {
    id: "c3",
    slug: "ukrayna",
    name_az: "Ukrayna",
    name_ru: "Украина",
    name_en: "Ukraine",
    flag_emoji: "🇺🇦",
    description_az:
      "Tibb təhsili üçün populyar seçim. İngilis dilində oxumaq mümkündür.",
    description_ru:
      "Популярный выбор для медицинского образования. Возможно обучение на английском языке.",
    description_en:
      "A popular choice for medical education. English-language programs are available.",
    hero_image_url:
      "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=1200&q=80",
    sort_order: 3,
    is_active: true,
    is_featured: false,
    warning_banner:
      "Diqqət: Hazırda müharibə şəraitinə görə bəzi regionlarda təhsil məhdudlaşdırılıb. Yalnız təhlükəsiz regionları seçin.",
    quick_stats: {
      universities: 80,
      avg_tuition_usd: 3500,
      language: "Ukraynaca / İngilis",
      visa_difficulty: "medium",
    },
    advantages: [
      "İngilis dilində tibb təhsili",
      "Tibb diplomu Avropada tanınır",
      "Xərc nisbətən aşağı",
      "Sürətli qəbul prosesi",
      "Klinik təcrübə imkanları",
      "PMQ imtahanına hazırlıq",
    ],
    documents_required: [
      "Attestat (tərcümə)",
      "Transkript",
      "Pasport",
      "Tibbi sertifikat",
      "İngilis dili sübutu (IELTS)",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Sənədləri toplayın." },
      { step: 2, title: "Universitet seçimi (təhlükəsiz region)", description: "Təhlükəsiz regionda universitet seçin." },
      { step: 3, title: "Müraciət və dəvət məktubu", description: "Dəvət məktubu (invitation) alın." },
      { step: 4, title: "Viza və yola düşmə", description: "Viza alıb yola düşün." },
    ],
  },
  {
    id: "c4",
    slug: "almaniya",
    name_az: "Almaniya",
    name_ru: "Германия",
    name_en: "Germany",
    flag_emoji: "🇩🇪",
    description_az:
      "Pulsuz və ya ucuz təhsil — Avropanın ən keyfiyyətli universitetləri. Mühəndislik üçün ideal.",
    description_ru:
      "Бесплатное или доступное обучение — лучшие университеты Европы. Идеально для инженерных специальностей.",
    description_en:
      "Free or affordable education — Europe's best universities. Ideal for engineering.",
    hero_image_url:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80",
    sort_order: 4,
    is_active: true,
    is_featured: false,
    quick_stats: {
      universities: 100,
      avg_tuition_usd: 0,
      language: "Alman / İngilis",
      visa_difficulty: "hard",
    },
    advantages: [
      "Dövlət universitetlərində pulsuz təhsil",
      "Mühəndislik və texnologiya lideri",
      "Avropa diplomu — qlobal tanınma",
      "Tələbə üçün iş icazəsi",
      "Yüksək həyat səviyyəsi",
      "Araşdırma imkanları geniş",
    ],
    documents_required: [
      "Attestat + Studienkolleg (hazırlıq)",
      "Alman dili (TestDaF/DSH) və ya İngilis (IELTS)",
      "Pasport",
      "Maliyyə sübutu (~11.000 EUR/il)",
      "Sığorta",
      "Motivasiya məktubu",
    ],
    application_steps: [
      { step: 1, title: "Dil hazırlığı", description: "Alman/İngilis dilini yaxşılaşdırın." },
      { step: 2, title: "Studienkolleg və ya birbaşa qəbul", description: "Hazırlıq kursu və ya birbaşa müraciət." },
      { step: 3, title: "Müraciət (Uni-assist)", description: "Uni-assist vasitəsilə müraciət." },
      { step: 4, title: "Viza və yola düşmə", description: "Tələbə vizası və yola düşmə." },
    ],
  },
  {
    id: "c5",
    slug: "polsa",
    name_az: "Polşa",
    name_ru: "Польша",
    name_en: "Poland",
    flag_emoji: "🇵🇱",
    description_az:
      "İngilis dilində təhsil — xüsusilə tibb və stomatologiya. Avropa ittifaqı ölkəsi.",
    description_ru:
      "Обучение на английском языке — особенно медицина и стоматология. Страна Евросоюза.",
    description_en:
      "English-language education — especially medicine and dentistry. An EU member state.",
    hero_image_url:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
    sort_order: 5,
    is_active: true,
    is_featured: false,
    quick_stats: {
      universities: 60,
      avg_tuition_usd: 5000,
      language: "Polyak / İngilis",
      visa_difficulty: "medium",
    },
    advantages: [
      "İngilis dilində tibb proqramları",
      "Avropa ittifaqı diplomu",
      "Yaşayış xərci münasib",
      "PMQ/USMLE hazırlıq dəstəyi",
      "Müasir kampuslar",
      "Viza prosesi nisbətən asan",
    ],
    documents_required: [
      "Attestat (tərcümə və apostil)",
      "Transkript",
      "Pasport",
      "İngilis dili sübutu (IELTS 6.0+)",
      "Maliyyə sübutu",
      "Sığorta",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Sənədləri toplayın və apostil edin." },
      { step: 2, title: "Universitet seçimi", description: "İngilis bölməsi olan universitet seçin." },
      { step: 3, title: "Müraciət və qəbul", description: "Müraciət və qəbul məktubu." },
      { step: 4, title: "Viza və yola düşmə", description: "Viza alıb yola düşün." },
    ],
  },
  {
    id: "c6",
    slug: "gurcustan",
    name_az: "Gürcüstan",
    name_ru: "Грузия",
    name_en: "Georgia",
    flag_emoji: "🇬🇪",
    description_az:
      "Attestatla, imtahansız qəbul — Azərbaycana ən yaxın ölkələrdən biri. Tbilisi və Batumidə ingilis dilində tibb təhsili, əlçatan yaşayış xərcləri.",
    description_ru:
      "Поступление по аттестату, без экзаменов — одна из ближайших к Азербайджану стран. Медицина на английском в Тбилиси и Батуми, доступная стоимость жизни.",
    description_en:
      "Admission by certificate, exam-free — one of the closest countries to Azerbaijan. English-language medicine in Tbilisi and Batumi, affordable cost of living.",
    hero_image_url:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
    sort_order: 6,
    is_active: true,
    is_featured: false,
    quick_stats: {
      universities: 25,
      avg_tuition_usd: 4000,
      language: "İngilis / Gürcü",
      visa_difficulty: "easy",
    },
    advantages: [
      "Attestatla qəbul — imtahan tələb olunmur",
      "Azərbaycana ən yaxın ölkələrdən biri",
      "İngilis dilində tibb proqramları",
      "Yaşayış xərcləri əlçatan",
      "WHO siyahısında olan universitetlər",
      "Viza prosesi asan və sürətli",
    ],
    documents_required: [
      "Attestat (orijinal + tərcümə)",
      "Transkript (notar təsdiqli)",
      "Pasport (6 ay müddətli)",
      "6 foto (3x4)",
      "Tibbi arayış",
      "Maliyyə sübutu",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Attestat, transkript və digər sənədləri toplayın." },
      { step: 2, title: "Universitet seçimi", description: "Tbilisi və ya Batumidə uyğun universitet seçin." },
      { step: 3, title: "Müraciət və qəbul", description: "Müraciəti göndərin və qəbul məktubunu alın." },
      { step: 4, title: "Viza və yola düşmə", description: "Sənədləri tamamlayıb yola düşün." },
    ],
  },
  {
    id: "c7",
    slug: "qazaxistan",
    name_az: "Qazaxıstan",
    name_ru: "Казахстан",
    name_en: "Kazakhstan",
    flag_emoji: "🇰🇿",
    description_az:
      "Attestatla, imtahansız qəbul — türk dünyasına yaxın mədəniyyət və əlçatan təhsil haqqı. Nazarbayev Universiteti və digər aparıcı ali məktəblərdə ingilis dilində keyfiyyətli təhsil.",
    description_ru:
      "Поступление по аттестату, без экзаменов — близкая тюркская культура и доступная стоимость обучения. Качественное образование на английском языке в Назарбаев Университете и других вузах.",
    description_en:
      "Admission by certificate, exam-free — a culturally close Turkic country with affordable tuition. Quality English-language education at Nazarbayev University and other leading institutions.",
    hero_image_url:
      "https://images.unsplash.com/photo-1642430571845-798ea94120a6?w=1200&q=80",
    sort_order: 7,
    is_active: true,
    is_featured: true,
    quick_stats: {
      universities: 40,
      avg_tuition_usd: 3000,
      language: "İngilis / Rus / Qazax",
      visa_difficulty: "easy",
    },
    advantages: [
      "Attestatla qəbul — mərkəzləşdirilmiş imtahan tələb olunmur",
      "Türk dünyasına yaxın mədəniyyət və mentalitet",
      "Təhsil haqqı və yaşayış xərcləri əlçatandır",
      "İngilis dilində beynəlxalq proqramlar (Nazarbayev Un. və b.)",
      "Mühəndislik, neft-qaz və IT sahələrində güclü təhsil",
      "Tələbə vizası prosesi asan və sürətli",
    ],
    documents_required: [
      "Attestat (orijinal + tərcümə)",
      "Transkript (notar təsdiqli)",
      "Pasport (6 ay müddətli)",
      "6 foto (3x4)",
      "Tibbi arayış",
      "Maliyyə sübutu",
    ],
    application_steps: [
      { step: 1, title: "Sənədlərin hazırlanması", description: "Attestat, transkript və digər sənədləri toplayın." },
      { step: 2, title: "Universitet seçimi", description: "Astana və ya Almatıda uyğun universitet seçin." },
      { step: 3, title: "Müraciət və qəbul", description: "Müraciəti göndərin və qəbul məktubunu alın." },
      { step: 4, title: "Viza və yola düşmə", description: "Sənədləri tamamlayıb yola düşün." },
    ],
  },
];

export const countries: Country[] = rawCountries.map((c) => ({
  ...c,
  name: c.name_az,
  description: c.description_az,
  advantages_az: c.advantages,
  advantages_ru: c.advantages,
  advantages_en: c.advantages,
}));

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

