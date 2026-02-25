"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthLayout from "@/components/AuthLayout";
import { authApi, getDeviceId } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter()
    const { pendingEmail, setPendingEmail, setToken, setUser } = useAuthStore()
    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""))
    const [trustDevice, setTrustDevice] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [countdown, setCountdown] = useState(300) // 5 min
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // ── Redirect if no pending email ─────────────────────
    useEffect(() => {
        if (!pendingEmail) router.replace("/login")
    }, [pendingEmail, router])

    // ── Countdown timer ──────────────────────────────────
    useEffect(() => {
        if (countdown <= 0) return
        const t = setInterval(() => setCountdown(c => c - 1), 1000)
        return () => clearInterval(t)
    }, [countdown])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, "0")}`
    }

    // ── Handle OTP input ─────────────────────────────────
    const handleInput = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        // Move to next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto submit when all filled
        if (value && newOtp.every(d => d) && index === OTP_LENGTH - 1) {
            handleVerify(newOtp.join(""))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const paste = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH)
        if (paste.length === OTP_LENGTH) {
            setOtp(paste.split(""))
            handleVerify(paste)
        }
    }

    // ── Verify OTP ───────────────────────────────────────
    const handleVerify = useCallback(async (code?: string) => {
    const otpCode = code || otp.join("")
    if (otpCode.length !== OTP_LENGTH) {
        toast.error("Please enter the complete OTP")
        return
    }

    setLoading(true)
    try {
        const res = await authApi.verifyOtp({
            email: pendingEmail!,
            otpCode: otpCode,
            trustDevice: trustDevice,
        })

        const { token, user } = res.data.payload

        // ← Save FIRST before redirect
        setToken(token)
        setUser(user)
        setPendingEmail(null)

        // ← Small delay to make sure state is saved
        await new Promise(resolve => setTimeout(resolve, 100))

        toast.success("Verified successfully!")
        router.push("/dashboard")

    } catch (err: any) {
        toast.error(err.response?.data?.message || "Invalid OTP")
        setOtp(Array(OTP_LENGTH).fill(""))
        inputRefs.current[0]?.focus()
    } finally {
        setLoading(false)
    }
}, [otp, pendingEmail, trustDevice, setToken, setUser, setPendingEmail, router])

    // ── Resend OTP ───────────────────────────────────────
    const handleResend = async () => {
        if (countdown > 0 && countdown < 290) return // allow resend after 10 sec

        setResending(true)
        try {
            // ← Actually call resend API
            await authApi.resendOtp({ email: pendingEmail! })
            toast.success("New OTP sent to your email 📧")
            setCountdown(300)
            setOtp(Array(OTP_LENGTH).fill(""))
            inputRefs.current[0]?.focus()
        } catch {
            toast.error("Failed to resend OTP")
        } finally {
            setResending(false)
        }
    }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={`We sent a 6-digit code to ${pendingEmail || "your email"}`}
    >
      <div className="space-y-6 animate-children">
        {/* OTP Inputs */}
        <div>
          <label className="text-xs text-silver font-medium mb-4 block tracking-wide text-center">
            ENTER VERIFICATION CODE
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="otp-input"
                style={{
                  borderColor: digit ? "rgba(123, 94, 167, 0.6)" : undefined,
                  boxShadow: digit ? "0 0 0 1px rgba(123, 94, 167, 0.2)" : undefined,
                }}
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-mist text-sm">
              Code expires in{" "}
              <span className={`font-mono font-medium ${countdown < 60 ? "text-crimson" : "text-aurora-light"}`}>
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <p className="text-crimson text-sm">Code has expired</p>
          )}
        </div>

        {/* Trust Device */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              className="sr-only"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
            />
            <div
              className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                ${trustDevice ? "bg-aurora border-aurora" : "bg-obsidian-3 border-ash group-hover:border-aurora/50"}`}
            >
              {trustDevice && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm text-ghost font-medium">Trust this device</span>
            <p className="text-xs text-mist mt-0.5">Skip OTP for the next 7 days on this device</p>
          </div>
        </label>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          className="btn-primary"
          disabled={loading || otp.join("").length !== OTP_LENGTH}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Verifying...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Verify Code
            </span>
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-mist text-sm">
            Didn&apos;t receive it?{" "}
            <button
              onClick={handleResend}
              disabled={resending || (countdown > 0 && countdown < 270)}
              className={`font-medium transition-colors ${
                resending || (countdown > 0 && countdown < 270)
                  ? "text-mist cursor-not-allowed"
                  : "text-aurora-light hover:text-aurora"
              }`}
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          </p>
        </div>

        {/* Back to login */}
        <button
          onClick={() => { setPendingEmail(null); router.push("/login"); }}
          className="w-full flex items-center justify-center gap-2 text-mist hover:text-silver text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to login
        </button>
      </div>
    </AuthLayout>
  );
}
