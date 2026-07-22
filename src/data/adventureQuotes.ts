import type { AdventureQuote, CityEchoCategory, Quest, QuestCategory } from "@/types";

export const cityEchoCategoryLabels: Record<CityEchoCategory, string> = {
  exploration: "探索的回聲", connection: "相遇的回聲", rest: "休息的回聲", awareness: "察覺的回聲",
  courage: "踏出一步的回聲", creation: "留下痕跡的回聲", daily: "城市迴響"
};

const original = (id: string, text: string, categories: CityEchoCategory[], tags?: string[]): AdventureQuote => ({ id, text, categories, tags, sourceType: "original", sourceTitle: "Life Quest Map", sourceStatus: "original", enabled: true, weight: 3 });
const publicDomain = (id: string, text: string, author: string, work: string, dynasty: string, categories: CityEchoCategory[]): AdventureQuote => ({ id, text, author, work, dynasty, categories, sourceType: "public_domain", sourceTitle: work, sourceStatus: "verified", enabled: true, weight: 1 });
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
  external({ id: "pro-deft-personal-experience", text: "人生在世，不太需要其他人的意見；有些事情不親身經歷，是不會真正明白的。", sourceType: "proPlayer", sourceTitle: "《英雄聯盟》職業選手語錄", speaker: "Deft", game: "《英雄聯盟》", sourceStatus: "paraphrase", tags: ["經歷", "選擇", "人生"], enabled: true }, ["awareness", "daily"])
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
