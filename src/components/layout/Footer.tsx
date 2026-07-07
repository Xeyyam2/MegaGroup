import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { TikTokIcon } from "@/components/ui/TikTokIcon";
import { getCountries } from "@/lib/data/countries";
import type { Locale } from "@/i18n/routing";

const DEFAULT_WHATSAPP_URL = "https://wa.me/994519999370";
const DEFAULT_PHONE = "+994 51 572 35 54";

export async function Footer({
  instagramUrl,
  tiktokUrl,
  footerDesc,
  whatsappUrl,
  phone,
}: {
  instagramUrl?: string;
  tiktokUrl?: string;
  footerDesc?: string;
  whatsappUrl?: string;
  phone?: string;
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const countries = await getCountries(locale);

  const igUrl = instagramUrl || "https://www.instagram.com/mega_xaricde_tehsil_merkezi/";
  const ttUrl = tiktokUrl || "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi";
  const waUrl = whatsappUrl || DEFAULT_WHATSAPP_URL;
  // Edited from Admin → Sayt Məzmunu → "contact_phone". Falls back to a
  // sane default so the footer never shows a blank number if that key is
  // ever missing.
  const phoneDisplay = phone || DEFAULT_PHONE;
  const phoneTel = `+${phoneDisplay.replace(/[^0-9]/g, "")}`;

  const tagline =
    locale === "az" ? "Xaricdə Təhsil Mərkəzi" : locale === "ru" ? "Центр обучения за рубежом" : "Study Abroad Center";
  const desc =
    footerDesc ||
    (locale === "az"
      ? "Azərbaycanlı tələbələr üçün xaricdə təhsil imkanlarını attestatla, imtahansız təqdim edirik."
      : locale === "ru"
        ? "Мы предлагаем азербайджанским студентам обучение за рубежом по аттестату, без экзаменов."
        : "We offer Azerbaijani students study-abroad opportunities by certificate, exam-free.");

  return (
    <footer className="glass border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-heading text-xl font-bold text-foreground">MegaGroup</div>
          <div className="text-sm text-foreground/60">{tagline}</div>
          <p className="mt-3 text-sm text-foreground/70">{desc}</p>
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <InstagramIcon size={20} />
          </a>
          <a
            href={ttUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="mt-3 ml-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 text-white transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <TikTokIcon size={20} />
          </a>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("countries")}</h3>
          <ul className="space-y-2">
            {countries.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${locale}/xaricde-tehsil/${c.slug}`}
                  className="text-sm text-foreground/70 transition-colors hover:text-brand-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("services")}</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>
              <Link href={`/${locale}/xaricde-tehsil/hesabla`} className="hover:text-brand-primary">
                {t("countries")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/xaricde-tehsil/muraciet`} className="hover:text-brand-primary">
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">
                {t("services")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-foreground">{t("contact")}</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>
              <a href={`tel:${phoneTel}`} className="inline-flex items-center gap-2 hover:text-brand-primary">
                <Phone size={16} /> {phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand-primary"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </li>
            <li>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand-primary"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </li>
            <li>
              <a
                href={ttUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-brand-primary"
              >
                <TikTokIcon size={16} /> TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-foreground/50">{t("rights")}</div>
    </footer>
  );
}
