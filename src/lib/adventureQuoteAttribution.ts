import type { AdventureQuote, AdventureJournalEntry, AdventureQuoteSourceStatus, AttributionStatus, QuoteSourceType } from "@/types";

type QuoteAttribution = Pick<AdventureQuote, "speaker" | "author" | "work" | "dynasty" | "sourceType" | "sourceStatus" | "sourceTitle" | "game" | "skin" | "attributionStatus" | "note">;
type JournalAttribution = Pick<AdventureJournalEntry, "quoteSpeaker" | "quoteAuthor" | "quoteWork" | "quoteDynasty" | "quoteSourceType" | "quoteSourceStatus" | "quoteSourceTitle" | "quoteGame" | "quoteSkin" | "quoteAttributionStatus" | "quoteNote">;

const legacyStatus = (status?: AttributionStatus): AdventureQuoteSourceStatus => status === "unverified" ? "likely" : "verified";

/** Formats internal source metadata into user-facing Traditional Chinese. */
export function formatAdventureQuoteAttribution(quote: QuoteAttribution | JournalAttribution): string | null {
  const isJournal = "quoteSourceType" in quote;
  const sourceType: QuoteSourceType = isJournal ? quote.quoteSourceType : quote.sourceType;
  const sourceStatus = isJournal ? quote.quoteSourceStatus ?? legacyStatus(quote.quoteAttributionStatus) : quote.sourceStatus ?? legacyStatus(quote.attributionStatus);
  const speaker = isJournal ? quote.quoteSpeaker ?? quote.quoteAuthor : quote.speaker ?? quote.author;
  const author = isJournal ? quote.quoteAuthor : quote.author;
  const work = isJournal ? quote.quoteWork : quote.work;
  const dynasty = isJournal ? quote.quoteDynasty : quote.dynasty;
  const sourceTitle = isJournal ? quote.quoteSourceTitle : quote.sourceTitle;
  const game = isJournal ? quote.quoteGame : quote.game;
  const skin = isJournal ? quote.quoteSkin : quote.skin;
  const legacyAttribution = isJournal ? quote.quoteAttributionStatus : quote.attributionStatus;
  const note = isJournal ? quote.quoteNote : quote.note;

  if (sourceType === "unknown" || (!sourceTitle && !speaker && legacyAttribution === "unverified")) return "出處未詳";
  if (sourceStatus === "paraphrase") {
    if (sourceType === "movie") return sourceTitle ? `——改寫自${sourceTitle}` : "——改寫來源未詳";
    if (sourceType === "proPlayer") return `——意譯自 ${speaker ?? "職業選手"}，《英雄聯盟》職業選手`;
  }
  if (sourceType === "movie" && sourceStatus === "likely") return sourceTitle ? `——常見出處：${sourceTitle}` : "——常見出處未詳";
  if (sourceType === "proPlayer") return `——${speaker ?? "職業選手"}，《英雄聯盟》職業選手`;
  if (sourceType === "football" || sourceType === "athlete") {
    const source = sourceTitle ?? note ?? "來源未詳";
    return `——${sourceStatus === "paraphrase" ? "意譯自 " : ""}${speaker ?? "運動員"}｜${source}`;
  }
  if (sourceType === "proverb") return `——${author ?? "佚名"}｜${sourceTitle ?? "流傳格言"}（出處待考）`;
  if (sourceType === "game") return speaker ? `——${speaker}${skin ? `・${skin}` : ""}，${game ?? sourceTitle ?? "《英雄聯盟》"}` : null;
  if (sourceType === "original") return `——${sourceTitle ?? "Life Quest Map"}`;
  if (!speaker) return sourceTitle ? `——${sourceTitle}` : null;
  return `——${speaker}${work ? `，《${work}》` : ""}${dynasty ? `・${dynasty}` : ""}`;
}
