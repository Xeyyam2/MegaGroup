import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getSiteContentMap } from "@/lib/data/site-content";
import type { Locale } from "@/i18n/routing";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, { title: string; desc: string }> = {
    az: {
      title: "MegaGroup — Xaricdə Təhsil Mərkəzi",
      desc: "Azərbaycanlı tələbələr üçün xaricdə təhsil — attestatla, imtahansız qəbul.",
    },
    ru: {
      title: "MegaGroup — Центр обучения за рубежом",
      desc: "Обучение за рубежом для азербайджанских студентов — аттестат, без экзаменов.",
    },
    en: {
      title: "MegaGroup — Study Abroad Center",
      desc: "Study abroad for Azerbaijani students — certificate-based, exam-free admission.",
    },
  };
  const t = titles[locale] ?? titles.az;
  return {
    title: { default: t.title, template: `%s | ${t.title}` },
    description: t.desc,
    openGraph: {
      title: t.title,
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  if (!routing.locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const content = await getSiteContentMap(locale);
  return (
    <div className={cn(inter.variable, jakarta.variable, "flex min-h-screen flex-col")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "MegaGroup — Xaricdə Təhsil Mərkəzi",
            url: siteUrl,
            description: "Azərbaycanlı tələbələr üçün xaricdə təhsil — attestatla, imtahansız qəbul.",
            sameAs: [
              "https://www.instagram.com/mega_xaricde_tehsil_merkezi/",
              "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi",
            ],
            areaServed: "AZ",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+994-51-999-93-70",
                contactType: "customer service",
                areaServed: "AZ",
                availableLanguage: ["az", "ru", "en"],
              },
            ],
          }),
        }}
      />
      {/* LocalBusiness schema — local pack və Google Maps üçün.
          NAP (Name, Address, Phone), geo və xidmət zonası. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "MegaGroup — Xaricdə Təhsil Mərkəzi",
            description: "Xaricdə təhsil üzrə konsaltinq və universitetə yerləşdirmə mərkəzi.",
            url: siteUrl,
            telephone: "+994-51-999-93-70",
            image: `${siteUrl}/icons/icon-512.png`,
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bakı",
              addressCountry: "AZ",
            },
            areaServed: { "@type": "Country", name: "Azərbaycan" },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 40.4093,
              longitude: 49.8671,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "10:00",
                closes: "19:00",
              },
            ],
            sameAs: [
              "https://www.instagram.com/mega_xaricde_tehsil_merkezi/",
              "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi",
            ],
          }),
        }}
      />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SmoothScrollProvider>
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer
            instagramUrl={content.contact_instagram}
            tiktokUrl={content.contact_tiktok}
            footerDesc={content.footer_description}
            whatsappUrl={content.contact_whatsapp}
            phone={content.contact_phone}
          />
          <WhatsAppFloat href={content.contact_whatsapp} />
          <ScrollToTop />
        </SmoothScrollProvider>
      </NextIntlClientProvider>
    </div>
  );
}
