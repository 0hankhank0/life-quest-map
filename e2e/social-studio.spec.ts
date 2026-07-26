import { expect, test } from "@playwright/test";

test("quote mode retains every export proportion and can download PNG", async ({ page }) => {
  await page.goto("/social-studio");

  const card = page.getByTestId("social-post-card");
  await expect(card).toBeVisible();

  await page.getByRole("button", { name: /1080.*1080/ }).click();
  await expect(card).toHaveCSS("height", "1080px");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /PNG/ }).click();
  await expect(await download).not.toBeNull();
});

test("quote previews retain the portrait, square, and Threads dimensions", async ({ page }) => {
  const dimensions = [
    ["portrait", "1080px", "1350px"],
    ["square", "1080px", "1080px"],
    ["threads", "1080px", "810px"],
  ] as const;

  for (const [format, width, height] of dimensions) {
    await page.goto(`/social-studio/preview?type=quote&quote=city-1&format=${format}`);
    const card = page.getByTestId("social-post-card");
    await expect(card).toHaveCSS("width", width);
    await expect(card).toHaveCSS("height", height);
    await expect(page.getByRole("button")).toHaveCount(0);
  }
});

test("mission mode changes format, copies, previews, and downloads", async ({ page, context }) => {
  await page.goto("/social-studio");
  await page.getByRole("tab").nth(1).click();

  const card = page.getByTestId("social-post-card");
  await expect(card).toBeVisible();

  await page.getByRole("button", { name: /1080.*1350/ }).click();
  await expect(card).toHaveCSS("height", "1350px");
  await page.getByRole("button", { name: /1080.*1080/ }).click();
  await expect(card).toHaveCSS("height", "1080px");
  await page.getByRole("button", { name: /1080.*810/ }).click();
  await expect(card).toHaveCSS("height", "810px");

  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3105" });
  await page.getByRole("button", { name: /複製/ }).click();
  await expect(page.getByRole("status")).toBeVisible();

  const preview = page.waitForEvent("popup");
  await page.getByRole("link", { name: /預覽/ }).click();
  await expect(await preview).not.toBeNull();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /PNG/ }).click();
  await expect(await download).not.toBeNull();
});

test("custom missions remain in memory and do not expose private browser storage", async ({ page, context }) => {
  const fakePrivateValue = "PRIVATE_E2E_MISSION_DO_NOT_RENDER";
  await page.addInitScript((value) => {
    localStorage.setItem("lifeQuestMap:e2e-private", value);
    sessionStorage.setItem("lifeQuestMap:e2e-private", value);
  }, fakePrivateValue);

  const networkRequests: string[] = [];
  page.on("request", (request) => networkRequests.push(request.url()));
  await page.goto("/social-studio");
  await page.getByRole("tab").nth(1).click();
  await page.getByText("自訂本次任務", { exact: true }).click();

  const title = "E2E 自訂任務：在城市邊界完成一段足夠長的步行探索";
  const objective = "完成一段可實際執行的城市探索目標";
  const condition = "完成兩條不同路線，並在回家前記錄一項可執行的下一步。";
  await page.getByLabel(/RPG/).fill(title);
  await page.getByLabel(/目標/).fill(objective);
  await page.getByLabel(/完成/).fill(condition);

  const card = page.getByTestId("social-post-card");
  await expect(card).toContainText(title);
  await expect(card).toContainText(objective);
  await expect(card).toContainText(condition);

  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3105" });
  await page.getByRole("button", { name: /複製/ }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(title);

  await expect(page.locator("body")).not.toContainText(fakePrivateValue);
  await expect.poll(() => networkRequests.some((url) => /supabase|rest\/v1|auth\/v1/i.test(url))).toBe(false);
  await expect(page.evaluate(() => ({
    local: localStorage.getItem("lifeQuestMap:e2e-private"),
    session: sessionStorage.getItem("lifeQuestMap:e2e-private"),
  }))).resolves.toEqual({ local: fakePrivateValue, session: fakePrivateValue });

  await page.reload();
  await page.getByRole("tab").nth(1).click();
  await expect(page.getByTestId("social-post-card")).not.toContainText(title);
  await expect(page.getByTestId("social-post-card")).not.toContainText(condition);
});

test("mission preview is an isolated public 1080 by 810 card", async ({ page }) => {
  await page.goto("/social-studio/preview?type=mission&mission=daily-walk-1&format=threads");

  const card = page.getByTestId("social-post-card");
  await expect(card).toHaveCSS("width", "1080px");
  await expect(card).toHaveCSS("height", "810px");
  await expect(page.getByRole("button")).toHaveCount(0);
});
