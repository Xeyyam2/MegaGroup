import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Auto-cleanup DOM between tests to prevent duplicate element errors.
afterEach(() => {
  cleanup();
});

