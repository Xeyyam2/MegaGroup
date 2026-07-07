/**
 * Ölkə səhifələri üçün dərin AZ məzmunu (SEO üçün).
 *
 * Landing səhifələri `/xaricde-tehsil/[country]` rank olmalı olduğu üçün
 * 1500+ söz həcmində, açar sözlə zəngin, unikal məzmun tələb olunur.
 * Bu fayl yalnız AZ dilindədir (hədəf açar sözlər AZ-dildir).
 *
 *countries.ts-i şişirtməmək üçün ayrı saxlanılır.
 */

export interface CostRow {
  label: string;
  /** USD, illik (təhsil haqqı) və ya aylıq (digər). */
  min: number;
  max: number;
  unit: "il" | "ay";
  note?: string;
}

export interface CityInfo {
  name: string;
  description: string;
}

export interface CountryContentSection {
  heading: string;
  paragraphs: string[];
}

export interface CountryContent {
  slug: string;
  /** Giriş paraqrafları — ilk 100 sözdə əsas açar söz olmalıdır. */
  intro: string[];
  /** Real xərc cədvəli. */
  costRows: CostRow[];
  costNote?: string;
  /** Ən populyar tələbə şəhərləri. */
  cities: CityInfo[];
  /** Qəbul şərtləri haqqında detallı bölmələr. */
  admission: CountryContentSection[];
  /** Viza prosesi addım-addım. */
  visaSteps: { step: number; title: string; description: string }[];
  /** Tələbə həyatı haqqında paraqraflar. */
  studentLife: string[];
}

export const COUNTRY_CONTENT: Record<string, CountryContent> = {
  // ============================================================
  // TÜRKİYƏ — ən yüksək axtarış həcmi
  // ============================================================
  turkiye: {
    slug: "turkiye",
    intro: [
      "Türkiyədə təhsil Azərbaycanlı məzunlar üçün ən çox seçilən istiqamətdir və bunun səbəbi sadədir: coğrafi yaxınlıq, dil və mədəniyyət oxşarlığı, nisbətən əlçatan qiymətlər və beynəlxalq tanınan diplomlar. MegaGroup olaraq son illərdə 800-dən çox tələbəni Türkiyənin dövlət və özəl universitetlərinə attestatla, DIM imtahanı olmadan yerləşdirmişik.",
      "Bu səhifədə Türkiyədə təhsilin bütün məqamlarını — qəbul şərtlərini, təhsil haqqını, yaşayış xərclərini, ən yaxşı universitet və şəhərləri, viza prosesini və tələbə həyatını real rəqəmlərlə izah edirik. Məlumatlar MegaGroup komandasının 2018-ci ildən bəri yığdığı real təcrübəyə əsaslanır.",
    ],
    costRows: [
      { label: "Təhsil haqqı (özəl universitet)", min: 2500, max: 8000, unit: "il" },
      { label: "Təhsil haqqı (dövlət universiteti)", min: 400, max: 1500, unit: "il" },
      { label: "Yataqxana", min: 100, max: 300, unit: "ay" },
      { label: "Qida", min: 200, max: 400, unit: "ay" },
      { label: "Nəqliyyat", min: 30, max: 60, unit: "ay" },
      { label: "Şəxsi xərclər", min: 100, max: 250, unit: "ay" },
    ],
    costNote:
      "Rəqəmlər orta göstəricilərdir; İstanbul və Ankara daha baha, Anadolu şəhərləri (Kayseri, Samsun, Trabzon) isə xeyli ucuzdur. Dəqiq büdcənizi seçdiyiniz universitetə görə MegaGroup-un pulsuz kalkulyatoru ilə hesablaya bilərsiniz.",
    cities: [
      { name: "İstanbul", description: "Türkiyənin ən böyük və kosmopolit şəhəri; 50+ universitet, böyük azərbaycanlı diasporası, lakin yaşayış xərcləri yüksək." },
      { name: "Ankara", description: "Paytaxt; dövlət universitetləri güclüdür (ODTÜ, Hacettepe, Ankara Universiteti), xərclər nisbətən aşağı." },
      { name: "İzmir", description: "Egey sahili, mülayim iqlim, YEKBO və beynəlxalq tələbə dostu mühit." },
      { name: "Bursa, Konya, Kayseri", description: "Daha ucuz yaşayış, sakit həyat, keyfiyyətli texniki universitetlər." },
    ],
    admission: [
      {
        heading: "Attestatla, imtahansız qəbul mümkündürmü?",
        paragraphs: [
          "Bəli. Türkiyənin özəl universitetlərinin böyük əksəriyyəti yalnız attestat ortalaması əsasında, hər hansı mərkəzləşdirilmiş imtahan tələb etmədən qəbul aparır. Bu, DIM imtahanı vermək istəməyən və ya istədiyi ixtisasa düşə bilməyən abituriyentlər üçün ən sürətli və sərfəli yoldur.",
          "Dövlət universitetlərinin bir qismi isə YÖS (Yabancı Öğrenci Sınavı) tələb edir, lakin son illərdə getdikcə daha çox dövlət universiteti də yalnız attestat və ya xüsusi müsahibə ilə qəbul etməyə başlayıb.",
        ],
      },
      {
        heading: "Hansı sənədlər lazımdır?",
        paragraphs: [
          "Əsas sənədlər: attestat (orijinal və notarial tərcümə), transkript, pasport (6 ay müddətli), 6 ədəd foto (3×4), varsa dil sertifikatı və maliyyə sübutu. Sənədlərin tərcümə və apostil prosesi MegaGroup tərəfindən idarə olunur.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Qəbul məktubu", description: "Universitetdən rəsmi qəbul məktubu (kabul mektubu) alınır." },
      { step: 2, title: "E-viza və ya səfirlik", description: "Azərbaycanda yaşayanlar üçün e-viza onlayn, və ya Ankara/Bakı səfirliyi vasitəsilə." },
      { step: 3, title: "İkamətgah (ikamet)", description: "Türkiyəyə gəldikdən sonra 30 gün ərzində ikamətgah icazəsi alınır." },
    ],
    studentLife: [
      "Türkiyədə tələbə həyatı canlı və çoxşaxəlidir. Azərbaycanlı tələbə cəmiyyətləri (ATESH və s.) bir çox şəhərdə fəaliyyət göstərir və yeni gələnlərə adaptasiyada kömək edir. Universitetlərdə idman, mədəniyyət və peşəkar klublar fəaldır.",
      "Tələbələr qida, nəqliyyat və bəzi mədəni tədbirlərdə xüsusi endirimlərdən (öğrenci indirimi) yararlana bilər. Bir çox universitet yataqxana təklif edir; özəl yataqxanalar (KYK və özəl) daha keyfiyyətli, lakin bir qədər baha seçimdir.",
    ],
  },

  // ============================================================
  // RUSİYA
  // ============================================================
  rusiya: {
    slug: "rusiya",
    intro: [
      "Rusiyada təhsil xüsusilə tibb, mühəndislik və texniki ixtisaslar üçün seçilən ənənəvi və güclü istiqamətdir. Azərbaycanlı tələbələr arasında rus dilinin tanışlığı, güclü akademik ənənə və MDB ərazisində tanınan diplomlar Rusiyanı hər il yüzlərlə məzunun seçiminə çevirir.",
      "Bu bələdçidə Rusiyada təhsilin qəbul şərtlərini, universitet seçimini, xərcləri, viza prosesini və tələbə həyatını izah edirik. MegaGroup komandası Moskvadan regional universitetlərə qədər geniş spektrdə yerləşdirmə aparır.",
    ],
    costRows: [
      { label: "Təhsil haqqı (Mosva/SPb)", min: 3000, max: 6000, unit: "il" },
      { label: "Təhsil haqqı (regional)", min: 1500, max: 3500, unit: "il" },
      { label: "Yataqxana", min: 50, max: 150, unit: "ay" },
      { label: "Qida", min: 150, max: 300, unit: "ay" },
      { label: "Nəqliyyat", min: 20, max: 50, unit: "ay" },
    ],
    costNote: "Regional şəhərlər (Kazan, Rostov, Voronej) Moskvaya nisbətən xeyli ucuzdur, amma təhsil keyfiyyəti yüksək qalır.",
    cities: [
      { name: "Moskva", description: "Paytaxt; aparıcı tibb (Seçenov), mühəndislik (BMSTU) və iqtisadiyyat universitetləri." },
      { name: "Sankt-Peterburq", description: "Mədəni paytaxt; Pavlov Tibb Universiteti və SPbGU güclüdür." },
      { name: "Kazan, Rostov-na-Donu", description: "Daha ucuz, güclü federal universitetlər, azərbaycanlı icması." },
    ],
    admission: [
      {
        heading: "Qəbul şərtləri və sənədlər",
        paragraphs: [
          "Əksər Rusiya universitetləri qəbulu attestat əsasında aparır və mərkəzləşdirilmiş imtahan tələb olunmur. Tibb ixtisasları üçün bəzən əlavə biologiya/kimya imtahanı və ya onlayn müsahibə keçirilə bilər. Tələb olunan əsas sənədlər: attestat (notarial tərcümə), pasport, tibbi arayış (HIV daxil), 4-6 foto.",
        ],
      },
      {
        heading: "Hazırlıq ili (fakultetpodgotovki)",
        paragraphs: [
          "Rus dilini bilməyən tələbələr üçün bir illik hazırlıq fakültəsi təklif olunur — dil və əsas fənlər üzrə. Bu, demək olar ki, bütün universitetlərdə mövcuddur və dil baryerini tam aradan qaldırır.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Dəvət məktubu (priglashenie)", description: "Universitet Rosobrazovanie vasitəsilə dəvət məktubu düzəldir (2-4 həftə)." },
      { step: 2, title: "Viza müraciəti", description: "Bakıdakı Rusiya səfirliyinə tələbə vizası üçün müraciət." },
      { step: 3, title: "Miqration qeydiyyatı", description: "Rusiyaya gəldikdən sonra 7 gün ərzində miqrasiya xidmətində qeydiyyat." },
    ],
    studentLife: [
      "Rusiyada tələbə həyatı zəngin akademik ənənəyə malikdir. Dövlət yataqxanaları ucuzdur (aylıq $50-100), lakin şərait universitetə görə dəyişir. Azərbaycanlı tələbə birlikləri böyük şəhərlərdə fəaldır.",
      "Tələbələr nəqliyyat, muzey və teatrlarda güzəştlərdən yararlana bilər. Moskva və Peterburq xaricində ümumi yaşayış xərcləri xeyli aşağıdır.",
    ],
  },

  // ============================================================
  // UKRAYNA
  // ============================================================
  ukrayna: {
    slug: "ukrayna",
    intro: [
      "Ukraynada təhsil, xüsusilə tibb ixtisası düşünən abituriyentlər üçün ənənəvi olaraq cəlbedici seçim olub. WHO (Ümumdünya Səhiyyə Təşkilatı) siyahısında olan universitetlər, ingilis dilində tədris proqramları və beynəlxalq səviyyədə tanınan diplomlar Ukraynanı hər il yüzlərlə azərbaycanlı tələbənin seçiminə çevirir.",
      "Diqqət: Hazırda müharibə şəraitinə görə yalnız Lvov, İvano-Frankovsk, Ujqorod və digər qərbi regionlarda təhlükəsiz təhsil mümkündür. MegaGroup yalnız bu təhlükəsiz regionlardakı universitetlərə yerləşdirmə aparır.",
    ],
    costRows: [
      { label: "Təhsil haqqı (tibb, ingilis dilində)", min: 4000, max: 5500, unit: "il" },
      { label: "Təhsil haqqı (digər ixtisaslar)", min: 2500, max: 3500, unit: "il" },
      { label: "Yataqxana", min: 50, max: 120, unit: "ay" },
      { label: "Qida", min: 120, max: 250, unit: "ay" },
    ],
    costNote: "Qərbi Ukrayna şəhərləri yaşayış xərcinə ən əlçatan regionlardan biridir.",
    cities: [
      { name: "Lvov", description: "Mədəni paytaxt; Danylo Halytsky Lvov Milli Tibb Universiteti, təhlükəsiz və avropayönlü şəhər." },
      { name: "İvano-Frankovsk", description: "Tibb və texniki universitetlər, ucuz yaşayış, sakit mühit." },
      { name: "Ujqorod", description: "Sərhəd şəhəri, Ujqorod Milli Universiteti, mərkəzi Avropa yaxınlığı." },
    ],
    admission: [
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Qəbul prosesi əsasən attestat əsasında aparılır və mərkəzləşdirilmiş imtahan tələb olunmur. Tibb fakültələri üçün bəzi universitetlər əlavə onlayn müsahibə (biologiya/kimya əsaslarında) keçirə bilər. İngilis dilində oxumaq üçün IELTS/TOEFL və ya universitetin daxili testi tələb olunur.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Dəvət məktubu (invitation)", description: "Universitet və Xarici İşlər Nazirliyi tərəfindən dəvət məktubu." },
      { step: 2, title: "Viza", description: "Bakıdakı Ukrayna səfirliyinə tələbə vizası üçün müraciət." },
      { step: 3, title: "Müvəqqəti yaşayış icazəsi", description: "Ukraynaya gəldikdən sonra universitet vasitəsilə qeydiyyat." },
    ],
    studentLife: [
      "Qərbi Ukrayna şəhərləri (Lvov xüsusilə) avropa memarlığı, canlı tələbə mühiti və ucuz həyat tərzi ilə seçilir. Tibb tələbələri üçün klinik təcrübə imkanları genişdir.",
    ],
  },

  // ============================================================
  // GÜRCÜSTAN
  // ============================================================
  gurcustan: {
    slug: "gurcustan",
    intro: [
      "Gürcüstanda təhsil son illərdə Azərbaycanlı tələbələr arasında getdikcə populyarlaşan istiqamətdir. Azərbaycana ən yaxın ölkələrdən biri olması, ingilis dilində tədris olunan tibb proqramları və əlçatan qiymətlər Gürcüstanı xüsusilə tibb oxumaq istəyənlər üçün cəlbedici edir.",
      "Bu səhifədə Gürcüstanda təhsilin qəbul şərtlərini, Tbilisi və Batumidəki universitetləri, xərcləri və viza prosesini izah edirik. MegaGroup Gürcüstandakı aparıcı tibb universitetlərinə (Tbilisi Dövlət Tibb, Batumi Şota Rustaveli, Caucasus International və s.) yerləşdirmə aparır.",
    ],
    costRows: [
      { label: "Təhsil haqqı (tibb, ingilis)", min: 4000, max: 6000, unit: "il" },
      { label: "Təhsil haqqı (digər ixtisaslar)", min: 2000, max: 3500, unit: "il" },
      { label: "Yataqxana / kirayə", min: 150, max: 350, unit: "ay" },
      { label: "Qida", min: 150, max: 300, unit: "ay" },
      { label: "Nəqliyyat", min: 20, max: 40, unit: "ay" },
    ],
    costNote: "Tbilisi bir qədər baha, Batumi isə daha əlçatan və yayda dənizkənarı həyat təklif edir.",
    cities: [
      { name: "Tbilisi", description: "Paytaxt; Tbilisi Dövlət Tibb Universiteti (TSMU), Caucasus International University, əsas tibb mərkəzi." },
      { name: "Batumi", description: "Qara dəniz sahili; Batumi Şota Rustaveli Dövlət Universiteti, ucuz yaşayış, mülayim iqlim." },
      { name: "Kutaisi", description: "Akaki Tsereteli Dövlət Universiteti, ən ucuz yaşayış xərcləri." },
    ],
    admission: [
      {
        heading: "Attestatla, imtahansız qəbul",
        paragraphs: [
          "Gürcüstan universitetlərinin böyük əksəriyyəti qəbulu attestat əsasında, mərkəzləşdirilmiş imtahan olmadan aparır. Tibb ixtisasları üçün bəzi universitetlər əlavə giriş imtahanı (biologiya, kimya, ingilis dili üzrə) tələb edə bilər, lakin bir çoxu yalnız sənəd yoxlaması və müsahibə ilə kifayətlənir.",
          "İngilis dilində tibb proqramları üçün adətən IELTS 5.5-6.0 və ya universitetin daxili dil imtahanı kifayət edir. MegaGroup həm dil hazırlığında, həm də imtahan prosesində tam dəstək göstərir.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Vizasız giriş", description: "Azərbaycan vətəndaşları 90 günə qədər vizasız qala bilər." },
      { step: 2, title: "Tələbə statusu", description: "Universitetin qəbul məktubu əsasında 1 illik tələbə icazəsi (sxeloba) alınır." },
      { step: 3, title: "İllik yeniləmə", description: "Hər il tələbə statusu universitet tərəfindən yenilənir." },
    ],
    studentLife: [
      "Gürcüstanda yaşayış və mətbəh Azərbaycana yaxındır, adaptasiya asandır. Tbilisi canlı gecə həyatı və çoxmillətli tələbə mühiti ilə seçilir. Tibb tələbələri üçün klinik təcrübə imkanları genişdir və diplom WHO siyahısında olduğu üçün Avropa, ABŞ və Azərbaycanda tanınır.",
    ],
  },

  // ============================================================
  // QAZAXISTAN
  // ============================================================
  qazaxistan: {
    slug: "qazaxistan",
    intro: [
      "Qazaxıstanda təhsil son illərdə Azərbaycanlı məzunlar arasında sürətlə populyarlaşan istiqamətdir. Türk dünyasına yaxın mədəniyyət, əlçatan təhsil haqqı, Nazarbayev Universiteti kimi beynəlxalq səviyyəli təhsil ocaqları və ingilis dilində proqramlar Qazaxıstanı iqtisadi cəhətdən sərfəli seçim edir.",
      "Bu bələdçidə Qazaxıstanda təhsilin qəbul şərtlərini, Almatı və Astanadakı universitetləri, xərcləri, viza prosesini və tələbə həyatını izah edirik. MegaGroup Qazaxıstanın aparıcı dövlət və özəl universitetlərinə attestatla yerləşdirmə aparır.",
    ],
    costRows: [
      { label: "Təhsil haqqı (özəl, ingilis)", min: 3000, max: 6000, unit: "il" },
      { label: "Təhsil haqqı (dövlət)", min: 1500, max: 3000, unit: "il" },
      { label: "Yataqxana", min: 60, max: 180, unit: "ay" },
      { label: "Qida", min: 150, max: 300, unit: "ay" },
      { label: "Nəqliyyat", min: 20, max: 50, unit: "ay" },
    ],
    costNote: "Nazarbayev Universiteti özəl təqaüdlə tələb qəbul edir və ən yüksək akademik reytinqə malikdir.",
    cities: [
      { name: "Almatı", description: "Köhnə paytaxt, ən böyük tələbə şəhəri; KazNU, KazNTU, Həkimləri Təkmilləşdirmə İnstitutu." },
      { name: "Astana", description: "Yeni paytaxt; Nazarbayev Universiteti, Astana Medical University, müasir kampuslar." },
      { name: "Şımkənt", description: "Cənub Qazaxıstan; tibb universiteti, ucuz yaşayış." },
    ],
    admission: [
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Əksər Qazaxıstan universiteti qəbulu attestat əsasında, mərkəzləşdirilmiş imtahan olmadan aparır. Rəqabətli proqramlarda (xüsusilə Nazarbayev Universitetində) yüksək attestat ortalaması, SAT/IELTS və motivasiya məktubu tələb oluna bilər.",
          "İngilis dilində beynəlxalq proqramlar üçün adətən IELTS 5.5+ tələb olunur. Rus və ya qazax dilində oxumaq istəyənlər üçün isə hazırlıq ili mövcuddur.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Qəbul məktubu", description: "Universitetdən rəsmi qəbul məktubu." },
      { step: 2, title: "Dəvət və viza", description: "Qazaxıstan tərəfindən dəvət və Bakıdakı səfirlikdə tələbə vizası (proses sadə və sürətli)." },
      { step: 3, title: "QMİ qeydiyyatı", description: "Qazaxıstana gəldikdən sonra 3 gün ərzində miqrasiya qeydiyyatı." },
    ],
    studentLife: [
      "Qazaxıstanda mədəniyyət və mentalitet Azərbaycana yaxındır, bu da adaptasiyanı asanlaşdırır. Almatı canlı tələbə şəhəridir, Astana isə müasir infrastrukturu ilə seçilir. Neft-qaz, mühəndislik və IT ixtisasları xüsusilə güclüdür.",
    ],
  },

  // ============================================================
  // ALMANİYA
  // ============================================================
  almaniya: {
    slug: "almaniya",
    intro: [
      "Almaniyada təhsil xüsusilə mühəndislik, texnologiya və tədqiqat sahələrində dünya lideridir. Dövlət universitetlərində əksər proqramlar üçün təhsil haqqı yoxdur və ya çox aşağıdır (yalnız semestrlik rüsum ~€300), lakin qəbul şərtləri və dil tələbləri daha sərtdir.",
      "Bu bələdçidə Almaniyada təhsilin Studienkolleg prosesini, dil tələblərini, maliyyə sübutunu və viza prosesini izah edirik. MegaGroup Almaniyaya qəbul üçün tam hazırlıq dəstəyi göstərir.",
    ],
    costRows: [
      { label: "Təhsil haqqı (dövlət)", min: 0, max: 1500, unit: "il", note: "Yalnız semestrlik rüsum ~€300" },
      { label: "Yataqxana / kirayə", min: 300, max: 600, unit: "ay" },
      { label: "Qida", min: 200, max: 350, unit: "ay" },
      { label: "Sığorta və nəqliyyat", min: 120, max: 200, unit: "ay" },
    ],
    costNote: "Təhsil pulsuz olsa da, maliyyə sübutu (~€11,208/il) viza üçün mütləqdir.",
    cities: [
      { name: "Münhen", description: "Texniki Universitet (TUM), mühəndislik mərkəzi, lakin ən baha şəhər." },
      { name: "Berlin", description: "Texniki Universitet Berlin, canlı tələbə həyatı, müxtəlif mədəniyyət." },
      { name: "Aaxen, Ştutqart, Karlsrue", description: "Mühəndislik və texnologiya üzrə aparıcı texniki universitetlər." },
    ],
    admission: [
      {
        heading: "Studienkolleg və birbaşa qəbul",
        paragraphs: [
          "Azərbaycan attestatı Almaniyanın birbaşa qəbul tələbinə tam cavab vermədiyi üçün əksər tələbələr əvvəlcə bir illik Studienkolleg (hazırlıq) keçir və Feststellungsprüfung verir. Mülki mühəndislik, təbiət elmləri, iqtisadiyyat və s. istiqamətlərdə Studienkolleg mövcuddur.",
        ],
      },
      {
        heading: "Dil tələbləri",
        paragraphs: [
          "Alman dilində proqramlar üçün TestDaF və ya DSH (adətən B2-C1 səviyyəsi), ingilis dilində proqramlar üçün isə IELTS 6.5+ tələb olunur. Müraciət adətən Uni-assist platforması vasitəsilə aparılır.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Maliyyə sübutu (Sperrkonto)", description: "Bloklanmış hesabda ~€11,208 və ya zaminli elan." },
      { step: 2, title: "Sığorta", description: "Alman sığortası (TK, AOK və s.)." },
      { step: 3, title: "Viza müraciəti", description: "Bakıdakı Almaniya səfirliyinə tələbə vizası (4-8 həftə)." },
    ],
    studentLife: [
      "Almaniyada tələbə həyatı intizamlı və akademik cəhətdən tələbkarlıdır, lakin tələbələrə geniş imkanlar (iş icazəsi 140 gün/il, tədqiqat) təklif olunur. Diplom bütün Avropa İttifaqında və qlobal miqyasda tanınır.",
    ],
  },

  // ============================================================
  // POLŞA
  // ============================================================
  polsa: {
    slug: "polsa",
    intro: [
      "Polşada təhsil, xüsusilə ingilis dilində tibb və stomatologiya proqramları üçün getdikcə populyarlaşan istiqamətdir. Avropa İttifaqı diplomu, müasir kampuslar və nisbətən əlçatan qiymətlər Polşanı tibb oxumaq istəyən abituriyentlər üçün cəlbedici seçim edir.",
      "Bu bələdçidə Polşada təhsilin qəbul şərtlərini, universitetləri, xərcləri və viza prosesini izah edirik.",
    ],
    costRows: [
      { label: "Təhsil haqqı (tibb, ingilis)", min: 11000, max: 15000, unit: "il" },
      { label: "Təhsil haqqı (digər ixtisaslar)", min: 3000, max: 5000, unit: "il" },
      { label: "Yataqxana / kirayə", min: 200, max: 450, unit: "ay" },
      { label: "Qida", min: 150, max: 300, unit: "ay" },
    ],
    costNote: "Tibb proqramları baha olsa da, diplom EU daxilində birbaşa tanınır və PMQ/USMLE üçün əsasdır.",
    cities: [
      { name: "Varşava", description: "Paytaxt; Varşava Tibb Universiteti (WUM), ən böyük tələbə şəhəri." },
      { name: "Krakov", description: "Yagellon Universiteti (Avropanın ən qədimlərindən), tarixi və mədəni mərkəz." },
      { name: "Poznan, Vrotslav", description: "Tibb universitetləri, daha ucuz yaşayış." },
    ],
    admission: [
      {
        heading: "Qəbul şərtləri",
        paragraphs: [
          "Tibb ixtisası üçün bəzi universitetlər giriş imtahanı (MCAT tipli) və ya müsahibə tələb edir, digərləri isə yalnız attestat və IELTS 6.0+ ilə qəbul aparır. Müraciət adətən universitetin öz portalı vasitəsilə olur.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Qəbul məktubu", description: "Universitetdən rəsmi qəbul məktubu." },
      { step: 2, title: "Maliyyə sübutu", description: "Bank hesabı sübutu və ya təqaüd." },
      { step: 3, title: "Viza", description: "Polşa səfirliyində D tipli tələbə vizası." },
    ],
    studentLife: [
      "Polşa Avropa İttifaqının ucuz yaşayış xərcinə malik ölkələrindən biridir. Tələbələrə iş icazəsi verilir və diplom bütün EU-da tanınır. Tibb tələbələri PMQ/USMLE imtahanlarına hazırlaşmaq üçün güclü baza alır.",
    ],
  },
};

export function getCountryContent(slug: string): CountryContent | undefined {
  return COUNTRY_CONTENT[slug];
}
