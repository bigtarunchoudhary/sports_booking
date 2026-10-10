import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-zinc-900 text-zinc-400 py-12 px-6 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Branding */}
        <div className="space-y-4 md:col-span-1">
          <Logo size="md" href="/" />
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            The next-generation athletic booking engine. Discover premier courts, track live arena occupancy, and reserve instant slots with electric speed.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-950/30 px-3 py-1.5 rounded-full border border-red-500/20 w-fit">
            <span>100% Instant Confirmation</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-xs font-extrabold tracking-widest uppercase mb-4 text-red-500">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs font-bold">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Hero Showcase
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                All Venues
              </Link>
            </li>
            <li>
              <Link href="/sports" className="hover:text-white transition-colors">
                Sports Categories
              </Link>
            </li>
            <li>
              <Link href="/profile/bookings" className="hover:text-white transition-colors">
                My Bookings
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Sports */}
        <div>
          <h4 className="text-white text-xs font-extrabold tracking-widest uppercase mb-4 text-red-500">
            Top Sports
          </h4>
          <ul className="space-y-2.5 text-xs font-bold">
            <li>
              <Link href="/sports/football" className="hover:text-white transition-colors">
                Football Turfs
              </Link>
            </li>
            <li>
              <Link href="/sports/basketball" className="hover:text-white transition-colors">
                Basketball Courts
              </Link>
            </li>
            <li>
              <Link href="/sports/badminton" className="hover:text-white transition-colors">
                Badminton Arenas
              </Link>
            </li>
            <li>
              <Link href="/sports/tennis" className="hover:text-white transition-colors">
                Tennis Academies
              </Link>
            </li>
            <li>
              <Link href="/sports/swimming" className="hover:text-white transition-colors">
                Olympic Swimming Pools
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Status */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-extrabold tracking-widest uppercase mb-4 text-red-500">
            Live Network Status
          </h4>
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">Arena Sync</span>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">Active Turfs</span>
              <span className="text-white font-extrabold">15+ Locations</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-semibold">Live Occupancy</span>
              <span className="text-red-400 font-extrabold">Real-Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
        <p>© {new Date().getFullYear()} SportsBooking Platform. Inspired by Playful Design.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-zinc-300 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-zinc-300 transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-zinc-300 transition-colors cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  );
}