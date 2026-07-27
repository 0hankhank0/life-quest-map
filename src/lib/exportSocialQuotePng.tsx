"use client";

import { toPng } from "html-to-image";
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  SocialPostCard,
  type CustomSocialQuote,
  type SocialCardFormat,
} from "@/components/SocialPostCard";
import type { AdventureQuote } from "@/types";
import { quoteExportDimensions, quoteExportRasterOptions } from "./socialQuoteExportConfig";
import {
  cleanupQuoteExportRoot,
  isValidQuoteExportCard,
  rasterizeQuoteExportCard,
} from "./socialQuoteExportValidation";

export { quoteExportDimensions, quoteExportRasterOptions } from "./socialQuoteExportConfig";

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function exportSocialQuotePng({
  quote,
  customQuote,
  format,
  filename,
}: {
  quote?: AdventureQuote;
  customQuote?: CustomSocialQuote;
  format: SocialCardFormat;
  filename: string;
}) {
  if (!quote && !customQuote) return;

  const { width, height } = quoteExportDimensions(format);
  const exportRoot = document.createElement("div");
  exportRoot.dataset.socialQuoteExportRoot = "true";
  Object.assign(exportRoot.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: "none",
    zIndex: "-1",
    overflow: "visible",
  });
  document.body.append(exportRoot);
  const root = createRoot(exportRoot);

  try {
    flushSync(() => {
      root.render(createElement(SocialPostCard, { quote, customQuote, format, exportMode: true }));
    });
    await document.fonts.ready;
    await nextFrame();
    await nextFrame();

    const exportCard = exportRoot.querySelector<HTMLElement>('[data-testid="social-post-card"]');
    if (!exportCard) throw new Error("語錄 PNG 匯出失敗：找不到匯出圖卡。");

    const rect = exportCard.getBoundingClientRect();
    const computed = getComputedStyle(exportCard);
    if (!isValidQuoteExportCard({ expectedWidth: width, expectedHeight: height, rect, computed })) {
      console.error("Invalid quote export node", {
        expected: { width, height },
        rect: { width: rect.width, height: rect.height },
        computed: {
          width: computed.width,
          height: computed.height,
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          transform: computed.transform,
          position: computed.position,
          maxWidth: computed.maxWidth,
          minWidth: computed.minWidth,
        },
        devicePixelRatio: window.devicePixelRatio,
        documentClientWidth: document.documentElement.clientWidth,
      });
      throw new Error(`語錄 PNG 匯出失敗：預期 ${width}×${height}，實際 ${rect.width}×${rect.height}。`);
    }

    const dataUrl = await rasterizeQuoteExportCard({
      exportCard,
      width,
      height,
      rasterize: (node, options) => toPng(node, { ...options, ...quoteExportRasterOptions, cacheBust: true }),
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } finally {
    cleanupQuoteExportRoot(root, exportRoot);
  }
}
