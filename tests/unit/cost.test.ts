import { describe, it, expect } from "vitest";
import { calculateMonthlyCost } from "@/data/cost-data";
import type { UniversityFee } from "@/types";
import { sampleFees } from "../fixtures/sampleData";

describe("calculateMonthlyCost", () => {
  it("computes monthly tuition as average divided by 9", () => {
    const result = calculateMonthlyCost(sampleFees);
    expect(result.monthly.tuition).toBe(Math.round((1200 + 3000) / 2 / 9));
  });

  it("computes each monthly component as the average of min and max", () => {
    const result = calculateMonthlyCost(sampleFees);
    expect(result.monthly.dorm).toBe(Math.round((50 + 120) / 2));
    expect(result.monthly.food).toBe(Math.round((100 + 180) / 2));
    expect(result.monthly.transport).toBe(Math.round((20 + 40) / 2));
    expect(result.monthly.personal).toBe(Math.round((50 + 120) / 2));
  });

  it("total_monthly is the sum of all monthly components", () => {
    const result = calculateMonthlyCost(sampleFees);
    const sum =
      result.monthly.tuition +
      result.monthly.dorm +
      result.monthly.food +
      result.monthly.transport +
      result.monthly.personal;
    expect(result.total_monthly).toBe(sum);
  });

  it("total_period(9) equals total_monthly times 9", () => {
    const result = calculateMonthlyCost(sampleFees);
    expect(result.total_period(9)).toBe(result.total_monthly * 9);
  });

  it("returns zeros for an all-zero fee", () => {
    const zeroFees: UniversityFee = {
      tuition_min_usd: 0, tuition_max_usd: 0,
      dorm_min_usd: 0, dorm_max_usd: 0,
      food_min_usd: 0, food_max_usd: 0,
      transport_min_usd: 0, transport_max_usd: 0,
      personal_min_usd: 0, personal_max_usd: 0,
    };
    const result = calculateMonthlyCost(zeroFees);
    expect(result.total_monthly).toBe(0);
    expect(result.total_period(12)).toBe(0);
  });
});
