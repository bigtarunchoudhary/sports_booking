import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VenueHeader from "@/components/venue/VenueHeader";
import VenueBookingArea from "@/components/venue/VenueBookingArea";
import OccupancyCard from "@/components/venue/OccupancyCard";
import MapWrapper from "@/components/maps/MapWrapper";
import { notFound } from "next/navigation";
import { MapPin, ShieldCheck, Sparkles, CheckCircle } from "lucide-react";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VenueDetailsPage({ params }: Context) {
  const { id } = await params;
  const venueId = Number(id);

  if (isNaN(venueId)) {
    notFound();
  }

  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      slots: {
        where: { isActive: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!venue) {
    notFound();
  }

  const featuresList = venue.features
    ? venue.features.split(",").map((f) => f.trim()).filter(Boolean)
    : ["Floodlights", "Pro Turf", "Restroom"];

  const facilitiesList = venue.facilities
    ? venue.facilities.split(",").map((f) => f.trim()).filter(Boolean)
    : ["Locker Rooms", "Parking", "Water Dispenser"];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-8 relative z-10">
        <VenueHeader
          name={venue.name}
          sport={venue.sport}
          location={venue.location}
          rating={venue.rating}
          imageUrl={venue.imageUrl || undefined}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main Column: Details, Features, Facilities & Map */}
          <div className="lg:col-span-2 space-y-8">
            <OccupancyCard
              occupancy={venue.occupancy}
              capacity={venue.capacity}
            />

            {/* Description */}
            {venue.description && (
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  About Arena & Ground
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                  {venue.description}
                </p>
              </div>
            )}

            {/* Features & Facilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span>Key Highlights</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {featuresList.map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-red-950/50 text-red-400 text-xs font-black px-3 py-1.5 rounded-full border border-red-500/30"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Available Amenities</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {facilitiesList.map((facility, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-zinc-900 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-full border border-zinc-800"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Exact Venue Location</span>
              </h3>
              <div className="rounded-3xl border border-zinc-800 overflow-hidden shadow-xl h-[380px]">
                <MapWrapper venues={[venue]} />
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Area */}
          <div className="lg:col-span-1">
            <VenueBookingArea
              venueName={venue.name}
              venuePrice={venue.price}
              slots={venue.slots}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
