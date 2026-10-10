"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Search, UserCircle2, X, Flame, Volume2, VolumeX } from "lucide-react";
import { useLocationStore } from "@/store/locationStore";
import { useGemsStore } from "@/store/gemsStore";
import { useSoundStore } from "@/store/soundStore";
import LocationModal from "./LocationModal";
import Logo from "@/components/ui/Logo";

const NAV_LINKS = [
  { label: "FOR YOU", href: "/" },
  { label: "VENUES", href: "/dashboard" },
  { label: "SPORTS", href: "/sports" },
  { label: "GEMS", href: "/gems" },
  { label: "MY BOOKINGS", href: "/profile/bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { location } = useLocationStore();
  const { gems } = useGemsStore();
  const { soundEnabled, toggleSound } = useSoundStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/dashboard?q=${encodeURIComponent(trimmed)}` : "/dashboard");
    setSearchOpen(false);
    setQuery("");
  };

  const shortCityName = location.split(",")[0];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-zinc-900 text-white transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center gap-5 px-6 py-3.5">
          {/* Logo */}
          <Logo href="/" size="md" textClassName="hidden sm:block" />

          {/* Location Selector Button */}
          <button
            onClick={() => setLocationModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 shrink-0 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-800 hover:border-red-500/50 transition-all cursor-pointer group"
            title="Click to change location"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
            <span>{shortCityName}</span>
          </button>

          {/* Category tabs */}
          {!searchOpen && (
            <div className="hidden lg:flex items-center gap-1.5 ml-2">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-[11px] font-black tracking-wider rounded-full transition-all ${
                      active
                        ? "text-red-500 bg-red-950/40 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex-1" />

          {/* Sound Effect Toggle */}
          <button
            onClick={toggleSound}
            className="hidden md:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-300 hover:text-white bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 hover:border-red-500/40 transition cursor-pointer shrink-0"
            title={soundEnabled ? "Mute Web Audio Synth" : "Enable Sound Effects"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>{soundEnabled ? "SOUND ON" : "MUTED"}</span>
          </button>

          {/* Gems Balance Badge */}
          <Link
            href="/gems"
            className="flex items-center gap-1 text-[11px] font-black text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-500/30 hover:border-amber-400 transition-all shrink-0 shadow-sm"
          >
            <span>{gems} GEMS</span>
          </Link>

          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm flex items-center gap-2 bg-zinc-900/90 border border-red-500/50 rounded-full px-4 py-2 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Search className="w-4 h-4 text-red-500 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search arenas, sports, location..."
                className="flex-1 bg-transparent outline-none text-xs font-bold placeholder-zinc-500 min-w-0 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                className="text-zinc-400 hover:text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900/80 border border-zinc-800 hover:border-red-500/50 hover:bg-zinc-800 transition-colors text-zinc-300 cursor-pointer shrink-0"
              title="Search arenas"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <Link
            href="/admin"
            className="hidden xl:flex items-center gap-1.5 text-[10px] font-black text-amber-400 hover:text-amber-300 bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-500/30 hover:border-amber-400 transition-all shrink-0 uppercase tracking-widest"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>ADMIN ROOM</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-2 text-xs font-extrabold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-4 py-2 rounded-full shadow-md shadow-red-600/30 transition-all shrink-0 uppercase tracking-wider"
          >
            <UserCircle2 className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile category tabs */}
        {!searchOpen && (
          <div className="lg:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setLocationModalOpen(true)}
              className="px-3 py-1 text-[11px] font-bold rounded-full whitespace-nowrap bg-red-950/50 text-red-400 flex items-center gap-1 border border-red-500/30"
            >
              <MapPin className="w-3 h-3" />
              <span>{shortCityName}</span>
            </button>
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1 text-[11px] font-bold rounded-full whitespace-nowrap transition-colors ${
                    active
                      ? "bg-red-950/60 text-red-400 border border-red-500/40"
                      : "text-zinc-400 bg-zinc-900/80 border border-zinc-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Location Selection Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}