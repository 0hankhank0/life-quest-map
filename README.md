# Life Quest Map

以任務、微冒險、技能樹與地圖探索，將日常累積成可看見的生活冒險。

## 登入與資料

- 未設定 Supabase／OAuth 時仍可使用訪客模式；訪客資料只保存在此裝置的瀏覽器。
- 套用所有 `supabase/migrations` 後，登入帳號可使用帳號專屬的雲端存檔與本機離線快取。
- 首次登入時可選擇匯入這台裝置的訪客進度，或建立新帳號進度。登入或登出都不會自動刪除訪客資料。
- OAuth 僅作登入身分驗證，不要求 Google Drive、Calendar 或 Contacts 權限。
- 定位只會在使用者主動操作時取得；不會背景追蹤或儲存到遊戲存檔。

設定方式請見 [AUTH_SETUP](docs/AUTH_SETUP.md) 與 [CLOUD_SAVE_SETUP](docs/CLOUD_SAVE_SETUP.md)。

## 開發與驗證

```powershell
npm.cmd run validate-data
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```

## 隱私與回報

應用程式不使用分析追蹤。可於個人檔案匯出 JSON 備份；問題回報請使用 GitHub Issues。
