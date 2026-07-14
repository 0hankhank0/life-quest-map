import type { Mood } from "@/data/microAdventures";
import type { GrowthFocus } from "@/types";

export type QuoteSourceType = "public-domain" | "original" | "paraphrase" | "movie" | "anime" | "song";

export interface ReflectionQuote {
  id: string;
  text: string;
  originalText?: string;
  originalLanguage?: string;
  author: string;
  work?: string;
  creator?: string;
  moods: Mood[];
  categories: GrowthFocus[];
  sourceType: QuoteSourceType;
  sourceName?: string;
  sourceUrl?: string;
  note?: string;
}

type QuoteInput = Omit<ReflectionQuote, "id">;
const translated = "本專案依公版原文自行翻譯";

const originalQuotes: QuoteInput[] = [
  { text: "把今天縮小到下一步，路就會開始出現。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["discipline"] , sourceType: "original" },
  { text: "好奇心不是待辦事項，它是一扇可以隨時推開的門。", author: "Life Quest Map", moods: ["bored", "good"], categories: ["learning", "exploration"], sourceType: "original" },
  { text: "休息不是退出；它是替下一次出發蓄力。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["fitness", "discipline"], sourceType: "original" },
  { text: "真誠地問一句近況，也能完成一次小小的連結。", author: "Life Quest Map", moods: ["social", "good"], categories: ["social"], sourceType: "original" },
  { text: "先照顧身體，心才有空間處理遠方。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["fitness"], sourceType: "original" },
  { text: "不必等靈感完整，先留下一個粗糙的開頭。", author: "Life Quest Map", moods: ["bored", "good"], categories: ["creativity"], sourceType: "original" },
  { text: "你注意到的細節，會慢慢變成自己的世界。", author: "Life Quest Map", moods: ["quiet", "out"], categories: ["exploration", "creativity"], sourceType: "original" },
  { text: "一個深呼吸，足以讓今天重新對焦。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["fitness"], sourceType: "original" },
  { text: "換一條路走，熟悉的城市也會回答新問題。", author: "Life Quest Map", moods: ["out", "bored"], categories: ["exploration"], sourceType: "original" },
  { text: "完成得小也沒關係；完成會替自己累積可信度。", author: "Life Quest Map", moods: ["tired", "good"], categories: ["discipline"], sourceType: "original" },
  { text: "把學到的一點點說出去，知識就開始發光。", author: "Life Quest Map", moods: ["social", "bored"], categories: ["learning", "social"], sourceType: "original" },
  { text: "身體的訊號不是干擾，是同行的提醒。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["fitness", "discipline"], sourceType: "original" },
  { text: "善意不必盛大，剛好抵達就很珍貴。", author: "Life Quest Map", moods: ["social", "good"], categories: ["social"], sourceType: "original" },
  { text: "慢慢看，也是一種抵達。", author: "Life Quest Map", moods: ["quiet", "out"], categories: ["creativity", "exploration"], sourceType: "original" },
  { text: "提問讓平凡的一天多了一個入口。", author: "Life Quest Map", moods: ["good", "bored"], categories: ["learning"], sourceType: "original" },
  { text: "先把桌面清出一小塊，心裡也會多一點空白。", author: "Life Quest Map", moods: ["tired", "quiet"], categories: ["discipline"], sourceType: "original" },
  { text: "創作不是證明自己，而是把感受留下一點形狀。", author: "Life Quest Map", moods: ["quiet", "good"], categories: ["creativity"], sourceType: "original" },
  { text: "不急著變得厲害，先願意再試一次。", author: "Life Quest Map", moods: ["bored", "tired"], categories: ["discipline", "learning"], sourceType: "original" }
];

const publicDomainQuotes: QuoteInput[] = [
  { text: "成功的祕密，是持續努力讓自己進步。", originalText: "The secret of success is to try always to improve yourself.", originalLanguage: "English", author: "William Walker Atkinson", work: "The Power of Concentration", moods: ["good", "bored"], categories: ["learning"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/1570", note: translated },
  { text: "開始得好，事情就已完成一半。", originalText: "Well begun is half done.", originalLanguage: "English", author: "Aristotle", work: "Nicomachean Ethics", moods: ["bored", "good"], categories: ["discipline"], sourceType: "paraphrase", sourceUrl: "https://en.wikisource.org/wiki/Nicomachean_Ethics_(Weldon_translation)/Book_I", note: "依《尼各馬科倫理學》「開端超過一半」的意旨轉述，非逐字引文。" },
  { text: "任何善舉，無論多小，都不會白費。", originalText: "No act of kindness, no matter how small, is ever wasted.", originalLanguage: "English", author: "Aesop", work: "The Lion and the Mouse", moods: ["social", "good"], categories: ["social"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/21", note: translated },
  { text: "心靈會染上它慣常思考的顏色。", originalText: "The soul becomes dyed with the colour of its thoughts.", originalLanguage: "English", author: "Marcus Aurelius", work: "Meditations", moods: ["quiet", "tired"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/2680", note: translated },
  { text: "千里之行，始於足下。", originalText: "A journey of a thousand li begins beneath one's feet.", originalLanguage: "Classical Chinese", author: "Laozi", work: "Tao Te Ching", moods: ["bored", "out"], categories: ["exploration", "discipline"], sourceType: "public-domain", sourceUrl: "https://ctext.org/dao-de-jing", note: "古典原文意譯。" },
  { text: "跟隨自然的步調：它的祕密是耐心。", originalText: "Adopt the pace of nature: her secret is patience.", originalLanguage: "English", author: "Ralph Waldo Emerson", work: "Essays", moods: ["tired", "quiet"], categories: ["fitness"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/16643", note: translated },
  { text: "現在就起身，別再拖延；一刻鐘後你會更願意開始。", originalText: "Get up now, if you can. Do not put it off.", originalLanguage: "English", author: "Marcus Aurelius", work: "Meditations", moods: ["bored", "tired"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/2680", note: translated },
  { text: "做自己的朋友，才能把友誼帶給別人。", originalText: "The only way to have a friend is to be one.", originalLanguage: "English", author: "Ralph Waldo Emerson", work: "Essays", moods: ["social", "good"], categories: ["social"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/16643", note: translated },
  { text: "我們的生命，會被心念塑造成它的樣子。", originalText: "All that we are is the result of what we have thought.", originalLanguage: "English", author: "Buddha", work: "Dhammapada", moods: ["quiet", "tired"], categories: ["discipline"], sourceType: "paraphrase", sourceUrl: "https://www.gutenberg.org/ebooks/2017", note: "依《法句經》開篇意旨轉述；常見的 “What we think, we become.” 並非該譯本逐字句。" },
  { text: "做得好，勝過說得好。", originalText: "Well done is better than well said.", originalLanguage: "English", author: "Benjamin Franklin", work: "Poor Richard's Almanack", moods: ["bored", "good"], categories: ["fitness", "discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/148", note: translated },
  { text: "失去的時間，再也找不回來。", originalText: "Lost time is never found again.", originalLanguage: "English", author: "Benjamin Franklin", work: "Poor Richard's Almanack", moods: ["bored", "tired"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/148", note: translated },
  { text: "我們能掌握的是自己的心，而不是外在事件。", originalText: "You have power over your mind — not outside events.", originalLanguage: "English", author: "Marcus Aurelius", work: "Meditations", moods: ["quiet", "tired"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/2680", note: translated },
  { text: "希望是那有羽毛的東西。", originalText: "Hope is the thing with feathers.", originalLanguage: "English", author: "Emily Dickinson", work: "Hope is the thing with feathers", moods: ["tired", "quiet"], categories: ["creativity"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/12242", note: translated },
  { text: "忠於你自己。", originalText: "To thine own self be true.", originalLanguage: "English", author: "William Shakespeare", work: "Hamlet", moods: ["quiet", "good"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/1524", note: translated },
  { text: "有時候，早餐前我相信過六件不可能的事。", originalText: "Why, sometimes I've believed as many as six impossible things before breakfast.", originalLanguage: "English", author: "Lewis Carroll", work: "Through the Looking-Glass", moods: ["out", "bored"], categories: ["exploration"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/12", note: translated },
  { text: "沒有什麼魅力，能勝過一顆溫柔的心。", originalText: "There is no charm equal to tenderness of heart.", originalLanguage: "English", author: "Jane Austen", work: "Emma", moods: ["social", "quiet"], categories: ["social"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/158", note: translated },
  { text: "我不是鳥，沒有網能困住我。", originalText: "I am no bird; and no net ensnares me.", originalLanguage: "English", author: "Charlotte Brontë", work: "Jane Eyre", moods: ["good", "quiet"], categories: ["creativity"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/1260", note: translated },
  { text: "我們所見、所像的一切，只是夢中之夢。", originalText: "All that we see or seem is but a dream within a dream.", originalLanguage: "English", author: "Edgar Allan Poe", work: "A Dream Within a Dream", moods: ["tired", "good"], categories: ["discipline"], sourceType: "public-domain", sourceUrl: "https://www.gutenberg.org/ebooks/1066", note: translated }
];

const paraphraseQuotes: QuoteInput[] = [
  { text: "在未知裡保持勇氣，旅程會帶你看見新的自己。", author: "Life Quest Map", creator: "Studio Ghibli", work: "神隱少女", moods: ["tired", "out"], categories: ["exploration"], sourceType: "paraphrase", sourceUrl: "https://www.ghibli.jp/works/chihiro/", note: "依作品主題轉述，非角色台詞。" },
  { text: "把想去的地方說出口，再為它走一步。", author: "Life Quest Map", creator: "Eiichiro Oda", work: "ONE PIECE", moods: ["social", "good"], categories: ["social"], sourceType: "paraphrase", sourceUrl: "https://one-piece.com/", note: "依作品主題轉述，非原作台詞。" },
  { text: "暫停一下聽聽自己，方向也許就藏在那裡。", author: "Life Quest Map", creator: "Pixar", work: "靈魂急轉彎", moods: ["quiet", "tired"], categories: ["discipline"], sourceType: "paraphrase", sourceUrl: "https://www.pixar.com/soul", note: "依作品主題轉述，非電影台詞。" },
  { text: "往海的方向試試看，新的能力常在第一步後浮現。", author: "Life Quest Map", creator: "Walt Disney Animation Studios", work: "海洋奇緣", moods: ["out", "good"], categories: ["exploration"], sourceType: "paraphrase", sourceUrl: "https://movies.disney.com/moana", note: "依作品主題轉述，非電影台詞。" },
  { text: "把好奇留給日常，練習會慢慢長成魔法。", author: "Life Quest Map", creator: "Hayao Miyazaki", work: "魔女宅急便", moods: ["bored", "good"], categories: ["learning"], sourceType: "paraphrase", sourceUrl: "https://www.ghibli.jp/works/majo/", note: "依作品主題轉述，非電影台詞。" },
  { text: "和夥伴互相照應，平凡的一步也會更有力量。", author: "Life Quest Map", creator: "Marvel Studios", work: "復仇者聯盟", moods: ["social", "tired"], categories: ["social"], sourceType: "paraphrase", sourceUrl: "https://www.marvel.com/movies/the-avengers", note: "依作品主題轉述，非電影台詞。" },
  { text: "即使隔著距離，也能把在意化成一個行動。", author: "Life Quest Map", creator: "Makoto Shinkai", work: "你的名字", moods: ["quiet", "good"], categories: ["creativity"], sourceType: "paraphrase", sourceUrl: "https://www.coamix.co.jp/", note: "依作品主題轉述，非電影台詞。" },
  { text: "把眼前的小謎題解開，下一個世界就會亮起來。", author: "Life Quest Map", creator: "Nintendo", work: "薩爾達傳說", moods: ["tired", "bored"], categories: ["learning"], sourceType: "paraphrase", sourceUrl: "https://www.nintendo.com/", note: "依系列主題轉述，非遊戲台詞。" },
  { text: "在平凡的日子裡，也替自己留下一點前進的節奏。", author: "Life Quest Map", creator: "YOASOBI", work: "群青", moods: ["tired", "good"], categories: ["discipline"], sourceType: "paraphrase", sourceUrl: "https://www.yoasobi-music.jp/", note: "依作品主題轉述，非歌詞。" },
  { text: "先學著站在自己這一邊，再把溫柔帶給世界。", author: "Life Quest Map", creator: "BTS", work: "Answer: Love Myself", moods: ["good", "quiet"], categories: ["creativity"], sourceType: "paraphrase", sourceUrl: "https://ibighit.com/bts/eng/", note: "依作品主題轉述，非歌詞。" },
  { text: "光總會再出現；今天先把窗打開一點。", author: "Life Quest Map", creator: "The Beatles", work: "Here Comes the Sun", moods: ["out", "quiet"], categories: ["exploration"], sourceType: "paraphrase", sourceUrl: "https://www.thebeatles.com/", note: "依作品主題轉述，非歌詞。" },
  { text: "把一件小事做好，也是在為明天的自己留下線索。", author: "Life Quest Map", creator: "Pixar", work: "玩具總動員", moods: ["bored", "good"], categories: ["discipline"], sourceType: "paraphrase", sourceUrl: "https://www.pixar.com/toy-story", note: "依作品主題轉述，非電影台詞。" }
];

export const reflectionQuotes: ReflectionQuote[] = [
  ...originalQuotes.map((quote, index) => ({ ...quote, id: `lqm-original-${index + 1}` })),
  ...publicDomainQuotes.map((quote, index) => ({ ...quote, id: index < 12 ? `public-domain-${index + 1}` : `literature-${index - 11}` })),
  ...paraphraseQuotes.map((quote, index) => ({ ...quote, id: `inspired-${index + 1}` }))
];
