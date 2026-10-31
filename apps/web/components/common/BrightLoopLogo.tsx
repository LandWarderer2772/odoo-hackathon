'use client'

import React from 'react'

export interface BrightLoopLogoProps {
  variant?: 'full' | 'icon' | 'badge' | '3d'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle?: boolean
  className?: string
}

export const BrightLoopLogo: React.FC<BrightLoopLogoProps> = ({
  variant = 'full',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  // Dimension mappings
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  const subSizes = {
    sm: 'text-[8px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
    xl: 'text-[12px]',
  }

  if (variant === '3d') {
    return (
      <div className={`relative inline-flex items-center gap-3 select-none ${className}`}>
        <div className={`relative ${iconSizes[size]} rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(56,189,248,0.4)] border border-cyan-400/30 ring-1 ring-cyan-400/20`}>
          <img
            src="/brightloop-logo-3d.png"
            alt="BrightLoop 3D Emblem"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white leading-none ${textSizes[size]}`} style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}>
              Bright<span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Loop</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
              OS
            </span>
          </div>
          {showSubtitle && (
            <span className={`${subSizes[size]} font-mono uppercase tracking-[0.16em] text-slate-400 font-semibold mt-0.5`}>
              Subscription Engine
            </span>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'icon') {
    return (
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-400/35 shadow-[0_0_25px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all duration-300 group select-none ${className}`}>
        <svg
          className="w-3/4 h-3/4 group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bl-c-pri" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00F0FF" />
              <stop offset="45%" stop-color="#38BDF8" />
              <stop offset="100%" stop-color="#1D61E7" />
            </linearGradient>
            <linearGradient id="bl-c-sec" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="50%" stop-color="#2563EB" />
              <stop offset="100%" stop-color="#0B1E59" />
            </linearGradient>
            <linearGradient id="bl-c-sheen" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
              <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 32 32 C 18 32 10 40 10 50 C 10 60 18 68 32 68 C 42 68 49 61 56 50 C 63 39 70 32 80 32 C 90 32 96 40 96 50 C 96 60 88 68 76 68 C 66 68 59 61 52 50 C 45 39 39 32 32 32 Z"
            stroke="url(#bl-c-sec)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 28 65 C 38 65 46 58 53 49 C 61 38 69 32 80 32 C 91 32 96 40 96 50 C 96 60 88 68 76 68"
            stroke="url(#bl-c-pri)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 29 34 C 19 34 13 41 13 50 C 13 58 19 65 29 65 C 38 65 45 59 52 49 C 59 39 67 34 77 34 C 87 34 93 41 93 50"
            stroke="url(#bl-c-sheen)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
          <circle cx="78" cy="34" r="1.5" fill="#00F0FF" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`relative inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Dynamic Luminous Mobius Infinity Loop Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-400/35 shadow-[0_0_25px_rgba(56,189,248,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:border-cyan-300 group-hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] transition-all duration-300`}>
        <svg
          className="w-3/4 h-3/4 drop-shadow-[0_0_10px_rgba(0,240,255,0.45)] group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bl-main-pri" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00F0FF" />
              <stop offset="45%" stop-color="#38BDF8" />
              <stop offset="100%" stop-color="#1D61E7" />
            </linearGradient>
            <linearGradient id="bl-main-sec" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="50%" stop-color="#2563EB" />
              <stop offset="100%" stop-color="#0B1E59" />
            </linearGradient>
            <linearGradient id="bl-main-sheen" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
              <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 32 32 C 18 32 10 40 10 50 C 10 60 18 68 32 68 C 42 68 49 61 56 50 C 63 39 70 32 80 32 C 90 32 96 40 96 50 C 96 60 88 68 76 68 C 66 68 59 61 52 50 C 45 39 39 32 32 32 Z"
            stroke="url(#bl-main-sec)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 28 65 C 38 65 46 58 53 49 C 61 38 69 32 80 32 C 91 32 96 40 96 50 C 96 60 88 68 76 68"
            stroke="url(#bl-main-pri)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 29 34 C 19 34 13 41 13 50 C 13 58 19 65 29 65 C 38 65 45 59 52 49 C 59 39 67 34 77 34 C 87 34 93 41 93 50"
            stroke="url(#bl-main-sheen)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
          <circle cx="78" cy="34" r="1.5" fill="#00F0FF" />
        </svg>
      </div>

      {/* Typography: Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight text-white leading-none ${textSizes[size]}`}
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Bright<span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">Loop</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
            OS
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${subSizes[size]} font-mono uppercase tracking-[0.16em] text-slate-400 font-semibold mt-0.5`}
          >
            Subscription Engine
          </span>
        )}
      </div>
    </div>
  )
}
