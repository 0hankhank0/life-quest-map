import fs from "node:fs";

const quotesSource = fs.readFileSync("src/data/adventureQuotes.ts", "utf8");
const adventuresSource = fs.readFileSync("src/data/microAdventures.ts", "utf8");
const allowedSourceTypes = new Set(["movie", "game", "proPlayer", "original", "public_domain"]);
const sourceTypesRequiringSpeaker = new Set(["game", "proPlayer"]);
const adventureIds = [...adventuresSource.matchAll(/^  \["([^"]+)"/gm)].map((match) => match[1]);
const quoteEntries = [...quotesSource.matchAll(/sourceType: "([^"]+)"/g)];
const failures = [];

if (adventureIds.length < 60) failures.push(`微冒險數量不足：${adventureIds.length}`);
if (new Set(adventureIds).size !== adventureIds.length) failures.push("微冒險 ID 重複");
if (!quotesSource.includes("export const adventureQuotes")) failures.push("找不到城市迴響資料集");
if (!quotesSource.includes("publicDomain(")) failures.push("城市迴響缺少公共領域語錄");
for (const [, sourceType] of quoteEntries) if (!allowedSourceTypes.has(sourceType)) failures.push(`不允許的語錄來源：${sourceType}`);
for (const entry of quotesSource.matchAll(/\{ id: "([^"]+)", text: "([^"]+)",([^\n]+) \}/g)) {
  const [, id, text, fields] = entry;
  if (!id.trim() || !text.trim()) failures.push("語錄 ID 或文字不可為空白");
  const sourceType = fields.match(/sourceType: "([^"]+)"/)?.[1];
  if (sourceType && sourceTypesRequiringSpeaker.has(sourceType) && !fields.includes("speaker:")) failures.push(`遊戲或選手語錄缺少說話者：${id}`);
  if (!fields.includes("sourceStatus:")) failures.push(`語錄缺少來源狀態：${id}`);
}
const moods = ["bored", "tired", "good", "out", "social", "quiet"];
const times = ["5", "15", "30", "60"];
for (const mood of moods) for (const time of times) {
  if (!new RegExp(`\\["[^"\\n]+",[^\\n]+\\[([^\\]]*"${mood}")[^\\]]*\\], \\[([^\\]]*"${time}")`).test(adventuresSource)) failures.push(`缺少推薦組合：${mood}/${time}`);
}
if (failures.length) { console.error(`資料驗證失敗：\n- ${failures.join("\n- ")}`); process.exit(1); }
console.log(`資料驗證通過：${adventureIds.length} 則微冒險、城市迴響來源規則與推薦組合皆有效。`);
