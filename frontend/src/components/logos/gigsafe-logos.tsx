/**
 * GigSafe Logo Variations — 10 concepts
 *
 * All use currentColor (monochrome, dark/light theme compatible).
 * All use 32×32 viewBox for consistency and small-size clarity.
 *
 *  1. ShieldSignal   — shield + 3 upward signal arcs           (used in header)
 *  2. RainChart      — raindrop silhouette + bar chart inside
 *  3. CoverageRings  — center dot + 3 dashed concentric rings
 *  4. SignalTower    — antenna mast + arcs + rain dots
 *  5. PulseLine      — ECG heartbeat trace
 *  6. DomeGuard      — protective arc dome over worker dot
 *  7. HexSignal      — flat-top hexagon + 3 signal bars
 *  8. NodeNetwork    — 4 connected diamond nodes + orbit ring
 *  9. RiskMatrix     — 3×3 dot heat-map (low→high opacity)
 * 10. GSMark         — "GS" lettermark inside a circle
 */

import type React from "react"
import { cn } from "@/lib/utils"

type LogoProps = {
  size?: number
  className?: string
}

// ─── 1. Shield Signal ────────────────────────────────────────────────────────
// Heraldic shield outline with three nested upward signal arcs and a center
// source dot. The most direct union of "insurance" and "predictive data."
// ★ Currently used in the site header.
export function LogoShieldSignal({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Shield */}
      <path
        d="M16 3C10 3.5 4 7 4 14.5C4 21 9 26.5 16 30C23 26.5 28 21 28 14.5C28 7 22 3.5 16 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Signal arcs — upper semicircles centered at (16,20) */}
      <path d="M13.5 20 A2.5 2.5 0 0 0 18.5 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 20 A5 5 0 0 0 21 20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 20 A7 7 0 0 0 23 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Source dot */}
      <circle cx="16" cy="20" r="1.5" fill="currentColor" />
    </svg>
  )
}

// ─── 2. Rain Chart ───────────────────────────────────────────────────────────
// A raindrop silhouette containing 3 ascending bar-chart columns clipped inside.
// Concept: weather event → analytics data → protection decision.
export function LogoRainChart({ size = 32, className }: LogoProps) {
  const id = `rcc-${size}`
  const drop = "M16 2C13 5 7 12 7 19C7 25.5 11 31 16 31C21 31 25 25.5 25 19C25 12 19 5 16 2Z"
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <defs>
        <clipPath id={id}>
          <path d={drop} />
        </clipPath>
      </defs>
      {/* Raindrop outline */}
      <path d={drop} stroke="currentColor" strokeWidth="1.5" />
      {/* Bar chart inside — clipped to drop shape */}
      <g clipPath={`url(#${id})`} fill="currentColor">
        <rect x="10" y="24" width="3" height="5" rx="0.8" opacity="0.65" />
        <rect x="14.5" y="20.5" width="3" height="8.5" rx="0.8" opacity="0.82" />
        <rect x="19" y="16.5" width="3" height="12.5" rx="0.8" />
      </g>
    </svg>
  )
}

// ─── 3. Coverage Rings ───────────────────────────────────────────────────────
// A center dot radiating 3 dashed concentric rings outward.
// Like a GPS coverage map or radar sweep — "How wide is your protection?"
export function LogoCoverageRings({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <circle cx="16" cy="16" r="6.5"  stroke="currentColor" strokeWidth="1.5" strokeDasharray="3.5 1.8" />
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2.8 2.2" />
      <circle cx="16" cy="16" r="14"   stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2.5" />
    </svg>
  )
}

// ─── 4. Signal Tower ─────────────────────────────────────────────────────────
// An antenna mast with 3 upward broadcast arcs and 3 falling rain dots below.
// A weather monitoring station broadcasting coverage — data collection in motion.
export function LogoSignalTower({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Mast */}
      <line x1="16" y1="17" x2="16" y2="25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Base */}
      <line x1="12" y1="25" x2="20" y2="25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Broadcast arcs — upper semicircles from mast tip (16,17) */}
      <path d="M13.5 17 A2.5 2.5 0 0 0 18.5 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 17 A5 5 0 0 0 21 17"         stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8.5 17 A7.5 7.5 0 0 0 23.5 17"  stroke="currentColor" strokeWidth="1"   strokeLinecap="round" />
      {/* Rain dots falling below base */}
      <circle cx="11.5" cy="27.5" r="0.9" fill="currentColor" opacity="0.65" />
      <circle cx="16"   cy="28.5" r="0.9" fill="currentColor" opacity="0.65" />
      <circle cx="20.5" cy="27.5" r="0.9" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

// ─── 5. Pulse Line ───────────────────────────────────────────────────────────
// An ECG vital-signs trace spanning the full mark width.
// Monitoring the financial health of gig workers — income as a live vital signal.
export function LogoPulseLine({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <path
        d="M2 17 L7 17 L9 12 L11 22 L13 5 L15 22 L17 14 L19 17 L30 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── 6. Dome Guard ───────────────────────────────────────────────────────────
// Two nested protective arc domes arching over a worker dot on a ground horizon.
// The clearest single metaphor for "you are covered" — shelter in the storm.
export function LogoDomeGuard({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Ground */}
      <line x1="4" y1="25" x2="28" y2="25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.35" />
      {/* Outer dome — upper semicircle arc (sweep=0 → counterclockwise → upward) */}
      <path d="M6 25 A10 10 0 0 0 26 25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Inner dome */}
      <path d="M10 25 A6 6 0 0 0 22 25"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Worker dot */}
      <circle cx="16" cy="25" r="2" fill="currentColor" />
    </svg>
  )
}

// ─── 7. Hex Signal ───────────────────────────────────────────────────────────
// Flat-top hexagon outline with 3 ascending bar-chart bars inside.
// A professional credentialing badge — fintech meets data signal.
export function LogoHexSignal({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Flat-top hexagon (r≈12, 6 corners at 0°,60°,120°,180°,240°,300°) */}
      <path
        d="M28 16 L22 6 L10 6 L4 16 L10 26 L22 26 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Signal bars */}
      <rect x="10.5" y="20" width="3" height="4"  rx="0.8" fill="currentColor" opacity="0.5"  />
      <rect x="14.5" y="17" width="3" height="7"  rx="0.8" fill="currentColor" opacity="0.75" />
      <rect x="18.5" y="13" width="3" height="11" rx="0.8" fill="currentColor" />
    </svg>
  )
}

// ─── 8. Node Network ─────────────────────────────────────────────────────────
// Four interconnected diamond nodes inside a circular orbit ring.
// The AI risk-prediction engine — every sensor is a node in the network.
export function LogoNodeNetwork({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Orbit ring */}
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* Connection lines */}
      <line x1="16" y1="8"  x2="9"  y2="16" stroke="currentColor" strokeWidth="1"   opacity="0.4" />
      <line x1="16" y1="8"  x2="23" y2="16" stroke="currentColor" strokeWidth="1"   opacity="0.4" />
      <line x1="9"  y1="16" x2="16" y2="24" stroke="currentColor" strokeWidth="1"   opacity="0.4" />
      <line x1="23" y1="16" x2="16" y2="24" stroke="currentColor" strokeWidth="1"   opacity="0.4" />
      <line x1="9"  y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="1"   opacity="0.4" />
      {/* Nodes */}
      <circle cx="16" cy="8"  r="2.5" fill="currentColor" />
      <circle cx="9"  cy="16" r="2.5" fill="currentColor" />
      <circle cx="23" cy="16" r="2.5" fill="currentColor" />
      <circle cx="16" cy="24" r="2.5" fill="currentColor" />
    </svg>
  )
}

// ─── 9. Risk Matrix ──────────────────────────────────────────────────────────
// A 3×3 dot grid with opacity-based heat mapping (low→high opacity = low→high risk).
// Makes the "risk score" idea visually immediate — a heatmap at icon scale.
export function LogoRiskMatrix({ size = 32, className }: LogoProps) {
  const dots = [
    // Row 1 — top (highest risk → rightmost)
    { cx: 9,  cy: 9,  o: 0.55 }, { cx: 16, cy: 9,  o: 0.78 }, { cx: 23, cy: 9,  o: 1.0  },
    // Row 2 — middle
    { cx: 9,  cy: 16, o: 0.32 }, { cx: 16, cy: 16, o: 0.58 }, { cx: 23, cy: 16, o: 0.82 },
    // Row 3 — bottom (lowest risk → leftmost)
    { cx: 9,  cy: 23, o: 0.18 }, { cx: 16, cy: 23, o: 0.38 }, { cx: 23, cy: 23, o: 0.58 },
  ]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {dots.map(({ cx, cy, o }) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity={o} />
      ))}
    </svg>
  )
}

// ─── 10. GS Mark ─────────────────────────────────────────────────────────────
// Clean "GS" lettermark inside a circle.
// Brand identity mark — works as avatar, app icon, or secondary stamp.
export function LogoGSMark({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1.2" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="currentColor"
        fontSize="13"
        fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
        fontWeight="600"
      >
        GS
      </text>
    </svg>
  )
}

// ─── 11. Shield Graph ────────────────────────────────────────────────────────
// Shield outline containing a rising line graph.
// Symbolizes "protection of growth" and "predictive risk analysis".
export function LogoShieldGraph({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Shield */}
      <path
        d="M16 3C10 3.5 4 7 4 14.5C4 21 9 26.5 16 30C23 26.5 28 21 28 14.5C28 7 22 3.5 16 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Rising Graph Line */}
      <path
        d="M9 21 L13 18 L18 21 L23 11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graph Dots */}
      <circle cx="9" cy="21" r="1.2" fill="currentColor" />
      <circle cx="13" cy="18" r="1.2" fill="currentColor" />
      <circle cx="18" cy="21" r="1.2" fill="currentColor" />
      <circle cx="23" cy="11" r="1.2" fill="currentColor" />
    </svg>
  )
}

// ─── 12. Shield Pulse ────────────────────────────────────────────────────────
// Shield outline containing a vital pulse line.
// Symbolizes "live monitoring" and "financial health protection".
export function LogoShieldPulse({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Shield */}
      <path
        d="M16 3C10 3.5 4 7 4 14.5C4 21 9 26.5 16 30C23 26.5 28 21 28 14.5C28 7 22 3.5 16 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Pulse Line */}
      <path
        d="M7 17 H11 L13.5 12 L16.5 22 L19 17 H25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── 13. Shield Nodes ────────────────────────────────────────────────────────
// Shield outline containing connected network nodes.
// Symbolizes "predictive network" and "connected intelligence".
export function LogoShieldNodes({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Shield */}
      <path
        d="M16 3C10 3.5 4 7 4 14.5C4 21 9 26.5 16 30C23 26.5 28 21 28 14.5C28 7 22 3.5 16 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Nodes & Connections */}
      <line x1="16" y1="10" x2="10" y2="19" stroke="currentColor" strokeWidth="1.2" />
      <line x1="16" y1="10" x2="22" y2="19" stroke="currentColor" strokeWidth="1.2" />
      <line x1="10" y1="19" x2="22" y2="19" stroke="currentColor" strokeWidth="1.2" />
      
      <circle cx="16" cy="10" r="2" fill="currentColor" />
      <circle cx="10" cy="19" r="2" fill="currentColor" />
      <circle cx="22" cy="19" r="2" fill="currentColor" />
    </svg>
  )
}

// ─── 14. Delivery Rider ──────────────────────────────────────────────────────
// Shield outline with a delivery rider on a motorcycle inside.
// Faithfully matches the gig-safe-logo.png design — white on transparent bg.
// ★ Used as the primary brand icon in the site header.
export function LogoDeliveryRider({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-white", className)}
    >
      {/* Shield outline */}
      <path
        d="M50 7 L84 19 L84 55 Q84 77 50 93 Q16 77 16 55 L16 19 Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      {/* Head / helmet */}
      <circle cx="66" cy="30" r="7" stroke="currentColor" strokeWidth="2.5" />
      {/* Package / delivery box */}
      <rect x="37" y="25" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <line x1="37" y1="31.5" x2="52" y2="31.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="44.5" y1="25" x2="44.5" y2="38" stroke="currentColor" strokeWidth="1.4" />
      {/* Body / torso */}
      <line x1="63" y1="37" x2="57" y2="53" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* Arm to handlebar */}
      <line x1="64" y1="43" x2="73" y2="40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="73" cy="40" r="1.8" fill="currentColor" />
      {/* Motorcycle frame */}
      <polyline
        points="37,73 47,55 59,55 69,58 73,67"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="47" y1="63" x2="37" y2="73" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Rear wheel */}
      <circle cx="37" cy="75" r="16" stroke="currentColor" strokeWidth="2.5" />
      {/* Front wheel */}
      <circle cx="73" cy="75" r="16" stroke="currentColor" strokeWidth="2.5" />
      {/* Speed lines */}
      <line x1="20" y1="80" x2="28" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
      <line x1="18" y1="85" x2="27" y2="85" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.48" />
      <line x1="20" y1="90" x2="27" y2="90" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" />
    </svg>
  )
}

// ─── Wordmark composite ──────────────────────────────────────────────────────
type WordmarkProps = LogoProps & { variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 }

export function GigSafeWordmark({ size = 32, variant = 1, className }: WordmarkProps) {
  const map: Record<number, React.ComponentType<LogoProps>> = {
    1: LogoShieldSignal, 2: LogoRainChart,   3: LogoCoverageRings, 4: LogoSignalTower,
    5: LogoPulseLine,    6: LogoDomeGuard,    7: LogoHexSignal,     8: LogoNodeNetwork,
    9: LogoRiskMatrix,  10: LogoGSMark, 11: LogoShieldGraph, 12: LogoShieldPulse, 13: LogoShieldNodes,
  }
  const Icon = map[variant] ?? LogoShieldSignal
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Icon size={size} />
      <span style={{ fontSize: size * 0.52 }} className="font-semibold tracking-tight text-white">
        GigSafe
      </span>
    </div>
  )
}


