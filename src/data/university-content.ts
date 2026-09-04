/**
 * Universitet səhifələri (`/xaricde-tehsil/[country]/[university]`) üçün dərin
 * AZ məzmunu (SEO üçün).
 *
 * `country-content.ts` ilə eyni prinsip: landing səhifələri rank olmalı olduğu
 * üçün hər universitet üçün açar sözlə zəngin, unikal, strukturlaşdırılmış
 * məzmun tələb olunur. Bloq məqalələrindən FƏRQLİ mətndir (məqalə = bələdçi,
 * bu = səhifə profili) — duplicate content yaranmaması üçün.
 *
 * Yalnız AZ dilindədir (hədəf açar sözlər AZ-dildir); RU/EN ziyarətçiləri
 * üçün səhifənin əsas datası və bloq məqalələri mövcuddur.
 */

export interface UniversityContentSection {
  heading: string;
  paragraphs: string[];
}

export interface UniversityContent {
  slug: string;
  /** Giriş paraqrafları — ilk 100 sözdə universitet adı + əsas açar sözlər. */
  intro: string[];
  /** Qəbul şərtləri və prosesi haqqında bölmələr. */
  admission: UniversityContentSection[];
  /** Tələb olunan sənədlər siyahısı. */
  documents: string[];
  /** Xərc qeydi (kalkulyatorun altında göstərilir). */
  costNote?: string;
  /** Şəhər və tələbə həyatı. */
  city: UniversityContentSection;
  /** Məzuniyyət, tanınma və karyera imkanları. */
  career: UniversityContentSection;
}

export const UNIVERSITY_CONTENT: Record<string, UniversityContent> = {
  // ============================================================
  // TÜRKİYƏ
  // ============================================================
  "giresun-universiteti": {
    slug: "giresun-universiteti",
    intro: [
      "Giresun Universiteti Türkiyənin Qara dəniz sahilində yerləşən dövlət universitetidir və Azərbaycanlı abituriyentlərə attestatla, DIM və ÖSYM imtahanı olmadan birbaşa qəbul imkanı verir. Tibb, stomatologiya, mühəndislik və humanitar ixtisaslar üzrə təhsil təklif edir.",
      "Universitet dəniz kənarı kampusu, fəal Azərbaycanlı tələbə cəmiyyəti və Türkiyənin böyük şəhərləri ilə müqayisədə xeyli aşağı yaşayış xərcləri ilə seçilir. Giresun şəhəri sakit və təhlükəsiz tələbə mühitinə malikdir.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "Giresun Universiteti xarici tələbələrin qəbulunu attestat ortalaması üzərindən aparır; mərkəzləşdirilmiş imtahan tələb olunmur. Bu səbəbdən DIM imtahanından keçmədən universitet təhsili almaq istəyən məzunlar üçün ən əlçatan Türkiyə variantlarından biridir.",
          "Tibb fakültəsi üçün attestat ortalaması xüsusi əhəmiyyət daşıyır — yüksək bal müraciətdə üstünlük verir. Müqavilə əsaslı (ödənişli) yerlərə qəbul daha genişdir.",
        ],
      },
      {
        heading: "Qəbul prosesi və müddəti",
        paragraphs: [
          "Müraciət MegaGroup vasitəsilə təqdim edilir: attestat və sənədlər hazırlandıqdan sonra universitetə göndərilir və qəbul məktubu adətən 2-4 həftə ərzində gəlir. Qəbuldan sonra tələbə vizası prosesinə başlanılır.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Transkript (son siniflər üzrə)",
      "Pasport (ən azı 6 ay müddətli)",
      "6 ədəd şəkil (3×4)",
      "Varsa, ingilis dili sertifikatı (İngilis bölmələri üçün)",
    ],
    costNote:
      "Giresun Universitetinin illik təhsil haqqı 1,200-3,000 USD arasındadır — Türkiyənin ən sərfəli dövlət universitetlərindəndir. Dəqiq büdcə üçün yuxarıdakı kalkulyatordan istifadə edin.",
    city: {
      heading: "Giresun şəhəri və tələbə həyatı",
      paragraphs: [
        "Giresun Qara dəniz sahilində, fındıq bağları və yaşıl dağlarla əhatə olunmuş bir şəhərdir. Şəhər metropol təlaşından uzaq, sakit və təhlükəsizdir; buna baxmayaraq bütün lazımi infrastruktura malikdir.",
        "Universitetin kampusu dənizə yaxın yerləşir və tələbələr üçün yataqxana, idman və yemək imkanları genişdir. Giresunun Bakı ilə birbaşa uçuş əlaqələri ailənizi tez-tez ziyarət etməyə imkan verir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Giresun Universitetinin diplomu YÖK tərəfindən tanınır və Azərbaycanda nostrifikasiya olunur. Tibb məzunları Türkiyədə TUS imtahanı ilə ixtisaslaşa və ya Azərbaycanda təcrübəyə davam edə bilər.",
        "Mühəndislik və iqtisadiyyat məzunları üçün Türkiyənin inkişaf edən sənaye və xidmət sektorunda geniş karyera imkanları mövcuddur.",
      ],
    },
  },
  "istanbul-universiteti": {
    slug: "istanbul-universiteti",
    intro: [
      "İstanbul Universiteti 1453-cü ildən davam edən tarixi ilə Türkiyənin ən qədim ali təhsil müəssisəsidir və İstanbul şəhərinin mərkəzində yerləşir. Min illik akademik ənənəsi və güclü tibb, hüquq fakültələri ilə beynəlxalq tələbələrin diqqətini çəkir.",
      "Universitetin tarixi kampusu Süleymaniyyə bölgəsindədir və müasir laboratoriyalarla təchiz olunub. İki qitəni birləşdirən İstanbul şəhəri tələbələrə mədəniyyət və karyera baxımından sonsuz imkanlar təqdim edir.",
    ],
    admission: [
      {
        heading: "Sənəd əsaslı qəbul",
        paragraphs: [
          "İstanbul Universitetinə xarici tələbə müraciəti attestat və transkript əsasında dəyərləndirilir; DIM kimi mərkəzləşdirilmiş imtahan tələb olunmur. Rəqabətli fakültələrdə (tibb, hüquq) attestat ortalaması əsas meyardır.",
          "Müraciət sənədləri MegaGroup tərəfindən hazırlanıb universitetə təqdim edilir və qəbul nəticəsi adətən 3-5 həftə ərzində bildirilir.",
        ],
      },
      {
        heading: "Rəqabətli ixtisaslar üçün tövsiyələr",
        paragraphs: [
          "Tibb və hüquq fakültələri ən çox müraciət alan ixtisaslardır. Yüksək attestat ortalaması və güclü motivasiya məktubu qəbul şansını əhəmiyyətli dərəcədə artırır.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Transkript (9-11-ci sinif qiymətləri)",
      "Pasport (ən azı 6 ay müddətli)",
      "6 ədəd şəkil (3×4)",
      "Motivasiya məktubu (rəqabətli ixtisaslar üçün)",
    ],
    costNote:
      "İstanbul Universitetinin illik təhsil haqqı 1,500-3,500 USD arasındadır. Nəzərə alın ki, İstanbul Türkiyənin ən bahalı şəhəridir — yaşayış xərcləri Anadolu şəhərlərindən yüksəkdir.",
    city: {
      heading: "İstanbul şəhəri və tələbə həyatı",
      paragraphs: [
        "İstanbul 15 milyondan çox əhalisi olan, iki qitəni birləşdirən dünya metropoludur. Universitetin tarixi kampusu şəhərin mədəni və sosial həyatının tam mərkəzində yerləşir.",
        "Şəhərdə böyük Azərbaycan icması və fəal tələbə birlikləri fəaliyyət göstərir. Muzeylər, teatrlar və karyera imkanları İstanbulu təkcə təhsil deyil, həyat təcrübəsi üçün də cəlbedici edir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "İstanbul Universitetinin məzunları Türkiyə və dünyada tanınan diplom əldə edir; diplom Azərbaycanda nostrifikasiya olunur. Universitetin geniş məzun şəbəkəsi karyera qurmaqda ciddi üstünlük verir.",
        "Hüquq və tibb məzunları həm Türkiyədə, həm də Azərbaycanda prestijli vəzifələrdə çalışmaq imkanına malikdir.",
      ],
    },
  },
  // ============================================================
  // RUSİYA
  // ============================================================
  "moskva-dovlet-universiteti": {
    slug: "moskva-dovlet-universiteti",
    intro: [
      "Moskva Dövlət Universiteti (MDU) 1755-ci ildə Mixail Lomonosovun təşəbbüsü ilə yaradılıb və Rusiyanın ən qədim, ən nüfuzlu ali məktəbidir. 12 Nobel mükafatçısı yetişdirən universitet dünya reytinqlərində Rusiya universitetləri arasında ən yüksək mövqedədir.",
      "Universitetin tarixi binası Moskva çayının sahilində, Vorobyovı Qorıda yerləşir. Tibb, fizika və iqtisadiyyat fakültələri beynəlxalq tələbələr arasında ən populyar ixtisaslardır.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "MDU xarici tələbələri attestat əsasında qəbul edir; DIM kimi mərkəzləşdirilmiş imtahan tələb olunmur. Rəqabətli fakültələrdə (tibb, fizika) attestat ortalaması və onlayn müsahibə nəzərə alınır.",
          "Rus dilini bilməyən tələbələr üçün universitetdə bir illik hazırlıq fakültəsi (podfak) mövcuddur — dil və əsas fənlər üzrə təlim verilir.",
        ],
      },
      {
        heading: "Qəbul prosesi və müddəti",
        paragraphs: [
          "Müraciət sənədləri MegaGroup vasitəsilə hazırlanır və universitetə təqdim edilir. Qəbul məktubu adətən 3-6 həftə ərzində gəlir, sonra Rusiya tələbə vizası prosesinə başlanılır.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Tibbi arayış (HIV testi daxil)",
      "6 ədəd şəkil (3×4)",
      "Hazırlıq ili üçün podfak qeydiyyatı (rus dili lazımdırsa)",
    ],
    costNote:
      "MDU-nun illik təhsil haqqı 2,500-5,000 USD arasındadır — Qərbi Avropa universitetlərindən xeyli aşağıdır. Yataqxana aylıq 40-100 USD təşkil edir.",
    city: {
      heading: "Moskva şəhəri və tələbə həyatı",
      paragraphs: [
        "Moskva Rusiyanın paytaxtı və ən böyük şəhəridir. Dünya səviyyəli muzeylər, teatrlar və beynəlxalq şirkətlərin ofisləri tələbələrə geniş imkanlar yaradır.",
        "MDU-nun kampusunda yataqxanalar, idman obyektləri və Rusiyanın ən böyük universitet kitabxanalarından biri yerləşir. Şəhərdə fəal Azərbaycan icması var.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "MDU diplomu beynəlxalq səviyyədə tanınır və Azərbaycanda nostrifikasiya olunur. Məzunlar Rusiyanın aparıcı şirkətlərində, elmi institutlarda və beynəlxalq korporasiyalarda işləyə bilər.",
        "MDU-nun məşhur məzunları arasında Nobel mükafatçıları, görkəmli alimlər və dövlət xadimləri var — diplomun özü güclü akademik brenddir.",
      ],
    },
  },
  "sankt-peterburg-universiteti": {
    slug: "sankt-peterburg-universiteti",
    intro: [
      "Sankt-Peterburq Dövlət Universiteti (SPbGU) 1724-cü ildə Pyotr I tərəfindən yaradılıb və Rusiyanın ən qədim universitetidir. 300 illik tarixi ərzində universitet 9 Nobel mükafatçısı ilə bağlıdır.",
      "Universitet Vasilyevski adasında, Neva çayının sahilində yerləşir. Filologiya və hüquq fakültələri ən güclü proqramlarıdır və şəhər 'Şimali Venesiya' adlanan Sankt-Peterburqun mərkəzindədir.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "SPbGU xarici tələbələri attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul edir. Hüquq fakültəsi rəqabətlidir və attestat ortalaması nəzərə alınır; filologiya fakültəsi daha açıq qəbuldur.",
          "Rus dili bilməyən tələbələr üçün hazırlıq fakültəsi mövcuddur — bir il ərzində dil və əsas fənlər tədris olunur.",
        ],
      },
      {
        heading: "Qəbul prosesi və müddəti",
        paragraphs: [
          "Müraciət MegaGroup vasitəsilə aparılır: sənədlər hazırlanıb universitetə göndərilir və qəbul məktubu adətən 3-5 həftəyə gəlir. Ardınca tələbə vizası üçün müraciət edilir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Tibbi arayış",
      "Şəkillər (3×4)",
      "Hazırlıq ili üçün podfak qeydiyyatı (rus dili lazımdırsa)",
    ],
    costNote:
      "SPbGU-nun illik təhsil haqqı 2,200-4,500 USD arasındadır. Yataqxana aylıq cəmi 35-90 USD-dir — tərəfdaş universitetlər arasında ən ucuz yaşayış variantıdır.",
    city: {
      heading: "Sankt-Peterburq şəhəri və tələbə həyatı",
      paragraphs: [
        "Sankt-Peterburq kanalları, sarayları və Ermitaj muzeyi ilə məşhur mədəni paytaxtdır. Şəhər Moskvadan daha sakit və tələbə dostu atmosferə malikdir.",
        "SPbGU-nun əsas kampusu Vasilyevski adasında, Neva sahilindədir. Şəhərdə fəal Azərbaycan icması və tələbə birlikləri fəaliyyət göstərir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "SPbGU diplomu dünyada tanınır və Azərbaycanda nostrifikasiya olunur. Məzunlar arasında dövlət başçıları və görkəmli hüquqşünaslar var.",
      ],
    },
  },
  // ============================================================
  // UKRAYNA
  // ============================================================
  "kiev-tibb-universiteti": {
    slug: "kiev-tibb-universiteti",
    intro: [
      "Kiev Tibb Universiteti (Kyiv Medical University) Ukraynanın tanınmış özəl tibb universitetidir və tam ingilis dilində tibb və stomatologiya təhsili təklif edir. Avropada tanınan diplom və PMQ hazırlığı dəstəyi əsas üstünlükləridir.",
      "Vacib qeyd: Ukraynada hazırkı vəziyyətə görə təhsil seçimi yalnız təhlükəsiz regionlarla məhdudlaşır. MegaGroup vəziyyəti izləyir və hər tələbəyə cari vəziyyət barədə fərdi məsləhət verir.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "Kiev Tibb Universiteti xarici tələbələri attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul edir. İngilis dilində təhsil üçün IELTS 6.0+ və ya universitetin daxili dil testi kifayətdir.",
          "Qəbul prosesi beynəlxalq tələbələr üçün sadələşdirilib və sənədlər onlayn təqdim oluna bilər; qəbul məktubu adətən 2-4 həftəyə gəlir.",
        ],
      },
      {
        heading: "Təhlükəsizlik barədə qeyd",
        paragraphs: [
          "Müharibə şəraitində yerləşdirmə qərarı verməzdən əvvəl hazırkı təhlükəsizlik vəziyyəti yoxlanılır. Yalnız təhlükəsiz regionlardakı universitetlər tövsiyə olunur; ən son məlumat üçün MegaGroup ilə əlaqə saxlayın.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "IELTS 6.0+ və ya daxili dil testi nəticəsi",
      "Şəkillər (3×4)",
      "Tibbi arayış",
    ],
    costNote:
      "Kiev Tibb Universitetinin illik təhsil haqqı 3,500-5,500 USD arasındadır — Qərbi Avropa tibb məktəblərindən xeyli ucuzdur.",
    city: {
      heading: "Şəhər və tələbə həyatı haqqında qeyd",
      paragraphs: [
        "Universitet haqqında şəhər məlumatı verməzdən əvvəl təhlükəsizlik vəziyyətini nəzərə almaq vacibdir. Ukrayna istiqaməti üzrə hazırkı vəziyyət və təhlükəsiz regionlar barədə ən son məlumatı MegaGroup-dan əldə edə bilərsiniz.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Universitetin məzunları Avropada tanınan tibb diplomu ilə Böyük Britaniyada PMQ və digər Avropa ölkələrində lisenziya imtahanları verə bilər. Diplom Azərbaycanda da nostrifikasiya olunur.",
      ],
    },
  },
  "lvov-universiteti": {
    slug: "lvov-universiteti",
    intro: [
      "Lvov Universiteti (Lviv Ivan Franko National University) 1661-ci ildə yaradılıb və Qərbi Ukraynanın ən qədim, ən nüfuzlu universitetidir. İqtisadiyyat, hüquq və humanitar elmlər üzrə geniş proqram seçimi təklif edir.",
      "Lvov şəhəri Polşa sərhədinə yaxın yerləşir və UNESCO siyahılı tarixi mərkəzi ilə məşhurdur. Ukraynada hazırkı vəziyyətdə Lvov təhsil üçün ən təhlükəsiz şəhərlərdən biri hesab olunur.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "Lvov Universiteti xarici tələbələri attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul edir. İngilis dilində proqramlar üçün universitetin daxili dil testi və ya IELTS kifayətdir.",
          "Müraciət sənədləri onlayn və ya MegaGroup vasitəsilə təqdim olunur; qəbul məktubu adətən 2-4 həftəyə gəlir.",
        ],
      },
      {
        heading: "Təhlükəsiz region üstünlüyü",
        paragraphs: [
          "Lvov Ukraynanın qərbində yerləşdiyi üçün ölkənin ən təhlükəsiz bölgələrindəndir. Universitet tədrisi davam etdirir və beynəlxalq tələbələri qəbul edir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Şəkillər (3×4)",
      "Dil testi nəticəsi (ingilis dilində proqramlar üçün)",
      "Tibbi arayış",
    ],
    costNote:
      "Lvov Universitetinin illik təhsil haqqı 3,000-4,800 USD arasındadır. Yaşayış xərcləri Avropanın ən aşağı göstəricilərindəndir — yataqxana aylıq 50-110 USD.",
    city: {
      heading: "Lvov şəhəri və tələbə həyatı",
      paragraphs: [
        "Lvov Ukraynanın mədəni paytaxtı sayılır — Avropa memarlığı, kafe mədəniyyəti və canlı gənc əhali ilə seçilir. Şəhər kiçik və rahatdır, hər yerə piyada getmək mümkündür.",
        "Yaşayış xərcləri Kiyevdən də aşağıdır və tələbələr üçün geniş yataqxana və kirayə seçimi var. Şəhərin Polşa sərhədinə yaxınlığı Avropaya səyahəti asanlaşdırır.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Lvov Universitetinin diplomu Ukraynada tanınır, Avropada dəyərləndirilir və Azərbaycanda nostrifikasiya olunur. Avropa universitetləri ilə əməkdaşlıq tələbə mübadiləsi imkanları yaradır.",
      ],
    },
  },
  // ============================================================
  // GÜRCÜSTAN
  // ============================================================
  "tbilisi-dovlet-tibb-universiteti": {
    slug: "tbilisi-dovlet-tibb-universiteti",
    intro: [
      "Tbilisi Dövlət Tibb Universiteti (TSMU) 1918-ci ildə yaradılıb və Gürcüstanın ən qədim, ən nüfuzlu tibb universitetidir. Universitet WHO və FAIMER siyahısındadır — bu, diplomun beynəlxalq tanınması deməkdir.",
      "TSMU tam ingilis dilində 6 illik ümumi tibb (MD) proqramı təklif edir və Bakıya ən yaxın xarici tibb təhsili mərkəzlərindəndir. Azərbaycan vətəndaşları Gürcüstana vizasız giriş edə bilər.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "TSMU xarici tələbələri attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul edir. Tibb fakültəsi rəqabətlidir — attestat ortalaması və ingilis dili sübutu (IELTS 5.5-6.0) vacibdir.",
          "Dil sübutu olmayan tələbələr üçün universitetdə hazırlıq ili keçmək imkanı var. Qəbul məktubu adətən 2-4 həftəyə gəlir.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbuldan sonra qəbul məktubu əsasında Gürcüstanda tələbə statusu (sxeloba) alınır və hər il yenilənir. Proses MegaGroup tərəfindən tam idarə olunur.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Şəkillər (3×4)",
      "İngilis dili sübutu (IELTS 5.5-6.0 və ya hazırlıq ili)",
      "Bəzi hallarda motivasiya məktubu",
    ],
    costNote:
      "TSMU-nun illik təhsil haqqı 3,500-5,500 USD arasındadır. Tbilisidə aylıq yaşayış xərcləri təxminən 220-420 USD təşkil edir.",
    city: {
      heading: "Tbilisi şəhəri və tələbə həyatı",
      paragraphs: [
        "Tbilisi tarixi mərkəzi, canlı gecə həyatı və çoxmillətli tələbə mühiti ilə seçilir. Şəhərdə böyük Azərbaycan icması var və bir çox məkan Azərbaycan dilində xidmət göstərir.",
        "Klinik təcrübə Gürcüstanın aparıcı xəstəxanalarında keçirilir. Bakıya yaxınlıq ailənizi istənilən vaxt ziyarət etməyə imkan verir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "TSMU məzunları WHO/FAIMER siyahılı universitetin MD diplomunu alır və ABŞ-da USMLE, Böyük Britaniyada PLAB imtahanları verə bilər. Diplom Azərbaycanda nostrifikasiya olunur.",
      ],
    },
  },
  "batumi-shota-rustaveli-universiteti": {
    slug: "batumi-shota-rustaveli-universiteti",
    intro: [
      "Batumi Şota Rustaveli Dövlət Universiteti 1935-ci ildə yaradılıb və Gürcüstanın Acarıstan regionunun aparıcı ali məktəbidir. Qara dəniz sahilindəki kampusu ilə Azərbaycana ən yaxın təhsil mərkəzlərindəndir.",
      "Universitet attestatla, mərkəzləşdirilmiş imtahan olmadan qəbul aparır və mühəndislik, biznes, turizm ixtisasları üzrə ingilis dilində proqramlar təklif edir. Təhsil haqqı tərəfdaş universitetlər arasında ən sərfəlilərindəndir.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "Batumi Universiteti xarici tələbələri attestat əsasında, hər hansı mərkəzləşdirilmiş imtahan tələb etmədən qəbul edir. Sənəd prosesi sadədir — attestat, pasport və şəkillər kifayətdir.",
          "İngilis dilində proqramlar üçün dil sübutu (IELTS 5.5+ və ya müsahibə) tövsiyə olunur. Qəbul məktubu adətən 2-3 həftəyə gəlir.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbuldan sonra tələbə statusu (sxeloba) alınır və Batumidə yaşayış təşkil edilir. Azərbaycan vətəndaşları üçün viza tələb olunmur.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Şəkillər (3×4)",
      "Varsa, IELTS 5.5+ (ingilis dilində proqramlar üçün)",
    ],
    costNote:
      "Batumi Universitetinin illik təhsil haqqı 2,000-3,500 USD arasındadır — ən sərfəli variantlardandır. Batumidə aylıq yaşayış xərcləri təxminən 220-460 USD-dir.",
    city: {
      heading: "Batumi şəhəri və tələbə həyatı",
      paragraphs: [
        "Batumi Qara dəniz sahilində sürətlə inkişaf edən kurort şəhəridir — müasir göydələnlər, çimərliklər və canlı gecə həyatı bir arada. Şəhər eyni zamanda sakit və təhlükəsizdir.",
        "Batumi Bakıdan avtomobillə və ya birbaşa uçuşla asan çatılan şəhərdir. Yaşayış xərcləri Tbilisidən aşağıdır və mühit tələbələr üçün dostdur.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Batumi Universitetinin diplomu Gürcüstanda tanınır və Azərbaycanda nostrifikasiya olunur. Turizm məzunları Batuminin inkişaf edən otel sektorunda, biznes məzunları isə yerli və beynəlxalq şirkətlərdə işləyə bilər.",
      ],
    },
  },
  // ============================================================
  // QAZAXISTAN
  // ============================================================
  "al-farabi-qazax-milli-universiteti": {
    slug: "al-farabi-qazax-milli-universiteti",
    intro: [
      "Əl-Farabi adına Qazax Milli Universiteti (KazNU) 1934-cü ildə yaradılıb və QS kimi beynəlxalq reytinqlərdə Orta Asiyanın ən yaxşı universitetidir. 20 mindən çox tələbəyə təhsil verən böyük elmi-tədqiqat mərkəzidir.",
      "Universitet Almatının mərkəzində, dağ mənzərəli müasir kampusda yerləşir. IT, beynəlxalq münasibətlər, biznes və tibb üzrə ingilis və rus dillərində proqramlar təklif edir.",
    ],
    admission: [
      {
        heading: "Attestat əsaslı qəbul",
        paragraphs: [
          "KazNU xarici tələbələri attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul edir. İngilis dilində proqramlar üçün IELTS 5.5+ tələb olunur; dil sübutu olmayanlar üçün hazırlıq kursu mövcuddur.",
          "Tibb fakültəsi rəqabətlidir və attestat ortalaması nəzərə alınır. Qəbul prosesi 2-4 həftə çəkir və MegaGroup tərəfindən tam idarə olunur.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbul məktubu əsasında Qazaxıstanda tələbə vizası alınır və Almatıda yaşayış təşkil edilir. Ölkəyə gəldikdən sonra 3 gün ərzində miqrasiya qeydiyyatı aparılır.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "Şəkillər (3×4)",
      "Varsa, IELTS 5.5+ (ingilis dilində proqramlar üçün)",
      "Tibbi arayış",
    ],
    costNote:
      "KazNU-nun illik təhsil haqqı 2,000-4,000 USD arasındadır — Avropa və Türkiyə universitetlərindən xeyli ucuzdur. Almatıda aylıq yaşayış xərcləri təxminən 230-410 USD-dir.",
    city: {
      heading: "Almatı şəhəri və tələbə həyatı",
      paragraphs: [
        "Almatı Qazaxıstanın ən böyük şəhəri və mədəni-biznes mərkəzidir. Dağların ətəyində yerləşən şəhər geniş parkları, canlı tələbə həyatı və müasir infrastrukturu ilə seçilir.",
        "Mədəniyyət və mentalitet Azərbaycana yaxın olduğu üçün adaptasiya asandır. KazNU-nun kampusunda beynəlxalq tələbələr üçün yataqxana, idman və tələbə klubları var.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "KazNU diplomu Orta Asiyada və Azərbaycanda tanınır. Məzunlar Qazaxıstanın inkişaf edən neft-qaz, IT və biznes sektorlarında, həmçinin beynəlxalq şirkətlərdə işləyə bilər.",
      ],
    },
  },
  "nazarbayev-universiteti": {
    slug: "nazarbayev-universiteti",
    intro: [
      "Nazarbayev Universiteti (NU) 2010-cu ildə Astanada yaradılıb və Qazaxıstanın ən prestijli, dünyada ən tanınan universitetidir. Tədris tam ingilis dilində aparılır — bu, Qazaxıstanda nadir haldır.",
      "Universitet beynəlxalq partnyorlarla birgə proqramlar və müasir tədqiqat mərkəzləri ilə seçilir. Diqqət: NU-ya qəbul rəqabətlidir — attestatla sadə qəbuldan fərqlənir və ən güclü abituriyentlər üçün nəzərdə tutulub.",
    ],
    admission: [
      {
        heading: "Rəqabətli qəbul prosesi",
        paragraphs: [
          "Nazarbayev Universitetinə qəbul üçün yüksək attestat ortalaması, IELTS 6.0+ və ya TOEFL nəticəsi, motivasiya məktubu və bəzi fakültələrdə müsahibə tələb olunur. Rəqabətli fakültələrdə qəbul xüsusilə çətindir.",
          "MegaGroup müraciət prosesində sənədlərin hazırlanması, motivasiya məktubunun yazılması və müsahibəyə hazırlıqda dəstək göstərir.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbuldan sonra tələbə vizası prosesinə başlanılır və Astanada kampus yaşayışı təşkil edilir. NU-nun kampusunda müasir yataqxanalar və tələbə mərkəzləri var.",
        ],
      },
    ],
    documents: [
      "Attestat (yüksək ortalama ilə)",
      "IELTS 6.0+ və ya TOEFL nəticəsi",
      "Motivasiya məktubu",
      "Müsahibə (rəqabətli fakültələrdə)",
      "Pasport və şəkillər",
    ],
    costNote:
      "NU-nun illik təhsil haqqı 3,500-6,000 USD arasındadır. Universitet güclü tələbələr üçün təqaüd imkanları təklif edir; Astanada aylıq yaşayış təxminən 300-560 USD-dir.",
    city: {
      heading: "Astana şəhəri və tələbə həyatı",
      paragraphs: [
        "Astana Qazaxıstanın paytaxtı və ən sürətlə inkişaf edən şəhəridir — futuristik memarlığı ilə məşhurdur. NU kampusu şəhərin yeni mərkəzində, Expo ərazisinə yaxın yerləşir.",
        "NU kampusunda 60-dan çox ölkədən tələbə təhsil alır — mühit tam beynəlxalqdır. İdman kompleksi, kitabxana və tələbə klubları geniş imkanlar təqdim edir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "NU məzunları tam ingilis dilində təhsil sayəsində beynəlxalq şirkətlərdə və elmi mərkəzlərdə işləyə bilər; bir çox məzun dünyanın aparıcı universitetlərində magistratura təhsilini davam etdirir. Diplom Azərbaycanda nostrifikasiya olunur.",
      ],
    },
  },
  // ============================================================
  // ALMANİYA
  // ============================================================
  "munchen-texniki-universiteti": {
    slug: "munchen-texniki-universiteti",
    intro: [
      "Münxen Texniki Universiteti (TUM) 1868-ci ildə yaradılıb və dünyanın ən yaxşı texniki universitetlərindəndir. 17 Nobel mükafatçısı yetişdirən universitet mühəndislik, informatika və texnologiya üzrə qlobal liderdir.",
      "TUM dövlət universiteti olduğu üçün təhsil praktiki olaraq pulsuzdur — yalnız illik semestr rüsumu ödənilir. Siemens, BMW kimi şirkətlərlə güclü əlaqələr tələbələrə real layihələrdə iştirak imkanı verir.",
    ],
    admission: [
      {
        heading: "Studienkolleg və qəbul prosesi",
        paragraphs: [
          "Azərbaycan attestatı Almaniyada birbaşa universitet qəbulu üçün tam tanınmadığından əksər tələbələr əvvəlcə bir illik Studienkolleg keçir və Feststellungsprüfung imtahanı verir.",
          "Alman dilində proqramlar üçün TestDaF/DSH (B2-C1), ingilis dilində proqramlar üçün IELTS 6.5+ tələb olunur. Müraciət Uni-assist platforması vasitəsilə aparılır və APS sertifikatı mütləqdir.",
        ],
      },
      {
        heading: "Viza və maliyyə tələbləri",
        paragraphs: [
          "Tələbə vizası üçün bloklanmış hesabda (Sperrkonto) ~€11,208 illik məbləğ və sığorta tələb olunur. MegaGroup bütün prosesi addım-addım idarə edir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə + apostil)",
      "APS sertifikatı",
      "Studienkolleg qəbul sənədi",
      "Dil sertifikatı: TestDaF/DSH və ya IELTS/TOEFL",
      "Bloklanmış hesab sübutu (~€11,208/il)",
    ],
    costNote:
      "TUM-da təhsil haqqı yoxdur — yalnız illik ~150-300 avro semestr rüsumu. Münxen Almaniyanın ən bahalı şəhəridir; aylıq yaşayış təxminən 850-1,200 avrodur.",
    city: {
      heading: "Münxen şəhəri və tələbə həyatı",
      paragraphs: [
        "Münxen Bavariyanın paytaxtı və Almaniyanın ən güclü iqtisadiyyatına malik regionudur. TUM-un əsas kampusu şəhərin mərkəzində, texnologiya kampusu isə Garchingdə yerləşir.",
        "Tələbə yataqxanaları, idman obyektləri və endirimli nəqliyyat (semestr bileti) yaşayış xərclərini yumşaldır. Şəhər beynəlxalq mühiti ilə seçilir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "TUM məzunları Siemens, BMW, Bosch, Google kimi şirkətlərdə yüksək maaşlı iş imkanlarına malikdir. Məzuniyyətdən sonra 18 aylıq iş axtarış vizası verilir və diplom dünyada tanınır.",
      ],
    },
  },
  "berlin-universiteti": {
    slug: "berlin-universiteti",
    intro: [
      "Berlin Humboldt Universiteti 1810-cu ildə Vilhelm fon Humboldt tərəfindən yaradılıb və müasir universitet modelinin banisi sayılır. Hegel, Eynşteyn və Qrimm qardaşları burada çalışıb; 29 Nobel mükafatçısı universitetlə bağlıdır.",
      "Universitet Berlinin mərkəzində, Unter den Linden bulvarında yerləşir və 30 mindən çox tələbəyə təhsil verir. Dövlət universiteti olduğu üçün təhsil pulsuzdur.",
    ],
    admission: [
      {
        heading: "Studienkolleg və qəbul prosesi",
        paragraphs: [
          "Azərbaycan attestatı birbaşa qəbul üçün tam tanınmadığından əksər tələbələr əvvəlcə Studienkolleg keçir və Feststellungsprüfung verir. Fəlsəfə üçün alman dili (TestDaF/DSH), biologiya üçün alman və ya ingilis dili tələb olunur.",
          "Müraciət üçün APS sertifikatı mütləqdir; müraciət Uni-assist vasitəsilə aparılır.",
        ],
      },
      {
        heading: "Viza və maliyyə tələbləri",
        paragraphs: [
          "Tələbə vizası üçün bloklanmış hesabda ~€11,208 illik məbləğ tələb olunur. MegaGroup sənəd və viza prosesini tam idarə edir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə + apostil)",
      "APS sertifikatı",
      "Studienkolleg qəbul sənədi",
      "Dil sertifikatı: TestDaF/DSH və ya IELTS/TOEFL",
      "Bloklanmış hesab sübutu (~€11,208/il)",
    ],
    costNote:
      "Humboldt Universitetində təhsil pulsuzdur — yalnız illik ~150-300 avro semestr rüsumu. Berlində aylıq yaşayış xərcləri Münxendən aşağıdır.",
    city: {
      heading: "Berlin şəhəri və tələbə həyatı",
      paragraphs: [
        "Berlin Almaniyanın paytaxtı və Avropanın mədəniyyət mərkəzlərindəndir — incəsənət qalereyaları, tarixi abidələri və canlı startap səhnəsi ilə məşhurdur.",
        "Universitetin əsas binası Unter den Linden bulvarında, tarixi mərkəzdədir. Yaşayış xərcləri Münxendən aşağıdır və tələbə yataqxanaları geniş seçim təklif edir.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Humboldt məzunları dünyanın aparıcı elmi-tədqiqat institutlarında və mədəniyyət qurumlarında işləyir. Məzuniyyətdən sonra 18 aylıq iş axtarış vizası verilir; diplom Azərbaycanda nostrifikasiya olunur.",
      ],
    },
  },
  // ============================================================
  // POLŞA
  // ============================================================
  "varshava-tibb-universiteti": {
    slug: "varshava-tibb-universiteti",
    intro: [
      "Varşava Tibb Universiteti (WUM) Polşanın ən böyük və ən nüfuzlu tibb universitetidir. Avropa İttifaqı diplomu, müasir xəstəxana bazası və PMQ/USMLE hazırlıq dəstəyi əsas üstünlükləridir.",
      "Universitet ingilis dilində 6 illik tibb və 5 illik stomatologiya proqramları təklif edir. Klinik təcrübə Varşavanın aparıcı xəstəxanalarında keçirilir və diplom bütün EU ölkələrində tanınır.",
    ],
    admission: [
      {
        heading: "Attestat və dil tələbləri",
        paragraphs: [
          "WUM-a qəbul attestat əsasında aparılır; ingilis dilində proqramlar üçün IELTS 6.0+ və ya ekvivalent sertifikat tələb olunur. Ümumi tibb açıq qəbuldur, stomatologiya daha rəqabətlidir.",
          "Qəbul prosesi beynəlxalq tələbələr üçün nəzərdə tutulub və adətən 4-8 həftə çəkir. MegaGroup müraciət, sənəd və viza prosesini tam idarə edir.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbul məktubu və maliyyə sübutu əsasında Polşa D tipli tələbə vizası alınır və Varşavada yaşayış təşkil edilir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "IELTS 6.0+ və ya ekvivalent dil sertifikatı",
      "Transkript və attestat əlavəsi",
      "Maliyyə sübutu (viza üçün)",
    ],
    costNote:
      "WUM-un illik təhsil haqqı 4,500-6,500 USD arasındadır. Varşavada aylıq yaşayış xərcləri təxminən 250-500 USD təşkil edir.",
    city: {
      heading: "Varşava şəhəri və tələbə həyatı",
      paragraphs: [
        "Varşava Avropanın ən sürətlə inkişaf edən paytaxtlarından biridir. WUM kampusu şəhərin mərkəzində, ən yaxşı xəstəxanalara yaxın yerləşir.",
        "Şəhərdə beynəlxalq tələbə icması böyükdür və ingilis dili ilə rahat yaşamaq mümkündür. Tələbələr nəqliyyat və mədəniyyətdə güzəştlərdən yararlanır.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "WUM məzunları EU diplomu ilə Avropada birbaşa işləyə bilər və PMQ (Böyük Britaniya), USMLE (ABŞ) imtahanlarına güclü bazaya malikdir. Diplom Azərbaycanda nostrifikasiya olunur.",
      ],
    },
  },
  "krakov-tibb-universiteti": {
    slug: "krakov-tibb-universiteti",
    intro: [
      "Krakov Tibb Universiteti (Yagellon Universitetinin Tibb Kolleci) 1364-cü ildə yaradılmış Avropanın ən qədim universitetlərinin tibb məktəbidir. 600 illik tibb ənənəsi və EU diplomu əsas üstünlükləridir.",
      "Universitet ingilis dilində 6 illik ümumi tibb və 5 illik əczaçılıq proqramları təklif edir. Nicolaus Copernicus da məhz bu universitetdə təhsil alıb.",
    ],
    admission: [
      {
        heading: "Attestat və dil tələbləri",
        paragraphs: [
          "Krakov Tibb Universitetinə qəbul attestat əsasında aparılır; ingilis dilində proqramlar üçün IELTS 6.0+ tələb olunur. Ümumi tibb və əczaçılıq açıq qəbuldur.",
          "Qəbul prosesi 4-8 həftə çəkir. MegaGroup sənədlərin hazırlanması, müraciət və viza prosesini tam idarə edir.",
        ],
      },
      {
        heading: "Qəbuldan sonrakı addımlar",
        paragraphs: [
          "Qəbuldan sonra Polşa D tipli tələbə vizası alınır və Krakovda yaşayış təşkil edilir. Universitet tələbələrə yataqxana seçimində dəstək verir.",
        ],
      },
    ],
    documents: [
      "Attestat (orijinal + notarial tərcümə)",
      "Pasport (ən azı 6 ay müddətli)",
      "IELTS 6.0+ və ya ekvivalent dil sertifikatı",
      "Transkript və attestat əlavəsi",
      "Maliyyə sübutu (viza üçün)",
    ],
    costNote:
      "Krakov Tibb Universitetinin illik təhsil haqqı 4,000-6,000 USD arasındadır — Varşavadan bir qədər aşağıdır. Krakovda aylıq yaşayış təxminən 280-650 USD-dir.",
    city: {
      heading: "Krakov şəhəri və tələbə həyatı",
      paragraphs: [
        "Krakov Polşanın keçmiş paytaxtı və ən qədim universitet şəhəridir. UNESCO siyahılı mərkəzi və Avropanın ən canlı tələbə mühiti ilə seçilir.",
        "Şəhərdə 20-dən çox ali məktəb var və tələbələr əhalinin böyük hissəsini təşkil edir. Yaşayış xərcləri Varşavadan aşağıdır.",
      ],
    },
    career: {
      heading: "Məzuniyyət və karyera imkanları",
      paragraphs: [
        "Krakov Tibb Universitetinin məzunları EU diplomu ilə Avropada tibb lisenziyası almaq imkanına malikdir. Diplom Azərbaycanda nostrifikasiya olunur və məzunlar beynəlxalq tibb mərkəzlərində karyera qura bilər.",
      ],
    },
  },
};

export function getUniversityContent(slug: string): UniversityContent | undefined {
  return UNIVERSITY_CONTENT[slug];
}
