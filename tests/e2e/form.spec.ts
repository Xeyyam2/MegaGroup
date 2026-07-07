import { test, expect } from "@playwright/test";

test("form shows validation errors when submitted empty", async ({ page }) => {
  await page.goto("/xaricde-tehsil/muraciet");
  await page.getByRole("button", { name: /Müraciət Et/i }).click();
  await expect(page.getByText(/Ad ən az 2 simvol/i)).toBeVisible();
});

test("form accepts valid input and shows success", async ({ page }) => {
  await page.goto("/xaricde-tehsil/muraciet");
  await page.getByLabel(/Ad Soyad/i).fill("Aytən Hüseynli");
  await page.getByLabel(/Telefon/i).fill("+994501234567");
  await page.getByLabel(/Maraqlandığınız ölkə/i).selectOption("turkiye");
  await page.getByRole("button", { name: /Müraciət Et/i }).click();
  await expect(page.getByText(/Müraciətiniz qeydə alındı/i)).toBeVisible();
});
