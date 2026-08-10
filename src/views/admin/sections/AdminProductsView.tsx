import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useApp } from "../../../context/AppContext";
import { AdminProduct } from "../../../types/admin";
import { FrameShape, CategoryType } from "../../../types";
import {
  Glasses,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Boxes,
  Eye,
  Star,
  Tag
} from "lucide-react";

export const AdminProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateStockCount } = useAdmin();
  const { setActiveView } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedShape, setSelectedShape] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: "",
    brand: "ILens Atelier",
    tagline: "",
    category: "eyeglasses",
    frameShape: "round",
    material: "titanium",
    gender: "unisex",
    price: 180,
    originalPrice: 210,
    stockCount: 25,
    lowStockThreshold: 10,
    sku: "IL-EYE-100",
    description: "",
    primaryImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
    tryOnModel: "/models/aero-classic.glb",
    inStock: true,
    rating: 4.8,
    reviewsCount: 12,
    features: ["Japanese Titanium", "Lightweight (12g)"],
    colors: [{ name: "Champagne Gold", hex: "#E6C5B8" }],
    suitableFaceShapes: ["Oval", "Round"],
    dimensions: {
      lensWidthMm: 50,
      bridgeWidthMm: 19,
      templeLengthMm: 145,
      lensHeightMm: 42,
      totalWidthMm: 135,
      sizeCategory: "Medium (M)"
    }
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesShape = selectedShape === "all" || p.frameShape === selectedShape;

    return matchesSearch && matchesCat && matchesShape;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      brand: "ILens Atelier",
      category: "eyeglasses",
      frameShape: "geometric",
      material: "titanium",
      gender: "unisex",
      price: 185,
      stockCount: 20,
      lowStockThreshold: 10,
      sku: `IL-EYE-${Math.floor(100 + Math.random() * 900)}`,
      description: "Crafted in Sabae, Japan with ultralight titanium.",
      primaryImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800",
      tryOnModel: "/models/aero-classic.glb",
      inStock: true,
      rating: 4.9,
      reviewsCount: 1,
      features: ["Japanese Titanium"],
      colors: [{ name: "Gold", hex: "#D4AF37" }],
      suitableFaceShapes: ["Oval", "Square"],
      dimensions: {
        lensWidthMm: 51,
        bridgeWidthMm: 19,
        templeLengthMm: 145,
        lensHeightMm: 44,
        totalWidthMm: 135,
        sizeCategory: "Medium (M)"
      }
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as Omit<AdminProduct, "id">);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Glasses className="w-5 h-5 text-amber-400" /> Eyewear Catalog & Products ({filteredProducts.length})
          </h2>
          <p className="text-xs text-neutral-400">Manage frame pricing, inventory stock, 3D AR models, and specs</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/10 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Eyewear Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, brand, or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Categories</option>
          <option value="eyeglasses">Eyeglasses</option>
          <option value="sunglasses">Sunglasses</option>
          <option value="bluelight">Blue Light Blocking</option>
          <option value="contacts">Contact Lenses</option>
        </select>

        {/* Frame Shape Filter */}
        <select
          value={selectedShape}
          onChange={(e) => setSelectedShape(e.target.value)}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Frame Shapes</option>
          <option value="geometric">Geometric</option>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="cat-eye">Cat-Eye</option>
          <option value="aviator">Aviator</option>
          <option value="rectangle">Rectangle</option>
          <option value="wayfarer">Wayfarer</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Frame</th>
                <th className="py-3 px-4">SKU & Details</th>
                <th className="py-3 px-4">Category / Shape</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">3D AR Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                  {/* Thumbnail & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.primaryImage} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0" />
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU & Material */}
                  <td className="py-3 px-4 font-mono">
                    <p className="text-amber-400 font-bold">{p.sku}</p>
                    <p className="text-[10px] text-neutral-400 uppercase">{p.material} ({p.gender})</p>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="capitalize font-bold text-neutral-200">{p.category}</span>
                    <p className="text-[10px] text-neutral-400 capitalize">{p.frameShape} shape</p>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    ${p.price}
                    {p.originalPrice && <span className="text-[10px] text-neutral-500 line-through ml-1.5">${p.originalPrice}</span>}
                  </td>

                  {/* Stock Level */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          p.stockCount === 0
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : p.stockCount <= p.lowStockThreshold
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {p.stockCount} units
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateStockCount(p.id, 1)}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                          title="Add 1 stock"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* 3D AR Model */}
                  <td className="py-3 px-4">
                    {p.tryOnModel ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-bold">
                        <Sparkles className="w-3 h-3 text-purple-400" /> 3D GLB Ready
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-mono">2D Overlay Fallback</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setActiveView({ type: "try-on", productId: p.id })}
                        className="p-1.5 hover:bg-neutral-800 text-purple-400 rounded-lg transition-colors"
                        title="Launch 3D AR Try-On Preview"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-neutral-800 text-amber-400 rounded-lg transition-colors"
                        title="Edit Product Specs"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 hover:bg-neutral-800 text-red-400 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 custom-scrollbar shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Glasses className="w-5 h-5 text-amber-400" />
                {editingProduct ? "Edit Eyewear Specifications" : "Add New Eyewear Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Product Name</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku || ""}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  >
                    <option value="eyeglasses">Eyeglasses</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="bluelight">Blue Light</option>
                    <option value="contacts">Contacts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300">Frame Shape</label>
                  <select
                    value={formData.frameShape}
                    onChange={(e) => setFormData({ ...formData, frameShape: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  >
                    <option value="geometric">Geometric</option>
                    <option value="round">Round</option>
                    <option value="square">Square</option>
                    <option value="cat-eye">Cat-Eye</option>
                    <option value="aviator">Aviator</option>
                    <option value="rectangle">Rectangle</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-300">Material</label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value as any })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  >
                    <option value="titanium">Japanese Titanium</option>
                    <option value="acetate">Acetate</option>
                    <option value="bio_acetate">Bio-Acetate</option>
                    <option value="stainless_steel">Stainless Steel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stockCount || 0}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300">3D GLB Model Path</label>
                  <input
                    type="text"
                    value={formData.tryOnModel || ""}
                    onChange={(e) => setFormData({ ...formData, tryOnModel: e.target.value })}
                    className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300">Description</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
