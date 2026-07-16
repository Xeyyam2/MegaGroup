import { siteUrl } from "@/lib/site";

/**
 * MegaGroup-un qlobal xaricdə-təhsil prosesi — 9 addım.
 *
 * Mənbə: `public/llms.txt` "STUDY-ABROAD PROCESS" bölməsi. Bu məlumat
 * tək yerdə qalsın deyə burada saxlanılır və həm `HowTo` JSON-LD, həm də
 * lazım gələrsə UI renderi üçün istifadə olunur.
 */
export interface ProcessStep {
  step: number;
  name: string;
  text: string;
}

export const studyAbroadProcess: ProcessStep[] = [
  {
    step: 1,
    name: "Pulsuz konsultasiya",
    text: "Məqsədlər, büdcə, qiymətlər və üstünlük verilən ölkə qiymətləndirilir.",
  },
  {
    step: 2,
    name: "Ölkə və universitet seçimi",
    text: "Attestat balına əsaslanan qısa siyahı hazırlanır.",
  },
  {
    step: 3,
    name: "Sənədlərin hazırlanması",
    text: "Attestat, pasport, tərcümə və notarial təsdiq.",
  },
  {
    step: 4,
    name: "Universitetə müraciət",
    text: "Onlayn portal, birbaşa və ya Almaniya üçün Uni-assist vasitəsilə təqdim.",
  },
  {
    step: 5,
    name: "Qəbul məktubu (dəvət)",
    text: "Universitetdən rəsmi qəbul/dəvət məktubu alınır.",
  },
  {
    step: 6,
    name: "Tələbə vizası",
    text: "Müvafiq səfirlikdə/konsulluqda tələbə vizası üçün müraciət.",
  },
  {
    step: 7,
    name: "Uçuş və yaşayış",
    text: "Bilet bronu və yaşayış yeri (yataqxana və ya mənzil).",
  },
  {
    step: 8,
    name: "Gəliş və qeydiyyat",
    text: "Ölkəyə gəliş və universitetdə rəsmi qeydiyyat.",
  },
  {
    step: 9,
    name: "Yaşayış icazəsi",
    text: "Yerli miqrasiya orqanında qeydiyyat/yaşayış icazəsi.",
  },
];

export const studyAbroadProcessMeta = {
  totalTime: "P2M",
  estimatedCost: {
    currency: "USD",
    value: "0",
    // İlk konsultasiya pulsuzdur; xidmət haqqı ölkə/universitetdən asılıdır.
  },
};

/**
 * schema.org `HowTo` JSON-LD — AI Overviews və zəngin nəticələr üçün.
 */
export function howToJsonLd(localePrefix = "/az") {
  const baseUrl = `${siteUrl}${localePrefix}/xaricde-tehsil`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Azərbaycandan xaricdə təhsilə necə qəbul olmaq — 9 addım",
    description:
      "MegaGroup-un xaricdə təhsil prosesi: pulsuz konsultasiyadan yaşayış icazəsinə qədər 9 addım. Attestatla, DIM/SAT imtahanı olmadan qəbul.",
    totalTime: studyAbroadProcessMeta.totalTime,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: studyAbroadProcessMeta.estimatedCost.currency,
      value: studyAbroadProcessMeta.estimatedCost.value,
    },
    inLanguage: "az",
    tool: [
      { "@type": "HowToTool", name: "Pulsuz konsultasiya sessiyası" },
      { "@type": "HowToTool", name: `${siteUrl}${localePrefix}/xaricde-tehsil/hesabla` },
    ],
    supply: [
      { "@type": "HowToSupply", name: "Attestat (orijinal + tərcümə)" },
      { "@type": "HowToSupply", name: "Pasport (6 ay müddətli)" },
      { "@type": "HowToSupply", name: "Transkript (notar təsdiqli)" },
    ],
    step: studyAbroadProcess.map((s, i) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.name,
      text: s.text,
      url: `${baseUrl}#addim-${i + 1}`,
    })),
    publisher: { "@type": "Organization", name: "MegaGroup", url: siteUrl },
    mainEntityOfPage: baseUrl,
  };
}
