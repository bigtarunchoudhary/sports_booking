"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Minus, Plus, CheckCircle2 } from "lucide-react";

type Venue = {
  id: number;
  name: string;
  sport: string;
  location: string;
  occupancy: number;
  capacity: number;
  imageUrl?: string | null;
};

type Props = {
  venues: Venue[];
};

export default function UpdateOccupancyForm({ venues: initialVenues }: Props) {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>(initialVenues);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("All");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sportsList = ["All", ...Array.from(new Set(initialVenues.map((v) => v.sport)))];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const updateOccupancyRealtime = async (venueId: number, nextOccupancy: number) => {
    const venue = venues.find((v) => v.id === venueId);
    if (!venue) return;

    const clampedCount = Math.max(0, Math.min(venue.capacity, nextOccupancy));

    setVenues((prev) =>
      prev.map((v) => (v.id === venueId ? { ...v, occupancy: clampedCount } : v))
    );

    setUpdatingId(venueId);

    try {
      const response = await fetch(`/api/venues/${venueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupancy: clampedCount }),
      });

      if (!response.ok) {
        setVenues(initialVenues);
        alert("Failed to sync live occupancy update.");
      } else {
        showToast(`Updated ${venue.name} → ${clampedCount}/${venue.capacity} players`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setVenues(initialVenues);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVenues = venues.filter((venue) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      venue.name.toLowerCase().includes(q) ||
      venue.location.toLowerCase().includes(q) ||
      venue.sport.toLowerCase().includes(q);

    const matchesSport = selectedSport === "All" || venue.sport.toLowerCase() === selectedSport.toLowerCase();

    return matchesSearch && matchesSport;
  });

  const totalOccupancy = venues.reduce((acc, v) => acc + v.occupancy, 0);
  const totalCapacity = venues.reduce((acc, v) => acc + v.capacity, 0);
  const totalPercentage = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;
  const highCapacityCount = venues.filter((v) => v.capacity > 0 && v.occupancy / v.capacity >= 0.8).length;

  return (
    <div className="space-y-8 select-none">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-red-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">
            Total Live Players
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-black text-white">{totalOccupancy}</span>
            <span className="text-xs font-bold text-zinc-400">
              out of {totalCapacity} capacity
            </span>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">
            Overall Occupancy Rate
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-black text-white">{totalPercentage}%</span>
            <div className="w-24 bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, totalPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">
            High Density Arenas (&ge;80%)
          </span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-4xl font-black text-red-500">{highCapacityCount}</span>
            <span className="text-xs font-black text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">
              Needs Monitoring
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue by name or location..."
            className="w-full bg-black border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold focus:border-red-500 outline-none text-white placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {sportsList.map((sport) => {
            const isSelected = selectedSport.toLowerCase() === sport.toLowerCase();
            return (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Occupancy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVenues.map((venue) => {
          const percentage = venue.capacity > 0 ? Math.round((venue.occupancy / venue.capacity) * 100) : 0;
          const isHigh = percentage >= 80;

          return (
            <div
              key={venue.id}
              className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:border-red-500/40 transition-all duration-200 space-y-5 relative overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block bg-red-950/50 text-red-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-red-500/20 mb-1">
                    {venue.sport}
                  </span>
                  <h3 className="text-lg font-black text-white leading-tight uppercase">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">{venue.location}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white block font-mono">
                    {venue.occupancy} / {venue.capacity}
                  </span>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    {updatingId === venue.id && (
                      <span className="text-[9px] font-black uppercase text-amber-400 animate-pulse bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Syncing...
                      </span>
                    )}
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block ${
                      isHigh
                        ? "bg-red-950/60 text-red-400 border border-red-500/40"
                        : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {percentage}% Density
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-black h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isHigh
                        ? "bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        : "bg-gradient-to-r from-emerald-400 to-teal-500"
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>

              {/* Live Interactive Range Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>DRAG LIVE SLIDER</span>
                  <span className="text-white">{venue.occupancy} Players</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={venue.capacity}
                  value={venue.occupancy}
                  onChange={(e) => updateOccupancyRealtime(venue.id, Number(e.target.value))}
                  className="w-full h-2.5 bg-black rounded-lg appearance-none cursor-pointer accent-red-500 border border-zinc-800"
                />
              </div>

              {/* Instant Steppers & Quick Actions */}
              <div className="pt-2 border-t border-zinc-900 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Quick Adjust
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* -5 Button */}
                    <button
                      type="button"
                      onClick={() => updateOccupancyRealtime(venue.id, venue.occupancy - 5)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-black transition cursor-pointer border border-zinc-800"
                    >
                      -5
                    </button>

                    {/* -1 Button */}
                    <button
                      type="button"
                      onClick={() => updateOccupancyRealtime(venue.id, venue.occupancy - 1)}
                      disabled={venue.occupancy <= 0}
                      className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-red-600 text-white flex items-center justify-center font-black disabled:opacity-30 transition border border-zinc-800 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Direct Number Input */}
                    <input
                      type="number"
                      value={venue.occupancy}
                      onChange={(e) => updateOccupancyRealtime(venue.id, Number(e.target.value))}
                      className="w-14 text-center bg-black border border-zinc-800 rounded-xl py-2 text-xs font-mono font-black focus:border-red-500 outline-none text-white"
                    />

                    {/* +1 Button */}
                    <button
                      type="button"
                      onClick={() => updateOccupancyRealtime(venue.id, venue.occupancy + 1)}
                      disabled={venue.occupancy >= venue.capacity}
                      className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center font-black disabled:opacity-30 transition shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* +5 Button */}
                    <button
                      type="button"
                      onClick={() => updateOccupancyRealtime(venue.id, venue.occupancy + 5)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-950/50 text-red-400 hover:bg-red-600 hover:text-white text-xs font-black transition border border-red-500/30 cursor-pointer uppercase"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateOccupancyRealtime(venue.id, 0)}
                    className="flex-1 py-1.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-[10px] font-black text-zinc-400 transition uppercase cursor-pointer"
                  >
                    Clear (0)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateOccupancyRealtime(venue.id, Math.round(venue.capacity / 2))}
                    className="flex-1 py-1.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-[10px] font-black text-zinc-400 transition uppercase cursor-pointer"
                  >
                    Half (50%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateOccupancyRealtime(venue.id, venue.capacity)}
                    className="flex-1 py-1.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-[10px] font-black text-zinc-400 transition uppercase cursor-pointer"
                  >
                    Full ({venue.capacity})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
