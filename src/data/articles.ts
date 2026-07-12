export type { Article, ArticleSection, ArticleFAQItem } from "./articles/types";

import type { Article } from "./articles/types";

import xaricdeTehsil from "./articles/xaricde-tehsil-2026-beledcisi";
import turkiyedeTehsil from "./articles/turkiyede-tehsil";
import rusiyadaTehsil from "./articles/rusiyada-tehsil";
import ukraynadaTehsil from "./articles/ukraynada-tehsil";
import gurcustandaTehsil from "./articles/gurcustanda-tehsil";
import qazaxistandaTehsil from "./articles/qazaxistanda-tehsil";
import almaniyadaTehsil from "./articles/almaniyada-tehsil";
import polsadaTehsil from "./articles/polsada-tehsil";
import xaricdeTibbTehsili from "./articles/xaricde-tibb-tehsili";
import xaricdeTehsilSenedleri from "./articles/xaricde-tehsil-senedleri";
import hansiOlkedeOxumaq from "./articles/hansi-olkede-oxumaq-serfelidir";

export const ARTICLES: Article[] = [
  xaricdeTehsil,
  turkiyedeTehsil,
  rusiyadaTehsil,
  ukraynadaTehsil,
  gurcustandaTehsil,
  qazaxistandaTehsil,
  almaniyadaTehsil,
  polsadaTehsil,
  xaricdeTibbTehsili,
  xaricdeTehsilSenedleri,
  hansiOlkedeOxumaq,
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
