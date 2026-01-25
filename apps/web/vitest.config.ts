import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "**/*.config.{js,ts}",
        "**/*.test.{ts,tsx}",
        "**/vitest.setup.ts",
        ".next/",
        "dist/",
        "build/",
      ],
    },
    ui: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/shared": path.resolve(__dirname, "./shared"),
      "@/entities": path.resolve(__dirname, "./entities"),
      "@/features": path.resolve(__dirname, "./features"),
      "@/widgets": path.resolve(__dirname, "./widgets"),
      "@/views": path.resolve(__dirname, "./views"),
    },
  },
});
