"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";

export default function ForgotPasswordPage() {
  const router  = useRouter();
  const [step, setStep]           = useState<"email" | "otp">("email");
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  const handleSendOTP = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true); setError("");
    try {
      await authService.forgotPassword(email);
      setStep("otp");
      setSuccess("OTP sent! Check your email.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!otp || !newPassword || !confirm) { setError("All fields are required"); return; }
    if (newPassword !== confirm) { setError("Passwords don't match"); return; }
    if (newPassword.length < 8)  { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      await authService.resetPassword(email, otp, newPassword);
      setSuccess("Password reset! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30">
            <span className="text-2xl font-black text-white">B</span>
          </div>
          <h1 className="text-3xl font-black text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">
            {step === "email" ? "We'll send an OTP to your admin email" : `OTP sent to ${email}`}
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-3xl p-8 shadow-2xl">

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">{success}</div>
          )}

          {step === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brainloom.com"
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">One-Time Password</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-center tracking-widest text-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                onClick={() => { setStep("email"); setError(""); setSuccess(""); }}
                className="w-full text-slate-400 hover:text-slate-300 text-sm py-2 transition"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 text-sm transition">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
