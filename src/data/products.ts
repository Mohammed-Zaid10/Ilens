import { Product } from "../types";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "il-001",
    name: "Aura Silhouette",
    brand: "ILens Atelier",
    tagline: "Architectural Japanese Titanium Frame",
    category: "eyeglasses",
    frameShape: "geometric",
    material: "titanium",
    gender: "unisex",
    price: 185,
    originalPrice: 220,
    rating: 4.9,
    reviewsCount: 128,
    isNew: true,
    isBestseller: true,
    discountPercentage: 15,
    colors: [
      { name: "Champagne Rose Gold", hex: "#E6C5B8" },
      { name: "Matte Gunmetal", hex: "#3A3D40" },
      { name: "Pure Titanium Silver", hex: "#D4D7DC" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
    tryOnModel: "/models/aero-classic.glb",
    tryOnOverlayUrl: "/assets/frames/geometric_gold.png",
    tryOnCalibration: {
      scale: 1.0,
      xOffset: 0,
      yOffset: 0,
      zOffset: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      eyeDistanceFactor: 1.0,
      noseBridgeOffset: 0.15,
      widthRatio: 2.2,
      verticalOffset: -0.02,
      horizontalOffset: 0,
      rotationOffset: 0
    },
    suitableFaceShapes: ["Oval", "Round", "Heart"],
    dimensions: {
      lensWidthMm: 51,
      bridgeWidthMm: 19,
      templeLengthMm: 145,
      lensHeightMm: 44,
      totalWidthMm: 135,
      sizeCategory: "Medium (M)"
    },
    description: "Crafted in Sabae, Japan, the Aura Silhouette merges ultra-lightweight Grade-5 Japanese Titanium with delicate octagonal geometry. Features custom silicone nosepads and spring hinge temples.",
    features: [
      "Weightless Japanese Titanium (Only 12.8g)",
      "Hypoallergenic & Corrosion Resistant",
      "Hand-polished satin finish",
      "Includes premium leather hard case and microfiber cleaning cloth"
    ],
    inStock: true
  },
  {
    id: "il-002",
    name: "Monaco Cat-Eye",
    brand: "ILens Couture",
    tagline: "Hand-sculpted Italian Acetate",
    category: "eyeglasses",
    frameShape: "cat-eye",
    material: "acetate",
    gender: "women",
    price: 165,
    rating: 4.8,
    reviewsCount: 94,
    isBestseller: true,
    colors: [
      { name: "Havana Tortoise Shell", hex: "#5C3A21" },
      { name: "Crystal Champagne", hex: "#F3E8D3" },
      { name: "Midnight Obsidian Black", hex: "#111111" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
    suitableFaceShapes: ["Round", "Oval", "Heart", "Square"],
    dimensions: {
      lensWidthMm: 53,
      bridgeWidthMm: 17,
      templeLengthMm: 140,
      lensHeightMm: 42,
      totalWidthMm: 136,
      sizeCategory: "Medium (M)"
    },
    description: "An iconic, upswept feline silhouette sculpted from 8mm thick Italian Mazzucchelli bio-acetate. Offers an instant lifting effect to cheekbones.",
    features: [
      "Eco-friendly Mazzucchelli Bio-Acetate",
      "5-barrel German OBE hinges for smooth action",
      "Distinctive bevelled brow line",
      "Prescription-ready bevelled grooves"
    ],
    inStock: true
  },
  {
    id: "il-003",
    name: "Verona Aviator Sun",
    brand: "ILens Studio",
    tagline: "24K Gold Plated Double-Bridge Sunglasses",
    category: "sunglasses",
    frameShape: "aviator",
    material: "titanium",
    gender: "unisex",
    price: 195,
    originalPrice: 240,
    discountPercentage: 18,
    rating: 4.9,
    reviewsCount: 210,
    isBestseller: true,
    isOffer: true,
    colors: [
      { name: "Brushed Gold / Olive Green Lens", hex: "#C5A059" },
      { name: "Satin Black / Midnight Gradient", hex: "#2B2B2B" },
      { name: "Silver / Cobalt Flash Mirror", hex: "#C0C0C0" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
    suitableFaceShapes: ["Square", "Oval", "Heart", "Diamond"],
    dimensions: {
      lensWidthMm: 56,
      bridgeWidthMm: 16,
      templeLengthMm: 145,
      lensHeightMm: 48,
      totalWidthMm: 140,
      sizeCategory: "Wide (L)"
    },
    description: "A timeless aviator elevated with a flat top double bridge and premium nylon polarized sun lenses offering 100% UV400 protection and anti-reflective inner coating.",
    features: [
      "Nylon Polarized Lenses with Anti-Reflective Back Coating",
      "100% UVA/UVB Protection (UV400)",
      "24K Gold electro-plated frame structure",
      "Sweat & Saltwater resistant coating"
    ],
    inStock: true
  },
  {
    id: "il-004",
    name: "Lucent Screen Shield",
    brand: "ILens Tech",
    tagline: "Pure Crystal Blue-Light Blocking Glasses",
    category: "bluelight",
    frameShape: "square",
    material: "bio_acetate",
    gender: "unisex",
    price: 120,
    rating: 4.9,
    reviewsCount: 340,
    isBestseller: true,
    colors: [
      { name: "Transparent Crystal Clear", hex: "#EAECEE" },
      { name: "Smoky Quartz Transparent", hex: "#7F8C8D" },
      { name: "Blush Crystal Pink", hex: "#FADBD8" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    suitableFaceShapes: ["Round", "Oval", "Heart"],
    dimensions: {
      lensWidthMm: 52,
      bridgeWidthMm: 18,
      templeLengthMm: 142,
      lensHeightMm: 43,
      totalWidthMm: 135,
      sizeCategory: "Medium (M)"
    },
    description: "Engineered specifically for heavy screen users. Filters 98% of harmful 415-455nm high-energy blue light while maintaining crystal-clear color fidelity without ugly yellow tint.",
    features: [
      "ILens BlueShield Max 98% HEV Light Filtering",
      "Anti-glare 7-layer vacuum coating",
      "Ultra-flex memory temples for zero temple pressure",
      "Reduces eyestrain, headaches, and sleep disruption"
    ],
    inStock: true
  },
  {
    id: "il-005",
    name: "Bio-Clear Daily Hydrate (30 Pack)",
    brand: "ILens Contact",
    tagline: "Next-Gen Silicone Hydrogel Contact Lenses",
    category: "contacts",
    frameShape: "round",
    material: "mixed",
    gender: "unisex",
    price: 34,
    originalPrice: 42,
    discountPercentage: 19,
    rating: 4.9,
    reviewsCount: 512,
    isBestseller: true,
    isOffer: true,
    colors: [
      { name: "Clear Hydro", hex: "#D6EAF8" }
    ],
    primaryImage: "/images/contact_lens_box.jpg",
    alternateImages: [
      "/images/colored_contacts.jpg"
    ],
    suitableFaceShapes: ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"],
    dimensions: {
      lensWidthMm: 0,
      bridgeWidthMm: 0,
      templeLengthMm: 0,
      lensHeightMm: 0,
      totalWidthMm: 0,
      sizeCategory: "Medium (M)"
    },
    description: "Ultra-breathable daily disposable contact lenses with 56% water matrix and AquaLock technology. Delivers 16 hours of continuous dew-like moisture.",
    features: [
      "High oxygen transmissibility (140 Dk/t)",
      "Class 1 UV Protection (Blocking 96% UVA & 99% UVB)",
      "Gentle handling tint for easy insertion",
      "30 Daily Disposable Lenses per box"
    ],
    inStock: true,
    packSize: "30 Lenses Box",
    wearingDuration: "Daily",
    baseCurve: 8.5,
    diameter: 14.2
  },
  {
    id: "il-006",
    name: "SOHO Round Acetate",
    brand: "ILens Studio",
    tagline: "Vintage Keyhole Bridge Optical",
    category: "eyeglasses",
    frameShape: "round",
    material: "acetate",
    gender: "unisex",
    price: 145,
    rating: 4.7,
    reviewsCount: 88,
    isNew: true,
    colors: [
      { name: "Cognac Amber", hex: "#7E481C" },
      { name: "Matte Olive Green", hex: "#4B5320" },
      { name: "Transparent Grey", hex: "#8A959E" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    tryOnModel: "/models/soho-round.glb",
    tryOnCalibration: {
      scale: 1.0,
      xOffset: 0,
      yOffset: 0,
      zOffset: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      eyeDistanceFactor: 1.0,
      noseBridgeOffset: 0.15,
      widthRatio: 2.2,
      verticalOffset: -0.02,
      horizontalOffset: 0,
      rotationOffset: 0
    },
    suitableFaceShapes: ["Square", "Oblong", "Diamond", "Heart"],
    dimensions: {
      lensWidthMm: 49,
      bridgeWidthMm: 21,
      templeLengthMm: 145,
      lensHeightMm: 46,
      totalWidthMm: 132,
      sizeCategory: "Narrow (S)"
    },
    description: "Inspired by Manhattan's artistic heritage, SOHO features a classic keyhole bridge, rounded silhouette, and hand-milled bevels.",
    features: [
      "Classic keyhole bridge design distributes weight evenly",
      "Custom core wire with engraved ILens wave motif",
      "Lightweight bio-based acetate construction"
    ],
    inStock: true
  },
  {
    id: "il-007",
    name: "Capri Oversized Polarized",
    brand: "ILens Couture",
    tagline: "Dramatic Italian Square Sun Frame",
    category: "sunglasses",
    frameShape: "square",
    material: "acetate",
    gender: "women",
    price: 175,
    originalPrice: 210,
    discountPercentage: 16,
    rating: 4.9,
    reviewsCount: 162,
    isOffer: true,
    colors: [
      { name: "Black / Warm Smoke Lens", hex: "#1C1C1C" },
      { name: "Vintage Tortoise / Green Lens", hex: "#4A2E12" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
    tryOnModel: "/models/capri-oversized.glb",
    tryOnCalibration: {
      scale: 1.0,
      xOffset: 0,
      yOffset: 0,
      zOffset: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      eyeDistanceFactor: 1.0,
      noseBridgeOffset: 0.15,
      widthRatio: 2.2,
      verticalOffset: -0.02,
      horizontalOffset: 0,
      rotationOffset: 0
    },
    suitableFaceShapes: ["Round", "Oval", "Oblong"],
    dimensions: {
      lensWidthMm: 55,
      bridgeWidthMm: 18,
      templeLengthMm: 140,
      lensHeightMm: 50,
      totalWidthMm: 142,
      sizeCategory: "Wide (L)"
    },
    description: "Exude Mediterranean glamour with Capri's oversized square proportions, thick acetate temples, and gradient HD polarized lenses.",
    features: [
      "Gradient HD Polarized Lenses for glare-free vision",
      "Thick sculpted temple arms for sun protection from sides",
      "100% UV400 Protection"
    ],
    inStock: true
  },
  {
    id: "il-008",
    name: "Metropolis Wayfarer",
    brand: "ILens Atelier",
    tagline: "Modern Industrial Titanium-Acetate Blend",
    category: "eyeglasses",
    frameShape: "wayfarer",
    material: "mixed",
    gender: "men",
    price: 170,
    rating: 4.8,
    reviewsCount: 115,
    colors: [
      { name: "Matte Black & Titanium Gold", hex: "#232323" },
      { name: "Dark Walnut & Silver", hex: "#3B281B" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
    suitableFaceShapes: ["Oval", "Round", "Heart"],
    dimensions: {
      lensWidthMm: 54,
      bridgeWidthMm: 18,
      templeLengthMm: 145,
      lensHeightMm: 41,
      totalWidthMm: 138,
      sizeCategory: "Medium (M)"
    },
    description: "A masculine, structured wayfarer combining dark matte acetate rims with lightweight titanium brow bar and flexible temples.",
    features: [
      "Hybrid Titanium and Bio-Acetate craftsmanship",
      "Flexible spring hinges suited for wider face profiles",
      "Laser-etched logo branding on inner temple"
    ],
    inStock: true
  },
  {
    id: "il-009",
    name: "Aero Titanium BlueShield",
    brand: "ILens Tech",
    tagline: "Rimless Featherlight Blue Light Specs",
    category: "bluelight",
    frameShape: "rectangle",
    material: "titanium",
    gender: "unisex",
    price: 150,
    rating: 4.9,
    reviewsCount: 82,
    isNew: true,
    colors: [
      { name: "Satin Titanium Silver", hex: "#C5C7CA" },
      { name: "Midnight Navy Titanium", hex: "#1B263B" }
    ],
    primaryImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    alternateImages: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
    ],
    tryOnImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800",
    suitableFaceShapes: ["Round", "Oval", "Heart"],
    dimensions: {
      lensWidthMm: 53,
      bridgeWidthMm: 17,
      templeLengthMm: 142,
      lensHeightMm: 36,
      totalWidthMm: 134,
      sizeCategory: "Medium (M)"
    },
    description: "Weighing only 8.5 grams, the Aero Rimless feels virtually weightless. Designed for continuous 12+ hour coding, writing, or gaming sessions.",
    features: [
      "Ultra-minimalist rimless design",
      "Beta-Titanium memory bridge and temples",
      "BlueShield Max anti-fatigue optical lenses included"
    ],
    inStock: true
  },
  {
    id: "il-010",
    name: "ColorGlow Moisture Monthly (6 Pack)",
    brand: "ILens Contact",
    tagline: "Natural Enhancer Colored Contact Lenses",
    category: "contacts",
    frameShape: "round",
    material: "mixed",
    gender: "unisex",
    price: 48,
    originalPrice: 58,
    discountPercentage: 17,
    rating: 4.8,
    reviewsCount: 230,
    isOffer: true,
    colors: [
      { name: "Hazel Amber Glow", hex: "#A0522D" },
      { name: "Ocean Sapphire Blue", hex: "#2E86C1" },
      { name: "Emerald Forest Green", hex: "#1E8449" }
    ],
    primaryImage: "/images/colored_contacts.jpg",
    alternateImages: [
      "/images/contact_lens_box.jpg"
    ],
    suitableFaceShapes: ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"],
    dimensions: {
      lensWidthMm: 0,
      bridgeWidthMm: 0,
      templeLengthMm: 0,
      lensHeightMm: 0,
      totalWidthMm: 0,
      sizeCategory: "Medium (M)"
    },
    description: "Multi-tonal limbal ring iris technology seamlessly blends with natural eye color for a striking yet authentic enhancement.",
    features: [
      "Monthly reusable with overnight storage solution",
      "3-in-1 Color Fusion Technology",
      "Breathable Hydrogel with 48% water matrix",
      "6 Monthly Lenses per box (6 month supply)"
    ],
    inStock: true,
    packSize: "6 Lenses Box",
    wearingDuration: "Monthly",
    baseCurve: 8.6,
    diameter: 14.0
  }
];
