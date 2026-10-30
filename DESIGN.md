---
name: Aether Banking
colors:
  surface: '#f5fafe'
  surface-dim: '#d5dbdf'
  surface-bright: '#f5fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4f8'
  surface-container: '#e9eef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dee3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#424654'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#ecf1f5'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0054d7'
  primary: '#0049be'
  on-primary: '#ffffff'
  primary-container: '#1d61e7'
  on-primary-container: '#e8ebff'
  inverse-primary: '#b3c5ff'
  secondary: '#4c5b98'
  on-secondary: '#ffffff'
  secondary-container: '#acbbff'
  on-secondary-container: '#3a4985'
  tertiary: '#005881'
  on-tertiary: '#ffffff'
  tertiary-container: '#0071a5'
  on-tertiary-container: '#ddeeff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#00184a'
  on-primary-fixed-variant: '#003fa5'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#011551'
  on-secondary-fixed-variant: '#33437e'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#8ccdff'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#004b70'
  background: '#f5fafe'
  on-background: '#171c1f'
  surface-variant: '#dee3e7'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2rem
  space-xl: 3.5rem
---

## Brand & Style

This design system crafts an ethereal, hyper-modern fintech atmosphere defined by frictionless calm, security, and effortless precision. It targets digitally native consumers, remote professionals, and forward-thinking wealth builders who demand high financial agency paired with serene clarity. 

The aesthetic merges **Glassmorphism** with subtle **Soft Neumorphic Depth**:
- Translucent, frosted panels layered atop soft sky-blue gradients.
- Ultra-soft ambient shadows that create luminous, floating components rather than harsh cuts.
- Deep navy grounding blocks (`#0B1E59`) anchored against airy, luminous canvases (`#F4F9FD`, `#E6F3FD`) to convey both institutional dependability and modern weightlessness.
- Tactile, fluid micro-interactions with rounded pill structures, delicate glowing highlights, and organic vector wave graphics symbolizing financial growth.

## Colors

The palette establishes an immediate sensation of liquid serenity balanced with banking-grade authority:

- **Primary (`#1D61E7`)**: Vivid Royal Blue. Used for principal calls to action, active financial metrics, graph trendlines, and focal interactive elements.
- **Secondary (`#0B1E59`)**: Midnight Obsidian Navy. Provides high-contrast anchor sections (bottom sheets, primary navigation bars, transaction summary drawers, and dark contrast mode cards).
- **Tertiary (`#38B6FF`)**: Vibrant Sky Cyan. Powers high-energy accents, live transaction pulses, positive trajectory indicators, and ambient back-glows.
- **Neutral Canvas (`#F4F9FD` & `#E6F3FD`)**: Frosted Ice White and Pale Ether Mist. Forms the soft base layer and frosted glass backgrounds across surfaces.
- **Functional Semantics**:
  - Positive/Income: `#10B981` (Emerald), complemented by `#38B6FF` for upward chart flow.
  - Caution/Expense: `#FF5B79` (Electric Rose) for debits and budget threshold warnings.
  - Surface Glass Border: `rgba(255, 255, 255, 0.65)` layered with subtle inner light rims.

## Typography

The typography leverages **Plus Jakarta Sans** across all roles to achieve geometric clarity, high numeric readability, and friendly, humanist proportions.

- **Numerics & Ledger Values**: Financial figures render with tabular figures (`tnum`) enabled, emphasizing clean alignment in activity trackers, account balances, and percentage fluctuations.
- **Headlines**: Weighted at Bold (700) or SemiBold (600) with slight negative tracking to produce tight, confident headlines against expansive frosted canvases.
- **Micro-labels**: Capitalized or weighted labels (`label-md`, `label-sm`) deliver immediate visual scanning for transaction categories, date badges, and payment statuses.

## Layout & Spacing

The layout is built on a responsive 12-column grid for desktop marketing surfaces (max container width: 1280px) transitioning to a fluid 4-column layout on mobile devices.

- **Rhythm & Breathing Room**: Content cards and mock mobile device containers float with generous interior margins (`margin: 3rem` on desktop, `margin-mobile: 1.25rem` on mobile screens), echoing the unhurried elegance of private banking dashboards.
- **Docked Sheets**: Mobile mockups and dashboard components utilize docked container trays (e.g., bottom transaction drawers) elevated by distinct vertical spacing offsets.
- **Component Clustering**: Related action items (transfer, send, bill pay) align within tight grid clusters using `space-sm` (12px) to maintain cohesive tactile button groups.

## Elevation & Depth

Elevation merges translucent glass with ambient luminescence, avoiding muddy drop shadows:

- **Level 1 (Subtle Canvas Depth)**: `box-shadow: 0 10px 30px -10px rgba(11, 30, 89, 0.05);` with background `backdrop-filter: blur(12px); background: rgba(244, 249, 253, 0.7);` and border `1px solid rgba(255, 255, 255, 0.8)`.
- **Level 2 (Floating Pill & Action Cards)**: `box-shadow: 0 20px 40px -15px rgba(29, 97, 231, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;`.
- **Level 3 (Interactive Primary / Focus Float)**: `box-shadow: 0 24px 48px -12px rgba(29, 97, 231, 0.25), 0 4px 12px rgba(56, 182, 255, 0.2);`.
- **Level Deep (Grounding Dark Cards & Drawers)**: `#0B1E59` background paired with `box-shadow: 0 24px 60px -12px rgba(11, 30, 89, 0.4);` and a top ambient inner border of `1px solid rgba(255, 255, 255, 0.1)`.
- **Glass Highlights**: Surfaces feature a linear gradient sheen (`linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 100%)`).

## Shapes

The shape profile is **Pill-shaped (Level 3)**, prioritizing smooth, continuous curves that evoke physical pebbles and touch-friendly biometric hardware:

- **Primary Cards**: Sculpted with large radii (24px to 32px), creating pebble-like frames.
- **Interactive Action Badges**: Rounded pills (9999px) for chips, dropdown pills, and action toggles.
- **Action Buttons & Inputs**: Highly rounded pill contours (48px to 56px height with fully circular end caps or 24px corner radii).
- **Curved Data Visualizations**: Fluid SVG paths with bezier easing for expense trends and growth curves, avoiding harsh angles.

## Components

### Buttons
- **Primary Action**: Pill-shaped container (`border-radius: 9999px`), background gradient `linear-gradient(135deg, #38B6FF 0%, #1D61E7 100%)`, text in pure white. Elevated with a soft sky-blue glow shadow (`rgba(29, 97, 231, 0.25)`).
- **Secondary (Neumorphic Glass)**: Semi-transparent white background (`rgba(255, 255, 255, 0.75)`), border `1px solid rgba(255, 255, 255, 0.9)`, text `#0B1E59`.
- **Icon Quick-Actions**: Rounded square or circular buttons (`border-radius: 20px` to `50%`), navy background `#0B1E59` with crisp white or sky blue pictograms.

### Cards & Payment Slates
- **Debit / Credit Card Modules**: Curved rectangles (`border-radius: 24px`) with dynamic overlays—either a royal gradient (`#1D61E7` to `#38B6FF`) or deep navy glass, layered with translucent concentric circular wireframe vector graphics.
- **Metric & Expense Cards**: Pill-like rounded cards featuring an embedded mini line graph, transaction delta label, and icon pill on the left.

### Transaction Lists
- **Rows**: Separated by subtle frosted spacing or elevated individually in soft floating tiles.
- **Category Icons**: Enclosed within 44px circular or soft squircle badges with vibrant cyan/blue backgrounds.
- **Typography Layout**: Merchant title bolded (`title-md`), transaction timestamp secondary (`body-sm`), amounts right-aligned with bold clarity (`-$40.30` or `+$4,300`).

### Interactive Chips & Toggles
- **Segmented Time Filters (Month / Week)**: Contained inside deep navy or frosted pill selectors with mini chevron indicator icons.
- **Status Chips**: Micro pills with subtle alpha backgrounds (e.g., `rgba(56, 182, 255, 0.15)`) and bold text in corresponding primary colors.

### Input Fields
- Floating pill-style containers with `backdrop-filter: blur(8px)`, white semi-transparent fills, soft inset light borders, and deep navy text placeholders that shift smoothly to `#1D61E7` upon focus.