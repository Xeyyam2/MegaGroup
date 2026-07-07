import { z } from "zod";

export const countrySchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug yalnız kiçik hərf, rəqəm və tire"),
  flag_emoji: z.string().max(10).optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  name_az: z.string().min(1, "AZ ad məcburidir"),
  name_ru: z.string().optional().or(z.literal("")),
  name_en: z.string().optional().or(z.literal("")),
  description_az: z.string().optional().or(z.literal("")),
  description_ru: z.string().optional().or(z.literal("")),
  description_en: z.string().optional().or(z.literal("")),
  qs_universities: z.coerce.number().int().min(0).default(0),
  qs_avg_tuition_usd: z.coerce.number().int().min(0).default(0),
  qs_language: z.string().optional().or(z.literal("")),
  qs_visa_difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export type CountryFormData = z.input<typeof countrySchema>;
export type CountryFormOutput = z.output<typeof countrySchema>;