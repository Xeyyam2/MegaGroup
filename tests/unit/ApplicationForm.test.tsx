import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock next-intl — useTranslations returns a function that returns the key
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/xaricde-tehsil/muraciet",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock createApplication server action
const mockCreateApplication = vi.fn();
vi.mock("@/lib/actions/applications", () => ({
  createApplication: (fd: FormData) => mockCreateApplication(fd),
}));

// Mock TurnstileWidget
vi.mock("@/components/sections/TurnstileWidget", () => ({
  TurnstileWidget: () => null,
}));

// Mock countries data
vi.mock("@/data/countries", () => ({
  countries: [{ slug: "turkiye", name: "Türkiyə" }],
}));

import { ApplicationForm } from "@/components/sections/ApplicationForm";

beforeEach(() => {
  mockCreateApplication.mockReset();
  mockPush.mockReset();
});

describe("ApplicationForm", () => {
  it("shows validation error when submitted empty", async () => {
    render(<ApplicationForm />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // The mock returns the key, so the error message comes from the zod schema
      expect(screen.getByText(/Ad ən az 2 simvol/i)).toBeInTheDocument();
    });
  });

  it("blocks submit and shows phone error with invalid phone", async () => {
    render(<ApplicationForm />);

    // Labels use t("name") which mock returns "name *" (with asterisk)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test İstifadəçi" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "bad-phone" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Düzgün telefon nömrəsi/i)).toBeInTheDocument();
    });
  });

  it("calls createApplication on valid submit and redirects", async () => {
    mockCreateApplication.mockResolvedValue({ success: true });
    render(<ApplicationForm />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Aytən Hüseynli" } });
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: "+994501234567" } });
    const countrySelect = screen.getByLabelText(/country/i);
    fireEvent.change(countrySelect, { target: { value: "turkiye" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateApplication).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("success=1"),
      );
    });
  });
});

