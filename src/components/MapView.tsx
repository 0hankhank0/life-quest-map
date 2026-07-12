"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { categoryLabels } from "@/data/labels";
import { mapLocations } from "@/data/defaults";
import { useLifeQuest } from "@/components/LifeQuestProvider";

const questIcon = L.divIcon({
  className: "life-marker",
  html: "<span></span>",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -14]
});

const completedIcon = L.divIcon({
  className: "life-marker life-marker-completed",
  html: "<span></span>",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -14]
});

export function MapView() {
  const { state, completeMapLocation } = useLifeQuest();

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-300/20 bg-zinc-950 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
      <MapContainer
        center={[25.039, 121.545]}
        zoom={13}
        scrollWheelZoom
        className="h-[62dvh] min-h-[430px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapLocations.map((location) => {
          const isCompleted = state.mapCompletions.includes(location.id);

          return (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={isCompleted ? completedIcon : questIcon}
            >
              <Popup>
                <div className="w-56 space-y-3 text-zinc-900">
                  <div>
                    <p className="text-xs font-bold text-emerald-700">{location.type}</p>
                    <h3 className="text-lg font-black">{location.name}</h3>
                  </div>
                  <div className="rounded-md bg-emerald-50 p-3">
                    <p className="text-xs font-bold text-zinc-600">推薦任務</p>
                    <p className="mt-1 font-bold">{location.questTitle}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{categoryLabels[location.category]}</span>
                    <span className="font-black text-emerald-700">
                      {location.expReward} EXP
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => completeMapLocation(location)}
                    disabled={isCompleted}
                    className={`w-full rounded-md px-3 py-2 text-sm font-black transition ${
                      isCompleted
                        ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isCompleted ? "已完成探索" : "完成地圖任務"}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
