import type { GrowthFocus } from "@/types";
import type { Mood } from "@/data/microAdventures";

export type QuoteSourceType = "public-domain" | "original" | "paraphrase" | "movie" | "anime" | "song";

export interface ReflectionQuote {
  id: string;
  text: string;
  author: string;
  work?: string;
  character?: string;
  performer?: string;
  creator?: string;
  moods: Mood[];
  categories: GrowthFocus[];
  sourceType: QuoteSourceType;
  sourceName?: string;
  sourceUrl?: string;
  note?: string;
}

const original: Array<[string, Mood[], GrowthFocus[]]> = [
  ["今天不需要證明全部，只要照顧下一步。", ["tired", "quiet"], ["discipline", "fitness"]],
  ["好奇心不是岔路，它常是新的入口。", ["bored", "good"], ["learning", "exploration"]],
  ["把任務縮小，行動就有了空間。", ["tired", "bored"], ["discipline"]],
  ["一段真誠的回應，也能讓一天有重量。", ["social", "good"], ["social"]],
  ["休息不是退後，是為下一次前進留白。", ["tired", "quiet"], ["fitness"]],
  ["你不必先有把握，才可以開始練習。", ["bored", "good"], ["learning", "creativity"]],
  ["不求完美的第一稿，最容易帶你抵達第二稿。", ["quiet", "bored"], ["creativity"]],
  ["把注意力交給眼前的十分鐘。", ["tired", "quiet"], ["discipline", "fitness"]],
  ["出門看看，世界會替你補上一點新鮮感。", ["out", "bored"], ["exploration"]],
  ["小小的整理，是對明天的自己說：我有留位置給你。", ["tired", "good"], ["discipline"]],
  ["不知道也沒關係，提出一個問題就已經在學習。", ["social", "bored"], ["learning", "social"]],
  ["能讓人放鬆的節奏，通常比衝刺更長久。", ["tired", "quiet"], ["fitness", "discipline"]],
  ["把喜歡說出來，關係才聽得見。", ["social", "good"], ["social"]],
  ["你看見的細節，會慢慢長成你的風格。", ["quiet", "out"], ["creativity", "exploration"]],
  ["今天學到的一點，明天就多一個可以使用的工具。", ["good", "bored"], ["learning"]],
  ["溫柔地調整方向，也是一種堅持。", ["tired", "quiet"], ["discipline"]],
  ["留下一句記錄，讓感受有地方安放。", ["quiet", "good"], ["creativity"]],
  ["真正的進度，是你願意再回來一次。", ["bored", "tired"], ["discipline", "learning"]]
];

const publicDomain: Array<[string, string, string, string, Mood[], GrowthFocus[]]> = [
  ["The secret of success is to try always to improve yourself.", "William Walker Atkinson", "The Power of Concentration", "https://www.gutenberg.org/ebooks/1570", ["good", "bored"], ["learning"]],
  ["Well begun is half done.", "Aristotle", "Attributed proverb", "https://en.wikisource.org/wiki/Page:Aristotle%27s_Nicomachean_Ethics,_translated_by_Welldon_(1897).djvu/34", ["bored", "good"], ["discipline"]],
  ["No act of kindness, no matter how small, is ever wasted.", "Aesop", "The Lion and the Mouse", "https://www.gutenberg.org/ebooks/21", ["social", "good"], ["social"]],
  ["The soul becomes dyed with the colour of its thoughts.", "Marcus Aurelius", "Meditations", "https://www.gutenberg.org/ebooks/2680", ["quiet", "tired"], ["discipline"]],
  ["The journey of a thousand miles begins with one step.", "Laozi", "Tao Te Ching", "https://en.wikisource.org/wiki/Tao_Te_Ching", ["bored", "out"], ["exploration", "discipline"]],
  ["Adopt the pace of nature: her secret is patience.", "Ralph Waldo Emerson", "Essays", "https://www.gutenberg.org/ebooks/16643", ["tired", "quiet"], ["fitness"]],
  ["The world is full of magic things, patiently waiting for our senses to grow sharper.", "W. B. Yeats", "Ideas of Good and Evil", "https://www.gutenberg.org/ebooks/49613", ["out", "quiet"], ["exploration"]],
  ["Be yourself; everyone else is already taken.", "Oscar Wilde", "Attributed saying", "https://www.gutenberg.org/ebooks/875", ["good", "social"], ["creativity"]],
  ["The only way to have a friend is to be one.", "Ralph Waldo Emerson", "Essays", "https://www.gutenberg.org/ebooks/16643", ["social", "good"], ["social"]],
  ["What we think, we become.", "Buddha", "Dhammapada", "https://www.gutenberg.org/ebooks/2017", ["quiet", "tired"], ["discipline"]],
  ["Well done is better than well said.", "Benjamin Franklin", "Poor Richard's Almanack", "https://www.gutenberg.org/ebooks/148", ["bored", "good"], ["fitness", "discipline"]],
  ["Lost time is never found again.", "Benjamin Franklin", "Poor Richard's Almanack", "https://www.gutenberg.org/ebooks/148", ["bored", "tired"], ["discipline"]],
];

const literature: Array<[string, string, string, string, Mood[], GrowthFocus[]]> = [
  ["Hope is the thing with feathers.", "Emily Dickinson", "Poem 254", "https://www.gutenberg.org/ebooks/12242", ["tired", "quiet"], ["creativity"]],
  ["To thine own self be true.", "William Shakespeare", "Hamlet", "https://www.gutenberg.org/ebooks/1524", ["quiet", "good"], ["discipline"]],
  ["Why, sometimes I've believed as many as six impossible things before breakfast.", "Lewis Carroll", "Through the Looking-Glass", "https://www.gutenberg.org/ebooks/12", ["out", "bored"], ["exploration"]],
  ["There is no charm equal to tenderness of heart.", "Jane Austen", "Emma", "https://www.gutenberg.org/ebooks/158", ["social", "quiet"], ["social"]],
  ["I am no bird; and no net ensnares me.", "Charlotte Brontë", "Jane Eyre", "https://www.gutenberg.org/ebooks/1260", ["good", "quiet"], ["creativity"]],
  ["All that we see or seem is but a dream within a dream.", "Edgar Allan Poe", "A Dream Within a Dream", "https://www.gutenberg.org/ebooks/1066", ["tired", "good"], ["discipline"]]
];

const paraphrases: Array<[string, string, string, string, Mood[], GrowthFocus[]]> = [
  ["即使害怕，也能先把腳步放到下一格。", "Studio Ghibli", "《神隱少女》", "https://www.ghibli.jp/works/chihiro/", ["tired", "out"], ["exploration"]],
  ["相信夥伴的時候，也別忘了相信自己。", "Eiichiro Oda", "《ONE PIECE》", "https://one-piece.com/", ["social", "good"], ["social"]],
  ["專注修好眼前能修好的小事。", "Pixar", "《靈魂急轉彎》", "https://www.pixar.com/soul", ["quiet", "tired"], ["discipline"]],
  ["願望要落地，才會變成旅程。", "Walt Disney Animation Studios", "《海洋奇緣》", "https://movies.disney.com/moana", ["out", "good"], ["exploration"]],
  ["把今天的笨拙練習，留給明天的自己。", "Hayao Miyazaki", "《魔女宅急便》", "https://www.ghibli.jp/works/majo/", ["bored", "good"], ["learning"]],
  ["不必獨自完成所有難題；開口也是勇氣。", "Marvel Studios", "《復仇者聯盟》", "https://www.marvel.com/movies/the-avengers", ["social", "tired"], ["social"]],
  ["在微小的日常裡，也能找到值得守護的光。", "Makoto Shinkai", "《你的名字》", "https://www.coamix.co.jp/", ["quiet", "good"], ["creativity"]],
  ["把失敗當成資訊，而不是身分。", "Nintendo", "《薩爾達傳說》", "https://www.nintendo.com/", ["tired", "bored"], ["learning"]],
  ["走得慢沒關係，仍然在前往自己的方向。", "YOASOBI", "〈群青〉", "https://www.yoasobi-music.jp/", ["tired", "good"], ["discipline"]],
  ["先做出聲音，再慢慢找到自己的旋律。", "BTS", "〈Answer: Love Myself〉", "https://ibighit.com/bts/eng/", ["good", "quiet"], ["creativity"]],
  ["把平凡的一天過得清醒，就是一種冒險。", "The Beatles", "〈Here Comes the Sun〉", "https://www.thebeatles.com/", ["out", "quiet"], ["exploration"]],
  ["當你願意再試一次，故事就還沒有結束。", "Pixar", "《玩具總動員》", "https://www.pixar.com/toy-story", ["bored", "good"], ["discipline"]]
];

export const reflectionQuotes: ReflectionQuote[] = [
  ...original.map(([text, moods, categories], index) => ({ id: `lqm-original-${index + 1}`, text, author: "Life Quest Map", moods, categories, sourceType: "original" as const, sourceName: "Life Quest Map 原創" })),
  ...publicDomain.map(([text, author, work, sourceUrl, moods, categories], index) => ({ id: `public-domain-${index + 1}`, text, author, work, moods, categories, sourceType: "public-domain" as const, sourceName: work, sourceUrl })),
  ...literature.map(([text, author, work, sourceUrl, moods, categories], index) => ({ id: `literature-${index + 1}`, text, author, work, moods, categories, sourceType: "public-domain" as const, sourceName: work, sourceUrl })),
  ...paraphrases.map(([text, creator, work, sourceUrl, moods, categories], index) => ({ id: `inspired-${index + 1}`, text, author: "Life Quest Map", creator, work, moods, categories, sourceType: "paraphrase" as const, sourceName: work, sourceUrl, note: "此為本專案依作品主題撰寫的原創轉述，非原文台詞或歌詞。" }))
];
