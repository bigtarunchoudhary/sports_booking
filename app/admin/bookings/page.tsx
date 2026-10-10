import { prisma } from "@/lib/prisma";
import CancelBookingButton from "@/components/admin/CancelBookingButton";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";

export default async function AdminBookings() {
  const cookieStore = await cookies();
  if (!cookieStore.has("playspot_admin_auth")) {
    redirect("/admin/login");
  }

  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex gap-2 text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
              <Link href="/admin" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-400 dark:text-slate-500">Bookings</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Today&apos;s Bookings
            </h1>
          </div>
          <Link
            href="/admin"
            className="bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            &larr; Admin Panel
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">No Reservations Today</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">There are no active bookings recorded in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking: { id: number; venueName: string; slot: string; price: number; bookingId: string; createdAt: Date }) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
                    {booking.venueName}
                  </h3>
                  <div className="flex flex-wrap gap-2 items-center mt-2 text-xs">
                    <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                      {booking.slot}
                    </span>
                    <span className="text-slate-400 dark:text-slate-600">|</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Booked by Demo User</span>
                    <span className="text-slate-400 dark:text-slate-600">|</span>
                    <span className="font-mono text-slate-400 dark:text-slate-500">ID: {booking.bookingId.substring(0, 8)}...</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 border-slate-50 dark:border-slate-800 pt-3 md:pt-0">
                  <span className="font-extrabold text-slate-800 dark:text-white text-lg">
                    ₹{booking.price}
                  </span>
                  <CancelBookingButton
                    bookingId={booking.id}
                    createdAt={booking.createdAt.toISOString()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}