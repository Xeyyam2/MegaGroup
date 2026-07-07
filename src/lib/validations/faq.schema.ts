import { z } from "zod";

export const faqSchema = z.object({
  country_slug: z.string().optional().or(z.literal("")),
  university_slug: z.string().optional().or(z.literal("")),
  question_az: z.string().min(1, "AZ sual məcburidir"),
  question_ru: z.string().optional().or(z.literal("")),
  question_en: z.string().optional().or(z.literal("")),
  answer_az: z.string().min(1, "AZ cavab məcburidir"),
  answer_ru: z.string().optional().or(z.literal("")),
  answer_en: z.string().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type FaqFormData = z.input<typeof faqSchema>;
export type FaqFormOutput = z.output<typeof faqSchema>;