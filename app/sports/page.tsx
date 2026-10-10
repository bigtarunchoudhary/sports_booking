import Link from "next/link";
import { sports } from "@/data/sports";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SportIcon from "@/components/sport/SportIcon";

export default function SportsCategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-950/60 text-red-400 text-xs font-black tracking-widest uppercase border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            ARENA DIRECTORY BY SPORT
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
            EXPLORE SPORTS <span className="text-red-500">CATEGORIES</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto font-medium">
            Select your discipline to browse dedicated turfs, court slots, occupancy stats, and instant arena booking passes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link key={sport.id} href={`/dashboard?q=${encodeURIComponent(sport.name)}`} className="group block">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 text-center sport-card-float hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-red-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-red-950/40 group-hover:border-red-500/40 transition-all duration-300 shadow-md">
                    <SportIcon sport={sport.name} className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-black text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                    {sport.name}
                  </h2>
                  <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2 font-medium">
                    {sport.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-center text-xs font-black text-red-500 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  EXPLORE &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
