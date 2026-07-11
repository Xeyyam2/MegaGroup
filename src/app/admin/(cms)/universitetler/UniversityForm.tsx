"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import { FormField } from "@/components/admin/FormField";
import { Plus, Trash2 } from "lucide-react";
import { createUniversity, updateUniversity, saveFaculties, saveFees } from "./actions";

interface FacultyForm {
  name_az: string;
  name_ru: string;
  name_en: string;
  is_competitive: boolean;
  duration_years: number;
  language: string;
}

const EMPTY = {
  slug: "",
  country_slug: "",
  website_url: "",
  logo_url: "",
  hero_image_url: "",
  is_active: true,
  is_featured: false,
  name_az: "", name_ru: "", name_en: "",
  city_az: "", city_ru: "", city_en: "",
  highlights_az: "", highlights_ru: "", highlights_en: "",
  notes_az: "", notes_ru: "", notes_en: "",
  campus_info_az: "", campus_info_ru: "", campus_info_en: "",
};

const FEE_KEYS = [
  "tuition_min_usd", "tuition_max_usd",
  "dorm_min_usd", "dorm_max_usd",
  "food_min_usd", "food_max_usd",
  "transport_min_usd", "transport_max_usd",
  "personal_min_usd", "personal_max_usd",
] as const;

const EMPTY_FEES: Record<string, number> = Object.fromEntries(FEE_KEYS.map((k) => [k, 0]));

type Props =
  | { mode: "create"; countries: { slug: string; name_az: string }[] }
  | {
      mode: "edit";
      id: string;
      slug: string;
      countries: { slug: string; name_az: string }[];
      initial: Record<string, string | number | boolean | string[]>;
      faculties: FacultyForm[];
      fees: Record<string, number>;
    };

export function UniversityForm(props: Props) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, string | number | boolean>>({
    ...EMPTY,
    ...(props.mode === "edit"
      ? {
          ...props.initial,
          highlights_az: Array.isArray(props.initial.highlights_az) ? props.initial.highlights_az.join("\n") : "",
          highlights_ru: Array.isArray(props.initial.highlights_ru) ? props.initial.highlights_ru.join("\n") : "",
          highlights_en: Array.isArray(props.initial.highlights_en) ? props.initial.highlights_en.join("\n") : "",
        }
      : {}),
  });
  const [faculties, setFaculties] = useState<FacultyForm[]>(
    props.mode === "edit"
      ? props.faculties.map((f) => ({ name_az: f.name_az, name_ru: f.name_ru ?? "", name_en: f.name_en ?? "", is_competitive: f.is_competitive ?? false, duration_years: f.duration_years ?? 4, language: f.language ?? "" }))
      : [],
  );
  const [fees, setFees] = useState<Record<string, number>>(props.mode === "edit" ? props.fees : EMPTY_FEES);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string | number | boolean) {
    setData((d) => ({ ...d, [k]: v }));
  }

  function addFaculty() {
    setFaculties((f) => [...f, { name_az: "", name_ru: "", name_en: "", is_competitive: false, duration_years: 4, language: "" }]);
  }
  function updateFaculty(i: number, k: string, v: string | number | boolean) {
    setFaculties((f) => f.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)));
  }
  function removeFaculty(i: number) {
    setFaculties((f) => f.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.target as HTMLFormElement);
    const res = props.mode === "create" ? await createUniversity(fd) : await updateUniversity(props.id, fd);
    if ("error" in res && res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    const slug = props.mode === "create" ? (fd.get("slug") as string) : props.slug;
    const fRes = await saveFaculties(slug, faculties);
    if ("error" in fRes && fRes.error) { setError("Fakültələr: " + fRes.error); setLoading(false); return; }
    const feeRes = await saveFees(slug, fees);
    if ("error" in feeRes && feeRes.error) { setError("Xərclər: " + feeRes.error); setLoading(false); return; }
    router.push("/admin/universitetler");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-3xl space-y-5 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">{props.mode === "create" ? "Yeni Universitet" : "Universitet Redaktə"}</h1>
        <Link href="/admin/universitetler" className="text-sm text-foreground/60 hover:text-brand-primary">← Geri</Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Slug" name="slug" value={data.slug} onChange={(v) => set("slug", v)} required placeholder="giresun-universiteti" />
        <div>
          <label htmlFor="country_slug" className="text-sm text-foreground/70">Ölkə *</label>
          <select
            id="country_slug"
            name="country_slug"
            value={String(data.country_slug)}
            onChange={(e) => set("country_slug", e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
          >
            <option value="">Seçin...</option>
            {props.countries.map((c) => (
              <option key={c.slug} value={c.slug} className="bg-slate-900">{c.name_az}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Veb sayt" name="website_url" value={data.website_url} onChange={(v) => set("website_url", v)} />
        <FormField label="Logo URL" name="logo_url" value={data.logo_url} onChange={(v) => set("logo_url", v)} />
      </div>
      <FormField label="Hero şəkil URL" name="hero_image_url" value={data.hero_image_url} onChange={(v) => set("hero_image_url", v)} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" name="is_active" checked={Boolean(data.is_active)} onChange={(e) => set("is_active", e.target.checked)} /> Aktiv
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground/70">
          <input type="checkbox" name="is_featured" checked={Boolean(data.is_featured)} onChange={(e) => set("is_featured", e.target.checked)} /> Xüsusi (featured)
        </label>
      </div>

      <LanguageTabs>
        {(lang) => (
          <div className="space-y-4">
            <FormField label="Ad" name={`name_${lang}`} value={data[`name_${lang}`]} onChange={(v) => set(`name_${lang}`, v)} required={lang === "az"} />
            <FormField label="Şəhər" name={`city_${lang}`} value={data[`city_${lang}`]} onChange={(v) => set(`city_${lang}`, v)} required={lang === "az"} />
            <FormField label="Üstünlüklər (hər sətir bir madde)" name={`highlights_${lang}`} type="textarea" value={data[`highlights_${lang}`]} onChange={(v) => set(`highlights_${lang}`, v)} />
            <FormField label="Qeydlər" name={`notes_${lang}`} type="textarea" value={data[`notes_${lang}`]} onChange={(v) => set(`notes_${lang}`, v)} />
            <FormField label="Kampus məlumatı" name={`campus_info_${lang}`} type="textarea" value={data[`campus_info_${lang}`]} onChange={(v) => set(`campus_info_${lang}`, v)} />
          </div>
        )}
      </LanguageTabs>

      <fieldset className="space-y-3 rounded-xl border border-white/10 p-4">
        <legend className="px-2 text-sm font-semibold text-foreground/80">Fakültələr</legend>
        {faculties.map((f, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-white/10 p-3 sm:grid-cols-4">
            <input placeholder="Ad (AZ)" value={f.name_az} onChange={(e) => updateFaculty(i, "name_az", e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none" />
            <input placeholder="Dil" value={f.language} onChange={(e) => updateFaculty(i, "language", e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none" />
            <input type="number" placeholder="İl" value={f.duration_years} onChange={(e) => updateFaculty(i, "duration_years", Number(e.target.value))} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none" />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 text-xs text-foreground/70">
                <input type="checkbox" checked={f.is_competitive} onChange={(e) => updateFaculty(i, "is_competitive", e.target.checked)} /> Rəqabətli
              </label>
              <button type="button" onClick={() => removeFaculty(i)} className="text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </div>
            <input placeholder="Ad (RU)" value={f.name_ru} onChange={(e) => updateFaculty(i, "name_ru", e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none sm:col-span-2" />
            <input placeholder="Ad (EN)" value={f.name_en} onChange={(e) => updateFaculty(i, "name_en", e.target.value)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none sm:col-span-2" />
          </div>
        ))}
        <button type="button" onClick={addFaculty} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-1.5 text-sm text-foreground/70 hover:bg-white/10">
          <Plus size={16} /> Fakültə əlavə et
        </button>
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-white/10 p-4">
        <legend className="px-2 text-sm font-semibold text-foreground/80">Xərclər (USD)</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {FEE_KEYS.map((k) => (
            <label key={k} className="text-xs text-foreground/70">
              {k}
              <input
                type="number"
                value={fees[k]}
                onChange={(e) => setFees((prev) => ({ ...prev, [k]: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
              />
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
        {loading ? "Saxlanılır..." : "Saxla"}
      </button>
    </form>
  );
}