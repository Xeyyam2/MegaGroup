"use client";
import { useRef, useState } from "react";
import { publishComment, unpublishComment, answerComment, deleteComment } from "./actions";

export function PublishButton({ id, published }: { id: string; published: boolean }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function run(fn: () => Promise<{ success?: boolean; error?: string } | undefined>) {
    setBusy(true);
    setMsg(null);
    const r = await fn();
    if (r && "error" in r && r.error) setMsg(r.error);
    setBusy(false);
  }
  return (
    <span className="inline-flex items-center gap-2">
      {published ? (
        <button onClick={() => run(() => unpublishComment(id))} disabled={busy} className="text-sm text-yellow-500 hover:underline disabled:opacity-50">
          Dərc yol
        </button>
      ) : (
        <button onClick={() => run(() => publishComment(id))} disabled={busy} className="text-sm text-brand-primary hover:underline disabled:opacity-50">
          Dərc et
        </button>
      )}
      {msg && <span className="text-xs text-red-400">{msg}</span>}
    </span>
  );
}

export function AnswerForm({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const r = await answerComment(id, fd);
    if (r && "success" in r && r.success) ref.current?.reset();
    else if (r && "error" in r) setMsg(r.error);
    setBusy(false);
  }
  return (
    <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
      <input
        type="text"
        name="answer"
        required
        minLength={2}
        placeholder="Admin cavabı yazın..."
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-primary focus:outline-none"
      />
      <button type="submit" disabled={busy} className="rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
        Cavabla
      </button>
      {msg && <span className="text-xs text-red-400">{msg}</span>}
    </form>
  );
}

export function DeleteCommentButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  async function run() {
    if (!confirm("Bu sualı silmək istəyirsiniz?")) return;
    setBusy(true);
    await deleteComment(id);
    setBusy(false);
  }
  return (
    <button onClick={run} disabled={busy} className="text-sm text-red-400 hover:underline disabled:opacity-50">
      Sil
    </button>
  );
}