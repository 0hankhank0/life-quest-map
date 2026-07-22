import fs from "node:fs";
import * as ts from "typescript";

const quotesSource = fs.readFileSync("src/data/adventureQuotes.ts", "utf8");
const adventuresSource = fs.readFileSync("src/data/microAdventures.ts", "utf8");
const allowedSourceTypes = new Set(["movie", "game", "proPlayer", "football", "athlete", "proverb", "original", "public_domain"]);
const sourceTypesRequiringSpeaker = new Set(["game", "proPlayer", "football", "athlete"]);
const failures = [];
const entries = [];

const sourceFile = ts.createSourceFile("adventureQuotes.ts", quotesSource, ts.ScriptTarget.Latest, true);
const stringValue = (node) => node && ts.isStringLiteralLike(node) ? node.text : undefined;
const propertyValue = (object, name) => {
  const property = object.properties.find((item) => ts.isPropertyAssignment(item) && ts.isIdentifier(item.name) && item.name.text === name);
  return property && ts.isPropertyAssignment(property) ? stringValue(property.initializer) : undefined;
};

function visit(node) {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
    const helper = node.expression.text;
    if (helper === "original" || helper === "publicDomain") {
      entries.push({ id: stringValue(node.arguments[0]), text: stringValue(node.arguments[1]), sourceType: helper === "original" ? "original" : "public_domain", sourceStatus: helper === "original" ? "original" : "verified" });
    }
    if (helper === "external" && ts.isObjectLiteralExpression(node.arguments[0])) {
      const object = node.arguments[0];
      entries.push({ id: propertyValue(object, "id"), text: propertyValue(object, "text"), sourceType: propertyValue(object, "sourceType"), sourceStatus: propertyValue(object, "sourceStatus"), speaker: propertyValue(object, "speaker"), sourceTitle: propertyValue(object, "sourceTitle"), sourceUrl: propertyValue(object, "sourceUrl") });
    }
  }
  ts.forEachChild(node, visit);
}
visit(sourceFile);

for (const entry of entries) {
  if (!entry.id?.trim() || !entry.text?.trim()) failures.push("語錄 ID 或文字不可為空白");
  if (!allowedSourceTypes.has(entry.sourceType)) failures.push(`不允許的語錄來源：${entry.sourceType ?? "未指定"}`);
  if (!entry.sourceStatus) failures.push(`語錄缺少來源狀態：${entry.id}`);
  if (sourceTypesRequiringSpeaker.has(entry.sourceType) && !entry.speaker?.trim()) failures.push(`語錄缺少說話者：${entry.id}`);
  if ((entry.sourceType === "football" || entry.sourceType === "athlete") && (!entry.sourceTitle?.trim() || !entry.sourceUrl?.trim())) failures.push(`現代運動語錄缺少來源標題或 URL：${entry.id}`);
  if (entry.sourceUrl !== undefined && !entry.sourceUrl.trim()) failures.push(`語錄來源 URL 不可為空白：${entry.id}`);
  if (entry.sourceType === "proverb" && entry.sourceStatus !== "unverified") failures.push(`流傳格言必須標示為 unverified：${entry.id}`);
}
if (new Set(entries.map((entry) => entry.id)).size !== entries.length) failures.push("語錄 ID 重複");
if (new Set(entries.map((entry) => entry.text)).size !== entries.length) failures.push("語錄文字重複");

const adventureIds = [...adventuresSource.matchAll(/^  \["([^"]+)"/gm)].map((match) => match[1]);
if (adventureIds.length < 60) failures.push(`微冒險數量不足：${adventureIds.length}`);
if (new Set(adventureIds).size !== adventureIds.length) failures.push("微冒險 ID 重複");
const moods = ["bored", "tired", "good", "out", "social", "quiet"];
const times = ["5", "15", "30", "60"];
for (const mood of moods) for (const time of times) {
  if (!new RegExp(`\\["[^"\\n]+",[^\\n]+\\[([^\\]]*"${mood}")[^\\]]*\\], \\[([^\\]]*"${time}")`).test(adventuresSource)) failures.push(`缺少推薦組合：${mood}/${time}`);
}

if (failures.length) { console.error(`資料驗證失敗：\n- ${failures.join("\n- ")}`); process.exit(1); }
console.log(`資料驗證通過：${adventureIds.length} 則微冒險、${entries.length} 則城市迴響與來源規則皆有效。`);
