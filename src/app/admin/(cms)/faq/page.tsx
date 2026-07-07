import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteFaqButton } from "./DeleteFaqButton";

export default async function FaqList() {
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">FAQ</h1>
        <Link href="/admin/faq/yeni" className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
          + Yeni FAQ
        </Link>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Sual (AZ)</th>
              <th className="px-5 py-3">Ölkə/Universitet</th>
              <th className="px-5 py-3">Sıra</th>
              <th className="px-5 py-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((f) => (
              <tr key={f.id} className="border-b border-white/5 last:border-0">
                <td className="max-w-md px-5 py-3 font-medium text-foreground">{f.question_az}</td>
                <td className="px-5 py-3 text-foreground/70">{f.country_slug ?? f.university_slug ?? "—"}</td>
                <td className="px-5 py-3 text-foreground/70">{f.sort_order}</td>
                <td className="px-5 py-3 space-x-3">
                  <Link href={`/admin/faq/${f.id}`} className="text-sm text-brand-primary hover:underline">Redaktə</Link>
                  <DeleteFaqButton id={f.id} name={f.question_az} />
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-foreground/50">Hələ FAQ yoxdur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}