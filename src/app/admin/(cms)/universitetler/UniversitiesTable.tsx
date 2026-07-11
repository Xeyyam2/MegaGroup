"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DeleteUniversityButton } from "./DeleteUniversityButton";

export type Uni = {
  id: string;
  slug: string;
  country_slug: string;
  name_az: string;
  city_az?: string | null;
  logo_url?: string | null;
  is_active: boolean;
};

export function UniversitiesTable({ universities }: { universities: Uni[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return universities;
    return universities.filter((u) =>
      [u.name_az, u.slug, u.country_slug, u.city_az ?? ""].some((f) => f.toLowerCase().includes(term)),
    );
  }, [q, universities]);

  return (
    <>
      <div className="mb-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Axtar: ad, slug, ölkə, şəhər..."
          className="w-full max-w-sm rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm focus:border-brand-primary focus:outline-none"
        />
        <span className="ml-3 text-xs text-foreground/50">{filtered.length} nəticə</span>
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
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  {u.logo_url ? (
                    <Image src={u.logo_url} alt={u.name_az} width={40} height={40} unoptimized className="h-8 w-8 rounded object-cover" />
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-foreground/50">
                  {universities.length === 0 ? "Hələ universitet yoxdur." : "Axtarışa uyğun nəticə yoxdur."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
