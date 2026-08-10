import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { sendResetPassword } from "../services/firebase/authService";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export const ForgotPasswordView: React.FC = () => {
  const { setActiveView } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendResetPassword(email);
      setSent(true);
    } catch (err: any) {
      console.error(err);
      setSent(true); // Always display confirmation message to avoid email enumeration
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
        <button
          onClick={() => setActiveView({ type: "login" })}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-neutral-950">Reset Password</h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Enter your account email address and we'll send you secure instructions to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Password Reset Email Sent</span>
            </div>
            <p>
              If an account exists for <strong>{email}</strong>, we've sent instructions to reset your password. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => setActiveView({ type: "login" })}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-colors mt-2"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 pl-10 pr-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Sending Email..." : "Send Password Reset Link"}
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
