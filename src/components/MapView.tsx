"use client";

import L from "leaflet";
import { Component, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { mapLocations } from "@/data/defaults";
import { useLifeQuest } from "@/components/LifeQuestProvider";
import { MapToolbar } from "@/components/map/MapToolbar";
import { MapLocationDetails } from "@/components/map/MapLocationDetails";
import { MapLocationForm, type MapFormValue } from "@/components/map/MapLocationForm";
import { MapLocationList } from "@/components/map/MapLocationList";
import { getVisibleMapLocations, normalizeCoordinates, selectedCoordinatesFromMapClick, selectedLocationAfterDelete, type Coordinates, type MapLocationFilter } from "@/lib/mapLocations";
import { createId } from "@/lib/utils";
import type { MapLocation, QuestCategory } from "@/types";

const taiwanCenter: [number, number] = [23.7, 120.96];
const markerIcons = new Map<string, L.DivIcon>();
function markerIcon(location: MapLocation, completed: boolean, selected: boolean) {
  const key = `${location.category}-${location.isCustom ? "custom" : "demo"}-${completed ? "completed" : "pending"}-${selected ? "selected" : "normal"}`;
  const found = markerIcons.get(key);
  if (found) return found;
  const icon = L.divIcon({ className: `life-marker life-marker-${location.category} ${location.isCustom ? "life-marker-custom" : "life-marker-demo"} ${completed ? "life-marker-completed" : ""} ${selected ? "life-marker-selected" : ""}`, html: "<span></span>", iconSize: [34, 34], iconAnchor: [17, 17] });
  markerIcons.set(key, icon); return icon;
}
const currentIcon = L.divIcon({ className: "life-marker life-marker-current", html: "<span></span>", iconSize: [28, 28], iconAnchor: [14, 14] });
const draftIcon = L.divIcon({ className: "life-marker life-marker-draft", html: "<span></span>", iconSize: [34, 34], iconAnchor: [17, 17] });
const emptyForm = (): MapFormValue => ({ name: "", questTitle: "", type: "自訂探索點", category: "exploration", notes: "", expReward: 30 });

class MapErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> { state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; } render() { return this.state.failed ? <div className="grid h-[62dvh] min-h-[430px] place-items-center rounded-lg border border-amber-300/30 bg-zinc-950 p-6 text-center text-amber-100">地圖暫時無法載入，請重新整理後再試。</div> : this.props.children; } }

function MapClickHandler({ selecting, onSelect }: { selecting: boolean; onSelect: (coordinates: Coordinates) => void }) { useMapEvents({ click: (event) => { if (selecting) onSelect({ lat: event.latlng.lat, lng: event.latlng.lng }); } }); return null; }
function MapActions({ focus, fitLocations, requestFit }: { focus: Coordinates | null; fitLocations: MapLocation[]; requestFit: number }) { const map = useMap(); useEffect(() => { if (!focus) return; const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; map.setView([focus.lat, focus.lng], Math.max(map.getZoom(), 14), { animate: !reduced }); }, [focus, map]); useEffect(() => { if (!requestFit) return; if (!fitLocations.length) { map.setView(taiwanCenter, 8); return; } const bounds = L.latLngBounds(fitLocations.map((location) => [location.lat, location.lng] as [number, number])); map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 }); }, [fitLocations, map, requestFit]); return null; }

export function MapView() {
  const { state, completeMapLocation, addCustomMapLocation, updateCustomMapLocation, deleteCustomMapLocation } = useLifeQuest();
  const [filter, setFilter] = useState<MapLocationFilter>("all");
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [draftCoordinates, setDraftCoordinates] = useState<Coordinates | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MapLocation | null>(null);
  const [form, setForm] = useState<MapFormValue>(emptyForm);
  const [focus, setFocus] = useState<Coordinates | null>(null);
  const [fitRequest, setFitRequest] = useState(0);
  const allLocations = useMemo(() => [...mapLocations, ...state.customMapLocations], [state.customMapLocations]);
  const visibleLocations = useMemo(() => getVisibleMapLocations(allLocations, state.mapCompletions, filter, position), [allLocations, state.mapCompletions, filter, position]);
  const selectedLocation = useMemo(() => allLocations.find((location) => location.id === selectedLocationId) ?? null, [allLocations, selectedLocationId]);
  useEffect(() => { if (selectedLocationId && !selectedLocation) setSelectedLocationId(null); }, [selectedLocation, selectedLocationId]);
  const selectLocation = useCallback((location: MapLocation) => { setSelectedLocationId(location.id); setFocus({ lat: location.lat, lng: location.lng }); }, []);
  const cancelDraft = useCallback(() => { setSelecting(false); setDraftCoordinates(null); setEditing(null); }, []);
  const startAdd = useCallback(() => { setEditing(null); setDraftCoordinates(null); setForm(emptyForm()); setSelecting(true); }, []);
  const onMapSelect = useCallback((coordinates: Coordinates) => { const selectedCoordinates = selectedCoordinatesFromMapClick(selecting, coordinates); if (!selectedCoordinates) return; setDraftCoordinates(selectedCoordinates); setSelecting(false); }, [selecting]);
  const beginEdit = useCallback((location: MapLocation) => { setSelectedLocationId(location.id); setEditing(location); setDraftCoordinates({ lat: location.lat, lng: location.lng }); setForm({ name: location.name, questTitle: location.questTitle, type: location.type, category: location.category, notes: location.notes ?? "", expReward: location.expReward }); }, []);
  const saveLocation = useCallback(() => { if (!draftCoordinates || !form.name.trim() || !form.questTitle.trim()) return; const location: MapLocation = { id: editing?.id ?? createId("map-location"), ...draftCoordinates, name: form.name.trim(), questTitle: form.questTitle.trim(), type: form.type.trim() || "自訂探索點", category: form.category as QuestCategory, notes: form.notes.trim(), expReward: Math.max(0, Number(form.expReward) || 0), isCustom: true }; if (editing) updateCustomMapLocation(location); else addCustomMapLocation(location); setSelectedLocationId(location.id); setFocus(draftCoordinates); cancelDraft(); }, [addCustomMapLocation, cancelDraft, draftCoordinates, editing, form, updateCustomMapLocation]);
  const locateMe = useCallback(() => {
    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setLocationMessage("定位功能需要安全來源（HTTPS 或 localhost）。");
      return;
    }
    if (!navigator.geolocation) {
      setLocationMessage("此瀏覽器不支援定位功能。");
      return;
    }
    setLocationMessage("正在取得目前位置…");
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const normalized = normalizeCoordinates({
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        });
        if (!normalized) {
          setLocationMessage("定位座標無效。");
          return;
        }
        setPosition(normalized);
        setFocus(normalized);
        setLocationMessage("定位成功，已移動到目前位置；附近任務已依距離排序。");
      },
      (error) => {
        const messages: Record<number, string> = {
          [error.PERMISSION_DENIED]: "你已拒絕定位權限；仍可瀏覽所有據點。",
          [error.POSITION_UNAVAILABLE]: "定位服務目前無法取得位置，請稍後再試。",
          [error.TIMEOUT]: "定位逾時，請確認網路與定位服務後再試。",
        };
        setLocationMessage(messages[error.code] ?? "無法取得位置，請稍後再試。");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  }, []);
  const removeSelected = useCallback(() => { if (!selectedLocation?.isCustom) return; deleteCustomMapLocation(selectedLocation.id); setSelectedLocationId((id) => selectedLocationAfterDelete(id, selectedLocation.id)); }, [deleteCustomMapLocation, selectedLocation]);
  return <div className="space-y-4"><MapToolbar filter={filter} selecting={selecting} onFilter={setFilter} onLocate={locateMe} onFitBounds={() => setFitRequest((value) => value + 1)} onStartAdd={startAdd} onCancelAdd={cancelDraft} />{locationMessage && <p className="text-sm text-amber-100" role="status">{locationMessage}</p>}<MapErrorBoundary><div className="overflow-hidden rounded-lg border border-emerald-300/20 bg-zinc-950"><MapContainer center={taiwanCenter} zoom={8} scrollWheelZoom className="h-[55dvh] min-h-[380px] w-full"><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapClickHandler selecting={selecting} onSelect={onMapSelect} /><MapActions focus={focus} fitLocations={visibleLocations} requestFit={fitRequest} />{position && <Marker position={[position.lat, position.lng]} icon={currentIcon} />}{draftCoordinates && <Marker position={[draftCoordinates.lat, draftCoordinates.lng]} icon={draftIcon} interactive={false} />}{visibleLocations.map((location) => <Marker key={location.id} position={[location.lat, location.lng]} icon={markerIcon(location, state.mapCompletions.includes(location.id), selectedLocationId === location.id)} eventHandlers={{ click: () => selectLocation(location) }} />)}</MapContainer></div></MapErrorBoundary>{draftCoordinates && <MapLocationForm coordinates={draftCoordinates} editing={Boolean(editing)} value={form} onChange={setForm} onSave={saveLocation} onCancel={cancelDraft} />}<MapLocationDetails location={selectedLocation} completed={selectedLocation ? state.mapCompletions.includes(selectedLocation.id) : false} onComplete={() => selectedLocation && completeMapLocation(selectedLocation)} onEdit={() => selectedLocation && beginEdit(selectedLocation)} onDelete={removeSelected} /><MapLocationList locations={visibleLocations} completions={state.mapCompletions} position={position} selectedLocationId={selectedLocationId} onSelect={selectLocation} /></div>;
}
