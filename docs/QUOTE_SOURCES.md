# 引言來源與使用說明

`src/data/quotes.ts` 目前有 48 則引言：18 則 Life Quest Map 原創、12 則公共領域／可查證短句、6 則公共領域文學短句，以及 12 則依影視、動畫或歌曲主題寫成的原創轉述。

## 欄位與顯示

每筆資料都以穩定 ID 對應，並帶有作者、作品、情緒、成長分類與 `sourceType`。首頁會顯示作者與作品；有 `sourceUrl` 時提供外連。`paraphrase` 會明確標示為本專案原創轉述，不會以台詞或歌詞原文呈現。

## 來源類型

- `original`：Life Quest Map 團隊原創文字，無外部著作引用。
- `public-domain`：公共領域作品或可公開查核的短句。優先連到 Project Gutenberg、Wikisource 或作者／作品的公開索引。
- `paraphrase`：由作品主題啟發的原創文字；連結僅用於可追溯作品資訊，並非原句來源。

## 可追溯來源清單

公共領域文本以資料檔中的 `sourceUrl` 為準，主要包括：[Project Gutenberg《Meditations》](https://www.gutenberg.org/ebooks/2680)、[《Aesop's Fables》](https://www.gutenberg.org/ebooks/21)、[《Emma》](https://www.gutenberg.org/ebooks/158)、[《Jane Eyre》](https://www.gutenberg.org/ebooks/1260)、[《Hamlet》](https://www.gutenberg.org/ebooks/1524) 與 [Tao Te Ching（Wikisource）](https://en.wikisource.org/wiki/Tao_Te_Ching)。

轉述條目會連到對應作品的官方或權利人網站，例如 [Studio Ghibli](https://www.ghibli.jp/)、[Pixar](https://www.pixar.com/)、[Disney](https://movies.disney.com/)、[ONE PIECE 官方網站](https://one-piece.com/) 與 [YOASOBI](https://www.yoasobi-music.jp/)。

## ID 對照表

此表是 `quotes.ts` 的完整且唯一 ID 清單；來源網址、作者、作品與註記則保存在該資料檔同一筆條目中。

| 類型 | ID |
| --- | --- |
| 原創 | `lqm-original-1`, `lqm-original-2`, `lqm-original-3`, `lqm-original-4`, `lqm-original-5`, `lqm-original-6`, `lqm-original-7`, `lqm-original-8`, `lqm-original-9`, `lqm-original-10`, `lqm-original-11`, `lqm-original-12`, `lqm-original-13`, `lqm-original-14`, `lqm-original-15`, `lqm-original-16`, `lqm-original-17`, `lqm-original-18` |
| 公共領域短句 | `public-domain-1`, `public-domain-2`, `public-domain-3`, `public-domain-4`, `public-domain-5`, `public-domain-6`, `public-domain-7`, `public-domain-8`, `public-domain-9`, `public-domain-10`, `public-domain-11`, `public-domain-12` |
| 公共領域文學 | `literature-1`, `literature-2`, `literature-3`, `literature-4`, `literature-5`, `literature-6` |
| 現代作品主題轉述 | `inspired-1`, `inspired-2`, `inspired-3`, `inspired-4`, `inspired-5`, `inspired-6`, `inspired-7`, `inspired-8`, `inspired-9`, `inspired-10`, `inspired-11`, `inspired-12` |

所有 `inspired-*` 條目都是 `paraphrase`；它們各自記錄作品、創作者、官方／權利人頁面，以及「非原文台詞或歌詞」的使用註記。

## 維護原則

新增條目時請保留唯一 ID、至少一個 `moods` 和 `categories` 值；不可加入未授權的大段電影台詞、動漫對白或歌詞。若作品仍受著作權保護，請使用 `paraphrase` 與註記，而非標成 `movie`、`anime` 或 `song` 的原文引用。
