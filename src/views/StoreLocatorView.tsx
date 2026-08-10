import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MOCK_STORES } from "../data/stores";
import { StoreLocation } from "../types";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  Search,
  Sparkles,
  Zap,
  ChevronRight
} from "lucide-react";

export const StoreLocatorView: React.FC = () => {
  const { setActiveView } = useApp();
  const [searchCity, setSearchCity] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(MOCK_STORES[0]);

  const filteredStores = MOCK_STORES.filter(
    (s) =>
      s.city.toLowerCase().includes(searchCity.toLowerCase()) ||
      s.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      s.zip.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Atelier Locations & Eye Care Centers</span>
          <h1 className="text-3xl font-black font-serif text-white">Find an ILens Store Near You</h1>
          <p className="text-xs text-neutral-300">
            Visit our physical ateliers for digital retinal imaging, custom Japanese titanium frame adjustments, and same-day prescription glazing.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by city or zip (e.g. New York, CA)"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Store List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all ${
                selectedStore.id === store.id
                  ? "border-amber-500 bg-amber-50/50 shadow-md"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-950 font-serif text-base">{store.name}</h3>
                  <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{store.address}, {store.city}, {store.state} {store.zip}</span>
                  </p>
                </div>
                {store.sameDayGlasses && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black rounded-full uppercase shrink-0">
                    Same-Day Glasses
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-200/60 pt-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" /> {store.hours.split("|")[0]}
                </span>
                <span className="flex items-center gap-1 font-bold text-neutral-900">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {store.rating} ({store.reviewsCount})
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Store Detailed Card & Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-neutral-200">
              <img
                src={selectedStore.imageUrl}
                alt={selectedStore.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent p-6 flex items-end justify-between text-white">
                <div>
                  <h2 className="text-2xl font-black font-serif">{selectedStore.name}</h2>
                  <p className="text-xs text-neutral-300">{selectedStore.phone}</p>
                </div>

                <button
                  onClick={() => setActiveView({ type: "eye-test-booking", storeId: selectedStore.id })}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Calendar className="w-4 h-4" /> Book Eye Exam Here
                </button>
              </div>
            </div>

            {/* Hours & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Operating Hours</span>
                <p className="font-bold text-neutral-900">{selectedStore.hours}</p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Contact Store Direct</span>
                <p className="font-bold text-neutral-900">{selectedStore.phone}</p>
              </div>
            </div>

            {/* Services Available */}
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">Atelier Services Provided</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedStore.services.map((srv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-medium">{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Optometrists */}
            <div className="space-y-3 pt-2 border-t border-neutral-200">
              <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">On-Site Licensed Doctors</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedStore.optometrists.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
                    <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-full object-cover border border-amber-500" />
                    <div>
                      <h5 className="font-bold text-neutral-900 text-xs">{doc.name}</h5>
                      <p className="text-[10px] text-neutral-500">{doc.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
