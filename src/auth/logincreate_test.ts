import { chromium, Page } from "playwright";
import { LOGIN_SELECTORS } from "../config/selector";
import path from "path";
import fs from "fs";

// Manual .env parsing function
function loadEnvVars(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env");
  
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found");
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, "utf-8");
  const vars: Record<string, string> = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      vars[key.trim()] = value;
    }
  });
  
  return vars;
}

export async function loginForcreate_test(): Promise<Page> {
  // ✅ Load from environment variables (process.env or .env file)
  let create_test_BASE_URL = process.env.create_test_BASE_URL;
  let create_test_LOGIN_USER = process.env.create_test_LOGIN_USER || process.env.USERNAME;
  let create_test_LOGIN_PASS = process.env.create_test_LOGIN_PASS || process.env.PASSWORD;
  let create_test_LOGIN_SUCCESS_SELECTOR = process.env.create_test_LOGIN_SUCCESS_SELECTOR;

  // If any required var is missing from process.env, load from .env file
  if (!create_test_BASE_URL || !create_test_LOGIN_USER || !create_test_LOGIN_PASS || !create_test_LOGIN_SUCCESS_SELECTOR) {
    console.log("⚠️  Loading create_test credentials from .env file...");
    const envVars = loadEnvVars();
    create_test_BASE_URL = create_test_BASE_URL || envVars.create_test_BASE_URL;
    create_test_LOGIN_USER = create_test_LOGIN_USER || envVars.create_test_LOGIN_USER || envVars.USERNAME;
    create_test_LOGIN_PASS = create_test_LOGIN_PASS || envVars.create_test_LOGIN_PASS || envVars.PASSWORD;
    create_test_LOGIN_SUCCESS_SELECTOR = create_test_LOGIN_SUCCESS_SELECTOR || envVars.create_test_LOGIN_SUCCESS_SELECTOR || "h1";
  }

  console.log("🔍 create_test environment check:");
  console.log("  create_test_BASE_URL:", create_test_BASE_URL || "MISSING");
  console.log("  create_test_LOGIN_USER:", create_test_LOGIN_USER || "MISSING");
  console.log("  create_test_LOGIN_PASS:", create_test_LOGIN_PASS ? "***" : "MISSING");

  if (!create_test_BASE_URL || !create_test_LOGIN_USER || !create_test_LOGIN_PASS) {
    throw new Error(
      "❌ Missing required env vars for create_test: create_test_BASE_URL, create_test_LOGIN_USER, create_test_LOGIN_PASS"
    );
  }

  console.log("🚀 Launching headed browser for create_test");

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🌐 Navigating to login page...");
  await page.goto(create_test_BASE_URL, { waitUntil: "domcontentloaded" });

  console.log("✍️ Filling credentials...");
  await page.fill(LOGIN_SELECTORS.usernameInput, create_test_LOGIN_USER);
  await page.fill(LOGIN_SELECTORS.passwordInput, create_test_LOGIN_PASS);

  console.log("🔐 Submitting login...");
  await Promise.all([
    page.click(LOGIN_SELECTORS.submitButton),
    page.waitForLoadState("networkidle"),
  ]);

  console.log("🔎 Verifying login success...");
  await page.waitForSelector(create_test_LOGIN_SUCCESS_SELECTOR, {
    timeout: 15000,
    state: "visible",
  });

  console.log("✅ Login successful — returning page to create_tester");
  return page;
}
