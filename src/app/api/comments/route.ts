import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { commentSchema } from "@/lib/validations/comment.schema";

/**
 * Public UGC comment read API — yalnız DƏRC OLUNMUŞ şərhləri qaytarır.
 * GET /api/comments?slug={article-slug}
 * SSR/static səhifələrdə client tərəfdən fetch olunur (is_published=true
 * filtri service-role client-də etibarlıdır — çünki RLS anon-a SELECT vermir).
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const parsed = commentSchema.pick({ article_slug: true }).safeParse({ article_slug: slug });
  if (!parsed.success) {
    return NextResponse.json({ error: "Yanlış slug" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("comments")
    .select("author_name, question, answer, created_at")
    .eq("article_slug", parsed.data.article_slug)
    .eq("is_published", true)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("[GET /api/comments]", error.message);
    return NextResponse.json({ error: "Server xətası" }, { status: 500 });
  }

  return NextResponse.json(
    { comments: data ?? [] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
