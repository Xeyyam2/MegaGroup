export interface ArticleSection {
  heading: string;
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
