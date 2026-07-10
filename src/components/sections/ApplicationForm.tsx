"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactFormData, type ContactFormOutput } from "@/lib/validations/contact.schema";
import { countries } from "@/data/countries";
import { createApplication } from "@/lib/actions/applications";
import { TurnstileWidget } from "@/components/sections/TurnstileWidget";
import { cn } from "@/lib/utils";

// Analytics event-i module səviyyəsində vurulur — react-hooks/immutability qaydası
// komponent daxilində window.dataLayer mutasiyasına icazə vermir. GA4/GTM standardı.
function trackApplicationSubmitted(country: string) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  if (!w.dataLayer) w.dataLayer = [];
  w.dataLayer.push({ event: "application_submitted", country });
}

function ApplicationFormContent() {
  const t = useTranslations("application");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Success state URL-də saxlanır (?success=1) — refresh-də itmir.
  const submitted = searchParams.get("success") === "1";
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData, unknown, ContactFormOutput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormOutput, event?: React.BaseSyntheticEvent) => {
    setServerError("");
    // Honeypot dəyərini submit event-in DOM-dan oxuyuruq (ref closure -> lint qaydasını tetiklemir)
    const formEl = event?.target as HTMLFormElement | undefined;
    const honeypot = formEl?.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? "";
    const turnstileToken = formEl?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "";
    const fd = new FormData();
    fd.append("full_name", data.full_name);
    fd.append("phone", data.phone);
    fd.append("email", data.email ?? "");
    fd.append("country_interest", data.country_interest);
    fd.append("attestat_avg", String(data.attestat_avg ?? ""));
    fd.append("message", data.message ?? "");
    fd.append("website", honeypot);
    fd.append("cf-turnstile-response", turnstileToken);
    const res = await createApplication(fd);
    if ("error" in res && res.error) {
      setServerError(res.error);
    } else {
      // Analytics event (GA4 / GTM dataLayer) — redirect-dən əvvəl.
      trackApplicationSubmitted(data.country_interest ?? "");
      // Success state-i URL-də saxlayırıq ki, refresh-də qalsın.
      router.push(`${pathname}?success=1`);
    }
  };

  if (submitted) {
    return (
      <div className="glass-strong mx-auto max-w-xl rounded-3xl p-8 text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-foreground">{t("success")}</h2>
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="mt-6 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
        >
          OK
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-foreground placeholder:text-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-strong mx-auto max-w-xl space-y-5 rounded-3xl p-8" noValidate>
      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-foreground/80">{t("name")} *</label>
        <input
          type="text"
          id="full_name"
          {...register("full_name")}
          aria-invalid={!!errors.full_name}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          className={cn(inputClass, errors.full_name && "border-brand-primary")}
        />
        {errors.full_name && <p id="full_name-error" className="mt-1 text-sm text-brand-primary">{errors.full_name.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground/80">{t("phone")} *</label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={cn(inputClass, errors.phone && "border-brand-primary")}
          placeholder="+994 50 123 45 67"
        />
        {errors.phone && <p id="phone-error" className="mt-1 text-sm text-brand-primary">{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground/80">{t("email")}</label>
        <input
          type="email"
          id="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(inputClass, errors.email && "border-brand-primary")}
          placeholder="email@example.com"
        />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-brand-primary">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="country_interest" className="mb-1 block text-sm font-medium text-foreground/80">{t("country")} *</label>
        <select
          id="country_interest"
          {...register("country_interest")}
          aria-invalid={!!errors.country_interest}
          aria-describedby={errors.country_interest ? "country_interest-error" : undefined}
          className={cn(inputClass, errors.country_interest && "border-brand-primary")}
          defaultValue=""
        >
          <option value="" disabled className="bg-slate-900">—</option>
          {countries.map((c) => (
            <option key={c.slug} value={c.slug} className="bg-slate-900">{c.name}</option>
          ))}
        </select>
        {errors.country_interest && <p id="country_interest-error" className="mt-1 text-sm text-brand-primary">{errors.country_interest.message}</p>}
      </div>
      <div>
        <label htmlFor="attestat_avg" className="mb-1 block text-sm font-medium text-foreground/80">Attestat (40-100)</label>
        <input
          type="number"
          id="attestat_avg"
          {...register("attestat_avg")}
          aria-invalid={!!errors.attestat_avg}
          aria-describedby={errors.attestat_avg ? "attestat_avg-error" : undefined}
          className={cn(inputClass, errors.attestat_avg && "border-brand-primary")}
          min={40}
          max={100}
        />
        {errors.attestat_avg && <p id="attestat_avg-error" className="mt-1 text-sm text-brand-primary">{errors.attestat_avg.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground/80">{t("message")}</label>
        <textarea
          id="message"
          {...register("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputClass, "min-h-[100px] resize-y")}
        />
        {errors.message && <p id="message-error" className="mt-1 text-sm text-brand-primary">{errors.message.message}</p>}
      </div>
      {serverError && <p className="text-sm text-red-400">{serverError}</p>}
      {/* Turnstile (aktivdirsə — NEXT_PUBLIC_TURNSTILE_SITE_KEY yoxdursa görünmür) */}
      <TurnstileWidget />
      {/* Honeypot: botlar doldurur, istifadəçilər görmür — server-də yoxlanır */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-brand-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50">
        {isSubmitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

// useSearchParams App Router-də Suspense boundary tələb edir — self-contained wrap.
export function ApplicationForm() {
  return (
    <Suspense fallback={null}>
      <ApplicationFormContent />
    </Suspense>
  );
}
