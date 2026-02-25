"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";
import { authApi } from "@/lib/api"
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setPendingEmail, setToken, setUser } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        const res = await authApi.login({
            email: form.email,
            password: form.password
        })
        const data = res.data

        if (data.payload) {
            // ← Trusted device, payload is JWT string
            setToken(data.payload.token)  // ← now correct
            setUser(data.payload.user)    // ← now correct
            toast.success("Welcome back!")
            router.push("/dashboard")
        } else {
            // ← No trusted device, OTP sent
            setPendingEmail(form.email)
            toast("OTP sent to your email", { icon: "📧" })
            router.push("/verify-otp")
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Login failed")
    } finally {
        setLoading(false)
    }
}

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Luminary account"
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-children">
        {/* Email */}
        <div>
          <label className="text-xs text-silver font-medium mb-1.5 block tracking-wide">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs text-silver font-medium tracking-wide">PASSWORD</label>
            <Link href="/forgot-password" className="text-xs text-aurora-light hover:text-aurora transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input pr-10"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-silver transition-colors"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Trusted device info */}
        <div className="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3ECFAA" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Trusted devices skip OTP on next login</span>
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Sign In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-ash" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-obsidian-2 text-mist text-xs">or continue with</span>
          </div>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={() => authApi.googleLogin()}
          className="w-full flex items-center justify-center gap-3 bg-obsidian-3 hover:bg-ash 
            border border-ash rounded-xl py-3 text-ghost text-sm font-medium transition-all duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-mist text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-aurora-light hover:text-aurora transition-colors font-medium">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
