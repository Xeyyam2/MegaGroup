export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface ArticleFAQItem {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  /** Primary keyword this article targets (used in title/description/H1). */
  keyword: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  heroEmoji: string;
  updatedAt: string; // ISO date
  readingMinutes: number;
  relatedCountrySlug?: string;
  intro: string[];
  sections: ArticleSection[];
  faqs: ArticleFAQItem[];
}

export const ARTICLES: Article[] = [
  {
    slug: "xaricde-tehsil-2026-beledcisi",
    keyword: "xaricdə təhsil",
    title: "Xaricdə Təhsil 2026: Attestatla Qəbul, Xərclər və Ölkə Seçimi Bələdçisi",
    metaDescription:
      "Xaricdə təhsil haqqında bilməli olduğunuz hər şey: attestatla qəbul, imtahansız universitetlər, xərclər, viza prosesi və ölkə müqayisəsi. MegaGroup ekspertlərindən tam bələdçi.",
    keywords: [
      "xaricdə təhsil",
      "xaricde tehsil",
      "attestatla xaricdə təhsil",
      "imtahansız xaricə qəbul",
      "xaricdə təhsil xərcləri",
    ],
    excerpt:
      "Attestatla, imtahansız xaricdə təhsil necə mümkündür? Ölkə seçimi, sənədlər, xərclər və qəbul prosesi barədə tam bələdçi.",
    heroEmoji: "🎓",
    updatedAt: "2026-06-01",
    readingMinutes: 9,
    intro: [
      "Hər il minlərlə Azərbaycan məzunu xaricdə təhsil almaq qərarına gəlir, amma çoxu haradan başlayacağını bilmir. Bu bələdçidə xaricdə təhsilin real dəyərini, hansı ölkələrin attestatla (imtahansız) qəbul etdiyini, sənəd prosesini və büdcəni sizin üçün sadə dildə izah edirik.",
      "MegaGroup olaraq son illərdə 1000-dən çox tələbəni Türkiyə, Rusiya, Ukrayna, Almaniya və Polşadakı 200-dən artıq universitetə yerləşdirmişik. Bu təcrübəyə əsaslanaraq, ən çox verilən sualların cavablarını bir yerə topladıq.",
    ],
    sections: [
      {
        heading: "Attestatla xaricdə təhsil həqiqətənmi mümkündür?",
        paragraphs: [
          "Bəli. Bir çox Avropa və qonşu ölkə universiteti abituriyentlərdən DİM və ya SAT tipli mərkəzləşdirilmiş imtahan tələb etmir — orta məktəb attestatınızdakı qiymətlər və (bəzi hallarda) bir müsahibə kifayət edir. Bu, xüsusilə vaxtını itirmək istəməyən və ya Azərbaycandakı qəbul balına görə istədiyi ixtisasa düşə bilməyən məzunlar üçün real alternativdir.",
          "Qəbul şərtləri ölkədən-ölkəyə fərqlənir: bəzi universitetlər sırf attestat middle-score ilə, bəziləri isə əlavə onlayn test və ya motivasiya məktubu ilə qəbul aparır.",
        ],
      },
      {
        heading: "Hansı ölkəni seçmək daha sərfəlidir?",
        paragraphs: [
          "Ölkə seçimi büdcə, istədiyiniz ixtisas və dil bacarığınızdan asılıdır. Aşağıda ən çox seçilən 4 istiqaməti qısaca müqayisə edirik:",
        ],
        list: [
          "Türkiyə — Azərbaycandan ən yaxın və nisbətən ucuz variant, uçuş və gündəlik xərclər əlçatandır, türk dilini öyrənmək asandır.",
          "Rusiya — geniş universitet şəbəkəsi, xüsusilə tibb və mühəndislik sahələrində güclü proqramlar, rus dilini bilənlər üçün rahat keçid.",
          "Ukrayna — tibb təhsilində beynəlxalq diplom tanınması ilə tanınır, nisbətən əlçatan qiymətlər.",
          "Almaniya və Polşa — Avropa İttifaqı diplomu, gələcəkdə Avropada işləmək istəyənlər üçün strateji seçim.",
        ],
      },
      {
        heading: "Xaricdə təhsilin təxmini xərcləri",
        paragraphs: [
          "İllik təhsil haqqı ölkə və universitetdən asılı olaraq 0 (bəzi dövlət proqramlarında pulsuz) ilə bir neçə min dollar arasında dəyişir. Buna əlavə olaraq yaşayış, sığorta və viza xərclərini də hesablamaq lazımdır. MegaGroup-un pulsuz xərc kalkulyatoru ilə seçdiyiniz ölkə üzrə real rəqəmləri saniyələr içində görə bilərsiniz.",
        ],
      },
      {
        heading: "Sənəd prosesi necə gedir?",
        paragraphs: [
          "Ümumi olaraq proses bu addımlardan ibarətdir: universitet və ixtisasın seçilməsi, sənədlərin (attestat, pasport, şəkil) hazırlanması və tərcüməsi, universitetə onlayn müraciət, qəbul məktubunun alınması, viza müraciəti və yerləşmə. MegaGroup bu prosesin hər addımında sizinlə birlikdə işləyir və sənədlərin düzgün formatda hazırlanmasını təmin edir.",
        ],
      },
    ],
    faqs: [
      {
        question: "Xaricdə təhsil üçün DİM imtahanı verməliyəm?",
        answer:
          "Xeyr, bu bələdçidə göstərilən ölkələrin əksər universitetləri attestat əsasında, DİM imtahanı olmadan qəbul aparır.",
      },
      {
        question: "MegaGroup-un xidmətləri pulludurmu?",
        answer:
          "İlkin konsultasiya və ölkə/universitet seçimi tam pulsuzdur. Dəqiq xidmət paketi barədə məlumatı müraciət zamanı komandamızdan ala bilərsiniz.",
      },
      {
        question: "Neçə vaxta qəbul prosesi tamamlanır?",
        answer:
          "Orta hesabla sənədlərin hazırlanmasından universitetə yerləşənə qədər 4-8 həftə vaxt aparır, bu müddət ölkə və universitetdən asılı olaraq dəyişə bilər.",
      },
    ],
  },
  {
    slug: "turkiyede-tehsil",
    keyword: "türkiyədə təhsil",
    title: "Türkiyədə Təhsil 2026: Universitetlər, Qəbul Şərtləri və Xərclər",
    metaDescription:
      "Türkiyədə təhsil almaq istəyənlər üçün tam bələdçi: ən yaxşı universitetlər, attestatla qəbul şərtləri, orta xərclər, viza prosesi və tələbə həyatı haqqında hər şey.",
    keywords: [
      "türkiyədə təhsil",
      "turkiyede tehsil",
      "türkiyə universitetləri",
      "türkiyədə ali təhsil",
      "attestatla türkiyəyə qəbul",
    ],
    excerpt:
      "Türkiyədə təhsilin üstünlükləri, ən populyar universitetlər, orta xərclər və qəbul şərtləri — real rəqəmlərlə tam bələdçi.",
    heroEmoji: "🇹🇷",
    updatedAt: "2026-06-02",
    readingMinutes: 8,
    relatedCountrySlug: "turkiye",
    intro: [
      "Türkiyə, coğrafi yaxınlığı, əlçatan qiymətləri və tanınmış diplomları sayəsində Azərbaycan məzunları arasında xaricdə təhsil üçün ən çox seçilən istiqamətlərdən biridir. Bu yazıda Türkiyədə təhsilin bütün əsas məqamlarını izah edirik.",
    ],
    sections: [
      {
        heading: "Niyə Türkiyədə təhsil?",
        paragraphs: [
          "Bakıdan Türkiyəyə uçuş vaxtı 2-3 saatdır, bu da tez-tez ailənizi ziyarət etməyə imkan verir. Dil baryeri minimaldır — türk dili azərbaycan dilinə yaxın olduğu üçün adaptasiya asandır. Bundan əlavə, bir çox universitet YÖK (Yüksəköyrətim Kurulu) tərəfindən akkreditə olunub və diplomlar beynəlxalq səviyyədə tanınır.",
        ],
      },
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Dövlət universitetlərinin əksəriyyəti YÖS (Yabancı Öğrenci Sınavı) tələb edir, lakin özəl universitetlərin böyük hissəsi yalnız attestat middle-score əsasında, imtahansız qəbul aparır. Bu, vaxt itirmək istəməyən abituriyentlər üçün ən sərfəli yoldur.",
        ],
      },
      {
        heading: "Orta təhsil haqqı və yaşayış xərcləri",
        paragraphs: [
          "Özəl universitetlərdə illik təhsil haqqı ixtisasdan asılı olaraq təxminən 2 500 – 8 000 dollar aralığında dəyişir, dövlət universitetlərində isə xeyli aşağıdır. Yaşayış xərcləri şəhərdən asılıdır: İstanbul nisbətən baha, Anadolu şəhərləri isə daha əlçatandır. Dəqiq rəqəmləri seçdiyiniz universitetə görə hesablamaq üçün MegaGroup-un kalkulyatorundan istifadə edə bilərsiniz.",
        ],
      },
      {
        heading: "Populyar ixtisaslar",
        paragraphs: ["Türkiyə universitetlərində ən çox tələb olunan ixtisas sahələri bunlardır:"],
        list: [
          "Tibb və Diş Həkimliyi",
          "Mühəndislik (Kompüter, İnşaat, Elektrik-Elektronika)",
          "Biznes İdarəetməsi və İqtisadiyyat",
          "Beynəlxalq Münasibətlər",
        ],
      },
    ],
    faqs: [
      {
        question: "Türkiyədə oxumaq üçün türk dilini bilmək şərtdirmi?",
        answer:
          "Xeyr, bir çox universitetdə ingilis dilində tədris olunan proqramlar mövcuddur, amma türk dilində proqram seçsəniz adətən bir illik hazırlıq kursu keçirsiniz.",
      },
      {
        question: "Türkiyə universitet diplomu Azərbaycanda tanınırmı?",
        answer:
          "Bəli, YÖK-akkreditəli universitetlərin diplomları Azərbaycanda ekvivalentləşdirilə bilər.",
      },
      {
        question: "Türkiyəyə tələbə vizası almaq çətindirmi?",
        answer:
          "Qəbul məktubu əlinizdə olduqdan sonra tələbə vizası prosesi nisbətən sadədir; MegaGroup bu prosesdə sizə addım-addım kömək edir.",
      },
    ],
  },
  {
    slug: "rusiyada-tehsil",
    keyword: "rusiyada təhsil",
    title: "Rusiyada Təhsil 2026: Qəbul Şərtləri, Universitetlər və Xərclər",
    metaDescription:
      "Rusiyada təhsil haqqında bilməli olduğunuz hər şey: ən yaxşı universitetlər, tibb və mühəndislik proqramları, attestatla qəbul, xərclər və viza prosesi.",
    keywords: [
      "rusiyada təhsil",
      "rusiyada tehsil",
      "rusiya universitetləri",
      "rusiyada tibb təhsili",
      "attestatla rusiyaya qəbul",
    ],
    excerpt:
      "Rusiyada təhsilin üstünlükləri, ən güclü ixtisas sahələri, orta xərclər və qəbul prosesi haqqında tam bələdçi.",
    heroEmoji: "🇷🇺",
    updatedAt: "2026-06-03",
    readingMinutes: 8,
    relatedCountrySlug: "rusiya",
    intro: [
      "Rusiya, geniş universitet şəbəkəsi və güclü tibb, mühəndislik proqramları ilə Azərbaycan tələbələri arasında ənənəvi olaraq populyar bir istiqamətdir. Rus dilini bilən və ya öyrənmək istəyən tələbələr üçün adaptasiya prosesi olduqca sadədir.",
    ],
    sections: [
      {
        heading: "Rusiyada təhsilin üstünlükləri",
        paragraphs: [
          "Rusiya universitetləri, xüsusilə tibb sahəsində, onilliklər boyu formalaşmış güclü akademik ənənəyə malikdir. Bir çox valideyn və tələbə üçün rus dilinin tanışlığı əlavə üstünlükdür — dil baryerini keçmək üçün əlavə vaxt sərf etməyə ehtiyac qalmır.",
        ],
      },
      {
        heading: "Qəbul şərtləri və sənədlər",
        paragraphs: [
          "Əksər universitetlər attestat qiymətləri əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul aparır. Tələb olunan əsas sənədlər: attestat (notarial tərcümə ilə), pasport, tibbi arayış və şəkillərdir. Tibb ixtisasları üçün bəzən əlavə onlayn müsahibə keçirilə bilər.",
        ],
      },
      {
        heading: "Orta xərclər",
        paragraphs: [
          "Təhsil haqqı şəhər və universitetdən asılı olaraq geniş diapazonda dəyişir — regional universitetlər Moskva və Sankt-Peterburqdakı universitetlərə nisbətən xeyli əlçatandır. Yaşayış xərcləri də bənzər şəkildə şəhərdən asılıdır. Dəqiq büdcə planlaması üçün MegaGroup-un pulsuz kalkulyatorundan istifadə edin.",
        ],
      },
      {
        heading: "Ən çox seçilən ixtisaslar",
        paragraphs: [],
        list: [
          "Tibb və Stomatologiya",
          "Mühəndislik və Aviasiya sənayesi",
          "Neft-qaz mühəndisliyi",
          "İqtisadiyyat və Menecment",
        ],
      },
    ],
    faqs: [
      {
        question: "Rusiyada tibb təhsili neçə il davam edir?",
        answer: "Ümumi tibb ixtisası adətən 6 il, stomatologiya isə 5 il davam edir.",
      },
      {
        question: "Rus dilini bilmədən Rusiyada oxumaq olarmı?",
        answer:
          "Bəzi universitetlərdə ingilis dilində proqramlar mövcuddur, digər hallarda bir illik hazırlıq (dil) kursu təklif olunur.",
      },
      {
        question: "Rusiya diplomu Azərbaycanda tanınırmı?",
        answer: "Bəli, akkreditəli dövlət universitetlərinin diplomları Azərbaycanda tanınır və ekvivalentləşdirilir.",
      },
    ],
  },
  {
    slug: "gurcustanda-tehsil",
    keyword: "gürcüstanda təhsil",
    title: "Gürcüstanda Təhsil 2026: Tbilisi və Batumi Universitetləri, Xərclər",
    relatedCountrySlug: "gurcustan",
    metaDescription:
      "Gürcüstanda təhsil almaq istəyənlər üçün bələdçi: Tbilisi və Batumidəki universitetlər, tibb təhsili, qəbul şərtləri, xərclər və viza prosesi haqqında tam məlumat.",
    keywords: [
      "gürcüstanda təhsil",
      "gurcustanda tehsil",
      "tbilisidə təhsil",
      "gürcüstan universitetləri",
      "gürcüstanda tibb təhsili",
    ],
    excerpt:
      "Gürcüstanda təhsilin üstünlükləri, Tbilisi və Batumidəki populyar universitetlər, xərclər və qəbul şərtləri haqqında tam bələdçi.",
    heroEmoji: "🇬🇪",
    updatedAt: "2026-06-04",
    readingMinutes: 7,
    intro: [
      "Gürcüstan, Azərbaycana yaxınlığı, aşağı yaşayış xərcləri və Avropa standartlarına uyğun tədris proqramları sayəsində son illər xaricdə təhsil üçün getdikcə populyarlaşan bir istiqamətdir. Xüsusilə tibb ixtisası üçün Tbilisi və Batumidəki universitetlər çox sayda beynəlxalq tələbə cəlb edir.",
    ],
    sections: [
      {
        heading: "Niyə Gürcüstanda təhsil?",
        paragraphs: [
          "Bakıdan Tbilisiyə yol ilə cəmi bir neçə saatdır, bu da nəqliyyat xərclərini minimuma endirir və ailə ilə əlaqəni asanlaşdırır. Yaşayış xərcləri regionun digər ölkələri ilə müqayisədə xeyli aşağıdır, bu da xüsusilə orta büdcəli ailələr üçün əlverişli seçimdir.",
        ],
      },
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Gürcüstan universitetlərinin böyük hissəsi qəbulu attestat əsasında, mərkəzləşdirilmiş imtahan olmadan aparır. Tibb ixtisasları üçün bəzi universitetlər əlavə giriş imtahanı (adətən biologiya və kimya üzrə) tələb edə bilər, digər ixtisaslarda isə sadəcə sənəd yoxlaması kifayətdir.",
        ],
      },
      {
        heading: "Tbilisi və Batumidəki populyar ixtisaslar",
        paragraphs: [
          "Gürcüstan universitetləri ingilis dilində tədris olunan tibb proqramları ilə tanınır — bir çox məzun buradan aldığı diplomla Avropa və ABŞ-da fəaliyyət göstərmək hüququ qazanır.",
        ],
        list: [
          "Ümumi Tibb (İngilis dilində, 6 il)",
          "Stomatologiya",
          "Beynəlxalq Biznes və Menecment",
          "Hüquq",
        ],
      },
      {
        heading: "Orta xərclər",
        paragraphs: [
          "İllik təhsil haqqı, ixtisasdan asılı olaraq, regionun digər ölkələri ilə müqayisədə rəqabətqabiliyyətlidir, tibb proqramları isə bir qədər yüksəkdir. Yaşayış xərcləri (mənzil, nəqliyyat, qida) Tbilisidə orta səviyyədədir. Dəqiq büdcənizi planlaşdırmaq üçün MegaGroup komandası ilə əlaqə saxlaya bilərsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Gürcüstanda tibb təhsili ingilis dilində keçilirmi?",
        answer:
          "Bəli, Tbilisi və Batumidəki bir çox tibb universiteti tam ingilis dilində tədris proqramı təklif edir.",
      },
      {
        question: "Gürcüstan universitet diplomu beynəlxalq səviyyədə tanınırmı?",
        answer:
          "WHO/WFME siyahısında olan tibb universitetlərinin diplomları bir çox ölkədə, o cümlədən Azərbaycanda tanınır və ekvivalentləşdirilə bilər.",
      },
      {
        question: "Gürcüstana viza almaq üçün nə lazımdır?",
        answer:
          "Azərbaycan vətəndaşları üçün qısamüddətli səfərlərdə vizasız rejim mövcuddur, uzunmüddətli tələbə statusu üçün isə universitetin qəbul məktubu əsasında müvafiq icazə tələb olunur.",
      },
    ],
  },
  {
    slug: "ukraynada-tehsil",
    keyword: "ukraynada təhsil",
    title: "Ukraynada Təhsil 2026: Tibb və Mühəndislik Proqramları, Xərclər",
    metaDescription:
      "Ukraynada təhsil almaq istəyənlər üçün bələdçi: tibb və mühəndislik proqramları, qəbul şərtləri, orta xərclər və beynəlxalq diplom tanınması haqqında tam məlumat.",
    keywords: [
      "ukraynada təhsil",
      "ukraynada tehsil",
      "ukrayna universitetləri",
      "ukraynada tibb təhsili",
      "attestatla ukraynaya qəbul",
    ],
    excerpt:
      "Ukraynada təhsilin üstünlükləri, tibb və mühəndislik proqramları, orta xərclər və qəbul şərtləri haqqında tam bələdçi.",
    heroEmoji: "🇺🇦",
    updatedAt: "2026-06-05",
    readingMinutes: 7,
    relatedCountrySlug: "ukrayna",
    intro: [
      "Ukrayna, uzun illərdir beynəlxalq tələbələr arasında tibb və mühəndislik təhsili üçün seçilən əsas istiqamətlərdən biri olub. Əlçatan qiymətlər və beynəlxalq səviyyədə tanınan diplomlar bu ölkəni xüsusilə tibb ixtisası düşünən abituriyentlər üçün cəlbedici edir.",
    ],
    sections: [
      {
        heading: "Niyə Ukraynada təhsil?",
        paragraphs: [
          "Ukrayna universitetlərinin bir çoxu WHO (Ümumdünya Səhiyyə Təşkilatı) siyahısında yer alır, bu da məzunlara dünyanın bir çox ölkəsində fəaliyyət göstərmək imkanı verir. Tədris həm ingilis, həm də rus dilində aparılır ki, bu da tələbələrə seçim imkanı yaradır.",
        ],
      },
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Qəbul prosesi əsasən attestat əsasında aparılır və mərkəzləşdirilmiş imtahan tələb olunmur. Tələb olunan sənədlər: attestat (tərcümə və təsdiqlənmiş), pasport, tibbi arayış və fotoşəkillər. Bəzi tibb fakültələri əlavə onlayn müsahibə keçirə bilər.",
        ],
      },
      {
        heading: "Populyar ixtisaslar",
        paragraphs: [],
        list: [
          "Ümumi Tibb və Stomatologiya",
          "Mühəndislik (Aviasiya, Kompüter Elmləri)",
          "Farmasevtika",
          "Beynəlxalq İqtisadiyyat",
        ],
      },
      {
        heading: "Orta xərclər",
        paragraphs: [
          "Təhsil haqqı və yaşayış xərcləri regionun digər ölkələri ilə müqayisədə əlçatan səviyyədədir, xüsusilə tibb ixtisası üçün bu, əhəmiyyətli üstünlükdür. Dəqiq və aktual rəqəmləri MegaGroup komandasından və ya kalkulyator vasitəsilə əldə edə bilərsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ukrayna tibb diplomu beynəlxalq səviyyədə tanınırmı?",
        answer:
          "Bəli, WHO siyahısındakı universitetlərin diplomları bir çox ölkədə, o cümlədən Azərbaycanda tanınır.",
      },
      {
        question: "Ukraynada təhsil hansı dildə aparılır?",
        answer: "Universitetdən asılı olaraq tədris ingilis və ya rus dilində aparılır.",
      },
      {
        question: "Ukraynaya qəbul üçün hansı sənədlər lazımdır?",
        answer:
          "Əsas sənədlər attestat, pasport, tibbi arayış və fotoşəkillərdir; MegaGroup bu sənədlərin hazırlanmasında sizə kömək edir.",
      },
    ],
  },
  {
    slug: "qazaxistanda-tehsil",
    keyword: "qazaxistanda təhsil",
    title: "Qazaxıstanda Təhsil 2026: Universitetlər, Qəbul Şərtləri və Xərclər",
    relatedCountrySlug: "qazaxistan",
    metaDescription:
      "Qazaxıstanda təhsil almaq istəyənlər üçün bələdçi: Almatı və Astanadakı universitetlər, attestatla qəbul şərtləri, orta xərclər və viza prosesi haqqında tam məlumat.",
    keywords: [
      "qazaxistanda təhsil",
      "qazaxistanda tehsil",
      "qazaxıstan universitetləri",
      "almatıda təhsil",
      "attestatla qazaxıstana qəbul",
    ],
    excerpt:
      "Qazaxıstanda təhsilin üstünlükləri, Almatı və Astanadakı populyar universitetlər, xərclər və qəbul şərtləri haqqında tam bələdçi.",
    heroEmoji: "🇰🇿",
    updatedAt: "2026-06-06",
    readingMinutes: 7,
    intro: [
      "Qazaxıstan, türk dünyasına yaxın mədəniyyəti, əlçatan təhsil haqqı və getdikcə güclənən beynəlxalq universitet şəbəkəsi ilə Azərbaycan məzunları arasında son illər populyarlaşan yeni bir istiqamətdir. Bu yazıda Qazaxıstanda təhsilin bütün əsas məqamlarını izah edirik.",
    ],
    sections: [
      {
        heading: "Niyə Qazaxıstanda təhsil?",
        paragraphs: [
          "Qazaxıstan mədəniyyət və mentalitet baxımından Azərbaycana yaxındır, bu da adaptasiya prosesini asanlaşdırır. Ölkədə həm rus, həm də ingilis dilində tədris olunan proqramlar mövcuddur, Nazarbayev Universiteti kimi beynəlxalq səviyyəli təhsil ocaqları isə dünyanın aparıcı universitetləri ilə əməkdaşlıq edir.",
        ],
      },
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Əksər Qazaxıstan universitetləri qəbulu attestat əsasında, mərkəzləşdirilmiş imtahan olmadan aparır. Rəqabətli proqramlarda (məsələn, Nazarbayev Universitetində) yüksək attestat ortalaması və bəzən motivasiya məktubu tələb oluna bilər, digər universitetlərdə isə sadəcə sənəd yoxlaması kifayətdir.",
        ],
      },
      {
        heading: "Populyar ixtisaslar",
        paragraphs: ["Qazaxıstan universitetlərində beynəlxalq tələbələr arasında ən çox seçilən ixtisaslar:"],
        list: [
          "Mühəndislik və İnformasiya Texnologiyaları",
          "Neft-qaz Mühəndisliyi",
          "Beynəlxalq Münasibətlər və Biznes",
          "Tibb",
        ],
      },
      {
        heading: "Orta xərclər",
        paragraphs: [
          "Təhsil haqqı və yaşayış xərcləri regionun digər ölkələri ilə müqayisədə əlçatandır — bu, xüsusilə orta büdcəli ailələr üçün Qazaxıstanı cəlbedici seçim edir. Dəqiq rəqəmləri seçdiyiniz universitetə görə MegaGroup-un kalkulyatoru ilə hesablaya bilərsiniz.",
        ],
      },
    ],
    faqs: [
      {
        question: "Qazaxıstanda təhsil hansı dildə aparılır?",
        answer:
          "Universitetdən asılı olaraq tədris rus, qazax və ya ingilis dilində aparılır; bir çox beynəlxalq proqram tam ingilis dilindədir.",
      },
      {
        question: "Qazaxıstan universitet diplomu Azərbaycanda tanınırmı?",
        answer:
          "Bəli, akkreditəli dövlət universitetlərinin diplomları Azərbaycanda tanınır və ekvivalentləşdirilə bilər.",
      },
      {
        question: "Qazaxıstana tələbə vizası almaq çətindirmi?",
        answer:
          "Xeyr, qəbul məktubu əldə etdikdən sonra tələbə vizası prosesi nisbətən sadədir; MegaGroup bu prosesdə addım-addım kömək edir.",
      },
    ],
  },
  {
    slug: "hansi-olkede-oxumaq-serfelidir",
    keyword: "xaricdə hansı ölkədə oxumaq",
    title: "Türkiyə, Rusiya, Gürcüstan, Ukrayna və Qazaxıstan Müqayisəsi — Hansı Ölkədə Oxumaq Daha Sərfəlidir?",
    metaDescription:
      "Türkiyə, Rusiya, Gürcüstan, Ukrayna və Qazaxıstanda təhsili xərc, dil, qəbul şərtləri və viza asanlığına görə müqayisə edirik. Sizə uyğun ölkəni seçməyə kömək edən tam bələdçi.",
    keywords: [
      "hansı ölkədə oxumaq sərfəlidir",
      "xaricdə təhsil müqayisə",
      "türkiyə yoxsa rusiya",
      "ən ucuz xaricdə təhsil",
      "attestatla qəbul edən ölkələr",
    ],
    excerpt:
      "Türkiyə, Rusiya, Gürcüstan, Ukrayna və Qazaxıstanda təhsili xərc, dil və qəbul şərtlərinə görə yan-yana müqayisə edirik — sizə uyğun ölkəni seçin.",
    heroEmoji: "🌍",
    updatedAt: "2026-06-07",
    readingMinutes: 10,
    intro: [
      "Xaricdə oxumaq qərarına gəldikdən sonra ən çətin sual budur: hansı ölkə? Bu bələdçidə MegaGroup-un ən çox müraciət alan 5 istiqamətini — Türkiyə, Rusiya, Gürcüstan, Ukrayna və Qazaxıstanı — xərc, dil, qəbul şərtləri və viza asanlığına görə yan-yana müqayisə edirik ki, seçiminizi asanlaşdıraq.",
    ],
    sections: [
      {
        heading: "Qısa müqayisə cədvəli",
        paragraphs: [
          "Aşağıdakı xülasə hər ölkənin əsas üstünlüyünü göstərir — dəqiq rəqəmləri seçdiyiniz universitetə görə MegaGroup-un kalkulyatoru ilə hesablaya bilərsiniz:",
        ],
        list: [
          "Türkiyə — ən yaxın məsafə, əlçatan qiymət, türk dilini öyrənmək asan, illik təhsil haqqı ~$1,200–$3,000.",
          "Rusiya — güclü tibb və mühəndislik proqramları, rus dilini bilənlər üçün rahat, illik təhsil haqqı ~$1,500–$4,000.",
          "Gürcüstan — Azərbaycana ən yaxın ölkələrdən biri, ingilis dilində tibb proqramları, illik təhsil haqqı ~$3,000–$6,000.",
          "Ukrayna — beynəlxalq tanınan tibb diplomu, əlçatan yaşayış xərci, illik təhsil haqqı ~$2,500–$5,000.",
          "Qazaxıstan — türk dünyasına yaxın mədəniyyət, güclü mühəndislik/IT proqramları, illik təhsil haqqı ~$2,000–$4,000.",
        ],
      },
      {
        heading: "Büdcəyə görə seçim",
        paragraphs: [
          "Büdcəniz məhdudsa, Türkiyə və Qazaxıstan ən əlçatan seçimlərdir. Tibb ixtisası üçün büdcəniz bir qədər genişdirsə, Gürcüstan və Ukrayna beynəlxalq tanınan diplomları ilə güclü alternativdir.",
        ],
      },
      {
        heading: "Dil baryerinə görə seçim",
        paragraphs: [
          "Rus dilini bilirsinizsə, Rusiya və Qazaxıstan rahat keçiddir. İngilis dilində oxumaq istəyirsinizsə, Gürcüstan, Ukrayna və Qazaxıstanın beynəlxalq proqramları ideal seçimdir. Türk dilini öyrənməyə açıqsınızsa, Türkiyə ən sürətli adaptasiyanı təmin edir.",
        ],
      },
      {
        heading: "MegaGroup necə kömək edir?",
        paragraphs: [
          "Hansı ölkəni seçməyinizdən asılı olmayaraq, MegaGroup sizə pulsuz konsultasiya, sənəd hazırlığı, universitetə müraciət və viza prosesində dəstək göstərir. Ölkə seçimi barədə hələ də əminliyiniz yoxdursa, komandamızla əlaqə saxlayın — sizin üçün ən uyğun variantı birlikdə müəyyən edək.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ən ucuz xaricdə təhsil hansı ölkədədir?",
        answer:
          "Ümumi hesabla Türkiyə və Qazaxıstan ən əlçatan təhsil haqqına malikdir, lakin dəqiq rəqəm seçdiyiniz universitet və ixtisasdan asılıdır.",
      },
      {
        question: "Tibb ixtisası üçün hansı ölkəni seçməliyəm?",
        answer:
          "Tibb üçün Gürcüstan və Ukrayna beynəlxalq tanınan (WHO siyahısında olan) proqramları ilə ən çox seçilən istiqamətlərdir.",
      },
      {
        question: "Bütün bu ölkələr attestatla, imtahansız qəbul edirmi?",
        answer:
          "Bəli, bu bələdçidə göstərilən 5 ölkənin əksər universiteti attestat əsasında, mərkəzləşdirilmiş imtahan olmadan qəbul aparır.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
