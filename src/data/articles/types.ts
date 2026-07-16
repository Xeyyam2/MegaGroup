export interface ArticleSection {
  heading: string;
  /**
   * Qısa birbaşa cavab (2-3 cümlə) — H2-nin dərhal altında, detallı
   * paraqraflardan əvvəl göstərilir. GEO/AEO üçün kritik: AI "featured
   * snippet" / birbaşa cavab kimi bunu çıxarış edir. Olmasa detal oxunur.
   */
  summary?: string;
  paragraphs: string[];
  list?: string[];
  table?: { headers: string[]; rows: string[][] };
}

export interface ArticleFAQItem {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  keyword: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  heroEmoji: string;
  updatedAt: string;
  readingMinutes: number;
  relatedCountrySlug?: string;
  intro: string[];
  sections: ArticleSection[];
  faqs: ArticleFAQItem[];
  relatedArticleSlugs?: string[];
}
