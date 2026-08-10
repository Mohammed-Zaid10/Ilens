import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, ScanEye, Sparkles, Layers, Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "../types";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const {
    navigateToProduct,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    openVirtualTryOn,
    openLensCustomizer,
    addToCart,
    formatPrice
  } = useApp();

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  return (
    <div className="group relative bg-white rounded-3xl border border-neutral-200/80 hover:border-neutral-300 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-500 text-neutral-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              Bestseller
            </span>
          )}
          {product.isOffer && (
            <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              -{product.discountPercentage || 15}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto shadow-sm ${
            isWishlisted
              ? "bg-red-50 text-red-500 border border-red-200"
              : "bg-white/80 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200"
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div
        onClick={() => navigateToProduct(product.id)}
        className="relative aspect-4/3 bg-neutral-50 p-6 flex items-center justify-center cursor-pointer overflow-hidden group-hover:bg-neutral-100/60 transition-colors"
      >
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick Hover Actions Overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openVirtualTryOn(product);
            }}
            className="flex-1 py-2 bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-bold rounded-xl backdrop-blur-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <ScanEye className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Try-On</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-xs border transition-all ${
              isCompared
                ? "bg-amber-500 border-amber-600 text-neutral-950 font-bold"
                : "bg-white/90 border-neutral-200 text-neutral-800 hover:bg-white"
            }`}
            title="Compare Frame"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Meta */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium mb-1">
            <span className="uppercase tracking-wider font-semibold text-neutral-400">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating} ({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => navigateToProduct(product.id)}
            className="font-bold text-neutral-900 text-base font-serif hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{product.tagline}</p>
        </div>

        {/* Color Swatches & Price */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            {product.colors.map((c, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(i);
                }}
                className={`w-4 h-4 rounded-full border p-0.5 transition-all ${
                  selectedColorIdx === i ? "border-amber-600 ring-2 ring-amber-600/20 scale-110" : "border-neutral-300"
                }`}
                title={c.name}
              >
                <span className="block w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </div>

          <div className="text-right">
            <span className="text-base font-black text-neutral-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through ml-1.5">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex gap-2">
          {product.category === "contacts" ? (
            <button
              onClick={() => addToCart(product, currentColor)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add Box to Bag
            </button>
          ) : (
            <button
              onClick={() => openLensCustomizer(product)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Select Lenses
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
