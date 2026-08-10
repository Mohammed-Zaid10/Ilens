import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { validateCoupon } from "../services/couponService";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Heart } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartCount,
    formatPrice,
    setActiveView,
    toggleWishlist,
    showNotification
  } = useApp();

  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCoupon(promoCode, cartSubtotal, cart);
    if (result.isValid && result.coupon) {
      setAppliedCoupon({ code: result.coupon.code, discount: result.discountAmount });
      showNotification(result.message, "success");
    } else {
      showNotification(result.message, "warning");
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-serif">Shopping Bag ({cartCount})</h3>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 text-xs text-amber-950">
          {cartSubtotal >= freeShippingThreshold ? (
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4" /> You unlocked FREE Express Shipping!
            </span>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Add {formatPrice(freeShippingThreshold - cartSubtotal)} more for Free Express Shipping</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-sm font-bold text-neutral-800">Your Shopping Bag is empty</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our eyeglasses, sunglasses, and blue light collections.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex gap-4 relative group"
              >
                <img
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  className="w-20 h-20 object-contain rounded-xl bg-white p-1 border border-neutral-200 shrink-0"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-neutral-900 font-serif">{item.product.name}</h4>
                      <p className="text-[10px] text-neutral-500">
                        Color: {item.selectedColor.name} | Size: {item.product.dimensions?.sizeCategory || "Medium"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        title="Save to Wishlist"
                        onClick={() => {
                          toggleWishlist(item.product);
                          removeFromCart(item.cartItemId);
                        }}
                        className="text-neutral-400 hover:text-amber-600 transition-colors p-1"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>

                      <button
                        title="Remove item"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Custom Lens Details */}
                  {item.lensConfig && (
                    <div className="text-[10px] bg-white p-2 rounded-lg border border-neutral-200 text-neutral-700 space-y-0.5">
                      <span className="font-bold text-amber-700 block">• {item.lensConfig.usageLabel}</span>
                      <span className="block text-neutral-500">• {item.lensConfig.indexLabel}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 bg-white border border-neutral-300 rounded-lg p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-xs text-neutral-900">
                      {formatPrice(item.totalItemPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-neutral-200 space-y-4">
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. ILENSVIP)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase focus:outline-none"
                />
                <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl"
              >
                Apply
              </button>
            </form>

            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-neutral-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Delivery:</span>
                <span className="font-bold text-emerald-600">
                  {cartSubtotal >= freeShippingThreshold ? "FREE" : formatPrice(99)}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between font-black text-sm text-neutral-950">
                <span>Total:</span>
                <span className="text-amber-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setActiveView({ type: "checkout" });
              }}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
