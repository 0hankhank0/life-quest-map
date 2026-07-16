import type { MapLocation, QuestCategory } from "@/types";

export interface Coordinates {
  lat: number;
  lng: number;
}

const categories = new Set<QuestCategory>([
  "learning", "fitness", "creativity", "social", "discipline", "exploration"
]);

export function normalizeCoordinates(value: unknown): Coordinates | null {
  if (!value || typeof value !== "object") return null;
  const { lat, lng } = value as Record<string, unknown>;
  if (typeof lat !== "number" || typeof lng !== "number" || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat: Math.round(lat * 1_000_000) / 1_000_000, lng: Math.round(lng * 1_000_000) / 1_000_000 };
}

export function normalizeCustomMapLocation(value: unknown): MapLocation | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const coordinates = normalizeCoordinates(source);
  if (!coordinates || typeof source.id !== "string" || typeof source.name !== "string" || typeof source.questTitle !== "string") return null;
  const name = source.name.trim();
  const questTitle = source.questTitle.trim();
  const type = typeof source.type === "string" ? source.type.trim() : "自訂地點";
  const notes = typeof source.notes === "string" ? source.notes.trim() : "";
  const expReward = typeof source.expReward === "number" && Number.isFinite(source.expReward) ? Math.max(0, Math.round(source.expReward)) : 0;
  if (!name || !questTitle || !categories.has(source.category as QuestCategory)) return null;
  return { id: source.id, name, questTitle, type: type || "自訂地點", notes, isCustom: true, category: source.category as QuestCategory, expReward, ...coordinates };
}

export function distanceInKilometers(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371;
  const radians = (value: number) => (value * Math.PI) / 180;
  const dLat = radians(to.lat - from.lat);
  const dLng = radians(to.lng - from.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(kilometers: number): string {
  if (kilometers < 1) return `約 ${Math.max(1, Math.round(kilometers * 1000))} 公尺`;
  return `約 ${kilometers.toFixed(kilometers < 10 ? 1 : 0)} 公里`;
}
