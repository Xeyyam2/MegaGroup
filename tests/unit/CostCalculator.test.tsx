import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { University } from "@/types";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

import { CostCalculator } from "@/components/sections/CostCalculator";

const universities: University[] = [
  {
    id: "u1",
    slug: "uni-a",
    country_slug: "turkiye",
    name: "University A",
    name_az: "University A",
    name_ru: "Университет А",
    name_en: "University A",
    city: "İstanbul",
    city_az: "İstanbul",
    city_ru: "Стамбул",
    city_en: "Istanbul",
    website_url: "",
    logo_url: "",
    hero_image_url: "",
    is_featured: true,
    is_active: true,
    highlights: [],
    highlights_az: [],
    highlights_ru: [],
    highlights_en: [],
    faculties: [],
    fees: {
      tuition_min_usd: 1200,
      tuition_max_usd: 3000,
      dorm_min_usd: 50,
      dorm_max_usd: 120,
      food_min_usd: 100,
      food_max_usd: 180,
      transport_min_usd: 20,
      transport_max_usd: 40,
      personal_min_usd: 50,
      personal_max_usd: 120,
    },
  },
  {
    id: "u2",
    slug: "uni-b",
    country_slug: "turkiye",
    name: "University B",
    name_az: "University B",
    name_ru: "Университет Б",
    name_en: "University B",
    city: "Ankara",
    city_az: "Ankara",
    city_ru: "Анкара",
    city_en: "Ankara",
    website_url: "",
    logo_url: "",
    hero_image_url: "",
    is_featured: false,
    is_active: true,
    highlights: [],
    highlights_az: [],
    highlights_ru: [],
    highlights_en: [],
    faculties: [],
    fees: {
      tuition_min_usd: 2000,
      tuition_max_usd: 5000,
      dorm_min_usd: 100,
      dorm_max_usd: 200,
      food_min_usd: 150,
      food_max_usd: 250,
      transport_min_usd: 30,
      transport_max_usd: 60,
      personal_min_usd: 80,
      personal_max_usd: 160,
    },
  },
];

describe("CostCalculator", () => {
  it("renders the first university by default", () => {
    render(<CostCalculator universities={universities} />);
    // University A is selected by default — its total_monthly = (2100/9) + 85 + 140 + 30 + 85 = 233+340 = 573
    // Just check it renders the monthly total
    expect(screen.getByText("monthlyTotal")).toBeInTheDocument();
  });

  it("updates displayed cost when university changes", () => {
    render(<CostCalculator universities={universities} />);

    // University A: tuition=round(4200/18)=233, dorm=85, food=140, transport=30, personal=85
    // total_monthly = 233+85+140+30+85 = 573
    const uniATotal = 573;
    expect(screen.getByText("$" + uniATotal)).toBeInTheDocument();

    // Change to University B
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "uni-b" } });

    // University B: tuition=round((2000+5000)/2/9)=round(3500/9)=389, dorm=150, food=200, transport=45, personal=120
    // total_monthly = 389+150+200+45+120 = 904
    const uniBTotal = 389 + 150 + 200 + 45 + 120;
    expect(screen.getByText("$" + uniBTotal)).toBeInTheDocument();
  });
});
