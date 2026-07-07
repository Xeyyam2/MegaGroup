/**
 * SEO açar söz xəritəsi — qrammatik düzgün Azərbaycan forması.
 *
 * Azərbaycan dilində sait ahəngi qaydası: "Türkiyə" son sait "ə" olduğundan
 * lokativ şəkilçisi "də" olur (Türkiyədə), qalan adlar "a" ilə bitdiyi üçün
 * "da" alır (Rusiyada, Ukraynada, Gürcüstanda, Qazaxıstanda, Almaniyada, Polşada).
 *
 * Əvvəlki kod `${name.toLowerCase()}da təhsil` generasiya edirdi ki, bu
 * Türkiyə üçün qrammatik səhv "türkiyəda təhsil" verirdi. Bu fayl hər ölkə
 * üçün əvvəlcədən düzgün açar söz, H1, title və meta description saxlayır.
 */

export interface CountrySeo {
  /** Açar sözün başında yerləşən H1 (məs. "Türkiyədə Təhsil"). */
  h1: string;
  /** `<title>` teqi — açar söz başda, 60 simvola yaxın. */
  title: string;
  /** Meta description — 150-160 simvol, açar sözlə zəngin. */
  metaDescription: string;
  /** Exact-match əsas açar söz (keyword density üçün). */
  primaryKeyword: string;
  /** API/JSON-LD üçün ikinci dərəcəli açar sözlər. */
  keywords: string[];
}

const COUNTRY_SEO: Record<string, CountrySeo> = {
  turkiye: {
    h1: "Türkiyədə Təhsil 2026",
    title: "Türkiyədə Təhsil 2026 — Attestatla, İmtahansız Qəbul | MegaGroup",
    metaDescription:
      "Türkiyədə təhsil: 200+ universitet, attestatla DIM olmadan qəbul. Təhsil haqqı, ən yaxşı universitetlər, viza və xərclər haqqında tam bələdçi. Pulsuz konsultasiya.",
    primaryKeyword: "türkiyədə təhsil",
    keywords: [
      "türkiyədə təhsil",
      "turkiyede tehsil",
      "türkiyə universitetləri",
      "attestatla türkiyəyə qəbul",
      "türkiyədə imtahansız təhsil",
      "türkiyədə oxumaq",
    ],
  },
  rusiya: {
    h1: "Rusiyada Təhsil 2026",
    title: "Rusiyada Təhsil 2026 — Attestatla, İmtahansız Qəbul | MegaGroup",
    metaDescription:
      "Rusiyada təhsil: tibb və mühəndislik proqramları, attestatla qəbul şərtləri, universitetlər, xərclər və viza prosesi. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "rusiyada təhsil",
    keywords: [
      "rusiyada təhsil",
      "rusiyada tehsil",
      "rusiya universitetləri",
      "rusiyada tibb təhsili",
      "attestatla rusiyaya qəbul",
      "rusiyada oxumaq",
    ],
  },
  ukrayna: {
    h1: "Ukraynada Təhsil 2026",
    title: "Ukraynada Təhsil 2026 — Tibb, Mühəndislik, Attestatla Qəbul | MegaGroup",
    metaDescription:
      "Ukraynada təhsil: ingilis dilində tibb proqramları, attestatla qəbul, universitetlər, beynəlxalq diplom, xərclər və viza. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "ukraynada təhsil",
    keywords: [
      "ukraynada təhsil",
      "ukraynada tehsil",
      "ukrayna universitetləri",
      "ukraynada tibb təhsili",
      "attestatla ukraynaya qəbul",
      "ukraynada oxumaq",
    ],
  },
  gurcustan: {
    h1: "Gürcüstanda Təhsil 2026",
    title: "Gürcüstanda Təhsil 2026 — Attestatla, İngilis Dilində Tibb | MegaGroup",
    metaDescription:
      "Gürcüstanda təhsil: Tbilisi və Batumi universitetləri, attestatla imtahansız qəbul, ingilis dilində tibb, xərclər və viza. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "gürcüstanda təhsil",
    keywords: [
      "gürcüstanda təhsil",
      "gurcustanda tehsil",
      "tbilisidə təhsil",
      "gürcüstan universitetləri",
      "gürcüstanda tibb təhsili",
      "batumidə təhsil",
    ],
  },
  qazaxistan: {
    h1: "Qazaxıstanda Təhsil 2026",
    title: "Qazaxıstanda Təhsil 2026 — Attestatla, Nazarbayev Universiteti | MegaGroup",
    metaDescription:
      "Qazaxıstanda təhsil: Almatı və Astana universitetləri, attestatla imtahansız qəbul, ingilis dilində proqramlar, xərclər və viza. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "qazaxistanda təhsil",
    keywords: [
      "qazaxistanda təhsil",
      "qazaxistanda tehsil",
      "qazaxıstan universitetləri",
      "almatıda təhsil",
      "attestatla qazaxıstana qəbul",
      "nazarbayev universiteti",
    ],
  },
  almaniya: {
    h1: "Almaniyada Təhsil 2026",
    title: "Almaniyada Təhsil 2026 — Pulsuz Universitetlər, Mühəndislik | MegaGroup",
    metaDescription:
      "Almaniyada təhsil: dövlət universitetlərində pulsuz təhsil, Studienkolleg, mühəndislik proqramları, qəbul şərtləri və xərclər. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "almaniyada təhsil",
    keywords: [
      "almaniyada təhsil",
      "almaniyada pulsuz təhsil",
      "almaniya universitetləri",
      "studienkolleg",
      "almaniyada magistr",
      "almaniyada oxumaq",
    ],
  },
  polsa: {
    h1: "Polşada Təhsil 2026",
    title: "Polşada Təhsil 2026 — İngilis Dilində Tibb, EU Diplomu | MegaGroup",
    metaDescription:
      "Polşada təhsil: ingilis dilində tibb və stomatologiya, EU diplomu, qəbul şərtləri, xərclər və viza prosesi. MegaGroup-dan tam bələdçi.",
    primaryKeyword: "polşada təhsil",
    keywords: [
      "polşada təhsil",
      "polşada tehsil",
      "polşa universitetləri",
      "polşada tibb təhsili",
      "attestatla polşaya qəbul",
      "polşada oxumaq",
    ],
  },
};

export function getCountrySeo(slug: string): CountrySeo | undefined {
  return COUNTRY_SEO[slug];
}
