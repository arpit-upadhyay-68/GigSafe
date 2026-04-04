"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_WEEKLY_FINANCIALS, CLAIMS_BY_TRIGGER_DATA, ZONE_MICRO_POOLS, formatRupees } from "@/lib/phase2"

const KPI_ITEMS = [
  { label: "Total Workers Covered", value: "1,247" },
  { label: "Active Policies This Week", value: "1,189" },
  { label: "Total Premiums Collected", value: "₹1,04,832" },
  { label: "Claims Paid This Week", value: "₹38,240" },
  { label: "Loss Ratio", value: "36.5%" },
]

const HEATMAP = [
  { zone: "Velachery", probability: 78 },
  { zone: "Adyar", probability: 71 },
  { zone: "T.Nagar", probability: 58 },
  { zone: "Chromepet", probability: 45 },
  { zone: "Tambaram", probability: 37 },
  { zone: "Anna Nagar", probability: 24 },
]

function riskBorderClass(level: "LOW" | "MEDIUM" | "HIGH") {
  if (level === "HIGH") {
    return "border-[#ef4444]/70"
  }
  if (level === "MEDIUM") {
    return "border-[#f59e0b]/70"
  }
  return "border-[#10b981]/70"
}

function heatCellClass(probability: number) {
  if (probability >= 70) {
    return "bg-[#ef4444]/20"
  }
  if (probability >= 45) {
    return "bg-[#f59e0b]/20"
  }
  return "bg-[#10b981]/15"
}

function kpiValueClass(label: string) {
  if (label === "Loss Ratio") {
    return "text-[#10b981]"
  }
  if (label === "Claims Paid This Week") {
    return "text-[#f59e0b]"
  }
  return "text-white"
}

function zonePriorityScore(level: "LOW" | "MEDIUM" | "HIGH", claimsToday: number) {
  const riskWeight = level === "HIGH" ? 3 : level === "MEDIUM" ? 2 : 1
  return riskWeight * 100 + claimsToday
}

export default function OperationsAnalyticsPage() {
  const [, activePolicies, totalPremiums, claimsPaid, lossRatio] = KPI_ITEMS

  const totalClaimsThisWeek = useMemo(() => CLAIMS_BY_TRIGGER_DATA.reduce((sum, item) => sum + item.count, 0), [])
  const dominantTrigger = useMemo(
    () => CLAIMS_BY_TRIGGER_DATA.reduce((max, item) => (item.count > max.count ? item : max), CLAIMS_BY_TRIGGER_DATA[0]),
    []
  )
  const highRiskZones = useMemo(
    () =>
      ZONE_MICRO_POOLS.filter((zone) => zone.riskLevel === "HIGH")
        .map((zone) => zone.name)
        .join(", "),
    []
  )
  const priorityZones = useMemo(
    () =>
      [...ZONE_MICRO_POOLS]
        .sort((a, b) => zonePriorityScore(b.riskLevel, b.claimsToday) - zonePriorityScore(a.riskLevel, a.claimsToday))
        .slice(0, 4),
    []
  )

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-zinc-100">
      <div aria-hidden className="ambient-grid" />
      <div aria-hidden className="ambient-orb -left-24 top-10 h-64 w-64 opacity-30" />
      <div aria-hidden className="ambient-orb right-0 top-72 h-80 w-80 opacity-20" />

      <div className="section-wide relative z-10 py-5 md:py-6">
        <div className="mx-auto w-full max-w-[1400px] space-y-3">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="surface-elevated border-white/10 bg-black/55">
              <CardContent className="grid gap-3 p-4 xl:grid-cols-[1.16fr_1fr]">
                <div className="space-y-2.5">
                  <p className="eyebrow">Operations analytics</p>
                  <h1 className="text-[clamp(1.65rem,2.2vw,2.2rem)] font-semibold leading-tight tracking-[-0.05em] text-white">
                    Portfolio command center
                  </h1>
                  <p className="max-w-3xl text-sm leading-relaxed text-zinc-300">
                    One-screen executive view of risk pressure, financial posture, and intervention priorities.
                  </p>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5">
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">Dominant trigger</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-100">{dominantTrigger.trigger} drives current claims load</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5">
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">Total claims this week</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-100">{totalClaimsThisWeek} submitted across all triggers</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5">
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">High-risk zones</p>
                      <p className="mt-1 text-sm font-semibold text-zinc-100">{highRiskZones}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {KPI_ITEMS.map((item) => (
                    <div key={item.label} className="surface-card border border-white/10 bg-white/[0.04] px-3 py-2.5">
                      <p className="text-[0.62rem] uppercase tracking-[0.17em] text-zinc-500">{item.label}</p>
                      <p className={`mt-1 text-[1.4rem] font-semibold tracking-[-0.05em] ${kpiValueClass(item.label)}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section
            className="grid gap-3 xl:h-[calc(100vh-15rem)] xl:grid-cols-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="surface-card border-white/10 bg-white/[0.045] xl:col-span-4 xl:flex xl:min-h-0 xl:flex-col">
              <CardHeader className="pb-1">
                <CardTitle className="text-base tracking-[-0.02em]">Operations brief</CardTitle>
                <CardDescription className="text-zinc-400">Cycle outlook and top interventions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-1 xl:min-h-0 xl:overflow-y-auto">
                <div className="flex items-end justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-3">
                  <div>
                    <p className="text-[2.05rem] font-semibold leading-none tracking-[-0.06em] text-white">68%</p>
                    <p className="mt-1 text-xs text-zinc-400">T1 disruption probability next week</p>
                  </div>
                  <Badge className="border border-[#f59e0b]/40 bg-[#f59e0b]/20 text-[#fbbf24]">High watch</Badge>
                </div>

                <div className="grid gap-2 text-sm text-zinc-300">
                  <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Expected claims range: 147-183</p>
                  <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">Reserve guidance: ₹1,52,000</p>
                  <p className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    {totalPremiums.value} premiums vs {claimsPaid.value} claims · {activePolicies.value} active policies · {lossRatio.value} loss ratio
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-zinc-500">Priority zone actions</p>
                  {priorityZones.map((zone) => (
                    <div
                      key={zone.name}
                      className={`interactive-control rounded-xl border bg-black/25 px-3 py-2.5 ${riskBorderClass(zone.riskLevel)}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold tracking-[-0.01em] text-zinc-100">{zone.name}</p>
                        <Badge
                          className={
                            zone.riskLevel === "HIGH"
                              ? "border border-[#ef4444]/40 bg-[#ef4444]/20 text-[#f87171]"
                              : zone.riskLevel === "MEDIUM"
                                ? "border border-[#f59e0b]/40 bg-[#f59e0b]/20 text-[#fbbf24]"
                                : "border border-[#10b981]/40 bg-[#10b981]/20 text-[#34d399]"
                          }
                        >
                          {zone.riskLevel}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-300">
                        Claims: {zone.claimsToday} · Workers: {zone.activeWorkers} · Pool: ₹{formatRupees(zone.poolBalance)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 xl:col-span-8 xl:min-h-0 xl:grid-rows-[minmax(0,1fr)_minmax(0,0.95fr)]">
              <div className="grid gap-3 xl:min-h-0 xl:grid-cols-2">
                <Card className="surface-card border-white/10 bg-white/[0.045] xl:flex xl:min-h-0 xl:flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="tracking-[-0.02em]">Premiums vs claims trend</CardTitle>
                    <CardDescription className="text-zinc-400">8-week unit economics trajectory</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[230px] p-4 pt-1 xl:min-h-0 xl:flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ADMIN_WEEKLY_FINANCIALS} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis
                          dataKey="week"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "rgba(212,212,216,0.82)", fontSize: 12 }}
                        />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(212,212,216,0.82)", fontSize: 12 }} />
                        <Tooltip
                          cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                          contentStyle={{
                            border: "1px solid rgba(255,255,255,0.14)",
                            backgroundColor: "rgba(7,12,24,0.96)",
                            borderRadius: "0.75rem",
                          }}
                          labelStyle={{ color: "#d4d4d8", fontWeight: 500 }}
                          itemStyle={{ color: "#e4e4e7" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="premiums"
                          stroke="#10b981"
                          strokeWidth={2.35}
                          dot={{ r: 2.4, strokeWidth: 1, fill: "#10b981" }}
                          activeDot={{ r: 4 }}
                          name="Premiums"
                        />
                        <Line
                          type="monotone"
                          dataKey="claims"
                          stroke="#f59e0b"
                          strokeWidth={2.35}
                          dot={{ r: 2.4, strokeWidth: 1, fill: "#f59e0b" }}
                          activeDot={{ r: 4 }}
                          name="Claims"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="surface-card border-white/10 bg-white/[0.045] xl:flex xl:min-h-0 xl:flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="tracking-[-0.02em]">Claims by trigger</CardTitle>
                    <CardDescription className="text-zinc-400">T1 and T5 continue to dominate weekly load</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[230px] p-4 pt-1 xl:min-h-0 xl:flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CLAIMS_BY_TRIGGER_DATA} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis
                          dataKey="trigger"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "rgba(212,212,216,0.82)", fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                          tick={{ fill: "rgba(212,212,216,0.82)", fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          contentStyle={{
                            border: "1px solid rgba(255,255,255,0.14)",
                            backgroundColor: "rgba(7,12,24,0.96)",
                            borderRadius: "0.75rem",
                          }}
                          labelStyle={{ color: "#d4d4d8", fontWeight: 500 }}
                          itemStyle={{ color: "#e4e4e7" }}
                        />
                        <Bar dataKey="count" fill="#d4d4d8" barSize={30} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="surface-card border-white/10 bg-white/[0.045] xl:flex xl:min-h-0 xl:flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="tracking-[-0.02em]">Disruption watchlist</CardTitle>
                  <CardDescription className="text-zinc-400">Zone-level probability for next week</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2.5 p-4 pt-1 sm:grid-cols-2 xl:min-h-0 xl:grid-cols-3 xl:overflow-y-auto">
                  {HEATMAP.map((item) => (
                    <div key={item.zone} className={`rounded-xl border border-white/10 px-3 py-2.5 ${heatCellClass(item.probability)}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-zinc-100">{item.zone}</p>
                        <p className="text-xs text-zinc-200">{item.probability}%</p>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-black/35">
                        <div className="h-1.5 rounded-full bg-white/75" style={{ width: `${item.probability}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}
