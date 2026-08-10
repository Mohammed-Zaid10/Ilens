import React from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import {
  Sparkles,
  ScanEye,
  Sliders,
  Glasses,
  ArrowRight,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Calendar,
  MapPin,
  Star,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export const HomeView: React.FC = () => {
  const {
    products,
    navigateToCatalog,
    openVirtualTryOn,
    setIsFaceShapeModalOpen,
    setIsStyleFinderOpen,
    setIsCameraSearchOpen,
    setActiveView
  } = useApp();

  const featuredBestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] bg-neutral-950 text-white rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 border border-neutral-900 flex items-center shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=1600"
            alt="ILens Atelier Eyewear"
            className="w-full h-full object-cover object-center opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-12 space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Japanese Titanium & Italian Bio-Acetate
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-[1.1]">
            Architectural Eyewear. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              AI Precision Fit.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Discover lightweight Sabae titanium frames, hand-sculpted bio-acetate, and custom prescription optics tailored with 3D facial geometry AI.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigateToCatalog("eyeglasses")}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Eyeglasses Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => openVirtualTryOn()}
              className="px-6 py-4 bg-neutral-900/90 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl border border-neutral-700 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <ScanEye className="w-4 h-4 text-amber-400" />
              <span>Launch 3D Virtual Try-On</span>
            </button>
          </div>

          <div className="pt-4 flex items-center space-x-6 text-xs text-neutral-400 font-medium border-t border-neutral-800/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 30-Day Risk-Free Prescription Trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> 1-Year Frame Warranty
            </span>
          </div>
        </div>
      </section>

      {/* 2. AI Innovation Suite Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Smart Optical Technology</span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-neutral-950">
            ILens AI Visual Studio
          </h2>
          <p className="text-xs text-neutral-500">
            Eliminate fitting uncertainty with custom facial geometry analysis, style matching, and photorealistic try-on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Virtual Try-On */}
          <div
            onClick={() => openVirtualTryOn()}
            className="p-8 bg-neutral-900 text-white rounded-3xl border border-neutral-800 hover:border-amber-500/50 shadow-xl cursor-pointer group transition-all relative overflow-hidden flex flex-col justify-between h-72"
          >
            <div className="space-y-3 z-10">
              <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
                <ScanEye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif group-hover:text-amber-400 transition-colors">
                3D Live Virtual Try-On
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Experience 1:1 photorealistic frame scaling on your webcam or sample face models.
              </p>
            </div>

            <div className="pt-4 z-10 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Try Frames Now</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Face Shape Finder */}
          <div
            onClick={() => setIsFaceShapeModalOpen(true)}
            className="p-8 bg-white text-neutral-900 rounded-3xl border border-neutral-200 hover:border-neutral-400 shadow-md cursor-pointer group transition-all flex flex-col justify-between h-72"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200">
                <Glasses className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif group-hover:text-amber-600 transition-colors">
                AI Face Shape Analyzer
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Upload a portrait to identify your facial bone structure and unlock flattering frame silhouettes.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
              <span>Analyze Face Shape</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: AI Style Quiz */}
          <div
            onClick={() => setIsStyleFinderOpen(true)}
            className="p-8 bg-white text-neutral-900 rounded-3xl border border-neutral-200 hover:border-neutral-400 shadow-md cursor-pointer group transition-all flex flex-col justify-between h-72"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif group-hover:text-amber-600 transition-colors">
                Personal Style Finder
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Answer 4 quick lifestyle questions to receive custom frame recommendations generated by Gemini AI.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-1 text-xs font-bold text-neutral-900 group-hover:translate-x-1 transition-transform">
              <span>Take Style Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Banner Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigateToCatalog("eyeglasses")}
            className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-neutral-200 shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=800"
              alt="Eyeglasses"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Atelier Optics</span>
              <h3 className="text-xl font-bold font-serif">Prescription Eyeglasses</h3>
            </div>
          </div>

          <div
            onClick={() => navigateToCatalog("sunglasses")}
            className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-neutral-200 shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
              alt="Sunglasses"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">HD Polarized</span>
              <h3 className="text-xl font-bold font-serif">Luxury Sunglasses</h3>
            </div>
          </div>

          <div
            onClick={() => navigateToCatalog("bluelight")}
            className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-neutral-200 shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"
              alt="Blue Light"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Digital Protection</span>
              <h3 className="text-xl font-bold font-serif">Blue Light Glasses</h3>
            </div>
          </div>

          <div
            onClick={() => navigateToCatalog("contacts")}
            className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group border border-neutral-200 shadow-sm"
          >
            <img
              src="/images/contact_lens_box.jpg"
              alt="Contact Lenses"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Dew Hydrate</span>
              <h3 className="text-xl font-bold font-serif">Contact Lenses</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Curated Bestsellers</span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-neutral-950 mt-1">
              Top Rated ILens Frames
            </h2>
          </div>

          <button
            onClick={() => navigateToCatalog("bestsellers")}
            className="text-xs font-bold text-neutral-900 hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <span>View All Bestsellers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Book Eye Test & Store Locator Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl z-10">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              In-Store Optical Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-serif leading-tight">
              Book a Comprehensive Eye Test at ILens Atelier
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Experience digital retinal imaging, corneal topography, and personalized styling sessions with our licensed optometric doctors in New York, Los Angeles, London, and Chicago.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveView({ type: "eye-test-booking" })}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Schedule Appointment
              </button>
              <button
                onClick={() => setActiveView({ type: "stores" })}
                className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Find Nearest Store
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 h-64 rounded-2xl overflow-hidden border border-neutral-800 shadow-lg shrink-0">
            <img
              src="/images/eye_testing_machine.jpg"
              alt="ILens Optometry Eye Testing Clinic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
