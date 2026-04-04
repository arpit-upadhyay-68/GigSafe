"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  DEMO_INCOME_DNA,
  ZONE_BASE_TRAFFIC_DENSITY,
  ZONE_DISRUPTION_DAYS_LAST_30,
  calculateSCI,
  createInitialPlatformFeed,
  formatRupees,
  getTrustTier,
  updatePlatformFeed,
} from "@/lib/phase2"
import { cn } from "@/lib/utils"

const FACTORS = [
  { key: "weatherScore", label: "Weather" },
  { key: "platformScore", label: "App stability" },
  { key: "zoneCongestScore", label: "Traffic in your area" },
  { key: "historicalDisruptScore", label: "Last 30 days disruptions" },
  { key: "timeOfDayScore", label: "Shift timing" },
] as const

const RECENT_CLAIMS = [
  { date: "2026-03-28", trigger: "Heavy rain", income: 820, payout: 820, status: "PAID" },
  { date: "2026-03-21", trigger: "Heat", income: 820, payout: 492, status: "PAID" },
  { date: "2026-03-15", trigger: "App outage", income: 820, payout: 328, status: "PAID" },
]

function sparklinePoints(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const spread = max - min || 1

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 36 - ((value - min) / spread) * 26
      return `${x},${y}`
    })
    .join(" ")
}

export default function WorkerPage() {
  const [platformFeed, setPlatformFeed] = useState(createInitialPlatformFeed())
  const trustCredits = 23
  const trustTier = getTrustTier(trustCredits)

  useEffect(() => {
    const timer = setInterval(() => {
      setPlatformFeed((previous) => updatePlatformFeed(previous))
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  const sci = useMemo(() => {
    return calculateSCI({
      rainfallMM: 18,
      heatIndex: 38,
      platformAcceptanceRate: platformFeed.swiggy.orderAcceptanceRate,
      trafficDensityPercent: ZONE_BASE_TRAFFIC_DENSITY.Velachery,
      disruptionDaysLast30: ZONE_DISRUPTION_DAYS_LAST_30.Velachery,
      hour24: new Date().getHours(),
    })
  }, [platformFeed.swiggy.orderAcceptanceRate])

  const hasOutage =
    platformFeed.zomato.status === "OUTAGE" || platformFeed.swiggy.status === "OUTAGE"

  const sciLabel = Math.round(sci.sci)
  const sciTone = sciLabel < 40 ? "#ef4444" : sciLabel < 70 ? "#f59e0b" : "#34d399"
  const sciAngle = Math.max(0, Math.min(100, sciLabel)) * 3.6
  const confidenceMessage =
    sciLabel >= 70
      ? "Good time to work. Risk is low right now."
      : sciLabel >= 40
        ? "Mixed conditions. Keep your cover on."
        : "Risk is high now. Consider shorter shifts."

  const incomeEstimate = Math.round(DEMO_INCOME_DNA.byDayOfWeek.reduce((sum, value) => sum + value, 0))
  const sparkline = sparklinePoints(DEMO_INCOME_DNA.byDayOfWeek)

  return (
    <main className="relative min-h-screen px-4 pb-6 pt-5 text-zinc-100 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-16%] right-[-10%] size-[26rem] opacity-25" />
      </div>

      <div className="section-wide w-full space-y-3 lg:h-[calc(100vh-3rem)]">
        <section className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 transition-all duration-300 hover:bg-white/[0.065]">
            <p className="eyebrow mb-1">Worker home</p>
            <p className="text-base font-semibold tracking-[-0.02em] text-zinc-100">One-glance shift snapshot</p>
            <p className="mt-1 text-xs text-zinc-400">Risk, app status, and payouts before you go online.</p>
          </article>
          <article className="rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 transition-all duration-300 hover:bg-white/[0.065]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Your cover</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">Active • Standard plan</p>
            <p className="text-xs text-zinc-400">Renews every Sunday night</p>
          </article>
          <article className="rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 transition-all duration-300 hover:bg-white/[0.065]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Discount level</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">
              {trustTier.tier} • {trustCredits} credits
            </p>
            <p className="text-xs text-zinc-400">{trustTier.discountPct}% premium discount active</p>
          </article>
          <article className="rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-3 transition-all duration-300 hover:bg-white/[0.065]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">This week estimate</p>
            <p className="mt-1 text-base font-semibold text-zinc-100">₹{formatRupees(incomeEstimate)} projected</p>
            <p className="text-xs text-zinc-400">Based on your recent delivery pattern</p>
          </article>
        </section>

        <section className="grid gap-3 lg:min-h-0 lg:grid-cols-[1.12fr_0.88fr]">
          <Card className="glass-shell border-white/10 bg-black/35">
            <div className="grid gap-4 p-4 md:grid-cols-[220px_1fr]">
              <div className="mx-auto flex w-full max-w-[220px] flex-col items-center gap-2.5">
                <div
                  className="grid size-44 place-items-center rounded-full border border-white/15 p-3 transition-all duration-300 md:size-[11.5rem]"
                  style={{
                    background: `conic-gradient(${sciTone} ${sciAngle}deg, rgba(39,39,42,0.92) ${sciAngle}deg 360deg)`,
                  }}
                >
                  <div className="grid size-32 place-items-center rounded-full bg-zinc-950/90 md:size-36">
                    <div className="text-center">
                      <p className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{sciLabel}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                        {sci.band.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-zinc-400">Shift score</p>
              </div>

              <div className="space-y-3">
                <p className="rounded-2xl border border-white/12 bg-white/[0.04] px-3 py-2.5 text-sm text-zinc-200 transition-all duration-300">
                  {confidenceMessage}
                </p>

                <div className="space-y-2.5">
                  {FACTORS.map((factor) => {
                    const value = Math.round(sci[factor.key])
                    return (
                      <div key={factor.key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[13px] text-zinc-300">
                          <span>{factor.label}</span>
                          <span>{value}/100</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-white/80 transition-all duration-300"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/12 bg-white/[0.035] p-2.5 transition-all duration-300 hover:bg-white/[0.05]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Income trend</p>
                    <svg viewBox="0 0 100 40" className="mt-1.5 h-10 w-full">
                      <polyline
                        points={sparkline}
                        fill="none"
                        stroke="#e4e4e7"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="mt-1 text-[11px] text-zinc-500">Weekend shifts usually pay more.</p>
                  </div>
                  <div className="rounded-xl border border-white/12 bg-white/[0.035] p-2.5 transition-all duration-300 hover:bg-white/[0.05]">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Trust progress</p>
                    <p className="mt-1 text-base font-semibold text-zinc-100">3 claim-free weeks</p>
                    <Progress value={88} className="mt-2 h-1.5 bg-white/10" />
                    <p className="mt-1.5 text-[11px] text-zinc-400">3 more credits to reach Gold discount.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 lg:min-h-0 lg:grid-rows-[1fr_1fr]">
            <Card className="glass-shell border-white/10 bg-black/35">
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-100">App status</h2>
                    <p className="text-xs text-zinc-400">Updates every 30 seconds.</p>
                  </div>
                </div>

                {hasOutage ? (
                  <div className="rounded-2xl border border-red-400/35 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition-all duration-300">
                    App issue detected. Claim monitoring is active.
                  </div>
                ) : null}

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                  {[platformFeed.zomato, platformFeed.swiggy].map((item) => (
                    <article
                      key={item.platform}
                      className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium tracking-[-0.01em] text-zinc-100">{item.platform.toUpperCase()}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full text-[10px] tracking-[0.08em]",
                            item.status === "HEALTHY" && "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
                            item.status === "DEGRADED" && "border-amber-300/40 bg-amber-300/10 text-amber-200",
                            item.status === "OUTAGE" && "border-red-300/40 bg-red-300/10 text-red-200"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-zinc-300">
                        {item.orderAcceptanceRate}% accepted • {(item.avgResponseTime / 1000).toFixed(1)}s response
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Outage for: {item.outageMinutes} min</p>
                    </article>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="glass-shell border-white/10 bg-black/35">
              <div className="p-4">
                <div className="mb-2 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-100">Recent payouts</h2>
                    <p className="text-xs text-zinc-400">Latest settled claims.</p>
                  </div>
                </div>
                <div className="max-h-[19rem] overflow-x-auto overflow-y-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                        <th className="px-2 py-2 font-medium">Date</th>
                        <th className="px-2 py-2 font-medium">Reason</th>
                        <th className="px-2 py-2 font-medium">Estimated earnings</th>
                        <th className="px-2 py-2 font-medium">Payout</th>
                        <th className="px-2 py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_CLAIMS.map((claim) => (
                        <tr
                          key={`${claim.date}-${claim.trigger}`}
                          className="border-b border-white/5 text-zinc-200 transition-all duration-300 hover:bg-white/[0.02]"
                        >
                          <td className="px-2 py-3">{claim.date}</td>
                          <td className="px-2 py-3">{claim.trigger}</td>
                          <td className="px-2 py-3">₹{formatRupees(claim.income)}</td>
                          <td className="px-2 py-3">₹{formatRupees(claim.payout)}</td>
                          <td className="px-2 py-3">
                            <Badge className="rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                              {claim.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
