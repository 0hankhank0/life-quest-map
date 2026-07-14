import fs from "node:fs";

const quotesSource = fs.readFileSync("src/data/quotes.ts", "utf8");
const adventuresSource = fs.readFileSync("src/data/microAdventures.ts", "utf8");
const sourcesDocument = fs.readFileSync("docs/QUOTE_SOURCES.md", "utf8");
const allowedSourceTypes = new Set(["public-domain", "original", "paraphrase", "movie", "anime", "song"]);
const expectedQuoteIds = [
  ...Array.from({ length: 18 }, (_, index) => `lqm-original-${index + 1}`),
  ...Array.from({ length: 12 }, (_, index) => `public-domain-${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `literature-${index + 1}`),
  ...Array.from({ length: 12 }, (_, index) => `inspired-${index + 1}`)
];
const adventureIds = [...adventuresSource.matchAll(/^  \["([^"]+)"/gm)].map((match) => match[1]);
const quoteEntries = [...quotesSource.matchAll(/sourceType: "([^"]+)"/g)];
const documentIds = [...sourcesDocument.matchAll(/^\| ([a-z0-9-]+) \|/gm)].map((match) => match[1]).filter((id) => id !== "---");
const failures = [];

if (adventureIds.length < 60) failures.push(`微冒險數量不足：${adventureIds.length}`);
if (new Set(adventureIds).size !== adventureIds.length) failures.push("微冒險 ID 重複");
if (quoteEntries.length < 48) failures.push(`語錄數量不足：${quoteEntries.length}`);
if (new Set(expectedQuoteIds).size !== expectedQuoteIds.length) failures.push("語錄 ID 設計重複");
for (const [, sourceType] of quoteEntries) {
  if (!allowedSourceTypes.has(sourceType)) failures.push(`不合法 sourceType：${sourceType}`);
}
if ((quotesSource.match(/moods: \[\]/g) ?? []).length || (quotesSource.match(/categories: \[\]/g) ?? []).length) failures.push("語錄缺少 mood 或 category");
const missingDocumentIds = expectedQuoteIds.filter((id) => !documentIds.includes(id));
const extraDocumentIds = documentIds.filter((id) => !expectedQuoteIds.includes(id));
if (documentIds.length !== expectedQuoteIds.length || new Set(documentIds).size !== documentIds.length || missingDocumentIds.length || extraDocumentIds.length) failures.push(`quotes.ts 與 QUOTE_SOURCES.md 的 ID 未完全對應（缺少 ${missingDocumentIds.join(", ") || "無"}；多餘 ${extraDocumentIds.join(", ") || "無"}）`);
const moods = ["bored", "tired", "good", "out", "social", "quiet"];
const times = ["5", "15", "30", "60"];
for (const mood of moods) for (const time of times) {
  if (!new RegExp(`\\["[^"\\n]+",[^\\n]+\\[([^\\]]*"${mood}")[^\\]]*\\], \\[([^\\]]*"${time}")`).test(adventuresSource)) failures.push(`缺少微冒險候選：${mood}/${time}`);
}
if (failures.length) {
  console.error("資料驗證失敗：\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`資料驗證通過：${adventureIds.length} 則微冒險、${quoteEntries.length} 則語錄、24 種心情／時間組合、來源文件 ${documentIds.length} 個 ID。`);
