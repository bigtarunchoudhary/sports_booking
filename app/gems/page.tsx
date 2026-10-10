"use client";

import { useGemsStore } from "@/store/gemsStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TargetShootoutGame from "@/components/home/TargetShootoutGame";
import Link from "next/link";
import { Trophy, CheckCircle2, Gift, Gamepad2, Ticket, Star, Sparkles } from "lucide-react";

export default function GemsPage() {
  const { gems, perks, redeemPerk, highScore } = useGemsStore();

  const handleRedeem = (perkId: string, title: string) => {
    const success = redeemPerk(perkId);
    if (success) {
      alert(`Success! You have redeemed "${title}". Check your active perks.`);
    } else {
      alert("Insufficient Gems or perk already redeemed.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-12 relative z-10">
        {/* Header & Gems Counter Box */}
        <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-950/60 text-red-400 text-xs font-black uppercase tracking-widest border border-red-500/30">
              MAKEIMPULSE VIRTUAL ECONOMY
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">
              GEMS & <span className="text-red-500">REWARDS PORTAL</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-medium">
              Earn Gems by playing mini-games, booking turfs, and rating venues. Redeem for instant booking promo codes & physical venue perks!
            </p>
          </div>

          <div className="bg-black p-6 rounded-2xl border border-zinc-800 flex items-center gap-6 shadow-xl shrink-0">
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">YOUR GEMS BALANCE</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-2 mt-1">
                <span>{gems} GEMS</span>
              </div>
            </div>
            <div className="w-[1px] h-10 bg-zinc-900" />
            <div className="text-center">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">SHOOTOUT HIGH SCORE</span>
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1 mt-1">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>{highScore} Pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Arena Target Shootout Mini-Game */}
        <div id="game-section" className="w-full">
          <TargetShootoutGame />
        </div>

        {/* Gamification Ways to Earn Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>Ways to Earn Gems</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-red-500/50 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Play Target Shootout</h3>
                <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">
                  Shoot moving targets in our playable mini-game. Earn +50 to +200 Gems per game session.
                </p>
              </div>
              <Link
                href="/#game-section"
                className="bg-zinc-900 hover:bg-red-600 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition border border-zinc-800"
              >
                PLAY MINI-GAME &rarr;
              </Link>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-red-500/50 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Ticket className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Book Any Arena</h3>
                <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">
                  Get instant bonus Gems for every confirmed court, turf, or pool reservation pass.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="bg-zinc-900 hover:bg-red-600 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition border border-zinc-800"
              >
                BOOK ARENA (+100 GEMS) &rarr;
              </Link>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-red-500/50 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Rate & Review</h3>
                <p className="text-xs text-zinc-400 mt-2 font-medium leading-relaxed">
                  Leave feedback after your sports match session and receive +50 bonus Gems automatically.
                </p>
              </div>
              <Link
                href="/profile/bookings"
                className="bg-zinc-900 hover:bg-red-600 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition border border-zinc-800"
              >
                MY BOOKINGS (+50 GEMS) &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Redeemable Perks & Passes */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                REDEEMABLE PERKS & PASSES
              </h2>
              <p className="text-xs text-zinc-400 font-medium">Exchange your earned Gems for venue promo codes and physical on-court rewards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perks.map((perk) => (
              <div
                key={perk.id}
                className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden flex flex-col justify-between group hover:border-red-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      {perk.cost} GEMS
                    </span>
                    {perk.isRedeemed && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> REDEEMED
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between gap-4">
                  {perk.isRedeemed ? (
                    <div className="w-full bg-black p-3 rounded-xl border border-zinc-800 text-center">
                      <span className="text-[10px] text-zinc-500 font-black block uppercase">PROMO CODE</span>
                      <span className="font-mono text-sm font-black text-red-500 tracking-widest">
                        {perk.code}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRedeem(perk.id, perk.title)}
                      disabled={gems < perk.cost}
                      className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-lg cursor-pointer ${
                        gems >= perk.cost
                          ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30"
                          : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
                      }`}
                    >
                      {gems >= perk.cost ? `REDEEM PERK (${perk.cost} GEMS)` : `NEED ${perk.cost - gems} MORE GEMS`}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
