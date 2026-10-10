"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon, MapPin } from "lucide-react";
import LocationPickerModalWrapper from "./LocationPickerModalWrapper";

export default function AddVenueForm() {
  const [features, setFeatures] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const router = useRouter();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("Swimming");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [latitude, setLatitude] = useState("27.1767");
  const [longitude, setLongitude] = useState("78.0081");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const presets = {
    Swimming: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
    Football: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80",
    Cricket: "https://images.unsplash.com/photo-1531415080290-bc98545ab3ef?w=800&auto=format&fit=crop&q=80",
    Tennis: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80",
    Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
  };

  const handleApplyPreset = () => {
    const key = sport as keyof typeof presets;
    if (presets[key]) {
      setImageUrl(presets[key]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !price || !capacity) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sport,
          location,
          price: Number(price),
          capacity: Number(capacity),
          latitude: latitude ? Number(latitude) : 27.1767,
          longitude: longitude ? Number(longitude) : 78.0081,
          description: description || undefined,
          imageUrl: imageUrl || undefined,
          features: features.join(","),
          facilities: facilities.join(","),
        }),
      });

      if (!response.ok) {
        alert("Failed to add new venue.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleMapConfirm = (selectedName: string, selectedLat: number, selectedLng: number) => {
    if (selectedName) setLocation(selectedName);
    setLatitude(selectedLat.toString());
    setLongitude(selectedLng.toString());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 text-slate-800 dark:text-slate-100">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
            Venue Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smash Badminton Club"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-semibold placeholder-slate-400"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
            Sport *
          </label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-semibold"
          >
            <option value="Swimming">Swimming</option>
            <option value="Football">Football</option>
            <option value="Badminton">Badminton</option>
            <option value="Cricket">Cricket</option>
            <option value="Tennis">Tennis</option>
            <option value="Basketball">Basketball</option>
            <option value="Volleyball">Volleyball</option>
            <option value="Pickleball">Pickleball</option>
          </select>
        </div>

        {/* Location with Choose from Map Option */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Location Address *
            </label>
            <button
              type="button"
              onClick={() => setIsMapModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-500/20 transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Choose Location from Map</span>
            </button>
          </div>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Fatehabad Road, Agra (or pick from map above)"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-semibold placeholder-slate-400"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Dimension X (Latitude)
            </label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="27.1767"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Dimension Y (Longitude)
            </label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="78.0081"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write about court type, special features, layout, guidelines..."
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-medium leading-relaxed placeholder-slate-400"
          />
        </div>

        {/* Features */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
            Features (e.g. Indoor, Floodlights, AC)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {features.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-500/20">
                {tag}
                <button type="button" onClick={() => setFeatures(features.filter((v) => v !== tag))}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const trimmed = featureInput.trim();
                  if (trimmed && !features.includes(trimmed)) setFeatures([...features, trimmed]);
                  setFeatureInput("");
                }
              }}
              placeholder="Type a feature and press Enter"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white font-medium placeholder-slate-400"
            />
          </div>
        </div>

        {/* Facilities */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
            Facilities (e.g. Locker Rooms, Parking, Wi-Fi)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {facilities.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-500/20">
                {tag}
                <button type="button" onClick={() => setFacilities(facilities.filter((v) => v !== tag))}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const trimmed = facilityInput.trim();
                  if (trimmed && !facilities.includes(trimmed)) setFacilities([...facilities, trimmed]);
                  setFacilityInput("");
                }
              }}
              placeholder="Type a facility and press Enter"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white font-medium placeholder-slate-400"
            />
          </div>
        </div>

        {/* Image URL field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Image URL (Optional)
            </label>
            <button
              type="button"
              onClick={handleApplyPreset}
              className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              Apply Sport Preset Image
            </button>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-medium font-mono placeholder-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Price (₹/hr) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="250"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Capacity (Players) *
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="20"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            href="/admin"
            className="flex-1 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm flex items-center justify-center cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-2xl font-bold text-white text-center shadow-md transition ${
              isSubmitting 
                ? "bg-red-400 cursor-wait shadow-none" 
                : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Creating..." : "Add Venue"}
          </button>
        </div>
      </form>

      <LocationPickerModalWrapper
        initialLat={Number(latitude) || 27.1767}
        initialLng={Number(longitude) || 78.0081}
        initialLocationName={location}
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        onConfirm={handleMapConfirm}
      />
    </>
  );
}
