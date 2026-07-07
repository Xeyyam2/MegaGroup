import { test, expect } from "@playwright/test";

test("admin redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("login page renders form", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: /MegaGroup CMS/ })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Parol")).toBeVisible();
});