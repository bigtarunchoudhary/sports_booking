"use client";

import { useState } from "react";
import { useLocationStore } from "@/store/locationStore";
import { MapPin, X, Check } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const POPULAR_CITIES = [
  "Agra, Uttar Pradesh",
  "Delhi NCR",
  "Mumbai, Maharashtra",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Pune, Maharashtra",
];

export default function LocationModal({ isOpen, onClose }: Props) {
  const { location, setLocation } = useLocationStore();
  const [customInput, setCustomInput] = useState("");

  if (!isOpen) return null;

  const handleSelect = (city: string) => {
    setLocation(city);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setLocation(customInput.trim());
      setCustomInput("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Select City / Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type your area or city name..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold focus:border-red-500 outline-none text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Apply
          </button>
        </form>

        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-3">
            Popular Cities
          </span>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_CITIES.map((city) => {
              const isSelected = location === city;
              return (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                    isSelected
                      ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                      : "border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <span className="truncate">{city.split(",")[0]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
