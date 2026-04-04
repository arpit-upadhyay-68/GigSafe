"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  PLAN_MULTIPLIERS,
  ZONE_BASE_TRAFFIC_DENSITY,
  ZONE_DISRUPTION_DAYS_LAST_30,
  CHENNAI_ZONES,
  PLATFORM_NAMES,
  calculateSCI,
  calculateWeeklyPremium,
  formatRupees,
  type PlanType,
  type PlatformName,
  type ZoneName,
} from "@/lib/phase2"
import { cn } from "@/lib/utils"

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
]

const TRUST_LEVELS = [
  { label: "Bronze", value: 0 },
  { label: "Silver", value: 23 },
  { label: "Gold", value: 38 },
  { label: "Platinum", value: 60 },
]

const PLAN_OPTIONS: PlanType[] = ["BASIC", "STANDARD", "PREMIUM"]

const SELECT_CLASS =
  "h-10 w-full rounded-xl border border-white/12 bg-white/[0.035] px-3 text-sm text-zinc-100 transition-all duration-300 outline-none focus:border-white/30 focus:bg-white/[0.06]"

export default function PremiumPage() {
  const [zone, setZone] = useState<ZoneName>("Velachery")
  const [platform, setPlatform] = useState<PlatformName>("Zomato")
  const [weeklyIncome, setWeeklyIncome] = useState(7500)
  const [trustCredits, setTrustCredits] = useState(23)
  const [month, setMonth] = useState(10)
  const [plan, setPlan] = useState<PlanType>("STANDARD")

  const result = useMemo(
    () =>
      calculateWeeklyPremium({
        zone,
        platform,
        weeklyIncome,
        month,
        trustCredits,
        plan,
      }),
    [zone, platform, weeklyIncome, month, trustCredits, plan]
  )

  const standardResult = useMemo(
    () =>
      calculateWeeklyPremium({
        zone,
        platform,
        weeklyIncome,
        month,
        trustCredits,
        plan: "STANDARD",
      }),
    [zone, platform, weeklyIncome, month, trustCredits]
  )

  const comparison = useMemo(() => {
    return PLAN_OPTIONS.map((item) => {
      const computed = calculateWeeklyPremium({
        zone,
        platform,
        weeklyIncome,
        month,
        trustCredits,
        plan: item,
      })
      return {
        plan: item,
        annualCost: computed.annualPremium,
        annualProtection: item === "BASIC" ? 1500 * 52 : item === "STANDARD" ? 3000 * 52 : 5000 * 52,
      }
    })
  }, [zone, platform, weeklyIncome, month, trustCredits])

  const sci = useMemo(
    () =>
      calculateSCI({
        rainfallMM: 18,
        heatIndex: 38,
        platformAcceptanceRate: 82,
        trafficDensityPercent: ZONE_BASE_TRAFFIC_DENSITY[zone],
        disruptionDaysLast30: ZONE_DISRUPTION_DAYS_LAST_30[zone],
        hour24: new Date().getHours(),
      }),
    [zone]
  )

  const sciLabel = Math.round(sci.sci)
  const sciTone = sciLabel < 40 ? "#ef4444" : sciLabel <= 70 ? "#f59e0b" : "#34d399"
  const sciAngle = Math.max(0, Math.min(100, sciLabel)) * 3.6

  return (
    <main className="relative min-h-screen px-4 pb-10 pt-6 text-zinc-100 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <div className="section-wide w-full space-y-4">
        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="pb-3">
            <p className="eyebrow">Premium check</p>
            <CardTitle className="text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.05em]">See your weekly price</CardTitle>
            <CardDescription className="max-w-[56ch] text-zinc-400">
              Choose area, app, and plan to see your price and cover instantly.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[0.92fr_1.2fr]">
          <Card className="glass-shell border-white/10 bg-black/35">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg tracking-[-0.03em]">Your details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="zone" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Area
                </Label>
                <select
                  id="zone"
                  value={zone}
                  onChange={(event) => setZone(event.target.value as ZoneName)}
                  className={SELECT_CLASS}
                >
                  {CHENNAI_ZONES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Delivery app</Label>
                <div className="chip-group flex-wrap">
                  {PLATFORM_NAMES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPlatform(item)}
                      className={cn("chip-control transition-all duration-300", platform === item && "chip-control-active")}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="income" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Usual weekly earnings
                </Label>
                <div className="rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 transition-all duration-300">
                  <p className="text-2xl font-semibold tracking-[-0.04em]">₹{formatRupees(weeklyIncome)}</p>
                  <input
                    id="income"
                    type="range"
                    min={3000}
                    max={15000}
                    step={500}
                    value={weeklyIncome}
                    onChange={(event) => setWeeklyIncome(Number(event.target.value))}
                    className="mt-3 h-1.5 w-full cursor-pointer accent-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Trust level</Label>
                <div className="chip-group flex-wrap">
                  {TRUST_LEVELS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setTrustCredits(item.value)}
                      className={cn(
                        "chip-control transition-all duration-300",
                        trustCredits === item.value && "chip-control-active"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Month
                  </Label>
                  <select
                    id="month"
                    value={month}
                    onChange={(event) => setMonth(Number(event.target.value))}
                    className={SELECT_CLASS}
                  >
                    {MONTHS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2.5">
                  <Label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Plan</Label>
                  <div className="chip-group flex-wrap">
                    {PLAN_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPlan(item)}
                        className={cn("chip-control transition-all duration-300", plan === item && "chip-control-active")}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="glass-shell border-white/10 bg-black/35">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl tracking-[-0.03em]">Your price breakdown</CardTitle>
                <CardDescription className="text-zinc-400">How we calculate your premium.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-4">
                  <ol className="space-y-1.5">
                    <li className="transition-all duration-300">Base price: ₹49.00</li>
                    <li className="transition-all duration-300">Area × {result.zoneMultiplier.toFixed(2)} ({zone})</li>
                    <li className="transition-all duration-300">App × {result.platformMultiplier.toFixed(2)} ({platform})</li>
                    <li className="transition-all duration-300">Income × {result.incomeMultiplier.toFixed(2)}</li>
                    <li className="transition-all duration-300">Season × {result.seasonMultiplier.toFixed(2)}</li>
                    <li className="transition-all duration-300">Trust × {result.trustMultiplier.toFixed(2)}</li>
                    {plan !== "STANDARD" ? (
                      <li className="transition-all duration-300">Plan factor × {PLAN_MULTIPLIERS[plan].toFixed(2)} ({plan})</li>
                    ) : null}
                  </ol>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Weekly</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">₹{formatRupees(result.weeklyPremium)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Monthly</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">₹{formatRupees(result.monthlyPremium)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Annual</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-zinc-100">₹{formatRupees(result.annualPremium)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-xs text-zinc-400">
                  Standard plan for the same details: ₹{formatRupees(standardResult.weeklyPremium)} per week.
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <Link href="/policy" className="w-full">
                    <Button className="interactive-control h-10 w-full rounded-full bg-white text-black transition-all duration-300 hover:bg-zinc-100">
                      Continue with this plan
                    </Button>
                  </Link>
                  <Link href="/worker" className="w-full">
                    <Button
                      variant="ghost"
                      className="interactive-control h-10 w-full rounded-full border border-white/15 text-zinc-200 transition-all duration-300"
                    >
                      Back to worker page
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <section className="grid gap-4 md:grid-cols-[240px_1fr]">
              <Card className="glass-shell border-white/10 bg-black/35">
                <CardHeader className="pb-1">
                  <CardTitle className="text-base tracking-[-0.02em]">Area risk score</CardTitle>
                </CardHeader>
                <CardContent className="grid place-items-center gap-3 pt-3">
                  <div
                    className="grid size-40 place-items-center rounded-full border border-white/15 p-2.5 transition-all duration-300"
                    style={{
                      background: `conic-gradient(${sciTone} ${sciAngle}deg, rgba(39,39,42,0.92) ${sciAngle}deg 360deg)`,
                    }}
                  >
                    <div className="grid size-28 place-items-center rounded-full bg-zinc-950/90">
                      <p className="text-3xl font-semibold tracking-[-0.05em]">{sciLabel}</p>
                    </div>
                  </div>
                  <p className="text-center text-xs text-zinc-500">{sci.message}</p>
                </CardContent>
              </Card>

              <Card className="glass-shell border-white/10 bg-black/35">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg tracking-[-0.03em]">Plan comparison</CardTitle>
                  <CardDescription className="text-zinc-400">Yearly cost and yearly cover for each plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                          <th className="px-2 py-2 font-medium">Plan</th>
                          <th className="px-2 py-2 font-medium">Yearly cost</th>
                          <th className="px-2 py-2 font-medium">Yearly cover</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.map((row) => (
                          <tr key={row.plan} className="border-b border-white/5 text-zinc-200 transition-all duration-300 hover:bg-white/[0.02]">
                            <td className="px-2 py-3">{row.plan}</td>
                            <td className="px-2 py-3">₹{formatRupees(row.annualCost)}</td>
                            <td className="px-2 py-3">₹{formatRupees(row.annualProtection)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
