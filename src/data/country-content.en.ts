/**
 * Ölkə səhifələri üçün EN məzmunu (SEO üçün).
 * AZ variantı ilə eyni strukturdadır: giriş, xərclər, şəhərlər, qəbul, viza, tələbə həyatı.
 * Bloq məqalələrindən fərqli, səhifə profili mətnidir — duplicate yoxdur.
 */
import type { CountryContent } from "./country-content";

export const COUNTRY_CONTENT_EN: Record<string, CountryContent> = {
  // ============================================================
  // TURKEY
  // ============================================================
  turkiye: {
    slug: "turkiye",
    intro: [
      "Studying in Turkey is the most popular destination for Azerbaijani graduates, and the reasons are simple: geographic proximity, language and cultural similarity, relatively affordable prices, and internationally recognized diplomas. Over the past years MegaGroup has placed more than 800 students into Turkish state and private universities on the basis of their certificate, without the DİM exam.",
      "On this page we explain every aspect of studying in Turkey — admission requirements, tuition fees, living costs, the best universities and cities, the visa process, and student life — with real figures. The information is based on the real experience the MegaGroup team has gathered since 2018.",
    ],
    costRows: [
      { label: "Tuition (private university)", min: 2500, max: 8000, unit: "il" },
      { label: "Tuition (state university)", min: 400, max: 1500, unit: "il" },
      { label: "Dormitory", min: 100, max: 300, unit: "ay" },
      { label: "Food", min: 200, max: 400, unit: "ay" },
      { label: "Transport", min: 30, max: 60, unit: "ay" },
      { label: "Personal expenses", min: 100, max: 250, unit: "ay" },
    ],
    costNote:
      "Figures are averages; Istanbul and Ankara are more expensive, while Anatolian cities (Kayseri, Samsun, Trabzon) are considerably cheaper. You can calculate your exact budget with MegaGroup's free calculator based on your chosen university.",
    cities: [
      { name: "Istanbul", description: "Turkey's largest and most cosmopolitan city; 50+ universities, a large Azerbaijani diaspora, but higher living costs." },
      { name: "Ankara", description: "The capital; strong state universities (ODTÜ, Hacettepe, Ankara University), relatively lower costs." },
      { name: "Izmir", description: "Aegean coast, mild climate, YEKBO and an international-student-friendly environment." },
      { name: "Bursa, Konya, Kayseri", description: "Cheaper living, calmer life, quality technical universities." },
    ],
    admission: [
      {
        heading: "Is admission possible with a certificate, without exams?",
        paragraphs: [
          "Yes. The vast majority of Turkey's private universities admit students based solely on the certificate grade point average, without any centralized exam. This is the fastest and most affordable route for applicants who do not want to take the DİM exam or could not get into their desired major.",
          "Some state universities require the YÖS (exam for foreign students), but in recent years more and more state universities have also started admitting students with just a certificate or a special interview.",
        ],
      },
      {
        heading: "What documents are required?",
        paragraphs: [
          "Main documents: certificate (original and notarized translation), transcript, passport (6 months validity), 6 photos (3×4), language certificate and financial proof if available. The translation and apostille process is managed by MegaGroup.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Acceptance letter", description: "Receive the official acceptance letter (kabul mektubu) from the university." },
      { step: 2, title: "E-visa or embassy", description: "For residents of Azerbaijan — e-visa online, or via the embassy in Ankara/Baku." },
      { step: 3, title: "Residence permit (ikamet)", description: "Within 30 days of arrival, a residence permit is obtained." },
    ],
    studentLife: [
      "Student life in Turkey is vibrant and multifaceted. Azerbaijani student societies (ATESH and others) operate in many cities and help newcomers adapt. Universities have active sports, cultural and professional clubs.",
      "Students enjoy special discounts on food, transport and cultural events (öğrenci indirimi). Many universities offer dormitories; private dormitories (KYK and private) are a higher-quality but somewhat more expensive option.",
    ],
  },

  // ============================================================
  // RUSSIA
  // ============================================================
  rusiya: {
    slug: "rusiya",
    intro: [
      "Studying in Russia is a traditional and strong choice, especially for medicine, engineering and technical fields. Familiarity with the Russian language, strong academic traditions and diplomas recognized across the CIS make Russia the choice of hundreds of graduates every year.",
      "In this guide we explain Russia's admission requirements, university selection, costs, the visa process and student life. The MegaGroup team places students across a wide range — from Moscow to regional universities.",
    ],
    costRows: [
      { label: "Tuition (Moscow/SPb)", min: 3000, max: 6000, unit: "il" },
      { label: "Tuition (regional)", min: 1500, max: 3500, unit: "il" },
      { label: "Dormitory", min: 50, max: 150, unit: "ay" },
      { label: "Food", min: 150, max: 300, unit: "ay" },
      { label: "Transport", min: 20, max: 50, unit: "ay" },
    ],
    costNote: "Regional cities (Kazan, Rostov, Voronezh) are considerably cheaper than Moscow, while education quality remains high.",
    cities: [
      { name: "Moscow", description: "The capital; leading medical (Sechenov), engineering (BMSTU) and economics universities." },
      { name: "Saint Petersburg", description: "The cultural capital; Pavlov Medical University and SPbGU are strong." },
      { name: "Kazan, Rostov-on-Don", description: "Cheaper, strong federal universities, Azerbaijani community." },
    ],
    admission: [
      {
        heading: "Admission requirements and documents",
        paragraphs: [
          "Most Russian universities admit students on the basis of the certificate, with no centralized exam required. For medical majors, an additional biology/chemistry exam or an online interview may sometimes be held. Main documents: certificate (notarized translation), passport, medical certificate (including HIV), 4–6 photos.",
        ],
      },
      {
        heading: "Foundation year (preparatory faculty)",
        paragraphs: [
          "For students who do not know Russian, a one-year preparatory faculty is offered — language and core subjects. It is available at almost all universities and completely removes the language barrier.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Invitation (priglashenie)", description: "The university arranges the invitation via Rosobrazovanie (2–4 weeks)." },
      { step: 2, title: "Visa application", description: "Apply for a student visa at the Russian embassy in Baku." },
      { step: 3, title: "Migration registration", description: "Within 7 days of arrival, register with the migration service." },
    ],
    studentLife: [
      "Student life in Russia has rich academic traditions. State dormitories are cheap ($50–100/month), but conditions vary by university. Azerbaijani student unions are active in major cities.",
      "Students benefit from discounts on transport, museums and theatres. Outside Moscow and St. Petersburg, overall living costs are much lower.",
    ],
  },

  // ============================================================
  // UKRAINE
  // ============================================================
  ukrayna: {
    slug: "ukrayna",
    intro: [
      "Studying in Ukraine has traditionally been an attractive choice, especially for applicants considering a medical career. WHO-listed universities, English-taught programs and internationally recognized diplomas make Ukraine the choice of hundreds of Azerbaijani students every year.",
      "Attention: due to the current wartime situation, safe education is only possible in Lviv, Ivano-Frankivsk, Uzhhorod and other western regions. MegaGroup only places students into universities in these safe regions.",
    ],
    costRows: [
      { label: "Tuition (medicine, English)", min: 4000, max: 5500, unit: "il" },
      { label: "Tuition (other majors)", min: 2500, max: 3500, unit: "il" },
      { label: "Dormitory", min: 50, max: 120, unit: "ay" },
      { label: "Food", min: 120, max: 250, unit: "ay" },
    ],
    costNote: "Western Ukrainian cities are among the most affordable regions for living costs.",
    cities: [
      { name: "Lviv", description: "The cultural capital; Danylo Halytsky Lviv National Medical University, a safe and European-oriented city." },
      { name: "Ivano-Frankivsk", description: "Medical and technical universities, cheap living, calm environment." },
      { name: "Uzhhorod", description: "Border city, Uzhhorod National University, close to Central Europe." },
    ],
    admission: [
      {
        heading: "Admission requirements",
        paragraphs: [
          "Admission is mostly based on the certificate, with no centralized exam required. For medical faculties, some universities may hold an additional online interview (basics of biology/chemistry). For studying in English, IELTS/TOEFL or the university's internal test is required.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Invitation", description: "Invitation issued by the university and the Ministry of Foreign Affairs." },
      { step: 2, title: "Visa", description: "Apply for a student visa at the Ukrainian embassy in Baku." },
      { step: 3, title: "Temporary residence permit", description: "Registration through the university after arrival in Ukraine." },
    ],
    studentLife: [
      "Western Ukrainian cities (especially Lviv) stand out with European architecture, a lively student environment and an inexpensive lifestyle. Medical students have broad clinical practice opportunities.",
    ],
  },

  // ============================================================
  // GEORGIA
  // ============================================================
  gurcustan: {
    slug: "gurcustan",
    intro: [
      "Studying in Georgia has become increasingly popular among Azerbaijani students in recent years. Being one of the closest countries to Azerbaijan, with English-taught medical programs and affordable prices, makes Georgia especially attractive for those wanting to study medicine.",
      "On this page we explain Georgia's admission requirements, universities in Tbilisi and Batumi, costs and the visa process. MegaGroup places students into Georgia's leading medical universities (Tbilisi State Medical University, Batumi Shota Rustaveli State University, Caucasus International University and others).",
    ],
    costRows: [
      { label: "Tuition (medicine, English)", min: 4000, max: 6000, unit: "il" },
      { label: "Tuition (other majors)", min: 2000, max: 3500, unit: "il" },
      { label: "Dormitory / rent", min: 150, max: 350, unit: "ay" },
      { label: "Food", min: 150, max: 300, unit: "ay" },
      { label: "Transport", min: 20, max: 40, unit: "ay" },
    ],
    costNote: "Tbilisi is somewhat more expensive, while Batumi is more affordable and offers seaside life in summer.",
    cities: [
      { name: "Tbilisi", description: "The capital; Tbilisi State Medical University (TSMU), Caucasus International University, the main medical hub." },
      { name: "Batumi", description: "Black Sea coast; Batumi Shota Rustaveli State University, cheap living, mild climate." },
      { name: "Kutaisi", description: "Akaki Tsereteli State University, the lowest living costs." },
    ],
    admission: [
      {
        heading: "Admission by certificate, exam-free",
        paragraphs: [
          "The vast majority of Georgian universities admit students based on the certificate, without a centralized exam. For medical majors, some universities may require an additional entrance exam (biology, chemistry, English), but many settle for document review and an interview.",
          "For English-taught medical programs, IELTS 5.5–6.0 or the university's internal language test is usually sufficient. MegaGroup provides full support in both language preparation and the exam process.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Visa-free entry", description: "Azerbaijani citizens can stay visa-free for up to 90 days." },
      { step: 2, title: "Student status", description: "A 1-year student permit (sxeloba) is issued based on the university's acceptance letter." },
      { step: 3, title: "Annual renewal", description: "The student status is renewed by the university every year." },
    ],
    studentLife: [
      "Life and cuisine in Georgia are close to Azerbaijani, so adaptation is easy. Tbilisi stands out with a lively nightlife and a multinational student environment. Medical students have broad clinical practice opportunities, and diplomas from WHO-listed universities are recognized in Europe and Azerbaijan.",
    ],
  },

  // ============================================================
  // KAZAKHSTAN
  // ============================================================
  qazaxistan: {
    slug: "qazaxistan",
    intro: [
      "Studying in Kazakhstan has been rapidly gaining popularity among Azerbaijani graduates in recent years. Culturally close Turkic world, affordable tuition, internationally recognized institutions such as Nazarbayev University, and English-taught programs make Kazakhstan an economically advantageous choice.",
      "In this guide we explain Kazakhstan's admission requirements, universities in Almaty and Astana, costs, the visa process and student life. MegaGroup places students by certificate into Kazakhstan's leading state and private universities.",
    ],
    costRows: [
      { label: "Tuition (private, English)", min: 3000, max: 6000, unit: "il" },
      { label: "Tuition (state)", min: 1500, max: 3000, unit: "il" },
      { label: "Dormitory", min: 60, max: 180, unit: "ay" },
      { label: "Food", min: 150, max: 300, unit: "ay" },
      { label: "Transport", min: 20, max: 50, unit: "ay" },
    ],
    costNote: "Nazarbayev University admits students with private scholarships and holds the highest academic ranking.",
    cities: [
      { name: "Almaty", description: "The former capital, the largest student city; KazNU, KazNTU." },
      { name: "Astana", description: "The new capital; Nazarbayev University, Astana Medical University, modern campuses." },
      { name: "Shymkent", description: "Southern Kazakhstan; medical university, cheap living." },
    ],
    admission: [
      {
        heading: "Admission requirements",
        paragraphs: [
          "Most Kazakhstani universities admit students based on the certificate, without a centralized exam. Competitive programs (especially at Nazarbayev University) may require a high GPA, SAT/IELTS and a motivation letter.",
          "International programs in English usually require IELTS 5.5+. For those who want to study in Russian or Kazakh, a foundation year is available.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Acceptance letter", description: "Official acceptance letter from the university." },
      { step: 2, title: "Invitation and visa", description: "Invitation from Kazakhstan and a student visa at the embassy in Baku (simple and fast process)." },
      { step: 3, title: "Migration registration", description: "Migration registration within 3 days of arrival in Kazakhstan." },
    ],
    studentLife: [
      "Culture and mentality in Kazakhstan are close to Azerbaijani, which eases adaptation. Almaty is a lively student city, while Astana stands out with modern infrastructure. Oil-gas, engineering and IT majors are especially strong.",
    ],
  },

  // ============================================================
  // GERMANY
  // ============================================================
  almaniya: {
    slug: "almaniya",
    intro: [
      "Studying in Germany is a world leader in engineering, technology and research. At state universities, tuition for most programs is free or very low (only a semester fee of ~€300), but admission requirements and language demands are stricter.",
      "In this guide we explain the Studienkolleg process, language requirements, financial proof and the visa process in Germany. MegaGroup provides full preparation support for admission to Germany.",
    ],
    costRows: [
      { label: "Tuition (state)", min: 0, max: 1500, unit: "il", note: "Only semester fee ~€300" },
      { label: "Dormitory / rent", min: 300, max: 600, unit: "ay" },
      { label: "Food", min: 200, max: 350, unit: "ay" },
      { label: "Insurance and transport", min: 120, max: 200, unit: "ay" },
    ],
    costNote: "Tuition is free, but financial proof (~€11,208/year) is mandatory for the visa.",
    cities: [
      { name: "Munich", description: "Technical University (TUM), engineering hub, but the most expensive city." },
      { name: "Berlin", description: "Technical University Berlin, lively student life, cultural diversity." },
      { name: "Aachen, Stuttgart, Karlsruhe", description: "Leading technical universities in engineering and technology." },
    ],
    admission: [
      {
        heading: "Studienkolleg and direct admission",
        paragraphs: [
          "Because the Azerbaijani certificate does not fully meet Germany's direct admission requirements, most students first complete a one-year Studienkolleg (preparatory course) and pass the Feststellungsprüfung. Studienkolleg is available for civil engineering, natural sciences, economics and other directions.",
        ],
      },
      {
        heading: "Language requirements",
        paragraphs: [
          "German-taught programs require TestDaF or DSH (usually B2–C1 level), while English-taught programs require IELTS 6.5+. Applications are usually submitted through the uni-assist platform.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Financial proof (Sperrkonto)", description: "Blocked account of ~€11,208 or a sponsorship declaration." },
      { step: 2, title: "Insurance", description: "German insurance (TK, AOK, etc.)." },
      { step: 3, title: "Visa application", description: "Student visa at the German embassy in Baku (4–8 weeks)." },
    ],
    studentLife: [
      "Student life in Germany is disciplined and academically demanding, but offers broad opportunities (work permit 140 days/year, research). The diploma is academically recognized across the European Union under the Bologna/ECTS framework; regulated professions such as engineering may require a recognition/licensing procedure in the target country.",
    ],
  },

  // ============================================================
  // POLAND
  // ============================================================
  polsa: {
    slug: "polsa",
    intro: [
      "Studying in Poland is a growing choice, especially for medical and dentistry programs taught in English. A European Union diploma, modern campuses and relatively affordable prices make Poland an attractive option for applicants wanting to study medicine.",
      "In this guide we explain Poland's admission requirements, universities, costs and the visa process.",
    ],
    costRows: [
      { label: "Tuition (medicine, English)", min: 11000, max: 15000, unit: "il" },
      { label: "Tuition (other majors)", min: 3000, max: 5000, unit: "il" },
      { label: "Dormitory / rent", min: 200, max: 450, unit: "ay" },
      { label: "Food", min: 150, max: 300, unit: "ay" },
    ],
    costNote: "Medical programs are expensive, but the diploma is academically recognized in the EU and serves as a base for PMQ/USMLE.",
    cities: [
      { name: "Warsaw", description: "The capital; Warsaw Medical University (WUM), the largest student city." },
      { name: "Kraków", description: "Jagiellonian University (one of Europe's oldest), historical and cultural center." },
      { name: "Poznań, Wrocław", description: "Medical universities, cheaper living." },
    ],
    admission: [
      {
        heading: "Admission requirements",
        paragraphs: [
          "For medical majors, some universities require an entrance exam (MCAT-type) or an interview, while others admit based only on the certificate and IELTS 6.0+. Applications are usually submitted through the university's own portal.",
        ],
      },
    ],
    visaSteps: [
      { step: 1, title: "Acceptance letter", description: "Official acceptance letter from the university." },
      { step: 2, title: "Financial proof", description: "Bank account proof or scholarship." },
      { step: 3, title: "Visa", description: "Type D student visa at the Polish embassy." },
    ],
    studentLife: [
      "Poland is one of the EU countries with affordable living costs. Students are allowed to work, and the diploma is academically recognized across EU countries under the Bologna/ECTS framework (medical practice requires the target country's license). Medical students gain a strong foundation for PMQ/USMLE exam preparation.",
    ],
  },
};