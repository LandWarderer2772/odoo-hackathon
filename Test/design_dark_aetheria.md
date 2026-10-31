---
name: Aetheria Hyper-Modern Fintech
colors:
  surface: '#0e1320'
  surface-dim: '#0e1320'
  surface-bright: '#343948'
  surface-container-lowest: '#080e1b'
  surface-container-low: '#161b29'
  surface-container: '#1a1f2d'
  surface-container-high: '#242a38'
  surface-container-highest: '#2f3443'
  on-surface: '#dde2f5'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dde2f5'
  inverse-on-surface: '#2b303f'
  outline: '#88929c'
  outline-variant: '#3e4850'
  surface-tint: '#8ccdff'
  primary: '#90cfff'
  on-primary: '#00344f'
  primary-container: '#38b6ff'
  on-primary-container: '#004566'
  inverse-primary: '#006493'
  secondary: '#b3c5ff'
  on-secondary: '#002a76'
  secondary-container: '#0056dc'
  on-secondary-container: '#d2dbff'
  tertiary: '#50dfa4'
  on-tertiary: '#003824'
  tertiary-container: '#28c38a'
  on-tertiary-container: '#004a31'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cae6ff'
  primary-fixed-dim: '#8ccdff'
  on-primary-fixed: '#001e30'
  on-primary-fixed-variant: '#004b70'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b3c5ff'
  on-secondary-fixed: '#00184a'
  on-secondary-fixed-variant: '#003fa5'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0e1320'
  on-background: '#dde2f5'
  surface-variant: '#2f3443'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system embodies a forward-looking, institutional-grade financial universe defined by deep atmospheric depth, hyper-modern precision, and ethereal optical luminescence. Designed for sophisticated digital asset management, algorithmic trading, and modern wealth architecture, the interface invokes total command, clarity, and uncompromising security.

The aesthetic fuses translucent dark glassmorphism with high-fidelity telemetry. Visual structures emerge from midnight obsidian and cosmic navy voids, suspended behind delicate frosted boundaries that capture ambient chromatic glow. Key metrics and actionable controls project light outward through luminous neon cyan and electric royal blue radiance, offset by crisp pale-ice typographic rendering. The resulting environment is calm, razor-sharp, and cinematic.

## Colors
The palette is built upon deep spatial contrast, layering infinite dark surfaces with high-energy spectral emitters:

- **Surface & Canvas Architecture:**
  - Base Void: `#060B18` (Primary background, deep midnight obsidian)
  - Surface Mid: `#0B132B` (Layered canvas sections, recessed panels)
  - Surface Glass: `#0F172A` (Floating panel fills, tokenized at variable alpha channels between 0.45 and 0.70)
  
- **Spectral Energy & Interaction:**
  - Primary Cyan (`#38B6FF`): Primary interactive drivers, active states, key focus rings, and high-frequency real-time telemetry tickers.
  - Secondary Royal (`#1D61E7` & `#3B82F6`): Structural anchors, linear gradient endpoints, selected states, and volumetric atmospheric backdrop blooms.
  - Positive Yield Emerald (`#10B981`): Alpha gains, positive equity differentials, confirmed execution states.
  - Critical Crimson (`#F43F5E`): Liquidation risks, negative margins, error disclosures.

- **Ice Monochromes:**
  - Text Primary: `#F8FAFC` (Pure frost white for maximum optical contrast)
  - Text Secondary: `#94A3B8` (Cool muted slate for structural labels and subtext)
  - Glass Borders: `rgba(255, 255, 255, 0.08)` for dormant cards; `rgba(56, 182, 255, 0.25)` for energized cards.

## Typography
Plus Jakarta Sans serves as the single typographic voice across all roles. Its geometric construction, clean terminals, and contemporary proportions reinforce high-density financial legibility while sustaining an approachable, modern technological voice.

All numbers in telemetry tables, balance sheets, and transaction streams must utilize tabular figures (`font-variant-numeric: tabular-nums`) to prevent layout shifting during price ticks. Large balances and primary values prioritize heavy weights (`700` and `600`) with tight letter spacing, driving an assertive, crystalline presence. Micro metadata and telemetry markers deploy uppercase tracking with increased spacing for effortless readability against dark backgrounds.

## Layout & Spacing
The layout follows a fluid 12-column architectural grid on desktop devices, scaling into an 8-column layout across tablets, and collapsing to a 4-column stack on mobile viewports.

- **Breakpoints:**
  - Mobile: `< 768px` (Margin: 1rem, Gutter: 0.75rem)
  - Tablet: `768px - 1024px` (Margin: 1.5rem, Gutter: 1rem)
  - Desktop: `> 1024px` (Margin: 2rem, Gutter: 1.5rem; Max container constraint: `1440px`)

Spatial rhythm is governed by multiples of `0.25rem` (4px baseline). Cards containing high-density transaction rows utilize compact internal padding (`space-md`), whereas overview stat panels and visual ledger modules employ expansive breathing room (`space-lg` to `space-xl`) to preserve visual tranquility amidst data complexity.

## Elevation & Depth
Elevation is constructed via multi-layered optical refraction and atmospheric luminescence rather than traditional opaque drop shadows:

- **Level 0 (Abyssal Floor):** Pure `#060B18` canvas, hosting subtle radial atmospheric blurs (`filter: blur(120px)`) of `#1D61E7` at 12% opacity to suggest celestial depth.
- **Level 1 (Submerged Containers):** Solid `#0B132B` panels paired with single-pixel perimeter strokes: `1px solid rgba(255, 255, 255, 0.04)`.
- **Level 2 (Glassmorphic Cards):** `background: rgba(15, 23, 42, 0.65)`, treated with `backdrop-filter: blur(20px) saturate(180%)`. Border: `1px solid rgba(255, 255, 255, 0.08)`. Inner highlight: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)`. Shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.45)`.
- **Level 3 (Interactive Floating Modals & Tooltips):** `background: rgba(15, 23, 42, 0.85)`, `backdrop-filter: blur(28px)`. Border: `1px solid rgba(56, 182, 255, 0.25)`. Exterior radiance: `0 0 24px -4px rgba(56, 182, 255, 0.2), 0 16px 40px rgba(0, 0, 0, 0.7)`.

## Shapes
The design system embraces an aerodynamic, pill-dominant silhouette language. Core interactive controls—such as primary triggers, search bars, filter chips, and live transaction pills—employ full continuous capsule rounding (`9999px`). 

Structural glass panels, data tiles, and modal views utilize softer pill curvatures (`rounded-xl` / 1.5rem to 2rem), balancing fluid contours with structural space efficiency. This tension between fluid capsule triggers and structured glass containers establishes an organic, modern interface rhythm.

## Components

- **Buttons:**
  - *Primary:* Continuous pill geometry. Filled with an angled gradient from `#38B6FF` to `#1D61E7`. Text in pure white (`#FFFFFF`, weight `600`). Glow shadow: `0 0 20px rgba(56, 182, 255, 0.35)`. Hover state expands radiant diffusion to `28px` with a subtle `1.02x` scale transform.
  - *Secondary Glass:* Pill silhouette with `rgba(255, 255, 255, 0.04)` fill, `1px solid rgba(255, 255, 255, 0.12)` border, and a pale-ice text label. Hover shifts border color to `rgba(56, 182, 255, 0.5)` with an interior illumination of `inset 0 0 12px rgba(56, 182, 255, 0.1)`.

- **Chips & Metric Badges:**
  - Fully rounded pill contours (`9999px`). Height: 24px to 28px. 
  - *Positive Alpha:* `rgba(16, 185, 129, 0.12)` fill with `1px solid rgba(16, 185, 129, 0.3)` border and text in `#10B981`.
  - *Telemetry Pill:* Transparent glass base, tiny pulsing indicator dot (6px), with tabular numerical metrics rendered in `#F8FAFC`.

- **Input Fields:**
  - Pill-shaped field geometry (`height: 48px`, padding `0 1.25rem`). Fill: `rgba(11, 19, 43, 0.7)`. Border: `1px solid rgba(255, 255, 255, 0.08)`.
  - *Focus State:* Border transitions to `#38B6FF` with an exterior aura: `box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.2)`. Placeholder rendered in `#64748B`.

- **Cards & Data Modules:**
  - Surface glass composition (`rgba(15, 23, 42, 0.6)`) layered over a `20px` backdrop-blur. 
  - Outer hairline boundary: `rgba(255, 255, 255, 0.08)`. Top edge illuminated with a `1px` high-contrast frosted edge line (`rgba(255, 255, 255, 0.15)` fading to transparent).

- **Checkboxes & Radios:**
  - Radios: Circular double-ring containing a glowing `#38B6FF` orb when active.
  - Checkboxes: Curvature of `6px` on an obsidian backdrop. Check state triggers an energetic cyan gradient fill with a crisp dark inset check icon.

- **Data Tables & Ledger Lists:**
  - Borderless horizontal rows separated by hairline separators (`rgba(255, 255, 255, 0.04)`). Row hover yields a full-capsule frosted highlight (`rgba(56, 182, 255, 0.04)`) across the hovered entry. All currency readouts render strictly with `tabular-nums`.