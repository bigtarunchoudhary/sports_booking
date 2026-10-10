import { prisma } from "@/lib/prisma";
import CancelBookingButton from "@/components/admin/CancelBookingButton";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  if (!cookieStore.has("playspot_admin_auth")) {
    redirect("/admin/login");
  }

  const totalVenues = await prisma.venue.count();
  const totalBookings = await prisma.booking.count();
  const venues = await prisma.venue.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const occupancy = venues.reduce(
    (sum: number, venue: { occupancy: number }) => sum + venue.occupancy,
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-10 relative z-10">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950/80 p-6 rounded-3xl border border-zinc-800 backdrop-blur-xl">
          <div>
            <span className="text-red-500 text-xs font-black uppercase tracking-widest block mb-1">CONTROL CENTER</span>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              ADMIN CONTROL ROOM
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-medium">Monitor facility live operations, capacities, and active court bookings.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/admin/venues/new"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/30 uppercase tracking-wider transition"
            >
              + ADD VENUE
            </Link>
            <Link
              href="/admin/occupancy"
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black py-2.5 px-4 rounded-xl border border-zinc-800 uppercase tracking-wider transition"
            >
              UPDATE DENSITY
            </Link>
            <Link
              href="/admin/bookings"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-black py-2.5 px-4 rounded-xl border border-zinc-800 uppercase tracking-wider transition"
            >
              ALL BOOKINGS
            </Link>
            <form action="/api/admin/logout" method="POST" className="inline">
              <button
                type="submit"
                className="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 text-xs font-black py-2.5 px-4 rounded-xl transition cursor-pointer uppercase tracking-wider"
              >
                LOGOUT
              </button>
            </form>
          </div>
        </div>

        {/* Stats Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Total Arenas & Turfs</span>
            <div className="flex justify-between items-end mt-4">
              <span className="text-4xl font-black text-white">{totalVenues}</span>
              <span className="text-xs text-red-400 font-black bg-red-950/50 px-2.5 py-1 rounded-lg border border-red-500/20 uppercase tracking-wider">ACTIVE</span>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Total Reservations</span>
            <div className="flex justify-between items-end mt-4">
              <span className="text-4xl font-black text-white">{totalBookings}</span>
              <span className="text-xs text-emerald-400 font-black bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-wider">CONFIRMED</span>
            </div>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Live Players Density</span>
            <div className="flex justify-between items-end mt-4">
              <span className="text-4xl font-black text-white">{occupancy}</span>
              <span className="text-xs text-amber-400 font-black bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-500/20 uppercase tracking-wider">ON COURT</span>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venues Management Table */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Manage Arenas & Facilities
            </h2>

            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-zinc-800">
                      <th className="p-4 pl-6">Facility</th>
                      <th className="p-4">Sport</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Occupancy</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300 text-xs font-bold">
                    {venues.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">
                          No venues created yet. Click &quot;+ Add Venue&quot; to begin.
                        </td>
                      </tr>
                    ) : (
                      venues.map((venue: { id: number; name: string; location: string; sport: string; price: number; occupancy: number; capacity: number }) => (
                        <tr key={venue.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-extrabold text-white block">{venue.name}</span>
                            <span className="text-[11px] text-zinc-500 font-medium">{venue.location}</span>
                          </td>
                          <td className="p-4 text-xs font-extrabold text-red-400">{venue.sport}</td>
                          <td className="p-4 font-black text-white">₹{venue.price}/hr</td>
                          <td className="p-4">
                            <span className="font-mono text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                              {venue.occupancy}/{venue.capacity}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <Link
                              href={`/admin/venues/${venue.id}`}
                              className="text-red-500 hover:text-red-400 text-xs font-black uppercase tracking-widest"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Recent Bookings
            </h2>

            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 text-center shadow-xl">
                  <p className="text-zinc-500 text-xs font-medium">No reservations found.</p>
                </div>
              ) : (
                bookings.map((booking: { id: number; venueName: string; slot: string; price: number; createdAt: Date }) => (
                  <div
                    key={booking.id}
                    className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-3"
                  >
                    <div>
                      <h3 className="font-black text-white text-sm leading-tight uppercase">
                        {booking.venueName}
                      </h3>
                      <p className="text-zinc-400 text-xs mt-1 font-semibold">{booking.slot}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-zinc-900 pt-3">
                      <span className="font-black text-red-500 text-sm">₹{booking.price}</span>
                      <CancelBookingButton
                        bookingId={booking.id}
                        createdAt={booking.createdAt.toISOString()}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}