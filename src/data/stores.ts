import { StoreLocation } from "../types";

export const MOCK_STORES: StoreLocation[] = [
  {
    id: "store-nyc-soho",
    name: "ILens Flagship - SoHo NYC",
    address: "482 Broome Street",
    city: "New York",
    state: "NY",
    zip: "10013",
    phone: "(212) 555-0198",
    hours: "Mon - Sat: 10am - 8pm | Sun: 11am - 6pm",
    rating: 4.9,
    reviewsCount: 312,
    imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800",
    services: [
      "Comprehensive Digital Eye Exam",
      "Same-Day Glasses Crafting",
      "AI Virtual Try-On Studio",
      "Contact Lens Fitting",
      "Frame Repairs & Polishing"
    ],
    optometrists: [
      {
        name: "Dr. Elena Rostova, OD",
        title: "Lead Optometrist & Cornea Specialist",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
      },
      {
        name: "Dr. Marcus Vance, OD",
        title: "Pediatric & Dry Eye Specialist",
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 40.7223, lng: -74.0001 },
    sameDayGlasses: true
  },
  {
    id: "store-la-rodeo",
    name: "ILens Studio - Beverly Hills",
    address: "9570 Wilshire Boulevard",
    city: "Los Angeles",
    state: "CA",
    zip: "90212",
    phone: "(310) 555-0142",
    hours: "Mon - Sat: 10am - 7pm | Sun: 12pm - 5pm",
    rating: 4.9,
    reviewsCount: 248,
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    services: [
      "Custom Titanium Bespoke Fitting",
      "Prescription Sun Styling",
      "Comprehensive Eye Exams",
      "VIP Private Lounge Styling"
    ],
    optometrists: [
      {
        name: "Dr. Chloe Bennett, OD",
        title: "Senior Optometric Physician",
        avatar: "https://images.unsplash.com/photo-1594824813566-78a9c51a0215?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 34.067, lng: -118.401 },
    sameDayGlasses: true
  },
  {
    id: "store-chi-michigan",
    name: "ILens Atelier - Magnificent Mile",
    address: "675 N Michigan Avenue",
    city: "Chicago",
    state: "IL",
    zip: "60611",
    phone: "(312) 555-0811",
    hours: "Mon - Sat: 10am - 8pm | Sun: 11am - 6pm",
    rating: 4.8,
    reviewsCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800",
    services: [
      "Digital Retinal Imaging",
      "Blue Light Eyestrain Consultations",
      "Frame Adjustments",
      "Contact Lens Masterclass"
    ],
    optometrists: [
      {
        name: "Dr. Julian Hayes, OD",
        title: "Optometric Doctor & Contact Lens Specialist",
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 41.895, lng: -87.624 },
    sameDayGlasses: false
  },
  {
    id: "store-lon-covent",
    name: "ILens London - Covent Garden",
    address: "32 Floral Street",
    city: "London",
    state: "UK",
    zip: "WC2E 9DS",
    phone: "+44 20 7946 0912",
    hours: "Mon - Sat: 10am - 7:30pm | Sun: 12pm - 6pm",
    rating: 4.9,
    reviewsCount: 290,
    imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    services: [
      "NHS & Private Eye Examinations",
      "Same-Day Glazing Laboratory",
      "Besopke Styling Sessions",
      "Optomap Ultra-wide Retinal Imaging"
    ],
    optometrists: [
      {
        name: "Dr. Alistair Finch, MCOptom",
        title: "Lead Ophthalmic Optician",
        avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=200"
      }
    ],
    coordinates: { lat: 51.512, lng: -0.125 },
    sameDayGlasses: true
  }
];
