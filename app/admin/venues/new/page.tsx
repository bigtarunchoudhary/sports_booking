import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AddVenueForm from "@/components/admin/AddVenueForm";

export default async function AddVenuePage() {
  const cookieStore = await cookies();
  if (!cookieStore.has("playspot_admin_auth")) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto p-6 md:p-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div>
            <div className="flex gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              <Link href="/admin" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-400">Add Venue</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Add New Venue
            </h1>
          </div>

          <AddVenueForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}