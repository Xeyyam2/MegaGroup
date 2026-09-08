/**
 * Partnyor saytlara verilen dofollow backlinkler.
 *
 * SEO qaydaları (senior-level):
 *  - Linkler server-rendered (RSC) komponentlerde (Footer, ölkə səhifələri)
 *    yerləşdirilir ki, crawler-lar görə bilsin.
 *  - `rel="noopener"` + `target="_blank"` istifadə olunur — `nofollow` YOX
 *    (qəsdən editorial/partnyor linkdir), `noreferrer` də YOX (partnyor
 *    referral trafikini görə bilsin).
 *  - Anchor diversifikasiyası: footer-də brend anchor, məqalə/ölkə
 *    səhifələrində kontekstual açar söz anchoru — over-optimization riski azalır.
 *  - Deep link: ana səhifə əvəzinə mövzuya uyğun dərin səhifəyə verilir.
 */
export const partnerLinks = {
  eduvix: {
    url: "https://eduvix.az/xaricde-tehsil",
    // Sitewide footer üçün brend + açar söz anchoru.
    anchor: {
      az: "EduVix — Xaricdə Təhsil",
      ru: "EduVix — Обучение за рубежом",
      en: "EduVix — Study Abroad",
    },
    // Ölkə səhifələrində kontekstual açar söz anchoru.
    topicAnchor: {
      az: "Türkiyədə təhsil",
      ru: "Обучение в Турции",
      en: "Study in Turkey",
    },
  },
} as const;
