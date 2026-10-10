"use client";

import React from "react";
import { Search, X } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-red-500 transition-colors">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by arena name, sport, or location..."
        className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm outline-none focus:border-red-500/80 focus:shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all text-white placeholder-zinc-500 font-bold"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}