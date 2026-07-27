import { describe, expect, it } from "vitest";
import type { AdventureQuote } from "@/types";
import {
  filterStudioQuotes,
  formatStudioQuoteAttribution,
  quoteSourceGroup,
  quoteThemes,
} from "./quoteStudioFilters";

const quote = (patch: Partial<AdventureQuote>): AdventureQuote => ({
  id: "test",
  text: "勇敢向前",
  categories: ["courage"],
  sourceType: "original",
  sourceStatus: "original",
  sourceTitle: "Life Quest Map",
  enabled: true,
  ...patch,
});

describe("quote studio filters", () => {
  it("searches text, speaker, work, and safely ignores optional fields", () => {
    const quotes = [quote({ id: "one", speaker: "Ada", work: "Notes" }), quote({ id: "two", text: "休息一下", sourceType: "movie" })];
    expect(filterStudioQuotes(quotes, { searchQuery: "ada", sourceGroup: "all", theme: "all" }).map((item) => item.id)).toEqual(["one"]);
    expect(filterStudioQuotes(quotes, { searchQuery: "notes", sourceGroup: "all", theme: "all" }).map((item) => item.id)).toEqual(["one"]);
    expect(filterStudioQuotes(quotes, { searchQuery: "不存在", sourceGroup: "all", theme: "all" })).toEqual([]);
  });

  it("maps sources and combines source, theme, and search with AND logic", () => {
    const game = quote({ id: "game", text: "勇敢探索", sourceType: "game", themes: ["courage", "exploration"] });
    const movie = quote({ id: "movie", text: "勇敢探索", sourceType: "movie", themes: ["courage"] });
    expect(quoteSourceGroup(game)).toBe("game");
    expect(filterStudioQuotes([game, movie], { searchQuery: "探索", sourceGroup: "game", theme: "exploration" }).map((item) => item.id)).toEqual(["game"]);
  });

  it("uses categories then intents when legacy quotes lack themes", () => {
    expect(quoteThemes(quote({ themes: undefined, categories: ["connection"] }))).toEqual(["relationships"]);
    expect(quoteThemes(quote({ themes: undefined, categories: [], intents: ["resilience"] }))).toEqual(["recovery"]);
  });

  it("formats compact social attribution without URLs or long SEO titles", () => {
    expect(formatStudioQuoteAttribution(quote({ speaker: "梅西", game: "FIFA" }))).toBe("—— 梅西，《FIFA》");
    expect(formatStudioQuoteAttribution(quote({ author: "王維" }))).toBe("—— 王維");
    expect(formatStudioQuoteAttribution(quote({ speaker: undefined, author: undefined, work: "山居秋暝" }))).toBe("——《山居秋暝》");
    expect(formatStudioQuoteAttribution(quote({ speaker: undefined, author: undefined, work: undefined, sourceTitle: "https://example.test/article" }))).toBeNull();
  });
});
