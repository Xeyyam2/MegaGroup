import { z } from "zod";

export const universitySchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug yalnız kiçik hərf, rəqəm və tire"),
  country_slug: z.string().min(1, "Ölkə seçin"),
  website_url: z.string().url().optional().or(z.literal("")),
  logo_url: z.string().url().optional().or(z.literal("")),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  name_az: z.string().min(1, "AZ ad məcburidir"),
  name_ru: z.string().optional().or(z.literal("")),
  name_en: z.string().optional().or(z.literal("")),
  city_az: z.string().min(1, "AZ şəhər məcburidir"),
  city_ru: z.string().optional().or(z.literal("")),
  city_en: z.string().optional().or(z.literal("")),
  highlights_az: z.string().optional().or(z.literal("")),
  highlights_ru: z.string().optional().or(z.literal("")),
  highlights_en: z.string().optional().or(z.literal("")),
  notes_az: z.string().optional().or(z.literal("")),
  notes_ru: z.string().optional().or(z.literal("")),
  notes_en: z.string().optional().or(z.literal("")),
  campus_info_az: z.string().optional().or(z.literal("")),
  campus_info_ru: z.string().optional().or(z.literal("")),
  campus_info_en: z.string().optional().or(z.literal("")),
});

export type UniversityFormData = z.input<typeof universitySchema>;
export type UniversityFormOutput = z.output<typeof universitySchema>;

export const facultySchema = z.object({
  name_az: z.string().min(1),
  name_ru: z.string().optional().or(z.literal("")),
  name_en: z.string().optional().or(z.literal("")),
  is_competitive: z.coerce.boolean().default(false),
  duration_years: z.coerce.number().int().min(1).max(10).default(4),
  language: z.string().optional().or(z.literal("")),
});

export const feesSchema = z.object({
  tuition_min_usd: z.coerce.number().int().min(0).default(0),
  tuition_max_usd: z.coerce.number().int().min(0).default(0),
  dorm_min_usd: z.coerce.number().int().min(0).default(0),
  dorm_max_usd: z.coerce.number().int().min(0).default(0),
  food_min_usd: z.coerce.number().int().min(0).default(0),
  food_max_usd: z.coerce.number().int().min(0).default(0),
  transport_min_usd: z.coerce.number().int().min(0).default(0),
  transport_max_usd: z.coerce.number().int().min(0).default(0),
  personal_min_usd: z.coerce.number().int().min(0).default(0),
  personal_max_usd: z.coerce.number().int().min(0).default(0),
});

export const facultiesArraySchema = z.array(facultySchema);