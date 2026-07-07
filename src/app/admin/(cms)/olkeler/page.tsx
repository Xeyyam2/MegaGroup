import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteCountryButton } from "./DeleteCountryButton";

export default async function CountriesList() {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("*").order("sort_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Ölkələr</h1>
        <Link
          href="/admin/olkeler/yeni"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          + Yeni Ölkə
        </Link>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Ad (AZ)</th>
              <th className="px-5 py-3">Aktiv</th>
              <th className="px-5 py-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((c) => (
              <tr key={c.id} className={`border-b border-white/5 last:border-0 ${!c.is_active ? "bg-amber-400/5" : ""}`}>
                <td className="px-5 py-3 font-mono text-foreground/70">{c.slug}</td>
                <td className="px-5 py-3 font-medium text-foreground">{c.name_az}</td>
                <td className="px-5 py-3">
                  {c.is_active ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      ● Aktiv
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-400">
                      ● Deaktiv — saytda görünmür
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 space-x-3">
                  <Link href={`/admin/olkeler/${c.id}`} className="text-sm text-brand-primary hover:underline">
                    Redaktə
                  </Link>
                  <DeleteCountryButton id={c.id} name={c.name_az} />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-foreground/50">
                  Hələ ölkə yoxdur. &ldquo;Yeni Ölkə&rdquo; düyməsini sıxın (və ya <code>npm run seed</code>).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}