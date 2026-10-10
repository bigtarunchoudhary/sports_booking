"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon, X, MapPin } from "lucide-react";
import SlotManager from "./SlotManager";
import LocationPickerModalWrapper from "./LocationPickerModalWrapper";

type Slot = {
  id: number;
  time: string;
  price: number;
  isActive: boolean;
};

type Venue = {
  id: number;
  name: string;
  sport: string;
  location: string;
  price: number;
  capacity: number;
  occupancy: number;
  latitude: number;
  longitude: number;
  description: string | null;
  imageUrl: string | null;
  features: string | null;
  facilities: string | null;
};

type Props = {
  venue: Venue;
  slots: Slot[];
};

function TagInput({
  label,
  values,
  setValues,
  placeholder,
}: {
  label: string;
  values: string[];
  setValues: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
    }
    setInput("");
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-500/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => setValues(values.filter((v) => v !== tag))}
              className="cursor-pointer hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-medium placeholder-slate-400"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2.5 rounded-xl bg-slate-150 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function EditVenueForm({ venue, slots }: Props) {
  const router = useRouter();
  const [name, setName] = useState(venue.name);
  const [sport, setSport] = useState(venue.sport);
  const [location, setLocation] = useState(venue.location);
  const [price, setPrice] = useState(venue.price.toString());
  const [capacity, setCapacity] = useState(venue.capacity.toString());
  const [occupancy, setOccupancy] = useState(venue.occupancy.toString());
  const [latitude, setLatitude] = useState(venue.latitude.toString());
  const [longitude, setLongitude] = useState(venue.longitude.toString());
  const [description, setDescription] = useState(venue.description || "");
  const [imageUrl, setImageUrl] = useState(venue.imageUrl || "");
  const [features, setFeatures] = useState<string[]>(
    venue.features ? venue.features.split(",").map((f) => f.trim()).filter(Boolean) : []
  );
  const [facilities, setFacilities] = useState<string[]>(
    venue.facilities ? venue.facilities.split(",").map((f) => f.trim()).filter(Boolean) : []
  );
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
    if (!name || !location || !price || !capacity || occupancy === "") {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${venue.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          sport,
          location,
          price: Number(price),
          capacity: Number(capacity),
          occupancy: Number(occupancy),
          latitude: Number(latitude),
          longitude: Number(longitude),
          description: description || null,
          imageUrl: imageUrl || null,
          features: features.join(","),
          facilities: facilities.join(","),
        }),
      });

      if (!response.ok) {
        alert("Failed to update venue details.");
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

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this venue?")) {
      return;
    }

    try {
      const response = await fetch(`/api/venues/${venue.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        alert("Failed to delete venue.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
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
            placeholder="Venue Name"
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
            placeholder="Location"
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
        <TagInput
          label="Features (e.g. Indoor, Floodlights, AC)"
          values={features}
          setValues={setFeatures}
          placeholder="Type a feature and press Enter"
        />

        {/* Facilities */}
        <TagInput
          label="Facilities (e.g. Locker Rooms, Parking, Wi-Fi)"
          values={facilities}
          setValues={setFacilities}
          placeholder="Type a facility and press Enter"
        />

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

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Price (₹/hr) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Capacity *
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider block">
              Occupancy *
            </label>
            <input
              type="number"
              value={occupancy}
              onChange={(e) => setOccupancy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-slate-900 dark:text-white transition-all font-mono font-semibold"
              required
            />
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <SlotManager venueId={venue.id} initialSlots={slots} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-500/10 hover:bg-red-100 dark:hover:bg-red-950/40 py-3 px-6 rounded-2xl font-bold transition text-xs cursor-pointer flex-shrink-0"
          >
            Delete Venue
          </button>

          <div className="flex flex-1 gap-3">
            <Link
              href="/admin"
              className="flex-1 bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 rounded-2xl font-bold text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm flex items-center justify-center cursor-pointer"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-2xl font-bold text-white text-center shadow-md transition text-sm ${
                isSubmitting
                  ? "bg-red-400 cursor-wait shadow-none"
                  : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Saving..." : "Update Venue"}
            </button>
          </div>
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