"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2 } from "lucide-react";

type Props = {
  bookingId: number;
  createdAt: string | Date;
};

export default function CancelBookingButton({ bookingId, createdAt }: Props) {
  const createdMs = new Date(createdAt).getTime();
  const expiresMs = createdMs + 15 * 60 * 1000;

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresMs]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel booking.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const isExpired = remainingSeconds <= 0;

  return (
    <button
      onClick={handleCancel}
      disabled={isSubmitting}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 ${
        isExpired
          ? "bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-500/20"
          : "bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-500/20"
      }`}
      title={isExpired ? "Admin override: Cancel booking past 15m window" : "Cancel booking within 15m window"}
    >
      {isExpired ? (
        <Trash2 className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5 animate-pulse" />
      )}
      <span>
        {isSubmitting
          ? "Cancelling..."
          : isExpired
          ? "Cancel Booking (Admin Override)"
          : `Cancel Booking (${timeFormatted} left)`}
      </span>
    </button>
  );
}