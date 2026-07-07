/**
 * Saytın əsas URL-i (canonical domain).
 * Apex (megatehsil.com) www variantına 308 redirect edir,
 * ona görə canonical olaraq www.megatehsil.com istifade edirik.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.megatehsil.com";