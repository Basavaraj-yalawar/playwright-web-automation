import { chromium, Page } from "playwright";
import { LOGIN_SELECTORS } from "../config/selector";
import path from "path";
import fs from "fs";

// Manual .env parsing function
function loadEnvVars(): Record<string, string> {
  const envPath = path.resolve(process.cwd(), ".env");
  console.log("🔍 Loading .env from:", envPath);
  
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env file not found");
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, "utf-8");
  console.log("📄 .env file loaded, size:", envContent.length, "bytes");
  console.log("📄 .env file content:\n", envContent);
  
  const vars: Record<string, string> = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      vars[key.trim()] = value;
      console.log(`  ${key.trim()} = "${value}"`);
    }
  });
  
  console.log("✅ Parsed variables:", Object.keys(vars));
  return vars;
}

export async function loginForrun_test(): Promise<Page> {
  // Load environment variables directly
  const envVars = loadEnvVars();
  
  const BASE_URL = envVars.BASE_URL || process.env.BASE_URL;
  const LOGIN_PATH = envVars.LOGIN_PATH || process.env.LOGIN_PATH;
  const USERNAME = envVars.USERNAME || process.env.USERNAME;
  const PASSWORD = envVars.PASSWORD || process.env.PASSWORD;

  console.log("🔍 Environment check:");
  console.log("  BASE_URL:", BASE_URL || "MISSING");
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
