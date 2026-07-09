"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/data/config";
import { toast } from "sonner";

type Mode = "login" | "forgot";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [forgotSent, setForgotSent] = useState(false);
  const router = useRouter();
  const configured = isSupabaseConfigured();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!configured) {
      setError("Supabase hələ konfiqurasiya olunmayıb. .env.local doldurun və seed çalışdırın.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!configured) {
      setError("Supabase hələ konfiqurasiya olunmayıb.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/admin/reset-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setForgotSent(true);
      toast.success("Sıfırlama linki email-ə göndərildi");
    }
  }

  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass w-full max-w-md rounded-2xl p-8">
        <h1 className="font-heading text-2xl font-bold">MegaGroup CMS</h1>
        <p className="mt-1 text-sm text-foreground/60">{isLogin ? "Daxil olun" : "Parolu sıfırlayın"}</p>

        {isLogin ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-foreground/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm text-foreground/70" htmlFor="password">
                Parol
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {!configured && (
              <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-300">
                Supabase konfiqurasiya olunmayıb. <code>.env.local</code> doldurun, SQL migration və{" "}
                <code>npm run seed</code> çalışdırın.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Daxil olur..." : "Daxil ol"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
              }}
              className="w-full text-center text-xs text-foreground/60 hover:text-brand-primary"
            >
              Parolunu unutdun?
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-foreground/70" htmlFor="forgot-email">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {forgotSent && (
              <p className="rounded-lg border border-green-400/30 bg-green-400/10 p-3 text-xs text-green-300">
                Sıfırlama linki <strong>{email}</strong> ünvanına göndərildi. Email-i yoxlayın.
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Göndrilir..." : "Sıfırlama linki göndər"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setForgotSent(false);
              }}
              className="w-full text-center text-xs text-foreground/60 hover:text-brand-primary"
            >
              ← Girişə qayıt
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
