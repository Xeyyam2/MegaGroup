import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/lib/**",
        "src/app/**/actions.ts",
        "src/app/**/route.ts",
        "src/lib/validations/**",
      ],
      exclude: [
        "src/types/**",
        "src/data/**",
        "**/*.config.*",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 2,
        functions: 4,
        branches: 8,
        statements: 3,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
