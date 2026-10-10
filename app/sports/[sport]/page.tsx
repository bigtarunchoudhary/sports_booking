import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NearbyVenues from "@/components/dashboard/NearbyVenues";
import MapWrapper from "@/components/maps/MapWrapper";
import SportIcon from "@/components/sport/SportIcon";
import Link from "next/link";

type Context = {
  params: Promise<{
    sport: string;
  }>;
};

export default async function SportCategoryPage({ params }: Context) {
  const { sport } = await params;
  const rawSportName = decodeURIComponent(sport);

  // Capitalize first letter (e.g. "swimming" -> "Swimming")
  const sportName = rawSportName.charAt(0).toUpperCase() + rawSportName.slice(1).toLowerCase();

  const venues = await prisma.venue.findMany({
    where: {
      sport: {
        equals: sportName,
      },
    },
    orderBy: {
      rating: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 space-y-8">
        {/* Category Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center border border-red-500/20 shrink-0">
              <SportIcon sport={sportName} className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-1">
                <Link href="/sports" className="hover:underline">Sports Categories</Link>
                <span>/</span>
                <span>{sportName}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {sportName} Venues & Courts
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Showing {venues.length} verified {sportName.toLowerCase()} arenas near your location.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl transition border border-slate-200 dark:border-slate-700 shrink-0"
          >
            Browse All Categories &rarr;
          </Link>
        </div>

        {/* Map of Sport Venues */}
        {venues.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {sportName} Map Locations
            </h2>
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm h-[400px]">
              <MapWrapper venues={venues} />
            </div>
          </div>
        )}

        {/* Venues Grid / List */}
        <div className="pt-2">
          <NearbyVenues venues={venues} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
