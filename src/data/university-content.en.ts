/**
 * Universitet səhifələri üçün EN məzmunu (SEO üçün).
 * AZ variantı ilə eyni strukturdadır: giriş, qəbul, sənədlər, xərc, şəhər, karyera.
 * Bloq məqalələrindən fərqli, səhifə profili mətnidir — duplicate yoxdur.
 */
import type { UniversityContent } from "./university-content";

export const UNIVERSITY_CONTENT_EN: Record<string, UniversityContent> = {
  // ============================================================
  // TÜRKİYƏ
  // ============================================================
  "giresun-universiteti": {
    slug: "giresun-universiteti",
    intro: [
      "Giresun University is a public university on Turkey's Black Sea coast that gives Azerbaijani applicants the chance of direct admission with their certificate, without DIM or ÖSYM exams. It offers programs in medicine, dentistry, engineering and humanities.",
      "The university stands out with its seaside campus, active Azerbaijani student community, and living costs well below Turkey's big cities. The city of Giresun offers a calm and safe student environment.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "Giresun University admits international students on the basis of their certificate average; no centralized exam is required. That makes it one of the most accessible Turkish options for graduates who want a university degree without passing DIM.",
          "For the medical faculty the certificate average matters most — a high score gives an edge in applications. Contract (paid) places are more widely available.",
        ],
      },
      {
        heading: "Admission process and timing",
        paragraphs: [
          "Applications are submitted through MegaGroup: once the certificate and documents are ready they are sent to the university, and the acceptance letter usually arrives within 2-4 weeks. After acceptance, the student visa process begins.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Transcript (final years)",
      "Passport (valid at least 6 months)",
      "6 photos (3×4)",
      "English certificate if available (for English departments)",
    ],
    costNote:
      "Giresun University's annual tuition ranges from $1,200 to $3,000 — among the most affordable public universities in Turkey. Use the calculator above for an exact budget.",
    city: {
      heading: "City of Giresun and student life",
      paragraphs: [
        "Giresun is a city on the Black Sea coast, surrounded by hazelnut orchards and green mountains. It is calm and safe, far from the rush of a metropolis, yet has all the necessary infrastructure.",
        "The university campus sits close to the sea and offers students dorms, sports and dining options. Direct flights between Giresun and Baku let you visit family often.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "A Giresun University diploma is recognized by YÖK and nostrified in Azerbaijan. Medical graduates can specialize in Turkey through the TUS exam or continue practice in Azerbaijan.",
        "Engineering and economics graduates find broad opportunities in Turkey's growing industrial and service sectors.",
      ],
    },
  },
  "istanbul-universiteti": {
    slug: "istanbul-universiteti",
    intro: [
      "Istanbul University, with a history going back to 1453, is Turkey's oldest higher-education institution, located in the heart of Istanbul. Its centuries-old academic tradition and strong medical and law faculties attract international students.",
      "The university's historic campus sits in the Süleymaniye district and is equipped with modern laboratories. Istanbul, a city uniting two continents, offers students endless cultural and career possibilities.",
    ],
    admission: [
      {
        heading: "Document-based admission",
        paragraphs: [
          "Foreign-student applications to Istanbul University are evaluated on the certificate and transcript; no centralized exam like DIM is required. On competitive faculties (medicine, law) the certificate average is the main criterion.",
          "Documents are prepared and submitted to the university through MegaGroup; the result is usually announced within 3-5 weeks.",
        ],
      },
      {
        heading: "Tips for competitive programs",
        paragraphs: [
          "Medicine and law receive the most applications. A high certificate average and a strong motivation letter significantly boost your chances of acceptance.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Transcript (grades for years 9-11)",
      "Passport (valid at least 6 months)",
      "6 photos (3×4)",
      "Motivation letter (for competitive programs)",
    ],
    costNote:
      "Istanbul University's annual tuition ranges from $1,500 to $3,500. Note that Istanbul is Turkey's most expensive city — living costs are higher than in Anatolian cities.",
    city: {
      heading: "City of Istanbul and student life",
      paragraphs: [
        "Istanbul is a world metropolis of over 15 million people spanning two continents. The university's historic campus sits right at the center of the city's cultural and social life.",
        "The city hosts a large Azerbaijani community and active student unions. Museums, theaters and career opportunities make Istanbul attractive for study and for life experience alike.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "Istanbul University graduates earn a diploma recognized in Turkey and worldwide; it is nostrified in Azerbaijan. The university's wide alumni network is a real advantage when building a career.",
        "Law and medicine graduates can take prestigious positions both in Turkey and in Azerbaijan.",
      ],
    },
  },
  // ============================================================
  // RUSİYA
  // ============================================================
  "moskva-dovlet-universiteti": {
    slug: "moskva-dovlet-universiteti",
    intro: [
      "Lomonosov Moscow State University (MSU), founded in 1755 on Mikhail Lomonosov's initiative, is Russia's oldest and most prestigious university. The university, which has produced 12 Nobel laureates, ranks highest among Russian universities worldwide.",
      "Its historic building stands on Sparrow Hills above the Moskva River. Medicine, physics and economics are the most popular faculties among international students.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "MSU admits international students on the basis of their certificate; no centralized exam like DIM is required. Competitive faculties (medicine, physics) weigh the certificate average and an online interview.",
          "For students who do not speak Russian, the university runs a one-year preparatory faculty (podfak) — training in the language and core subjects.",
        ],
      },
      {
        heading: "Admission process and timing",
        paragraphs: [
          "Documents are prepared and submitted to the university through MegaGroup. The acceptance letter usually arrives within 3-6 weeks, after which the Russian student visa process begins.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Medical certificate (incl. HIV test)",
      "6 photos (3×4)",
      "Podfak registration for a preparatory year (if Russian needed)",
    ],
    costNote:
      "MSU's annual tuition ranges from $2,500 to $5,000 — well below Western European universities. Dormitory costs $40-100 per month.",
    city: {
      heading: "City of Moscow and student life",
      paragraphs: [
        "Moscow is Russia's capital and largest city. World-class museums, theaters and offices of international companies open broad horizons for students.",
        "The MSU campus includes dormitories, sports facilities and one of Russia's largest university libraries. The city has an active Azerbaijani community.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "An MSU diploma is recognized internationally and nostrified in Azerbaijan. Graduates can work in Russia's leading companies, research institutes and international corporations.",
        "MSU's famous alumni include Nobel laureates, prominent scientists and statesmen — the diploma itself is a strong academic brand.",
      ],
    },
  },
  "sankt-peterburg-universiteti": {
    slug: "sankt-peterburg-universiteti",
    intro: [
      "Saint Petersburg State University (SPbU), founded in 1724 by Peter the Great, is Russia's oldest university. Over its 300-year history it has been linked to 9 Nobel laureates.",
      "The university is located on Vasilyevsky Island on the Neva riverbank. Philology and law are its strongest faculties, and the city is nicknamed the 'Northern Venice'.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "SPbU admits international students on the basis of their certificate, without a centralized exam. The law faculty is competitive and weighs the certificate average; philology is more open.",
          "A preparatory faculty is available for students who do not know Russian — language and core subjects are taught over one year.",
        ],
      },
      {
        heading: "Admission process and timing",
        paragraphs: [
          "Applications go through MegaGroup: documents are prepared and sent to the university, and the acceptance letter usually arrives within 3-5 weeks. A student visa application follows.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Medical certificate",
      "Photos (3×4)",
      "Podfak registration for a preparatory year (if Russian needed)",
    ],
    costNote:
      "SPbU's annual tuition ranges from $2,200 to $4,500. Dormitory costs just $35-90 per month — the cheapest living option among partner universities.",
    city: {
      heading: "City of Saint Petersburg and student life",
      paragraphs: [
        "Saint Petersburg is a cultural capital famed for its canals, palaces and the Hermitage museum. The city is calmer than Moscow and friendlier to students.",
        "SPbU's main campus is on Vasilyevsky Island along the Neva. The city has an active Azerbaijani community and student unions.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "An SPbU diploma is recognized worldwide and nostrified in Azerbaijan. Its alumni include heads of state and prominent jurists.",
      ],
    },
  },
  // ============================================================
  // UKRAYNA
  // ============================================================
  "kiev-tibb-universiteti": {
    slug: "kiev-tibb-universiteti",
    intro: [
      "Kyiv Medical University is a well-known private medical university in Ukraine offering medicine and dentistry programs fully in English. Its main advantages are a diploma recognized in Europe and PMQ preparation support.",
      "Important note: because of the current situation in Ukraine, study options are limited to safe regions only. MegaGroup monitors the situation and advises each student individually about current conditions.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "Kyiv Medical University admits international students on the basis of their certificate, without a centralized exam. For English-taught programs, IELTS 6.0+ or the university's internal language test is enough.",
          "The admission process is simplified for international students and documents can be submitted online; the acceptance letter usually arrives within 2-4 weeks.",
        ],
      },
      {
        heading: "Safety note",
        paragraphs: [
          "Before deciding on placement in wartime conditions, the current security situation is checked. Only universities in safe regions are recommended; contact MegaGroup for the latest information.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "IELTS 6.0+ or internal language test result",
      "Photos (3×4)",
      "Medical certificate",
    ],
    costNote:
      "Kyiv Medical University's annual tuition ranges from $3,500 to $5,500 — far cheaper than Western European medical schools.",
    city: {
      heading: "Note on the city and student life",
      paragraphs: [
        "Before giving information about the city it is important to consider the security situation. Get the latest updates on conditions and safe regions in Ukraine from MegaGroup.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "Graduates with a medical diploma recognized in Europe can take PMQ in the UK and licensing exams in other European countries. The diploma is also nostrified in Azerbaijan.",
      ],
    },
  },
  "lvov-universiteti": {
    slug: "lvov-universiteti",
    intro: [
      "Lviv University (Ivan Franko National University of Lviv), founded in 1661, is the oldest and most prestigious university in western Ukraine. It offers a wide range of programs in economics, law and humanities.",
      "Lviv sits close to the Polish border and is known for its UNESCO-listed historic center. In the current situation Lviv is considered one of Ukraine's safest cities for study.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "Lviv University admits international students on the basis of their certificate, without a centralized exam. For English-taught programs, the university's internal language test or IELTS is enough.",
          "Documents are submitted online or through MegaGroup; the acceptance letter usually arrives within 2-4 weeks.",
        ],
      },
      {
        heading: "Safe-region advantage",
        paragraphs: [
          "Located in western Ukraine, Lviv is among the country's safest regions. The university continues teaching and accepts international students.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Photos (3×4)",
      "Language test result (for English-taught programs)",
      "Medical certificate",
    ],
    costNote:
      "Lviv University's annual tuition ranges from $3,000 to $4,800. Living costs are among Europe's lowest — a dormitory costs $50-110 per month.",
    city: {
      heading: "City of Lviv and student life",
      paragraphs: [
        "Lviv is considered Ukraine's cultural capital — European architecture, café culture and a lively young population. The city is small and comfortable, with everything within walking distance.",
        "Living costs are lower than in Kyiv, with a wide choice of dorms and rentals. Proximity to the Polish border makes traveling across Europe easy.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "A Lviv University diploma is recognized in Ukraine, valued in Europe and nostrified in Azerbaijan. Cooperation with European universities creates student-exchange opportunities.",
      ],
    },
  },
  // ============================================================
  // GÜRCÜSTAN
  // ============================================================
  "tbilisi-dovlet-tibb-universiteti": {
    slug: "tbilisi-dovlet-tibb-universiteti",
    intro: [
      "Tbilisi State Medical University (TSMU), founded in 1918, is Georgia's oldest and most prestigious medical university. It is listed by WHO and FAIMER — meaning the diploma is internationally recognized.",
      "TSMU offers a 6-year General Medicine (MD) program fully in English and is one of the closest foreign medical-study centers to Baku. Azerbaijani citizens can enter Georgia without a visa.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "TSMU admits international students on the basis of their certificate, without a centralized exam. The medical faculty is competitive — the certificate average and English proof (IELTS 5.5-6.0) matter.",
          "Students without language proof can take a preparatory year at the university. The acceptance letter usually arrives within 2-4 weeks.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "After acceptance, a student status in Georgia (sxeloba) is issued on the basis of the acceptance letter and renewed each year. The process is fully managed by MegaGroup.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Photos (3×4)",
      "English proof (IELTS 5.5-6.0 or preparatory year)",
      "Motivation letter in some cases",
    ],
    costNote:
      "TSMU's annual tuition ranges from $3,500 to $5,500. Monthly living costs in Tbilisi are about $220-420.",
    city: {
      heading: "City of Tbilisi and student life",
      paragraphs: [
        "Tbilisi stands out for its historic center, lively nightlife and multinational student environment. The city has a large Azerbaijani community, and many venues serve guests in Azerbaijani.",
        "Clinical practice takes place in Georgia's leading hospitals. Proximity to Baku lets you visit family at any time.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "TSMU graduates earn an MD diploma from a WHO/FAIMER-listed university and can take USMLE in the US and PLAB in the UK. The diploma is nostrified in Azerbaijan.",
      ],
    },
  },
  "batumi-shota-rustaveli-universiteti": {
    slug: "batumi-shota-rustaveli-universiteti",
    intro: [
      "Batumi Shota Rustaveli State University, founded in 1935, is the leading higher-education institution of Georgia's Adjara region. With its campus on the Black Sea coast it is one of the closest study centers to Azerbaijan.",
      "The university admits by certificate without a centralized exam and offers English-taught programs in engineering, business and tourism. Tuition is among the most affordable of the partner universities.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "Batumi University admits international students on the basis of their certificate, without requiring any centralized exam. The paperwork is simple — certificate, passport and photos are enough.",
          "Language proof (IELTS 5.5+ or an interview) is recommended for English-taught programs. The acceptance letter usually arrives within 2-3 weeks.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "After acceptance, a student status (sxeloba) is issued and accommodation in Batumi is arranged. No visa is required for Azerbaijani citizens.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Photos (3×4)",
      "IELTS 5.5+ if available (for English-taught programs)",
    ],
    costNote:
      "Batumi University's annual tuition ranges from $2,000 to $3,500 — one of the most affordable options. Monthly living costs in Batumi are about $220-460.",
    city: {
      heading: "City of Batumi and student life",
      paragraphs: [
        "Batumi is a fast-developing resort city on the Black Sea — modern skyscrapers, beaches and a lively nightlife all together. It is also calm and safe.",
        "Batumi is easy to reach from Baku by car or direct flight. Living costs are lower than in Tbilisi, and the environment is student-friendly.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "A Batumi University diploma is recognized in Georgia and nostrified in Azerbaijan. Tourism graduates can work in Batumi's growing hotel sector, while business graduates find roles in local and international companies.",
      ],
    },
  },
  // ============================================================
  // QAZAXISTAN
  // ============================================================
  "al-farabi-qazax-milli-universiteti": {
    slug: "al-farabi-qazax-milli-universiteti",
    intro: [
      "Al-Farabi Kazakh National University (KazNU), founded in 1934, is Central Asia's best university in international rankings such as QS. It is a large research center teaching more than 20,000 students.",
      "The university sits in the center of Almaty on a modern campus with mountain views. It offers programs in English and Russian across IT, international relations, business and medicine.",
    ],
    admission: [
      {
        heading: "Certificate-based admission",
        paragraphs: [
          "KazNU admits international students on the basis of their certificate, without a centralized exam. English-taught programs require IELTS 5.5+; a prep course is available for those without language proof.",
          "The medical faculty is competitive and considers the certificate average. Admission takes 2-4 weeks and is fully managed by MegaGroup.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "A Kazakh student visa is issued on the basis of the acceptance letter and accommodation in Almaty is arranged. After arrival, migration registration is completed within 3 days.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "Photos (3×4)",
      "IELTS 5.5+ if available (for English-taught programs)",
      "Medical certificate",
    ],
    costNote:
      "KazNU's annual tuition ranges from $2,000 to $4,000 — far cheaper than European and Turkish universities. Monthly living costs in Almaty are about $230-410.",
    city: {
      heading: "City of Almaty and student life",
      paragraphs: [
        "Almaty is Kazakhstan's largest city and cultural-business hub. Set at the foot of the mountains, it is known for its parks, lively student life and modern infrastructure.",
        "Adaptation is easy thanks to a culture and mindset close to Azerbaijan. KazNU's campus offers dorms, sports and student clubs for international students.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "A KazNU diploma is recognized across Central Asia and in Azerbaijan. Graduates can work in Kazakhstan's growing oil-and-gas, IT and business sectors, as well as in international companies.",
      ],
    },
  },
  "nazarbayev-universiteti": {
    slug: "nazarbayev-universiteti",
    intro: [
      "Nazarbayev University (NU), founded in 2010 in Astana, is Kazakhstan's most prestigious and internationally recognized university. Teaching is fully in English — a rarity in Kazakhstan.",
      "The university stands out for joint programs with international partners and modern research centers. Note: admission to NU is competitive — it differs from simple certificate-based entry and is meant for the strongest applicants.",
    ],
    admission: [
      {
        heading: "Competitive admission process",
        paragraphs: [
          "Admission to Nazarbayev University requires a high certificate average, IELTS 6.0+ or TOEFL, a motivation letter and, on some faculties, an interview. Competitive faculties are especially hard to enter.",
          "MegaGroup supports applicants at every stage: document preparation, writing the motivation letter and interview coaching.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "After acceptance, the student visa process begins and campus accommodation in Astana is arranged. NU's campus has modern dormitories and student centers.",
        ],
      },
    ],
    documents: [
      "Certificate (with a high average)",
      "IELTS 6.0+ or TOEFL result",
      "Motivation letter",
      "Interview (on competitive faculties)",
      "Passport and photos",
    ],
    costNote:
      "NU's annual tuition ranges from $3,500 to $6,000. The university offers scholarships for strong students; monthly living costs in Astana are about $300-560.",
    city: {
      heading: "City of Astana and student life",
      paragraphs: [
        "Astana is Kazakhstan's capital and fastest-growing city, famous for futuristic architecture. NU's campus is in the new city center, near the Expo area.",
        "Students from more than 60 countries study at NU — the environment is fully international. The sports complex, library and student clubs offer broad opportunities.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "Thanks to fully English-medium education, NU graduates can work in international companies and research centers; many continue master's studies at the world's leading universities. The diploma is nostrified in Azerbaijan.",
      ],
    },
  },
  // ============================================================
  // GERMANY
  // ============================================================
  "munchen-texniki-universiteti": {
    slug: "munchen-texniki-universiteti",
    intro: [
      "Technical University of Munich (TUM), founded in 1868, is among the world's best technical universities. Having produced 17 Nobel laureates, it is a global leader in engineering, computer science and technology.",
      "As a public university, TUM is practically tuition-free — only an annual semester fee is paid. Strong ties with companies such as Siemens and BMW let students join real projects.",
    ],
    admission: [
      {
        heading: "Studienkolleg and the admission process",
        paragraphs: [
          "Because an Azerbaijani certificate is not fully recognized for direct entry in Germany, most students first complete a one-year Studienkolleg and pass the Feststellungsprüfung exam.",
          "German-taught programs require TestDaF/DSH (B2-C1); English-taught programs require IELTS 6.5+. Applications go through Uni-assist, and an APS certificate is mandatory.",
        ],
      },
      {
        heading: "Visa and financial requirements",
        paragraphs: [
          "A student visa requires a blocked account (Sperrkonto) with ~€11,208 per year plus insurance. MegaGroup manages the whole process step by step.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation + apostille)",
      "APS certificate",
      "Studienkolleg acceptance document",
      "Language certificate: TestDaF/DSH or IELTS/TOEFL",
      "Blocked-account proof (~€11,208/year)",
    ],
    costNote:
      "There is no tuition at TUM — only an annual semester fee of ~€150-300. Munich is Germany's most expensive city; monthly living costs are about €850-1,200.",
    city: {
      heading: "City of Munich and student life",
      paragraphs: [
        "Munich is the capital of Bavaria and home to Germany's strongest economy. TUM's main campus is in the city center; its technology campus is in Garching.",
        "Student dorms, sports facilities and discounted transport (semester ticket) ease living costs. The city has a distinctly international atmosphere.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "TUM graduates access high-paying roles at companies like Siemens, BMW, Bosch and Google. After graduation an 18-month job-search visa is granted, and the diploma is recognized worldwide.",
      ],
    },
  },
  "berlin-universiteti": {
    slug: "berlin-universiteti",
    intro: [
      "Humboldt University of Berlin, founded in 1810 by Wilhelm von Humboldt, is regarded as the founder of the modern university model. Hegel, Einstein and the Grimm brothers worked here; 29 Nobel laureates are connected to the university.",
      "Located in central Berlin on Unter den Linden boulevard, it teaches more than 30,000 students. As a public university it is tuition-free.",
    ],
    admission: [
      {
        heading: "Studienkolleg and the admission process",
        paragraphs: [
          "Since an Azerbaijani certificate is not fully recognized for direct entry, most students first complete Studienkolleg and pass the Feststellungsprüfung. Philosophy requires German (TestDaF/DSH); biology accepts German or English.",
          "An APS certificate is mandatory; applications are submitted through Uni-assist.",
        ],
      },
      {
        heading: "Visa and financial requirements",
        paragraphs: [
          "A student visa requires ~€11,208 per year in a blocked account. MegaGroup fully manages the document and visa process.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation + apostille)",
      "APS certificate",
      "Studienkolleg acceptance document",
      "Language certificate: TestDaF/DSH or IELTS/TOEFL",
      "Blocked-account proof (~€11,208/year)",
    ],
    costNote:
      "Humboldt University is tuition-free — only an annual semester fee of ~€150-300. Monthly living costs in Berlin are lower than in Munich.",
    city: {
      heading: "City of Berlin and student life",
      paragraphs: [
        "Berlin is Germany's capital and one of Europe's cultural hubs — known for art galleries, historic monuments and a lively startup scene.",
        "The university's main building is on Unter den Linden in the historic center. Living costs are below Munich's, and student dorms offer a wide choice.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "Humboldt graduates work in the world's leading research institutes and cultural institutions. An 18-month job-search visa follows graduation; the diploma is nostrified in Azerbaijan.",
      ],
    },
  },
  // ============================================================
  // POLAND
  // ============================================================
  "varshava-tibb-universiteti": {
    slug: "varshava-tibb-universiteti",
    intro: [
      "Medical University of Warsaw (WUM) is Poland's largest and most prestigious medical university. Its main advantages are a European Union diploma, a modern hospital base and PMQ/USMLE preparation support.",
      "The university offers a 6-year medicine program and a 5-year dentistry program in English. Clinical practice takes place in Warsaw's leading hospitals, and the diploma is recognized across the EU.",
    ],
    admission: [
      {
        heading: "Certificate and language requirements",
        paragraphs: [
          "Admission to WUM is based on the certificate; English-taught programs require IELTS 6.0+ or an equivalent certificate. General medicine is open admission; dentistry is more competitive.",
          "The admission process is designed for international students and typically takes 4-8 weeks. MegaGroup manages the application, documents and visa process end to end.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "A Polish type-D student visa is issued on the basis of the acceptance letter and proof of finances, and accommodation in Warsaw is arranged.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "IELTS 6.0+ or equivalent language certificate",
      "Transcript and certificate supplement",
      "Proof of finances (for the visa)",
    ],
    costNote:
      "WUM's annual tuition ranges from $4,500 to $6,500. Monthly living costs in Warsaw are about $250-500.",
    city: {
      heading: "City of Warsaw and student life",
      paragraphs: [
        "Warsaw is one of Europe's fastest-growing capitals. WUM's campus sits in the city center, close to the best hospitals.",
        "The city has a large international student community, and it is easy to live with English alone. Students enjoy discounts on transport and culture.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "WUM graduates with an EU diploma can work directly across Europe and have a strong base for PMQ (UK) and USMLE (US) exams. The diploma is nostrified in Azerbaijan.",
      ],
    },
  },
  "krakov-tibb-universiteti": {
    slug: "krakov-tibb-universiteti",
    intro: [
      "Medical University of Kraków (the medical college of Jagiellonian University) is the medical school of one of Europe's oldest universities, founded in 1364. Its 600-year medical tradition and EU diploma are the main advantages.",
      "The university offers a 6-year general medicine program and a 5-year pharmacy program in English. Nicolaus Copernicus studied at this very university.",
    ],
    admission: [
      {
        heading: "Certificate and language requirements",
        paragraphs: [
          "Admission to the Medical University of Kraków is based on the certificate; English-taught programs require IELTS 6.0+. General medicine and pharmacy are open admission.",
          "The admission process takes 4-8 weeks. MegaGroup fully manages document preparation, the application and the visa process.",
        ],
      },
      {
        heading: "Steps after acceptance",
        paragraphs: [
          "After acceptance, a Polish type-D student visa is issued and accommodation in Kraków is arranged. The university also helps students choose dormitories.",
        ],
      },
    ],
    documents: [
      "Certificate (original + notarized translation)",
      "Passport (valid at least 6 months)",
      "IELTS 6.0+ or equivalent language certificate",
      "Transcript and certificate supplement",
      "Proof of finances (for the visa)",
    ],
    costNote:
      "The Medical University of Kraków's annual tuition ranges from $4,000 to $6,000 — slightly below Warsaw. Monthly living costs in Kraków are about $280-650.",
    city: {
      heading: "City of Kraków and student life",
      paragraphs: [
        "Kraków is Poland's former capital and oldest university city. It features a UNESCO-listed center and one of Europe's liveliest student environments.",
        "The city hosts more than 20 higher-education institutions, and students make up a large share of the population. Living costs are lower than in Warsaw.",
      ],
    },
    career: {
      heading: "Graduation and career opportunities",
      paragraphs: [
        "Graduates of the Medical University of Kraków with an EU diploma can obtain a medical license across Europe. The diploma is nostrified in Azerbaijan, and graduates can build careers in international medical centers.",
      ],
    },
  },
};

export function getUniversityContentEn(slug: string): UniversityContent | undefined {
  return UNIVERSITY_CONTENT_EN[slug];
}
