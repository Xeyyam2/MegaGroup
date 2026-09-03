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

// Universitet məqalələri — hər flaqman universitet üçün ayrıca bələdçi.
// Məqalə slug-ı universitet slug-ı ilə eynidir (universitet səhifəsindən
// kontekstual cross-link üçün). Fakültə və xərc cədvəlləri universitələrin
// rəsmi datası ilə uyğundur.
import giresunUniversiteti from "./articles/giresun-universiteti";
import tbilisiDovletTibb from "./articles/tbilisi-dovlet-tibb-universiteti";
import varshavaTibb from "./articles/varshava-tibb-universiteti";
import munchenTexniki from "./articles/munchen-texniki-universiteti";
import moskvaDovlet from "./articles/moskva-dovlet-universiteti";
import kievTibb from "./articles/kiev-tibb-universiteti";
import alFarabiQazax from "./articles/al-farabi-qazax-milli-universiteti";
import hansiUniversitetiSecmek from "./articles/hansi-universiteti-secmek-lazimdir";
import istanbulUniversiteti from "./articles/istanbul-universiteti";
import sanktPeterburg from "./articles/sankt-peterburg-universiteti";
import lvovUniversiteti from "./articles/lvov-universiteti";
import berlinUniversiteti from "./articles/berlin-universiteti";
import krakovTibb from "./articles/krakov-tibb-universiteti";
import batumiDovlet from "./articles/batumi-shota-rustaveli-universiteti";
import nazarbayev from "./articles/nazarbayev-universiteti";

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
  // Universitet bələdçiləri (məqalə slug-ı = universitet slug-ı)
  giresunUniversiteti,
  tbilisiDovletTibb,
  varshavaTibb,
  munchenTexniki,
  moskvaDovlet,
  kievTibb,
  alFarabiQazax,
  // Bütün universitetləri yan-yana müqayisə edən pillar məqalə (AI cədvəl çıxarışı)
  hansiUniversitetiSecmek,
  // Qalan flaqman olmayan universitet bələdçiləri — hər 14 universitetin məqaləsi var
  istanbulUniversiteti,
  sanktPeterburg,
  lvovUniversiteti,
  berlinUniversiteti,
  krakovTibb,
  batumiDovlet,
  nazarbayev,
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
import giresunUniversitetiRu from "./articles/giresun-universiteti.ru";
import giresunUniversitetiEn from "./articles/giresun-universiteti.en";
import tbilisiDovletTibbRu from "./articles/tbilisi-dovlet-tibb-universiteti.ru";
import tbilisiDovletTibbEn from "./articles/tbilisi-dovlet-tibb-universiteti.en";
import varshavaTibbRu from "./articles/varshava-tibb-universiteti.ru";
import varshavaTibbEn from "./articles/varshava-tibb-universiteti.en";
import munchenTexnikiRu from "./articles/munchen-texniki-universiteti.ru";
import munchenTexnikiEn from "./articles/munchen-texniki-universiteti.en";
import moskvaDovletRu from "./articles/moskva-dovlet-universiteti.ru";
import moskvaDovletEn from "./articles/moskva-dovlet-universiteti.en";
import kievTibbRu from "./articles/kiev-tibb-universiteti.ru";
import kievTibbEn from "./articles/kiev-tibb-universiteti.en";
import alFarabiQazaxRu from "./articles/al-farabi-qazax-milli-universiteti.ru";
import alFarabiQazaxEn from "./articles/al-farabi-qazax-milli-universiteti.en";
import hansiUniversitetiSecmekRu from "./articles/hansi-universiteti-secmek-lazimdir.ru";
import hansiUniversitetiSecmekEn from "./articles/hansi-universiteti-secmek-lazimdir.en";
import istanbulUniversitetiRu from "./articles/istanbul-universiteti.ru";
import istanbulUniversitetiEn from "./articles/istanbul-universiteti.en";
import sanktPeterburgRu from "./articles/sankt-peterburg-universiteti.ru";
import sanktPeterburgEn from "./articles/sankt-peterburg-universiteti.en";
import lvovUniversitetiRu from "./articles/lvov-universiteti.ru";
import lvovUniversitetiEn from "./articles/lvov-universiteti.en";
import berlinUniversitetiRu from "./articles/berlin-universiteti.ru";
import berlinUniversitetiEn from "./articles/berlin-universiteti.en";
import krakovTibbRu from "./articles/krakov-tibb-universiteti.ru";
import krakovTibbEn from "./articles/krakov-tibb-universiteti.en";
import batumiDovletRu from "./articles/batumi-shota-rustaveli-universiteti.ru";
import batumiDovletEn from "./articles/batumi-shota-rustaveli-universiteti.en";
import nazarbayevRu from "./articles/nazarbayev-universiteti.ru";
import nazarbayevEn from "./articles/nazarbayev-universiteti.en";

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
  "giresun-universiteti": { ru: giresunUniversitetiRu, en: giresunUniversitetiEn },
  "tbilisi-dovlet-tibb-universiteti": { ru: tbilisiDovletTibbRu, en: tbilisiDovletTibbEn },
  "varshava-tibb-universiteti": { ru: varshavaTibbRu, en: varshavaTibbEn },
  "munchen-texniki-universiteti": { ru: munchenTexnikiRu, en: munchenTexnikiEn },
  "moskva-dovlet-universiteti": { ru: moskvaDovletRu, en: moskvaDovletEn },
  "kiev-tibb-universiteti": { ru: kievTibbRu, en: kievTibbEn },
  "al-farabi-qazax-milli-universiteti": { ru: alFarabiQazaxRu, en: alFarabiQazaxEn },
  "hansi-universiteti-secmek-lazimdir": { ru: hansiUniversitetiSecmekRu, en: hansiUniversitetiSecmekEn },
  "istanbul-universiteti": { ru: istanbulUniversitetiRu, en: istanbulUniversitetiEn },
  "sankt-peterburg-universiteti": { ru: sanktPeterburgRu, en: sanktPeterburgEn },
  "lvov-universiteti": { ru: lvovUniversitetiRu, en: lvovUniversitetiEn },
  "berlin-universiteti": { ru: berlinUniversitetiRu, en: berlinUniversitetiEn },
  "krakov-tibb-universiteti": { ru: krakovTibbRu, en: krakovTibbEn },
  "batumi-shota-rustaveli-universiteti": { ru: batumiDovletRu, en: batumiDovletEn },
  "nazarbayev-universiteti": { ru: nazarbayevRu, en: nazarbayevEn },
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
