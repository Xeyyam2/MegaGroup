import { ImageResponse } from "next/og";

export const alt = "MegaGroup — Xaricdə Təhsil Mərkəzi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { locale: string };
}

export default async function OgImage({ params }: Props) {
  const { locale } = params;
  const heading =
    locale === "ru"
      ? "Учеба за рубежом"
      : locale === "en"
        ? "Study Abroad"
        : "Xaricdə Təhsil";
  const sub =
    locale === "ru"
      ? "Поступление по аттестату — Турция, Россия, Грузия, Украина, Казахстан"
      : locale === "en"
        ? "Certificate-based admission — Turkey, Russia, Georgia, Ukraine, Kazakhstan"
        : "Attestatla, imtahansız qəbul — Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan";
  const stats =
    locale === "ru"
      ? ["200+ вузов", "1000+ студентов", "Бесплатная консультация"]
      : locale === "en"
        ? ["200+ universities", "1000+ students", "Free consultation"]
        : ["200+ Universitet", "1000+ Tələbə", "Pulsuz Konsultasiya"];

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
            "radial-gradient(circle at 80% 20%, rgba(220,38,38,0.25), transparent 50%), radial-gradient(circle at 10% 90%, rgba(37,99,235,0.18), transparent 50%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#dc2626",
              color: "white",
              fontSize: 38,
              fontWeight: 800,
              marginRight: 24,
            }}
          >
            MG
          </div>
          <div style={{ color: "#f1f5f9", fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>MegaGroup</div>
        </div>
        <div style={{ display: "flex", color: "white", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
          {heading}
        </div>
        <div style={{ display: "flex", color: "#cbd5e1", fontSize: 30, fontWeight: 500, marginTop: 20, maxWidth: 980 }}>
          {sub}
        </div>
        <div style={{ display: "flex", marginTop: 48, gap: 16 }}>
          {stats.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
