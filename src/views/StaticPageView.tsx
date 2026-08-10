import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MOCK_FAQS } from "../data/faqs";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Award
} from "lucide-react";

export const StaticPageView: React.FC<{
  pageSlug: "about" | "shipping" | "returns" | "warranty" | "privacy" | "terms" | "help" | "contact";
}> = ({ pageSlug }) => {
  const { showNotification } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [contactMessage, setContactMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("Thank you for reaching out! Our optical concierge will respond within 2 hours.", "success");
    setContactMessage("");
    setContactEmail("");
    setContactName("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. ABOUT US */}
      {pageSlug === "about" && (
        <div className="space-y-8">
          <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl border border-neutral-800 space-y-4 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Our Heritage & Optical Atelier</span>
            <h1 className="text-3xl sm:text-4xl font-black font-serif">Redefining Eyewear Through Japanese Metallurgy & AI Precision.</h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
              Founded at the intersection of Sabae titanium craftsmanship, Italian Mazzucchelli bio-acetate, and cutting-edge 3D facial geometry AI, ILens brings optical perfection directly to discerning eyes worldwide.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6 text-xs text-neutral-700 leading-relaxed">
            <h2 className="text-xl font-bold font-serif text-neutral-950">Sabae Craftsmanship Meets Modern Optics</h2>
            <p>
              In Fukui Prefecture, Japan, the town of Sabae has refined titanium eyewear manufacturing for over a century. Each ILens frame undergoes over 250 manual production steps—from laser cutting pure Japanese beta-titanium to hand-polishing organic bio-acetates with bamboo chips.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
                <h3 className="font-bold text-neutral-900 text-sm">Japanese Beta-Titanium</h3>
                <p className="text-neutral-500">Weightless durability, hypoallergenic properties, and flexible spring memory retention.</p>
              </div>
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
                <h3 className="font-bold text-neutral-900 text-sm">3D AI Facial Geometry</h3>
                <p className="text-neutral-500">Sub-millimeter camera analysis calculates bridge width, temple tension, and pupil distance automatically.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHIPPING POLICY */}
      {pageSlug === "shipping" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 space-y-2 shadow-xl">
            <Truck className="w-8 h-8 text-amber-400 mb-2" />
            <h1 className="text-3xl font-black font-serif">Insured Express Global Delivery</h1>
            <p className="text-xs text-neutral-300">All prescription eyewear is hand-inspected by licensed opticians before dispatch.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4 text-xs text-neutral-700">
            <h3 className="text-lg font-bold font-serif text-neutral-950">Shipping Speeds & Timelines</h3>
            <div className="divide-y divide-neutral-200">
              <div className="py-3 flex justify-between">
                <div>
                  <h4 className="font-bold text-neutral-900">Standard Insured Express Shipping</h4>
                  <p className="text-neutral-500">Includes tracking & transit insurance</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">FREE</span>
                  <p className="text-neutral-400 text-[11px]">3 - 5 Business Days</p>
                </div>
              </div>

              <div className="py-3 flex justify-between">
                <div>
                  <h4 className="font-bold text-neutral-900">Priority Overnight Air Dispatch</h4>
                  <p className="text-neutral-500">Guaranteed next-morning arrival after lab crafting</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900">$15 USD</span>
                  <p className="text-neutral-400 text-[11px]">1 Business Day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RETURNS POLICY */}
      {pageSlug === "returns" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 space-y-2 shadow-xl">
            <RotateCcw className="w-8 h-8 text-amber-400 mb-2" />
            <h1 className="text-3xl font-black font-serif">30-Day Risk-Free Returns & Lens Adaption</h1>
            <p className="text-xs text-neutral-300">We want your vision to feel effortless. Test your frames risk-free for 30 full days.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4 text-xs text-neutral-700 leading-relaxed">
            <h3 className="text-lg font-bold font-serif text-neutral-950">Free Return Process</h3>
            <p>
              If your prescription lenses or frame fit do not feel 100% comfortable, contact our optical concierge to receive a pre-paid return shipping label. We offer free remanufacturing of prescription lenses or a full refund.
            </p>
          </div>
        </div>
      )}

      {/* 4. WARRANTY */}
      {pageSlug === "warranty" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 space-y-2 shadow-xl">
            <Award className="w-8 h-8 text-amber-400 mb-2" />
            <h1 className="text-3xl font-black font-serif">1-Year Comprehensive Frame & Lens Guarantee</h1>
            <p className="text-xs text-neutral-300">Every ILens frame is covered against manufacturing defects, hinge fatigue, and lens coating peeling.</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4 text-xs text-neutral-700">
            <h3 className="text-lg font-bold font-serif text-neutral-950">What Is Covered</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Structural frame cracks, hinge failures, or solder breaks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Anti-reflective or blue-light coating delamination</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free lifetime nose pad replacements and screw tightening in any store</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 5. HELP CENTER / FAQs */}
      {pageSlug === "help" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 space-y-2 shadow-xl">
            <HelpCircle className="w-8 h-8 text-amber-400 mb-2" />
            <h1 className="text-3xl font-black font-serif">ILens Optical Help Center</h1>
            <p className="text-xs text-neutral-300">Find answers to common questions about optical prescriptions, lens indices, and virtual try-on.</p>
          </div>

          <div className="space-y-3">
            {MOCK_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs text-neutral-900 flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 pt-0 text-xs text-neutral-600 border-t border-neutral-100 leading-relaxed bg-neutral-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CONTACT US */}
      {pageSlug === "contact" && (
        <div className="space-y-6">
          <div className="bg-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 space-y-2 shadow-xl">
            <Mail className="w-8 h-8 text-amber-400 mb-2" />
            <h1 className="text-3xl font-black font-serif">Contact Our Optical Concierge</h1>
            <p className="text-xs text-neutral-300">Speak directly with our licensed opticians and frame stylists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold font-serif text-sm text-neutral-950">Send an Optical Inquiry</h3>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">How Can We Help You?</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Ask about prescriptions, frame dimensions, or lens materials..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Send Message to Optician
              </button>
            </form>

            <div className="bg-neutral-900 text-white p-6 rounded-3xl border border-neutral-800 space-y-4 text-xs">
              <h3 className="font-bold font-serif text-sm text-white">ILens Optical Atelier HQ</h3>
              <p className="text-neutral-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>482 Broome Street, SoHo, New York, NY 10013</span>
              </p>
              <p className="text-neutral-400 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+1 (800) 555-ILENS (45367)</span>
              </p>
              <p className="text-neutral-400 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@ilens-eyewear.com</span>
              </p>

              <div className="pt-4 border-t border-neutral-800 space-y-1 text-neutral-400">
                <span className="font-bold text-white block">Concierge Hours</span>
                <p>Monday - Friday: 8:00 AM - 9:00 PM EST</p>
                <p>Saturday - Sunday: 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. PRIVACY / TERMS */}
      {(pageSlug === "privacy" || pageSlug === "terms") && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4 text-xs text-neutral-700 leading-relaxed">
          <h1 className="text-2xl font-black font-serif text-neutral-950 capitalize">{pageSlug} Policy</h1>
          <p>
            At ILens Eyewear, your optical data, pupillary distance measurements, and facial geometry scans are processed with 256-bit HIPAA-grade security encryption. Camera feeds during Virtual Try-On are processed in real-time within your local browser sandbox and never stored or transmitted to external servers.
          </p>
        </div>
      )}
    </div>
  );
};
