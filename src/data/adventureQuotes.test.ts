import { describe, expect, it } from "vitest";
import { adventureQuotes, inferCityEchoCategory, pickAdventureQuote } from "@/data/adventureQuotes";
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
});

describe("adventure quote attributions", () => {
  it("gives every quote a unique non-empty id and non-empty text", () => {
    expect(adventureQuotes.every((quote) => quote.id.trim().length > 0 && quote.text.trim().length > 0)).toBe(true);
    expect(new Set(adventureQuotes.map((quote) => quote.id)).size).toBe(adventureQuotes.length);
  });

  it("has a source type and source status on every quote", () => {
    expect(adventureQuotes.every((quote) => Boolean(quote.sourceType && quote.sourceStatus))).toBe(true);
  });

  it("requires named speakers for game and pro player quotations", () => {
    expect(adventureQuotes.filter((quote) => quote.sourceType === "game" || quote.sourceType === "proPlayer").every((quote) => Boolean(quote.speaker))).toBe(true);
  });

  it("formats source status and skin information for users", () => {
    const skin = adventureQuotes.find((quote) => quote.id === "lol-lee-sin-conquer-yourself")!;
    const movieParaphrase = adventureQuotes.find((quote) => quote.id === "movie-truman-world-prison")!;
    const deft = adventureQuotes.find((quote) => quote.id === "pro-deft-personal-experience")!;
    expect(formatAdventureQuoteAttribution(skin)).toBe("——李星・神拳，《英雄聯盟》");
    expect(formatAdventureQuoteAttribution(movieParaphrase)).toBe("——改寫自《楚門的世界》");
    expect(formatAdventureQuoteAttribution(deft)).toBe("——意譯自 Deft，《英雄聯盟》職業選手");
  });

  it("keeps excluded misattributed quotes out and uses 貫穿 for ShowMaker", () => {
    const text = adventureQuotes.map((quote) => quote.text).join("\n");
    expect(text).not.toContain("不管前方的路有多苦");
    expect(text).not.toContain("人永遠不知道，哪次不經意說了再見");
    expect(adventureQuotes.find((quote) => quote.id === "pro-showmaker-failure-in-life")?.text).toContain("貫穿");
    expect(text).not.toContain("失敗總是貫徹人生始終");
  });
});
