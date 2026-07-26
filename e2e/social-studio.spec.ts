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
  const dimensions = [["portrait", "1080px", "1350px"], ["square", "1080px", "1080px"], ["threads", "1080px", "810px"]] as const;
  for (const [format, width, height] of dimensions) {
    await page.goto(`/social-studio/preview?type=quote&quote=city-1&format=${format}`);
    const card = page.getByTestId("social-post-card");
    await expect(card).toHaveCSS("width", width); await expect(card).toHaveCSS("height", height);
    await expect(page.getByRole("button")).toHaveCount(0);
  }
});

test("mission mode changes format, copies, previews, and downloads", async ({ page, context }) => {
  await page.goto("/social-studio"); await page.getByRole("tab").nth(1).click();
  const card = page.getByTestId("social-post-card"); await expect(card).toBeVisible();
  await page.getByRole("button", { name: /1080.*1350/ }).click(); await expect(card).toHaveCSS("height", "1350px");
  await page.getByRole("button", { name: /1080.*1080/ }).click(); await expect(card).toHaveCSS("height", "1080px");
  await page.getByRole("button", { name: /1080.*810/ }).click(); await expect(card).toHaveCSS("height", "810px");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3105" });
  await page.getByRole("button", { name: /複製/ }).click(); await expect(page.getByRole("status")).toBeVisible();
  const preview = page.waitForEvent("popup"); await page.getByRole("link", { name: /預覽/ }).click(); await expect(await preview).not.toBeNull();
  const download = page.waitForEvent("download"); await page.getByRole("button", { name: /PNG/ }).click(); await expect(await download).not.toBeNull();
});

test("custom missions remain in memory and do not expose private browser storage", async ({ page, context }) => {
  const fakePrivateValue = "PRIVATE_E2E_MISSION_DO_NOT_RENDER";
  await page.addInitScript((value) => { localStorage.setItem("lifeQuestMap:e2e-private", value); sessionStorage.setItem("lifeQuestMap:e2e-private", value); }, fakePrivateValue);
  const networkRequests: string[] = []; page.on("request", (request) => networkRequests.push(request.url()));
  await page.goto("/social-studio"); await page.getByRole("tab").nth(1).click(); await page.getByText("自訂本次任務", { exact: true }).click();
  const title = "E2E 自訂任務：在城市邊界完成一段足夠長的步行探索";
  const objective = "完成一段可實際執行的城市探索目標";
  const condition = "完成兩條不同路線，並在回家前記錄一項可執行的下一步。";
  await page.getByLabel(/RPG/).fill(title); await page.getByLabel(/目標/).fill(objective); await page.getByLabel(/完成/).fill(condition);
  const card = page.getByTestId("social-post-card"); await expect(card).toContainText(title); await expect(card).toContainText(objective); await expect(card).toContainText(condition);
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:3105" }); await page.getByRole("button", { name: /複製/ }).click(); await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(title);
  await expect(page.locator("body")).not.toContainText(fakePrivateValue); await expect.poll(() => networkRequests.some((url) => /supabase|rest\/v1|auth\/v1/i.test(url))).toBe(false);
  await expect(page.evaluate(() => ({ local: localStorage.getItem("lifeQuestMap:e2e-private"), session: sessionStorage.getItem("lifeQuestMap:e2e-private") }))).resolves.toEqual({ local: fakePrivateValue, session: fakePrivateValue });
  await page.reload(); await page.getByRole("tab").nth(1).click(); await expect(page.getByTestId("social-post-card")).not.toContainText(title); await expect(page.getByTestId("social-post-card")).not.toContainText(condition);
});

test("mission preview is an isolated public 1080 by 810 card", async ({ page }) => {
  await page.goto("/social-studio/preview?type=mission&mission=daily-walk-1&format=threads");
  const card = page.getByTestId("social-post-card"); await expect(card).toHaveCSS("width", "1080px"); await expect(card).toHaveCSS("height", "810px"); await expect(page.getByRole("button")).toHaveCount(0);
});

test("format controls have one clear selected state and resize the preview", async ({ page }) => {
  await page.goto("/social-studio"); const portrait = page.getByRole("button", { name: /Instagram 直式/ }); const square = page.getByRole("button", { name: /正方形/ }); const threads = page.getByRole("button", { name: /Threads 寬版/ });
  await expect(portrait).toHaveAttribute("aria-pressed", "true"); await expect(square).toHaveAttribute("aria-pressed", "false"); await expect(threads).toHaveAttribute("aria-pressed", "false"); await expect(page.getByTestId("social-post-stage")).toHaveCSS("aspect-ratio", "4 / 5");
  await square.click(); await expect(square).toHaveAttribute("aria-pressed", "true"); await expect(portrait).toHaveAttribute("aria-pressed", "false"); await expect(threads).toHaveAttribute("aria-pressed", "false"); await expect(page.getByTestId("social-post-stage")).toHaveCSS("aspect-ratio", "1 / 1");
});

test("keyboard controls and tabs update real content", async ({ page }) => {
  await page.goto("/social-studio"); await page.getByRole("button", { name: /Instagram 直式/ }).focus(); await page.keyboard.press("Tab"); await page.keyboard.press("Enter"); await expect(page.getByRole("button", { name: /正方形/ })).toHaveAttribute("aria-pressed", "true");
  const missionTab = page.getByRole("tab", { name: "今日任務" }); await missionTab.click(); await expect(missionTab).toHaveAttribute("aria-selected", "true"); await expect(page.getByLabel("搜尋公開任務")).toBeVisible();
});

test("Threads export uses 1080 by 810 canvas and a format-specific filename", async ({ page }) => {
  await page.addInitScript(() => { const original = document.createElement.bind(document); document.createElement = ((tagName: string, options?: ElementCreationOptions) => { const element = original(tagName, options); if (tagName.toLowerCase() === "canvas") { const canvas = element as HTMLCanvasElement; let width = 0; let height = 0; Object.defineProperty(canvas, "width", { configurable: true, get: () => width, set: (value) => { width = Number(value); (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas = [width, height]; } }); Object.defineProperty(canvas, "height", { configurable: true, get: () => height, set: (value) => { height = Number(value); (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas = [width, height]; } }); } return element; }) as typeof document.createElement; });
  await page.goto("/social-studio"); await page.getByRole("button", { name: /Threads 寬版/ }).click(); const download = page.waitForEvent("download"); await page.getByRole("button", { name: "下載 PNG" }).click(); expect((await download).suggestedFilename()).toBe("life-quest-quote-threads-wide.png"); await expect.poll(() => page.evaluate(() => (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas)).toEqual([1080, 810]);
});

test("format controls are not obscured by a transparent overlay", async ({ page }) => {
  await page.goto("/social-studio"); const button = page.getByRole("button", { name: /Threads 寬版/ }); await button.scrollIntoViewIfNeeded(); const point = await button.evaluate((element) => { const rect = element.getBoundingClientRect(); const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2); return top === element || Boolean(top?.closest("button") === element); }); expect(point).toBe(true); await button.click(); await expect(button).toHaveAttribute("aria-pressed", "true");
});

test("scaled preview fits its container on desktop and mobile for every format", async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport); await page.goto("/social-studio");
    for (const label of ["Instagram 直式", "正方形", "Threads 寬版"]) {
      await page.getByRole("button", { name: label }).click();
      const bounds = await page.getByTestId("social-post-card").evaluate((card) => {
        const stage = card.closest(".social-post-stage")?.getBoundingClientRect(); const rect = card.getBoundingClientRect();
        return { cardWidth: rect.width, cardHeight: rect.height, stageWidth: stage?.width ?? 0, stageHeight: stage?.height ?? 0 };
      });
      expect(bounds.cardWidth).toBeLessThanOrEqual(bounds.stageWidth + 1);
      expect(bounds.cardHeight).toBeLessThanOrEqual(bounds.stageHeight + 1);
    }
  }
});

test("custom quote updates the card, source, export, and does not persist", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("social-private", "DO_NOT_RENDER"); sessionStorage.setItem("social-private", "DO_NOT_RENDER"); });
  await page.goto("/social-studio"); await page.getByRole("button", { name: "自訂語錄" }).click();
  await page.getByLabel("語錄正文").fill("自訂的遠方會在下一步出現。"); await page.getByLabel("說話者／作者").fill("測試作者"); await page.getByLabel("作品／出處").fill("測試作品");
  const card = page.getByTestId("social-post-card"); await expect(card).toContainText("自訂的遠方會在下一步出現。"); await expect(card).toContainText("—— 測試作者，《測試作品》");
  await expect(page.getByRole("link", { name: /預覽/ })).toHaveCount(0); await expect(page.getByText("自訂語錄僅保留於目前頁面，可直接下載 PNG。")).toBeVisible();
  await page.getByRole("button", { name: /Threads 寬版/ }).click(); const download = page.waitForEvent("download"); await page.getByRole("button", { name: "下載 PNG" }).click(); expect((await download).suggestedFilename()).toBe("life-quest-custom-quote-threads-wide.png");
  await expect(page.locator("body")).not.toContainText("DO_NOT_RENDER"); await page.reload(); await expect(page.getByRole("button", { name: "語錄庫" })).toHaveAttribute("aria-pressed", "true"); await expect(page.getByTestId("social-post-card")).not.toContainText("自訂的遠方會在下一步出現。");
});

test("custom quote without attribution leaves no empty source punctuation", async ({ page }) => {
  await page.goto("/social-studio"); await page.getByRole("button", { name: "自訂語錄" }).click(); await page.getByLabel("語錄正文").fill("只留下正文。 ");
  await expect(page.getByTestId("social-post-card")).toContainText("只留下正文。"); await expect(page.getByTestId("social-post-card")).not.toContainText("undefined"); await expect(page.getByTestId("social-post-card")).not.toContainText("——");
  await page.getByRole("button", { name: "語錄庫" }).first().click(); await expect(page.getByRole("link", { name: /預覽/ })).toBeVisible();
});
