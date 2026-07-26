import { expect, test } from "@playwright/test";

test("quote mode remains available with its export proportions", async ({ page }) => {
  await page.goto("/social-studio");
  const card = page.getByTestId("social-post-card");
  await expect(card).toBeVisible();
  await page.getByRole("button", { name: /正方形.*1080.*1080/ }).click();
  await expect(card).toHaveCSS("height", "1080px");
  await page.getByPlaceholder("文字、作者或 ID").fill("city-1");
  await expect(page.getByText("city-1", { exact: false }).first()).toBeVisible();
});

test("quote previews retain the portrait and Threads export dimensions", async ({ page }) => {
  await page.goto("/social-studio/preview?type=quote&quote=city-1&format=portrait");
  await expect(page.getByTestId("social-post-card")).toHaveCSS("height", "1350px");
  await page.goto("/social-studio/preview?type=quote&quote=city-1&format=threads");
  const card = page.getByTestId("social-post-card");
  await expect(card).toHaveCSS("width", "1080px");
  await expect(card).toHaveCSS("height", "810px");
  await expect(card).toHaveClass(/social-post-card--threads/);
  await expect(page.getByRole("button")).toHaveCount(0);
});

test("mission mode filters, changes selection, renders every format, copies and downloads", async ({ page }) => {
  await page.goto("/social-studio");
  await page.getByRole("tab", { name: "今日任務" }).click();
  await expect(page.getByText("目前找到 20 則公開任務")).toBeVisible();
  await page.getByPlaceholder("任務名稱、內容或分類").fill("走一條");
  await expect(page.getByText("目前找到 1 則公開任務")).toBeVisible();
  await page.getByPlaceholder("任務名稱、內容或分類").fill("");
  await page.getByRole("button", { name: "探索", exact: true }).click();
  await expect(page.getByText("目前找到 3 則公開任務")).toBeVisible();
  await page.getByRole("button", { name: /走一條平常不會走的路.*探索.*10 分鐘/ }).click();
  const card = page.getByTestId("social-post-card");
  await expect(card).toContainText("走一條平常不會走的路");
  await expect(card).toContainText("完成條件");
  await page.getByRole("button", { name: /Instagram 直式/ }).click();
  await expect(card).toHaveCSS("height", "1350px");
  await page.getByRole("button", { name: /正方形/ }).click();
  await expect(card).toHaveCSS("height", "1080px");
  await page.getByRole("button", { name: /Threads 寬版/ }).click();
  await expect(card).toHaveCSS("height", "810px");
  await page.getByRole("button", { name: "換一個任務" }).click();
  await expect(card).not.toContainText("走一條平常不會走的路");
  await page.getByRole("button", { name: "複製貼文文案" }).click();
  await expect(page.getByRole("status")).toContainText(/文案已複製|無法使用剪貼簿/);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下載 PNG" }).click();
  await expect(await download).not.toBeNull();
});

test("custom mission is in-memory only, updates its caption, wraps long content, and never exposes fake private storage", async ({ page, context }) => {
  const fakePrivateValue = "PRIVATE_E2E_MISSION_DO_NOT_RENDER";
  await page.addInitScript((value) => {
    localStorage.setItem("lifeQuestMap:e2e-private", value);
    sessionStorage.setItem("lifeQuestMap:e2e-private", value);
  }, fakePrivateValue);
  const networkRequests: string[] = [];
  page.on("request", (request) => networkRequests.push(request.url()));
  await page.goto("/social-studio");
  await page.getByRole("tab", { name: "今日任務" }).click();
  await page.getByText("自訂本次任務").click();
  const title = "這是一個很長很長的公開任務名稱，仍然應該安全地留在卡片裡面";
  const condition = "這是一段很長的完成條件，用來確認任務卡片在 Threads 的小螢幕比例中仍會折行，而不會跑出卡片範圍。";
  await page.getByLabel("任務名稱").fill(title);
  await page.getByLabel("完成條件").fill(condition);
  const card = page.getByTestId("social-post-card");
  await expect(card).toContainText(title);
  await expect(card).toContainText(condition);
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3105" });
  await page.getByRole("button", { name: "複製貼文文案" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(title);
  await expect(page.locator("body")).not.toContainText(fakePrivateValue);
  await expect.poll(() => networkRequests.some((url) => /supabase|rest\/v1|auth\/v1/i.test(url))).toBe(false);
  await expect(page.evaluate(() => ({ local: localStorage.getItem("lifeQuestMap:e2e-private"), session: sessionStorage.getItem("lifeQuestMap:e2e-private") }))).resolves.toEqual({ local: fakePrivateValue, session: fakePrivateValue });
  await page.reload();
  await page.getByRole("tab", { name: "今日任務" }).click();
  await expect(page.getByTestId("social-post-card")).not.toContainText(title);
  await expect(page.getByTestId("social-post-card")).not.toContainText(condition);
});

test("mission preview is an isolated 1080 by 810 public card", async ({ page }) => {
  await page.goto("/social-studio/preview?type=mission&mission=daily-walk-1&format=threads");
  const card = page.getByTestId("social-post-card");
  await expect(card).toHaveCSS("width", "1080px");
  await expect(card).toHaveCSS("height", "810px");
  await expect(card).toContainText("今日任務");
  await expect(page.getByRole("button")).toHaveCount(0);
});
