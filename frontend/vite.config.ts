/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // Pinned to a non-UTC zone so local-vs-UTC date bugs fail in CI (which
    // runs in UTC) instead of only on a developer's machine in the evening.
    env: { TZ: "America/New_York" },
    setupFiles: "./src/test/setup.ts",
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "e2e/**",
        "playwright.config.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/**",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
