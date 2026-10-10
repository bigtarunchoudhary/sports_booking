"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { QrCode, ShieldCheck } from "lucide-react";

type Props = {
  bookingId?: string;
  value?: string;
  venueName?: string;
  slot?: string;
  price?: number;
  playerCount?: number;
  dateString?: string;
};

export default function QRCodeCard({
  bookingId,
  value,
  venueName = "Sports Arena",
  slot = "06:00 AM - 07:00 AM",
  price = 500,
  playerCount = 1,
  dateString = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
}: Props) {
  const [qrSrc, setQrSrc] = useState<string>("");
  const codeValue = bookingId || value || "DEMO123";

  useEffect(() => {
    const payload = `SPORTS BOOKING PASS\nRef ID: ${codeValue}\nVenue: ${venueName}\nTime: ${slot}\nDate: ${dateString}\nGroup: ${playerCount} Person(s)\nPaid: ₹${price}\nStatus: VERIFIED & CONFIRMED`;

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 240,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then(setQrSrc)
      .catch((err: unknown) => console.error("QR Code Error:", err));
  }, [codeValue, venueName, slot, price, playerCount, dateString]);

  return (
    <div className="relative bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center space-y-4 overflow-hidden group">
      {/* Physical Ticket Punch Holes */}
      <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-r border-zinc-800 z-20" />
      <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-black border-l border-zinc-800 z-20" />

      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-white tracking-widest uppercase group-hover:text-red-400 transition-colors">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>Entry Pass Ticket</span>
        </div>
        <p className="text-[9px] text-zinc-500 font-mono mt-1 uppercase">
          REF: #{codeValue.substring(0, 12)}
        </p>
      </div>

      {/* Dotted Punch-Line */}
      <div className="w-full border-t border-dashed border-zinc-800 my-2" />

      {/* Real Scannable QR Code Image */}
      <div className="w-48 h-48 bg-white border border-zinc-800 rounded-2xl p-3 flex flex-col items-center justify-center relative select-none shadow-xl">
        {qrSrc ? (
          <Image
            src={qrSrc}
            alt="Scannable Ticket QR Code with all booking details"
            width={180}
            height={180}
            unoptimized
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-zinc-400">
            <QrCode className="w-8 h-8 animate-pulse text-black" />
          </div>
        )}
      </div>

      <div className="text-center pt-2">
        <span className="text-[9px] text-red-400 font-black uppercase tracking-widest block bg-red-950/50 px-3 py-1 rounded-full border border-red-500/20">
          Scan at Venue Turnstile
        </span>
        <p className="text-[10px] text-zinc-400 max-w-[200px] mx-auto mt-2 leading-relaxed font-medium">
          Contains venue name, slot time, date, group size, and payment status.
        </p>
      </div>
    </div>
  );
}
