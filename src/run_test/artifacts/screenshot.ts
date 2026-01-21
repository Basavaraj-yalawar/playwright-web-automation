// src/run_test/artifacts/screenshot.ts
import { Page } from "playwright";
import fs from "fs";
import path from "path";

export async function captureFailureScreenshot(
  page: Page,
  stepNumber: number
): Promise<string> {

  // 🔒 ABSOLUTE, EXPLICIT PATH — NO GUESSING
  const dir = path.resolve(
    process.cwd(),
    "src",
    "run_test",
    "artifacts",
    "run_test-artifacts"
  );

  console.log("📁 Ensuring screenshot directory:", dir);

  // 🔑 FORCE directory creation
  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `step-${stepNumber}-failure.png`);
  console.log("📸 Screenshot target:", filePath);

  // Ensure page is stable
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  // 🔥 HARD ASSERT — NO SILENT FAILURE
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `❌ Screenshot was NOT written to disk at ${filePath}`
    );
  }

  console.log("✅ Screenshot successfully saved:", filePath);
  return filePath;
}

export async function captureSuccessScreenshot(
  page: Page,
  stepNumber: number
): Promise<string> {

  const dir = path.resolve(
    process.cwd(),
    "src",
    "run_test",
    "artifacts",
    "run_test-artifacts"
  );

  console.log("📁 Ensuring screenshot directory:", dir);

  fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, `step-${stepNumber}-success.png`);
  console.log("📸 Screenshot target:", filePath);

  // Ensure page is stable
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({
    path: filePath,
    fullPage: true,
  });

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `❌ Screenshot was NOT written to disk at ${filePath}`
    );
  }

  console.log("✅ Success screenshot saved:", filePath);
  return filePath;
}
