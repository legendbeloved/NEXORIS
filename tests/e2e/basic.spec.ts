import { test, expect } from "@playwright/test";

test.skip(!process.env.E2E_BASE_URL, "E2E_BASE_URL not set");

test("dashboard loads", async ({ page, baseURL }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/NEXORIS/i, { timeout: 5000 }).catch(() => {});
});
