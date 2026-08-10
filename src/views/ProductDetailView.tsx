import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import {
  Sparkles,
  ScanEye,
  Ruler,
  Sliders,
  ShieldCheck,
  Star,
  CheckCircle2,
  Heart,
  Scale,
  Truck,
  RotateCcw,
  ArrowLeft,
  Glasses,
  Info,
  ChevronRight
} from "lucide-react";

export const ProductDetailView: React.FC<{ productId: string }> = ({ productId }) => {
  const {
    products,
    addToCart,
    openLensCustomizer,
    openVirtualTryOn,
    setIsFrameSizeGuideOpen,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setActiveView,
    formatPrice
  } = useApp();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");

  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];
  const galleryImages = [
    product.primaryImage,
    ...(product.alternateImages || [])
  ];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => setActiveView({ type: "catalog", category: product.category })}
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {product.category.toUpperCase()} Collection</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-neutral-100 rounded-3xl border border-neutral-200 overflow-hidden group shadow-inner h-[460px] sm:h-[540px] flex items-center justify-center p-8">
            <img
              src={galleryImages[activeImageIndex] || product.primaryImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  New Arrival
                </span>
              )}
              {product.isBestseller && (
                <span className="px-3 py-1 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  Top Bestseller
                </span>
              )}
            </div>

            {/* Try-On Button overlay */}
            <button
              onClick={() => openVirtualTryOn(product)}
              className="absolute bottom-4 right-4 px-4 py-2.5 bg-neutral-900/90 hover:bg-neutral-900 text-white font-bold text-xs rounded-2xl border border-neutral-700 backdrop-blur-md shadow-lg flex items-center gap-2 transition-all hover:scale-105"
            >
              <ScanEye className="w-4 h-4 text-amber-400" />
              <span>3D Virtual Try-On</span>
            </button>
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-neutral-100 p-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-amber-500 shadow-md ring-2 ring-amber-500/20"
                      : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                {product.brand} • {product.frameShape} Frame
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full border transition-colors ${
                    isInWishlist(product.id)
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-neutral-200 text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => toggleCompare(product)}
                  className={`p-2 rounded-full border transition-colors ${
                    isInCompare(product.id)
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "border-neutral-200 text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-black font-serif text-neutral-950 mt-1">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs font-medium text-neutral-500 italic mt-0.5">
                "{product.tagline}"
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-xs font-black ml-1 text-neutral-900">
                  {product.rating}
                </span>
              </div>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-medium text-neutral-500">
                {product.reviewsCount} Verified Buyer Reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-neutral-950">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Frame + Standard Lenses Included
              </span>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-900 flex items-center justify-between">
              <span>Frame Color: <strong className="text-neutral-950">{selectedColor.name}</strong></span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((col, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`relative p-1 rounded-full border-2 transition-all ${
                    selectedColorIndex === idx ? "border-amber-600 scale-110 shadow-sm" : "border-neutral-200 hover:border-neutral-400"
                  }`}
                  title={col.name}
                >
                  <span
                    className="block w-6 h-6 rounded-full border border-neutral-300"
                    style={{ backgroundColor: col.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions & Size Guide */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-neutral-900">
                <Ruler className="w-4 h-4 text-amber-600" />
                <span>Dimensions: {product.dimensions.sizeCategory}</span>
              </span>
              <button
                onClick={() => setIsFrameSizeGuideOpen(true)}
                className="text-amber-600 hover:underline text-[11px] font-bold"
              >
                Frame Size Guide
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-600 pt-1">
              <div className="bg-white p-2 rounded-xl border border-neutral-200">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Lens</span>
                <span className="font-bold text-neutral-900">{product.dimensions.lensWidthMm} mm</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-neutral-200">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Bridge</span>
                <span className="font-bold text-neutral-900">{product.dimensions.bridgeWidthMm} mm</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-neutral-200">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Temple</span>
                <span className="font-bold text-neutral-900">{product.dimensions.templeLengthMm} mm</span>
              </div>
            </div>
          </div>

          {/* Face Shapes Compatibility */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-neutral-700 shrink-0">Best suited for:</span>
            <div className="flex flex-wrap gap-1">
              {product.suitableFaceShapes.map((shape) => (
                <span
                  key={shape}
                  className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold rounded-md"
                >
                  {shape} Face
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => openLensCustomizer(product)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Select Prescription & Lens Coatings</span>
            </button>

            <button
              onClick={() => addToCart(product, selectedColor, undefined, 1)}
              className="w-full py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs rounded-2xl border border-neutral-300 transition-colors flex items-center justify-center gap-2"
            >
              <Glasses className="w-4 h-4 text-neutral-600" />
              <span>Add Frame Only ({formatPrice(product.price)})</span>
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Free Express Shipping & Insurance</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>30-Day Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>1-Year Scratch & Frame Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Optician Inspected Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion / Tabs Section */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-6 border-b border-neutral-200 pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
              activeTab === "overview" ? "border-amber-500 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
              activeTab === "specs" ? "border-amber-500 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Optical Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`text-sm font-bold pb-2 transition-colors border-b-2 ${
              activeTab === "reviews" ? "border-amber-500 text-neutral-950" : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Customer Reviews ({product.reviewsCount})
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4 max-w-3xl text-sm text-neutral-600 leading-relaxed">
            <p>{product.description}</p>
            <div className="pt-2">
              <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2">Signature Craftsmanship Features:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-neutral-700">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Frame Material</span>
              <p className="font-bold text-neutral-900 capitalize">{product.material.replace("_", " ")}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Gender Target</span>
              <p className="font-bold text-neutral-900 capitalize">{product.gender}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Hinge Type</span>
              <p className="font-bold text-neutral-900">Custom German OBE Spring Hinges</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Bridge Size</span>
              <p className="font-bold text-neutral-900">{product.dimensions.bridgeWidthMm} mm</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Temple Length</span>
              <p className="font-bold text-neutral-900">{product.dimensions.templeLengthMm} mm</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400">Lens Height</span>
              <p className="font-bold text-neutral-900">{product.dimensions.lensHeightMm} mm</p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center gap-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
              <div className="text-center">
                <span className="text-4xl font-black text-neutral-950 font-serif">{product.rating}</span>
                <div className="flex justify-center text-amber-500 my-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <span className="text-[10px] text-neutral-500 font-bold">{product.reviewsCount} reviews</span>
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-12 text-neutral-500 font-bold">5 Stars</span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[88%]" />
                  </div>
                  <span className="w-8 text-neutral-500 font-bold">88%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12 text-neutral-500 font-bold">4 Stars</span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[10%]" />
                  </div>
                  <span className="w-8 text-neutral-500 font-bold">10%</span>
                </div>
              </div>
            </div>

            {/* Sample Review list */}
            <div className="space-y-4">
              <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">Dr. Claire V.</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-neutral-400 text-[11px]">3 days ago</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  "Exquisite Japanese titanium build. The frame feels weightless on my nose bridge and the blue light anti-reflective coating is superior to my old designer pair."
                </p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">Marcus T.</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-neutral-400 text-[11px]">2 weeks ago</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  "The AI Virtual Try-On was surprisingly accurate on size and proportion. Ordered with single vision high-index lenses and received them in 4 days!"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Frames */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3 className="text-2xl font-black font-serif text-neutral-950">
              You May Also Like
            </h3>
            <button
              onClick={() => setActiveView({ type: "catalog", category: product.category })}
              className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1"
            >
              <span>View Collection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
