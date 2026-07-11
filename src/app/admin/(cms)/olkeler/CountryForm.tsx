"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import { FormField } from "@/components/admin/FormField";
import { createCountry, updateCountry } from "./actions";

const EMPTY = {
  slug: "",
  flag_emoji: "",
  hero_image_url: "",
  sort_order: 0,
  is_active: true,
  is_featured: false,
  name_az: "",
  name_ru: "",
  name_en: "",
  description_az: "",
  description_ru: "",
  description_en: "",
  qs_universities: 0,
  qs_avg_tuition_usd: 0,
  qs_language: "",
  qs_visa_difficulty: "medium" as const,
};

type Props = { mode: "create" } | { mode: "edit"; id: string; initial: Record<string, string | number | boolean> };

export function CountryForm(props: Props) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, string | number | boolean>>({
    ...EMPTY,
    ...(props.mode === "edit" ? props.initial : {}),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string | number | boolean) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.target as HTMLFormElement);
    const res =
      props.mode === "create" ? await createCountry(fd) : await updateCountry(props.id, fd);
    if ("error" in res && res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/admin/olkeler");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">
          {props.mode === "create" ? "Yeni Ölkə" : "Ölkə Redaktə"}
        </h1>
        <Link href="/admin/olkeler" className="text-sm text-foreground/60 hover:text-brand-primary">
          ← Geri
        </Link>
      </div>

      <FormField label="Slug" name="slug" value={data.slug} onChange={(v) => set("slug", v)} required placeholder="turkiye" />
      <FormField label="Hero şəkil URL" name="hero_image_url" value={data.hero_image_url} onChange={(v) => set("hero_image_url", v)} />
      <FormField label="Sıra" name="sort_order" type="number" value={data.sort_order} onChange={(v) => set("sort_order", v)} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" name="is_active" checked={Boolean(data.is_active)} onChange={(e) => set("is_active", e.target.checked)} />
          Aktiv
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" name="is_featured" checked={Boolean(data.is_featured)} onChange={(e) => set("is_featured", e.target.checked)} />
          Xüsusi (featured)
        </label>
      </div>

      <LanguageTabs>
        {(lang) => (
          <div className="space-y-4">
            <FormField
              label="Ad"
              name={`name_${lang}`}
              value={data[`name_${lang}`]}
              onChange={(v) => set(`name_${lang}`, v)}
              required={lang === "az"}
            />
            <FormField
              label="Təsvir"
              name={`description_${lang}`}
              type="textarea"
              value={data[`description_${lang}`]}
              onChange={(v) => set(`description_${lang}`, v)}
            />
          </div>
        )}
      </LanguageTabs>

      <fieldset className="space-y-4 rounded-xl border border-white/10 p-4">
        <legend className="px-2 text-sm font-semibold text-foreground/80">Quick Stats</legend>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Universitet sayı" name="qs_universities" type="number" value={data.qs_universities} onChange={(v) => set("qs_universities", v)} />
          <FormField label="Orta təhsil haqqı (USD)" name="qs_avg_tuition_usd" type="number" value={data.qs_avg_tuition_usd} onChange={(v) => set("qs_avg_tuition_usd", v)} />
          <FormField label="Dil" name="qs_language" value={data.qs_language} onChange={(v) => set("qs_language", v)} />
          <div>
            <label htmlFor="qs_visa_difficulty" className="text-sm text-foreground/70">Viza çətinliyi</label>
            <select
              id="qs_visa_difficulty"
              name="qs_visa_difficulty"
              value={String(data.qs_visa_difficulty)}
              onChange={(e) => set("qs_visa_difficulty", e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
            >
              <option value="easy">Asan</option>
              <option value="medium">Orta</option>
              <option value="hard">Çətin</option>
            </select>
          </div>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Saxlanılır..." : "Saxla"}
      </button>
    </form>
  );
}