import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { DeleteTestimonialButton } from "./DeleteTestimonialButton";

const PAGE_SIZE = 20;

function escapeIlike(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export default async function TestimonialsList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("testimonials")
    .select("*", { count: "exact" })
    .eq("is_deleted", false);
  if (q) {
    const e = escapeIlike(q);
    query = query.ilike("student_name", `%${e}%`);
  }
  const { data, count } = await query.order("sort_order").range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Testimoniallar</h1>
        <Link href="/admin/testimoniallar/yeni" className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          + Yeni Testimonial
        </Link>
      </div>

      <form className="mb-4 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Axtarış..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-primary focus:outline-none"
        />
        <button type="submit" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground/80 hover:bg-white/10">
          Axtar
        </button>
      </form>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Şəkil</th>
              <th className="px-5 py-3">Ad</th>
              <th className="px-5 py-3">Universitet</th>
              <th className="px-5 py-3">İl</th>
              <th className="px-5 py-3">Aktiv</th>
              <th className="px-5 py-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">
                  {t.photo_url ? (
                    <Image src={t.photo_url} alt={t.student_name} width={40} height={40} unoptimized className="h-8 w-8 rounded-full object-cover" />
                  ) : "—"}
                </td>
                <td className="px-5 py-3 font-medium text-foreground">{t.student_name}</td>
                <td className="px-5 py-3 text-foreground/70">{t.university_slug ?? "—"}</td>
                <td className="px-5 py-3 text-foreground/70">{t.year}</td>
                <td className="px-5 py-3">{t.is_active ? "✓" : "—"}</td>
                <td className="px-5 py-3 space-x-3">
                  <Link href={`/admin/testimoniallar/${t.id}`} className="text-sm text-brand-primary hover:underline">Redaktə</Link>
                  <DeleteTestimonialButton id={t.id} name={t.student_name} />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-foreground/50">Hələ testimonial yoxdur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/testimoniallar${qs(page - 1)}`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/80 hover:bg-white/10"
            >
              ← Əvvəlki
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 px-3 py-1.5 text-foreground/30">← Əvvəlki</span>
          )}
          <span className="px-3 text-foreground/60">
            {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/testimoniallar${qs(page + 1)}`}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/80 hover:bg-white/10"
            >
              Növbəti →
            </Link>
          ) : (
            <span className="rounded-lg border border-white/5 px-3 py-1.5 text-foreground/30">Növbəti →</span>
          )}
        </div>
      )}
    </div>
  );
}