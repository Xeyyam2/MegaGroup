import { ImageResponse } from "next/og";
import { getCountryBySlug } from "@/lib/data/countries";
import { getCountrySeo } from "@/lib/seo";
import { countries as staticCountries } from "@/data/countries";
import type { Locale } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { locale: string; country: string };
}

export function generateStaticParams() {
  return staticCountries.map((c) => ({ country: c.slug }));
}

export const alt = "Ölkə səhifəsi — MegaGroup Xaricdə Təhsil";

export default async function CountryOgImage({ params }: Props) {
  const { locale: rawLocale, country } = params;
  const locale = rawLocale as Locale;
  const c = await getCountryBySlug(country, locale);
  const seo = locale === "az" ? getCountrySeo(country) : undefined;
  const heading = seo?.h1 ?? c?.name ?? "Xaricdə Təhsil";
  const flag = c?.flag_emoji ?? "🎓";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0b1326",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(220,38,38,0.30), transparent 55%), radial-gradient(circle at 5% 95%, rgba(37,99,235,0.20), transparent 55%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#dc2626",
              color: "white",
              fontSize: 34,
              fontWeight: 800,
              marginRight: 20,
            }}
          >
            MG
          </div>
          <div style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>MegaGroup</div>
        </div>
        <div style={{ display: "flex", fontSize: 90, marginBottom: 12 }}>{flag}</div>
        <div style={{ display: "flex", color: "white", fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          {heading}
        </div>
        <div style={{ display: "flex", color: "#cbd5e1", fontSize: 30, fontWeight: 500, marginTop: 20, maxWidth: 980 }}>
          Attestatla, imtahansız qəbul · Pulsuz konsultasiya
        </div>
        <div style={{ display: "flex", marginTop: 44, alignItems: "center", padding: "16px 32px", borderRadius: 14, backgroundColor: "#dc2626", color: "white", fontSize: 26, fontWeight: 700 }}>
          megatehsil.com
        </div>
      </div>
    ),
    { ...size },
  );
}
