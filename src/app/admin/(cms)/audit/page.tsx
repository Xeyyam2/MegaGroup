import { History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/data/config";

const ACTION_COLORS: Record<string, string> = {
  INSERT: "bg-green-400/20 text-green-300",
  UPDATE: "bg-blue-400/20 text-blue-300",
  DELETE: "bg-red-400/20 text-red-300",
};

type AuditEntry = {
  id: string;
  user_id: string | null;
  action: string;
  table_name: string;
  row_id: string | null;
  created_at: string;
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

export default async function AuditPage() {
  let entries: AuditEntry[] = [];
  let configured = true;

  if (!isSupabaseConfigured()) {
    configured = false;
  } else {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("audit_log")
        .select("id, user_id, action, table_name, row_id, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!error && data) {
        entries = data as AuditEntry[];
      } else if (error) {
        // Cədvəl hələ migrasiya olunmayıbsa və ya başqa xəta varsa fallback göstər.
        configured = false;
      }
    } catch {
      configured = false;
    }
  }

  if (!configured) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3">
          <History size={26} />
          <h1 className="font-heading text-2xl font-bold">Audit log</h1>
        </div>
        <div className="glass rounded-2xl p-8 text-center text-foreground/60">
          Audit log hələ konfiqurasiya olunmayıb
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={26} />
          <h1 className="font-heading text-2xl font-bold">Audit log</h1>
        </div>
        <span className="text-sm text-foreground/60">{entries.length} qeyd</span>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-foreground/70">
            <tr>
              <th className="px-5 py-3">Tarix</th>
              <th className="px-5 py-3">İstifadəçi</th>
              <th className="px-5 py-3">Əməliyyat</th>
              <th className="px-5 py-3">Cədvəl</th>
              <th className="px-5 py-3">ID</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 text-foreground/60">{formatDate(e.created_at)}</td>
                <td className="px-5 py-3 font-mono text-xs text-foreground/80">
                  {e.user_id ? e.user_id.slice(0, 8) : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      ACTION_COLORS[e.action] ?? "bg-white/10 text-foreground/70"
                    }`}
                  >
                    {e.action}
                  </span>
                </td>
                <td className="px-5 py-3 text-foreground/80">{e.table_name}</td>
                <td className="px-5 py-3 font-mono text-xs text-foreground/60">
                  {e.row_id ? e.row_id.slice(0, 8) : "—"}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-foreground/50">
                  Hələ audit qeydi yoxdur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
