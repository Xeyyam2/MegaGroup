/**
 * MegaGroup-un üçüncü tərəf entity profilləri.
 *
 * Bu linklər `Organization.sameAs` / `ProfessionalService.sameAs` JSON-LD
 * sahələrində istifadə olunur — Google və AI sistemləri bunları oxuyaraq
 * brend entity-sini müxtəlif platformalarda "eyni" kimi tanıyır
 * (entity reconciliation). Eyni siyahı UI-də (Footer, Author kartı) də
 * təkrar istifadə olunur ki, siyahı tək yerdə qalsın.
 *
 * Yeni profil əlavə edildikdə (Wikidata, LinkedIn və s.) sadəcə bura yaz.
 */
export const socialLinks = {
  instagram: "https://www.instagram.com/mega_xaricde_tehsil_merkezi/",
  tiktok: "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi",
  facebook: "https://www.facebook.com/megatehsil",
  linkedin: "https://www.linkedin.com/company/megagroup-xaricde-tehsil",
  // Google Business Profile (LocalBusiness) — yerli axtarış + xəritə üçün.
  googleBusiness:
    "https://www.google.com/maps/search/?api=1&query=MegaGroup+Baku+xaricde+tehsil",
  youtube: "https://www.youtube.com/@megatehsil",
} as const;

/**
 * sameAs JSON-LD siyahısı — boş/yalnış link olmaması üçün mövcud olanları
 * filtrləyir v ardıcıl sıralayır.
 */
export const organizationSameAs: string[] = [
  socialLinks.instagram,
  socialLinks.tiktok,
  socialLinks.facebook,
  socialLinks.linkedin,
  socialLinks.googleBusiness,
  socialLinks.youtube,
];
