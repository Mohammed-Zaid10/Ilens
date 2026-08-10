import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { FileCode, Save, Sparkles, Megaphone, Image } from "lucide-react";

export const AdminContentView: React.FC = () => {
  const { cmsContent, updateCmsContent } = useAdmin();
  const [form, setForm] = useState(cmsContent);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsContent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-amber-400" /> Storefront CMS & Content Management
        </h2>
        <p className="text-xs text-neutral-400">Manage hero banner headlines, promotional top bars, and collection titles</p>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4 text-xs shadow-xl">
        {saved && (
          <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold">
            CMS Content updated successfully!
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" /> Top Announcement Promo Bar
          </h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={form.promoBarText}
              onChange={(e) => setForm({ ...form, promoBarText: e.target.value })}
              className="flex-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
            />
            <label className="flex items-center gap-2 text-neutral-300 font-bold">
              <input
                type="checkbox"
                checked={form.promoBarActive}
                onChange={(e) => setForm({ ...form, promoBarActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-800"
              />
              Active
            </label>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-neutral-800">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Image className="w-4 h-4 text-amber-400" /> Homepage Hero Banner
          </h3>
          <div>
            <label className="font-bold text-neutral-300">Hero Main Title</label>
            <input
              type="text"
              value={form.heroBannerTitle}
              onChange={(e) => setForm({ ...form, heroBannerTitle: e.target.value })}
              className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-extrabold"
            />
          </div>
          <div>
            <label className="font-bold text-neutral-300">Hero Subtitle</label>
            <input
              type="text"
              value={form.heroBannerSubtitle}
              onChange={(e) => setForm({ ...form, heroBannerSubtitle: e.target.value })}
              className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save Storefront CMS
          </button>
        </div>
      </form>
    </div>
  );
};
