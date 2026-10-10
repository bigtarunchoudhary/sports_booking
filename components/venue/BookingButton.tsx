"use client";

import { ArrowRight, Lock } from "lucide-react";

type Props = {
  selectedSlotId: number | null;
  onBook: () => void;
};

export default function BookingButton({ selectedSlotId, onBook }: Props) {
  const isSelected = selectedSlotId !== null;

  return (
    <button
      type="button"
      onClick={onBook}
      disabled={!isSelected}
      className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
        isSelected
          ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/25 hover:shadow-lg active:scale-[0.99]"
          : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
      }`}
    >
      {isSelected ? (
        <>
          <span>Book Now</span>
          <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          <span>Select Time Slot to Continue</span>
        </>
      )}
    </button>
  );
}
