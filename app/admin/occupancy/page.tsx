import { prisma } from "@/lib/prisma";
import UpdateOccupancyForm from "@/components/admin/UpdateOccupancyForm";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Activity } from "lucide-react";

export default async function OccupancyPage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("playspot_admin_auth")) {
    redirect("/admin/login");
  }

  const venues = await prisma.venue.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 space-y-8">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex gap-2 text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
              <Link href="/admin" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-400 dark:text-slate-500">Real-Time Occupancy Control</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Real-Time Arena Occupancy</span>
              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse">
                <Activity className="w-3 h-3" /> Live Control
              </span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Instantly adjust player count for all venues with 1-click steppers & live sliders.
            </p>
          </div>

          <Link
            href="/admin"
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 self-start sm:self-auto cursor-pointer"
          >
            &larr; Back to Admin Control
          </Link>
        </div>

        {venues.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm space-y-4">
            <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Activity className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">No Venues Found</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto font-medium">
              Create a sports venue first to manage real-time player occupancy density.
            </p>
            <Link
              href="/admin/venues/new"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
            >
              + Add Venue Now
            </Link>
          </div>
        ) : (
          <UpdateOccupancyForm venues={venues} />
        )}
      </main>

      <Footer />
    </div>
  );
}