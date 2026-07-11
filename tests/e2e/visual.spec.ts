import { test, expect } from "@playwright/test";

/**
 * Visual regression tests for key pages across all three locales.
 *
 * NOTE: Baseline screenshots are generated on first run. If the UI intentionally
 * changes, delete tests/e2e/-screenshots/ and re-run to regenerate baselines.
 * The maxDiffPixelRatio of 0.01 allows for minor anti-aliasing differences.
 */

const PAGES = [
  { name: "home-az", url: "/az" },
  { name: "home-ru", url: "/ru" },
  { name: "home-en", url: "/en" },
  { name: "apply-az", url: "/az/xaricde-tehsil/muraciet" },
];

for (const page of PAGES) {
  test(`${page.name} matches visual baseline`, async ({ page: browser }) => {
    await browser.goto(page.url);
    // Wait for content to settle (hero animations, etc.)
    await browser.waitForLoadState("networkidle");
    await expect(browser).toHaveScreenshot(`${page.name}.png`, {
      maxDiffPixelRatio: 0.01,
      fullPage: false,
    });
  });
}

test("country detail page matches visual baseline", async ({ page }) => {
  await page.goto("/az/xaricde-tehsil/turkiye");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("country-turkiye.png", {
    maxDiffPixelRatio: 0.01,
  });
});

test("university detail page matches visual baseline", async ({ page }) => {
  await page.goto("/az/xaricde-tehsil/turkiye/istanbul-universitesi");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("university-detail.png", {
    maxDiffPixelRatio: 0.01,
  });
});
