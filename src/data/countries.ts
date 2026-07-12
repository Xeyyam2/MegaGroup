import type { Country, Locale } from "@/types";

type RawCountry = Omit<
  Country,
  | "name" | "description"
  | "advantages_az" | "documents_required_az" | "application_steps_az"
> & {
  advantages_ru?: string[];
  advantages_en?: string[];
  documents_required_ru?: string[];
  documents_required_en?: string[];
  application_steps_ru?: { step: number; title: string; description: string }[];
  application_steps_en?: { step: number; title: string; description: string }[];
  warning_banner_az?: string;
  warning_banner_ru?: string;
  warning_banner_en?: string;
};

const rawCountries: RawCountry[] = [
  {
    id: "c1", slug: "turkiye",
    name_az: "Türkiyə", name_ru: "Турция", name_en: "Turkey",
    flag_emoji: "🇹🇷",
    description_az: "Attestatla, DIM imtahanı olmadan qəbul — ən çox seçilən ölkə. Yaxın mədəniyyət, ucuz təhsil, keyfiyyətli universitetlər.",
    description_ru: "Поступление по аттестату, без экзамена DIM — самый популярный выбор. Близкая культура, доступное обучение, качественные университеты.",
    description_en: "Admission by certificate, without DIM exam — the most popular choice. Close culture, affordable education, quality universities.",
    hero_image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&q=80",
    sort_order: 1, is_active: true, is_featured: true,
    quick_stats: {
      universities: 200,
      avg_tuition_usd: 1500,
      language: "Türkçe / İngilis",
      language_az: "Türkçe / İngilis",
      language_ru: "Турецкий / Английский",
      language_en: "Turkish / English",
      visa_difficulty: "easy",
    },
    advantages: ["Attestatla qəbul — DIM imtahanı tələb olunmur","Mədəniyyət və mətbəx yaxın — adaptasiya asan","Təhsil haqqı aşağı, burs imkanları çox","Avropa kredit sistemi (ECTS) tanınır","Tələbə vizi asan və sürətli","Müqavilə əsaslı oxumaq mümkün"],
    advantages_ru: ["Поступление по аттестату — экзамен DIM не требуется","Близкая культура и кухня — лёгкая адаптация","Низкая плата за обучение, много стипендий","Признаётся европейская кредитная система (ECTS)","Студенческая виза оформляется легко и быстро","Возможно обучение по контракту"],
    advantages_en: ["Admission by certificate — no DIM exam required","Close culture and cuisine — easy adaptation","Low tuition fees, many scholarship opportunities","European Credit System (ECTS) recognized","Student visa is easy and fast","Contract-based study available"],
    documents_required: ["Attestat (orijinal + tərcümə)","Transkript (notar təsdiqli)","Pasport (6 ay müddətli)","6 foto (3x4)","Dil sertifikatı (varsa)","Bank spravka (maliyyə sübutu)"],
    documents_required_ru: ["Аттестат (оригинал + перевод)","Транскрипт (нотариально заверенный)","Паспорт (срок действия 6 месяцев)","6 фотографий (3x4)","Сертификат о языке (при наличии)","Банковская справка (финансовое подтверждение)"],
    documents_required_en: ["Certificate (original + translation)","Transcript (notarized)","Passport (6 months validity)","6 photos (3x4)","Language certificate (if available)","Bank statement (financial proof)"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Attestat, transkript və digər sənədləri toplayın."},{"step":2,"title":"Universitet seçimi","description":"MegaGroup konsultantı sizə uyğun universitet seçir."},{"step":3,"title":"Müraciət və qəbul məktubu","description":"Müraciət edilir, qəbul məktubu alınır."},{"step":4,"title":"Viza və yola düşmə","description":"Tələbə vizası alınır və Türkiyəyə yola düşürsünüz."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите аттестат, транскрипт и другие документы."},{"step":2,"title":"Выбор университета","description":"Консультант MegaGroup подберёт подходящий университет."},{"step":3,"title":"Подача и письмо о зачислении","description":"Подача заявки, получение письма о зачислении."},{"step":4,"title":"Виза и отъезд","description":"Оформление студенческой визы и отъезд в Турцию."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather your certificate, transcript and other documents."},{"step":2,"title":"University Selection","description":"MegaGroup consultant selects the right university for you."},{"step":3,"title":"Application & Acceptance Letter","description":"Application is submitted, acceptance letter received."},{"step":4,"title":"Visa & Departure","description":"Student visa is obtained and you depart for Turkey."}],
  },
  {
    id: "c2", slug: "rusiya",
    name_az: "Rusiya", name_ru: "Россия", name_en: "Russia",
    flag_emoji: "🇷🇺",
    description_az: "Rus dilində təhsil — keyfiyyətli tibb və mühəndislik ixtisasları. Azərbaycan tələbələri üçün ənənəvi seçim.",
    description_ru: "Обучение на русском языке — качественные медицинские и инженерные специальности. Традиционный выбор для азербайджанских студентов.",
    description_en: "Russian-language education — quality medical and engineering programs. A traditional choice for Azerbaijani students.",
    hero_image_url: "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80",
    sort_order: 2, is_active: true, is_featured: false,
    quick_stats: {
      universities: 150,
      avg_tuition_usd: 2500,
      language: "Rus dili",
      language_az: "Rus dili",
      language_ru: "Русский",
      language_en: "Russian",
      visa_difficulty: "easy",
    },
    advantages: ["Rus dili Azərbaycanlılar üçün tanış","Tibb və mühəndislik güclü","Dövlət kvotaları mövcuddur","Yaşayış xərci ucuz","Tanış mədəni mühit","Diplom MDB-də tanınır"],
    advantages_ru: ["Русский язык знаком азербайджанцам","Сильные медицинские и инженерные специальности","Имеются государственные квоты","Низкая стоимость проживания","Знакомая культурная среда","Диплом признаётся в СНГ"],
    advantages_en: ["Russian language is familiar to Azerbaijanis","Strong medical and engineering programs","Government quotas available","Low cost of living","Familiar cultural environment","Diploma recognized in the CIS"],
    documents_required: ["Attestat (tərcümə və apostil)","Transkript","Pasport","Tibbi sertifikat","HIV testi","4 foto"],
    documents_required_ru: ["Аттестат (перевод и апостиль)","Транскрипт","Паспорт","Медицинская справка","Тест на ВИЧ","4 фотографии"],
    documents_required_en: ["Certificate (translation and apostille)","Transcript","Passport","Medical certificate","HIV test","4 photos"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Sənədləri toplayın və tərcümə edin."},{"step":2,"title":"Universitet seçimi","description":"İxtisas və universitet seçin."},{"step":3,"title":"Müraciət","description":"Müraciət və qəbul məktubu."},{"step":4,"title":"Viza və yola düşmə","description":"Viza alıb yola düşün."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите и переведите документы."},{"step":2,"title":"Выбор университета","description":"Выберите специальность и университет."},{"step":3,"title":"Подача","description":"Подача заявки и письмо о зачислении."},{"step":4,"title":"Виза и отъезд","description":"Получение визы и отъезд."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather and translate your documents."},{"step":2,"title":"University Selection","description":"Choose your specialty and university."},{"step":3,"title":"Application","description":"Submit application and receive acceptance letter."},{"step":4,"title":"Visa & Departure","description":"Get your visa and depart."}],
  },
  {
    id: "c3", slug: "ukrayna",
    name_az: "Ukrayna", name_ru: "Украина", name_en: "Ukraine",
    flag_emoji: "🇺🇦",
    description_az: "Tibb təhsili üçün populyar seçim. İngilis dilində oxumaq mümkündür.",
    description_ru: "Популярный выбор для медицинского образования. Возможно обучение на английском языке.",
    description_en: "A popular choice for medical education. English-language programs are available.",
    hero_image_url: "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=1200&q=80",
    sort_order: 3, is_active: true, is_featured: false,
    warning_banner_az: "Diqqət: Hazırda müharibə şəraitinə görə bəzi regionlarda təhsil məhdudlaşdırılıb. Yalnız təhlükəsiz regionları seçin.",
    warning_banner_ru: "Внимание: В связи с военной ситуацией в некоторых регионах обучение ограничено. Выбирайте только безопасные регионы.",
    warning_banner_en: "Attention: Due to the current war situation, education is limited in some regions. Choose only safe regions.",
    quick_stats: {
      universities: 80,
      avg_tuition_usd: 3500,
      language: "Ukraynaca / İngilis",
      language_az: "Ukraynaca / İngilis",
      language_ru: "Украинский / Английский",
      language_en: "Ukrainian / English",
      visa_difficulty: "medium",
    },
    advantages: ["İngilis dilində tibb təhsili","Tibb diplomu Avropada tanınır","Xərc nisbətən aşağı","Sürətli qəbul prosesi","Klinik təcrübə imkanları","PMQ imtahanına hazırlıq"],
    advantages_ru: ["Медицинское образование на английском языке","Медицинский диплом признаётся в Европе","Стоимость относительно невысокая","Быстрый процесс поступления","Возможности клинической практики","Подготовка к экзамену PMQ"],
    advantages_en: ["Medical education in English","Medical diploma recognized in Europe","Relatively low cost","Fast admission process","Clinical practice opportunities","Preparation for PMQ exam"],
    documents_required: ["Attestat (tərcümə)","Transkript","Pasport","Tibbi sertifikat","İngilis dili sübutu (IELTS)"],
    documents_required_ru: ["Аттестат (перевод)","Транскрипт","Паспорт","Медицинская справка","Подтверждение английского языка (IELTS)"],
    documents_required_en: ["Certificate (translation)","Transcript","Passport","Medical certificate","English language proof (IELTS)"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Sənədləri toplayın."},{"step":2,"title":"Universitet seçimi (təhlükəsiz region)","description":"Təhlükəsiz regionda universitet seçin."},{"step":3,"title":"Müraciət və dəvət məktubu","description":"Dəvət məktubu (invitation) alın."},{"step":4,"title":"Viza və yola düşmə","description":"Viza alıb yola düşün."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите документы."},{"step":2,"title":"Выбор университета (безопасный регион)","description":"Выберите университет в безопасном регионе."},{"step":3,"title":"Подача и приглашение","description":"Получите приглашение (invitation)."},{"step":4,"title":"Виза и отъезд","description":"Получите визу и отправляйтесь."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather your documents."},{"step":2,"title":"University Selection (safe region)","description":"Choose a university in a safe region."},{"step":3,"title":"Application & Invitation","description":"Receive an invitation letter."},{"step":4,"title":"Visa & Departure","description":"Get your visa and depart."}],
  },
  {
    id: "c4", slug: "almaniya",
    name_az: "Almaniya", name_ru: "Германия", name_en: "Germany",
    flag_emoji: "🇩🇪",
    description_az: "Pulsuz və ya ucuz təhsil — Avropanın ən keyfiyyətli universitetləri. Mühəndislik üçün ideal.",
    description_ru: "Бесплатное или доступное обучение — лучшие университеты Европы. Идеально для инженерных специальностей.",
    description_en: "Free or affordable education — Europe's best universities. Ideal for engineering.",
    hero_image_url: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80",
    sort_order: 4, is_active: true, is_featured: false,
    quick_stats: {
      universities: 100,
      avg_tuition_usd: 0,
      language: "Alman / İngilis",
      language_az: "Alman / İngilis",
      language_ru: "Немецкий / Английский",
      language_en: "German / English",
      visa_difficulty: "hard",
    },
    advantages: ["Dövlət universitetlərində pulsuz təhsil","Mühəndislik və texnologiya lideri","Avropa diplomu — qlobal tanınma","Tələbə üçün iş icazəsi","Yüksək həyat səviyyəsi","Araşdırma imkanları geniş"],
    advantages_ru: ["Бесплатное обучение в государственных университетах","Лидер в инженерии и технологиях","Европейский диплом — мировое признание","Разрешение на работу для студентов","Высокий уровень жизни","Широкие исследовательские возможности"],
    advantages_en: ["Free education at public universities","Leader in engineering and technology","European diploma — global recognition","Work permit for students","High standard of living","Extensive research opportunities"],
    documents_required: ["Attestat + Studienkolleg (hazırlıq)","Alman dili (TestDaF/DSH) və ya İngilis (IELTS)","Pasport","Maliyyə sübutu (~11.000 EUR/il)","Sığorta","Motivasiya məktubu"],
    documents_required_ru: ["Аттестат + Studienkolleg (подготовка)","Немецкий язык (TestDaF/DSH) или английский (IELTS)","Паспорт","Финансовое подтверждение (~11.000 EUR/год)","Медицинская страховка","Мотивационное письмо"],
    documents_required_en: ["Certificate + Studienkolleg (preparation)","German language (TestDaF/DSH) or English (IELTS)","Passport","Financial proof (~€11,000/year)","Health insurance","Motivation letter"],
    application_steps: [{"step":1,"title":"Dil hazırlığı","description":"Alman/İngilis dilini yaxşılaşdırın."},{"step":2,"title":"Studienkolleg və ya birbaşa qəbul","description":"Hazırlıq kursu və ya birbaşa müraciət."},{"step":3,"title":"Müraciət (Uni-assist)","description":"Uni-assist vasitəsilə müraciət."},{"step":4,"title":"Viza və yola düşmə","description":"Tələbə vizası və yola düşmə."}],
    application_steps_ru: [{"step":1,"title":"Языковая подготовка","description":"Улучшите знание немецкого/английского языка."},{"step":2,"title":"Studienkolleg или прямое поступление","description":"Подготовительный курс или прямая подача."},{"step":3,"title":"Подача (Uni-assist)","description":"Подайте заявку через Uni-assist."},{"step":4,"title":"Виза и отъезд","description":"Получите студенческую визу и отправляйтесь."}],
    application_steps_en: [{"step":1,"title":"Language Preparation","description":"Improve your German/English skills."},{"step":2,"title":"Studienkolleg or Direct Admission","description":"Preparatory course or direct application."},{"step":3,"title":"Application (Uni-assist)","description":"Submit your application via Uni-assist."},{"step":4,"title":"Visa & Departure","description":"Get your student visa and depart."}],
  },
  {
    id: "c5", slug: "polsa",
    name_az: "Polşa", name_ru: "Польша", name_en: "Poland",
    flag_emoji: "🇵🇱",
    description_az: "İngilis dilində təhsil — xüsusilə tibb və stomatologiya. Avropa ittifaqı ölkəsi.",
    description_ru: "Обучение на английском языке — особенно медицина и стоматология. Страна Евросоюза.",
    description_en: "English-language education — especially medicine and dentistry. An EU member state.",
    hero_image_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&q=80",
    sort_order: 5, is_active: true, is_featured: false,
    quick_stats: {
      universities: 60,
      avg_tuition_usd: 5000,
      language: "İngilis",
      language_az: "İngilis",
      language_ru: "Английский",
      language_en: "English",
      visa_difficulty: "medium",
    },
    advantages: ["İngilis dilində tibb proqramları","Avropa ittifaqı diplomu","Yaşayış xərci münasib","PMQ/USMLE hazırlıq dəstəyi","Müasir kampuslar","Viza prosesi nisbətən asan"],
    advantages_ru: ["Медицинское образование на английском языке","Диплом Европейского союза","Современные кампусы и больницы","Подготовка к PMQ/USMLE","Разрешение на работу для студентов","Относительно недорогое проживание"],
    advantages_en: ["Medical education in English","European Union diploma","Modern campuses and hospitals","PMQ/USMLE preparation support","Work permit for students","Relatively affordable living"],
    documents_required: ["Attestat (tərcümə və apostil)","Transkript","Pasport","İngilis dili sübutu (IELTS 6.0+)","Maliyyə sübutu","Sığorta"],
    documents_required_ru: ["Аттестат (перевод)","Транскрипт","Паспорт","Подтверждение английского языка (IELTS)","Медицинская справка","Финансовое подтверждение"],
    documents_required_en: ["Certificate (translation)","Transcript","Passport","English language proof (IELTS)","Medical certificate","Financial proof"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Sənədləri toplayın və apostil edin."},{"step":2,"title":"Universitet seçimi","description":"İngilis bölməsi olan universitet seçin."},{"step":3,"title":"Müraciət və qəbul","description":"Müraciət və qəbul məktubu."},{"step":4,"title":"Viza və yola düşmə","description":"Viza alıb yola düşün."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите и переведите документы."},{"step":2,"title":"Выбор университета","description":"Выберите медицинский университет."},{"step":3,"title":"Подача и письмо о зачислении","description":"Подайте заявку и получите письмо о зачислении."},{"step":4,"title":"Виза и отъезд","description":"Получите визу типа D и отправляйтесь."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather and translate your documents."},{"step":2,"title":"University Selection","description":"Choose a medical university."},{"step":3,"title":"Application & Acceptance Letter","description":"Apply and receive your acceptance letter."},{"step":4,"title":"Visa & Departure","description":"Get a Type D visa and depart."}],
  },
  {
    id: "c6", slug: "gurcustan",
    name_az: "Gürcüstan", name_ru: "Грузия", name_en: "Georgia",
    flag_emoji: "🇬🇪",
    description_az: "Attestatla, imtahansız qəbul — Azərbaycana ən yaxın ölkələrdən biri. Tbilisi və Batumidə ingilis dilində tibb təhsili, əlçatan yaşayış xərcləri.",
    description_ru: "Поступление по аттестату, без экзаменов — одна из ближайших к Азербайджану стран. Медицина на английском в Тбилиси и Батуми, доступная стоимость жизни.",
    description_en: "Admission by certificate, exam-free — one of the closest countries to Azerbaijan. English-language medicine in Tbilisi and Batumi, affordable cost of living.",
    hero_image_url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
    sort_order: 6, is_active: true, is_featured: false,
    quick_stats: {
      universities: 25,
      avg_tuition_usd: 4000,
      language: "İngilis / Rus",
      language_az: "İngilis / Rus",
      language_ru: "Английский / Русский",
      language_en: "English / Russian",
      visa_difficulty: "easy",
    },
    advantages: ["Attestatla qəbul — imtahan tələb olunmur","Azərbaycana ən yaxın ölkələrdən biri","İngilis dilində tibb proqramları","Yaşayış xərcləri əlçatan","WHO siyahısında olan universitetlər","Viza prosesi asan və sürətli"],
    advantages_ru: ["Поступление по аттестату — экзамены не требуются","Одна из ближайших к Азербайджану стран","Медицинские программы на английском языке","Доступная стоимость проживания","Университеты из списка ВОЗ","Простой и быстрый процесс получения визы"],
    advantages_en: ["Admission by certificate — no exam required","One of the closest countries to Azerbaijan","Medical programs in English","Affordable cost of living","WHO-listed universities","Easy and fast visa process"],
    documents_required: ["Attestat (orijinal + tərcümə)","Transkript (notar təsdiqli)","Pasport (6 ay müddətli)","6 foto (3x4)","Tibbi arayış","Maliyyə sübutu"],
    documents_required_ru: ["Аттестат (оригинал + перевод)","Транскрипт (нотариально заверенный)","Паспорт (6 месяцев срок действия)","6 фотографий (3x4)","Медицинская справка","Финансовое подтверждение"],
    documents_required_en: ["Certificate (original + translation)","Transcript (notarized)","Passport (6 months validity)","6 photos (3x4)","Medical certificate","Financial proof"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Attestat, transkript və digər sənədləri toplayın."},{"step":2,"title":"Universitet seçimi","description":"Tbilisi və ya Batumidə uyğun universitet seçin."},{"step":3,"title":"Müraciət və qəbul","description":"Müraciəti göndərin və qəbul məktubunu alın."},{"step":4,"title":"Viza və yola düşmə","description":"Sənədləri tamamlayıb yola düşün."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите аттестат, транскрипт и другие документы."},{"step":2,"title":"Выбор университета","description":"Выберите университет в Тбилиси или Батуми."},{"step":3,"title":"Подача и зачисление","description":"Отправьте заявку и получите письмо о зачислении."},{"step":4,"title":"Виза и отъезд","description":"Завершите оформление документов и отправляйтесь."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather your certificate, transcript and other documents."},{"step":2,"title":"University Selection","description":"Choose a university in Tbilisi or Batumi."},{"step":3,"title":"Application & Admission","description":"Submit your application and receive acceptance letter."},{"step":4,"title":"Visa & Departure","description":"Complete your documents and depart."}],
  },
  {
    id: "c7", slug: "qazaxistan",
    name_az: "Qazaxıstan", name_ru: "Казахстан", name_en: "Kazakhstan",
    flag_emoji: "🇰🇿",
    description_az: "Attestatla, imtahansız qəbul — türk dünyasına yaxın mədəniyyət və əlçatan təhsil haqqı. Nazarbayev Universiteti və digər aparıcı ali məktəblərdə ingilis dilində keyfiyyətli təhsil.",
    description_ru: "Поступление по аттестату, без экзаменов — близкая тюркская культура и доступная стоимость обучения. Качественное образование на английском языке в Назарбаев Университете и других вузах.",
    description_en: "Admission by certificate, exam-free — a culturally close Turkic country with affordable tuition. Quality English-language education at Nazarbayev University and other leading institutions.",
    hero_image_url: "https://images.unsplash.com/photo-1642430571845-798ea94120a6?w=1200&q=80",
    sort_order: 7, is_active: true, is_featured: true,
    quick_stats: {
      universities: 40,
      avg_tuition_usd: 3000,
      language: "İngilis / Rus / Qazax",
      language_az: "İngilis / Rus / Qazax",
      language_ru: "Английский / Русский / Казахский",
      language_en: "English / Russian / Kazakh",
      visa_difficulty: "easy",
    },
    advantages: ["Attestatla qəbul — mərkəzləşdirilmiş imtahan tələb olunmur","Türk dünyasına yaxın mədəniyyət və mentalitet","Təhsil haqqı və yaşayış xərcləri əlçatandır","İngilis dilində beynəlxalq proqramlar (Nazarbayev Un. və b.)","Mühəndislik, neft-qaz və IT sahələrində güclü təhsil","Tələbə vizası prosesi asan və sürətli"],
    advantages_ru: ["Поступление по аттестату — централизованный экзамен не требуется","Близкая тюркская культура и менталитет","Доступная стоимость обучения и проживания","Международные программы на английском языке (Назарбаев Ун. и др.)","Сильное образование в инженерии, нефтегазе и IT","Простой и быстрый процесс получения студенческой визы"],
    advantages_en: ["Admission by certificate — no centralized exam required","Close Turkic culture and mentality","Affordable tuition and living costs","International programs in English (Nazarbayev Univ. etc.)","Strong education in engineering, oil-gas and IT","Easy and fast student visa process"],
    documents_required: ["Attestat (orijinal + tərcümə)","Transkript (notar təsdiqli)","Pasport (6 ay müddətli)","6 foto (3x4)","Tibbi arayış","Maliyyə sübutu"],
    documents_required_ru: ["Аттестат (оригинал + перевод)","Транскрипт (нотариально заверенный)","Паспорт (6 месяцев срок действия)","6 фотографий (3x4)","Медицинская справка","Финансовое подтверждение"],
    documents_required_en: ["Certificate (original + translation)","Transcript (notarized)","Passport (6 months validity)","6 photos (3x4)","Medical certificate","Financial proof"],
    application_steps: [{"step":1,"title":"Sənədlərin hazırlanması","description":"Attestat, transkript və digər sənədləri toplayın."},{"step":2,"title":"Universitet seçimi","description":"Astana və ya Almatıda uyğun universitet seçin."},{"step":3,"title":"Müraciət və qəbul","description":"Müraciəti göndərin və qəbul məktubunu alın."},{"step":4,"title":"Viza və yola düşmə","description":"Sənədləri tamamlayıb yola düşün."}],
    application_steps_ru: [{"step":1,"title":"Подготовка документов","description":"Соберите аттестат, транскрипт и другие документы."},{"step":2,"title":"Выбор университета","description":"Выберите университет в Астане или Алматы."},{"step":3,"title":"Подача и зачисление","description":"Отправьте заявку и получите письмо о зачислении."},{"step":4,"title":"Виза и отъезд","description":"Завершите оформление документов и отправляйтесь."}],
    application_steps_en: [{"step":1,"title":"Document Preparation","description":"Gather your certificate, transcript and other documents."},{"step":2,"title":"University Selection","description":"Choose a university in Astana or Almaty."},{"step":3,"title":"Application & Admission","description":"Submit your application and receive acceptance letter."},{"step":4,"title":"Visa & Departure","description":"Complete your documents and depart."}],
  },
];

export const countries: Country[] = rawCountries.map((c) => ({
  ...c,
  name: c.name_az,
  description: c.description_az,
  advantages_az: c.advantages,
  advantages_ru: c.advantages_ru,
  advantages_en: c.advantages_en,
  documents_required_az: c.documents_required,
  documents_required_ru: c.documents_required_ru,
  documents_required_en: c.documents_required_en,
  application_steps_az: c.application_steps,
  application_steps_ru: c.application_steps_ru,
  application_steps_en: c.application_steps_en,
  warning_banner_az: c.warning_banner_az,
  warning_banner_ru: c.warning_banner_ru,
  warning_banner_en: c.warning_banner_en,
}));

/** Locale-e gore statik olkani lokallasdirir. */
export function localizeCountry(c: Country, locale: Locale): Country {
  const pick = <T>(az: T, ru?: T | null, en?: T | null): T =>
    locale === "ru" && ru ? ru : locale === "en" && en ? en : az;
  const pickArr = <T>(az: T[], ru?: T[] | null, en?: T[] | null): T[] =>
    locale === "ru" && ru && ru.length ? ru : locale === "en" && en && en.length ? en : az;
  return {
    ...c,
    name: pick(c.name_az, c.name_ru, c.name_en),
    description: pick(c.description_az, c.description_ru, c.description_en),
    advantages: pickArr(c.advantages_az, c.advantages_ru, c.advantages_en),
    documents_required: pickArr(c.documents_required_az, c.documents_required_ru, c.documents_required_en),
    application_steps: pickArr(c.application_steps_az, c.application_steps_ru, c.application_steps_en),
    warning_banner: pick(c.warning_banner_az, c.warning_banner_ru, c.warning_banner_en) || undefined,
    quick_stats: {
      ...c.quick_stats,
      language: pick(c.quick_stats.language_az, c.quick_stats.language_ru, c.quick_stats.language_en),
    },
  };
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

