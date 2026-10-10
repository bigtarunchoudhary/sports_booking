"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";

type Props = {
  selected: string;
  setSelected: (sport: string) => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
};

const sports = ["All", "Football", "Basketball", "Badminton", "Tennis", "Swimming", "Cricket", "Pickleball", "Volleyball"];

export default function FilterBar({ selected, setSelected, sortBy = "recommended", setSortBy }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
      {/* Sports Filter Pills */}
      <div className="flex gap-2 flex-wrap items-center flex-1">
        {sports.map((sport) => {
          const isSelected = selected === sport;
          return (
            <button
              key={sport}
              onClick={() => setSelected(sport)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/40 border border-red-400/40"
                  : "bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:border-red-500/50 hover:text-white"
              }`}
            >
              {sport}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      {setSortBy && (
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-zinc-950/80 border border-zinc-800 rounded-full px-3.5 py-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
          >
            <option value="recommended" className="bg-zinc-950 text-white">Recommended</option>
            <option value="rating" className="bg-zinc-950 text-white">Highest Rating</option>
            <option value="price-asc" className="bg-zinc-950 text-white">Price: Low to High</option>
            <option value="price-desc" className="bg-zinc-950 text-white">Price: High to Low</option>
            <option value="occupancy" className="bg-zinc-950 text-white">Lowest Occupancy</option>
          </select>
        </div>
      )}
    </div>
  );
}