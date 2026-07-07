import { test, expect } from "@playwright/test";

test("home page renders hero and key sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Xaricdə Təhsil/i })).toBeVisible();
  await expect(page.getByText("MegaGroup")).toBeVisible();
});

test("home page lists 5 countries", async ({ page }) => {
  await page.goto("/");
  const countryLinks = page.locator('a[href^="/xaricde-tehsil/turkiye"], a[href^="/xaricde-tehsil/rusiya"], a[href^="/xaricde-tehsil/ukrayna"], a[href^="/xaricde-tehsil/almaniya"], a[href^="/xaricde-tehsil/polsa"]');
  await expect(countryLinks.first()).toBeVisible();
});

test("cost calculator section is present", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Xərc Kalkulatoru/i)).toBeVisible();
});
