"use client";
import { useState } from "react";
import { FormField } from "@/components/admin/FormField";
import { saveSiteContent } from "./actions";

export function SiteContentRow({ item }: { item: { key: string; value_az: string; value_ru: string; value_en: string } }) {
  const [az, setAz] = useState(item.value_az);
  const [ru, setRu] = useState(item.value_ru ?? "");
  const [en, setEn] = useState(item.value_en ?? "");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("key", item.key);
    fd.set("value_az", az);
    fd.set("value_ru", ru);
    fd.set("value_en", en);
    const res = await saveSiteContent(item.key, fd);
    setLoading(false);
    setMsg("error" in res && res.error ? res.error : "✓ Saxlanıldı");
  }

  return (
    <div className="glass rounded-xl p-4">
      <div className="mb-3 font-mono text-xs text-foreground/60">{item.key}</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FormField label="AZ" name={`value_az_${item.key}`} value={az} onChange={setAz} required />
        <FormField label="RU" name={`value_ru_${item.key}`} value={ru} onChange={setRu} />
        <FormField label="EN" name={`value_en_${item.key}`} value={en} onChange={setEn} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={save} disabled={loading} className="rounded-lg bg-brand-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
          {loading ? "..." : "Saxla"}
        </button>
        {msg && <span className="text-xs text-foreground/60">{msg}</span>}
      </div>
    </div>
  );
}