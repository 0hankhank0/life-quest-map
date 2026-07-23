# 冒險語錄庫來源說明

正式語錄資料位於 `src/data/adventureQuotes.ts`。完成任務後，畫面會顯示自然中文出處；儲存到冒險手札時會保存語錄文字與來源快照，不會因後續資料庫更新而改寫舊紀錄。

## 正式收錄

| 類型 | 收錄內容 | 來源狀態／備註 |
| --- | --- | --- |
| 電影 | 《阿甘正傳》（阿甘）、《這個殺手不太冷》（瑪蒂達與里昂）、《刺激1995》（瑞德） | `verified` 短句台詞 |
| 電影 | 《楚門的世界》 | `paraphrase`，畫面標示「改寫自」 |
| 電影 | 《大魚海棠》 | `likely`，畫面標示「常見出處」 |
| 《英雄聯盟》角色 | 杰西、伊瑞莉雅、易大師、李星、卡蜜兒、艾希、賽特、犽宿、燼、鏡爪 | `verified`；遊戲名稱統一為《英雄聯盟》 |
| 特定造型 | 李星・神拳、艾希・源計畫 | 造型名稱會顯示於角色與遊戲名稱之間 |
| 《英雄聯盟》職業選手 | ShowMaker、Deft | ShowMaker 為正式收錄短句；Deft 為 `paraphrase`，畫面標示「意譯自」 |
| 公共領域古典文本 | 《周易》、《論語》、李白、鄭燮、劉禹錫等 | `verified`；保留作者、作品與年代資料 |
| 足球員與教練 | 莫德里奇、加克波、熱蘇斯、拉涅利、若日尼奧、羅納度、梅西 | `verified` 或 `paraphrase`；每則保留可追溯來源 URL |
| 其他運動員 | Derek Jeter | `paraphrase`；每則保留可追溯來源 URL |
| 流傳格言 | 「人因夢想而偉大。」 | `unverified`；作者標示佚名、畫面標示出處待考 |
| 原創 | Life Quest Map 原創城市迴響與新增延伸創作 | `original`，畫面標示 Life Quest Map |

原有公共領域古典文本仍保留於資料庫與舊資料遷移流程中，並不與上述正式電影／遊戲語錄混淆。

## 收錄原則與暫不收錄項目

## 2026-07 擴充：逐則來源紀錄

下表的中文若標示「專案翻譯」或「通行翻譯」，均非宣稱官方中文版本；現代受保護作品一律只保存手機彈窗適用的短句。`作品標語` 明確不是角色台詞。

| ID | 中文顯示文字 | 人物／類型 | 作品或原始來源 | 原文／中文狀態 | 可驗證來源與使用注意事項 |
| --- | --- | --- | --- | --- | --- |
| `anime-demonslayer-rengoku-heart` | 讓你的心燃燒起來。 | 煉獄杏壽郎 | 《鬼滅之刃》第 8 卷 | 心を燃やせ；通行繁中譯 | [集英社單行本](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881799-0)。現代漫畫，短句台詞。 |
| `anime-onepiece-teach-dream` | 人的夢想，是不會終結的。 | 馬歇爾・D・汀奇 | 《ONE PIECE》第 24 卷 | 人の夢は!!! 終わらねェ!!!!；通行繁中譯 | [集英社單行本](https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-873213-2)。現代漫畫，短句台詞。 |
| `anime-myhero-plus-ultra` | 向更遠的地方前進——PLUS ULTRA！ | 官方宣傳語 | 《我的英雄學院》 | PLUS ULTRA；專案翻譯 | [官方網站](https://heroaca.com/)。作品標語，非角色台詞。 |
| `football-messi-dream-came-true` | 我一直追尋的夢想，終於成真。 | Lionel Messi | FIFA 世界盃後訪談 | “The dream that I always pursued finally came true.”；專案翻譯 | [FIFA 原始報導](https://www.fifa.com/en/articles/messi-i-wont-forget-year-dreams-came-true-world-cup-winner-psg-barcelona-thanks-fans)。短句意譯。 |
| `football-irankunda-head-down-work` | 低下頭，專心工作；努力之後，回報自然會出現。 | Nestory Irankunda | FIFA 專訪 | “put my head down and just work… rewards can come”；專案意譯 | [FIFA 原始訪談](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/nestory-irankunda-australia-feature)。短句濃縮。 |
| `football-terceros-hard-work-pays` | 我們投入的努力，終究會得到回報。 | Miguel Terceros | FIFA 專訪 | “The hard work … will pay off.”；專案翻譯 | [FIFA 原始訪談](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/miguel-terceros-bolivia-interview)。短句翻譯。 |
| `football-messi-group-dream` | 這份榮耀屬於為同一個夢想奮鬥的每一個人。 | Lionel Messi | 世界盃奪冠貼文 | “The strength of all fighting for the same dream”；專案意譯 | [FIFA 引述原始貼文](https://www.fifa.com/en/articles/world-cup-2022-qatar-messi-celebration-argentina-france)。短句濃縮。 |
| `science-armstrong-giant-leap` | 這是個人的一小步，卻是人類的一大步。 | Neil Armstrong | 阿波羅 11 號登月通訊 | “one small step … one giant leap for mankind”；通行翻譯 | [NASA 逐字稿](https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.step.html)。 |
| `science-curie-fear-understand` | 生命中沒有什麼可怕的，只有需要理解的事。 | Marie Curie | 1903 年引文 | “Nothing in life is to be feared…”；專案翻譯 | [Nobel Prize 人物資料](https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/)。短句引文。 |
| `science-lovelace-engine-no-pretensions` | 分析機沒有創造任何事物的企圖。 | Ada Lovelace | *Notes on the Analytical Engine*（1843） | “The Analytical Engine has no pretensions whatever to originate anything.”；專案翻譯 | [原文掃描與轉錄](https://www.fourmilab.ch/babbage/sketch.html)。公共領域原文。 |
| `science-goodall-difference` | 你所做的事會帶來改變；你要決定帶來哪一種改變。 | Jane Goodall | Jane Goodall Institute 引文 | “What you do makes a difference…”；專案翻譯 | [Jane Goodall Institute](https://janegoodall.org/news/eatmeatless-for-people-other-animals-and-the-environment/)。短句引文。 |
| `literature-tennyson-strive-seek` | 奮鬥、追尋、發現，永不屈服。 | Alfred, Lord Tennyson | *Ulysses*（1842） | “To strive, to seek, to find, and not to yield.”；專案翻譯 | [Poetry Foundation 原文](https://www.poetryfoundation.org/poems/45392/ulysses)。公共領域原作。 |
| `literature-shakespeare-breach` | 再一次，衝向缺口，親愛的朋友們。 | William Shakespeare | *Henry V* | “Once more unto the breach, dear friends…”；專案翻譯 | [Folger Shakespeare Library](https://www.folger.edu/explore/shakespeares-works/henry-v/read/)。公共領域原作。 |
| `literature-dickinson-forever-nows` | 永恆由許多當下組成。 | Emily Dickinson | Poem 624 | “Forever is composed of nows.”；專案翻譯 | [Poetry Foundation 原文](https://www.poetryfoundation.org/poems/52197/forever-is-composed-of-nows-624)。公共領域原作。 |
| `literature-frost-way-out` | 最好的出路，往往就是穿越。 | Robert Frost | *A Servant to Servants* | “The best way out is always through.”；專案翻譯 | [Poetry Foundation 原文](https://www.poetryfoundation.org/poems/44262/a-servant-to-servants)。依地區仍可能受保護，僅短句。 |
| `philosophy-laozi-thousand-miles` | 千里之行，始於足下。 | 老子 | 《道德經》第六十四章 | 通行原文 | 王弼本系統；公共領域古典文本。 |
| `philosophy-xunzi-small-steps` | 不積跬步，無以至千里；不積小流，無以成江海。 | 荀子 | 《勸學》 | 通行原文 | 《荀子・勸學》；公共領域古典文本。 |
| `philosophy-aurelius-obstacle-way` | 行動的阻礙，反而推動行動；擋路的，成了路。 | Marcus Aurelius | *Meditations*, Book V | “The impediment to action advances action…”；專案翻譯 | [Project Gutenberg 英譯本](https://www.gutenberg.org/ebooks/2680)。公共領域英譯本。 |
| `philosophy-seneca-life-speeds` | 當我們一再拖延，生命便加速流逝。 | Seneca | *Moral Letters to Lucilius*, Letter 1 | “While we are postponing, life speeds by.”；專案翻譯 | [Project Gutenberg 英譯本](https://www.gutenberg.org/ebooks/66020)。公共領域英譯本。 |
| `creator-jobs-stay-hungry` | 保持飢渴，保持愚笨。 | Steve Jobs | 史丹佛畢業演講（2005） | “Stay hungry. Stay foolish.”；通行翻譯 | [Stanford Report](https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish)。短句引文。 |
| `creator-jobs-limited-time` | 你的時間有限，不要活成別人的人生。 | Steve Jobs | 史丹佛畢業演講（2005） | “Your time is limited…”；專案翻譯 | [史丹佛演講全文](https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says)。短句翻譯。 |
| `creator-rams-less-better` | 更少，但更好。 | Dieter Rams | 好設計十原則 | “Less, but better.”；專案翻譯 | [Vitsœ 官方資料](https://www.vitsoe.com/us/about/good-design)。 |
| `creator-eames-design-plan` | 設計，是把元素安排到最好位置的計畫。 | Charles Eames | *What Is Design?*（1972） | “Design is a plan for arranging elements…”；專案翻譯 | [Eames Office](https://www.eamesoffice.com/the-work/what-is-design/)。短句翻譯。 |
| `game-zelda-courage-never-forgotten` | 勇氣不必被記得，因為它從未被遺忘。 | 薩爾達 | 《薩爾達傳說 曠野之息》 | “Courage need not be remembered…”；專案翻譯 | [Nintendo 作品頁](https://www.nintendo.com/store/products/the-legend-of-zelda-breath-of-the-wild-switch/)。短句角色台詞。 |
| `game-ffxiv-for-those-lost` | 為我們所失去的人；為我們仍能拯救的人。 | 官方宣傳語 | 《FINAL FANTASY XIV》 | “For those we have lost. For those we can yet save.”；專案翻譯 | [官方 Endwalker 網站](https://na.finalfantasyxiv.com/endwalker/)。作品標語，非角色台詞。 |
| `game-valorant-defy-limits` | 突破極限。 | 官方宣傳語 | 《特戰英豪》 | “Defy the limits.”；專案翻譯 | [VALORANT 官方網站](https://playvalorant.com/)。作品標語，非角色台詞。 |

電影僅收錄完整短句，避免長篇獨白、連續對話或同一部電影的大量台詞，因此不收錄《女人香》的十字路口長篇台詞。

「不管前方的路有多苦……」與「人永遠不知道，哪次不經意說了再見……」常被誤標為《千與千尋》，但目前來源不足以確認；兩句均未納入正式語錄庫。

`verified` 表示有可追溯的一手或官方來源，不表示存在官方中文譯文；`paraphrase` 表示中文意譯或濃縮；`unverified` 表示流傳句但缺少可靠原始出處。

標示人物與來源不等同於取得著作權授權。現代來源僅保留短句中譯或意譯，不收錄長篇電影台詞、訪談全文或歌詞；「人因夢想而偉大。」只能標示佚名及出處待考。正式產品後續應優先增加原創或已取得授權的語錄。
