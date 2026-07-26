import { expect, test } from "@playwright/test";

test("format controls have one clear selected state and resize the preview", async ({ page }) => {
  await page.goto("/social-studio");
  const portrait = page.getByRole("button", { name: /Instagram 直式/ });
  const square = page.getByRole("button", { name: /正方形/ });
  const threads = page.getByRole("button", { name: /Threads 寬版/ });

  await expect(portrait).toHaveAttribute("aria-pressed", "true");
  await expect(square).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("social-post-stage")).toHaveCSS("aspect-ratio", "4 / 5");

  await square.click();
  await expect(square).toHaveAttribute("aria-pressed", "true");
  await expect(portrait).toHaveAttribute("aria-pressed", "false");
  await expect(threads).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("social-post-stage")).toHaveCSS("aspect-ratio", "1 / 1");
});

test("keyboard controls and tabs update real content", async ({ page }) => {
  await page.goto("/social-studio");
  await page.getByRole("button", { name: /Instagram 直式/ }).focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: /正方形/ })).toHaveAttribute("aria-pressed", "true");

  const missionTab = page.getByRole("tab", { name: "今日任務" });
  await missionTab.click();
  await expect(missionTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("任務", { exact: true })).toBeVisible();
  await expect(page.getByTestId("social-post-card")).toHaveAttribute("aria-label", "Life Quest Map 任務圖卡");
});

test("Threads export uses 1080 by 810 canvas and a format-specific filename", async ({ page }) => {
  await page.addInitScript(() => {
    const original = document.createElement.bind(document);
    document.createElement = ((tagName: string, options?: ElementCreationOptions) => {
      const element = original(tagName, options);
      if (tagName.toLowerCase() === "canvas") {
        const canvas = element as HTMLCanvasElement;
        let width = 0; let height = 0;
        Object.defineProperty(canvas, "width", { configurable: true, get: () => width, set: (value) => { width = Number(value); (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas = [width, height]; } });
        Object.defineProperty(canvas, "height", { configurable: true, get: () => height, set: (value) => { height = Number(value); (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas = [width, height]; } });
      }
      return element;
    }) as typeof document.createElement;
  });
  await page.goto("/social-studio");
  await page.getByRole("button", { name: /Threads 寬版/ }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "下載 PNG" }).click();
  expect((await download).suggestedFilename()).toBe("life-quest-quote-threads-wide.png");
  await expect.poll(() => page.evaluate(() => (window as Window & { __socialCanvas?: [number, number] }).__socialCanvas)).toEqual([1080, 810]);
});

test("format controls are not obscured by a transparent overlay", async ({ page }) => {
  await page.goto("/social-studio");
  const button = page.getByRole("button", { name: /Threads 寬版/ });
  await button.scrollIntoViewIfNeeded();
  const point = await button.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const top = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return top === element || Boolean(top?.closest("button") === element);
  });
  expect(point).toBe(true);
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
});
