import { expect, test } from "@playwright/test";

test("core adventure journey", async ({ page }) => {
  await page.goto("/");
  await page.locator("input").first().fill("E2E Hero");
  await page.locator("form button[type=submit]").click();
  await expect(page.locator("nav").first()).toBeVisible();

  // Complete the displayed micro-adventure and record its outcome.
  await page.locator("section.relative button.bg-emerald-300").first().click();
  await page.locator('[role="dialog"] button').last().click();
  await page.goto("/history");
  await expect(page.locator("main")).toBeVisible();

  // Create and complete a normal quest.
  await page.goto("/quests");
  await page.locator("header button").first().click();
  await page.locator("form input").first().fill("E2E 任務");
  await page.locator("form button[type=submit]").click();
  await page.locator('[role="tab"]').last().click();
  const quest = page.locator("article").filter({ hasText: "E2E 任務" });
  await expect(quest).toBeVisible();
  await quest.locator("button").first().click();

  // Select a map point, save a custom location, and export the local backup.
  await page.goto("/map");
  await page.locator(".leaflet-container").click({ position: { x: 160, y: 160 } });
  const locationForm = page.locator("section").filter({ has: page.locator("input") }).last();
  await locationForm.locator("input").first().fill("E2E 探索點");
  await locationForm.locator("input").nth(1).fill("探索測試");
  await locationForm.locator("button.bg-emerald-600").click();
  await expect(locationForm).toBeHidden();

  await page.goto("/profile");
  const download = page.waitForEvent("download");
  await page.getByTestId("export-data").click();
  await expect(await download).toBeTruthy();
});
