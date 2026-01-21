// global-setup.ts
// Ensures environment variables are available to all test workers

export default function globalSetup() {
  // Capture environment variables from parent process
  const envVars = {
    BASE_URL: process.env.BASE_URL,
    LOGIN_PATH: process.env.LOGIN_PATH,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    LOGIN_USER: process.env.LOGIN_USER,
    LOGIN_PASS: process.env.LOGIN_PASS,
    LOGIN_SUCCESS_SELECTOR: process.env.LOGIN_SUCCESS_SELECTOR,
    START_URL: process.env.START_URL,
    LOGIN_SUCCESS_TEXT: process.env.LOGIN_SUCCESS_TEXT,
    create_test_BASE_URL: process.env.create_test_BASE_URL,
    create_test_LOGIN_USER: process.env.create_test_LOGIN_USER,
    create_test_LOGIN_PASS: process.env.create_test_LOGIN_PASS,
    create_test_LOGIN_SUCCESS_SELECTOR: process.env.create_test_LOGIN_SUCCESS_SELECTOR,
  };

  console.log("🌍 Global setup - Environment variables captured:");
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`  ${key}: ${value ? "✓" : "✗"}`);
    // Ensure they're set for child processes
    if (value) {
      process.env[key] = value;
    }
  });

  return Promise.resolve();
}
