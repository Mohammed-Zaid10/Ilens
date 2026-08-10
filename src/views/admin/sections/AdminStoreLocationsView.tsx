import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { StoreLocation } from "../../../types";
import { Building2, MapPin, Phone, Clock, Plus, Trash2, Edit2, X, Star } from "lucide-react";

export const AdminStoreLocationsView: React.FC = () => {
  const { stores, addStore, updateStore, deleteStore } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);

  const [formData, setFormData] = useState<Partial<StoreLocation>>({
    name: "",
    address: "",
    city: "",
    state: "CA",
    zip: "",
    phone: "",
    hours: "Mon-Sat: 10 AM - 7 PM, Sun: Closed",
    rating: 4.9,
    reviewsCount: 50,
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    services: ["Comprehensive Eye Exams", "3D Virtual Try-On Bar", "Same-Day Lens Crafting"],
    optometrists: [{ name: "Dr. Alex Rivera, OD", title: "Optometrist", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200" }],
    coordinates: { lat: 37.7749, lng: -122.4194 },
    sameDayGlasses: true
  });

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData({
      name: "ILens Chicago Atelier — Michigan Ave",
      address: "645 N Michigan Ave",
      city: "Chicago",
      state: "IL",
      zip: "60611",
      phone: "+1 (312) 555-0182",
      hours: "Mon-Sat: 10 AM - 7 PM, Sun: 11 AM - 6 PM",
      rating: 4.9,
      reviewsCount: 12,
      imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
      services: ["Comprehensive Digital Eye Exams", "Japanese Titanium Fitting Bar"],
      optometrists: [{ name: "Dr. Sarah Paulson, OD", title: "Chief Optometrist", avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4c?auto=format&fit=crop&q=80&w=200" }],
      coordinates: { lat: 41.8781, lng: -87.6298 },
      sameDayGlasses: true
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingStore) {
      updateStore(editingStore.id, formData);
    } else {
      addStore(formData as Omit<StoreLocation, "id">);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> Retail Flagship Ateliers & Store Locator ({stores.length})
          </h2>
          <p className="text-xs text-neutral-400">Manage physical store locations, operating hours, optometrists, and appointment availability</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Store Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((st) => (
          <div key={st.id} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-44">
              <img src={st.imageUrl} alt={st.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-amber-500 text-neutral-950 font-extrabold text-[10px] rounded-full">
                  {st.city}, {st.state}
                </span>
                <span className="text-[10px] bg-neutral-900/80 text-white font-mono px-2 py-0.5 rounded border border-neutral-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {st.rating} ({st.reviewsCount})
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-extrabold text-white text-base">{st.name}</h3>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {st.address}</p>
              <p className="text-xs text-neutral-300 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {st.phone}</p>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {st.hours}</p>
            </div>

            <div className="p-4 border-t border-neutral-800 flex items-center justify-end gap-2 bg-neutral-950">
              <button
                onClick={() => deleteStore(st.id)}
                className="p-1.5 hover:bg-neutral-800 text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> Add Retail Store Atelier
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-300">Store Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold rounded-xl"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
