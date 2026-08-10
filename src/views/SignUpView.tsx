import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { signUpWithEmail, signInWithGoogle } from "../services/firebase/authService";
import { Mail, Lock, User, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export const SignUpView: React.FC = () => {
  const { setActiveView, activeView, showNotification } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget = activeView.type === "signup" ? activeView.redirectView : undefined;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, firstName, lastName);
      showNotification("Account created! Welcome to ILens Eyewear.", "success");
      if (redirectTarget) {
        setActiveView(redirectTarget);
      } else {
        setActiveView({ type: "account" });
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Try logging in.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Choose a stronger password.");
      } else {
        setError("Failed to create account. " + (err.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      showNotification("Account registered with Google!", "success");
      if (redirectTarget) {
        setActiveView(redirectTarget);
      } else {
        setActiveView({ type: "account" });
      }
    } catch (err: any) {
      console.error(err);
      setError("Google Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Join ILens Circle
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-neutral-950">Create an Account</h1>
          <p className="text-xs text-neutral-500">
            Enjoy complimentary eye exams, saved prescriptions, and VIP benefits.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alexander"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 pl-10 pr-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mercer"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 px-3.5 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Email Address</label>
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

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 pl-10 pr-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-neutral-700">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-3 pl-10 pr-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account & Claim 100 Pts"}
            <ArrowRight className="w-4 h-4 text-neutral-950" />
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Or</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Register with Google</span>
        </button>

        <div className="pt-2 text-center text-xs text-neutral-600">
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => setActiveView({ type: "login", redirectView: redirectTarget })}
            className="font-bold text-amber-600 hover:text-amber-700 underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
