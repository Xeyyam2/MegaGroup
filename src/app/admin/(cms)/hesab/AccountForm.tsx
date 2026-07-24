"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEmail, updatePassword } from "./actions";

const inputClass =
  "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none";
const buttonClass =
  "rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50";

export function AccountForm({ currentEmail }: { currentEmail: string }) {
  const router = useRouter();

  const [email, setEmail] = useState(currentEmail);
  const [emailLoading, setEmailLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    const fd = new FormData();
    fd.set("email", email);
    const res = await updateEmail(fd);
    setEmailLoading(false);
    if (res && "error" in res) {
      toast.error(res.error);
    } else {
      toast.success("Email dəyişdirildi");
      router.refresh();
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Parol ən azı 8 simvol olmalıdır");
      return;
    }
    if (password !== confirm) {
      toast.error("Parollar eyni deyil");
      return;
    }
    setPassLoading(true);
    const fd = new FormData();
    fd.set("password", password);
    const res = await updatePassword(fd);
    setPassLoading(false);
    if (res && "error" in res) {
      toast.error(res.error);
    } else {
      toast.success("Parol dəyişdirildi");
      setPassword("");
      setConfirm("");
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold">Hesab</h1>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-1 font-semibold">Email dəyiş</h2>
        <p className="mb-4 text-xs text-foreground/60">
          Emaili dəyişdikdən sonra yenidən daxil olarkən yeni email istifadə olunacaq.
        </p>
        <form onSubmit={handleEmail} className="max-w-md space-y-3">
          <div>
            <label className="text-sm text-foreground/70" htmlFor="email">
              Yeni email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={emailLoading} className={buttonClass}>
            {emailLoading ? "..." : "Emaili dəyiş"}
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">Parol dəyiş</h2>
        <form onSubmit={handlePassword} className="max-w-md space-y-3">
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
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm text-foreground/70" htmlFor="confirm">
              Parolu təkrar yaz
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={passLoading} className={buttonClass}>
            {passLoading ? "..." : "Parolu dəyiş"}
          </button>
        </form>
      </div>
    </div>
  );
}
