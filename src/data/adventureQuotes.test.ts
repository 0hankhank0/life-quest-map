import { describe, expect, it } from "vitest";
import { inferCityEchoCategory, pickAdventureQuote } from "@/data/adventureQuotes";

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
