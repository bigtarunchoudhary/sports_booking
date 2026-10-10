"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Zap, Trophy, Activity, Volume2, VolumeX, Sparkles, Flame, Star, MapPin } from "lucide-react";
import TargetShootoutGame from "./TargetShootoutGame";
import { useSoundStore } from "@/store/soundStore";

const FEATURED_VENUES = [
  {
    id: 1,
    name: "Thunderbolt Football Arena",
    sport: "FOOTBALL",
    location: "Fatehabad Road, Agra",
    rating: 4.9,
    price: 600,
    occupancy: 28,
    capacity: 50,
    availablePct: "44%",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Striker 5v5 Soccer Cage",
    sport: "FOOTBALL",
    location: "Bodla, Agra",
    rating: 4.9,
    price: 550,
    occupancy: 16,
    capacity: 40,
    availablePct: "60%",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Blue Wave Olympic Pool",
    sport: "SWIMMING",
    location: "Taj Nagari, Agra",
    rating: 4.8,
    price: 200,
    occupancy: 18,
    capacity: 40,
    availablePct: "55%",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Smash Arena Badminton Club",
    sport: "BADMINTON",
    location: "Sanjay Place, Agra",
    rating: 4.9,
    price: 300,
    occupancy: 14,
    capacity: 30,
    availablePct: "53%",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Ace Pro Badminton Arena",
    sport: "BADMINTON",
    location: "Kamla Nagar, Agra",
    rating: 4.9,
    price: 350,
    occupancy: 12,
    capacity: 35,
    availablePct: "65%",
    image: "https://images.unsplash.com/photo-1521537634581-0ddea2efe2b6?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Roland Garros Tennis Academy",
    sport: "TENNIS",
    location: "Dayal Bagh, Agra",
    rating: 4.9,
    price: 500,
    occupancy: 10,
    capacity: 25,
    availablePct: "60%",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Skyline Basketball Complex",
    sport: "BASKETBALL",
    location: "Khandari, Agra",
    rating: 4.8,
    price: 400,
    occupancy: 22,
    capacity: 35,
    availablePct: "37%",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Elite Box Cricket Nets",
    sport: "CRICKET",
    location: "Bodla, Agra",
    rating: 4.8,
    price: 450,
    occupancy: 15,
    capacity: 30,
    availablePct: "50%",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    name: "Smash Point Pickleball Court",
    sport: "PICKLEBALL",
    location: "Shahganj, Agra",
    rating: 4.9,
    price: 400,
    occupancy: 8,
    capacity: 20,
    availablePct: "60%",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Volley Spike Beach Court",
    sport: "VOLLEYBALL",
    location: "Trans Yamuna, Agra",
    rating: 4.7,
    price: 350,
    occupancy: 14,
    capacity: 30,
    availablePct: "53%",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&auto=format&fit=crop&q=80",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const { soundEnabled, toggleSound } = useSoundStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      router.push(`/dashboard?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/dashboard");
    }
  };

  const filteredFeatured = activeFilter === "ALL" 
    ? FEATURED_VENUES 
    : FEATURED_VENUES.filter(v => v.sport.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[90vh] px-6 py-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black text-white">
      {/* Red ambient glow atmospheric background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-rose-600/10 blur-[120px] pointer-events-none" />

      {/* Interactive Badge & Sound Pill Controls */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950/70 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>MAKEIMPULSE INTERACTIVE PLAYGROUND</span>
        </span>

        <button
          type="button"
          onClick={toggleSound}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider border border-zinc-800 hover:border-red-500/40 transition cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-red-500" />
          )}
          <span>{soundEnabled ? "SOUND ON" : "MUTED"}</span>
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Huge Bold Heading: PLAY. BOOK. DOMINATE ARENAS. */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.98] uppercase">
          PLAY. BOOK.
          <span className="block mt-2 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            DOMINATE ARENAS.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
          Discover & book synthetic football turfs, Olympic swimming pools, and indoor badminton courts. Check live player density count, select slots, and earn Gems.
        </p>

        {/* Primary Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mt-6 flex flex-col sm:flex-row items-center gap-2 bg-zinc-950/90 p-2.5 rounded-3xl border border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.25)] transition-all focus-within:border-red-500 focus-within:shadow-[0_0_50px_rgba(239,68,68,0.4)]"
        >
          <div className="flex items-center gap-3 flex-1 px-4 w-full">
            <Search className="w-5 h-5 text-red-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by arena, sport (Football, Tennis), or city..."
              className="w-full bg-transparent outline-none text-xs sm:text-base font-bold text-white placeholder-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white font-black px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/40 cursor-pointer shrink-0"
          >
            <span>EXPLORE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Popular Sports Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-black pt-1">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">POPULAR:</span>
          {[
            { name: "Football", q: "Football" },
            { name: "Basketball", q: "Basketball" },
            { name: "Badminton", q: "Badminton" },
            { name: "Tennis", q: "Tennis" },
            { name: "Swimming", q: "Swimming" },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => router.push(`/dashboard?q=${encodeURIComponent(item.q)}`)}
              className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 hover:bg-red-950/60 hover:text-red-400 text-zinc-300 border border-zinc-800 hover:border-red-500/40 transition-all cursor-pointer uppercase"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Hero Quick-Action Utility Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-zinc-950/80 hover:border-amber-500/50 backdrop-blur px-5 py-3 rounded-2xl border border-zinc-800 flex items-center gap-2 text-zinc-200 transition cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>4.9 Star Top Rated Venues</span>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-zinc-950/80 hover:border-red-500/50 backdrop-blur px-5 py-3 rounded-2xl border border-zinc-800 flex items-center gap-2 text-zinc-200 transition cursor-pointer"
          >
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Live Player Count & Occupancy</span>
          </button>

          <a
            href="#game-section"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("game-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-zinc-950/80 hover:border-rose-500/50 backdrop-blur px-5 py-3 rounded-2xl border border-zinc-800 flex items-center gap-2 text-zinc-200 transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-rose-500" />
            <span>Play Interactive Mini-Game Below</span>
          </a>
        </div>
      </div>

      {/* Live Announcement Activity Ticker - Moving Red Venue Strip */}
      <div
        id="venue-ticker-strip"
        className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 border-y-2 border-red-400/50 py-3.5 overflow-hidden select-none relative z-10 shadow-[0_0_35px_rgba(239,68,68,0.5)] my-10"
      >
        <div className="animate-marquee items-center gap-12 font-black uppercase text-xs sm:text-sm tracking-widest text-white">
          {/* Loop 1 */}
          <span className="flex items-center gap-2 drop-shadow">
            ⚽ THUNDERBOLT FOOTBALL ARENA (Fatehabad Road • ₹600/hr • 4.9★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏊 BLUE WAVE OLYMPIC POOL (Taj Nagari • ₹200/hr • 4.8★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏸 SMASH ARENA BADMINTON CLUB (Sanjay Place • ₹300/hr • 4.9★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 text-amber-300 font-extrabold drop-shadow">
            🎾 ROLAND GARROS ACADEMY — NIGHT LIGHTS ACTIVE (Dayal Bagh • ₹500/hr)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🔥 RAHUL S. JUST BOOKED FOOTBALL TURF 2 MINS AGO
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏀 LAKSHYA BASKETBALL COMPLEX (Kamla Nagar • ₹400/hr • 4.7★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 text-amber-300 font-extrabold drop-shadow">
            ⚡ EARN GEMS ON EVERY MATCH RESERVATION PASS
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            ⭐ 4.9 RATED BY 10,000+ ATHLETES
          </span>

          {/* Loop 2 Duplicate for Seamless Infinite Scrolling */}
          <span className="flex items-center gap-2 drop-shadow">
            ⚽ THUNDERBOLT FOOTBALL ARENA (Fatehabad Road • ₹600/hr • 4.9★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏊 BLUE WAVE OLYMPIC POOL (Taj Nagari • ₹200/hr • 4.8★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏸 SMASH ARENA BADMINTON CLUB (Sanjay Place • ₹300/hr • 4.9★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 text-amber-300 font-extrabold drop-shadow">
            🎾 ROLAND GARROS ACADEMY — NIGHT LIGHTS ACTIVE (Dayal Bagh • ₹500/hr)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🔥 RAHUL S. JUST BOOKED FOOTBALL TURF 2 MINS AGO
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            🏀 LAKSHYA BASKETBALL COMPLEX (Kamla Nagar • ₹400/hr • 4.7★)
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 text-amber-300 font-extrabold drop-shadow">
            ⚡ EARN GEMS ON EVERY MATCH RESERVATION PASS
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2 drop-shadow">
            ⭐ 4.9 RATED BY 10,000+ ATHLETES
          </span>
        </div>
      </div>

      {/* Featured Arenas & Courts Section */}
      <div className="w-full max-w-7xl mx-auto pt-16 relative z-10 text-left">
        <div className="text-center mb-8 space-y-2">
          <span className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30 inline-block">
            HOLOGRAPHIC COURT SHOWCASE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            FEATURED ARENAS <span className="text-red-500">&</span> COURTS
          </h2>
        </div>

        {/* Sport Filters Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-6">
          {["ALL", "FOOTBALL", "BASKETBALL", "BADMINTON", "TENNIS", "SWIMMING"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30 border border-red-400/30"
                  : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Featured Arena Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFeatured.map((venue) => (
            <Link key={venue.id} href={`/venue/${venue.id}`}>
              <div className="group relative block bg-zinc-950/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl hover:border-red-500/50 hover:shadow-[0_0_35px_rgba(239,68,68,0.3)] transition-all duration-300 sport-card-float">
                {/* Photo Image Area */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                      {venue.sport}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-red-500 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md shadow-red-500/40 border border-red-400/30">
                      + INSTANT PASS
                    </span>
                  </div>

                  {/* Occupancy & Rating Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs font-black">
                    <span className="bg-black/80 backdrop-blur-md text-red-400 px-2.5 py-1 rounded-full border border-red-500/20 text-[10px]">
                      {Math.round((venue.occupancy / venue.capacity) * 100)}% Occupied
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20 text-[10px] flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {venue.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors uppercase truncate">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{venue.location}</span>
                    </p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5 bg-black/60 p-3 rounded-2xl border border-zinc-900">
                    <div className="flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <span>LIVE CAPACITY</span>
                      <span className="text-emerald-400">{venue.availablePct} AVAILABLE</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full"
                        style={{ width: `${Math.round((venue.occupancy / venue.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                    <div>
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block">PRICE PER HOUR</span>
                      <span className="text-xl font-black text-white">₹{venue.price}</span>
                    </div>
                    <span className="bg-white hover:bg-red-500 text-black hover:text-white font-black text-xs px-4 py-2 rounded-xl transition-all duration-300 uppercase tracking-widest shadow">
                      BOOK ARENA &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Target Shootout Playable Mini-Game Section (Placed BELOW Featured Arenas) */}
      <div id="game-section" className="w-full relative z-20 pt-12">
        <TargetShootoutGame />
      </div>
    </section>
  );
}