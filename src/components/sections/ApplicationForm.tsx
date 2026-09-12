"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { applicationFormSchema, buildAzPhone, type ApplicationFormData, type ApplicationFormOutput } from "@/lib/validations/contact.schema";
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

// Azərbaycan mobil operatorları — prefiks → operator adı.
const AZ_OPERATORS: Record<string, string> = {
  "50": "Azercell",
  "51": "Azercell",
  "55": "Bakcell",
  "70": "Nar",
  "77": "Nar",
  "99": "Bakmobile",
};
const FOREIGN_PREFIX = "foreign";

function ApplicationFormContent() {
  const t = useTranslations("application");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Success state URL-də saxlanır (?success=1) — refresh-də itmir.
  const submitted = searchParams.get("success") === "1";
  const [serverError, setServerError] = useState("");
  // Telefon prefiksi: "50"-"99" — Azərbaycan operatoru, "foreign" — xarici nömrə.
  const [phoneCode, setPhoneCode] = useState("50");
  const isForeign = phoneCode === FOREIGN_PREFIX;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData, unknown, ApplicationFormOutput>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { phone_code: "50", phone: "" },
  });

  const phoneRegister = register("phone");

  // Prefiks dəyişəndə nömrə sahəsini sıfırla (AZ ↔ xarici formatlar fərqlidir).
  const handlePhoneCodeChange = (value: string) => {
    setPhoneCode(value);
    setValue("phone_code", value);
    setValue("phone", "", { shouldValidate: false });
  };

  // AZ rejimində yalnız rəqəmlər, maksimum 7 simvol; xarici rejimdə sərbəst (+ ilə).
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isForeign) {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 7);
    }
    phoneRegister.onChange(e);
  };

  const onSubmit = async (data: ApplicationFormOutput, event?: React.BaseSyntheticEvent) => {
    setServerError("");
    // Tam nömrəni yığ: +994 + prefiks + 7 rəqəm, və ya xarici nömrə (əyləncələri təmizlə).
    const finalPhone =
      data.phone_code === FOREIGN_PREFIX
        ? data.phone.replace(/[\s\-()]/g, "")
        : buildAzPhone(data.phone_code, data.phone);
    // Honeypot dəyərini submit event-in DOM-dan oxuyuruq (ref closure -> lint qaydasını tetiklemir)
    const formEl = event?.target as HTMLFormElement | undefined;
    const honeypot = formEl?.querySelector<HTMLInputElement>('input[name="website"]')?.value ?? "";
    const turnstileToken = formEl?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')?.value ?? "";
    const fd = new FormData();
    fd.append("full_name", data.full_name);
    fd.append("phone", finalPhone);
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
        <label htmlFor="phone_code" className="mb-1 block text-sm font-medium text-foreground/80">{t("phonePrefix")} *</label>
        <select
          id="phone_code"
          value={phoneCode}
          onChange={(e) => handlePhoneCodeChange(e.target.value)}
          className={cn(inputClass)}
        >
          {Object.entries(AZ_OPERATORS).map(([prefix, operator]) => (
            <option key={prefix} value={prefix} className="bg-slate-900">
              +994 {prefix} — {operator}
            </option>
          ))}
          <option value={FOREIGN_PREFIX} className="bg-slate-900">{t("phoneForeign")}</option>
        </select>
        <label htmlFor="phone" className="mb-1 mt-3 block text-sm font-medium text-foreground/80">{t("phone")} *</label>
        <input
          type="tel"
          id="phone"
          {...phoneRegister}
          onChange={handlePhoneChange}
          inputMode={isForeign ? "text" : "numeric"}
          maxLength={isForeign ? 20 : 7}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          className={cn(inputClass, errors.phone && "border-brand-primary")}
          placeholder={isForeign ? "+380501234567" : "1234567"}
        />
        {errors.phone && <p id="phone-error" className="mt-1 text-sm text-brand-primary">{errors.phone.message}</p>}
        <p className="mt-1 text-xs text-foreground/50">{isForeign ? t("phoneHintForeign") : t("phoneHintAz")}</p>
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
