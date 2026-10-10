import SportCard from "./SportCard";
import { sports } from "@/data/sports";

export default function SportsGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
        <span>Browse By Sport Category</span>
        <span className="w-2 h-2 rounded-full bg-red-500" />
      </h2>

      <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto no-scrollbar py-4 px-2 -mx-2 md:mx-0 md:px-0">
        {sports.map((sport) => (
          <div key={sport.id} className="w-36 shrink-0 md:w-auto">
            <SportCard name={sport.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
