import { z } from "zod";

export const testimonialSchema = z.object({
  student_name: z.string().min(1, "Tələbə adı məcburidir"),
  university_slug: z.string().optional().or(z.literal("")),
  country_slug: z.string().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
  quote_az: z.string().min(1, "AZ sitat məcburidir"),
  quote_ru: z.string().optional().or(z.literal("")),
  quote_en: z.string().optional().or(z.literal("")),
  year: z.coerce.number().int().min(1990).max(2100).default(new Date().getFullYear()),
  is_active: z.coerce.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export type TestimonialFormData = z.input<typeof testimonialSchema>;
export type TestimonialFormOutput = z.output<typeof testimonialSchema>;