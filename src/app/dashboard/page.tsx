"use client";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { userApi } from "@/lib/api";

function StatCard({ label, value, icon, color }: { 
    label: string
    value: string
    icon: React.ReactNode
    color: string 
}) {
    return (
        <div className="glass rounded-2xl p-5 border border-ash/40 hover:border-aurora/20 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-mist text-xs font-medium tracking-wide mb-2">{label}</p>
                    <p className="text-ivory text-2xl font-display font-semibold">{value}</p>
                </div>
                <div className="p-2.5 rounded-xl" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <span style={{ color }}>{icon}</span>
                </div>
            </div>
        </div>
    )
}

function QuickAction({ href, label, description, icon }: { 
    href: string
    label: string
    description: string
    icon: React.ReactNode 
}) {
    return (
        <Link href={href}>
            <div className="glass rounded-xl p-4 border border-ash/40 hover:border-aurora/30 hover:bg-aurora/5 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-aurora/10 border border-aurora/20 flex items-center justify-center text-aurora-light group-hover:bg-aurora/20 transition-colors">
                        {icon}
                    </div>
                    <div>
                        <p className="text-ghost text-sm font-medium">{label}</p>
                        <p className="text-mist text-xs">{description}</p>
                    </div>
                    <svg className="ml-auto text-mist group-hover:text-aurora-light transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </div>
            </div>
        </Link>
    )
}

export default function DashboardPage() {
    const { user, token, setToken, setUser } = useAuthStore()
    const [hydrated, setHydrated] = useState(false)
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    const searchParams = useSearchParams()
    const router = useRouter()

    // ── Step 1: Wait for store to hydrate ────────────────
    useEffect(() => {
        setHydrated(true)
    }, [])

    // ── Step 2: Handle Google OAuth token from URL ────────
    useEffect(() => {
        const urlToken = searchParams.get("token")
        if (urlToken) {
            setToken(urlToken)
            userApi.getProfile()
                .then(res => setUser(res.data.payload))
                .catch(() => {})
            router.replace("/dashboard")
        }
    }, [searchParams])

    // ── Step 3: Auth check after hydration ───────────────
    useEffect(() => {
        if (!hydrated) return
        const urlToken = searchParams.get("token")
        if (!token && !urlToken) {
            router.push("/login")
        }
    }, [hydrated, token])

    // ── Step 4: Fetch user if missing ────────────────────
    useEffect(() => {
        if (!token || user) return
        userApi.getProfile()
            .then(res => setUser(res.data.payload))
            .catch(() => router.push("/login"))
    }, [token])

    // ── Loading state ─────────────────────────────────────
    if (!hydrated || !token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
            {/* Header */}
            <div>
                <h1 className="font-display text-3xl text-ivory font-semibold">
                    {greeting},{" "}
                    <span className="text-aurora-light">
                        {user?.name || "there"}
                    </span>
                </h1>
                <p className="text-mist mt-1">
                    Here&apos;s what&apos;s happening with your account
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    label="STATUS"
                    value="Active"
                    color="#3ECFAA"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                />
                <StatCard
                    label="AUTH METHOD"
                    value="JWT"
                    color="#7B5EA7"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                />
                <StatCard
                    label="2FA"
                    value="Email OTP"
                    color="#F0A050"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                />
                <StatCard
                    label="ROLE"
                    value={user?.role || "User"}
                    color="#E05C5C"
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                />
            </div>

            {/* Security status */}
            <div className="glass rounded-2xl p-6 border border-jade/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full bg-jade animate-pulse" />
                    <h2 className="text-ghost font-medium">Security Status</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { label: "Password Protected", ok: true },
                        { label: "Email Verified", ok: true },
                        { label: "Two-Factor Auth", ok: true },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-2.5 bg-obsidian-3 rounded-xl p-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.ok ? "bg-jade/20" : "bg-crimson/20"}`}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={item.ok ? "#3ECFAA" : "#E05C5C"} strokeWidth="3">
                                    {item.ok
                                        ? <polyline points="20 6 9 17 4 12"/>
                                        : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                                    }
                                </svg>
                            </div>
                            <span className="text-sm text-ghost">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick actions */}
            <div>
                <h2 className="text-ghost font-medium mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <QuickAction
                        href="/dashboard/profile"
                        label="Edit Profile"
                        description="Update your username or email"
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
                    />
                    <QuickAction
                        href="/dashboard/notifications"
                        label="Push Notifications"
                        description="Subscribe & send notifications"
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
                    />
                    <QuickAction
                        href="/dashboard/users"
                        label="Manage Users"
                        description="View and manage all users"
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                    />
                    <QuickAction
                        href="/login"
                        label="Security Settings"
                        description="Manage trusted devices & sessions"
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                    />
                </div>
            </div>
        </div>
    )
}