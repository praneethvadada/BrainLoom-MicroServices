"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";

type Step = "email" | "otp";

export default function SuperAdminForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep]               = useState<Step>("email");
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [notice, setNotice]           = useState("");

  const handleSendOTP = async () => {
    if (!email) { setError("Enter your admin email."); return; }
    setLoading(true); setError("");
    try {
      await authService.forgotPassword(email);
      setStep("otp");
      setNotice("OTP sent — check your inbox. It expires in 10 minutes.");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!otp || !newPassword || !confirm) { setError("All fields required."); return; }
    if (newPassword !== confirm) { setError("Passwords don't match."); return; }
    if (newPassword.length < 8)  { setError("Minimum 8 characters."); return; }
    setLoading(true); setError(""); setNotice("");
    try {
      await authService.resetPassword(email, otp, newPassword);
      setNotice("Password reset! Redirecting to login…");
      setTimeout(() => router.push("/superadmin/login"), 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-600/30 text-xl">
              🔑
            </div>
            <div className="text-center">
              <h1 className="text-xl font-black text-white">Reset Super Admin Password</h1>
              <p className="text-violet-400 text-xs mt-0.5">
                {step === "email" ? "Enter your email to receive an OTP" : `OTP sent to ${email}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          {notice && (
            <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{notice}</div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {step === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  placeholder="superadmin@brainloom.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">One-Time Password</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-center tracking-[0.5em] text-xl font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-sm"
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
              <button
                onClick={() => { setStep("email"); setError(""); setNotice(""); setOtp(""); }}
                className="w-full text-white/30 hover:text-white/60 text-sm py-2 transition"
              >
                ← Use a different email
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-5">
          <Link href="/superadmin/login" className="text-violet-400 hover:text-violet-300 text-sm transition">
            ← Back to Super Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}
