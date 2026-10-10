"use client";

import Link from "next/link";
import { CheckCircle2, Download } from "lucide-react";
import { downloadTicketImage } from "@/lib/downloadTicket";

type Props = {
  bookingId: string;
  venueName: string;
  slot: string;
  price: number;
};

export default function SuccessCard({ bookingId, venueName, slot, price }: Props) {
  const handleDownload = () => {
    downloadTicketImage({
      venueName,
      slot,
      bookingId,
      price,
      playerCount: 1,
      dateString: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

      <div>
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/50 text-red-400 text-3xl mb-4 shadow-lg border border-red-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Arena Pass Confirmed!</h2>
        <p className="text-zinc-400 text-xs font-medium mt-1">
          Your court slot has been reserved & entry pass generated.
        </p>
      </div>

      <div className="border border-zinc-800 rounded-2xl p-5 bg-black text-left space-y-3.5">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">Venue Name</span>
            <span className="font-extrabold text-white text-sm">{venueName}</span>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 bg-red-950/60 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Pass</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">Time Slot</span>
            <span className="font-black text-red-400 text-xs bg-red-950/50 px-2.5 py-1 rounded-lg inline-block mt-0.5 border border-red-500/20">
              {slot}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">Rate / Deposit</span>
            <span className="font-black text-white text-sm">₹{price}</span>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-3">
          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block">Booking Reference ID</span>
          <span className="font-mono text-xs text-red-500 font-black block break-all mt-0.5">
            {bookingId}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/dashboard"
          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-3.5 px-6 rounded-xl transition shadow-lg shadow-red-600/30 active:scale-[0.98] text-xs uppercase tracking-widest cursor-pointer"
        >
          Explore More Venues
        </Link>
        <Link
          href="/profile/bookings"
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black py-3.5 px-6 rounded-xl transition border border-zinc-800 text-xs uppercase tracking-widest cursor-pointer"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
}
