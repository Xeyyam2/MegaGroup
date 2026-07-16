import type { Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { socialLinks } from "@/lib/social-links";

/**
 * Bloq məqalələrinin redaksiya müəllifi.
 *
 * Müəqəqil fərdi byline (real konsultant adı) olmadığından, məqalələri faktiki
 * olaraq hazırlayan MegaGroup təhsil-konsultantı komandasını təmsil edən
 * `Person` kimi modelləşdiririk. Bu, E-E-A-T (Experience, Expertise,
 * Authoritativeness, Trust) siqnalını gücləndirir — AI/Google məzmunun
 * kimə aid olduğunu və hansı ekspertizaya söykəndiyini görür.
 *
 * Real fərdi müəlliflər əlavə edildikdə bu siyahı genişlənə bilər.
 */
export interface SiteAuthor {
  /** schema.org `Person` @id — sayt daxilində sabit identifikator. */
  "@id": string;
  name: string;
  jobTitle: string;
  /** Şəkil (müvafiq `Person.image` üçün absolyut URL). */
  image: string;
  /** Bio — qısa təcrübə açıqlaması (locale-spesifik). */
  bio: Record<Locale, string>;
  knowsAbout: string[];
  alumniOf: string[];
  worksFor: { "@type": "Organization"; name: string; url: string };
  sameAs: string[];
}

export const editorialAuthor: SiteAuthor = {
  "@id": `${siteUrl}/#editorial-team`,
  name: "MegaGroup Təhsil Konsultantları",
  jobTitle: "Təhsil üzrə Baş Konsultant",
  image: `${siteUrl}/icons/icon-512.png`,
  bio: {
    az: "MegaGroup-un təhsil konsultantları komandası 2018-ci ildən bəri 1000-dən çox Azərbaycan tələbəsini Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan, Almaniya və Polşada 200+ universitetə yerləşdirib. Bu bələdçilər yerləşdirmə təcrübəsi, universitet tələbləri və real xərc məlumatları əsasında hazırlanır.",
    ru: "Команда консультантов MegaGroup с 2018 года направила более 1000 азербайджанских студентов в 200+ университетов Турции, России, Грузии, Украины, Казахстана, Германии и Польши. Эти руководства составлены на основе опыта поступления, требований вузов и реальных данных о расходах.",
    en: "MegaGroup's team of education consultants has placed 1000+ Azerbaijani students into 200+ universities across Turkey, Russia, Georgia, Ukraine, Kazakhstan, Germany, and Poland since 2018. These guides are written from hands-on placement experience, university requirements, and real cost data.",
  },
  knowsAbout: [
    "Study abroad from Azerbaijan",
    "Certificate-based (attestat) university admission",
    "Exam-free admission (no DIM/SAT/YÖS)",
    "Student visa for Turkey, Russia, Georgia, Ukraine, Kazakhstan, Germany, Poland",
    "English-medium medical programs abroad",
    "Studienkolleg and APS for Germany",
    "University shortlisting by attestat scores",
  ],
  alumniOf: [
    "Bakı Dövlət Universiteti",
    "Baku State University",
  ],
  worksFor: { "@type": "Organization", name: "MegaGroup", url: siteUrl },
  sameAs: [
    socialLinks.instagram,
    socialLinks.linkedin,
    socialLinks.facebook,
  ],
};

/**
 * schema.org `Person` obyekti — JSON-LD-yə birbaşa yerləşdirmək üçün.
 */
export function authorPersonJsonLd(locale: Locale = "az") {
  return {
    "@type": "Person",
    "@id": editorialAuthor["@id"],
    name: editorialAuthor.name,
    jobTitle: editorialAuthor.jobTitle,
    image: editorialAuthor.image,
    description: editorialAuthor.bio[locale],
    knowsAbout: editorialAuthor.knowsAbout,
    alumniOf: editorialAuthor.alumniOf,
    worksFor: editorialAuthor.worksFor,
    sameAs: editorialAuthor.sameAs,
    url: siteUrl,
  };
}
