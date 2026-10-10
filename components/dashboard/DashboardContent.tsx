"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import NearbyVenues from "./NearbyVenues";
import MapWrapper from "@/components/maps/MapWrapper";
import SportsGrid from "./SportsGrid";

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
  initialVenues: Venue[];
};

function DashboardContentInner({ initialVenues }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [search, setSearch] = useState(queryParam);
  const [prevQueryParam, setPrevQueryParam] = useState(queryParam);
  const [selectedSport, setSelectedSport] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // Keep search state synced during render when URL parameter changes
  if (queryParam !== prevQueryParam) {
    setPrevQueryParam(queryParam);
    setSearch(queryParam);
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    const newUrl = params.toString() ? `/dashboard?${params.toString()}` : "/dashboard";
    router.replace(newUrl, { scroll: false });
  };

  // Filter venues strictly by search query & sport category
  const filteredVenues = initialVenues.filter((venue) => {
    const q = search.trim().toLowerCase();

    const matchesSearch =
      !q ||
      venue.name.toLowerCase().includes(q) ||
      venue.location.toLowerCase().includes(q) ||
      venue.sport.toLowerCase().includes(q);

    const matchesSport =
      selectedSport === "All" || venue.sport.toLowerCase() === selectedSport.toLowerCase();

    return matchesSearch && matchesSport;
  });

  // Sort venues based on selected criteria
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "occupancy") {
      const aPct = a.capacity ? a.occupancy / a.capacity : 0;
      const bPct = b.capacity ? b.occupancy / b.capacity : 0;
      return aPct - bPct;
    }
    return 0; // default order
  });

  const isSearching = Boolean(search.trim());

  return (
    <div className="space-y-8">
      {/* Top Search & Filter Bar Controls */}
      <div className="flex flex-col gap-6">
        <div className="w-full max-w-xl mx-auto md:mx-0">
          <SearchBar search={search} setSearch={handleSearchChange} />
        </div>
        <div className="w-full">
          <FilterBar
            selected={selectedSport}
            setSelected={setSelectedSport}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>

      {/* Active Search Context Header when filtering */}
      {isSearching && (
        <div className="flex items-center justify-between bg-red-950/40 border border-red-500/30 px-5 py-3 rounded-2xl text-xs">
          <span className="font-medium text-zinc-300">
            Showing results for <span className="font-black text-red-400">&quot;{search}&quot;</span> ({sortedVenues.length}{" "}
            {sortedVenues.length === 1 ? "venue" : "venues"} found)
          </span>
          <button
            onClick={() => handleSearchChange("")}
            className="font-bold text-red-500 hover:underline cursor-pointer uppercase tracking-wider text-[11px]"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Hide Sports Grid while searching so only searched venue(s) appear */}
      {!isSearching && <SportsGrid />}

      {/* Interactive Map of Filtered Venues */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <span>{isSearching ? "Searched Venue Location" : "Interactive Arena Map"}</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
            {sortedVenues.length} {sortedVenues.length === 1 ? "location" : "locations"} on map
          </span>
        </div>
        <div className="rounded-3xl border border-zinc-800 overflow-hidden shadow-xl h-[450px]">
          <MapWrapper venues={sortedVenues} />
        </div>
      </div>

      {/* Filtered Venues List */}
      <NearbyVenues venues={sortedVenues} search={search} clearSearch={() => handleSearchChange("")} />
    </div>
  );
}

export default function DashboardContent(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContentInner {...props} />
    </Suspense>
  );
}
