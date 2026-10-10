"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Mail, ArrowRight } from "lucide-react";

export default function UserLoginPage() {
  const router = useRouter();
  const [name, setName] = useState("Demo Athlete");
  const [email, setEmail] = useState("player@example.com");

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto p-6 md:p-12 flex flex-col justify-center relative z-10">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-950/50 text-red-400 mb-1 border border-red-500/30">
              <User className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Player Sign In
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Access entry passes, active bookings, and venue favorites.
            </p>
          </div>

          <form onSubmit={handleQuickLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:border-red-500 outline-none text-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:border-red-500 outline-none text-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Venues</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-zinc-900 pt-4 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-red-400 hover:text-red-300 font-extrabold uppercase tracking-wider"
            >
              Looking for Facility Manager Console? &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
