import { expect, test } from "@playwright/test";

for (const width of [1280, 390]) {
  test(`activity recommendations respect location, period and duration (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByTestId("continue-as-guest").click();
    await page.getByTestId("direct-experience").click();
    const filters = page.getByRole("region", { name: "推薦活動條件" });
    const card = page.getByTestId("recommended-adventure");
    await expect(filters.getByRole("group", { name: "活動地點" })).toBeVisible();
    await expect(filters.getByRole("group", { name: "活動時段" })).toBeVisible();
    await filters.getByRole("button", { name: "在家", exact: true }).click();
    await filters.getByRole("button", { name: "晚上", exact: true }).click();
    await filters.getByRole("button", { name: "5 分鐘", exact: true }).click();
    await expect(filters.getByRole("button", { name: "在家", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(filters.getByRole("button", { name: "晚上", exact: true })).toHaveAttribute("aria-pressed", "true");
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await expect(card.getByTestId("adventure-locations")).toContainText("在家");
      await expect(card.getByTestId("adventure-times-of-day")).toContainText(/不限時段|晚上/);
      await expect(card.getByTestId("adventure-duration")).toHaveText("約需 5 分鐘");
      await card.getByRole("button", { name: "換一個", exact: true }).click();
    }
    await filters.getByRole("button", { name: "戶外", exact: true }).click();
    await filters.getByRole("button", { name: "早上", exact: true }).click();
    await filters.getByRole("button", { name: "30 分鐘", exact: true }).click();
    await expect(card.getByTestId("adventure-locations")).toContainText("戶外");
    await expect(card.getByTestId("adventure-times-of-day")).toContainText(/不限時段|早上/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await filters.screenshot({ path: test.info().outputPath(`filters-${width}.png`), animations: "disabled" });
    const title = await card.getByRole("heading").innerText();
    await page.getByTestId("start-micro-adventure").click();
    await expect(filters.getByRole("button", { name: "在家", exact: true })).toBeDisabled();
    await expect(filters.getByRole("button", { name: "晚上", exact: true })).toBeDisabled();
    await page.reload();
    await expect(card.getByRole("heading")).toHaveText(title);
    await expect(page.getByTestId("complete-micro-adventure")).toBeVisible();
    await expect(filters.getByRole("button", { name: "在家", exact: true })).toBeDisabled();
    await page.getByTestId("complete-micro-adventure").click();
    await page.getByTestId("complete-only").click();
    await expect(card.getByRole("heading")).toHaveText(title);
    await expect(page.getByTestId("micro-adventure-status")).toContainText("今天已完成");
    await expect(filters.getByRole("button", { name: "在家", exact: true })).toBeEnabled();
    await expect(page.getByTestId("complete-micro-adventure")).toBeDisabled();
  });
}
