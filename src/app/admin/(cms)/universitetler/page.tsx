import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteUniversityButton } from "./DeleteUniversityButton";

export default async function UniversitiesList() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("*").order("name_az");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Universitetlər</h1>
        <Link
          href="/admin/universitetler/yeni"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          + Yeni Universitet
        </Link>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Logo</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Ölkə</th>
              <th className="px-5 py-3">Ad (AZ)</th>
              <th className="px-5 py-3">Aktiv</th>
              <th className="px-5 py-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  {u.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.logo_url} alt={u.name_az} className="h-8 w-8 rounded object-cover" />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-5 py-3 font-mono text-foreground/70">{u.slug}</td>
                <td className="px-5 py-3 text-foreground/70">{u.country_slug}</td>
                <td className="px-5 py-3 font-medium text-foreground">{u.name_az}</td>
                <td className="px-5 py-3">{u.is_active ? "✓" : "—"}</td>
                <td className="px-5 py-3 space-x-3">
                  <Link href={`/admin/universitetler/${u.id}`} className="text-sm text-brand-primary hover:underline">
                    Redaktə
                  </Link>
                  <DeleteUniversityButton id={u.id} name={u.name_az} />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-foreground/50">
                  Hələ universitet yoxdur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}