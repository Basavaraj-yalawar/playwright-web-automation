import { defineConfig } from "@playwright/test";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

/**
 * =====================================================
 * ENV LOADING STRATEGY
 * =====================================================
 *
 * 1. CI env vars take priority (already in process.env)
 * 2. Load `.env` for local development
 * 3. Load `.env.run_test` (optional, replay-only)
 *
 * This DOES NOT break create_test.
 * This ENABLES replay locally & in CI.
 */

/* ---------- Only load .env files if NOT in CI ---------- */
if (process.env.CI !== "true") {
  /* ---------- create_test env (existing, unchanged) ---------- */
  dotenv.config({
    path: path.resolve(__dirname, ".env"),
    override: false,
  });

  /* ---------- run_test env (optional, replay-only) ---------- */
  const runTestEnvPath = path.resolve(__dirname, ".env.run_test");
  if (fs.existsSync(runTestEnvPath)) {
    dotenv.config({
      path: runTestEnvPath,
      override: false,
    });
  }
}

/* ===================================================== */

export default defineConfig({
  testDir: "./tests",

  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  use: {
    headless: true, // CI-safe, default
    viewport: { width: 1280, height: 800 },
    launchOptions: {
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  },
});
