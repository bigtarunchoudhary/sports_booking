"use client";

import { useState } from "react";
import { downloadTicketImage } from "@/lib/downloadTicket";
import { Download, Clock, Ticket, Users, Trash2 } from "lucide-react";
import QRCodeCard from "./QRCodeCard";

type Booking = {
  id: number;
  venueName: string;
  slot: string;
  price: number;
  playerCount?: number;
  createdAt: Date | string;
};

type Props = {
  booking: Booking;
};

export default function TicketCard({ booking }: Props) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const createdDate = new Date(booking.createdAt);
  const diffInMinutes = (new Date().getTime() - createdDate.getTime()) / (1000 * 60);
  const canCancel = diffInMinutes <= 15 && !cancelled;

  const handleDownload = () => {
    downloadTicketImage({
      venueName: booking.venueName,
      slot: booking.slot,
      bookingId: booking.id,
      price: booking.price,
      playerCount: booking.playerCount || 1,
      dateString: createdDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    });
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking pass? Full refund will be processed.")) return;
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCancelled(true);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during cancellation.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (cancelled) {
    return (
      <div className="bg-zinc-950/40 border border-zinc-800 rounded-3xl p-6 opacity-60 text-center space-y-2">
        <span className="text-xs font-black text-red-500 uppercase tracking-wider block">Pass Cancelled & Refunded</span>
        <p className="text-xs text-zinc-500 font-medium">Ref ID: #{booking.id} ({booking.venueName})</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:border-red-500/50 transition-all duration-300 space-y-5 relative overflow-hidden group sport-card-float">
      <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-red-950/50 text-red-400 px-2.5 py-1 rounded-full border border-red-500/20">
            <Ticket className="w-3 h-3" />
            <span>Entry Pass</span>
          </span>
          <h3 className="text-lg font-black text-white mt-2 leading-tight uppercase">
            {booking.venueName}
          </h3>
        </div>

        <button
          onClick={handleDownload}
          className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-red-600 hover:text-white text-zinc-300 transition cursor-pointer"
          title="Download PNG Ticket"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-black p-3 rounded-2xl border border-zinc-900">
          <span className="text-[10px] text-zinc-500 font-black uppercase block">Time Slot</span>
          <div className="flex items-center gap-1 text-red-400 font-black mt-1">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>{booking.slot}</span>
          </div>
        </div>

        <div className="bg-black p-3 rounded-2xl border border-zinc-900">
          <span className="text-[10px] text-zinc-500 font-black uppercase block">Group & Rate</span>
          <div className="flex items-center justify-between text-white font-black mt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              {booking.playerCount || 1}
            </span>
            <span className="text-red-500">₹{booking.price}</span>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="pt-1">
        <QRCodeCard bookingId={String(booking.id)} venueName={booking.venueName} slot={booking.slot} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs font-bold">
        <span className="text-[11px] font-mono text-zinc-500">Ref: #{booking.id}</span>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-red-500 hover:text-red-400 font-black text-xs flex items-center gap-1 hover:underline cursor-pointer uppercase tracking-wider"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isCancelling ? "Cancelling..." : "Cancel (15m Policy)"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
