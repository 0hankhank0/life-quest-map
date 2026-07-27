"use client";

import { Copy, DownloadSimple, Shuffle, Sparkle } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import type { AdventureQuote, QuoteTheme } from "@/types";
import {
  SocialPostCard,
  type CustomSocialQuote,
  type SocialCardFormat,
} from "@/components/SocialPostCard";
import { CustomQuoteEditor } from "./CustomQuoteEditor";
import { FormatSelector } from "./FormatSelector";
import { QuoteList } from "./QuoteList";
import { ScaledSocialPreview } from "./ScaledSocialPreview";
import {
  filterStudioQuotes,
  quoteSourceGroupLabels,
  quoteThemes,
  quoteThemeLabels,
  type QuoteSourceGroup,
} from "./quoteStudioFilters";

export type QuoteSource = "library" | "custom";

type QuoteStudioProps = {
  quoteSource: QuoteSource;
  onQuoteSourceChange: (source: QuoteSource) => void;
  quotes: readonly AdventureQuote[];
  selectedQuoteId: string;
  onSelectedQuoteIdChange: (id: string) => void;
  selectedQuote: AdventureQuote | null;
  draft: CustomSocialQuote;
  onDraftChange: (next: CustomSocialQuote) => void;
  customReady: boolean;
  format: SocialCardFormat;
  onFormatChange: (format: SocialCardFormat) => void;
  onCopy: () => void;
  onDownload: () => void;
  isExporting: boolean;
  publicPreviewHref: string | null;
  notice: string;
};

export function QuoteStudio({
  quoteSource,
  onQuoteSourceChange,
  quotes,
  selectedQuoteId,
  onSelectedQuoteIdChange,
  selectedQuote,
  draft,
  onDraftChange,
  customReady,
  format,
  onFormatChange,
  onCopy,
  onDownload,
  isExporting,
  publicPreviewHref,
  notice,
}: QuoteStudioProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSourceGroup, setSelectedSourceGroup] = useState<QuoteSourceGroup>("all");
  const [selectedTheme, setSelectedTheme] = useState<QuoteTheme | "all">("all");
  const filteredQuotes = useMemo(() => filterStudioQuotes(quotes, {
    searchQuery,
    sourceGroup: selectedSourceGroup,
    theme: selectedTheme,
  }), [quotes, searchQuery, selectedSourceGroup, selectedTheme]);
  const filteredIds = useMemo(() => filteredQuotes.map((quote) => quote.id), [filteredQuotes]);
  const availableSourceGroups = useMemo(() => {
    return (Object.keys(quoteSourceGroupLabels) as QuoteSourceGroup[]).filter((group) =>
      group === "all" || quotes.some((quote) => filterStudioQuotes([quote], { searchQuery: "", sourceGroup: group, theme: "all" }).length),
    );
  }, [quotes]);
  const availableThemes = useMemo(() => {
    const themes = new Set<QuoteTheme>();
    quotes.forEach((quote) => quoteThemes(quote).forEach((theme) => themes.add(theme)));
    return [...themes];
  }, [quotes]);

  useEffect(() => {
    if (quoteSource !== "library" || !filteredIds.length || filteredIds.includes(selectedQuoteId)) return;
    onSelectedQuoteIdChange(filteredIds[0]);
  }, [filteredIds, onSelectedQuoteIdChange, quoteSource, selectedQuoteId]);

  const hasLibrarySelection = Boolean(selectedQuote && filteredIds.includes(selectedQuote.id));
  const quotePost = quoteSource === "custom" && customReady
    ? { customQuote: draft }
    : hasLibrarySelection && selectedQuote
      ? { quote: selectedQuote }
      : null;
  const pickAnotherQuote = () => {
    if (filteredQuotes.length < 2) return;
    const candidates = filteredQuotes.filter((quote) => quote.id !== selectedQuoteId);
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    if (next) onSelectedQuoteIdChange(next.id);
  };
  const controlsDisabled = quoteSource === "library" && !hasLibrarySelection;

  return (
    <div className="grid gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
      <section className="game-card min-w-0 p-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="語錄來源">
          <button type="button" aria-pressed={quoteSource === "library"} onClick={() => onQuoteSourceChange("library")} className={`social-format-button ${quoteSource === "library" ? "social-format-button--selected" : ""}`}>語錄庫</button>
          <button type="button" aria-pressed={quoteSource === "custom"} onClick={() => onQuoteSourceChange("custom")} className={`social-format-button ${quoteSource === "custom" ? "social-format-button--selected" : ""}`}>自訂語錄</button>
        </div>

        {quoteSource === "library" ? <>
          <label className="mt-4 block text-sm font-bold text-emerald-100">搜尋內容、作者、作品或來源
            <input aria-label="搜尋內容、作者、作品或來源" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜尋內容、作者、作品或來源" className="field-control mt-2" />
          </label>
          <FilterButtons label="來源類型" value={selectedSourceGroup} onChange={setSelectedSourceGroup} options={availableSourceGroups.map((group) => ({ value: group, label: quoteSourceGroupLabels[group] }))} />
          <FilterButtons label="語錄主題" value={selectedTheme} onChange={setSelectedTheme} options={[{ value: "all", label: "全部" }, ...availableThemes.map((theme) => ({ value: theme, label: quoteThemeLabels[theme] }))]} />
          <p className="mt-3 text-xs text-zinc-400">目前找到 {filteredQuotes.length} 則語錄</p>
          <QuoteList quotes={filteredQuotes} selectedQuoteId={selectedQuoteId} onSelectedQuoteIdChange={onSelectedQuoteIdChange} />
        </> : <div className="mt-4"><CustomQuoteEditor value={draft} onChange={onDraftChange} isValid={customReady} /></div>}
      </section>

      <section className="game-card min-w-0 p-4">
        {quotePost ? <ScaledSocialPreview format={format}><SocialPostCard format={format} {...quotePost} /></ScaledSocialPreview> : <div className="social-post-preview-shell" role="status"><div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-white/15 p-5 text-center text-sm text-zinc-400">沒有符合條件的語錄，請調整搜尋或篩選。</div></div>}
        <div className="mt-4 flex flex-wrap items-start gap-2">
          <FormatSelector value={format} onChange={onFormatChange} />
          {quoteSource === "library" ? <button type="button" disabled={filteredQuotes.length < 2} onClick={pickAnotherQuote} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-3 font-bold disabled:opacity-60"><Shuffle className="size-4" />換一則語錄</button> : null}
          <button type="button" disabled={controlsDisabled} onClick={onCopy} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-3 font-bold disabled:opacity-60"><Copy className="size-4" />複製貼文文案</button>
          {quoteSource === "library" && hasLibrarySelection && publicPreviewHref ? <a href={publicPreviewHref} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-amber-300/40 px-3 font-bold text-amber-100"><Sparkle className="size-4" />純預覽頁</a> : quoteSource === "custom" ? <p role="status" className="self-center text-sm text-amber-100">自訂語錄僅保留於目前頁面，可直接下載 PNG。</p> : null}
          <button type="button" disabled={isExporting || controlsDisabled} onClick={onDownload} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-emerald-300 px-3 font-black text-emerald-950 disabled:opacity-60"><DownloadSimple className="size-4" />下載 PNG</button>
        </div>
        {notice ? <p role="status" className="mt-3 text-sm text-emerald-200">{notice}</p> : null}
      </section>
    </div>
  );
}

function FilterButtons<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (value: T) => void; options: Array<{ value: T; label: string }> }) {
  return <fieldset className="mt-4"><legend className="text-xs font-bold text-emerald-100">{label}</legend><div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>{options.map((option) => <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${value === option.value ? "bg-amber-300 text-zinc-950" : "bg-white/10 text-zinc-300 hover:bg-white/15"}`}>{option.label}</button>)}</div></fieldset>;
}
