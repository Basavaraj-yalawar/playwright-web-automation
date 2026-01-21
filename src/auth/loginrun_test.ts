import { chromium, Page } from "playwright";
import { LOGIN_SELECTORS } from "../config/selector";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables at the module level - use process.cwd() for reliable path
const envPath = path.resolve(process.cwd(), ".env");
console.log("🔍 Attempting to load .env from:", envPath);
console.log("🔍 .env file exists:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

export async function loginForrun_test(): Promise<Page> {
  const {
    BASE_URL,
    LOGIN_PATH,
    USERNAME,
    PASSWORD,
  } = process.env;

  console.log("🔍 Environment check:");
  console.log("  BASE_URL:", BASE_URL ? `${BASE_URL.substring(0, 20)}...` : "MISSING");
  console.log("  LOGIN_PATH:", LOGIN_PATH || "MISSING");
  console.log("  USERNAME:", USERNAME || "MISSING");
  console.log("  PASSWORD:", PASSWORD ? "***" : "MISSING");

  if (!BASE_URL || !LOGIN_PATH || !USERNAME || !PASSWORD) {
    throw new Error(
      "Missing env vars: BASE_URL, LOGIN_PATH, USERNAME, PASSWORD"
    );
  }

  console.log("🔑 Starting run_test login...");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // ✅ FIX: more robust navigation for CI / headless
  await page.goto(`${BASE_URL}${LOGIN_PATH}`, {
    waitUntil: "load",
    timeout: 60_000,
  });

  await page.fill(LOGIN_SELECTORS.usernameInput, USERNAME);
  await page.fill(LOGIN_SELECTORS.passwordInput, PASSWORD);

  await Promise.all([
    page.click(LOGIN_SELECTORS.submitButton),
    page.waitForLoadState("networkidle"),
  ]);

  console.log("✅ run_test login successful");
  return page;
}
