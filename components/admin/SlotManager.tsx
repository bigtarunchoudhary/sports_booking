"use client";

import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";

type Slot = {
  id: number;
  time: string;
  price: number;
  isActive: boolean;
};

type Props = {
  venueId: number;
  initialSlots: Slot[];
};

export default function SlotManager({ venueId, initialSlots }: Props) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [newTime, setNewTime] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSlot = async () => {
    if (!newTime || !newPrice) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${venueId}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ time: newTime, price: Number(newPrice) }),
      });

      if (response.ok) {
        const slot = await response.json();
        setSlots((prev) => [...prev, slot]);
        setNewTime("");
        setNewPrice("");
      } else {
        alert("Failed to add slot.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (slot: Slot) => {
    const nextActive = !slot.isActive;
    setSlots((prev) =>
      prev.map((s) => (s.id === slot.id ? { ...s, isActive: nextActive } : s))
    );

    await fetch(`/api/venues/${venueId}/slots/${slot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: nextActive }),
    });
  };

  const handlePriceChange = async (slotId: number, price: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, price: Number(price) || 0 } : s))
    );
  };

  const handlePriceBlur = async (slotId: number, price: number) => {
    await fetch(`/api/venues/${venueId}/slots/${slotId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
  };

  const handleDelete = async (slotId: number) => {
    if (!confirm("Remove this time slot?")) return;

    setSlots((prev) => prev.filter((s) => s.id !== slotId));

    await fetch(`/api/venues/${venueId}/slots/${slotId}`, {
      method: "DELETE",
    });
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
        Time Slots & Pricing
      </label>

      <div className="space-y-2">
        {slots.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            No time slots yet. Add one below.
          </p>
        )}

        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
              slot.isActive
                ? "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                : "border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/50 opacity-60"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex-1">
              {slot.time}
            </span>
            <div className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
              <span>₹</span>
              <input
                type="number"
                value={slot.price}
                onChange={(e) => handlePriceChange(slot.id, e.target.value)}
                onBlur={(e) => handlePriceBlur(slot.id, Number(e.target.value))}
                className="w-16 bg-transparent outline-none border-b border-transparent focus:border-red-500 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => handleToggleActive(slot)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                slot.isActive
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-150 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {slot.isActive ? "Active" : "Disabled"}
            </button>
            <button
              type="button"
              onClick={() => handleDelete(slot.id)}
              className="text-rose-500 hover:text-rose-600 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:flex sm:gap-2 sm:items-center gap-2 pt-1">
        <input
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          placeholder="e.g. 06:00 AM - 07:00 AM"
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white font-semibold placeholder-slate-400"
        />
        <div className="flex gap-2">
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price"
            className="flex-1 sm:w-24 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white font-mono font-semibold placeholder-slate-400"
          />
          <button
            type="button"
            onClick={handleAddSlot}
            disabled={isSubmitting || !newTime || !newPrice}
            className="shrink-0 w-9 h-9 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}