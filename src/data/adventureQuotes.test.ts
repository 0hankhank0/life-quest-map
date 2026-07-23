import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { adventureQuotes, inferCityEchoCategory, inferQuestIntents, pickAdventureQuote, pickAdventureQuoteForQuest, scoreAdventureQuote } from "@/data/adventureQuotes";
import { formatAdventureQuoteAttribution } from "@/lib/adventureQuoteAttribution";

const baseQuest = { title: "一般任務", description: "", category: "discipline" as const, type: "daily" as const };

describe("city echo selection", () => {
  it("infers a category from meaningful task content before the legacy quest category", () => {
    expect(inferCityEchoCategory({ ...baseQuest, title: "換一條路回家", category: "discipline" })).toBe("exploration");
    expect(inferCityEchoCategory({ ...baseQuest, title: "和朋友多聊一會兒" })).toBe("connection");
    expect(inferCityEchoCategory({ ...baseQuest, title: "", description: "" })).toBe("daily");
  });

  it("does not immediately repeat a recent matching quote when alternatives exist", () => {
    const quote = pickAdventureQuote("rest", ["city-3"], () => 0);
    expect(quote.id).not.toBe("city-3");
  });

  it("safely falls back when all candidates are recent", () => {
    const quote = pickAdventureQuote("connection", ["city-10", "city-14", "pd-sushi-1"], () => 0);
    expect(quote.categories).toContain("connection");
  });

  it("uses task intents to prefer a relevant city echo over only the legacy category", () => {
    const quest = { ...baseQuest, title: "Take a walk and stretch", description: "A small fitness reset", category: "discipline" as const };
    const result = pickAdventureQuoteForQuest(quest, [], { random: () => 0 });
    expect(inferQuestIntents(quest)).toContain("fitness");
    expect(result.quote.intents).toContain("fitness");
    expect(scoreAdventureQuote(result.quote, { category: result.category, intents: inferQuestIntents(quest), text: quest.title })).toBeGreaterThan(0);
  });
});

describe("adventure quote attributions", () => {
  it("gives every quote a unique non-empty id and non-empty text", () => {
    expect(adventureQuotes.every((quote) => quote.id.trim().length > 0 && quote.text.trim().length > 0)).toBe(true);
    expect(new Set(adventureQuotes.map((quote) => quote.id)).size).toBe(adventureQuotes.length);
  });

  it("has a source type and source status on every quote", () => {
    expect(adventureQuotes.every((quote) => Boolean(quote.sourceType && quote.sourceStatus))).toBe(true);
  });

  it("enriches every enabled quote with matching intents and a specificity", () => {
    expect(adventureQuotes.filter((quote) => quote.enabled).every((quote) => quote.intents?.length && quote.specificity)).toBe(true);
  });

  it("keeps quote IDs and exact quote text unique", () => {
    expect(new Set(adventureQuotes.map((quote) => quote.text)).size).toBe(adventureQuotes.length);
  });

  it("keeps categories, sources, text lengths, and normalized text unique", () => {
    const categories = new Set(["exploration", "connection", "rest", "awareness", "courage", "creation", "daily"]);
    const normalize = (text: string) => text.replace(/[\s\p{P}]/gu, "");
    expect(adventureQuotes.every((quote) => quote.categories.length > 0 && quote.categories.every((category) => categories.has(category)))).toBe(true);
    expect(adventureQuotes.every((quote) => Boolean(quote.speaker || quote.author || quote.sourceTitle))).toBe(true);
    expect(adventureQuotes.every((quote) => [...quote.text].length <= 64)).toBe(true);
    expect(new Set(adventureQuotes.map((quote) => normalize(quote.text))).size).toBe(adventureQuotes.length);
  });

  it("keeps every newly added quote source documented and selectable", () => {
    const addedIds = adventureQuotes.filter((quote) => /^(anime|science|literature|philosophy|creator|game-|football-(messi-dream|irankunda|terceros|messi-group))/.test(quote.id)).map((quote) => quote.id);
    const sources = readFileSync(resolve(process.cwd(), "docs/QUOTE_SOURCES.md"), "utf8");
    expect(addedIds).toHaveLength(26);
    expect(addedIds.every((id) => sources.includes(`\`${id}\``))).toBe(true);
    for (const id of addedIds) {
      const expected = adventureQuotes.find((quote) => quote.id === id)!;
      expect(pickAdventureQuote(expected.categories[0], adventureQuotes.filter((quote) => quote.id !== id).map((quote) => quote.id), () => 0).id).toBe(id);
    }
  });

  it("balances the added catalog across the requested fields", () => {
    const added = adventureQuotes.filter((quote) => /^(anime|science|literature|philosophy|creator|game-|football-(messi-dream|irankunda|terceros|messi-group))/.test(quote.id));
    const fieldPrefixes = ["anime-", "football-", "science-", "literature-", "philosophy-", "creator-", "game-"];
    for (const prefix of fieldPrefixes) expect(added.filter((quote) => quote.id.startsWith(prefix)).length).toBeGreaterThanOrEqual(3);
  });

  it("requires named speakers for game and pro player quotations, except explicitly labelled official slogans", () => {
    const spokenQuotes = adventureQuotes.filter((quote) => (quote.sourceType === "game" || quote.sourceType === "proPlayer") && !quote.note?.includes("官方宣傳語"));
    expect(spokenQuotes.every((quote) => Boolean(quote.speaker))).toBe(true);
    expect(adventureQuotes.filter((quote) => quote.sourceType === "game" && !quote.speaker).every((quote) => quote.note?.includes("官方宣傳語") && quote.note?.includes("不歸屬角色"))).toBe(true);
  });

  it("formats source status and skin information for users", () => {
    const skin = adventureQuotes.find((quote) => quote.id === "lol-lee-sin-conquer-yourself")!;
    const movieParaphrase = adventureQuotes.find((quote) => quote.id === "movie-truman-world-prison")!;
    const deft = adventureQuotes.find((quote) => quote.id === "pro-deft-personal-experience")!;
    expect(formatAdventureQuoteAttribution(skin)).toBe("——李星・神拳，《英雄聯盟》");
    expect(formatAdventureQuoteAttribution(movieParaphrase)).toBe("——改寫自《楚門的世界》");
    expect(formatAdventureQuoteAttribution(deft)).toBe("——意譯自 Deft，《英雄聯盟》職業選手");
  });

  it("formats football and unverified proverb attributions accurately", () => {
    const messi = adventureQuotes.find((quote) => quote.id === "football-messi-team-counts")!;
    const modric = adventureQuotes.find((quote) => quote.id === "football-modric-believe-forward")!;
    const proverb = adventureQuotes.find((quote) => quote.id === "proverb-dreams-greatness")!;
    expect(formatAdventureQuoteAttribution(messi)).toBe("——梅西｜FIFA 訪談中譯");
    expect(formatAdventureQuoteAttribution(modric)).toBe("——意譯自 盧卡・莫德里奇｜FIFA 專訪");
    expect(formatAdventureQuoteAttribution(proverb)).toBe("——佚名｜現代流傳格言（出處待考）");
  });

  it("requires traceable metadata for football and athlete quotations", () => {
    const modernQuotes = adventureQuotes.filter((quote) => quote.sourceType === "football" || quote.sourceType === "athlete");
    expect(modernQuotes).not.toHaveLength(0);
    expect(modernQuotes.every((quote) => Boolean(quote.speaker && quote.sourceTitle && quote.sourceUrl))).toBe(true);
    const proverb = adventureQuotes.find((quote) => quote.id === "proverb-dreams-greatness")!;
    expect(proverb).toMatchObject({ author: "佚名", sourceStatus: "unverified" });
    expect(proverb.speaker).toBeUndefined();
  });

  it("keeps excluded misattributed quotes out and uses 貫穿 for ShowMaker", () => {
    const text = adventureQuotes.map((quote) => quote.text).join("\n");
    expect(text).not.toContain("不管前方的路有多苦");
    expect(text).not.toContain("人永遠不知道，哪次不經意說了再見");
    expect(adventureQuotes.find((quote) => quote.id === "pro-showmaker-failure-in-life")?.text).toContain("貫穿");
    expect(text).not.toContain("失敗總是貫徹人生始終");
  });
});
