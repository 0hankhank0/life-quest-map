import { expect, test } from "@playwright/test";

async function onboard(page: import("@playwright/test").Page, name = "E2E Hero") {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByTestId("continue-as-guest").click();
  await page.locator("input").first().fill(name);
  await page.locator("form button[type=submit]").click();
  await expect(page.getByTestId("beginner-guide")).toBeVisible();
  await page.getByTestId("beginner-guide-skip").click();
  await expect(page.getByTestId("complete-micro-adventure")).toBeVisible();
}

async function waitForStoredState(page: import("@playwright/test").Page, predicate: (state: { profile?: unknown; adventureJournal?: unknown[]; userSettings?: { tutorialCompletedAt?: string | null } }) => boolean) {
  await expect.poll(async () => page.evaluate(() => {
    const raw = window.localStorage.getItem("lifeQuestMap:v0.1");
    return raw ? JSON.parse(raw) as { profile?: unknown; adventureJournal?: unknown[]; userSettings?: { tutorialCompletedAt?: string | null } } : {};
  }).then(predicate)).toBe(true);
}

test("new users complete the five-step beginner guide and keep its state", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByTestId("continue-as-guest").click();
  await page.locator("input").first().fill("Guide Hero");
  await page.getByRole("button", { name: "運動玩家" }).click();
  await page.locator("form button[type=submit]").click();
  const guide = page.getByTestId("beginner-guide");
  await expect(guide).toBeVisible();
  await expect(page.getByTestId("beginner-guide-step")).toHaveText("1 / 5");
  for (let step = 2; step <= 5; step += 1) {
    await page.getByTestId("beginner-guide-next").click();
    await expect(page.getByTestId("beginner-guide-step")).toHaveText(`${step} / 5`);
  }
  await page.getByTestId("beginner-guide-start").click();
  await expect(guide).toBeHidden();
  await expect(page.getByTestId("recommended-adventure")).toBeVisible();
  await waitForStoredState(page, (state) => typeof state.userSettings?.tutorialCompletedAt === "string");
  await page.reload();
  await expect(guide).toBeHidden();
});

test("guest can return to the auth entry and resume the same local adventure", async ({ page }) => {
  await onboard(page, "Persistent Hero");
  const originalAdventure = await page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1") ?? "{}"));
  await page.goto("/profile");
  await page.getByTestId("exit-guest-mode").click();
  await expect(page.getByTestId("continue-as-guest")).toBeVisible();
  await page.getByTestId("continue-as-guest").click();
  await expect(page.getByRole("heading", { name: "Persistent Hero" })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1") ?? "{}"))).toEqual(originalAdventure);
});

test("profile can restart the guide without clearing adventure data", async ({ page }) => {
  await onboard(page);
  await page.getByTestId("complete-micro-adventure").click();
  await page.getByTestId("complete-only").click();
  await page.goto("/profile");
  await page.getByRole("button", { name: "重新觀看新手教學" }).click();
  await expect(page.getByTestId("beginner-guide")).toBeVisible();
  await waitForStoredState(page, (state) => state.userSettings?.tutorialCompletedAt === null);
  const questCount = await page.evaluate(() => (JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1") ?? "{}").quests ?? []).length);
  expect(questCount).toBeGreaterThan(0);
});

test("mobile beginner guide stays inside the viewport and can be completed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.getByTestId("continue-as-guest").click();
  await page.locator("input").first().fill("Mobile Guide");
  await page.locator("form button[type=submit]").click();
  const guide = page.getByTestId("beginner-guide");
  await expect(guide).toBeVisible();
  await expect(guide).toHaveCSS("overflow-y", "auto");
  const box = await guide.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  for (let step = 0; step < 4; step += 1) await page.getByTestId("beginner-guide-next").click();
  await page.getByTestId("beginner-guide-start").click();
  await expect(page.getByTestId("complete-micro-adventure")).toBeVisible();
});

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
