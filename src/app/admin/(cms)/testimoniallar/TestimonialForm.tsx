"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import { FormField } from "@/components/admin/FormField";
import { createTestimonial, updateTestimonial } from "./actions";

type Props = { mode: "create" } | { mode: "edit"; id: string; initial: Record<string, string | number | boolean> };

export function TestimonialForm(props: Props) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, string | number | boolean>>({
    student_name: "", university_slug: "", country_slug: "", photo_url: "",
    quote_az: "", quote_ru: "", quote_en: "",
    year: new Date().getFullYear(), is_active: true, sort_order: 0,
    ...(props.mode === "edit" ? props.initial : {}),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string | number | boolean) { setData((d) => ({ ...d, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.target as HTMLFormElement);
    const res = props.mode === "create" ? await createTestimonial(fd) : await updateTestimonial(props.id, fd);
    if ("error" in res && res.error) { setError(res.error); setLoading(false); }
    else { router.push("/admin/testimoniallar"); router.refresh(); }
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">{props.mode === "create" ? "Yeni Testimonial" : "Testimonial Redaktə"}</h1>
        <Link href="/admin/testimoniallar" className="text-sm text-foreground/60 hover:text-brand-primary">← Geri</Link>
      </div>

      <FormField label="Tələbə adı" name="student_name" value={data.student_name} onChange={(v) => set("student_name", v)} required />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Universitet slug" name="university_slug" value={data.university_slug} onChange={(v) => set("university_slug", v)} />
        <FormField label="Ölkə slug" name="country_slug" value={data.country_slug} onChange={(v) => set("country_slug", v)} />
      </div>
      <FormField label="Şəkil URL" name="photo_url" value={data.photo_url} onChange={(v) => set("photo_url", v)} />

      <LanguageTabs>
        {(lang) => (
          <FormField label="Sitat" name={`quote_${lang}`} type="textarea" value={data[`quote_${lang}`]} onChange={(v) => set(`quote_${lang}`, v)} required={lang === "az"} />
        )}
      </LanguageTabs>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="İl" name="year" type="number" value={data.year} onChange={(v) => set("year", v)} />
        <FormField label="Sıra" name="sort_order" type="number" value={data.sort_order} onChange={(v) => set("sort_order", v)} />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground/70">
        <input type="checkbox" name="is_active" checked={Boolean(data.is_active)} onChange={(e) => set("is_active", e.target.checked)} /> Aktiv
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
        {loading ? "Saxlanılır..." : "Saxla"}
      </button>
    </form>
  );
}