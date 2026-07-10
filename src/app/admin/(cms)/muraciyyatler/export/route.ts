import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.authorized) return new NextResponse("Unauthorized", { status: 403 });
  const { supabase } = guard;

  const { data, error } = await supabase
    .from("applications")
    .select("full_name,phone,email,country_interest,attestat_avg,message,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[csv-export]", error.message);
    return new NextResponse("Error", { status: 500 });
  }

  const rows = (data ?? []).map((a) => [
    a.full_name ?? "",
    a.phone ?? "",
    a.email ?? "",
    a.country_interest ?? "",
    String(a.attestat_avg ?? ""),
    (a.message ?? "").replace(/\n/g, " ").replace(/\r/g, " "),
    a.status ?? "",
    a.created_at ? new Date(a.created_at).toISOString() : "",
  ]);

  const csv = [
    "Ad,Telefon,Email,Olke,Attestat,Mesaj,Status,Tarix",
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  return new NextResponse("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="muraciyyatler-${Date.now()}.csv"`,
    },
  });
}
