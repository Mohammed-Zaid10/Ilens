export type CategoryType = 
  | "all"
  | "eyeglasses"
  | "sunglasses"
  | "contacts"
  | "bluelight"
  | "new-arrivals"
  | "bestsellers"
  | "offers";

export type FrameShape = 
  | "round"
  | "oval"
  | "square"
  | "rectangle"
  | "cat-eye"
  | "aviator"
  | "geometric"
  | "wayfarer";

export type FrameMaterial = "acetate" | "titanium" | "stainless_steel" | "bio_acetate" | "mixed";

export type GenderCategory = "unisex" | "women" | "men" | "kids";

export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";

export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductDimensions {
  lensWidthMm: number;
  bridgeWidthMm: number;
  templeLengthMm: number;
  lensHeightMm: number;
  totalWidthMm: number;
  sizeCategory: "Narrow (S)" | "Medium (M)" | "Wide (L)";
}

export interface TryOnCalibration {
  scale: number;             // 3D Scale multiplier (default 1.0)
  xOffset: number;           // X offset in pixels/units
  yOffset: number;           // Y offset in pixels/units
  zOffset: number;           // Z depth offset in units
  rotationX: number;         // Pitch offset in degrees
  rotationY: number;         // Yaw offset in degrees
  rotationZ: number;         // Roll offset in degrees
  eyeDistanceFactor?: number; // Scaling factor relative to pupil distance (e.g., 1.0)
  noseBridgeOffset?: number;  // Shift towards nose bridge
  // Backwards compatibility for 2D calibration fields
  widthRatio?: number;
  verticalOffset?: number;
  horizontalOffset?: number;
  rotationOffset?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  tagline?: string;
  category: "eyeglasses" | "sunglasses" | "contacts" | "bluelight";
  frameShape: FrameShape;
  material: FrameMaterial;
  gender: GenderCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isOffer?: boolean;
  discountPercentage?: number;
  colors: ColorOption[];
  selectedColorIndex?: number;
  primaryImage: string;
  alternateImages: string[];
  tryOnImage?: string; // Transparent PNG/WebP frame image for virtual try-on
  tryOnModel?: string; // Path to 3D GLB/GLTF model (e.g. "/models/aero-classic.glb")
  tryOnOverlayUrl?: string; // Transparent SVG/PNG overlay for virtual try-on
  tryOnCalibration?: TryOnCalibration; // AR Calibration values per frame
  suitableFaceShapes: FaceShape[];
  dimensions: ProductDimensions;
  description: string;
  features: string[];
  inStock: boolean;
  // Contact lens specific
  packSize?: string;
  wearingDuration?: "Daily" | "Monthly" | "Bi-Weekly";
  baseCurve?: number;
  diameter?: number;
}

export type LensUsage = 
  | "distance" // Single Vision Distance
  | "reading" // Single Vision Near
  | "progressive" // Multi-focal
  | "computer" // Blue Light Protection
  | "non_prescription" // Fashion / Protection Only
  | "frame_only"; // Demo Lenses Only

export type LensMaterialIndex = 
  | "1.50_standard" // Standard
  | "1.60_thin" // 25% Thinner
  | "1.67_super_thin" // 40% Thinner
  | "1.74_ultra_thin"; // 50% Thinner (High Index)

export type LensCoating = 
  | "standard_anti_reflective"
  | "blue_light_blocker"
  | "photochromic_transitions"
  | "polarized_sun"
  | "scratch_resistant_hydrophobic";

export interface PrescriptionData {
  prescriptionName?: string;
  odSph: string; // Right Eye Sphere
  odCyl: string; // Right Eye Cylinder
  odAxis: string; // Right Eye Axis
  odAdd?: string; // Right Eye Addition (Progressive)
  osSph: string; // Left Eye Sphere
  osCyl: string; // Left Eye Cylinder
  osAxis: string; // Left Eye Axis
  osAdd?: string; // Left Eye Addition
  pd: string; // Pupillary Distance
  pdType: "single" | "dual";
  pdLeft?: string;
  pdRight?: string;
  doctorName?: string;
  uploadedFileUrl?: string;
}

export interface SelectedLensConfig {
  usage: LensUsage;
  usageLabel: string;
  usagePrice: number;
  index: LensMaterialIndex;
  indexLabel: string;
  indexPrice: number;
  coatings: LensCoating[];
  coatingsPrice: number;
  tintColor?: string;
  prescription?: PrescriptionData;
  totalLensPrice: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedColor: ColorOption;
  quantity: number;
  lensConfig?: SelectedLensConfig;
  totalItemPrice: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  services: string[];
  optometrists: { name: string; title: string; avatar: string }[];
  coordinates: { lat: number; lng: number };
  sameDayGlasses: boolean;
}

export interface EyeTestBooking {
  bookingId: string;
  store: StoreLocation;
  optometristName: string;
  testType: "Comprehensive Eye Exam" | "Contact Lens Fitting" | "Children Vision Check" | "Digital Eyestrain Check";
  date: string;
  timeSlot: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  price: number;
}

export type OrderStatus =
  | "Order Placed"
  | "Payment Confirmed"
  | "Confirmed"
  | "Processing"
  | "Prescription Verification"
  | "Ready to Ship"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Return Requested"
  | "Returned"
  | "Refunded";

export type PaymentStatus =
  | "Pending"
  | "Processing"
  | "Paid"
  | "Failed"
  | "Cancelled"
  | "Refunded"
  | "Partially Refunded";

export interface DeliveryMethod {
  id: "standard" | "express" | "store_pickup";
  name: string;
  price: number;
  estimatedDays: string;
  pickupStoreId?: string;
  pickupStoreName?: string;
  pickupAddress?: string;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  isActive: boolean;
  expiryDate: string;
  description: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  label?: "Home" | "Work" | "Other";
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  reason: "Wrong Product" | "Damaged" | "Defective" | "Wrong Prescription" | "Size/Fit Issue" | "Other";
  description: string;
  imageUrls?: string[];
  status: "Requested" | "Approved" | "Rejected" | "Processing" | "Completed";
  createdAt: string;
}

export interface Order {
  id: string; // Customer order ID e.g. ILN-20260810-4821
  firestoreDocId?: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO date string
  status: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  trackingUrl?: string;
  estimatedDelivery: string;
  items: CartItem[];
  shippingAddress: SavedAddress;
  deliveryMethod: DeliveryMethod;
  prescriptionData?: PrescriptionData;
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentDetails?: {
    paymentId?: string;
    vpa?: string;
    bankName?: string;
    cardLast4?: string;
    createdAt?: string;
  };
  returnRequest?: ReturnRequest;
  invoiceNumber?: string;
  isGuestOrder?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  savedPrescriptions: PrescriptionData[];
  savedAddresses: SavedAddress[];
  circlePoints: number;
  circleTier: "Silver" | "Gold" | "Platinum";
}

export type ActiveView = 
  | { type: "home" }
  | { type: "catalog"; category: CategoryType; shapeFilter?: FrameShape; genderFilter?: GenderCategory }
  | { type: "product-detail"; productId: string }
  | { type: "checkout" }
  | { type: "order-confirmation"; order: Order }
  | { type: "order-tracking"; orderId?: string }
  | { type: "account"; tab?: "orders" | "prescriptions" | "circle" | "profile" }
  | { type: "login"; redirectView?: ActiveView }
  | { type: "signup"; redirectView?: ActiveView }
  | { type: "forgot-password" }
  | { type: "stores" }
  | { type: "eye-test-booking"; storeId?: string }
  | { type: "circle" }
  | { type: "try-on"; productId?: string }
  | { type: "try-on-calibration"; productId?: string }
  | { type: "static-page"; pageSlug: "about" | "shipping" | "returns" | "warranty" | "privacy" | "terms" | "help" | "contact" }
  | { type: "admin"; section?: import("./types/admin").AdminSection }
  | { type: "404" };

