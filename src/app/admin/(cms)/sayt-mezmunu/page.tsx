import { createClient } from "@/lib/supabase/server";
import { SiteContentRow } from "./SiteContentRow";

const CATEGORIES: { title: string; keys: string[] }[] = [
  {
    title: "Hero bölməsi",
    keys: ["hero_title", "hero_subtitle", "hero_stat_universities", "hero_stat_exams", "hero_stat_countries", "hero_stat_students"],
  },
  {
    title: "Ana səhifə bölmə başlıqları",
    keys: [
      "section_countries_title",
      "section_countries_subtitle",
      "section_calc_title",
      "section_calc_subtitle",
      "section_stories_title",
      "section_stories_subtitle",
      "section_faq_title",
    ],
  },
  {
    title: "CTA düymələri",
    keys: ["cta_choose_country", "cta_apply", "cta_free_consult"],
  },
  {
    title: "Əlaqə məlumatları",
    keys: ["contact_whatsapp", "contact_phone", "contact_email", "contact_address", "contact_instagram", "contact_tiktok"],
  },
  {
    title: "Footer",
    keys: ["footer_description"],
  },
];

const ALL_KEYS = CATEGORIES.flatMap((c) => c.keys);

export default async function SiteContentPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("*");
  const map = new Map((data ?? []).map((r) => [r.key, r]));

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Sayt Məzmunu</h1>

      {CATEGORIES.map((cat) => (
        <div key={cat.title} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">{cat.title}</h2>
          <div className="space-y-4">
            {cat.keys.map((k) => {
              const item = map.get(k) ?? { key: k, value_az: "", value_ru: "", value_en: "" };
              return <SiteContentRow key={k} item={item} />;
            })}
          </div>
        </div>
      ))}

      {/* DB-də olan amma kateqoriyalarda olmayan açarlar */}
      {(() => {
        const extra = (data ?? []).filter((r) => !ALL_KEYS.includes(r.key));
        if (extra.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">Digər</h2>
            <div className="space-y-4">
              {extra.map((r) => (
                <SiteContentRow key={r.key} item={r} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}