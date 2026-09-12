import { z } from "zod";

// Azərbaycan mobil operator prefiksləri (+994-dən sonra gələn 2 rəqəm):
// 10, 50, 51 — Azercell; 55 — Bakcell; 70, 77 — Nar; 99 — Bakcell (köhnə adı: Bakmobile).
// "əl ilə yaz" rejimində başqa 2 rəqəmli kod da qəbul olunur — heç bir müraciət bloklanmasın.
export const azOperatorPrefixes = ["10", "50", "51", "55", "70", "77", "99"] as const;

export type AzOperatorPrefix = (typeof azOperatorPrefixes)[number];

// Tam (final) nömrə: +994 + 2 rəqəmli operator kodu + 7 rəqəm (cəmi 12 rəqəm).
// Operator kodu sərbəst qəbul olunur (adi prefikslər + əl ilə yazılanlar).
// və ya xarici nömrə: + ilə başlayan 7-15 rəqəm (E.164).
export const AZ_PHONE_REGEX = /^\+994\d{9}$/;
export const FOREIGN_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

export const phoneError = "Düzgün telefon nömrəsi daxil edin";

export const contactSchema = z.object({
  full_name: z.string().min(2, "Ad ən az 2 simvol olmalıdır").max(100),
  phone: z
    .string()
    .trim()
    // +994 ilə başlayan nömrə həmişə AZ formatı ilə yoxlanılır (12 rəqəm) —
    // natamaz AZ nömrəsi təsadüfən "xarici" kimi qəbul olunmasın.
    .refine((v) => (v.startsWith("+994") ? AZ_PHONE_REGEX.test(v) : FOREIGN_PHONE_REGEX.test(v)), phoneError),
  email: z.string().email("Düzgün email daxil edin").optional().or(z.literal("")),
  country_interest: z.string().min(1, "Ölkə seçin"),
  attestat_avg: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .pipe(
      z
        .number()
        .min(40, "Attestat 40-100 arası olmalıdır")
        .max(100, "Attestat 40-100 arası olmalıdır")
        .optional(),
    ),
  message: z.string().max(500).optional(),
});

export type ContactFormData = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;

// Form tərəfindəki sahələr: prefiks (məs. "50") + lokal hissə (7 rəqəm) ayrı-sayrı daxil edilir,
// submit zamanı "+994" + prefiks + rəqəmlər birləşdirilib final nömrə yaradılır.
// "foreign" — ölkə kodu ilə tam xarici nömrə; "manual" — istifadəçi öz prefiksini yazır (2 rəqəm).
function refinePhoneParts(
  val: { phone_code: string; phone: string },
  ctx: z.RefinementCtx,
) {
  if (val.phone_code === "foreign") {
    const normalized = val.phone.replace(/[\s\-()]/g, "");
    if (!FOREIGN_PHONE_REGEX.test(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Ölkə kodu ilə tam nömrə daxil edin (+9945xxxxxxxx və ya +90xxxxxxxxxx)",
      });
    }
    return;
  }
  // Azərbaycan (seçilmiş və ya əl ilə yazılmış) prefiks: dəqiq 2 rəqəm.
  if (!/^\d{2}$/.test(val.phone_code)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["phone"],
      message: "Prefiks 2 rəqəm olmalıdır (məs. 10, 50, 99)",
    });
    return;
  }
  if (!/^\d{7}$/.test(val.phone.replace(/\D/g, ""))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["phone"],
      message: "Prefiks seçdikdən sonra 7 rəqəmli nömrəni tam daxil edin",
    });
  }
}

export const phoneCodeRequired = "Operator prefiksini seçin";

// Azərbaycan prefiksləri ilə tam nömrə yaradır: ("50", "1234567") → "+994501234567".
export function buildAzPhone(prefix: string, localPart: string): string {
  return `+994${prefix}${localPart.replace(/\D/g, "")}`;
}

// Müraciət formasının (ApplicationForm) resolver şeması — contactSchema əsasında,
// telefon sahəsi "prefiks + lokal nömrə" hissələri ilə yoxlanılır.
export const applicationFormSchema = contactSchema
  .extend({
    phone_code: z.string().min(1, phoneCodeRequired),
    phone: z.string(),
  })
  .superRefine(refinePhoneParts);

export type ApplicationFormData = z.input<typeof applicationFormSchema>;
export type ApplicationFormOutput = z.output<typeof applicationFormSchema>;

