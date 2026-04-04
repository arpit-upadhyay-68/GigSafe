"use client"

import { useState } from "react"
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { DEMO_INCOME_DNA, formatRupees } from "@/lib/phase2"

const TRIGGER_ROWS = [
  { trigger: "Heavy rain", threshold: "Rainfall above 64.5 mm/day", payoutPct: "100%", estimate: 820, status: "Yes" },
  { trigger: "Extreme heat", threshold: "Above 42°C for 3 hours", payoutPct: "60%", estimate: 492, status: "Yes" },
  { trigger: "Very poor air", threshold: "AQI above 400 for 4 hours", payoutPct: "50%", estimate: 410, status: "Yes" },
  { trigger: "Official city alert", threshold: "Government disruption alert", payoutPct: "100%", estimate: 820, status: "Yes" },
  { trigger: "App outage", threshold: "70% drop for 45 minutes", payoutPct: "40%", estimate: 328, status: "Yes" },
]

const POLICY_HISTORY = [
  { week: "Mar 3 - Mar 9", premium: 81.2, claims: 328, net: 246.8 },
  { week: "Mar 10 - Mar 16", premium: 84.28, claims: 820, net: 735.72 },
  { week: "Mar 17 - Mar 23", premium: 83.91, claims: 492, net: 408.09 },
  { week: "Mar 24 - Mar 30", premium: 84.37, claims: 0, net: -84.37 },
]

const DAILY_DNA_DATA = DEMO_INCOME_DNA.byDayOfWeek.map((value, index) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
  income: value,
  sci: [64, 59, 52, 57, 69, 74, 72][index],
}))

export default function PolicyPage() {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [autoRenew, setAutoRenew] = useState(true)

  return (
    <main className="relative min-h-screen px-4 pb-10 pt-6 text-zinc-100 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <div className="section-wide w-full space-y-4">
        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="space-y-2 pb-3">
            <p className="eyebrow">Policy details</p>
            <CardTitle className="text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.05em]">Your cover this week</CardTitle>
            <CardDescription className="max-w-[58ch] text-zinc-400">
              See what you pay, what is covered, and how payouts looked in recent weeks.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-3 border-t border-white/10 pt-4 text-sm text-zinc-300 md:grid-cols-4">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Plan</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">Standard</p>
              <p className="text-xs text-zinc-400">Velachery • Zomato</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Pay per week</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">₹84.28</p>
              <p className="text-xs text-zinc-400">Auto-deducted each week</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Top payout</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">₹3,000 / week</p>
              <p className="text-xs text-zinc-400">All 5 payout triggers active</p>
            </div>
            <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-100/80">Status</p>
              <p className="mt-1 text-base font-semibold text-emerald-100">Active and protected</p>
              <Badge className="mt-2 rounded-full border border-emerald-200/40 bg-emerald-200/15 text-[10px] text-emerald-100">LIVE</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-[-0.03em]">How your weekly price is calculated</CardTitle>
            <CardDescription className="text-zinc-400">₹49 × 1.45 × 1.00 × 1.00 × 1.25 × 0.95 = ₹84.37 / week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setShowBreakdown((value) => !value)}
              className="interactive-control h-9 rounded-full border border-white/15 px-4 text-sm text-zinc-200 transition-all duration-300"
            >
              {showBreakdown ? "Hide price steps" : "Show price steps"}
            </Button>

            {showBreakdown ? (
              <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-4 text-sm text-zinc-300 transition-all duration-300">
                <div className="space-y-1.5">
                  <p>Base price: ₹49.00</p>
                  <p>× Area (Velachery): × 1.45 → ₹71.05</p>
                  <p>× App (Zomato): × 1.00 → ₹71.05</p>
                  <p>× Income band: × 1.00 → ₹71.05</p>
                  <p>× Season (NE Monsoon): × 1.25 → ₹88.81</p>
                  <p>× Trust discount: × 0.95 → ₹84.37</p>
                </div>
                <Separator className="my-3 bg-white/10" />
                <p className="font-semibold text-zinc-100">Final weekly price: ₹84.37</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-[-0.03em]">What can trigger a payout</CardTitle>
            <CardDescription className="text-zinc-400">If one of these events happens, payout starts automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    <th className="px-2 py-2 font-medium">Event</th>
                    <th className="px-2 py-2 font-medium">When it pays</th>
                    <th className="px-2 py-2 font-medium">Payout share</th>
                    <th className="px-2 py-2 font-medium">Est. payout</th>
                    <th className="px-2 py-2 font-medium">Covered</th>
                  </tr>
                </thead>
                <tbody>
                  {TRIGGER_ROWS.map((row) => (
                    <tr key={row.trigger} className="border-b border-white/5 text-zinc-200 transition-all duration-300 hover:bg-white/[0.02]">
                      <td className="px-2 py-3">{row.trigger}</td>
                      <td className="px-2 py-3">{row.threshold}</td>
                      <td className="px-2 py-3">{row.payoutPct}</td>
                      <td className="px-2 py-3">₹{formatRupees(row.estimate)}</td>
                      <td className="px-2 py-3">
                        <Badge className="rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-200">
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="glass-shell border-white/10 bg-black/35">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl tracking-[-0.03em]">Weekly earning pattern</CardTitle>
              <CardDescription className="text-zinc-400">Estimated earnings by day.</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_DNA_DATA} barCategoryGap={18}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 11 }} width={32} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(10,10,12,0.94)",
                      color: "#fafafa",
                    }}
                    labelStyle={{ color: "#e4e4e7", marginBottom: 6 }}
                  />
                  <Bar dataKey="income" radius={[8, 8, 0, 0]}>
                    {DAILY_DNA_DATA.map((entry) => (
                      <Cell key={entry.day} fill={entry.sci >= 70 ? "#d4d4d8" : "#71717a"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-shell border-white/10 bg-black/35">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl tracking-[-0.03em]">Last 4 weeks</CardTitle>
              <CardDescription className="text-zinc-400">What you paid vs what you got.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {POLICY_HISTORY.map((row) => (
                <div
                  key={row.week}
                  className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300 hover:border-white/20"
                >
                  <p className="font-medium text-zinc-100">{row.week}</p>
                  <div className="mt-1 grid gap-1 text-zinc-300 sm:grid-cols-3 sm:gap-2">
                    <p>Premium: ₹{formatRupees(row.premium)}</p>
                    <p>Claims: ₹{formatRupees(row.claims)}</p>
                    <p className={row.net >= 0 ? "text-emerald-200" : "text-amber-200"}>Net: ₹{formatRupees(row.net)}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.035] px-3 py-2.5 transition-all duration-300">
                <div>
                  <p className="text-sm font-medium text-zinc-100">Auto-renew policy</p>
                  <p className="text-xs text-zinc-500">Keep your weekly cover active</p>
                </div>
                <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
