import { Product, Order, StoreLocation, PrescriptionData } from "../types";

export type AdminSection = 
  | "dashboard"
  | "products"
  | "categories"
  | "inventory"
  | "orders"
  | "customers"
  | "prescriptions"
  | "tryon"
  | "coupons"
  | "reviews"
  | "appointments"
  | "stores"
  | "content"
  | "analytics"
  | "settings";

export interface AdminProduct extends Product {
  sku: string;
  stockCount: number;
  lowStockThreshold: number;
  costPrice: number;
  supplier: string;
  dateAdded: string;
  salesCount: number;
  featured: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  tier: "Silver" | "Gold" | "Platinum";
  status: "Active" | "Inactive" | "VIP";
  prescriptionsCount: number;
  lastOrderDate: string;
}

export interface PendingPrescription {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  prescriptionName: string;
  dateSubmitted: string;
  status: "Pending Verification" | "Approved" | "Resubmission Requested" | "Rejected";
  doctorName?: string;
  odSph: string;
  odCyl: string;
  odAxis: string;
  odAdd?: string;
  osSph: string;
  osCyl: string;
  osAxis: string;
  osAdd?: string;
  pd: string;
  fileUrl?: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  value: number;
  minPurchase: number;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  expiryDate: string;
  status: "Active" | "Scheduled" | "Expired" | "Disabled";
  description: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Hidden";
  verifiedPurchase: boolean;
  reply?: string;
}

export interface AdminAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  storeId: string;
  storeName: string;
  optometristName: string;
  testType: string;
  date: string;
  timeSlot: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "No-Show";
  notes?: string;
}

export interface CMSContent {
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroBannerBadge: string;
  heroImage: string;
  promoBarText: string;
  promoBarActive: boolean;
  featuredCollectionTitle: string;
  featuredCollectionIds: string[];
  announcementText: string;
}

export interface AdminStoreSettings {
  storeName: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  flatShippingRate: number;
  enableVirtualTryOn: boolean;
  enableAiStyleFinder: boolean;
  requireRxVerification: boolean;
  autoApproveInStockOrders: boolean;
}
