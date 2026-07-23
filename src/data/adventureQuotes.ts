import type { AdventureQuote, CityEchoCategory, Quest, QuestCategory, QuoteIntent } from "@/types";

export const cityEchoCategoryLabels: Record<CityEchoCategory, string> = {
  exploration: "探索的回聲", connection: "相遇的回聲", rest: "休息的回聲", awareness: "察覺的回聲",
  courage: "踏出一步的回聲", creation: "留下痕跡的回聲", daily: "城市迴響"
};

const original = (id: string, text: string, categories: CityEchoCategory[], tags?: string[]): AdventureQuote => ({ id, text, categories, tags, sourceType: "original", sourceTitle: "Life Quest Map", sourceStatus: "original", enabled: true, weight: 3 });
const publicDomain = (id: string, text: string, author: string, work: string, dynasty: string, categories: CityEchoCategory[], tags?: string[]): AdventureQuote => ({ id, text, author, work, dynasty, categories, tags, sourceType: "public_domain", sourceTitle: work, sourceStatus: "verified", enabled: true, weight: 1 });
const external = (quote: Omit<AdventureQuote, "categories" | "weight">, categories: CityEchoCategory[]): AdventureQuote => ({ ...quote, categories, weight: 1 });

export const adventureQuotes: AdventureQuote[] = [
  original("city-1", "平凡不是空白，只是它很少被好好記住。", ["daily", "awareness"]),
  original("city-2", "今天不必變得更厲害，也可以和昨天有一點不同。", ["daily", "courage"]),
  original("city-3", "快樂不一定來自遠方，有時只是今天多停留了十分鐘。", ["rest", "daily"]),
  original("city-4", "城市沒有突然改變，是你開始用不同的方式看它。", ["exploration", "awareness"]),
  original("city-5", "並不是每次冒險都要有所收穫，願意走出去本身就留下了痕跡。", ["exploration", "courage"]),
  original("city-6", "停下來並沒有離開旅程，休息本來就是旅程的一部分。", ["rest", "daily"]),
  original("city-7", "有些日子被記住，不是因為發生大事，而是有人願意多停留一下。", ["daily", "awareness"]),
  original("city-8", "你注意到的光、聲音和風，都是今天的一部分。", ["awareness", "daily"]),
  original("city-9", "沒有特別感覺也沒關係，這一刻照樣經過了你。", ["daily", "rest"]),
  original("city-10", "和人多說幾句話，常常比想像中更能讓一天有了輪廓。", ["connection", "daily"]),
  original("city-11", "有些嘗試不需要被證明，只要讓你知道自己可以選擇。", ["courage", "daily"]),
  original("city-12", "留下幾個字，不是為了交代，是給以後的自己一盞小燈。", ["creation", "daily"]),
  original("city-13", "今天的路沒有比較好，只是你走得比平常慢一點。", ["exploration", "rest"]),
  original("city-14", "陪伴不一定要說很多話，願意在場就很珍貴。", ["connection", "rest"]),
  original("original-unwilling-to-be-ordinary", "致不甘平凡的我們。", ["daily", "courage"], ["冒險", "平凡", "夢想"]),
  publicDomain("pd-wangwei-1", "行到水窮處，坐看雲起時。", "王維", "終南別業", "唐", ["rest", "awareness"]),
  publicDomain("pd-wangwei-2", "深林人不知，明月來相照。", "王維", "竹里館", "唐", ["awareness", "rest"]),
  publicDomain("pd-taoyuanming-1", "採菊東籬下，悠然見南山。", "陶淵明", "飲酒·其五", "東晉", ["awareness", "rest"]),
  publicDomain("pd-sushi-1", "何夜無月？何處無竹柏？但少閑人如吾兩人者耳。", "蘇軾", "記承天寺夜遊", "北宋", ["awareness", "connection"]),
  publicDomain("pd-sushi-2", "回首向來蕭瑟處，歸去，也無風雨也無晴。", "蘇軾", "定風波·莫聽穿林打葉聲", "北宋", ["courage", "daily"]),
  publicDomain("pd-zhouyi-self-renewal", "天行健，君子以自強不息。", "佚名", "周易・乾卦・象傳", "先秦", ["courage", "daily"], ["自強", "堅持", "成長"]),
  publicDomain("pd-analects-will", "三軍可奪帥也，匹夫不可奪志也。", "孔子", "論語・子罕", "先秦", ["courage", "daily"], ["志向", "信念", "堅持"]),
  publicDomain("pd-analects-wise-brave", "知者不惑，仁者不憂，勇者不懼。", "孔子", "論語・子罕", "先秦", ["awareness", "courage"], ["智慧", "勇氣", "仁愛"]),
  publicDomain("pd-analects-pine-cypress", "歲寒，然後知松柏之後凋也。", "孔子", "論語・子罕", "先秦", ["courage", "rest"], ["逆境", "品格", "堅持"]),
  publicDomain("pd-analects-haste", "欲速則不達，見小利則大事不成。", "孔子", "論語・子路", "先秦", ["rest", "awareness"], ["耐心", "節奏", "遠見"]),
  publicDomain("pd-libai-break-waves", "長風破浪會有時，直掛雲帆濟滄海。", "李白", "行路難・其一", "唐", ["courage", "exploration"], ["希望", "冒險", "志向"]),
  publicDomain("pd-zhengxie-bamboo", "千磨萬擊還堅勁，任爾東西南北風。", "鄭燮", "竹石", "清", ["courage", "daily"], ["韌性", "逆境", "堅持"]),
  publicDomain("pd-liuyuxi-new-spring", "沉舟側畔千帆過，病樹前頭萬木春。", "劉禹錫", "酬樂天揚州初逢席上見贈", "唐", ["courage", "daily"], ["更新", "希望", "重新開始"]),
  external({ id: "movie-forrest-gump-chocolate", text: "生活就像一盒巧克力，你永遠不知道下一顆是什麼味道。", sourceType: "movie", sourceTitle: "《阿甘正傳》", speaker: "阿甘", sourceStatus: "verified", tags: ["人生", "未知", "前進"], enabled: true }, ["daily", "courage"]),
  external({ id: "movie-leon-life-is-hard", text: "人生總是這麼痛苦嗎，還是只有小時候如此？一直都是。", sourceType: "movie", sourceTitle: "《這個殺手不太冷》", speaker: "瑪蒂達與里昂", sourceStatus: "verified", tags: ["人生", "成長", "堅持"], enabled: true }, ["courage", "awareness"]),
  external({ id: "movie-shawshank-some-birds", text: "有些鳥注定不會被關在牢籠裡，牠們的羽毛太過耀眼。", sourceType: "movie", sourceTitle: "《刺激1995》", speaker: "瑞德", sourceStatus: "verified", tags: ["自由", "希望", "自我"], enabled: true }, ["courage", "exploration"]),
  external({ id: "movie-truman-world-prison", text: "外面的世界，也不過是一座充滿謊言的牢籠。", sourceType: "movie", sourceTitle: "《楚門的世界》", sourceStatus: "paraphrase", tags: ["真實", "自由", "選擇"], enabled: true }, ["awareness", "courage"]),
  external({ id: "movie-big-fish-begonia-life", text: "這短短的一生，我們最終都會失去。你不妨大膽一些，愛一個人，攀一座山，追一個夢。", sourceType: "movie", sourceTitle: "《大魚海棠》", sourceStatus: "likely", tags: ["勇氣", "夢想", "人生"], enabled: true }, ["courage", "daily"]),
  external({ id: "lol-jayce-better-tomorrow", text: "為了更美好的明天而戰。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "杰西", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["未來", "奮鬥", "希望"], enabled: true }, ["courage", "daily"]),
  external({ id: "lol-irelia-master-of-fate", text: "我們是自己命運的唯一主人。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "伊瑞莉雅", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["命運", "選擇", "自我"], enabled: true }, ["courage", "daily"]),
  external({ id: "lol-master-yi-student-heart", text: "真正的大師，永遠懷著一顆學徒的心。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "易大師", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["學習", "成長", "謙遜"], enabled: true }, ["courage", "awareness"]),
  external({ id: "lol-lee-sin-conquer-yourself", text: "征服自己，才是最強的猛士。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "李星", game: "《英雄聯盟》", skin: "神拳", sourceStatus: "verified", tags: ["自律", "突破", "勇氣"], enabled: true }, ["courage", "rest"]),
  external({ id: "lol-camille-delicate-grey", text: "世界既不黑也不白，而是一道精緻的灰。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "卡蜜兒", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["世界", "選擇", "思考"], enabled: true }, ["awareness", "daily"]),
  external({ id: "lol-ashe-remembered-tomorrow", text: "只有能被明日的我們銘記，今天才有意義。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "艾希", game: "《英雄聯盟》", skin: "源計畫", sourceStatus: "verified", tags: ["今日", "未來", "意義"], enabled: true }, ["daily", "courage"]),
  external({ id: "lol-sett-rise-again", text: "被擊倒多少次都不重要，重要的是你有多少次爬了起來。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "賽特", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["失敗", "堅持", "重新站起"], enabled: true }, ["courage", "rest"]),
  external({ id: "lol-yasuo-seeds-and-fruit", text: "當下的果實，皆出自曾經的種苗。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "犽宿", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["累積", "成長", "因果"], enabled: true }, ["daily", "awareness"]),
  external({ id: "lol-jhin-future-self", text: "現在你是何人？未來你又將成為何物？", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "燼", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["未來", "自我", "蛻變"], enabled: true }, ["awareness", "creation"]),
  external({ id: "lol-kindred-tomorrow-hope", text: "明天只是一個希望，不是一個承諾。", sourceType: "game", sourceTitle: "《英雄聯盟》", speaker: "鏡爪", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["明天", "希望", "當下"], enabled: true }, ["daily", "courage"]),
  external({ id: "pro-showmaker-failure-in-life", text: "失敗總是貫穿人生始終，這就是人生。", sourceType: "proPlayer", sourceTitle: "《英雄聯盟》職業選手語錄", speaker: "ShowMaker", game: "《英雄聯盟》", sourceStatus: "verified", tags: ["失敗", "人生", "接受"], enabled: true }, ["courage", "daily"]),
  external({ id: "pro-deft-personal-experience", text: "人生在世，不太需要其他人的意見；有些事情不親身經歷，是不會真正明白的。", sourceType: "proPlayer", sourceTitle: "《英雄聯盟》職業選手語錄", speaker: "Deft", game: "《英雄聯盟》", sourceStatus: "paraphrase", tags: ["經歷", "選擇", "人生"], enabled: true }, ["awareness", "daily"]),
  external({ id: "football-modric-believe-forward", text: "即使在困難的時候，也要相信自己，持續向前。", speaker: "盧卡・莫德里奇", sourceType: "football", sourceTitle: "FIFA 專訪", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://inside.fifa.com/en/news/modric-a-night-when-all-my-dreams-came-true", tags: ["相信自己", "逆境", "前進"], enabled: true }, ["courage", "daily"]),
  external({ id: "football-gakpo-hard-work", text: "不論從哪裡開始，努力都能帶你走得更遠。", speaker: "科迪・加克波", sourceType: "football", sourceTitle: "The Players’ Tribune", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://www.theplayerstribune.com/cody-gakpo-premier-league-liverpool-fc-soccer-football", tags: ["努力", "起點", "成長"], enabled: true }, ["courage", "daily"]),
  external({ id: "football-gabriel-jesus-dream", text: "不要停止戰鬥，也永遠不要停止做夢。", speaker: "加布里埃爾・熱蘇斯", sourceType: "football", sourceTitle: "The Players’ Tribune", sourceStatus: "verified", note: "中譯", sourceUrl: "https://www.theplayerstribune.com/articles/gabriel-jesus-call-your-ma", tags: ["夢想", "奮鬥", "堅持"], enabled: true }, ["courage", "daily"]),
  external({ id: "football-ranieri-work-hard", text: "你們替我們做夢；我們只管努力。", speaker: "克勞迪奧・拉涅利", sourceType: "football", sourceTitle: "The Players’ Tribune", sourceStatus: "verified", note: "中譯", sourceUrl: "https://www.theplayerstribune.com/articles/claudio-ranieri-leicester-city-premier-league", tags: ["努力", "夢想", "專注"], enabled: true }, ["courage", "daily"]),
  external({ id: "football-ranieri-one-heart", text: "二十六名球員，二十六種思想，卻擁有同一顆心。", speaker: "克勞迪奧・拉涅利", sourceType: "football", sourceTitle: "The Players’ Tribune", sourceStatus: "verified", note: "中譯", sourceUrl: "https://www.theplayerstribune.com/articles/claudio-ranieri-leicester-city-premier-league", tags: ["團隊", "同心", "合作"], enabled: true }, ["connection", "courage"]),
  external({ id: "football-jorginho-not-alone", text: "在足球和人生中，沒有人能獨自走到頂峰。", speaker: "若日尼奧", sourceType: "football", sourceTitle: "The Players’ Tribune", sourceStatus: "verified", note: "中譯", sourceUrl: "https://www.theplayerstribune.com/posts/jorginho-premier-league-chelsea-italy-soccer", tags: ["團隊", "同行", "支持"], enabled: true }, ["connection", "courage"]),
  external({ id: "football-ronaldo-professional", text: "我知道自己要走向哪裡：我會成為職業球員。", speaker: "克里斯蒂亞諾・羅納度", sourceType: "football", sourceTitle: "UEFA 訪談", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://www.uefa.com/uefaeuro/history/news/0253-0d816dccc235-61cf66bf2c76-1000--cristiano-ronaldo-on-fate-childhood-and-portugal/", tags: ["目標", "夢想", "信念"], enabled: true }, ["courage", "daily"]),
  external({ id: "football-messi-team-counts", text: "個人獎項是其次，真正重要的是團隊。", speaker: "梅西", sourceType: "football", sourceTitle: "FIFA 訪談中譯", sourceStatus: "verified", note: "中譯", sourceUrl: "https://inside.fifa.com/news/messi-its-the-team-that-counts", tags: ["團隊", "榮耀", "合作"], enabled: true }, ["connection", "courage"]),
  external({ id: "football-messi-fight-everything", text: "我們必須永遠為所有冠軍而戰。", speaker: "梅西", sourceType: "football", sourceTitle: "巴塞隆納官方訪談", sourceStatus: "verified", note: "中譯", sourceUrl: "https://www.fcbarcelona.com/en/news/759155/leo-messi-we-want-to-win-everything-always/amp", tags: ["奮鬥", "目標", "勝利"], enabled: true }, ["courage", "daily"]),
  external({ id: "athlete-jeter-keep-pushing", text: "不要放棄；穿過失敗，夢想才有機會成真。", speaker: "Derek Jeter", sourceType: "athlete", sourceTitle: "The Players’ Tribune", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://www.theplayerstribune.com/posts/derek-jeter-letter-to-my-younger-self-new-york-yankees-mlb-baseball", tags: ["失敗", "堅持", "夢想"], enabled: true }, ["courage", "daily"]),
  external({ id: "proverb-dreams-greatness", text: "人因夢想而偉大。", author: "佚名", sourceType: "proverb", sourceTitle: "現代流傳格言", sourceStatus: "unverified", note: "常被誤標為名人語錄，目前缺少可靠原始出處", tags: ["夢想", "偉大", "志向"], enabled: true }, ["courage", "daily"]),
  external({ id: "anime-demonslayer-rengoku-heart", text: "讓你的心燃燒起來。", speaker: "煉獄杏壽郎", work: "鬼滅之刃", sourceType: "movie", sourceTitle: "《鬼滅之刃》單行本第 8 卷", sourceStatus: "verified", note: "通行繁中譯；短句台詞", sourceUrl: "https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-881799-0", tags: ["重新振作", "勇氣", "困難"], intents: ["courage", "resilience"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  external({ id: "anime-onepiece-teach-dream", text: "人的夢想，是不會終結的。", speaker: "馬歇爾・D・汀奇", work: "ONE PIECE", sourceType: "movie", sourceTitle: "《ONE PIECE》單行本第 24 卷", sourceStatus: "verified", note: "通行繁中譯；短句台詞", sourceUrl: "https://www.shueisha.co.jp/books/items/contents.html?isbn=978-4-08-873213-2", tags: ["夢想", "長期目標", "堅持"], intents: ["dream", "resilience"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  external({ id: "anime-myhero-plus-ultra", text: "向更遠的地方前進——PLUS ULTRA！", sourceType: "movie", sourceTitle: "《我的英雄學院》作品標語", sourceStatus: "verified", note: "官方宣傳語，不歸屬單一角色", sourceUrl: "https://heroaca.com/", tags: ["突破", "升級", "前進"], intents: ["progress", "courage"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  external({ id: "football-messi-dream-came-true", text: "我一直追尋的夢想，終於成真。", speaker: "梅西", sourceType: "football", sourceTitle: "FIFA：Messi: I won't forget year dreams came true", sourceStatus: "verified", note: "中文意譯", sourceUrl: "https://www.fifa.com/en/articles/messi-i-wont-forget-year-dreams-came-true-world-cup-winner-psg-barcelona-thanks-fans", tags: ["夢想", "完成", "長期目標"], intents: ["dream", "progress"], avoidIntents: ["failure"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  external({ id: "football-irankunda-head-down-work", text: "低下頭，專心工作；努力之後，回報自然會出現。", speaker: "內斯托里・伊蘭昆達", sourceType: "football", sourceTitle: "FIFA 專訪", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/nestory-irankunda-australia-feature", tags: ["專注", "努力", "訓練"], intents: ["discipline", "focus", "progress"], specificity: "specific", enabled: true }, ["daily", "courage"]),
  external({ id: "football-terceros-hard-work-pays", text: "我們投入的努力，終究會得到回報。", speaker: "米格爾・特爾塞羅斯", sourceType: "football", sourceTitle: "FIFA 專訪", sourceStatus: "paraphrase", note: "中文意譯", sourceUrl: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/miguel-terceros-bolivia-interview", tags: ["努力", "累積", "團隊"], intents: ["discipline", "progress", "teamwork"], specificity: "specific", enabled: true }, ["daily", "connection"]),
  external({ id: "football-messi-group-dream", text: "這份榮耀屬於為同一個夢想奮鬥的每一個人。", speaker: "梅西", sourceType: "football", sourceTitle: "FIFA：Messi celebration is most-liked Instagram post", sourceStatus: "paraphrase", note: "中文意譯，依原文「所有人為同一個夢想而戰的力量」濃縮", sourceUrl: "https://www.fifa.com/en/articles/world-cup-2022-qatar-messi-celebration-argentina-france", tags: ["團隊", "夢想", "榮耀"], intents: ["teamwork", "connection", "dream"], specificity: "specific", enabled: true }, ["connection", "courage"]),
  external({ id: "science-armstrong-giant-leap", text: "這是個人的一小步，卻是人類的一大步。", speaker: "尼爾・阿姆斯壯", work: "阿波羅 11 號登月通訊", sourceType: "published", sourceTitle: "NASA 阿波羅 11 號逐字稿", sourceStatus: "verified", note: "通行翻譯", sourceUrl: "https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.step.html", tags: ["開始", "探索", "里程碑"], intents: ["exploration", "progress", "courage"], specificity: "specific", enabled: true }, ["exploration", "courage"]),
  external({ id: "science-curie-fear-understand", text: "生命中沒有什麼可怕的，只有需要理解的事。", speaker: "瑪麗・居禮", work: "訪談引文（1903）", sourceType: "published", sourceTitle: "Nobel Prize：Marie Curie facts", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/", tags: ["學習", "未知", "勇氣"], intents: ["learning", "courage", "self_belief"], specificity: "specific", enabled: true }, ["courage", "awareness"]),
  external({ id: "science-lovelace-engine-no-pretensions", text: "分析機沒有創造任何事物的企圖。", speaker: "愛達・洛夫萊斯", work: "Notes on the Analytical Engine", sourceType: "published", sourceTitle: "《科學回憶錄》第 3 卷（1843）", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://www.fourmilab.ch/babbage/sketch.html", tags: ["學習", "創作", "思考"], intents: ["learning", "creation", "awareness"], specificity: "specific", enabled: true }, ["creation", "awareness"]),
  external({ id: "science-goodall-difference", text: "你所做的事會帶來改變；你要決定帶來哪一種改變。", speaker: "珍・古德", work: "Jane Goodall Institute 引文", sourceType: "published", sourceTitle: "Jane Goodall Institute", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://janegoodall.org/news/eatmeatless-for-people-other-animals-and-the-environment/", tags: ["行動", "選擇", "影響"], intents: ["courage", "progress", "awareness"], specificity: "specific", enabled: true }, ["daily", "courage"]),
  external({ id: "literature-tennyson-strive-seek", text: "奮鬥、追尋、發現，永不屈服。", speaker: "阿爾弗雷德・丁尼生", work: "Ulysses", sourceType: "published", sourceTitle: "《Ulysses》（1842）", sourceStatus: "verified", note: "專案翻譯；公共領域原作", sourceUrl: "https://www.poetryfoundation.org/poems/45392/ulysses", tags: ["探索", "堅持", "遠方"], intents: ["exploration", "resilience", "courage"], specificity: "specific", enabled: true }, ["exploration", "courage"]),
  external({ id: "literature-shakespeare-breach", text: "再一次，衝向缺口，親愛的朋友們。", speaker: "威廉・莎士比亞", work: "亨利五世", sourceType: "published", sourceTitle: "Folger Shakespeare Library：Henry V", sourceStatus: "verified", note: "專案翻譯；公共領域原作", sourceUrl: "https://www.folger.edu/explore/shakespeares-works/henry-v/read/", tags: ["勇氣", "挑戰", "團隊"], intents: ["courage", "teamwork"], specificity: "specific", enabled: true }, ["courage", "connection"]),
  external({ id: "literature-dickinson-forever-nows", text: "永恆由許多當下組成。", speaker: "艾蜜莉・狄金生", work: "Poem 624", sourceType: "published", sourceTitle: "《Poems by Emily Dickinson》", sourceStatus: "verified", note: "專案翻譯；公共領域原作", sourceUrl: "https://www.poetryfoundation.org/poems/52197/forever-is-composed-of-nows-624", tags: ["當下", "時間", "覺察"], intents: ["awareness", "reflection"], specificity: "specific", enabled: true }, ["awareness", "daily"]),
  external({ id: "literature-frost-way-out", text: "最好的出路，往往就是穿越。", speaker: "羅伯特・佛洛斯特", work: "A Servant to Servants", sourceType: "published", sourceTitle: "《North of Boston》（1914）", sourceStatus: "verified", note: "專案翻譯；原作依地區可能仍受保護，僅收錄短句", sourceUrl: "https://www.poetryfoundation.org/poems/44262/a-servant-to-servants", tags: ["困境", "穿越", "重試"], intents: ["resilience", "failure", "courage"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  publicDomain("philosophy-laozi-thousand-miles", "千里之行，始於足下。", "老子", "道德經・第六十四章", "先秦", ["exploration", "daily"], ["開始", "小步", "旅程"]),
  publicDomain("philosophy-xunzi-small-steps", "不積跬步，無以至千里；不積小流，無以成江海。", "荀子", "勸學", "戰國", ["daily", "courage"], ["累積", "習慣", "堅持"]),
  external({ id: "philosophy-aurelius-obstacle-way", text: "行動的阻礙，反而推動行動；擋路的，成了路。", speaker: "馬可・奧理略", work: "沉思錄・第五卷", sourceType: "published", sourceTitle: "《Meditations》George Long 譯本", sourceStatus: "verified", note: "專案翻譯；公共領域英譯本", sourceUrl: "https://www.gutenberg.org/ebooks/2680", tags: ["阻礙", "重試", "韌性"], intents: ["resilience", "failure", "courage"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  external({ id: "philosophy-seneca-life-speeds", text: "當我們一再拖延，生命便加速流逝。", speaker: "塞內卡", work: "道德書信集・第一封", sourceType: "published", sourceTitle: "《Moral Letters to Lucilius》", sourceStatus: "verified", note: "專案翻譯；公共領域英譯本", sourceUrl: "https://www.gutenberg.org/ebooks/66020", tags: ["開始", "時間", "行動"], intents: ["discipline", "small_step", "courage"], specificity: "specific", enabled: true }, ["daily", "awareness"]),
  external({ id: "creator-jobs-stay-hungry", text: "保持飢渴，保持愚笨。", speaker: "史蒂夫・賈伯斯", work: "史丹佛大學畢業演講（2005）", sourceType: "published", sourceTitle: "Stanford Report", sourceStatus: "verified", note: "通行翻譯", sourceUrl: "https://news.stanford.edu/stories/2005/06/steve-jobs-2005-graduates-stay-hungry-stay-foolish", tags: ["探索", "學習", "創作"], intents: ["learning", "exploration", "creation"], specificity: "specific", enabled: true }, ["creation", "exploration"]),
  external({ id: "creator-jobs-limited-time", text: "你的時間有限，不要活成別人的人生。", speaker: "史蒂夫・賈伯斯", work: "史丹佛大學畢業演講（2005）", sourceType: "published", sourceTitle: "Stanford Report", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says", tags: ["選擇", "人生", "勇氣"], intents: ["courage", "self_belief", "awareness"], specificity: "specific", enabled: true }, ["courage", "awareness"]),
  external({ id: "creator-rams-less-better", text: "更少，但更好。", speaker: "迪特・拉姆斯", work: "好設計十原則", sourceType: "published", sourceTitle: "Vitsœ：Good design", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://www.vitsoe.com/us/about/good-design", tags: ["設計", "專注", "本質"], intents: ["creation", "focus", "discipline"], specificity: "specific", enabled: true }, ["creation", "daily"]),
  external({ id: "creator-eames-design-plan", text: "設計，是把元素安排到最好位置的計畫。", speaker: "查爾斯・伊姆斯", work: "What Is Design?", sourceType: "published", sourceTitle: "《What Is Design?》（1972）", sourceStatus: "verified", note: "專案翻譯", sourceUrl: "https://www.eamesoffice.com/the-work/what-is-design/", tags: ["設計", "計畫", "創作"], intents: ["creation", "focus", "progress"], specificity: "specific", enabled: true }, ["creation", "daily"]),
  external({ id: "game-zelda-courage-never-forgotten", text: "勇氣不必被記得，因為它從未被遺忘。", speaker: "薩爾達", work: "薩爾達傳說 曠野之息", sourceType: "game", sourceTitle: "《薩爾達傳說 曠野之息》", game: "《薩爾達傳說 曠野之息》", sourceStatus: "verified", note: "專案翻譯；短句角色台詞", sourceUrl: "https://www.nintendo.com/store/products/the-legend-of-zelda-breath-of-the-wild-switch/", tags: ["勇氣", "冒險", "記憶"], intents: ["courage", "exploration"], specificity: "specific", enabled: true }, ["courage", "exploration"]),
  external({ id: "game-ffxiv-for-those-lost", text: "為我們所失去的人；為我們仍能拯救的人。", sourceType: "game", sourceTitle: "《FINAL FANTASY XIV》作品標語", game: "《FINAL FANTASY XIV》", sourceStatus: "verified", note: "官方宣傳語，不歸屬角色；專案翻譯", sourceUrl: "https://na.finalfantasyxiv.com/endwalker/", tags: ["希望", "團隊", "前進"], intents: ["teamwork", "resilience", "courage"], specificity: "specific", enabled: true }, ["connection", "courage"]),
  external({ id: "game-valorant-defy-limits", text: "突破極限。", sourceType: "game", sourceTitle: "《特戰英豪》官方宣傳語", game: "《特戰英豪》", sourceStatus: "verified", note: "官方宣傳語，不歸屬角色；專案翻譯", sourceUrl: "https://playvalorant.com/", tags: ["突破", "挑戰", "升級"], intents: ["courage", "progress"], specificity: "specific", enabled: true }, ["courage", "daily"]),
  original("original-dream-depart-arrive", "人因夢想而出發，也因努力而抵達。", ["courage", "daily"], ["夢想", "努力", "抵達"]),
  original("original-quest-becoming", "真正重要的，不只是完成任務，而是你成為了怎樣的人。", ["daily", "awareness"], ["任務", "成長", "自我"]),
  original("original-slow-still-forward", "走得慢沒有關係，只要今天的你仍在前進。", ["rest", "courage"], ["節奏", "前進", "堅持"]),
  external({ id: "original-together-forward", text: "個人榮耀是其次，真正重要的是與你並肩前進的人。", sourceType: "original", sourceTitle: "Life Quest Map", sourceStatus: "original", note: "靈感來自梅西談團隊的重要性", tags: ["同行", "團隊", "陪伴"], enabled: true }, ["connection", "courage"])
];

/** Matches only identical current text, so migrated journals never rewrite a saved quote. */
export function findAdventureQuote(quoteId: unknown, text: unknown): AdventureQuote | undefined {
  const byId = typeof quoteId === "string" ? adventureQuotes.find((quote) => quote.id === quoteId) : undefined;
  if (byId && (typeof text !== "string" || byId.text === text)) return byId;
  return typeof text === "string" ? adventureQuotes.find((quote) => quote.text === text) : undefined;
}

const categoryMap: Record<QuestCategory, CityEchoCategory> = { exploration: "exploration", social: "connection", creativity: "creation", learning: "courage", fitness: "rest", discipline: "daily" };
const keywordCategories: Array<[CityEchoCategory, RegExp]> = [["rest", /休息|放鬆|睡眠|停下|呼吸|散步|靜|茶|聽一首歌/i], ["awareness", /觀察|天空|光線|聲音|注意|看見|感受|月|風/i], ["connection", /朋友|家人|聊天|陪伴|訊息|一起|對話/i], ["exploration", /探索|路線|一條路|不同路|新地方|散步|走走|地圖/i], ["courage", /嘗試|不確定|踏出|面對|第一次/i], ["creation", /創作|畫|寫|拍|記錄|表達|塗鴉/i]];

export function inferCityEchoCategory(quest: Pick<Quest, "title" | "description" | "category" | "type">, tags: readonly string[] = []): CityEchoCategory {
  const keyword = keywordCategories.find(([, pattern]) => pattern.test(`${quest.title} ${quest.description} ${tags.join(" ")}`));
  return keyword ? keyword[0] : quest.type === "map" ? "exploration" : categoryMap[quest.category] ?? "daily";
}

function weightedPick(quotes: readonly AdventureQuote[], random: () => number): AdventureQuote {
  let cursor = random() * quotes.reduce((sum, quote) => sum + Math.max(1, quote.weight ?? 1), 0);
  for (const quote of quotes) { cursor -= Math.max(1, quote.weight ?? 1); if (cursor <= 0) return quote; }
  return quotes[quotes.length - 1];
}

export function pickAdventureQuote(category: CityEchoCategory, recentIds: readonly string[] = [], random = Math.random): AdventureQuote {
  const enabled = adventureQuotes.filter((quote) => quote.enabled !== false);
  const matching = enabled.filter((quote) => quote.categories.includes(category));
  const fallback = enabled.filter((quote) => quote.categories.includes("daily"));
  const candidates = matching.length ? matching : fallback.length ? fallback : enabled;
  const fresh = candidates.filter((quote) => !recentIds.includes(quote.id));
  return weightedPick(fresh.length ? fresh : candidates, random);
}

const categoryIntents: Record<CityEchoCategory, QuoteIntent[]> = {
  exploration: ["exploration", "awareness"], connection: ["connection"], rest: ["rest", "reflection", "fitness"],
  awareness: ["awareness", "reflection"], courage: ["courage", "progress"], creation: ["creation", "progress"],
  daily: ["small_step", "discipline", "progress"]
};
const intentKeywords: Array<[QuoteIntent, RegExp]> = [
  ["learning", /學|讀|研究|課|learn|read/i], ["focus", /專注|整理|focus/i],
  ["fitness", /運動|走|跑|伸展|健康|fitness|walk/i], ["rest", /休息|放鬆|睡|呼吸|茶|rest/i],
  ["creation", /創作|畫|寫|拍|設計|create/i], ["exploration", /探索|新地方|路線|地圖|explor/i],
  ["connection", /朋友|家人|聊天|陪伴|一起|訊息|team|friend/i], ["teamwork", /團隊|合作|一起|team/i],
  ["failure", /失敗|挫折|跌倒|fail/i], ["resilience", /重來|堅持|撐|resilien/i], ["dream", /夢想|dream/i],
  ["self_belief", /相信自己|信念|believe/i], ["awareness", /觀察|看見|感受|天空|聲音|awareness/i]
];

// Older catalog entries are enriched at load time, preserving their IDs and text for saved journals.
for (const quote of adventureQuotes) {
  const text = `${quote.text} ${(quote.tags ?? []).join(" ")}`;
  const inferred = intentKeywords.filter(([, pattern]) => pattern.test(text)).map(([intent]) => intent);
  quote.intents = quote.intents?.length ? quote.intents : [...new Set([...quote.categories.flatMap((category) => categoryIntents[category]), ...inferred])];
  quote.specificity ??= inferred.length ? "specific" : "neutral";
}

export function inferQuestIntents(quest: Pick<Quest, "title" | "description" | "category" | "type">, tags: readonly string[] = []): QuoteIntent[] {
  const text = `${quest.title} ${quest.description} ${tags.join(" ")}`;
  const intents = intentKeywords.filter(([, pattern]) => pattern.test(text)).map(([intent]) => intent);
  if (quest.type === "map") intents.push("exploration", "awareness");
  // A concrete action should outweigh the broad legacy category; category is the neutral fallback.
  if (intents.length === 0) intents.push(...categoryIntents[categoryMap[quest.category] ?? "daily"]);
  return [...new Set(intents)];
}

export function scoreAdventureQuote(quote: AdventureQuote, context: { category: CityEchoCategory; intents: readonly QuoteIntent[]; text: string }): number {
  const matches = context.intents.filter((intent) => quote.intents?.includes(intent)).length;
  const conflicts = (quote.avoidIntents ?? []).filter((intent) => context.intents.includes(intent)).length;
  return (quote.categories.includes(context.category) ? 4 : 0) + matches * 5 + (quote.specificity === "specific" && matches ? 2 : quote.specificity === "neutral" ? 1 : 0) - conflicts * 12;
}

export function pickAdventureQuoteForQuest(quest: Pick<Quest, "title" | "description" | "category" | "type">, recentIds: readonly string[] = [], options: { tags?: readonly string[]; random?: () => number } = {}): { quote: AdventureQuote; category: CityEchoCategory } {
  const category = inferCityEchoCategory(quest, options.tags);
  const intents = inferQuestIntents(quest, options.tags);
  const scored = adventureQuotes.filter((quote) => quote.enabled !== false).map((quote) => ({ quote, score: scoreAdventureQuote(quote, { category, intents, text: `${quest.title} ${quest.description}` }) }));
  const highest = Math.max(...scored.map((item) => item.score));
  const candidates = scored.filter((item) => item.score === highest).map((item) => item.quote);
  const fresh = candidates.filter((quote) => !recentIds.includes(quote.id));
  return { quote: weightedPick(fresh.length ? fresh : candidates, options.random ?? Math.random), category };
}
