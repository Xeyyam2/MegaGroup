import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeleteApplicationButton } from "./DeleteApplicationButton";

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

export default async function ApplicationsList() {
  const supabase = await createClient();
  const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Müraciətlər</h1>
        <span className="text-sm text-foreground/60">{(data ?? []).length} müraciət</span>
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
            {(data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{a.full_name}</td>
                <td className="px-5 py-3 text-foreground/80">{a.phone}</td>
                <td className="px-5 py-3 text-foreground/80">{a.country_interest || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[a.status] ?? "bg-white/10 text-foreground/70"}`}>
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
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-foreground/50">
                  Hələ müraciət yoxdur. Saytdakı müraciət forması doldurulanda burada görünəcək.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
