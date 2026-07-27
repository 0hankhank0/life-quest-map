import { expect, test } from "@playwright/test";

test("Threads quote export downloads a native 1080 by 810 PNG", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });

  await page.goto("/social-studio");
  await page.getByRole("button", { name: /Threads/ }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /PNG/ }).click();
  const png = await download;

  expect(png.suggestedFilename()).toBe("life-quest-quote-threads-wide.png");
  await png.saveAs("social-exports/threads-export-verification.png");
  expect(browserErrors).not.toContainEqual(expect.stringContaining("語錄 PNG 匯出失敗"));
});
