"use client";
import { useEffect, useState } from "react";
import { createComment } from "@/lib/actions/comments";

interface UgcComment {
  author_name: string;
  question: string;
  answer: string | null;
  created_at: string;
}

const STR = {
  az: {
    title: "Suallar və Cavablar",
    intro: "Məqalə ilə bağlı sualınız var? Yazın — mütəxəssisimiz cavablandırır (moderasiyadan sonra dərc olunur).",
    name: "Adınız",
    question: "Sualınız",
    placeholderName: "Adınızı yazın",
    placeholderQuestion: "Sualınızı yazın (minimum 10 simvol)",
    send: "Göndər",
    sending: "Göndərilir...",
    success: "Sualınız qəbul edildi — təsdiqlənəndən sonra dərc olunacaq.",
    empty: "Hələ sual yoxdur — ilk sualı siz verin.",
    answerLabel: "MegaGroup cavabı:",
  },
  ru: {
    title: "Вопросы и ответы",
    intro: "Есть вопрос по статье? Напишите — наш специалист ответит (после модерации).",
    name: "Ваше имя",
    question: "Ваш вопрос",
    placeholderName: "Введите имя",
    placeholderQuestion: "Введите вопрос (минимум 10 символов)",
    send: "Отправить",
    sending: "Отправка...",
    success: "Вопрос принят — после подтверждения будет опубликован.",
    empty: "Пока нет вопросов — задайте первый.",
    answerLabel: "Ответ MegaGroup:",
  },
  en: {
    title: "Questions & Answers",
    intro: "Have a question about this article? Ask — our specialist will answer (published after moderation).",
    name: "Your name",
    question: "Your question",
    placeholderName: "Enter your name",
    placeholderQuestion: "Type your question (minimum 10 characters)",
    send: "Send",
    sending: "Sending...",
    success: "Your question was received — it will be published after review.",
    empty: "No questions yet — be the first to ask.",
    answerLabel: "MegaGroup answer:",
  },
} as const;


export function CommentSection({ articleSlug, locale }: { articleSlug: string; locale: string }) {
  const s = STR[(locale as keyof typeof STR) in STR ? (locale as keyof typeof STR) : "az"];
  const [comments, setComments] = useState<UgcComment[] | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  // Data-fetch effect: setState yalnız async callback-lərdə çağrılır (submit
  // event-i kimi) — react-hooks/set-state-in-effect qaydasını pozmur. `active`
  // flag unmount-da stale setState-in qarşısını alır.
  useEffect(() => {
    let active = true;
    fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`)
      .then((res) => res.json())
      .then((json) => {
        if (active) setComments(Array.isArray(json.comments) ? json.comments : []);
      })
      .catch(() => {
        if (active) setComments([]);
      });
    return () => {
      active = false;
    };
  }, [articleSlug]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setMessage(null);
    const fd = new FormData(form);
    fd.set("article_slug", articleSlug);
    const result = await createComment(fd);
    if (result && "success" in result && result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
      setMessage(result && "error" in result ? (result.error ?? null) : null);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12" aria-labelledby="ugc-title">
      <h2 id="ugc-title" className="font-heading text-3xl font-bold text-foreground">{s.title}</h2>
      <p className="mt-2 text-sm text-foreground/60">{s.intro}</p>

      {/* Dərc olunmuş sual-cavablar */}
      <div className="mt-8 space-y-4">
        {comments === null ? null : comments.length === 0 ? (
          <p className="text-sm text-foreground/50">{s.empty}</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{c.author_name}</span>
                <span className="text-foreground/40">· {new Date(c.created_at).toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-foreground/80">{c.question}</p>
              {c.answer && (
                <div className="mt-3 rounded-xl border-l-2 border-brand-primary/60 bg-brand-primary/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">{s.answerLabel}</p>
                  <p className="mt-1 text-sm text-foreground/80">{c.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Sual formu */}
      <form onSubmit={onSubmit} className="glass mt-8 space-y-4 rounded-2xl p-6">
        {/* Honeypot — botlara qarşı (real istifadəçi görmür) */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <div>
          <label htmlFor="ugc-name" className="block text-sm font-medium text-foreground/80">{s.name}</label>
          <input
            id="ugc-name"
            name="author_name"
            type="text"
            required
            minLength={2}
            maxLength={60}
            placeholder={s.placeholderName}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-brand-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ugc-question" className="block text-sm font-medium text-foreground/80">{s.question}</label>
          <textarea
            id="ugc-question"
            name="question"
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            placeholder={s.placeholderQuestion}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus:border-brand-primary focus:outline-none"
          />
        </div>
        {status === "success" && <p className="text-sm text-success" role="status">{s.success}</p>}
        {status === "error" && message && <p className="text-sm text-red-400" role="alert">{message}</p>}
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          {status === "sending" ? s.sending : s.send}
        </button>
      </form>
    </section>
  );
}
