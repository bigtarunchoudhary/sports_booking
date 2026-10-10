"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

type Venue = {
  id: number;
  name: string;
  sport: string;
  location: string;
  rating: number;
  price: number;
  occupancy: number;
  capacity: number;
  latitude: number;
  longitude: number;
};

type Props = {
  venues: Venue[];
};

// Sport code getter helper for map pins
function getSportCode(sport: string): string {
  const lower = sport.toLowerCase();
  if (lower.includes("football")) return "FB";
  if (lower.includes("swim")) return "SW";
  if (lower.includes("badminton")) return "BD";
  if (lower.includes("basket")) return "BB";
  if (lower.includes("tennis")) return "TN";
  if (lower.includes("cricket")) return "CR";
  if (lower.includes("volley")) return "VB";
  if (lower.includes("pickle")) return "PK";
  return "AR";
}

// Component to dynamically re-center map view whenever filtered venues change
function MapRecenter({ venues }: { venues: Venue[] }) {
  const map = useMap();

  useEffect(() => {
    if (venues.length > 0) {
      const first = venues[0];
      if (first.latitude && first.longitude) {
        map.setView([first.latitude, first.longitude], 13);
      }
    }
  }, [venues, map]);

  return null;
}

export default function VenueMap({ venues }: Props) {
  const defaultCenter: [number, number] =
    venues.length > 0 && venues[0].latitude && venues[0].longitude
      ? [venues[0].latitude, venues[0].longitude]
      : [27.1767, 78.0081]; // Default Agra center

  // SSR-safe marker icon generator
  const createMarkerIcon = useMemo(() => {
    return (sport: string) => {
      if (typeof window === "undefined") return undefined;
      const code = getSportCode(sport);
      return L.divIcon({
        className: "custom-neon-marker",
        html: `<div style="
          width: 34px;
          height: 34px;
          background: #ef4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 15px #ef4444, 0 0 25px rgba(239,68,68,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
          cursor: pointer;
        ">${code}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -17],
      });
    };
  }, []);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "450px", width: "100%", background: "#000000" }}
      className="z-0"
    >
      <MapRecenter venues={venues} />
      {/* High contrast dark tile layer (CartoDB Dark Matter) */}
      <TileLayer
        attribution="&copy; <a href='https://carto.com/'>CARTO</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {venues.map((venue) => {
        const icon = createMarkerIcon(venue.sport);
        return (
          <Marker
            key={venue.id}
            position={[venue.latitude || 27.1767, venue.longitude || 78.0081]}
            icon={icon}
          >
            <Popup className="dark-popup">
              <div className="p-3 bg-zinc-950 text-white rounded-2xl border border-zinc-800 space-y-2 max-w-[220px]">
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block bg-red-950/60 px-2 py-0.5 rounded-full border border-red-500/20 w-fit">
                  {venue.sport}
                </span>
                <h4 className="font-black text-white text-xs m-0 uppercase leading-tight">
                  {venue.name}
                </h4>
                <p className="text-zinc-400 text-[11px] m-0 font-medium">
                  {venue.location}
                </p>
                <div className="flex justify-between items-center pt-2 mt-1 border-t border-zinc-900">
                  <span className="font-black text-white text-xs">
                    ₹{venue.price}/hr
                  </span>
                  <Link
                    href={`/venue/${venue.id}`}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-black py-1.5 px-3 rounded-xl uppercase tracking-wider transition shadow-md shadow-red-600/30 !text-white"
                  >
                    Book Arena &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}