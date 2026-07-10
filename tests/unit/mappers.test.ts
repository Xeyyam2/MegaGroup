import { describe, it, expect } from "vitest";
import { mapCountryRow, pickLocalized, pickLocalizedArray } from "@/lib/data/mappers";
import type { Database } from "@/types/db.generated";

const sampleRow: Database["public"]["Tables"]["countries"]["Row"] = {
  id: "c1",
  slug: "turkiye",
  flag_emoji: "🇹🇷",
  hero_image_url: "x",
  sort_order: 1,
  is_active: true,
  is_featured: true,
  name_az: "Türkiyə",
  name_ru: "Турция",
  name_en: "Turkey",
  description_az: "Az desc",
  description_ru: "Ru desc",
  description_en: "En desc",
  warning_banner_az: "Az warn",
  warning_banner_ru: null,
  warning_banner_en: null,
  advantages_az: ["Az1"],
  advantages_ru: ["Ru1"],
  advantages_en: ["En1"],
  documents_az: ["DocAz"],
  documents_ru: [],
  documents_en: [],
  steps_az: [{ step: 1, title: "Az", description: "Az" }],
  steps_ru: [],
  steps_en: [],
  qs_universities: 200,
  qs_avg_tuition_usd: 1500,
  qs_language: "Türkçe",
  qs_visa_difficulty: "easy",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  is_deleted: false,
  deleted_at: null,
};

describe("pickLocalized", () => {
  it("returns az for locale az", () => {
    expect(pickLocalized("az", "a", "r", "e")).toBe("a");
  });
  it("returns ru value when present", () => {
    expect(pickLocalized("ru", "a", "r", "e")).toBe("r");
  });
  it("falls back to az when ru is null", () => {
    expect(pickLocalized("ru", "a", null, "e")).toBe("a");
  });
  it("falls back to az when en is empty string", () => {
    expect(pickLocalized("en", "a", "r", "")).toBe("a");
  });
});

describe("pickLocalizedArray", () => {
  it("returns ru array when non-empty", () => {
    expect(pickLocalizedArray("ru", ["a"], ["r"], ["e"])).toEqual(["r"]);
  });
  it("falls back to az when ru array is empty", () => {
    expect(pickLocalizedArray("ru", ["a"], [], [])).toEqual(["a"]);
  });
});

describe("mapCountryRow", () => {
  it("localizes name and description to ru", () => {
    const c = mapCountryRow(sampleRow, "ru");
    expect(c.name).toBe("Турция");
    expect(c.description).toBe("Ru desc");
  });
  it("falls back to az for warning_banner when ru is null", () => {
    const c = mapCountryRow(sampleRow, "ru");
    expect(c.warning_banner).toBe("Az warn");
  });
  it("falls back to az array when localized array is empty", () => {
    const c = mapCountryRow(sampleRow, "en");
    expect(c.documents_required).toEqual(["DocAz"]);
  });
  it("keeps all _az/_ru/_en fields for dashboard", () => {
    const c = mapCountryRow(sampleRow, "az");
    expect(c.name_az).toBe("Türkiyə");
    expect(c.name_ru).toBe("Турция");
    expect(c.advantages_az).toEqual(["Az1"]);
  });
  it("maps quick_stats from flat qs_ columns", () => {
    const c = mapCountryRow(sampleRow, "az");
    expect(c.quick_stats.universities).toBe(200);
    expect(c.quick_stats.visa_difficulty).toBe("easy");
  });
});
