import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();
  const copy =
    locale === "ru"
      ? {
          title: "Страница не найдена",
          desc: "Страница, которую вы ищете, не существует или была перемещена.",
          back: "Вернуться на главную",
        }
      : locale === "en"
        ? {
            title: "Page not found",
            desc: "The page you're looking for doesn't exist or has been moved.",
            back: "Back to homepage",
          }
        : {
            title: "Səhifə tapılmadı",
            desc: "Axtardığınız səhifə mövcud deyil və ya köçürülmüşdür.",
            back: "Ana səhifəyə qayıt",
          };

  return (
    <div className="glass-strong mx-auto mt-32 max-w-lg rounded-3xl p-10 text-center">
      <div className="font-heading text-7xl font-extrabold text-brand-primary glow-primary">404</div>
      <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-foreground/70">{copy.desc}</p>
      <Link
        href={`/${locale}`}
        className="mt-6 inline-block rounded-xl glass px-6 py-3 font-semibold text-foreground transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        {copy.back}
      </Link>
    </div>
  );
}
