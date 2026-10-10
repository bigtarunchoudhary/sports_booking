import { prisma } from "@/lib/prisma";
import EditVenueForm from "@/components/admin/EditVenueForm";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditVenue({ params }: Props) {
  const cookieStore = await cookies();
  if (!cookieStore.has("playspot_admin_auth")) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: {
      id: Number(id),
    },
  });

  const slots = await prisma.slot.findMany({
    where: { venueId: Number(id) },
    orderBy: { id: "asc" },
  });

  if (!venue) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 bg-red-950/40 text-red-500 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Venue Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">The requested venue could not be found in our database.</p>
          <Link href="/admin" className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition">
            Back to Admin Panel
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto p-6 md:p-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <div className="flex gap-2 text-xs font-semibold text-red-500 dark:text-red-400 mb-1">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-400 dark:text-slate-500">Edit Venue</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">
            Edit Venue Details
          </h1>

          <EditVenueForm venue={venue} slots={slots} />
        </div>
      </main>

      <Footer />
    </div>
  );
}