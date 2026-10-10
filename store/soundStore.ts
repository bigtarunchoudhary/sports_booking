"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundState {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (
    type: "kick" | "score" | "penalty" | "click" | "win" | "swish" | "combo" | "extraShot" | "powerup"
  ) => void;
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
      playSound: (
        type: "kick" | "score" | "penalty" | "click" | "win" | "swish" | "combo" | "extraShot" | "powerup"
      ) => {
        if (!get().soundEnabled) return;
        try {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!AudioContextClass) return;
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          const now = ctx.currentTime;

          if (type === "kick") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.18);
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
          } else if (type === "score") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
          } else if (type === "swish") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
          } else if (type === "combo") {
            // Ascending triad chord
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc.type = "triangle";
            osc2.type = "sine";
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.06);
            osc.frequency.setValueAtTime(783.99, now + 0.12);
            osc2.frequency.setValueAtTime(1046.5, now + 0.12);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            gain2.gain.setValueAtTime(0.3, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc.start(now);
            osc2.start(now + 0.12);
            osc.stop(now + 0.35);
            osc2.stop(now + 0.35);
          } else if (type === "extraShot") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
          } else if (type === "powerup") {
            osc.type = "square";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
          } else if (type === "penalty") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.setValueAtTime(110, now + 0.1);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
          } else if (type === "click") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
          } else if (type === "win") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(783.99, now + 0.2);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
          }
        } catch (e) {
          console.error("Audio playback error:", e);
        }
      },
    }),
    {
      name: "sports_booking_sound_store",
    }
  )
);
