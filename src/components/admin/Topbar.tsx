"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function Topbar() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-3">
      <div className="text-sm text-foreground/60">Admin Panel</div>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-white/10 hover:text-brand-primary"
      >
        <LogOut size={16} /> Çıxış
      </button>
    </header>
  );
}
