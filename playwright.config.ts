import { defineConfig, devices } from "@playwright/test";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// .env.local 을 수동으로 읽어 process.env 에 주입 (dotenv 없이)
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=][^=]*)=(.*)/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
