"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LanguageTabs } from "@/components/admin/LanguageTabs";
import { FormField } from "@/components/admin/FormField";
import { createFaq, updateFaq } from "./actions";

type Props = { mode: "create" } | { mode: "edit"; id: string; initial: Record<string, string | number | boolean> };

export function FaqForm(props: Props) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, string | number | boolean>>({
    country_slug: "", university_slug: "",
    question_az: "", question_ru: "", question_en: "",
    answer_az: "", answer_ru: "", answer_en: "",
    sort_order: 0,
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
    const res = props.mode === "create" ? await createFaq(fd) : await updateFaq(props.id, fd);
    if ("error" in res && res.error) { setError(res.error); setLoading(false); }
    else { router.push("/admin/faq"); router.refresh(); }
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold">{props.mode === "create" ? "Yeni FAQ" : "FAQ Redaktə"}</h1>
        <Link href="/admin/faq" className="text-sm text-foreground/60 hover:text-brand-primary">← Geri</Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ölkə slug (opsional)" name="country_slug" value={data.country_slug} onChange={(v) => set("country_slug", v)} placeholder="turkiye" />
        <FormField label="Universitet slug (opsional)" name="university_slug" value={data.university_slug} onChange={(v) => set("university_slug", v)} />
      </div>

      <LanguageTabs>
        {(lang) => (
          <div className="space-y-4">
            <FormField label="Sual" name={`question_${lang}`} value={data[`question_${lang}`]} onChange={(v) => set(`question_${lang}`, v)} required={lang === "az"} />
            <FormField label="Cavab" name={`answer_${lang}`} type="textarea" value={data[`answer_${lang}`]} onChange={(v) => set(`answer_${lang}`, v)} required={lang === "az"} />
          </div>
        )}
      </LanguageTabs>

      <FormField label="Sıra" name="sort_order" type="number" value={data.sort_order} onChange={(v) => set("sort_order", v)} />

      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-lg bg-brand-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
        {loading ? "Saxlanılır..." : "Saxla"}
      </button>
    </form>
  );
}