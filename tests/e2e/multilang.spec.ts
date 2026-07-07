import { test, expect } from "@playwright/test";

test("AZ homepage loads with hero", async ({ page }) => {
  await page.goto("/az");
  await expect(page.locator("section").first()).toBeVisible();
});

test("RU homepage loads and stays on /ru", async ({ page }) => {
  await page.goto("/ru");
  await expect(page).toHaveURL(/\/ru/);
});

test("EN homepage loads and stays on /en", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveURL(/\/en/);
});

test("language switcher changes locale", async ({ page }) => {
  await page.goto("/az");
  await page.getByRole("button", { name: /Dil seç|AZ/ }).first().click();
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/en/);
});

test("nav menu is centered on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/az");
  const nav = page.locator("nav").first();
  await nav.waitFor();
  const navBox = await nav.boundingBox();
  expect(navBox).not.toBeNull();
  const viewportCenter = 640;
  expect(Math.abs(navBox!.x + navBox!.width / 2 - viewportCenter)).toBeLessThan(150);
});