import type { AdventureQuote } from "@/types";

function conciseSourceTitle(title?: string): string | null {
  const value = title?.replace(/\s+/g, " ").trim();
  if (!value || /https?:\/\//i.test(value)) return null;
  if (value.length <= 40) return value;
  const prefix = value.split(/[：:|]/, 1)[0]?.trim();
  return prefix && prefix.length <= 24 ? prefix : null;
}

/** The single attribution rule shared by the social card, copied text, and PNG export. */
export function formatSocialQuoteAttribution(quote: Pick<AdventureQuote, "speaker" | "author" | "work" | "game" | "sourceTitle">): string | null {
  const person = quote.speaker?.trim() || quote.author?.trim() || null;
  const fallback = conciseSourceTitle(quote.sourceTitle);
  const work = quote.work?.trim() || quote.game?.trim() || (quote.sourceTitle && quote.sourceTitle.length > 40 ? fallback : null);
  if (person && work) return `—— ${person}，《${work.replace(/^《|》$/g, "")}》`;
  if (person) return `—— ${person}`;
  if (work) return `——《${work.replace(/^《|》$/g, "")}》`;
  return fallback ? `——《${fallback.replace(/^《|》$/g, "")}》` : null;
}
