"use client"

import { useEffect, useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createInitialPlatformFeed, formatRupees, updatePlatformFeed } from "@/lib/phase2"
import { cn } from "@/lib/utils"

const PIPELINE_LABELS = ["Claim sent", "Checked", "Fraud check", "Approved", "Paid"] as const

const CLAIM_HISTORY = [
  { id: "CLM-2026-0392", trigger: "Heavy rain", payout: 820, date: "March 28", status: "PAID" },
  { id: "CLM-2026-0381", trigger: "Heat", payout: 492, date: "March 21", status: "PAID" },
  { id: "CLM-2026-0374", trigger: "App outage", payout: 328, date: "March 15", status: "PAID" },
  { id: "CLM-2026-0361", trigger: "Heavy rain", payout: 820, date: "March 7", status: "PAID" },
  { id: "CLM-2026-0348", trigger: "Poor air", payout: 410, date: "Feb 28", status: "PAID" },
  { id: "CLM-2026-0334", trigger: "City alert", payout: 820, date: "Feb 20", status: "UNDER REVIEW" },
]

const SIMULATION_STEPS = [
  "Creating claim CLM-2026-0404...",
  "Checking your policy...",
  "Checking event in your area...",
  "Estimating missed earnings...",
  "Running safety checks...",
  "Payout approved",
]

export default function ClaimsPage() {
  const [rainfall, setRainfall] = useState(18.2)
  const [temperature] = useState(38.4)
  const [aqi] = useState(287)
  const [zoneStatus] = useState("CLEAR")
  const [platformFeed, setPlatformFeed] = useState(createInitialPlatformFeed())

  const [simulationStep, setSimulationStep] = useState(-1)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationDone, setSimulationDone] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setPlatformFeed((previous) => updatePlatformFeed(previous))
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!isSimulating) {
      return
    }

    const timer = setInterval(() => {
      setSimulationStep((current) => {
        if (current >= SIMULATION_STEPS.length - 1) {
          setIsSimulating(false)
          setSimulationDone(true)
          return current
        }
        return current + 1
      })
    }, 950)

    return () => clearInterval(timer)
  }, [isSimulating])

  const t1Safe = rainfall <= 64.5
  const t2Safe = temperature <= 42
  const t3Safe = aqi <= 400
  const t4Safe = zoneStatus === "CLEAR"
  const t5Triggered =
    platformFeed.zomato.orderAcceptanceRate <= 30 || platformFeed.swiggy.orderAcceptanceRate <= 30

  const simulationMessage = simulationStep >= 0 ? SIMULATION_STEPS[simulationStep] : ""

  const pipelineIndex = useMemo(() => {
    if (!isSimulating && !simulationDone) {
      return 0
    }
    if (simulationDone) {
      return 4
    }
    if (simulationStep <= 1) {
      return 0
    }
    if (simulationStep <= 2) {
      return 1
    }
    if (simulationStep <= 4) {
      return 2
    }
    return 3
  }, [isSimulating, simulationDone, simulationStep])

  function runRedAlertSimulation() {
    setRainfall(71.2)
    setIsSimulating(true)
    setSimulationDone(false)
    setSimulationStep(0)
  }

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
            <p className="eyebrow">Claims</p>
            <CardTitle className="text-[clamp(1.5rem,2.6vw,2rem)] tracking-[-0.05em]">Track your claim in minutes</CardTitle>
            <CardDescription className="max-w-[56ch] text-zinc-400">
              See trigger checks, run a demo alert, and review past payouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 border-t border-white/10 pt-4 text-sm text-zinc-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Your cover</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">Active this week</p>
              <p className="text-xs text-zinc-400">All payout triggers are being tracked</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Last payout</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">₹{formatRupees(820)}</p>
              <p className="text-xs text-zinc-400">Heavy rain payout settled instantly</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-3 transition-all duration-300">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Typical speed</p>
              <p className="mt-1 text-base font-semibold text-zinc-100">&lt;5 min target</p>
              <p className="text-xs text-zinc-400">From checks to payment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-[-0.03em]">Live trigger checks</CardTitle>
            <CardDescription className="text-zinc-400">Five conditions tracked in real time.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300">
              <p className="text-zinc-100">T1 • Rain</p>
              <p className="mt-1 text-zinc-400">{rainfall.toFixed(1)} mm vs 64.5 mm threshold</p>
              <p className={cn("mt-2 text-xs font-medium uppercase tracking-[0.14em]", t1Safe ? "text-emerald-200" : "text-red-200")}>{t1Safe ? "OK" : "Triggered"}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300">
              <p className="text-zinc-100">T2 • Heat</p>
              <p className="mt-1 text-zinc-400">{temperature.toFixed(1)}°C vs 42°C threshold</p>
              <p className={cn("mt-2 text-xs font-medium uppercase tracking-[0.14em]", t2Safe ? "text-emerald-200" : "text-red-200")}>{t2Safe ? "OK" : "Triggered"}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300">
              <p className="text-zinc-100">T3 • Air</p>
              <p className="mt-1 text-zinc-400">{aqi} vs 400 threshold</p>
              <p className={cn("mt-2 text-xs font-medium uppercase tracking-[0.14em]", t3Safe ? "text-emerald-200" : "text-red-200")}>{t3Safe ? "OK" : "Triggered"}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300">
              <p className="text-zinc-100">T4 • City alert</p>
              <p className="mt-1 text-zinc-400">Zone status: {zoneStatus}</p>
              <p className={cn("mt-2 text-xs font-medium uppercase tracking-[0.14em]", t4Safe ? "text-emerald-200" : "text-red-200")}>{t4Safe ? "OK" : "Triggered"}</p>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3 text-sm transition-all duration-300 md:col-span-2">
              <p className="text-zinc-100">T5 • App status</p>
              <p className="mt-1 text-zinc-400">
                Zomato {platformFeed.zomato.orderAcceptanceRate}% • Swiggy {platformFeed.swiggy.orderAcceptanceRate}% acceptance
              </p>
              <p className={cn("mt-2 text-xs font-medium uppercase tracking-[0.14em]", t5Triggered ? "text-red-200" : "text-emerald-200")}>{t5Triggered ? "Triggered" : "OK"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-shell border-red-300/25 bg-black/35">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-[-0.03em]">Try demo red alert</CardTitle>
            <CardDescription className="text-zinc-400">Run a heavy-rain demo and watch payout progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={runRedAlertSimulation}
              className="interactive-control rounded-full border border-red-300/45 bg-red-500/80 px-5 text-white transition-all duration-300 hover:bg-red-400"
            >
              Run red alert demo
            </Button>

            {rainfall > 64.5 ? (
              <div className="rounded-2xl border border-red-300/35 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition-all duration-300">
                Heavy rain detected in Chennai (71.2 mm). Auto-claim flow started.
              </div>
            ) : null}

            {simulationMessage ? (
              <div className="rounded-2xl border border-white/12 bg-white/[0.035] px-3 py-2 text-sm text-zinc-200 transition-all duration-300">
                {simulationMessage}
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/12 bg-white/[0.035] p-3">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">Claim progress</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {PIPELINE_LABELS.map((label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 transition-all duration-300",
                        index <= pipelineIndex
                          ? "border-white/30 bg-white text-black"
                          : "border-white/15 bg-white/[0.04] text-zinc-400"
                      )}
                    >
                      {label}
                    </span>
                    {index < PIPELINE_LABELS.length - 1 ? <span className="text-zinc-600">→</span> : null}
                  </div>
                ))}
              </div>
            </div>

            {simulationDone ? (
              <div className="rounded-2xl border border-emerald-300/35 bg-emerald-400/10 p-4 text-sm transition-all duration-300">
                <p className="text-base font-semibold text-emerald-100">₹{formatRupees(820)} payout started</p>
                <p className="mt-1 text-zinc-100">Estimated missed earnings saved for Wednesday afternoon shift.</p>
                <p className="text-zinc-300">Low fraud risk • Auto-pay enabled • Settlement in progress.</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="glass-shell border-white/10 bg-black/35">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl tracking-[-0.03em]">Past claims</CardTitle>
            <CardDescription className="text-zinc-400">Latest claim outcomes and payouts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    <th className="px-2 py-2 font-medium">Claim ID</th>
                    <th className="px-2 py-2 font-medium">Reason</th>
                    <th className="px-2 py-2 font-medium">Payout</th>
                    <th className="px-2 py-2 font-medium">Date</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CLAIM_HISTORY.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 text-zinc-200 transition-all duration-300 hover:bg-white/[0.02]">
                      <td className="px-2 py-3">{row.id}</td>
                      <td className="px-2 py-3">{row.trigger}</td>
                      <td className="px-2 py-3">₹{formatRupees(row.payout)}</td>
                      <td className="px-2 py-3">{row.date}</td>
                      <td className="px-2 py-3">
                        <Badge
                          className={cn(
                            "rounded-full",
                            row.status.includes("UNDER")
                              ? "border border-amber-300/35 bg-amber-300/10 text-amber-200"
                              : "border border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                          )}
                        >
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
      </div>
    </main>
  )
}
