# Life Quest Map

把現實生活變成 RPG 成長地圖，透過任務、技能、等級、地點和生活片段看見自己的成長。

## 主要功能

- 情緒與可用時間 Check-in
- 個人化微冒險推薦
- 任務系統
- EXP、等級和技能成長
- 地圖探索
- 生活片段紀錄
- 每週回顧
- LocalStorage 本機資料保存
- JSON 匯入與匯出

## 技術棧

- Next.js ^15.5.6
- React ^19.1.0
- TypeScript ^5.9.3
- Tailwind CSS ^4.1.14
- Leaflet ^1.9.4
- React Leaflet ^5.0.0
- Phosphor Icons ^2.1.10

## 本機執行方式

```bash
npm install
npm run dev
```

若 Windows PowerShell 阻擋 `npm.ps1`，可改用：

```bash
npm.cmd install
npm.cmd run dev
```

## 品質檢查

```bash
npm run lint
npm run build
```

Windows 也可使用：

```bash
npm.cmd run lint
npm.cmd run build
```

## 資料保存

目前資料保存在瀏覽器的 LocalStorage，尚未提供帳號系統或雲端同步功能。

## 專案狀態與未來規劃

- 更多微冒險內容
- 更完整的個人化推薦
- 雲端同步
- PWA 支援
- 更豐富的地圖探索
- 成就與長期成長分析
