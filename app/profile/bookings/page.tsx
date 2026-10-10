import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TicketCard from "@/components/booking/TicketCard";
import Link from "next/link";
import { Clock, Ticket } from "lucide-react";

export default async function MyBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-red-500 text-xs font-black uppercase tracking-widest block mb-1">ENTRY PASS PORTAL</span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              MY ARENA BOOKINGS
            </h1>
            <p className="text-zinc-400 text-xs mt-1 font-medium">
              Your active court passes & tickets. Hover on any ticket to float.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30 self-start sm:self-auto cursor-pointer"
          >
            + NEW BOOKING
          </Link>
        </div>

        {/* Cancellation Policy Banner */}
        <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-4 mb-8 flex items-start gap-3 text-xs">
          <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <span className="font-black text-red-400 uppercase tracking-wider">15-MINUTE FREE CANCELLATION GUARANTEE</span>
            <p className="text-zinc-300 leading-relaxed font-medium">
              Passes can be cancelled for a full refund within <span className="font-black text-red-400">15 minutes</span> of booking. Active tickets float on hover.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-12 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <Ticket className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">No Active Arena Passes</h2>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto font-medium">
              You don&apos;t have any active court passes or entry tickets yet.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30"
            >
              Book a Slot Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
            {bookings.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}