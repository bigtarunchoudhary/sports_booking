"use client";

type Props = {
  venueName: string;
  slot: string;
  price: number;
  playerCount?: number;
  dateString?: string;
};

export default function BookingSummary({ venueName, slot, price, playerCount = 1, dateString }: Props) {
  const displayDate = dateString || new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const advancePrice = Math.max(50, Math.round(price * 0.2));

  return (
    <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
      <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-3 flex items-center justify-between">
        <span>Reservation Summary</span>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      </h3>

      <div className="space-y-4 pt-1">
        <div className="flex justify-between items-start text-xs font-bold">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Arena</span>
          <span className="font-extrabold text-white text-right max-w-[200px] leading-tight">
            {venueName}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Group Size</span>
          <span className="font-black text-red-400 bg-red-950/50 px-2.5 py-1 rounded-lg border border-red-500/20">
            {playerCount} {playerCount === 1 ? "Person (Single Pass)" : "People (Group Pass)"}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Session Date</span>
          <span className="font-bold text-zinc-300">{displayDate}</span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-zinc-500 uppercase tracking-widest text-[10px]">Timings</span>
          <span className="font-black text-red-400 bg-red-950/50 px-3 py-1 rounded-xl border border-red-500/20">
            {slot}
          </span>
        </div>

        {/* Flexible Payment Deposit Hint */}
        <div className="bg-black p-3.5 rounded-2xl border border-zinc-900 text-[11px] space-y-1.5 font-bold">
          <div className="flex justify-between text-zinc-300">
            <span>Full Amount:</span>
            <span className="text-white">₹{price} ({playerCount} {playerCount === 1 ? "player" : "players"})</span>
          </div>
          <div className="flex justify-between text-red-400">
            <span>Option (20% Token):</span>
            <span>₹{advancePrice} deposit</span>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-sm">
        <span className="font-black text-white uppercase tracking-wider text-xs">
          Total Rate {playerCount > 1 ? `(${playerCount} Players)` : ""}
        </span>
        <span className="text-2xl font-black text-red-500">₹{price}</span>
      </div>
    </div>
  );
}
