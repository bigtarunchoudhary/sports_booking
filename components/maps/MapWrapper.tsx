"use client";

import dynamic from "next/dynamic";

const VenueMap = dynamic(() => import("./VenueMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-slate-100 dark:bg-slate-900 animate-pulse flex items-center justify-center text-xs font-semibold text-slate-400">
      Loading Interactive Map...
    </div>
  ),
});

type Venue = {
  id: number;
  name: string;
  sport: string;
  location: string;
  rating: number;
  price: number;
  occupancy: number;
  capacity: number;
  latitude: number;
  longitude: number;
};

type Props = {
  venues: Venue[];
};

export default function MapWrapper({ venues }: Props) {
  return <VenueMap venues={venues} />;
}
