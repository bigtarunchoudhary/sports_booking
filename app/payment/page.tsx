"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingSummary from "@/components/booking/BookingSummary";
import PaymentCard from "@/components/booking/PaymentCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueName = searchParams.get("venueName") || "";
  const slot = searchParams.get("slot") || "";
  const price = Number(searchParams.get("price") || "0");
  const playerCount = Number(searchParams.get("playerCount") || "1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async (paymentData?: { method: string; advancePaid: number; dueAtVenue: number }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueName,
          slot,
          price: paymentData?.advancePaid !== undefined ? paymentData.advancePaid : price,
          playerCount,
        }),
      });

      if (!response.ok) {
        alert("Booking transaction failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const booking = await response.json();
      router.push(`/success?id=${booking.id}`);
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred during booking.");
      setIsSubmitting(false);
    }
  };

  const isStoreValid = venueName !== "" && slot !== "" && price !== 0;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 relative z-10">
        <span className="text-red-500 text-xs font-black uppercase tracking-widest block mb-1">STEP 2 OF 2</span>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Secure Checkout</h1>
        <p className="text-zinc-400 text-xs sm:text-sm mb-8 font-medium">Select your instant payment mode or pay token deposit to generate your pass.</p>

        {!isStoreValid ? (
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-10 text-center shadow-xl space-y-4">
            <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">No Booking Active</h2>
            <p className="text-zinc-400 text-xs max-w-sm mx-auto font-medium">
              Please go back to the dashboard, pick a venue, and select a time slot to begin booking.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PaymentCard price={price} onPay={handlePayment} />
            </div>
            <div className="lg:col-span-1">
              <BookingSummary venueName={venueName} slot={slot} price={price} playerCount={playerCount} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
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
      <PaymentPageContent />
    </Suspense>
  );
}