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

export type MapLocationFilter = "all" | "pending" | "completed" | "custom" | "hide-demo" | QuestCategory;

/** The single filtering/sorting pipeline shared by the map markers and task cards. */
export function getVisibleMapLocations(
  locations: MapLocation[],
  completions: string[],
  filter: MapLocationFilter,
  position: Coordinates | null
): MapLocation[] {
  const completionIds = new Set(completions);
  const filtered = locations.filter((location) => {
    const completed = completionIds.has(location.id);
    if (filter === "all") return true;
    if (filter === "pending") return !completed;
    if (filter === "completed") return completed;
    if (filter === "custom") return Boolean(location.isCustom);
    if (filter === "hide-demo") return Boolean(location.isCustom);
    return location.category === filter;
  });
  if (!position) return filtered;
  return filtered
    .map((location, index) => ({ location, index, distance: distanceInKilometers(position, location) }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .map(({ location }) => location);
}

export function externalNavigationUrl(location: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${location.lat},${location.lng}`)}`;
}

/** Guards the map click handler so normal viewing/dragging never creates a draft point. */
export function selectedCoordinatesFromMapClick(selecting: boolean, coordinates: Coordinates): Coordinates | null {
  return selecting ? normalizeCoordinates(coordinates) : null;
}

export function selectedLocationAfterDelete(selectedLocationId: string | null, deletedLocationId: string): string | null {
  return selectedLocationId === deletedLocationId ? null : selectedLocationId;
}
