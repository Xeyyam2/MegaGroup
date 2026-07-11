import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockUseLocale = vi.fn();
vi.mock("next-intl", () => ({
  useLocale: () => mockUseLocale(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/az",
}));

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

beforeEach(() => {
  mockUseLocale.mockReset();
  mockPush.mockReset();
});

describe("LanguageSwitcher", () => {
  it("shows the current locale label (AZ)", () => {
    mockUseLocale.mockReturnValue("az");
    render(<LanguageSwitcher />);
    expect(screen.getByText("AZ")).toBeInTheDocument();
  });

  it("opens dropdown and switches to EN on click", () => {
    mockUseLocale.mockReturnValue("az");
    render(<LanguageSwitcher />);

    // Click the toggle button
    const toggle = screen.getByRole("button", { name: /Dil seç/i });
    fireEvent.click(toggle);

    // EN option should now be visible
    const enButton = screen.getByRole("button", { name: "EN" });
    fireEvent.click(enButton);

    // Should call router.push with /en path
    expect(mockPush).toHaveBeenCalledWith("/en");
  });

  it("switches from az to ru", () => {
    mockUseLocale.mockReturnValue("az");
    render(<LanguageSwitcher />);

    fireEvent.click(screen.getByRole("button", { name: /Dil seç/i }));
    fireEvent.click(screen.getByRole("button", { name: "RU" }));

    expect(mockPush).toHaveBeenCalledWith("/ru");
  });
});
