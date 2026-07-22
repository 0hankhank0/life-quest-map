import type { AdventureQuote, CityEchoCategory, Quest, QuestCategory } from "@/types";

export const cityEchoCategoryLabels: Record<CityEchoCategory, string> = {
  exploration: "探索的回聲",
  connection: "相遇的回聲",
  rest: "休息的回聲",
  awareness: "察覺的回聲",
  courage: "踏出一步的回聲",
  creation: "留下痕跡的回聲",
  daily: "城市迴響"
};

const original = (id: string, text: string, categories: CityEchoCategory[], tags?: string[]): AdventureQuote => ({ id, text, categories, tags, sourceType: "original", enabled: true, weight: 3 });
const publicDomain = (id: string, text: string, author: string, work: string, dynasty: string, categories: CityEchoCategory[]): AdventureQuote => ({ id, text, author, work, dynasty, categories, sourceType: "public_domain", enabled: true, weight: 1 });

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
  publicDomain("pd-wangwei-1", "行到水窮處，坐看雲起時。", "王維", "終南別業", "唐", ["rest", "awareness"]),
  publicDomain("pd-wangwei-2", "深林人不知，明月來相照。", "王維", "竹里館", "唐", ["awareness", "rest"]),
  publicDomain("pd-taoyuanming-1", "採菊東籬下，悠然見南山。", "陶淵明", "飲酒·其五", "東晉", ["awareness", "rest"]),
  publicDomain("pd-sushi-1", "何夜無月？何處無竹柏？但少閑人如吾兩人者耳。", "蘇軾", "記承天寺夜遊", "北宋", ["awareness", "connection"]),
  publicDomain("pd-sushi-2", "回首向來蕭瑟處，歸去，也無風雨也無晴。", "蘇軾", "定風波·莫聽穿林打葉聲", "北宋", ["courage", "daily"])
];

const categoryMap: Record<QuestCategory, CityEchoCategory> = {
  exploration: "exploration",
  social: "connection",
  creativity: "creation",
  learning: "courage",
  fitness: "rest",
  discipline: "daily"
};

const keywordCategories: Array<[CityEchoCategory, RegExp]> = [
  ["rest", /休息|放鬆|睡眠|停下|呼吸|散步|靜|茶|聽一首歌/i],
  ["awareness", /觀察|天空|光線|聲音|注意|看見|感受|月|風/i],
  ["connection", /朋友|家人|聊天|陪伴|訊息|一起|對話/i],
  ["exploration", /探索|路線|一條路|不同路|新地方|散步|走走|地圖/i],
  ["courage", /嘗試|不確定|踏出|面對|第一次/i],
  ["creation", /創作|畫|寫|拍|記錄|表達|塗鴉/i]
];

export function inferCityEchoCategory(quest: Pick<Quest, "title" | "description" | "category" | "type">, tags: readonly string[] = []): CityEchoCategory {
  const text = `${quest.title} ${quest.description} ${tags.join(" ")}`;
  const keyword = keywordCategories.find(([, pattern]) => pattern.test(text));
  if (keyword) return keyword[0];
  if (quest.type === "map") return "exploration";
  return categoryMap[quest.category] ?? "daily";
}

function weightedPick(quotes: readonly AdventureQuote[], random: () => number): AdventureQuote {
  const total = quotes.reduce((sum, quote) => sum + Math.max(1, quote.weight ?? 1), 0);
  let cursor = random() * total;
  for (const quote of quotes) {
    cursor -= Math.max(1, quote.weight ?? 1);
    if (cursor <= 0) return quote;
  }
  return quotes[quotes.length - 1];
}

export function pickAdventureQuote(category: CityEchoCategory, recentIds: readonly string[] = [], random = Math.random): AdventureQuote {
  const enabled = adventureQuotes.filter((quote) => quote.enabled);
  const matching = enabled.filter((quote) => quote.categories.includes(category));
  const fallback = enabled.filter((quote) => quote.categories.includes("daily") && quote.sourceType === "original");
  const candidates = matching.length ? matching : fallback.length ? fallback : enabled;
  const fresh = candidates.filter((quote) => !recentIds.includes(quote.id));
  return weightedPick(fresh.length ? fresh : candidates, random);
}
