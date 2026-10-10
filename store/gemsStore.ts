"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Perk {
  id: string;
  title: string;
  cost: number;
  description: string;
  code?: string;
  isRedeemed: boolean;
  type: "discount" | "vip" | "gear" | "drink";
}

interface GemsState {
  gems: number;
  highScore: number;
  perks: Perk[];
  addGems: (amount: number) => void;
  redeemPerk: (perkId: string) => boolean;
  updateHighScore: (score: number) => void;
}

const INITIAL_PERKS: Perk[] = [
  {
    id: "discount-20",
    title: "20% OFF Arena Booking Pass",
    cost: 150,
    description: "Get 20% instant discount on any turf, court, or pool booking in Agra.",
    code: "GEMS20OFF",
    isRedeemed: false,
    type: "discount",
  },
  {
    id: "vip-priority",
    title: "VIP Priority Slot Reservation",
    cost: 200,
    description: "Exclusive access to prime weekend evening slots before public release.",
    code: "VIP-PASSED",
    isRedeemed: false,
    type: "vip",
  },
  {
    id: "gear-rental",
    title: "Match Ball & Gear Rental",
    cost: 100,
    description: "Complimentary professional sports equipment & racket rental at venue.",
    code: "FREEGEAR100",
    isRedeemed: false,
    type: "gear",
  },
  {
    id: "hydro-drink",
    title: "Hydro Energy Drink Pass",
    cost: 75,
    description: "Complimentary chilled sports hydration drink at venue reception.",
    code: "HYDRODRINK",
    isRedeemed: false,
    type: "drink",
  },
];

export const useGemsStore = create<GemsState>()(
  persist(
    (set, get) => ({
      gems: 120, // Initial starter Gems balance
      highScore: 0,
      perks: INITIAL_PERKS,
      addGems: (amount: number) => {
        set((state) => ({ gems: state.gems + amount }));
      },
      redeemPerk: (perkId: string) => {
        const state = get();
        const perk = state.perks.find((p) => p.id === perkId);
        if (!perk || perk.isRedeemed || state.gems < perk.cost) {
          return false;
        }
        set((prev) => ({
          gems: prev.gems - perk.cost,
          perks: prev.perks.map((p) =>
            p.id === perkId ? { ...p, isRedeemed: true } : p
          ),
        }));
        return true;
      },
      updateHighScore: (score: number) => {
        set((prev) => ({
          highScore: Math.max(prev.highScore, score),
        }));
      },
    }),
    {
      name: "sports_booking_gems_store",
    }
  )
);
