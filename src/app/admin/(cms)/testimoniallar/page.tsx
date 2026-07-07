import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteTestimonialButton } from "./DeleteTestimonialButton";

export default async function TestimonialsList() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Testimoniallar</h1>
        <Link href="/admin/testimoniallar/yeni" className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          + Yeni Testimonial
        </Link>
      </div>

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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.photo_url} alt={t.student_name} className="h-8 w-8 rounded-full object-cover" />
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
    </div>
  );
}