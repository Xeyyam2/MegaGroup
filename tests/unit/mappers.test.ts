import { describe, it, expect } from "vitest";
import { mapCountryRow, pickLocalized, pickLocalizedArray } from "@/lib/data/mappers";
import { sampleCountryRow } from "../fixtures/sampleData";

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
    const c = mapCountryRow(sampleCountryRow, "ru");
    expect(c.name).toBe("Турция");
    expect(c.description).toBe("Ru desc");
  });
  it("falls back to az for warning_banner when ru is null", () => {
    const c = mapCountryRow(sampleCountryRow, "ru");
    expect(c.warning_banner).toBe("Az warn");
  });
  it("falls back to az array when localized array is empty", () => {
    const c = mapCountryRow(sampleCountryRow, "en");
    expect(c.documents_required).toEqual(["DocAz"]);
  });
  it("keeps all _az/_ru/_en fields for dashboard", () => {
    const c = mapCountryRow(sampleCountryRow, "az");
    expect(c.name_az).toBe("Türkiyə");
    expect(c.name_ru).toBe("Турция");
    expect(c.advantages_az).toEqual(["Az1"]);
  });
  it("maps quick_stats from flat qs_ columns", () => {
    const c = mapCountryRow(sampleCountryRow, "az");
    expect(c.quick_stats.universities).toBe(200);
    expect(c.quick_stats.visa_difficulty).toBe("easy");
  });
});
