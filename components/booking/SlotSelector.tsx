"use client";

import { Clock, Check } from "lucide-react";

type Slot = {
  id: number;
  time: string;
  price: number;
  isActive: boolean;
};

type Props = {
  slots: Slot[];
  selectedSlotId: number | null;
  onSelectSlot: (id: number, time: string, price: number) => void;
};

export default function SlotSelector({ slots, selectedSlotId, onSelectSlot }: Props) {
  const activeSlots = slots.filter((s) => s.isActive);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs text-zinc-300 font-black uppercase tracking-wider block">
          Select Available Time Slot
        </label>
        <span className="text-[10px] font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
          {activeSlots.length} AVAILABLE
        </span>
      </div>

      {activeSlots.length === 0 ? (
        <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 font-medium">No active time slots available currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {activeSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelectSlot(slot.id, slot.time, slot.price)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-black transition-all text-left cursor-pointer ${
                  isSelected
                    ? "border-red-500 bg-red-950/60 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-1 ring-red-500"
                    : "border-zinc-800 bg-black text-zinc-300 hover:border-red-500/50 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-red-500" : "text-zinc-500"}`} />
                  <span>{slot.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white text-xs">₹{slot.price}</span>
                  {isSelected && <Check className="w-4 h-4 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
