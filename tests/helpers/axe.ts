import { AxeBuilder } from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/**
 * Creates an AxeBuilder configured for WCAG 2.0 Level A and AA.
 * Use in E2E tests to assert no critical accessibility violations.
 */
export function axeBuilder(page: Page) {
  return new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]);
}
