import { expect, test } from "@playwright/test";

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test(`direct experience can defer settings and preserve rewards when filling them (${viewport.width}px)`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
    await page.getByTestId("continue-as-guest").click();
    const directButton = page.getByTestId("direct-experience");
    await expect(directButton).toBeVisible();
    const box = await directButton.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    await page.screenshot({ path: test.info().outputPath(`onboarding-${viewport.width}.png`), fullPage: true });
    await directButton.click();
    await expect(page.getByTestId("start-micro-adventure")).toBeVisible();
    await expect(page.getByTestId("beginner-guide")).toHaveCount(0);
    await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1")!).userSettings.tutorialDeferred)).toBe(true);
    await page.reload();
    await expect(page.getByTestId("start-micro-adventure")).toBeVisible();
    await expect(page.getByTestId("beginner-guide")).toHaveCount(0);
    await expect(page.getByText("和你的成長方向有關", { exact: true })).toHaveCount(0);

    await page.getByTestId("start-micro-adventure").click();
    await page.getByTestId("complete-micro-adventure").click();
    await page.getByTestId("completion-note").fill("直接體驗留下的紀錄");
    await page.getByTestId("save-completion-experience").click();
    await page.goto("/profile");
    await expect(page.getByTestId("edit-profile-setup")).toHaveText("補填角色設定");
    await expect(page.getByText("直接體驗留下的紀錄", { exact: true })).toBeVisible();
    const before = await page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1")!));
    expect(before.profile.exp).toBeGreaterThan(0);

    await page.getByTestId("edit-profile-setup").click();
    await page.getByLabel("角色名稱").fill("尚未儲存");
    await page.getByRole("button", { name: "稍後再填", exact: true }).click();
    await expect(page.getByRole("heading", { name: "冒險者", exact: true })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`profile-${viewport.width}.png`), fullPage: true });
    await page.getByTestId("edit-profile-setup").click();
    await page.getByLabel("角色名稱").fill("我的探索角色");
    await page.getByRole("button", { name: /^學生階段/ }).click();
    await page.getByRole("button", { name: /^創作者/ }).click();
    await page.getByRole("button", { name: "儲存角色設定", exact: true }).click();
    await expect(page.getByTestId("edit-profile-setup")).toHaveText("編輯角色設定");
    await expect(page.getByRole("heading", { name: "我的探索角色", exact: true })).toBeVisible();
    await expect.poll(async () => page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1")!).profile.name)).toBe("我的探索角色");
    const after = await page.evaluate(() => JSON.parse(window.localStorage.getItem("lifeQuestMap:v0.1")!));
    expect(after.profile).toMatchObject({ id: before.profile.id, exp: before.profile.exp, level: before.profile.level, createdAt: before.profile.createdAt, lifeStage: "student", role: "creator", setupCompletedAt: expect.any(String) });
    expect({ ...after, profile: before.profile }).toEqual(before);
    await page.reload();
    await expect(page.getByRole("heading", { name: "我的探索角色", exact: true })).toBeVisible();
    await expect(page.getByTestId("beginner-guide")).toHaveCount(0);
    await page.getByRole("button", { name: "重新觀看新手教學" }).click();
    await expect(page.getByTestId("beginner-guide")).toBeVisible();
    await page.getByTestId("beginner-guide-skip").click();
    await expect(page.getByTestId("beginner-guide")).toHaveCount(0);
  });
}

