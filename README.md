# Life Quest Map v0.2

## Authentication

Google/Facebook sign-in is optional. See [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) for Supabase environment variables and OAuth redirect setup. Without those variables, users can continue in local guest mode.

一個以深色 emerald RPG 視覺呈現的個人生活任務、微冒險與探索地圖工具。

## 功能

- 路由式首頁、任務、地圖、技能、歷史與個人檔案
- 微冒險推薦、任務規劃、EXP／技能／成就與連續完成紀錄
- Leaflet 探索地圖、自訂地點、主動定位與距離提示
- JSON 本機匯出／匯入、PWA App shell、離線狀態提示

## 架構

Next.js App Router + React + TypeScript + Tailwind CSS。互動狀態由 `LifeQuestProvider` 管理，資料只存於瀏覽器 LocalStorage；地圖使用 Leaflet 與 OpenStreetMap。

## 資料隱私

可選用 Google 或 Facebook 進行身分驗證；遊戲資料不會同步到後端，仍只存於瀏覽器 LocalStorage。沒有分析追蹤或伺服器資料庫。定位只在使用者點擊後取得，僅保留於當次頁面記憶體，不會保存或背景追蹤。請定期使用個人檔案頁的匯出功能備份 JSON。

## 開發與測試

```bash
npm install
npm run dev
npm run validate-data
npm test -- --run
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## v1 到 v0.2 資料遷移

應用程式維持 `lifeQuestMap:v0.1` LocalStorage key，啟動與匯入時會以欄位為單位正規化舊資料。缺少的新欄位會補安全預設值，已存在的有效任務、角色、完成紀錄、偏好與自訂地點會被保留；無效的單一欄位不會使整份資料失效。

## 專案截圖

_在此放置首頁、任務、公會地圖與個人檔案截圖。_
