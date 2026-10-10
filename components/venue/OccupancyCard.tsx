"use client";

import { Users, Activity } from "lucide-react";

type Props = {
  occupancy: number;
  capacity: number;
};

export default function OccupancyCard({ occupancy, capacity }: Props) {
  const percentage = capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;

  let statusColor = "text-emerald-400 bg-emerald-950/40 border-emerald-500/30";
  let statusText = "AVAILABLE";

  if (percentage >= 80) {
    statusColor = "text-red-400 bg-red-950/50 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
    statusText = "HIGH OCCUPANCY";
  } else if (percentage >= 50) {
    statusColor = "text-amber-400 bg-amber-950/40 border-amber-500/30";
    statusText = "MODERATE CROWD";
  }

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-2xl bg-red-950/50 text-red-400 border border-red-500/30">
            <Activity className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">
              Live Arena Density
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Real-time court capacity & active players monitor
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${statusColor}`}>
          {statusText}
        </span>
      </div>

      <div className="space-y-2.5 bg-black/60 p-4 rounded-2xl border border-zinc-900">
        <div className="flex justify-between items-baseline text-xs font-bold">
          <span className="text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
            <Users className="w-3.5 h-3.5 text-red-500" />
            ACTIVE PLAYERS
          </span>
          <span className="font-mono text-sm text-white font-black">
            {occupancy} / {capacity}
          </span>
        </div>

        <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
