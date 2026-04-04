"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  PLAN_MULTIPLIERS,
  PLATFORM_NAMES,
  ZONE_BASE_TRAFFIC_DENSITY,
  ZONE_DISRUPTION_DAYS_LAST_30,
  CHENNAI_ZONES,
  calculateSCI,
  calculateWeeklyPremium,
  formatRupees,
type PlanType,
  type PlatformName,
  type ZoneName,
} from "@/lib/phase2"

type RegistrationResponse = {
  registrationId?: string
  message?: string
}

const INPUT_CLASS =
  "h-10 rounded-xl border-white/12 bg-white/[0.035] text-zinc-100 transition-all duration-300 placeholder:text-zinc-500 focus-visible:border-white/30 focus-visible:bg-white/[0.06] focus-visible:ring-0"

const SELECT_CLASS =
  "h-10 w-full rounded-xl border border-white/12 bg-white/[0.035] px-3 text-sm text-zinc-100 transition-all duration-300 outline-none focus:border-white/30 focus:bg-white/[0.06]"

const PLAN_META: Record<
  PlanType,
  {
    title: string
    summary: string
    payout: string
    processing: string
    extras?: string
  }
> = {
  BASIC: {
    title: "Basic",
    summary: "Low weekly cost for calmer weeks.",
    payout: "Up to ₹1,500 per week",
    processing: "Regular payout speed",
  },
  STANDARD: {
    title: "Standard",
    summary: "Best fit for most delivery workers.",
    payout: "Up to ₹3,000 per week",
    processing: "Faster payout review",
  },
  PREMIUM: {
    title: "Premium",
    summary: "Higher cover for heavy rain and outages.",
    payout: "Up to ₹5,000 per week",
    processing: "Priority payout queue",
    extras: "Earn trust credits faster",
  },
}

function StepIdentity({
  fullName,
  setFullName,
  phone,
  setPhone,
  platform,
  setPlatform,
}: {
  fullName: string
  setFullName: (value: string) => void
  phone: string
  setPhone: (value: string) => void
  platform: PlatformName
  setPlatform: (value: PlatformName) => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Full name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Phone number (+91)
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Main app</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLATFORM_NAMES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPlatform(item)}
              className={cn(
                "rounded-xl border px-3 py-2 text-left text-sm transition-all duration-300",
                platform === item
                  ? "border-white/35 bg-white/[0.12] text-white"
                  : "border-white/12 bg-white/[0.035] text-zinc-300 hover:border-white/30 hover:bg-white/[0.08]"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StepDeliveryArea({
  zone,
  setZone,
}: {
  zone: ZoneName
  setZone: (value: ZoneName) => void
}) {
  const trafficDensity = ZONE_BASE_TRAFFIC_DENSITY[zone]
  const disruptionDays = ZONE_DISRUPTION_DAYS_LAST_30[zone]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zone" className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Delivery area
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-3 transition-all duration-300">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Traffic baseline</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">{trafficDensity}%</p>
          <p className="text-xs text-zinc-400">Used in your area risk estimate.</p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-3 transition-all duration-300">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Recent disruptions</p>
          <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">{disruptionDays} days</p>
          <p className="text-xs text-zinc-400">Rain or traffic disruption in last 30 days.</p>
        </div>
      </div>
    </div>
  )
}

function StepConfirmation({
  fullName,
  phone,
  platform,
  zone,
  selectedPlan,
  setSelectedPlan,
  standardPremium,
  selectedPremium,
  zoneScore,
}: {
  fullName: string
  phone: string
  platform: PlatformName
  zone: ZoneName
  selectedPlan: PlanType
  setSelectedPlan: (value: PlanType) => void
  standardPremium: number
  selectedPremium: number
  zoneScore: number
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Worker</p>
          <p className="mt-1 truncate text-sm font-medium">{fullName}</p>
          <p className="text-xs text-zinc-400">{phone}</p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Platform</p>
          <p className="mt-1 text-sm font-medium">{platform}</p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Area</p>
          <p className="mt-1 text-sm font-medium">{zone}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-[0.18em] text-zinc-500">Choose cover</Label>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["BASIC", "STANDARD", "PREMIUM"] as const).map((plan) => {
            const active = selectedPlan === plan
            const price = standardPremium * PLAN_MULTIPLIERS[plan]

            return (
              <button
                key={plan}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                  "rounded-xl border p-3 text-left transition-all duration-300",
                  active
                    ? "border-white/35 bg-white/[0.11]"
                    : "border-white/12 bg-white/[0.035] hover:border-white/30 hover:bg-white/[0.08]"
                )}
              >
                <p className="text-sm font-medium">{PLAN_META[plan].title}</p>
                <p className="mt-1 text-xs text-zinc-400">₹{formatRupees(price)}/week</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-3 transition-all duration-300">
        <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200/90">Ready to activate</p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.04em]">₹{formatRupees(selectedPremium)}</p>
            <p className="text-xs text-emerald-100/85">{PLAN_META[selectedPlan].payout}</p>
          </div>
          <Badge className="rounded-full border border-emerald-300/35 bg-emerald-200/20 text-[10px] text-emerald-50">
            SCI {zoneScore}/100
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default function OnboardPage() {
  const [step, setStep] = useState(1)
  const [complete, setComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [registrationId, setRegistrationId] = useState<string | null>(null)

  const [fullName, setFullName] = useState("Rajan Kumar")
  const [phone, setPhone] = useState("+91 9876543210")
  const [platform, setPlatform] = useState<PlatformName>("Swiggy")

  const [zone, setZone] = useState<ZoneName>("Velachery")
  const weeklyIncome = 7500
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("STANDARD")

  const month = new Date().getMonth() + 1

  const standardPremium = useMemo(() => {
    return calculateWeeklyPremium({
      zone,
      platform,
      weeklyIncome,
      month,
      trustCredits: 0,
      plan: "STANDARD",
    })
  }, [zone, platform, weeklyIncome, month])

  const selectedPremium = useMemo(() => {
    return calculateWeeklyPremium({
      zone,
      platform,
      weeklyIncome,
      month,
      trustCredits: 0,
      plan: selectedPlan,
    })
  }, [zone, platform, weeklyIncome, month, selectedPlan])

  const zoneSCI = useMemo(() => {
    return calculateSCI({
      rainfallMM: 18,
      heatIndex: 38,
      platformAcceptanceRate: 82,
      trafficDensityPercent: ZONE_BASE_TRAFFIC_DENSITY[zone],
      disruptionDaysLast30: ZONE_DISRUPTION_DAYS_LAST_30[zone],
      hour24: new Date().getHours(),
    })
  }, [zone])

  const stepMeta =
    step === 1
      ? {
          title: "Profile basics",
          description: "Name, phone, and delivery app.",
        }
      : step === 2
        ? {
            title: "Delivery area",
            description: "Choose your main Chennai zone.",
          }
        : {
            title: "Confirm and activate",
            description: "Review details, pick cover, and start.",
          }

  async function handleActivateCover() {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "worker",
          fullName,
          phone,
          platform,
          zone,
          plan: selectedPlan,
          weeklyIncome,
          weeklyPremium: selectedPremium.weeklyPremium,
        }),
      })

      const payload = (await response.json()) as RegistrationResponse

      if (!response.ok || !payload.registrationId) {
        throw new Error(payload.message ?? "Unable to create your registration profile right now.")
      }

      setRegistrationId(payload.registrationId)
      setComplete(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create your registration profile right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (complete) {
    return (
      <main className="relative min-h-screen px-4 pb-10 pt-6 text-zinc-100 md:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="ambient-grid opacity-40" />
          <div className="ambient-orb left-[-8%] top-16 size-72 opacity-35" />
          <div className="ambient-orb bottom-[-12%] right-[-10%] size-96 opacity-25" />
        </div>

        <div className="section-wide w-full">
          <Card className="glass-shell border-emerald-300/30 bg-emerald-500/10 py-7 transition-all duration-300">
            <CardHeader className="space-y-2">
              <p className="eyebrow">Setup complete</p>
              <CardTitle className="text-3xl tracking-[-0.05em]">Welcome, {fullName}</CardTitle>
              <CardDescription className="max-w-[48ch] text-zinc-200">
                Your cover is active. You can now check risk, price, and payout status in one place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-zinc-100">
                <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">Plan</p>
                  <p className="mt-2 text-base font-semibold">{PLAN_META[selectedPlan].title}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">Weekly premium</p>
                  <p className="mt-2 text-base font-semibold">₹{formatRupees(selectedPremium.weeklyPremium)}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-300">Area score</p>
                  <p className="mt-2 text-base font-semibold">{Math.round(zoneSCI.sci)}/100</p>
                </div>
                </div>

              {registrationId ? (
                <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-xs text-zinc-300">
                  Registration ID: <span className="font-semibold text-zinc-100">{registrationId}</span>
                </div>
              ) : null}

              <Link href="/worker" className="inline-flex">
                <Button className="interactive-control rounded-full bg-white px-6 text-black transition-all duration-300 hover:bg-zinc-100">
                  Go to worker page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen px-4 pb-10 pt-6 text-zinc-100 md:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-8%] top-16 size-72 opacity-35" />
        <div className="ambient-orb bottom-[-12%] right-[-10%] size-96 opacity-25" />
      </div>

      <div className="section-wide w-full space-y-3 md:space-y-4">
        <header className="glass-shell overflow-hidden p-4 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">GigSafe onboarding</p>
              <h1 className="mt-2 text-[clamp(1.45rem,2.4vw,1.9rem)] font-semibold leading-tight tracking-[-0.05em] text-white">
                Minimal worker setup in 3 cards
              </h1>
              <p className="mt-1 text-sm text-zinc-400">Profile → area → confirm. Fast, compact, and clear.</p>
            </div>
            <div className="chip-group">
              {[1, 2, 3].map((value) => (
                <span
                  key={value}
                  className={cn(
                    "rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-zinc-300 transition-all duration-300",
                    step >= value && "border-white/35 bg-white text-black"
                  )}
                >
                  Step {value}
                </span>
              ))}
            </div>
          </div>
          <Progress value={(step / 3) * 100} className="mt-3 h-1.5 bg-white/10" />
        </header>

        <section className="grid items-start gap-4 lg:grid-cols-[1.28fr_0.88fr]">
          <Card className="glass-shell border-white/10 bg-black/35">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl tracking-[-0.03em]">{stepMeta.title}</CardTitle>
              <CardDescription className="text-zinc-400">{stepMeta.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {step === 1 ? (
                    <StepIdentity
                      fullName={fullName}
                      setFullName={setFullName}
                      phone={phone}
                      setPhone={setPhone}
                      platform={platform}
                      setPlatform={setPlatform}
                    />
                  ) : null}

                  {step === 2 ? (
                    <StepDeliveryArea
                      zone={zone}
                      setZone={setZone}
                    />
                  ) : null}

                  {step === 3 ? (
                    <StepConfirmation
                      fullName={fullName}
                      phone={phone}
                      platform={platform}
                      zone={zone}
                      selectedPlan={selectedPlan}
                      setSelectedPlan={setSelectedPlan}
                      standardPremium={standardPremium.formulaWeeklyPremium}
                      selectedPremium={selectedPremium.weeklyPremium}
                      zoneScore={Math.round(zoneSCI.sci)}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <Button
                  variant="ghost"
                  disabled={step === 1}
                  onClick={() => setStep((value) => Math.max(1, value - 1))}
                  className="interactive-control rounded-full border border-white/15 px-4 text-zinc-200 transition-all duration-300 disabled:opacity-40"
                >
                  Back
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={() => setStep((value) => Math.min(3, value + 1))}
                    className="interactive-control rounded-full bg-white px-5 text-black transition-all duration-300 hover:bg-zinc-100"
                  >
                    Continue
                  </Button>
                ) : (
                  <div className="space-y-1 text-right">
                    {submitError ? <p className="text-xs text-red-300">{submitError}</p> : null}
                    <Button
                      onClick={handleActivateCover}
                      disabled={isSubmitting}
                      className="interactive-control rounded-full bg-white px-5 text-black transition-all duration-300 hover:bg-zinc-100 disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating profile..." : "Start my cover"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-shell border-white/10 bg-black/35">
            <CardHeader className="space-y-2 pb-3">
              <p className="eyebrow">Premium snapshot</p>
              <CardTitle className="text-3xl tracking-[-0.05em]">
                ₹{formatRupees(selectedPremium.weeklyPremium)}
                <span className="ml-1 text-base font-normal text-zinc-400">/week</span>
              </CardTitle>
              <CardDescription className="text-zinc-400">Live quote updates with your app, area, and cover.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <ul className="space-y-2 text-[13px]">
                  <li className="flex items-center justify-between">
                    <span className="text-zinc-400">Area factor</span>
                    <span>×{standardPremium.zoneMultiplier.toFixed(2)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-zinc-400">App factor</span>
                    <span>×{standardPremium.platformMultiplier.toFixed(2)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-zinc-400">Plan factor</span>
                    <span>×{PLAN_MULTIPLIERS[selectedPlan].toFixed(2)}</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-300">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Area score</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.03em]">{Math.round(zoneSCI.sci)}/100 today</p>
                <p className="text-xs text-zinc-400">{zoneSCI.message}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-300">
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Income baseline</p>
                <p className="mt-1 text-sm font-medium text-zinc-100">₹{formatRupees(weeklyIncome)}/week</p>
                <p className="text-xs text-zinc-400">Default earnings baseline for the quick flow.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
