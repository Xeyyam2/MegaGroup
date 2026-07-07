"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/data/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
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

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass w-full max-w-md rounded-2xl p-8">
          <h1 className="font-heading text-2xl font-bold">MegaGroup CMS</h1>
          <p className="mt-1 text-sm text-foreground/60">Daxil olun</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          </form>
      </div>
    </div>
  );
}
