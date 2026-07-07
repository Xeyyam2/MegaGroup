"use client";
import { AlertTriangle } from "lucide-react";
import { useLocale } from "next-intl";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const copy =
    locale === "ru"
      ? { title: "Произошла ошибка", desc: "Что-то пошло не так. Пожалуйста, попробуйте снова.", retry: "Попробовать снова" }
      : locale === "en"
        ? { title: "Something went wrong", desc: "Something went wrong. Please try again.", retry: "Try again" }
        : { title: "Xəta baş verdi", desc: "Bir şeylər yanlış getdi. Zəhmət olmasa yenidən cəhd edin.", retry: "Yenidən cəhd et" };

  return (
    <div className="glass-strong mx-auto mt-32 max-w-lg rounded-3xl p-10 text-center">
      <AlertTriangle size={48} className="mx-auto text-brand-primary" />
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-foreground/70">{copy.desc}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {copy.retry}
      </button>
    </div>
  );
}
