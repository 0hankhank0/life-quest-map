export const approximatelyEqual = (
  actual: number,
  expected: number,
  tolerance = 1,
) => Math.abs(actual - expected) <= tolerance;

export function hasNonIdentityTransform(transform: string) {
  return ![
    "none",
    "matrix(1, 0, 0, 1, 0, 0)",
    "matrix(1,0,0,1,0,0)",
  ].includes(transform);
}

export type QuoteExportCardStyles = {
  display: string;
  visibility: string;
  opacity: string;
  transform: string;
};

export function isValidQuoteExportCard({
  expectedWidth,
  expectedHeight,
  rect,
  computed,
}: {
  expectedWidth: number;
  expectedHeight: number;
  rect: { width: number; height: number };
  computed: QuoteExportCardStyles;
}) {
  return (
    approximatelyEqual(rect.width, expectedWidth) &&
    approximatelyEqual(rect.height, expectedHeight) &&
    computed.display !== "none" &&
    computed.visibility !== "hidden" &&
    Number(computed.opacity) > 0 &&
    !hasNonIdentityTransform(computed.transform)
  );
}

export async function rasterizeQuoteExportCard<TNode>({
  exportCard,
  width,
  height,
  rasterize,
}: {
  exportCard: TNode;
  width: number;
  height: number;
  rasterize: (node: TNode, options: { width: number; height: number; canvasWidth: number; canvasHeight: number }) => Promise<string>;
}) {
  return rasterize(exportCard, { width, height, canvasWidth: width, canvasHeight: height });
}

export function cleanupQuoteExportRoot(root: { unmount(): void }, exportRoot: { remove(): void }) {
  root.unmount();
  exportRoot.remove();
}
