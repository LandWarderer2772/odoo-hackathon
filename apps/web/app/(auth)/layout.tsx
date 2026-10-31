'use client'

import React from 'react'
import Link from 'next/link'
import { BrightLoopLogo } from '@/components/common/BrightLoopLogo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#050912] selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#2563eb]/25 via-[#06b6d4]/20 to-[#38bdf8]/20 blur-[140px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-[#8b5cf6]/20 via-[#6366f1]/20 to-[#0ea5e9]/20 blur-[130px]" />
      </div>

      {/* Brand Header */}
      <div className="mb-8">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <BrightLoopLogo variant="full" size="lg" showSubtitle={true} />
        </Link>
      </div>

      {/* Auth Container Card */}
      <div className="w-full max-w-md rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-cyan-400/30 p-8 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.9),0_0_35px_rgba(56,189,248,0.25)] relative">
        {children}
      </div>

      <div className="mt-8 text-center text-xs font-mono text-slate-500">
        Protected by BrightLoop Autonomous RBAC Security • SOC2 Certified
      </div>
    </div>
  )
}
