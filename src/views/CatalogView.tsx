import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { CategoryType, FrameShape, GenderCategory } from "../types";
import { SlidersHorizontal, Sparkles, X, ChevronDown, Glasses } from "lucide-react";

export const CatalogView: React.FC = () => {
  const { activeView, navigateToCatalog, products, openVirtualTryOn } = useApp();

  const currentCategory = activeView.type === "catalog" ? activeView.category : "all";
  const initialShape = activeView.type === "catalog" ? activeView.shapeFilter : undefined;
  const initialGender = activeView.type === "catalog" ? activeView.genderFilter : undefined;

  // Filter States
  const [selectedShape, setSelectedShape] = useState<FrameShape | "all">(initialShape || "all");
  const [selectedGender, setSelectedGender] = useState<GenderCategory | "all">(initialGender || "all");
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");

  const categoriesList: { id: CategoryType; label: string }[] = [
    { id: "all", label: "All Eyewear" },
    { id: "eyeglasses", label: "Eyeglasses" },
    { id: "sunglasses", label: "Sunglasses" },
    { id: "contacts", label: "Contact Lenses" },
    { id: "bluelight", label: "Blue Light" },
    { id: "new-arrivals", label: "New Arrivals" },
    { id: "bestsellers", label: "Best Sellers" },
    { id: "offers", label: "Offers" }
  ];

  const shapesList: { id: FrameShape; label: string }[] = [
    { id: "round", label: "Round" },
    { id: "square", label: "Square" },
    { id: "cat-eye", label: "Cat-Eye" },
    { id: "aviator", label: "Aviator" },
    { id: "geometric", label: "Geometric" },
    { id: "rectangle", label: "Rectangle" },
    { id: "wayfarer", label: "Wayfarer" }
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category Filter
        if (currentCategory === "eyeglasses" && p.category !== "eyeglasses") return false;
        if (currentCategory === "sunglasses" && p.category !== "sunglasses") return false;
        if (currentCategory === "contacts" && p.category !== "contacts") return false;
        if (currentCategory === "bluelight" && p.category !== "bluelight") return false;
        if (currentCategory === "new-arrivals" && !p.isNew) return false;
        if (currentCategory === "bestsellers" && !p.isBestseller) return false;
        if (currentCategory === "offers" && !p.isOffer) return false;

        // Shape Filter
        if (selectedShape !== "all" && p.frameShape !== selectedShape) return false;

        // Gender Filter
        if (selectedGender !== "all" && p.gender !== selectedGender && p.gender !== "unisex") return false;

        // Price Filter
        if (p.price > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, currentCategory, selectedShape, selectedGender, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            ILens Eyewear Catalog
          </span>
          <h1 className="text-3xl font-black font-serif text-neutral-950 capitalize mt-1">
            {currentCategory.replace("-", " ")} ({filteredProducts.length})
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Explore SABAE Japanese Titanium, Mazzucchelli Bio-Acetate & Custom Prescription Lenses
          </p>
        </div>

        <button
          onClick={() => openVirtualTryOn()}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl flex items-center gap-2 shadow-md shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Launch 3D Try-On Studio
        </button>
      </div>

      {/* Category Nav Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar border-b border-neutral-200 pb-2">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigateToCatalog(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              currentCategory === cat.id
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 flex flex-wrap items-center justify-between gap-4">
        {/* Frame Shapes Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
            Frame Shape:
          </span>
          <button
            onClick={() => setSelectedShape("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedShape === "all" ? "bg-amber-500 text-neutral-950 font-bold" : "bg-white text-neutral-700 border"
            }`}
          >
            All Shapes
          </button>
          {shapesList.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setSelectedShape(shape.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedShape === shape.id ? "bg-amber-500 text-neutral-950 font-bold" : "bg-white text-neutral-700 border"
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>

        {/* Sort & Price Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <span>Max Price: <strong className="text-amber-600">${maxPrice}</strong></span>
            <input
              type="range"
              min="30"
              max="300"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-amber-600"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 cursor-pointer focus:outline-none"
          >
            <option value="featured">Featured Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200 space-y-3">
          <Glasses className="w-12 h-12 text-neutral-400 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-900 font-serif">No Frames Match Your Selected Filters</h3>
          <p className="text-xs text-neutral-500">Try resetting price or shape filters to view more optical styles.</p>
          <button
            onClick={() => {
              setSelectedShape("all");
              setSelectedGender("all");
              setMaxPrice(300);
            }}
            className="px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
