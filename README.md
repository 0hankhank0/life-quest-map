# Life Quest Map

以 RPG 任務感協助你記錄生活的小型 Web App。選擇現在的心情與可用時間，首頁會依成長重點與職業偏好推薦一個可立即開始的微冒險。

## 本次內容

- 60 個微冒險，涵蓋學習、體能、創意、社交、探索與自律。
- 每個冒險都有唯一 ID、心情、時間、分類與職業標記；推薦採心情＋時間＋個人偏好的固定排序，無符合項時仍有完整 fallback。
- 48 則反思引言：18 則原創、18 則公共領域文本（含文學）、12 則標示清楚的原創轉述。
- 引言來源、授權判斷與維護規則見 [docs/QUOTE_SOURCES.md](docs/QUOTE_SOURCES.md)。
- 所有個人進度仍只保存在瀏覽器 LocalStorage；本專案不呼叫 Quote、影視、音樂或任何需 API key 的服務。

## 技術

Next.js 15、React 19、TypeScript、Tailwind CSS 4、Leaflet、Phosphor Icons。

## 開發

```bash
npm.cmd install
npm.cmd run dev
```

## 驗證

```bash
npm.cmd run lint
npm.cmd run build
```
