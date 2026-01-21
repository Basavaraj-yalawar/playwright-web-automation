import { test } from "@playwright/test";
import { runrun_test } from "../src/run_test/run_test";

test("run_test replay verification", async () => {
  // Debug: Log environment variables available in test context
  console.log("🔍 Environment variables in test worker:");
  console.log("  BASE_URL:", process.env.BASE_URL ? "✓" : "✗");
  console.log("  LOGIN_PATH:", process.env.LOGIN_PATH ? "✓" : "✗");
  console.log("  USERNAME:", process.env.USERNAME ? "✓" : "✗");
  console.log("  PASSWORD:", process.env.PASSWORD ? "✓" : "✗");
  
  // run_test controls its own lifecycle
  // including login, navigation, verification, report generation
  await runrun_test();
});
