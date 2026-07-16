import { ARTICLES } from "@/data/articles";
import { countryComparison, comparisonHeaders } from "@/data/country-comparison";
import { studyAbroadProcess } from "@/data/study-process";
import { siteUrl } from "@/lib/site";
import { editorialAuthor } from "@/data/site-authors";

/**
 * /llms-full.txt — MegaGroup saytının BÜTÜN məzmununun düz mətn versiyası.
 *
 * Bu route məzmunu TypeScript məlumat fayllarından (articles, country-comparison,
 * study-process) avtomatik generasiya edir — əl ilə saxlanılan statik fayl
 * deyil. Məqalə/redaksiya dəyişdikdə build sonrası yenilənir.
 *
 * Məqsəd: RAG əsaslı AI sistemləri (Perplexity, Google AIO, Copilot) və
 * geniş-kontekstli modellər üçün tam, sitatlanası mətn təqdim etmək.
 * `llms.txt` qısa xülasədir; `llms-full.txt` isə bütöv mənbədir.
 */

export const dynamic = "force-static";
export const revalidate = false;

function articleToText(article: (typeof ARTICLES)[number]): string {
  const url = `${siteUrl}/az/bloq/${article.slug}`;
  const lines: string[] = [];
  lines.push(`# ${article.title}`);
  lines.push(`URL: ${url}`);
  lines.push(`Tarix (yenilənib): ${article.updatedAt} | Oxu müddəti: ~${article.readingMinutes} dəq`);
  lines.push(`Açar sözlər: ${article.keywords.join(", ")}`);
  lines.push("");
  lines.push("## Xülasə");
  lines.push(article.metaDescription);
  lines.push("");

  if (article.intro.length) {
    lines.push("## Giriş");
    for (const p of article.intro) lines.push(p);
    lines.push("");
  }

  for (const section of article.sections) {
    lines.push(`## ${section.heading}`);
    for (const p of section.paragraphs) lines.push(p);
    if (section.list) {
      lines.push("");
      for (const item of section.list) lines.push(`- ${item}`);
    }
    if (section.table) {
      lines.push("");
      lines.push(`| ${section.table.headers.join(" | ")} |`);
      lines.push(`| ${section.table.headers.map(() => "---").join(" | ")} |`);
      for (const row of section.table.rows) {
        lines.push(`| ${row.join(" | ")} |`);
      }
    }
    lines.push("");
  }

  if (article.faqs.length) {
    lines.push("## Tez-tez verilən suallar");
    for (const f of article.faqs) {
      lines.push(`S: ${f.question}`);
      lines.push(`C: ${f.answer}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

function countryComparisonToText(): string {
  const lines: string[] = [];
  lines.push("# 7 Ölkə Müqayisəsi (machine-readable)");
  lines.push(`Mənbə: ${siteUrl}/az/bloq/hansi-olkede-oxumaq-serfelidir`);
  lines.push("");
  const header = comparisonHeaders.join(" | ");
  lines.push(`| ${header} |`);
  lines.push(`| ${comparisonHeaders.map(() => "---").join(" | ")} |`);
  for (const row of countryComparison) {
    lines.push(
      `| ${row.country} | ${row.tuition} | ${row.living} | ${row.language} | ${row.admission} | ${row.visa} | ${row.recognition} | ${row.distance} |`,
    );
  }
  return lines.join("\n");
}

function processToText(): string {
  const lines: string[] = [];
  lines.push("# Xaricdə Təhsil Prosesi — 9 Addım");
  lines.push(`Mənbə: ${siteUrl}/az/xaricde-tehsil`);
  lines.push("");
  for (const s of studyAbroadProcess) {
    lines.push(`${s.step}. ${s.name} — ${s.text}`);
  }
  return lines.join("\n");
}

export async function GET() {
  const a = editorialAuthor;

  const header = [
    "# MegaGroup — Xaricdə Təhsil Mərkəzi (llms-full.txt)",
    "# Tam mətn versiyası — bütün məqalələr və strukturlaşdırılmış məlumat.",
    `# Sayt: ${siteUrl}`,
    `# Qısa xülasə: ${siteUrl}/llms.txt`,
    `# Yaradılma tarixi (build): ${new Date().toISOString()}`,
    "",
    `Redaksiya müəllifi: ${a.name} (${a.jobTitle}) — @id: ${a["@id"]}`,
    `Bio: ${a.bio.az}`,
    `Ekspertiza: ${a.knowsAbout.join("; ")}`,
    "",
    "Bu fayl `llms.txt`-i əvəz etmir, tamamlayır. AI/RAG sistemləri üçün tam,",
    "sitatlanası mətn təqdim edir. Mənbə: MegaGroup (megatehsil.com).",
    "",
    "================================================================================",
    "# BÖLMƏ 1 — STUDY-ABROAD PROSESİ (9 ADDIM)",
    "================================================================================",
    "",
    processToText(),
    "",
    "================================================================================",
    "# BÖLMƏ 2 — 7 ÖLKƏ MÜQAYİSƏSİ",
    "================================================================================",
    "",
    countryComparisonToText(),
    "",
    "================================================================================",
    "# BÖLMƏ 3 — BÜTÜN BLOQ MƏQALƏLƏRİ (tam mətn)",
    "================================================================================",
    "",
  ];

  const bodies = ARTICLES.map((article) =>
    [articleToText(article), "", "---", ""].join("\n"),
  );

  const footer = [
    "================================================================================",
    "# SƏHİFƏLƏR",
    "================================================================================",
    "",
    `- Ana səhifə: ${siteUrl}/az (həmçinin /ru, /en)`,
    `- Xaricdə təhsil hub: ${siteUrl}/az/xaricde-tehsil`,
    `- Ölkə bələdçiləri: ${siteUrl}/az/xaricde-tehsil/{turkiye|rusiya|gurcustan|ukrayna|qazaxistan|almaniya|polsa}`,
    `- Xərc kalkulyatoru: ${siteUrl}/az/xaricde-tehsil/hesabla`,
    `- Pulsuz müraciət formu: ${siteUrl}/az/xaricde-tehsil/muraciet`,
    `- Bloq: ${siteUrl}/az/bloq`,
    `- Haqqımızda: ${siteUrl}/az/haqqimizda`,
    "",
    "Əlaqə: +994 51 999 93 70 (WhatsApp) | Bakı, Azərbaycan",
    "",
    "Qeyd: Bütün rəqəmlər orta göstəricilərdir və universitet/şəhər/ixtisasdan",
    "asılı olaraq dəyişir. Dəqiq qiymətləndirmə üçün pulsuz konsultasiya təklif olunur.",
  ].join("\n");

  const text = [...header, ...bodies, footer].join("\n");

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
