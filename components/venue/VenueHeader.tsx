"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, Share2, ShieldCheck, Camera, Maximize2 } from "lucide-react";

type Props = {
  name: string;
  sport: string;
  location: string;
  rating: number;
  imageUrl?: string;
};

export default function VenueHeader({
  name,
  sport,
  location,
  rating,
  imageUrl = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
}: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // High quality gallery photos
  const defaultImages = [
    imageUrl,
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&auto=format&fit=crop&q=80",
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Book your slot at ${name} on Sports Booking Platform`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Hero Banner Image Box */}
      <div className="relative h-72 md:h-96 w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group select-none">
        <Image
          src={defaultImages[activeImageIndex]}
          alt={name}
          fill
          unoptimized
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Photo Counter Badge Top-Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20">
            <Camera className="w-3.5 h-3.5 text-red-500" />
            <span>{activeImageIndex + 1}/{defaultImages.length} Photos</span>
          </span>
        </div>

        {/* Action Controls Top-Right */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setFullscreenOpen(true)}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md hover:bg-red-600 text-white transition cursor-pointer border border-white/10"
            title="Expand Fullscreen Photo"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-full bg-black/60 backdrop-blur-md hover:bg-red-600 text-white transition cursor-pointer border border-white/10"
            title="Share Venue"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Details Bottom */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-red-600/40">
                {sport}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED ARENA
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              {name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs md:text-sm text-zinc-300 mt-1 font-semibold">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span>{location}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-zinc-800 self-start sm:self-auto shadow-xl">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-black text-sm">{rating.toFixed(1)}</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">(120+ Reviews)</span>
          </div>
        </div>
      </div>

      {/* Multi-Photo Thumbnail Row Selector */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {defaultImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImageIndex(idx)}
            className={`relative w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
              activeImageIndex === idx
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105"
                : "border-zinc-800 opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill unoptimized className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 text-white text-sm font-black bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:bg-red-600 transition cursor-pointer"
          >
            CLOSE X
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
            <Image
              src={defaultImages[activeImageIndex]}
              alt={name}
              fill
              unoptimized
              className="object-contain rounded-2xl border border-zinc-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}
