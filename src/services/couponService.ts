import { Coupon, CartItem } from "../types";

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "ILENSVIP",
    type: "percentage",
    value: 15,
    minOrderValue: 1000,
    maxDiscount: 1500,
    isActive: true,
    expiryDate: "2026-12-31",
    description: "15% OFF for VIP Members (Min Order ₹1000)"
  },
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderValue: 500,
    maxDiscount: 500,
    isActive: true,
    expiryDate: "2026-12-31",
    description: "10% OFF on your first ILens order"
  },
  {
    code: "EYECARE20",
    type: "percentage",
    value: 20,
    minOrderValue: 2000,
    maxDiscount: 2000,
    isActive: true,
    expiryDate: "2026-12-31",
    description: "20% OFF on prescription orders above ₹2000"
  },
  {
    code: "FREESHIP",
    type: "fixed",
    value: 99,
    minOrderValue: 0,
    isActive: true,
    expiryDate: "2026-12-31",
    description: "Free Standard Shipping on any order"
  }
];

export interface CouponResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}

export function validateCoupon(code: string, subtotal: number, cartItems: CartItem[] = []): CouponResult {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, discountAmount: 0, message: "Please enter a coupon code." };
  }

  const coupon = AVAILABLE_COUPONS.find((c) => c.code === cleanCode && c.isActive);
  if (!coupon) {
    return { isValid: false, discountAmount: 0, message: "Invalid or expired promo code." };
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Code ${coupon.code} requires a minimum subtotal of ₹${coupon.minOrderValue}.`
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === "fixed") {
    discount = Math.min(coupon.value, subtotal);
  }

  return {
    isValid: true,
    coupon,
    discountAmount: Math.round(discount),
    message: `Promo code ${coupon.code} applied successfully! You saved ₹${Math.round(discount)}.`
  };
}
