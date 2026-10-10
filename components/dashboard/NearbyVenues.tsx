import Link from "next/link";
import SportIcon from "@/components/sport/SportIcon";
import { Search, Star, MapPin } from "lucide-react";

type Venue = {
  id: number;
  name: string;
  sport: string;
  location: string;
  rating: number;
  price: number;
  occupancy: number;
  capacity: number;
};

type NearbyVenuesProps = {
  venues: Venue[];
  search?: string;
  clearSearch?: () => void;
};

export default function NearbyVenues({ venues, search = "", clearSearch }: NearbyVenuesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
          <span>{search.trim() ? "Search Results" : "Featured Arenas & Courts"}</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </h2>
        <span className="text-xs font-bold text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          Showing {venues.length} {venues.length === 1 ? "venue" : "venues"}
        </span>
      </div>

      {venues.length === 0 ? (
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
            <Search className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            No arenas found {search ? `for "${search}"` : ""}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
            We couldn&apos;t find any venue matching your query. Try searching for a different sport (e.g. Football, Basketball, Swimming) or location.
          </p>
          {clearSearch && (
            <button
              onClick={clearSearch}
              className="mt-2 inline-flex items-center gap-1 text-xs font-black text-red-500 hover:text-red-400 cursor-pointer bg-red-950/30 px-4 py-2 rounded-full border border-red-500/20 uppercase tracking-widest"
            >
              Clear Search & Show All Venues
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => {
            const occupancyRate = (venue.occupancy / venue.capacity) * 100;
            const isCrowded = occupancyRate > 80;
            const isModerate = occupancyRate > 50 && occupancyRate <= 80;

            return (
              <Link key={venue.id} href={`/venue/${venue.id}`}>
                <div className="group relative block bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-6 shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:border-red-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between overflow-hidden">
                  {/* Subtle red background corner glow on hover */}
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/25 transition-colors" />

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-950/50 px-3 py-1 rounded-full border border-red-500/20">
                          <SportIcon sport={venue.sport} className="w-3 h-3 text-red-500" />
                          <span>{venue.sport}</span>
                        </span>
                        <h3 className="text-xl font-black text-white mt-3 group-hover:text-red-400 transition-colors leading-tight uppercase tracking-tight">
                          {venue.name}
                        </h3>
                      </div>
                      <span className="text-amber-400 font-extrabold text-xs flex items-center gap-1 bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-500/20 shadow-sm select-none">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{venue.rating.toFixed(1)}</span>
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs font-semibold mb-6 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{venue.location}</span>
                    </p>

                    {/* Live Player Density Indicator */}
                    <div className="mb-6 space-y-2.5 bg-black/60 p-3.5 rounded-2xl border border-zinc-900">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-zinc-300 uppercase tracking-wider text-[10px]">Live Player Density</span>
                        <span className="font-extrabold text-white">
                          {venue.occupancy} <span className="text-zinc-500 font-medium">/ {venue.capacity} active</span>
                        </span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden p-[2px] border border-zinc-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 shadow-inner ${
                            isCrowded
                              ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                              : isModerate
                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : "bg-gradient-to-r from-emerald-400 to-teal-500"
                          }`}
                          style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                        <span className={isCrowded ? "text-red-400" : isModerate ? "text-amber-400" : "text-emerald-400"}>
                          {isCrowded ? "HIGH OCCUPANCY" : isModerate ? "MODERATE CROWD" : "SLOTS AVAILABLE"}
                        </span>
                        <span className="text-zinc-400">
                          {Math.round(occupancyRate)}% Full
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900/80 mt-2">
                    <div>
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block">STARTING AT</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">₹{venue.price}</span>
                        <span className="text-xs text-zinc-400 font-bold">/ hr</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 group-hover:from-red-500 group-hover:to-rose-500 text-white font-black text-xs py-2.5 px-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md shadow-red-600/30">
                      <span>Book Slot</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}