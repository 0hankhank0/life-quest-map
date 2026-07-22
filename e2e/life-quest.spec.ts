import { expect, test } from "@playwright/test";

async function onboard(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.locator("input").first().fill("E2E Hero");
  await page.locator("form button[type=submit]").click();
  await expect(page.getByTestId("complete-micro-adventure")).toBeVisible();
}

async function waitForStoredState(page: import("@playwright/test").Page, predicate: (state: { profile?: unknown; adventureJournal?: unknown[] }) => boolean) {
  await expect.poll(async () => {
    const state = await page.evaluate(() => {
    const raw = window.localStorage.getItem("lifeQuestMap:v0.1");
    return raw ? JSON.parse(raw) as { profile?: unknown; adventureJournal?: unknown[] } : {};
    });
    return predicate(state);
  }).toBe(true);
}

test("micro-adventure can be completed without saving a journal entry", async ({ page }) => {
  await onboard(page);
  await page.getByTestId("complete-micro-adventure").click();
  const dialog = page.getByTestId("completion-feedback");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("#completion-feedback-title")).not.toBeEmpty();
  await expect(page.getByTestId("city-echo-text")).not.toBeEmpty();
  await page.getByTestId("complete-only").click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("complete-micro-adventure")).toBeDisabled();
  await waitForStoredState(page, (state) => Boolean(state.profile) && state.adventureJournal?.length === 0);
  await page.goto("/profile");
  await expect(page.getByRole("tabpanel").locator("article")).toHaveCount(0);
});

test("saved experience persists with its city echo snapshot", async ({ page }) => {
  await onboard(page);
  await page.getByTestId("complete-micro-adventure").click();
  const echo = await page.getByTestId("city-echo-text").innerText();
  const attributionLocator = page.getByTestId("city-echo-attribution");
  const attribution = await attributionLocator.count() ? await attributionLocator.textContent() : null;
  await page.getByRole("button", { name: "平靜" }).click();
  await page.getByTestId("completion-note").fill("E2E 留下的一點光。");
  await page.getByTestId("save-completion-experience").click();
  await waitForStoredState(page, (state) => state.adventureJournal?.some((entry) => entry.note === "E2E 留下的一點光。") === true);
  await page.goto("/profile");
  await expect(page.getByText("E2E 留下的一點光。", { exact: true })).toBeVisible();
  await expect(page.getByText("平靜", { exact: false })).toBeVisible();
  await expect(page.getByText(echo, { exact: false })).toBeVisible();
  if (attribution) await expect(page.getByText(attribution, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("E2E 留下的一點光。", { exact: true })).toBeVisible();
  await expect(page.getByText(echo, { exact: false })).toBeVisible();
  if (attribution) await expect(page.getByText(attribution, { exact: true })).toBeVisible();
});

test("mobile completion dialog stays usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await onboard(page);
  await page.getByTestId("complete-micro-adventure").click();
  const dialog = page.getByTestId("completion-feedback");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS("overflow-y", "auto");
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  const attribution = page.getByTestId("city-echo-attribution");
  if (await attribution.count()) {
    const attributionBox = await attribution.boundingBox();
    expect(attributionBox).not.toBeNull();
    expect(attributionBox!.x + attributionBox!.width).toBeLessThanOrEqual(390);
  }
  await page.getByTestId("complete-only").click();
  await expect(dialog).toBeHidden();
});
