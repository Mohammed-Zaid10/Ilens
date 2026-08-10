import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useApp } from "../../../context/AppContext";
import { Shield, KeyRound, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";

export const AdminLogin: React.FC = () => {
  const { loginAdmin } = useAdmin();
  const { setActiveView } = useApp();

  const [inputVal, setInputVal] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const credential = inputVal.trim();
    if (!credential) {
      setError("Please enter your Admin Passcode.");
      return;
    }
    const success = loginAdmin(credential);
    if (!success) {
      setError("Access denied. Invalid Admin Passcode.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-neutral-800/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
              iLENS ADMIN OS
            </h2>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Restricted Portal — Enterprise Store Management
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
              <span>Admin Security Passcode</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPass ? "text" : "password"}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Admin Passcode..."
                className="w-full pl-10 pr-10 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-neutral-800/80">
          <button
            onClick={() => setActiveView({ type: "home" })}
            className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Return to ILens Customer Website
          </button>
        </div>
      </div>
    </div>
  );
};

