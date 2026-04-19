"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";

type Step = "email" | "otp";

export default function CyberAdminForgotPasswordPage() {
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
      setNotice("OTP transmitted — check your inbox. Expires in 10 minutes.");
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
      setNotice("Password updated. Redirecting to login…");
      setTimeout(() => router.push("/cyber/admin/login"), 2000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#010f08] flex items-center justify-center p-4 font-mono">
      {/* Terminal grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-3"
        style={{ backgroundImage: "linear-gradient(#0f0,transparent 1px),linear-gradient(90deg,#0f0,transparent 1px)", backgroundSize: "40px 40px" }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-green-600/20 border border-green-500/30 flex items-center justify-center shadow-xl shadow-green-500/20 text-xl">
              🔑
            </div>
            <div className="text-center">
              <h1 className="text-xl font-black text-green-300">Password Reset</h1>
              <p className="text-green-700 text-xs mt-0.5">
                {step === "email" ? "// enter_registered_email" : `// otp_sent_to: ${email}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-green-500/20 rounded-3xl p-8 shadow-2xl">
          {notice && (
            <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">{notice}</div>
          )}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-mono">[ERROR] {error}</div>
          )}

          {step === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">--email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                  placeholder="admin@ciphercampus.com"
                  className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition text-sm font-mono"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 disabled:opacity-50 text-green-300 font-bold py-3 rounded-xl transition font-mono"
              >
                {loading ? "[ SENDING... ]" : "[ SEND OTP ]"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">--otp</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition text-center tracking-[0.5em] text-xl font-bold font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">--new-password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">--confirm-password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 transition text-sm font-mono"
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 disabled:opacity-50 text-green-300 font-bold py-3 rounded-xl transition font-mono"
              >
                {loading ? "[ UPDATING... ]" : "[ EXECUTE RESET ]"}
              </button>
              <button
                onClick={() => { setStep("email"); setError(""); setNotice(""); setOtp(""); }}
                className="w-full text-green-900 hover:text-green-600 text-sm py-2 transition font-mono"
              >
                ← use_different_email()
              </button>
            </div>
          )}
        </div>

        <p className="text-center mt-5">
          <Link href="/cyber/admin/login" className="text-green-700 hover:text-green-500 text-xs transition font-mono">
            ← back_to_login()
          </Link>
        </p>
      </div>
    </div>
  );
}
