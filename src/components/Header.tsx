import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Sparkles,
  Camera,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  Menu,
  X,
  Sliders,
  ScanEye,
  Glasses,
  Shield
} from "lucide-react";
import { CategoryType, FrameShape } from "../types";

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    navigateToCatalog,
    cartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsCompareOpen,
    setIsAiAssistantOpen,
    openVirtualTryOn,
    setIsFaceShapeModalOpen,
    setIsStyleFinderOpen,
    setIsCameraSearchOpen,
    searchQuery,
    setSearchQuery,
    currency,
    setCurrency,
    isAuthenticated,
    user
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToCatalog("all");
    }
  };

  const navCategories: { label: string; cat: CategoryType; highlight?: boolean }[] = [
    { label: "Eyeglasses", cat: "eyeglasses" },
    { label: "Sunglasses", cat: "sunglasses" },
    { label: "Contact Lenses", cat: "contacts" },
    { label: "Blue Light", cat: "bluelight" },
    { label: "New Arrivals", cat: "new-arrivals", highlight: true },
    { label: "Best Sellers", cat: "bestsellers" },
    { label: "Offers & Bundles", cat: "offers" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-xs">
      {/* 1. Announcement Bar */}
      <div className="bg-neutral-900 text-white text-xs px-4 py-2 flex items-center justify-between font-medium tracking-wide">
        <div className="hidden md:flex items-center space-x-6">
          <span className="flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            30-Day Free Risk-Free Trial On All Prescription Lenses
          </span>
          <span className="text-neutral-400">|</span>
          <span className="text-neutral-300">Free Worldwide Express Shipping over $150</span>
        </div>

        <div className="flex items-center justify-between w-full md:w-auto space-x-4">
          <span className="md:hidden text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 30-Day Prescription Risk-Free Trial
          </span>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView({ type: "stores" })}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <MapPin className="w-3 h-3" /> Find a Store
            </button>
            <button
              onClick={() => setActiveView({ type: "eye-test-booking" })}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <Calendar className="w-3 h-3" /> Book Eye Test
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-neutral-800 text-neutral-200 text-[11px] px-2 py-0.5 rounded border border-neutral-700 cursor-pointer focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (CA$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => setActiveView({ type: "home" })}
            className="flex items-center space-x-2 text-left group"
          >
            <div className="w-9 h-9 bg-neutral-900 text-white rounded-xl flex items-center justify-center font-bold tracking-tighter text-xl shadow-sm group-hover:bg-amber-600 transition-colors">
              iL
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-neutral-950 font-serif">
                ILENS
              </span>
              <span className="block text-[9px] font-semibold tracking-widest text-neutral-500 uppercase -mt-1">
                Atelier & Optical
              </span>
            </div>
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search frames, face shapes, blue light..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchInputFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchInputFocused(false), 200)}
                className="w-full pl-10 pr-20 py-2.5 bg-neutral-50 border border-neutral-200 rounded-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              
              <button
                type="button"
                onClick={() => setIsCameraSearchOpen(true)}
                title="Camera Visual Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-full shadow-2xs flex items-center gap-1 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Photo</span>
              </button>
            </form>
          </div>

          {/* Quick Actions & AI Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* AI Assistant Aura Badge Button */}
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="relative px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Stylist Aura</span>
            </button>

            {/* Virtual Try-On Launcher */}
            <button
              onClick={() => openVirtualTryOn()}
              className="p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Virtual Try-On"
            >
              <ScanEye className="w-5 h-5 text-neutral-800" />
              <span className="hidden xl:inline">Try-On</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setActiveView({ type: "account", tab: "orders" });
                } else {
                  setActiveView({ type: "login", redirectView: { type: "account" } });
                }
              }}
              className="p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare Drawer Toggle */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="p-2.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors relative"
                title="Compare Frames"
              >
                <Layers className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors relative flex items-center justify-center"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Button */}
            {isAuthenticated ? (
              <button
                onClick={() => setActiveView({ type: "account" })}
                className="flex items-center gap-2 p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-xs font-bold text-neutral-900 border border-neutral-200"
                title="My ILens Account"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-amber-500"
                />
                <span className="hidden sm:inline pr-2">{user.name.split(" ")[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView({ type: "login" })}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
                title="Sign In"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Admin OS Quick Access Link */}
            <button
              onClick={() => setActiveView({ type: "admin" })}
              className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-900 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-sm"
              title="Admin OS Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">Admin OS</span>
            </button>
          </div>
        </div>

        {/* 3. Category Links & AI Studio Dropdown */}
        <div className="hidden lg:flex items-center justify-between border-t border-neutral-100 py-3">
          <nav className="flex items-center space-x-8">
            {navCategories.map((item) => (
              <button
                key={item.cat}
                onClick={() => navigateToCatalog(item.cat)}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  activeView.type === "catalog" && activeView.category === item.cat
                    ? "text-neutral-950 font-bold border-b-2 border-neutral-950 pb-0.5"
                    : item.highlight
                    ? "text-amber-600 font-semibold"
                    : "text-neutral-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* AI Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
              onBlur={() => setTimeout(() => setIsAiDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full border border-amber-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ILens AI Innovation Suite</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            {isAiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    openVirtualTryOn();
                    setIsAiDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                >
                  <ScanEye className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">3D Virtual Try-On</span>
                    <span className="text-[10px] text-neutral-500">Live camera frame overlay</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFaceShapeModalOpen(true);
                    setIsAiDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                >
                  <Glasses className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">AI Face Shape Finder</span>
                    <span className="text-[10px] text-neutral-500">Photo facial geometry analysis</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsStyleFinderOpen(true);
                    setIsAiDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Personal AI Style Quiz</span>
                    <span className="text-[10px] text-neutral-500">Curated frame recommendations</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsCameraSearchOpen(true);
                    setIsAiDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-neutral-50 flex items-center gap-3 transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">Visual Camera Search</span>
                    <span className="text-[10px] text-neutral-500">Upload photo to match glasses</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search frames or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 rounded-full text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navCategories.map((item) => (
              <button
                key={item.cat}
                onClick={() => {
                  navigateToCatalog(item.cat);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-medium text-neutral-800 bg-neutral-50 hover:bg-neutral-100 rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 space-y-2">
            <button
              onClick={() => {
                openVirtualTryOn();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-neutral-900 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <ScanEye className="w-4 h-4 text-amber-400" /> Launch 3D Virtual Try-On
            </button>
            <button
              onClick={() => {
                setIsFaceShapeModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" /> AI Face Shape Analyzer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
