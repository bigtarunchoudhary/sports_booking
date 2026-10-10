"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookingSummary from "@/components/booking/BookingSummary";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShoppingCart } from "lucide-react";

function BookingPageContent() {
  const searchParams = useSearchParams();
  const venueName = searchParams.get("venueName") || "";
  const slot = searchParams.get("slot") || "";
  const price = Number(searchParams.get("price") || "0");
  const playerCount = Number(searchParams.get("playerCount") || "1");

  const isStoreValid = venueName !== "" && slot !== "" && price !== 0;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 relative z-10">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest block mb-1">STEP 1 OF 2</span>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
          Verify Pass Details
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mb-8 font-medium">
          Please review your arena pass reservation details before proceeding to instant payment.
        </p>

        {!isStoreValid ? (
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-10 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Your Pass Cart is Empty</h2>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto font-medium">
              Please browse arenas on the dashboard, pick a sport, and select an active slot to begin reservation.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <BookingSummary venueName={venueName} slot={slot} price={price} playerCount={playerCount} />

            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 bg-zinc-900 text-zinc-300 py-3.5 rounded-2xl font-black text-center border border-zinc-800 hover:bg-zinc-800 transition text-xs uppercase tracking-wider cursor-pointer"
              >
                Change Venue
              </Link>
              <Link
                href={`/payment?venueName=${encodeURIComponent(venueName)}&slot=${encodeURIComponent(
                  slot
                )}&price=${price}&playerCount=${playerCount}`}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white py-3.5 rounded-2xl font-black text-center shadow-lg shadow-red-600/40 active:scale-[0.99] transition text-xs uppercase tracking-wider cursor-pointer"
              >
                Proceed to Payment &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}