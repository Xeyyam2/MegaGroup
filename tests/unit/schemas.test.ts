import { describe, it, expect } from "vitest";
import { countrySchema } from "@/lib/validations/country.schema";
import { faqSchema } from "@/lib/validations/faq.schema";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";
import { siteContentSchema } from "@/lib/validations/site-content.schema";

describe("countrySchema", () => {
  it("requires name_az", () => {
    const r = countrySchema.safeParse({ slug: "test", name_az: "" });
    expect(r.success).toBe(false);
  });
  it("accepts minimal valid input (AZ only)", () => {
    const r = countrySchema.safeParse({ slug: "turkiye", name_az: "Türkiyə" });
    expect(r.success).toBe(true);
  });
  it("rejects invalid slug (uppercase)", () => {
    const r = countrySchema.safeParse({ slug: "Turkiye", name_az: "Xx" });
    expect(r.success).toBe(false);
  });
  it("coerces sort_order string to number", () => {
    const r = countrySchema.safeParse({ slug: "xx", name_az: "X", sort_order: "5" });
    expect(r.success && r.data.sort_order).toBe(5);
  });
  it("name_ru and name_en are optional", () => {
    const r = countrySchema.safeParse({ slug: "xx", name_az: "X", name_ru: "", name_en: "" });
    expect(r.success).toBe(true);
  });
});

describe("faqSchema", () => {
  it("requires question_az and answer_az", () => {
    expect(faqSchema.safeParse({ question_az: "", answer_az: "a" }).success).toBe(false);
    expect(faqSchema.safeParse({ question_az: "q", answer_az: "" }).success).toBe(false);
  });
  it("accepts valid AZ-only", () => {
    expect(faqSchema.safeParse({ question_az: "Sual", answer_az: "Cavab" }).success).toBe(true);
  });
});

describe("testimonialSchema", () => {
  it("requires student_name and quote_az", () => {
    expect(testimonialSchema.safeParse({ student_name: "", quote_az: "q" }).success).toBe(false);
    expect(testimonialSchema.safeParse({ student_name: "Ad", quote_az: "" }).success).toBe(false);
  });
  it("coerces year string to number", () => {
    const r = testimonialSchema.safeParse({ student_name: "Ad", quote_az: "q", year: "2024" });
    expect(r.success && r.data.year).toBe(2024);
  });
});

describe("siteContentSchema", () => {
  it("requires value_az", () => {
    expect(siteContentSchema.safeParse({ key: "k", value_az: "" }).success).toBe(false);
  });
  it("accepts valid", () => {
    expect(siteContentSchema.safeParse({ key: "hero_title", value_az: "X" }).success).toBe(true);
  });
});