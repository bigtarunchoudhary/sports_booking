export interface Sport {
  id: string;
  name: string;
  description: string;
}

export const sports: Sport[] = [
  { id: "football", name: "Football", description: "Synthetic FIFA-Standard & Grass Turfs" },
  { id: "basketball", name: "Basketball", description: "Indoor Hardwood & Outdoor Arenas" },
  { id: "badminton", name: "Badminton", description: "BWF Indoor Synthetic Court Mats" },
  { id: "tennis", name: "Tennis", description: "Synthetic Hard Courts & Clay Academies" },
  { id: "swimming", name: "Swimming", description: "Olympic Heated Pools & Lap Lanes" },
  { id: "cricket", name: "Cricket", description: "Box Net Pitches & Practice Turfs" },
  { id: "pickleball", name: "Pickleball", description: "Dedicated Pickleball Courts" },
  { id: "volleyball", name: "Volleyball", description: "Indoor & Sand Beach Courts" },
];
