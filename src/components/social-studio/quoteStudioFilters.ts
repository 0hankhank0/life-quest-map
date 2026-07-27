import type { AdventureQuote, QuoteTheme } from "@/types";
export { formatSocialQuoteAttribution as formatStudioQuoteAttribution } from "@/lib/socialQuoteAttribution";

export type QuoteSourceGroup =
  | "all"
  | "screen"
  | "game"
  | "esports"
  | "sports"
  | "published"
  | "classic"
  | "original"
  | "other";

export const quoteSourceGroupLabels: Record<QuoteSourceGroup, string> = {
  all: "全部",
  screen: "動漫／影視",
  game: "遊戲",
  esports: "電競選手",
  sports: "足球／運動員",
  published: "文學／出版",
  classic: "古典／格言",
  original: "原創",
  other: "其他",
};

export const quoteThemeLabels: Record<QuoteTheme, string> = {
  growth: "成長",
  learning: "學習",
  persistence: "堅持",
  courage: "勇氣",
  action: "行動",
  exploration: "探索",
  creativity: "創作",
  relationships: "關係",
  "daily-life": "日常",
  rest: "休息",
  reflection: "反思",
  recovery: "復原",
};

const categoryThemes: Record<string, QuoteTheme> = {
  exploration: "exploration",
  connection: "relationships",
  rest: "rest",
  awareness: "reflection",
  courage: "courage",
  creation: "creativity",
  daily: "daily-life",
};

const intentThemes: Record<string, QuoteTheme> = {
  small_step: "daily-life",
  progress: "growth",
  learning: "learning",
  discipline: "persistence",
  focus: "persistence",
  creation: "creativity",
  exploration: "exploration",
  awareness: "reflection",
  rest: "rest",
  fitness: "action",
  courage: "courage",
  resilience: "recovery",
  failure: "recovery",
  dream: "growth",
  self_belief: "courage",
  change: "growth",
  connection: "relationships",
  teamwork: "relationships",
  reflection: "reflection",
};

const sourceGroups: Record<string, QuoteSourceGroup> = {
  movie: "screen",
  anime: "screen",
  film: "screen",
  tv: "screen",
  game: "game",
  "game-character": "game",
  "game-skin": "game",
  proPlayer: "esports",
  "esports-player": "esports",
  "sports-player": "esports",
  football: "sports",
  athlete: "sports",
  sports: "sports",
  published: "published",
  book: "published",
  literature: "published",
  interview: "published",
  proverb: "classic",
  public_domain: "classic",
  classical: "classic",
  philosophy: "classic",
  original: "original",
};

export function quoteSourceGroup(quote: Pick<AdventureQuote, "sourceType">): QuoteSourceGroup {
  return sourceGroups[quote.sourceType] ?? "other";
}

export function quoteThemes(quote: Pick<AdventureQuote, "themes" | "categories" | "intents">): QuoteTheme[] {
  if (quote.themes?.length) return [...new Set(quote.themes)];
  const categories = quote.categories.map((category) => categoryThemes[category]).filter((theme): theme is QuoteTheme => Boolean(theme));
  if (categories.length) return [...new Set(categories)];
  return [...new Set((quote.intents ?? []).map((intent) => intentThemes[intent]).filter((theme): theme is QuoteTheme => Boolean(theme)))];
}

function searchableQuoteText(quote: AdventureQuote): string {
  return [
    quote.text,
    quote.speaker,
    quote.author,
    quote.work,
    quote.sourceTitle,
    quote.game,
    quote.skin,
    quote.sourceType,
    ...(quote.tags ?? []),
    ...(quote.themes ?? []),
    ...(quote.contexts ?? []),
    ...(quote.intents ?? []),
    ...quote.categories,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLocaleLowerCase();
}

export function filterStudioQuotes(
  quotes: readonly AdventureQuote[],
  { searchQuery, sourceGroup, theme }: { searchQuery: string; sourceGroup: QuoteSourceGroup; theme: QuoteTheme | "all" },
): AdventureQuote[] {
  const term = searchQuery.trim().toLocaleLowerCase();
  return quotes.filter((quote) =>
    quote.enabled &&
    (!term || searchableQuoteText(quote).includes(term)) &&
    (sourceGroup === "all" || quoteSourceGroup(quote) === sourceGroup) &&
    (theme === "all" || quoteThemes(quote).includes(theme)),
  );
}
