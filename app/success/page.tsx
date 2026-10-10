import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SuccessCard from "@/components/booking/SuccessCard";
import QRCodeCard from "@/components/booking/QRCodeCard";
import Link from "next/link";
import { AlertCircle, Search } from "lucide-react";

type Props = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export default async function Success({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-red-950/50 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Pass ID Not Found</h1>
          <p className="text-zinc-400 text-xs mb-6 font-medium">We could not retrieve the booking reference ID.</p>
          <Link href="/dashboard" className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30">
            Back to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
          <div className="w-16 h-16 bg-red-950/50 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight">Pass Record Not Found</h1>
          <p className="text-zinc-400 text-xs mb-6 font-medium">The booking could not be located in our records.</p>
          <Link href="/dashboard" className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30">
            Back to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <SuccessCard 
              bookingId={booking.bookingId} 
              venueName={booking.venueName} 
              slot={booking.slot} 
              price={booking.price} 
            />
          </div>
          <QRCodeCard
            value={booking.bookingId}
            venueName={booking.venueName}
            slot={booking.slot}
            price={booking.price}
            playerCount={booking.playerCount || 1}
            dateString={booking.createdAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}