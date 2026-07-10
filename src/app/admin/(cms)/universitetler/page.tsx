import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UniversitiesTable } from "./UniversitiesTable";

const PAGE_SIZE = 20;

export default async function UniversitiesList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("universities")
    .select("*", { count: "exact" })
    .eq("is_deleted", false)
    .order("name_az")
    .range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const qs = (p: number) => (p > 1 ? `?page=${p}` : "");

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

      <UniversitiesTable universities={(data ?? []) as any} />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/universitetler${qs(page - 1)}`}
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
              href={`/admin/universitetler${qs(page + 1)}`}
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
