import Link from "next/link";
import SportIcon from "@/components/sport/SportIcon";

type Props = {
  name: string;
};

export default function SportCard({ name }: Props) {
  return (
    <Link href={`/dashboard?q=${encodeURIComponent(name)}`} className="group block">
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 text-center sport-card-float shadow-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:border-red-500/60 flex flex-col items-center justify-center cursor-pointer transition-all">
        <div className="text-zinc-300 group-hover:text-red-400 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-125">
          <SportIcon sport={name} className="w-10 h-10" />
        </div>

        <h3 className="mt-3 font-black text-white text-xs uppercase tracking-wider group-hover:text-red-400 transition-colors">
          {name}
        </h3>

        <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          Explore &rarr;
        </span>
      </div>
    </Link>
  );
}