"use client";
import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-aurora/5 blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-jade/4 blur-3xl pointer-events-none animate-float" style={{ animationDelay: "3s" }} />

      {/* Geometric lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/3 w-px h-full bg-gradient-to-b from-transparent via-aurora/30 to-transparent" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-jade/20 to-transparent" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <Link href="/">
            <div className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl animated-border p-px">
                <div className="w-full h-full rounded-xl bg-obsidian-2 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                      stroke="#7B5EA7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="font-display text-xl text-ghost font-medium tracking-wide">
                Luminary
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 aurora-glow animate-fade-up stagger-1">
          <div className="mb-6">
            <h1 className="font-display text-2xl text-ivory font-semibold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-mist text-sm mt-2 font-body">{subtitle}</p>
            )}
          </div>
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-mist text-xs mt-6 animate-fade-up stagger-3">
          Protected by 256-bit encryption · JWT secured
        </p>
      </div>
    </div>
  );
}
