import { defineConfig } from "@playwright/test";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

/**
 * =====================================================
 * ENV LOADING STRATEGY
 * =====================================================
 *
 * 1. Load `.env` (created from secrets in CI, or local file)
 * 2. Load `.env.run_test` (optional, replay-only)
 *
 * This works for both local and CI environments.
 */

/* ---------- Load .env file (always) ---------- */
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

/* ===================================================== */

export default defineConfig({
  testDir: "./tests",

  // Ensure workers inherit environment variables
  workers: 1,
  
  // Global setup to capture environment variables
  globalSetup: require.resolve("./global-setup"),

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
