import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const venues = await prisma.venue.findMany();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 relative z-10">
        <DashboardHeader />
        <DashboardContent initialVenues={venues} />
      </main>

      <Footer />
    </div>
  );
}