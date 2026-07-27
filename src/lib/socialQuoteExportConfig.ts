export type SocialQuoteExportFormat = "instagram-portrait" | "square" | "threads-wide";

export function quoteExportDimensions(format: SocialQuoteExportFormat) {
  return {
    width: 1080,
    height: format === "instagram-portrait" ? 1350 : format === "threads-wide" ? 810 : 1080,
  };
}

export const quoteExportRasterOptions = {
  pixelRatio: 1,
  backgroundColor: "#06130f",
} as const;
