import { z } from "zod";

export const siteContentSchema = z.object({
  key: z.string().min(1),
  value_az: z.string().min(1, "AZ dəyər məcburidir"),
  value_ru: z.string().optional().or(z.literal("")),
  value_en: z.string().optional().or(z.literal("")),
});

export type SiteContentFormData = z.input<typeof siteContentSchema>;
export type SiteContentFormOutput = z.output<typeof siteContentSchema>;