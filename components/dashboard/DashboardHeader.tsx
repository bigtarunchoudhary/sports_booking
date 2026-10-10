"use client";

import { Trophy, Sparkles } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="mb-8 bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
      <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest mb-3">
        <Trophy className="w-4 h-4 text-red-500" />
        <span>INSTANT ARENA PASS BOOKING</span>
        <Sparkles className="w-4 h-4 ml-auto text-amber-400 animate-pulse" />
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
        Explore Sports <span className="text-red-500">Arenas & Turfs</span>
      </h1>
      <p className="text-zinc-400 text-sm mt-3 max-w-2xl font-medium leading-relaxed">
        Discover top-rated synthetic turfs, Olympic pools, badminton courts, and cricket nets. Track live arena player density and secure instant slot passes.
      </p>
    </div>
  );
}
