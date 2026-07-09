"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/data/config";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const configured = isSupabaseConfigured();

  // Recovery link-i supabase-i avtomatik sessiya qurur (PKCE). Yalnız sessiya varsa davam edirik.
  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError("Sıfırlama linki etibarsız və ya vaxtı keçib. Yenisini tələb edin.");
      }
      setReady(true);
    });
  }, [configured]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Parol ən az 6 simvol olmalıdır");
      return;
    }
    if (password !== confirm) {
      setError("Parollar uyğun gəlmir");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    toast.success("Parol yeniləndi");
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <h1 className="font-heading text-2xl font-bold">Yeni parol</h1>
        <p className="mt-1 text-sm text-foreground/60">Yeni parolunuzu təyin edin</p>
        {!ready && !error ? (
          <p className="mt-6 text-sm text-foreground/60">Yoxlanılır...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-foreground/70" htmlFor="password">
                Yeni parol
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-foreground/70" htmlFor="confirm">
                Təkrar
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Saxlanılır..." : "Parolu yenilə"}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link href="/admin/login" className="text-xs text-foreground/60 hover:text-brand-primary">
            ← Girişə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
}
