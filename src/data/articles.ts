export type { Article, ArticleSection, ArticleFAQItem } from "./articles/types";

import type { Article } from "./articles/types";
import type { Locale } from "@/i18n/routing";

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

// RU/EN tərcümələri. AZ bazadır; RU/EN yoxdursa AZ-a fallback.
import xaricdeTehsilRu from "./articles/xaricde-tehsil-2026-beledcisi.ru";
import xaricdeTehsilEn from "./articles/xaricde-tehsil-2026-beledcisi.en";
import turkiyedeTehsilRu from "./articles/turkiyede-tehsil.ru";
import turkiyedeTehsilEn from "./articles/turkiyede-tehsil.en";
import rusiyadaTehsilRu from "./articles/rusiyada-tehsil.ru";
import rusiyadaTehsilEn from "./articles/rusiyada-tehsil.en";
import ukraynadaTehsilRu from "./articles/ukraynada-tehsil.ru";
import ukraynadaTehsilEn from "./articles/ukraynada-tehsil.en";
import gurcustandaTehsilRu from "./articles/gurcustanda-tehsil.ru";
import gurcustandaTehsilEn from "./articles/gurcustanda-tehsil.en";
import qazaxistandaTehsilRu from "./articles/qazaxistanda-tehsil.ru";
import qazaxistandaTehsilEn from "./articles/qazaxistanda-tehsil.en";
import almaniyadaTehsilRu from "./articles/almaniyada-tehsil.ru";
import almaniyadaTehsilEn from "./articles/almaniyada-tehsil.en";
import polsadaTehsilRu from "./articles/polsada-tehsil.ru";
import polsadaTehsilEn from "./articles/polsada-tehsil.en";
import xaricdeTibbTehsiliRu from "./articles/xaricde-tibb-tehsili.ru";
import xaricdeTibbTehsiliEn from "./articles/xaricde-tibb-tehsili.en";
import xaricdeTehsilSenedleriRu from "./articles/xaricde-tehsil-senedleri.ru";
import xaricdeTehsilSenedleriEn from "./articles/xaricde-tehsil-senedleri.en";
import hansiOlkedeOxumaqRu from "./articles/hansi-olkede-oxumaq-serfelidir.ru";
import hansiOlkedeOxumaqEn from "./articles/hansi-olkede-oxumaq-serfelidir.en";

const TRANSLATIONS: Record<string, { ru?: Article; en?: Article }> = {
  "xaricde-tehsil-2026-beledcisi": { ru: xaricdeTehsilRu, en: xaricdeTehsilEn },
  "turkiyede-tehsil": { ru: turkiyedeTehsilRu, en: turkiyedeTehsilEn },
  "rusiyada-tehsil": { ru: rusiyadaTehsilRu, en: rusiyadaTehsilEn },
  "ukraynada-tehsil": { ru: ukraynadaTehsilRu, en: ukraynadaTehsilEn },
  "gurcustanda-tehsil": { ru: gurcustandaTehsilRu, en: gurcustandaTehsilEn },
  "qazaxistanda-tehsil": { ru: qazaxistandaTehsilRu, en: qazaxistandaTehsilEn },
  "almaniyada-tehsil": { ru: almaniyadaTehsilRu, en: almaniyadaTehsilEn },
  "polsada-tehsil": { ru: polsadaTehsilRu, en: polsadaTehsilEn },
  "xaricde-tibb-tehsili": { ru: xaricdeTibbTehsiliRu, en: xaricdeTibbTehsiliEn },
  "xaricde-tehsil-senedleri": { ru: xaricdeTehsilSenedleriRu, en: xaricdeTehsilSenedleriEn },
  "hansi-olkede-oxumaq-serfelidir": { ru: hansiOlkedeOxumaqRu, en: hansiOlkedeOxumaqEn },
};

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

// Lokallaşdırılmış məqalə: RU/EN yoxdursa AZ fallback.
export function getArticleBySlugLocalized(slug: string, locale: Locale): Article | undefined {
  const base = getArticleBySlug(slug);
  if (!base) return undefined;
  if (locale === "ru" || locale === "en") {
    return TRANSLATIONS[slug]?.[locale] ?? base;
  }
  return base;
}

// Bütün məqalələr lokalaşdırılmış formada (bloq index səhifəsi üçün).
export function getLocalizedArticles(locale: Locale): Article[] {
  return ARTICLES.map((a) => {
    if (locale === "ru" || locale === "en") {
      return TRANSLATIONS[a.slug]?.[locale] ?? a;
    }
    return a;
  });
}
