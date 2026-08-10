import React from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Grid, Layers, Glasses, Sparkles, Tag, Shield } from "lucide-react";

export const AdminCategoriesView: React.FC = () => {
  const { products } = useAdmin();

  const categories = [
    {
      id: "eyeglasses",
      name: "Optical Eyeglasses",
      description: "Prescription frames crafted in Grade-5 Japanese Titanium & Acetate",
      icon: Glasses,
      color: "from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-400",
      count: products.filter((p) => p.category === "eyeglasses").length
    },
    {
      id: "sunglasses",
      name: "Designer Sunglasses",
      description: "Polarized UV400 luxury eyewear and tinted lenses",
      icon: Sparkles,
      color: "from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-400",
      count: products.filter((p) => p.category === "sunglasses").length
    },
    {
      id: "bluelight",
      name: "Blue Light Blockers",
      description: "Digital eyestrain protection for screen work & gaming",
      icon: Shield,
      color: "from-blue-500/20 to-blue-900/10 border-blue-500/30 text-blue-400",
      count: products.filter((p) => p.category === "bluelight").length
    },
    {
      id: "contacts",
      name: "Contact Lenses",
      description: "Daily, monthly, and bi-weekly spherical & toric contact lenses",
      icon: Tag,
      color: "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-400",
      count: products.filter((p) => p.category === "contacts").length
    }
  ];

  const shapes = [
    { name: "Geometric", count: products.filter((p) => p.frameShape === "geometric").length },
    { name: "Round", count: products.filter((p) => p.frameShape === "round").length },
    { name: "Square", count: products.filter((p) => p.frameShape === "square").length },
    { name: "Cat-Eye", count: products.filter((p) => p.frameShape === "cat-eye").length },
    { name: "Aviator", count: products.filter((p) => p.frameShape === "aviator").length },
    { name: "Rectangle", count: products.filter((p) => p.frameShape === "rectangle").length }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Grid className="w-5 h-5 text-amber-400" /> Category & Taxonomy Management
        </h2>
        <p className="text-xs text-neutral-400">
          Structure optical catalog categories, frame shapes, materials, and face shape recommendations
        </p>
      </div>

      {/* Primary Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`bg-gradient-to-br ${c.color} p-6 rounded-3xl border shadow-xl flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-neutral-950/80 rounded-2xl border border-neutral-800">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 bg-neutral-950/80 rounded-full border border-neutral-800 text-white">
                  {c.count} Active Models
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{c.name}</h3>
                <p className="text-xs text-neutral-300 mt-1">{c.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frame Shapes Breakdown */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" /> Frame Shape Taxonomy
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {shapes.map((s, i) => (
            <div key={i} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-center space-y-1">
              <p className="font-bold text-white text-sm">{s.name}</p>
              <p className="text-xs text-amber-400 font-mono font-bold">{s.count} Products</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
