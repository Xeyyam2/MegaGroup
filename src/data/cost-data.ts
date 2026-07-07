import { universities } from "./universities";
import type { CostData, UniversityFee } from "@/types";

export const costData: CostData[] = universities.map((u) => ({
  university_slug: u.slug,
  fees: u.fees,
}));

export function getCostByUniversity(slug: string): CostData | undefined {
  return costData.find((c) => c.university_slug === slug);
}

export function calculateMonthlyCost(fees: UniversityFee) {
  const monthly = {
    tuition: Math.round((fees.tuition_min_usd + fees.tuition_max_usd) / 2 / 9),
    dorm: Math.round((fees.dorm_min_usd + fees.dorm_max_usd) / 2),
    food: Math.round((fees.food_min_usd + fees.food_max_usd) / 2),
    transport: Math.round((fees.transport_min_usd + fees.transport_max_usd) / 2),
    personal: Math.round((fees.personal_min_usd + fees.personal_max_usd) / 2),
  };
  const total = Object.values(monthly).reduce((a, b) => a + b, 0);
  return {
    monthly,
    total_monthly: total,
    total_period: (months: number) => total * months,
  };
}
