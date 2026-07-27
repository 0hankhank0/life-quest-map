import type { AdventureQuote } from "@/types";
import { formatStudioQuoteAttribution, quoteSourceGroup, quoteSourceGroupLabels } from "./quoteStudioFilters";

export function QuoteList({ quotes, selectedQuoteId, onSelectedQuoteIdChange }: {
  quotes: readonly AdventureQuote[];
  selectedQuoteId: string;
  onSelectedQuoteIdChange: (id: string) => void;
}) {
  if (!quotes.length) {
    return <p role="status" className="mt-4 rounded-lg border border-dashed border-white/15 p-4 text-sm text-zinc-400">沒有符合條件的語錄，試著調整搜尋或篩選。</p>;
  }

  return <div className="mt-3 max-h-[40dvh] space-y-2 overflow-y-auto pr-1" role="listbox" aria-label="語錄搜尋結果">
    {quotes.map((quote) => {
      const attribution = formatStudioQuoteAttribution(quote);
      const source = quote.work || quote.game || quote.sourceTitle;
      const selected = quote.id === selectedQuoteId;
      return <button key={quote.id} type="button" role="option" aria-selected={selected} onClick={() => onSelectedQuoteIdChange(quote.id)} className={`w-full rounded-lg border p-3 text-left ${selected ? "border-amber-300/70 bg-amber-300/10" : "border-white/10 bg-black/15 hover:border-emerald-300/40"}`}>
        <p className="line-clamp-3 text-sm font-bold text-zinc-50">{quote.text}</p>
        {attribution ? <p className="mt-1 text-xs text-emerald-100">{attribution}</p> : null}
        {source && source !== attribution ? <p className="mt-1 line-clamp-1 text-xs text-zinc-400">{source}</p> : null}
        <span className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-amber-100">{quoteSourceGroupLabels[quoteSourceGroup(quote)]}</span>
      </button>;
    })}
  </div>;
}
