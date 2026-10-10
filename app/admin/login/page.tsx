"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Lock, Mail, KeyRound, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@playspot.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto p-6 md:p-12 flex flex-col justify-center relative z-10">
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-950/50 text-red-400 mb-1 border border-red-500/30">
              <Lock className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Admin Sign In
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Enter your credentials to access the venue management control panel.
            </p>
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 font-bold uppercase">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@playspot.com"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:border-red-500 outline-none text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-bold focus:border-red-500 outline-none text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-300 font-bold space-y-1">
              <span className="block text-[10px] uppercase tracking-widest text-amber-400">DEMO CREDENTIALS BOX:</span>
              <div className="font-mono text-zinc-300 text-xs">
                Email: <code className="text-amber-300 font-black">admin@playspot.com</code>
              </div>
              <div className="font-mono text-zinc-300 text-xs">
                Password: <code className="text-amber-300 font-black">admin</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest transition shadow-lg shadow-red-600/30 cursor-pointer"
            >
              {isSubmitting ? "Authenticating..." : "Sign In to Admin Panel"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
