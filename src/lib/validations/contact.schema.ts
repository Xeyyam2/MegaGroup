import { z } from "zod";

export const contactSchema = z.object({
  full_name: z.string().min(2, "Ad ən az 2 simvol olmalıdır").max(100),
  phone: z
    .string()
    .regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, "Düzgün telefon nömrəsi daxil edin"),
  email: z.string().email("Düzgün email daxil edin").optional().or(z.literal("")),
  country_interest: z.string().min(1, "Ölkə seçin"),
  attestat_avg: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v))),
  message: z.string().max(500).optional(),
});

export type ContactFormData = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;

