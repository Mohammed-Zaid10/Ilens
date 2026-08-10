import { MOCK_PRODUCTS } from "./products";
import {
  AdminProduct,
  AdminCustomer,
  PendingPrescription,
  Coupon,
  ProductReview,
  AdminAppointment,
  CMSContent,
  AdminStoreSettings
} from "../types/admin";
import { Order, StoreLocation } from "../types";

export const INITIAL_ADMIN_PRODUCTS: AdminProduct[] = MOCK_PRODUCTS.map((prod, idx) => ({
  ...prod,
  sku: `IL-${prod.category.toUpperCase().slice(0, 3)}-${100 + idx}`,
  stockCount: [42, 18, 5, 0, 24, 8, 31, 15, 62][idx % 9],
  lowStockThreshold: 10,
  costPrice: Math.round(prod.price * 0.38),
  supplier: idx % 2 === 0 ? "Sabae Atelier Co. (Japan)" : "Belluno Optics SpA (Italy)",
  dateAdded: "2025-11-12",
  salesCount: 140 + idx * 23,
  featured: idx < 4
}));

export const INITIAL_ADMIN_ORDERS: Order[] = [
  {
    id: "IL-ORD-9842",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@example.com",
    customerPhone: "+1 (415) 555-0192",
    date: "2026-08-09T10:14:00Z",
    status: "Order Placed",
    trackingNumber: "TRK-9842-8821",
    estimatedDelivery: "2026-08-14",
    items: [
      {
        cartItemId: "item-1",
        product: MOCK_PRODUCTS[0],
        selectedColor: MOCK_PRODUCTS[0].colors[0],
        quantity: 1,
        totalItemPrice: 245,
        lensConfig: {
          usage: "progressive",
          usageLabel: "Progressive Multi-Focal Lens",
          usagePrice: 120,
          index: "1.67_super_thin",
          indexLabel: "1.67 Super-Thin High Index",
          indexPrice: 60,
          coatings: ["blue_light_blocker", "standard_anti_reflective"],
          coatingsPrice: 40,
          totalLensPrice: 220,
          prescription: {
            odSph: "-2.25",
            odCyl: "-0.75",
            odAxis: "090",
            odAdd: "+1.50",
            osSph: "-2.50",
            osCyl: "-0.50",
            osAxis: "085",
            osAdd: "+1.50",
            pd: "63",
            pdType: "single",
            doctorName: "Dr. Elena Vance, OD"
          }
        }
      }
    ],
    shippingAddress: {
      id: "addr-1",
      fullName: "Sophia Martinez",
      street: "742 Evergreen Terrace",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
      phone: "+1 (415) 555-0192"
    },
    deliveryMethod: {
      id: "express",
      name: "Insured Express Courier (2–3 Days)",
      price: 0,
      estimatedDays: "2-3 business days"
    },
    subtotal: 405,
    discount: 20,
    tax: 69,
    shippingFee: 0,
    total: 385,
    paymentMethod: "Credit Card (Visa **** 4821)",
    paymentStatus: "Paid"
  },
  {
    id: "IL-ORD-9841",
    customerName: "Marcus Chen",
    customerEmail: "marcus.c@example.com",
    customerPhone: "+1 (206) 555-8821",
    date: "2026-08-08T16:30:00Z",
    status: "Processing",
    trackingNumber: "TRK-9841-4412",
    estimatedDelivery: "2026-08-13",
    items: [
      {
        cartItemId: "item-2",
        product: MOCK_PRODUCTS[1],
        selectedColor: MOCK_PRODUCTS[1].colors[0],
        quantity: 1,
        totalItemPrice: 195
      }
    ],
    shippingAddress: {
      id: "addr-2",
      fullName: "Marcus Chen",
      street: "128 Market Street, Apt 4B",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "United States",
      phone: "+1 (206) 555-8821"
    },
    deliveryMethod: {
      id: "standard",
      name: "Standard Ground Courier",
      price: 15,
      estimatedDays: "4-5 business days"
    },
    subtotal: 195,
    discount: 0,
    tax: 35,
    shippingFee: 15,
    total: 210,
    paymentMethod: "Apple Pay",
    paymentStatus: "Paid"
  },
  {
    id: "IL-ORD-9840",
    customerName: "Olivia Taylor",
    customerEmail: "olivia.t@example.com",
    customerPhone: "+1 (212) 555-3341",
    date: "2026-08-08T11:15:00Z",
    status: "Ready to Ship",
    trackingNumber: "TRK-9840-7719",
    estimatedDelivery: "2026-08-12",
    items: [
      {
        cartItemId: "item-3",
        product: MOCK_PRODUCTS[2],
        selectedColor: MOCK_PRODUCTS[2].colors[0],
        quantity: 1,
        totalItemPrice: 210
      }
    ],
    shippingAddress: {
      id: "addr-3",
      fullName: "Olivia Taylor",
      street: "505 Fifth Avenue",
      city: "New York",
      state: "NY",
      zip: "10017",
      country: "United States",
      phone: "+1 (212) 555-3341"
    },
    deliveryMethod: {
      id: "express",
      name: "Insured Express Courier",
      price: 0,
      estimatedDays: "2-3 business days"
    },
    subtotal: 210,
    discount: 25,
    tax: 33,
    shippingFee: 0,
    total: 185,
    paymentMethod: "PayPal",
    paymentStatus: "Paid"
  },
  {
    id: "IL-ORD-9839",
    customerName: "David Sterling",
    customerEmail: "david.s@example.com",
    customerPhone: "+1 (305) 555-9012",
    date: "2026-08-07T09:45:00Z",
    status: "Shipped",
    trackingNumber: "FEDEX-998214-US",
    estimatedDelivery: "2026-08-10",
    items: [
      {
        cartItemId: "item-4",
        product: MOCK_PRODUCTS[3],
        selectedColor: MOCK_PRODUCTS[3].colors[0],
        quantity: 2,
        totalItemPrice: 320
      }
    ],
    shippingAddress: {
      id: "addr-4",
      fullName: "David Sterling",
      street: "88 Ocean Drive",
      city: "Miami",
      state: "FL",
      zip: "33139",
      country: "United States",
      phone: "+1 (305) 555-9012"
    },
    deliveryMethod: {
      id: "express",
      name: "Insured Express Courier",
      price: 0,
      estimatedDays: "2-3 business days"
    },
    subtotal: 320,
    discount: 0,
    tax: 57,
    shippingFee: 0,
    total: 320,
    paymentMethod: "Credit Card (MasterCard **** 9012)",
    paymentStatus: "Paid"
  },
  {
    id: "IL-ORD-9838",
    customerName: "Emma Watson",
    customerEmail: "emma.w@example.com",
    customerPhone: "+1 (310) 555-4421",
    date: "2026-08-05T14:20:00Z",
    status: "Delivered",
    trackingNumber: "UPS-110293-CA",
    estimatedDelivery: "2026-08-08",
    items: [
      {
        cartItemId: "item-5",
        product: MOCK_PRODUCTS[0],
        selectedColor: MOCK_PRODUCTS[0].colors[1],
        quantity: 1,
        totalItemPrice: 185
      }
    ],
    shippingAddress: {
      id: "addr-5",
      fullName: "Emma Watson",
      street: "12 Beverly Hills Blvd",
      city: "Los Angeles",
      state: "CA",
      zip: "90210",
      country: "United States",
      phone: "+1 (310) 555-4421"
    },
    deliveryMethod: {
      id: "express",
      name: "Insured Express Courier",
      price: 0,
      estimatedDays: "2-3 business days"
    },
    subtotal: 185,
    discount: 15,
    tax: 30,
    shippingFee: 0,
    total: 170,
    paymentMethod: "Google Pay",
    paymentStatus: "Paid"
  }
];

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [
  {
    id: "CUST-100",
    name: "Mohd Zaid",
    email: "mohdzaid76771@gmail.com",
    phone: "+1 (800) 767-7123",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2024-01-01",
    totalOrders: 12,
    totalSpent: 3850,
    tier: "Platinum",
    status: "VIP",
    prescriptionsCount: 3,
    lastOrderDate: "2026-08-09"
  },
  {
    id: "CUST-101",
    name: "Sophia Martinez",
    email: "sophia.m@example.com",
    phone: "+1 (415) 555-0192",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2025-01-15",
    totalOrders: 6,
    totalSpent: 1420,
    tier: "Platinum",
    status: "VIP",
    prescriptionsCount: 2,
    lastOrderDate: "2026-08-09"
  },
  {
    id: "CUST-102",
    name: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 (206) 555-8821",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2025-03-22",
    totalOrders: 3,
    totalSpent: 590,
    tier: "Gold",
    status: "Active",
    prescriptionsCount: 1,
    lastOrderDate: "2026-08-08"
  },
  {
    id: "CUST-103",
    name: "Olivia Taylor",
    email: "olivia.t@example.com",
    phone: "+1 (212) 555-3341",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2025-06-10",
    totalOrders: 4,
    totalSpent: 830,
    tier: "Gold",
    status: "Active",
    prescriptionsCount: 1,
    lastOrderDate: "2026-08-08"
  },
  {
    id: "CUST-104",
    name: "David Sterling",
    email: "david.s@example.com",
    phone: "+1 (305) 555-9012",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2025-09-01",
    totalOrders: 2,
    totalSpent: 480,
    tier: "Silver",
    status: "Active",
    prescriptionsCount: 0,
    lastOrderDate: "2026-08-07"
  },
  {
    id: "CUST-105",
    name: "Emma Watson",
    email: "emma.w@example.com",
    phone: "+1 (310) 555-4421",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    joinedDate: "2025-11-05",
    totalOrders: 1,
    totalSpent: 170,
    tier: "Silver",
    status: "Active",
    prescriptionsCount: 1,
    lastOrderDate: "2026-08-05"
  }
];

export const INITIAL_PENDING_PRESCRIPTIONS: PendingPrescription[] = [
  {
    id: "RX-1008",
    orderId: "IL-ORD-9842",
    customerName: "Sophia Martinez",
    customerEmail: "sophia.m@example.com",
    prescriptionName: "Dr. Vance Exam 2026",
    dateSubmitted: "2026-08-09T10:14:00Z",
    status: "Pending Verification",
    doctorName: "Dr. Elena Vance, OD",
    odSph: "-2.25",
    odCyl: "-0.75",
    odAxis: "090",
    odAdd: "+1.50",
    osSph: "-2.50",
    osCyl: "-0.50",
    osAxis: "085",
    osAdd: "+1.50",
    pd: "63",
    fileUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
    notes: "High cylinder in right eye, please verify with clinical tolerance."
  },
  {
    id: "RX-1007",
    orderId: "IL-ORD-9841",
    customerName: "Marcus Chen",
    customerEmail: "marcus.chen@example.com",
    prescriptionName: "Seattle Vision Care Rx",
    dateSubmitted: "2026-08-08T16:30:00Z",
    status: "Approved",
    doctorName: "Dr. Robert Thorne",
    odSph: "-1.50",
    odCyl: "0.00",
    odAxis: "000",
    osSph: "-1.75",
    osCyl: "-0.25",
    osAxis: "180",
    pd: "65",
    fileUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
    notes: "Verified against state registry."
  },
  {
    id: "RX-1006",
    orderId: "IL-ORD-9835",
    customerName: "Chloe Dupont",
    customerEmail: "chloe.d@example.com",
    prescriptionName: "Uploaded Paper Rx",
    dateSubmitted: "2026-08-07T12:00:00Z",
    status: "Resubmission Requested",
    doctorName: "Unclear Doctor Signature",
    odSph: "-4.00",
    odCyl: "-1.25",
    odAxis: "045",
    osSph: "-4.25",
    osCyl: "-1.00",
    osAxis: "135",
    pd: "61",
    notes: "Uploaded photo is blurry. Requested clearer image showing doctor's license number."
  }
];

export const INITIAL_ADMIN_COUPONS: Coupon[] = [
  {
    id: "CPN-01",
    code: "ILENS20",
    discountType: "percentage",
    value: 20,
    minPurchase: 100,
    usageCount: 142,
    usageLimit: 500,
    startDate: "2026-01-01",
    expiryDate: "2026-12-31",
    status: "Active",
    description: "20% off all complete prescription frame orders over $100."
  },
  {
    id: "CPN-02",
    code: "FREELENS",
    discountType: "fixed",
    value: 50,
    minPurchase: 150,
    usageCount: 89,
    usageLimit: 200,
    startDate: "2026-06-01",
    expiryDate: "2026-09-01",
    status: "Active",
    description: "$50 credit towards upgraded anti-reflective lens coatings."
  },
  {
    id: "CPN-03",
    code: "WELCOME10",
    discountType: "percentage",
    value: 10,
    minPurchase: 50,
    usageCount: 312,
    usageLimit: 1000,
    startDate: "2025-01-01",
    expiryDate: "2027-01-01",
    status: "Active",
    description: "10% first-time customer welcome discount."
  },
  {
    id: "CPN-04",
    code: "VIPVISION50",
    discountType: "fixed",
    value: 100,
    minPurchase: 300,
    usageCount: 18,
    usageLimit: 50,
    startDate: "2026-08-01",
    expiryDate: "2026-08-31",
    status: "Active",
    description: "$100 off premium Japanese titanium models for ILens Circle Gold & Platinum."
  }
];

export const INITIAL_PRODUCT_REVIEWS: ProductReview[] = [
  {
    id: "REV-201",
    productId: "il-001",
    productName: "Aura Silhouette",
    customerName: "Sophia Martinez",
    rating: 5,
    title: "Weightless precision engineering!",
    comment: "The 3D virtual try-on accurately matched my eye landmarks. When the glasses arrived, they fitted my face identically to the AR preview. Titanium build is amazingly light.",
    date: "2026-08-02",
    status: "Approved",
    verifiedPurchase: true,
    reply: "Thank you Sophia! We take great pride in our Japanese Titanium craftsmanship and real-time 3D AR accuracy."
  },
  {
    id: "REV-202",
    productId: "il-002",
    productName: "Kuro Matte Octagon",
    customerName: "Marcus C.",
    rating: 5,
    title: "Minimalist perfection",
    comment: "Subtle dark brown accents and clean geometric design. The lens crafting quality is top notch.",
    date: "2026-07-28",
    status: "Approved",
    verifiedPurchase: true
  },
  {
    id: "REV-203",
    productId: "il-003",
    productName: "Koto Acetate Square",
    customerName: "Jason B.",
    rating: 4,
    title: "Great frame, fast shipping",
    comment: "Solid build. The virtual try-on made choosing the color easy. Would recommend!",
    date: "2026-07-20",
    status: "Approved",
    verifiedPurchase: true
  }
];

export const INITIAL_ADMIN_APPOINTMENTS: AdminAppointment[] = [
  {
    id: "APT-801",
    patientName: "Dr. Amanda Ross",
    patientEmail: "amanda.r@example.com",
    patientPhone: "+1 (415) 555-0199",
    storeId: "store-sf-01",
    storeName: "ILens Flagship Atelier — Union Square (SF)",
    optometristName: "Dr. Jonathan Miller, OD",
    testType: "Comprehensive Eye Exam",
    date: "2026-08-10",
    timeSlot: "10:30 AM",
    status: "Confirmed",
    notes: "Wants digital eyestrain consultation."
  },
  {
    id: "APT-802",
    patientName: "Liam Hemsworth",
    patientEmail: "liam.h@example.com",
    patientPhone: "+1 (212) 555-8822",
    storeId: "store-nyc-01",
    storeName: "ILens Soho Studio — New York",
    optometristName: "Dr. Sarah Jenkins, OD",
    testType: "Contact Lens Fitting",
    date: "2026-08-11",
    timeSlot: "02:00 PM",
    status: "Confirmed"
  },
  {
    id: "APT-803",
    patientName: "Claire Underwood",
    patientEmail: "claire.u@example.com",
    patientPhone: "+1 (310) 555-1212",
    storeId: "store-la-01",
    storeName: "ILens Beverly Hills — Los Angeles",
    optometristName: "Dr. Michael Sterling, OD",
    testType: "Comprehensive Eye Exam",
    date: "2026-08-08",
    timeSlot: "11:00 AM",
    status: "Completed",
    notes: "Rx generated and saved to patient account."
  }
];

export const INITIAL_ADMIN_STORES: StoreLocation[] = [
  {
    id: "store-sf-01",
    name: "ILens Flagship Atelier — Union Square",
    address: "240 Post Street",
    city: "San Francisco",
    state: "CA",
    zip: "94108",
    phone: "+1 (415) 555-4536",
    hours: "Mon-Sat: 10 AM - 7 PM, Sun: 11 AM - 6 PM",
    rating: 4.9,
    reviewsCount: 312,
    imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    services: [
      "Comprehensive Digital Eye Exams",
      "3D Real-Time Virtual Try-On Bar",
      "Same-Day Custom Lens Crafting",
      "Japanese Titanium Frame Fitting",
      "Contact Lens Consultations"
    ],
    optometrists: [
      {
        name: "Dr. Jonathan Miller, OD",
        title: "Chief Optometrist & Cornea Specialist",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
      },
      {
        name: "Dr. Elena Vance, OD",
        title: "Pediatric & Specialty Contact Specialist",
        avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78c4c?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 37.7886, lng: -122.4071 },
    sameDayGlasses: true
  },
  {
    id: "store-nyc-01",
    name: "ILens Soho Studio — New York",
    address: "482 Broome Street",
    city: "New York",
    state: "NY",
    zip: "10013",
    phone: "+1 (212) 555-9082",
    hours: "Mon-Sat: 10 AM - 8 PM, Sun: 11 AM - 7 PM",
    rating: 4.8,
    reviewsCount: 284,
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800",
    services: [
      "Retinal Imaging & Vision Check",
      "Custom Titanium Styling Lounge",
      "Expedited Lens Processing",
      "Complimentary Frame Adjustments"
    ],
    optometrists: [
      {
        name: "Dr. Sarah Jenkins, OD",
        title: "Senior Ophthalmic Optometrist",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 40.7225, lng: -74.0001 },
    sameDayGlasses: true
  },
  {
    id: "store-la-01",
    name: "ILens Beverly Hills — Los Angeles",
    address: "9500 Wilshire Blvd",
    city: "Beverly Hills",
    state: "CA",
    zip: "90212",
    phone: "+1 (310) 555-7711",
    hours: "Mon-Sat: 10 AM - 7 PM, Sun: Closed",
    rating: 4.9,
    reviewsCount: 198,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    services: [
      "VIP Private Styling Sessions",
      "Precision Pupilometer Calibration",
      "Luxury Bespoke Eyewear",
      "Comprehensive Eye Exams"
    ],
    optometrists: [
      {
        name: "Dr. Michael Sterling, OD",
        title: "Lead Vision Care Director",
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 34.067, lng: -118.401 },
    sameDayGlasses: false
  }
];

export const INITIAL_CMS_CONTENT: CMSContent = {
  heroBannerTitle: "ARCHITECTURAL EYEWEAR REIMAGINED",
  heroBannerSubtitle: "Precision Japanese Titanium & Real-Time 3D AR Try-On",
  heroBannerBadge: "NEW 2026 ATELIER COLLECTION",
  heroImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1200",
  promoBarText: "COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING & 30-DAY HOME TRY-ON RISK FREE",
  promoBarActive: true,
  featuredCollectionTitle: "Curated Japanese Titanium Models",
  featuredCollectionIds: ["il-001", "il-002", "il-003", "il-004"],
  announcementText: "Experience our upgraded 3D Real-Time AR Virtual Try-On with zero lag."
};

export const INITIAL_STORE_SETTINGS: AdminStoreSettings = {
  storeName: "ILens Atelier & Eyewear",
  contactEmail: "concierge@ilens.com",
  supportPhone: "+1 (800) 555-ILENS",
  currency: "USD",
  taxRate: 8.5,
  freeShippingThreshold: 150,
  flatShippingRate: 15,
  enableVirtualTryOn: true,
  enableAiStyleFinder: true,
  requireRxVerification: true,
  autoApproveInStockOrders: false
};
