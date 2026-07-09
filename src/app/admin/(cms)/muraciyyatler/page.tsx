import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteApplicationButton } from "./DeleteApplicationButton";

const PAGE_SIZE = 20;

const STATUS_LABELS: Record<string, string> = {
  yeni: "Yeni",
  goruldu: "Görüldü",
  qebul_edildi: "Qəbul edildi",
  imtina: "İmtina",
};

const STATUS_COLORS: Record<string, string> = {
  yeni: "bg-amber-400/20 text-amber-300",
  goruldu: "bg-blue-400/20 text-blue-300",
  qebul_edildi: "bg-green-400/20 text-green-300",
  imtina: "bg-red-400/20 text-red-300",
};

const STATUSES = Object.keys(STATUS_LABELS);

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

export default async function ApplicationsList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = sp.status && STATUSES.includes(sp.status) ? sp.status : null;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("applications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, count } = await query.range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const list = data ?? [];

  const qs = (p: number, s: string | null) =>
    s ? `?page=${p}&status=${s}` : p > 1 ? `?page=${p}` : "";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Müraciətlər</h1>
        <span className="text-sm text-foreground/60">{total} müraciət</span>
      </div>

      {/* Status filtri */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={`/admin/muraciyyatler`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !status ? "bg-brand-primary text-white" : "bg-white/5 text-foreground/70 hover:bg-white/10"
          }`}
        >
          Hamısı
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/muraciyyatler?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              status === s ? "bg-brand-primary text-white" : "bg-white/5 text-foreground/70 hover:bg-white/10"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Ad</th>
              <th className="px-5 py-3">Telefon</th>
              <th className="px-5 py-3">Ölkə</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Tarix</th>
              <th className="px-5 py-3">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{a.full_name}</td>
                <td className="px-5 py-3 text-foreground/80">{a.phone}</td>
                <td className="px-5 py-3 text-foreground/80">{a.country_interest || "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_COLORS[a.status] ?? "bg-white/10 text-foreground/70"
                    }`}
                  >
                    {STATUS_LABELS[a.status] ?? a.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground/60">{formatDate(a.created_at)}</td>
                <td className="px-5 py-3 space-x-3">
                  <Link href={`/admin/muraciyyatler/${a.id}`} className="text-sm text-brand-primary hover:underline">
                    Aç
                  </Link>
                  <DeleteApplicationButton id={a.id} name={a.full_name} />
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-foreground/50">
                  Bu filtrdə müraciət yoxdur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <Link
              href={`/admin/muraciyyatler${qs(page - 1, status)}`}
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
              href={`/admin/muraciyyatler${qs(page + 1, status)}`}
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
