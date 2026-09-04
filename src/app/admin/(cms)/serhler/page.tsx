import { createClient } from "@/lib/supabase/server";
import { AnswerForm, DeleteCommentButton, PublishButton } from "./CommentButtons";

const PAGE_SIZE = 20;

export default async function CommentsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const filter = sp.filter === "published" ? "published" : sp.filter === "pending" ? "pending" : "all";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("is_deleted", false);
  if (filter === "published") query = query.eq("is_published", true);
  if (filter === "pending") query = query.eq("is_published", false);
  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (p: number, f: string) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (f !== "all") params.set("filter", f);
    const s = params.toString();
    return s ? `?${s}` : "";
  };
  const tab = (f: string, label: string) => (
    <a
      href={`/admin/serhler${qs(1, f)}`}
      className={`rounded-full px-4 py-1.5 text-sm ${filter === f ? "bg-brand-primary text-white" : "text-foreground/70 hover:bg-white/10"}`}
    >
      {label}
    </a>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Şərhlər / Suallar</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Bloq məqalələri altındakı UGC suallar — dərc, cavabla, sil. (seo.md 5.5)
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        {tab("all", "Hamısı")}
        {tab("pending", "Gözləyən")}
        {tab("published", "Dərc olunmuş")}
      </div>

      <div className="space-y-4">
        {(data ?? []).map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{c.author_name}</span>
                <span className="text-foreground/40">·</span>
                <span className="text-foreground/60">{c.article_slug}</span>
                <span className="text-foreground/40">·</span>
                <span className="text-foreground/60">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <PublishButton id={c.id} published={c.is_published} />
                <DeleteCommentButton id={c.id} />
              </div>
            </div>
            <p className="mt-2 text-foreground/85">{c.question}</p>
            {c.answer ? (
              <div className="mt-3 rounded-xl border-l-2 border-brand-primary/60 bg-brand-primary/5 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">Cavab: {c.answered_by}</p>
                <p className="mt-1 text-sm text-foreground/80">{c.answer}</p>
              </div>
            ) : (
              <AnswerForm id={c.id} />
            )}
          </div>
        ))}
        {(!data || data.length === 0) && (
          <p className="py-8 text-center text-foreground/50">Bu filtre uyğun şərh yoxdur.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          {page > 1 ? (
            <a href={`/admin/serhler${qs(page - 1, filter)}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/80 hover:bg-white/10">
              ← Əvvəlki
            </a>
          ) : (
            <span className="rounded-lg border border-white/5 px-3 py-1.5 text-foreground/30">← Əvvəlki</span>
          )}
          <span className="px-3 text-foreground/60">{page} / {totalPages}</span>
          {page < totalPages ? (
            <a href={`/admin/serhler${qs(page + 1, filter)}`} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/80 hover:bg-white/10">
              Növbəti →
            </a>
          ) : (
            <span className="rounded-lg border border-white/5 px-3 py-1.5 text-foreground/30">Növbəti →</span>
          )}
        </div>
      )}
    </div>
  );
}