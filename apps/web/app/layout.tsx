import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'BrightLoop | Intelligent Financial Engine & Subscription OS',
  description: 'Enterprise-grade recurring billing engine, autonomous subscription lifecycle platform, and real-time financial intelligence telemetry.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/logo-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
            --font-display: 'Outfit', 'Plus Jakarta Sans', sans-serif;
            --font-mono: 'Space Grotesk', monospace, sans-serif;
          }
          body {
            font-family: var(--font-sans);
            background-color: #050912;
            color: #f1f5f9;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          .font-display { font-family: var(--font-display); }
          .font-tech { font-family: var(--font-mono); }
          @keyframes logo-shimmer {
            0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.45)); }
            50% { filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.8)) drop-shadow(0 0 35px rgba(29, 97, 231, 0.4)); }
          }
          .animate-logo-glow { animation: logo-shimmer 4s ease-in-out infinite; }
        `}} />
      </head>
      <body className="min-h-screen bg-[#050912] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}
