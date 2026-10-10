"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X, Check, Search, Compass } from "lucide-react";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (locationName: string, lat: number, lng: number) => void;
};

function MapEventsHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14);
    }
  }, [lat, lng, map]);
  return null;
}

export default function LocationPickerModal({
  initialLat = 27.1767,
  initialLng = 78.0081,
  initialLocationName = "",
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [lat, setLat] = useState(initialLat || 27.1767);
  const [lng, setLng] = useState(initialLng || 78.0081);
  const [locationName, setLocationName] = useState(initialLocationName);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State initialized on mount when modal opens
  if (!isOpen) return null;

  // Reverse geocode lat/lng to get address name
  const handleMapClick = async (clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
    setIsGeocoding(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLat}&lon=${clickedLng}`
      );
      if (response.ok) {
        const data = await response.json();
        const address = data.address;
        const name =
          address.road ||
          address.suburb ||
          address.neighbourhood ||
          address.city_district ||
          address.city ||
          "Agra Location";
        const city = address.city || address.town || address.state_district || "Agra";
        setLocationName(`${name}, ${city}`);
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Forward geocode search query
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsGeocoding(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Agra"
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const first = data[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);
          setLat(newLat);
          setLng(newLng);
          setLocationName(first.display_name.split(",").slice(0, 2).join(","));
        } else {
          alert("Location not found. Try clicking directly on the map.");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleConfirmSelection = () => {
    const finalName = locationName || `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    onConfirm(finalName, parseFloat(lat.toFixed(4)), parseFloat(lng.toFixed(4)));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Pick Venue Location from Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Click anywhere on the map or search to select coordinates & address.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search landmark or area in Agra (e.g., Fatehabad Road, Sadar Bazar)..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:border-red-500 outline-none text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Search Map
          </button>
        </form>

        {/* Map Display */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <MapContainer
            center={[lat, lng]}
            zoom={14}
            style={{ height: "300px", width: "100%" }}
            className="z-0 cursor-crosshair"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter lat={lat} lng={lng} />
            <MapEventsHandler onSelect={handleMapClick} />
            <Marker position={[lat, lng]} />
          </MapContainer>

          <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 flex justify-between items-center text-xs shadow-md">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Selected Location</span>
              <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[280px]">
                {isGeocoding ? "Fetching location address..." : locationName || "Custom Map Point"}
              </span>
              <span className="text-[10px] font-mono text-red-500 font-bold block mt-0.5">
                Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleMapClick(27.1767, 78.0081)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-red-500 transition cursor-pointer bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Reset Agra</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmSelection}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-red-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Selected Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
