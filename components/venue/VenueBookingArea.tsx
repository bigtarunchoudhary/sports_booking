"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SlotSelector from "@/components/booking/SlotSelector";
import BookingButton from "./BookingButton";
import { Users, Minus, Plus } from "lucide-react";

type Slot = {
  id: number;
  time: string;
  price: number;
  isActive: boolean;
};

type Props = {
  venueName: string;
  venuePrice: number;
  slots: Slot[];
};

export default function VenueBookingArea({ venueName, venuePrice, slots }: Props) {
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState("");
  const [selectedSlotPrice, setSelectedSlotPrice] = useState(venuePrice);
  const [playerCount, setPlayerCount] = useState(1);
  const router = useRouter();

  const handleSelectSlot = (id: number, time: string, price: number) => {
    setSelectedSlotId(id);
    setSelectedSlotTime(time);
    setSelectedSlotPrice(price || venuePrice);
  };

  const unitPrice = selectedSlotPrice || venuePrice;
  const totalPrice = unitPrice * playerCount;

  const handleBook = () => {
    if (selectedSlotId === null) return;
    router.push(
      `/booking?venueName=${encodeURIComponent(venueName)}&slot=${encodeURIComponent(
        selectedSlotTime
      )}&price=${totalPrice}&playerCount=${playerCount}`
    );
  };

  return (
    <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl sticky top-24 space-y-6 transition-all duration-300">
      <div>
        <span className="text-[10px] text-zinc-500 block uppercase tracking-widest font-black">RATE / PASS</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-3xl font-black text-white">₹{totalPrice}</span>
          <span className="text-xs text-zinc-400 font-bold">
            {playerCount > 1 ? `(₹${unitPrice} × ${playerCount} players)` : "/ hour rate"}
          </span>
        </div>
      </div>

      {/* Select Time Slot */}
      <div className="border-t border-zinc-900 pt-5">
        <SlotSelector
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {/* Number of Players / Group Size Selector */}
      <div className="border-t border-zinc-900 pt-5 space-y-2.5">
        <div className="flex justify-between items-center">
          <label className="text-xs text-zinc-300 font-black uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-red-500" />
            <span>Player Count</span>
          </label>
          <span className="text-xs font-extrabold text-red-400">
            {playerCount} {playerCount === 1 ? "Person" : "Players"}
          </span>
        </div>

        <div className="flex items-center justify-between bg-black border border-zinc-800 rounded-2xl p-2">
          <button
            type="button"
            onClick={() => setPlayerCount((prev) => Math.max(1, prev - 1))}
            disabled={playerCount <= 1}
            className="w-9 h-9 rounded-xl bg-zinc-900 text-zinc-300 font-black flex items-center justify-center disabled:opacity-30 border border-zinc-800 transition cursor-pointer hover:bg-zinc-800"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="text-center">
            <span className="text-base font-black text-white">
              {playerCount} {playerCount === 1 ? "Pass" : "Passes"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPlayerCount((prev) => Math.min(20, prev + 1))}
            disabled={playerCount >= 20}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black flex items-center justify-center shadow-md shadow-red-600/30 disabled:opacity-30 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <BookingButton selectedSlotId={selectedSlotId} onBook={handleBook} />
    </div>
  );
}