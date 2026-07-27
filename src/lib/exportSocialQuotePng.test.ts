import { describe, expect, it, vi } from "vitest";
import {
  approximatelyEqual,
  cleanupQuoteExportRoot,
  hasNonIdentityTransform,
  isValidQuoteExportCard,
  rasterizeQuoteExportCard,
} from "./socialQuoteExportValidation";
import { quoteExportDimensions, quoteExportRasterOptions } from "./socialQuoteExportConfig";

describe("social quote DOM export configuration", () => {
  it("uses native dimensions for all selected formats", () => {
    expect(quoteExportDimensions("threads-wide")).toEqual({ width: 1080, height: 810 });
    expect(quoteExportDimensions("square")).toEqual({ width: 1080, height: 1080 });
    expect(quoteExportDimensions("instagram-portrait")).toEqual({ width: 1080, height: 1350 });
  });

  it("uses a non-transparent one-to-one raster instead of preview scaling", () => {
    expect(quoteExportRasterOptions).toEqual({ pixelRatio: 1, backgroundColor: "#06130f" });
  });

  it("accepts sub-pixel dimension differences but rejects preview-sized cards", () => {
    expect(approximatelyEqual(1080.5, 1080)).toBe(true);
    expect(approximatelyEqual(700, 1080)).toBe(false);
  });

  it("recognizes only actual transforms as non-identity", () => {
    expect(hasNonIdentityTransform("none")).toBe(false);
    expect(hasNonIdentityTransform("matrix(1, 0, 0, 1, 0, 0)")).toBe(false);
    expect(hasNonIdentityTransform("matrix(1,0,0,1,0,0)")).toBe(false);
    expect(hasNonIdentityTransform("matrix(0.75, 0, 0, 0.75, 0, 0)")).toBe(true);
  });

  it("validates native dimensions and identity transforms", () => {
    const computed = { display: "block", visibility: "visible", opacity: "1", transform: "matrix(1, 0, 0, 1, 0, 0)" };
    expect(isValidQuoteExportCard({ expectedWidth: 1080, expectedHeight: 810, rect: { width: 1080.5, height: 809.5 }, computed })).toBe(true);
    expect(isValidQuoteExportCard({ expectedWidth: 1080, expectedHeight: 810, rect: { width: 700, height: 525 }, computed })).toBe(false);
  });

  it("rasterizes the export card and supports cleanup from finally", async () => {
    const exportCard = {};
    const exportRoot = { remove: vi.fn() };
    const root = { unmount: vi.fn() };
    const rasterize = vi.fn().mockResolvedValue("data:image/png;base64,test");

    await rasterizeQuoteExportCard({ exportCard, width: 1080, height: 810, rasterize });
    cleanupQuoteExportRoot(root, exportRoot);

    expect(rasterize).toHaveBeenCalledWith(exportCard, expect.objectContaining({ width: 1080, height: 810 }));
    expect(root.unmount).toHaveBeenCalledOnce();
    expect(exportRoot.remove).toHaveBeenCalledOnce();
  });
});
