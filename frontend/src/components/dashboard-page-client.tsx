"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowRight,
  Clock3,
  CloudRain,
  Minus,
  Plus,
  Route,
  ShieldCheck,
  Wind,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { Reveal } from "@/components/effects/reveal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { runScenarioAnalysis } from "@/lib/api"
import {
  analyzeGigSafeScenario,
  applyScenarioPreset,
  DEFAULT_SCENARIO,
  formatInr,
  getRiskTone,
  SCENARIO_PRESETS,
  type GigSafeAnalysis,
  type GigSafeScenarioInput,
} from "@/lib/gigsafe"
import { cn } from "@/lib/utils"

const chartConfig = {
  risk: {
    label: "Risk",
    color: "rgba(255,255,255,0.95)",
  },
}

type NumericField =
  | "rainfall_mm_per_hr"
  | "rainfall_mm_per_day"
  | "traffic_congestion_pct"
  | "aqi"
  | "shift_hours"
  | "expected_deliveries"
  | "earning_per_delivery_inr"

const NUMERIC_FIELD_CONFIG: Record<
  NumericField,
  { step: number; min: number; max: number }
> = {
  rainfall_mm_per_hr: { step: 1, min: 0, max: 120 },
  rainfall_mm_per_day: { step: 5, min: 0, max: 320 },
  traffic_congestion_pct: { step: 5, min: 0, max: 100 },
  aqi: { step: 5, min: 0, max: 500 },
  shift_hours: { step: 1, min: 1, max: 16 },
  expected_deliveries: { step: 1, min: 1, max: 60 },
  earning_per_delivery_inr: { step: 5, min: 10, max: 300 },
}

function clampNumericFieldValue(field: NumericField, value: number) {
  const config = NUMERIC_FIELD_CONFIG[field]
  return Math.min(Math.max(Math.round(value), config.min), config.max)
}

export function DashboardPageClient() {
  const [scenario, setScenario] = useState<GigSafeScenarioInput>(DEFAULT_SCENARIO)
  const [analysis, setAnalysis] = useState<GigSafeAnalysis>(() =>
    analyzeGigSafeScenario(DEFAULT_SCENARIO)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const riskTone = useMemo(() => getRiskTone(analysis.risk_score), [analysis.risk_score])
  const coverageFraming = useMemo(() => {
    if (analysis.payout_triggered || analysis.risk_score >= 0.55) {
      return "Coverage is easy to justify under the current premium and projected loss."
    }

    if (analysis.protection_value_ratio >= 4.5 && analysis.risk_score >= 0.22) {
      return "This is a more optional purchase, but the downside protection can still be attractive."
    }

    return "Conditions are stable enough that coverage stays optional for this shift."
  }, [
    analysis.payout_triggered,
    analysis.protection_value_ratio,
    analysis.risk_score,
  ])

  const contributorRows = useMemo(
    () => [
      {
        key: "weather",
        icon: CloudRain,
        label: "Weather dynamics",
        description: "40% weight — primary disruption signal.",
        value: analysis.weather_risk,
      },
      {
        key: "traffic",
        icon: Route,
        label: "Traffic congestion",
        description: "30% weight — route density drag.",
        value: analysis.traffic_risk,
      },
      {
        key: "air",
        icon: Wind,
        label: "Air quality index",
        description: "30% weight — fatigue exposure proxy.",
        value: analysis.air_quality_risk,
      },
    ],
    [analysis]
  )

  async function handleAnalyze(nextScenario = scenario) {
    setIsLoading(true)
    try {
      const nextAnalysis = await runScenarioAnalysis(nextScenario)
      setScenario(nextScenario)
      setAnalysis(nextAnalysis)
    } finally {
      setIsLoading(false)
    }
  }

  function updateNumericField(field: NumericField, value: string) {
    const numericValue = Number(value)
    setActivePreset(null)
    setScenario((current) => ({
      ...current,
      [field]: Number.isFinite(numericValue)
        ? clampNumericFieldValue(field, numericValue)
        : NUMERIC_FIELD_CONFIG[field].min,
    }))
  }

  function adjustNumericField(field: NumericField, direction: 1 | -1) {
    const { step } = NUMERIC_FIELD_CONFIG[field]

    setActivePreset(null)
    setScenario((current) => ({
      ...current,
      [field]: clampNumericFieldValue(field, current[field] + direction * step),
    }))
  }

  function handlePreset(presetId: string) {
    const nextScenario = applyScenarioPreset(presetId, scenario)
    setActivePreset(presetId)
    void handleAnalyze(nextScenario)
  }

  return (
    <div className="h-screen bg-background text-foreground">

      <main className="section-wide scrollbar-none h-screen overflow-y-auto pt-[58px] pb-3">
        <div className="grid gap-3 xl:grid-cols-[288px_minmax(0,1fr)] 2xl:grid-cols-[304px_minmax(0,1fr)]">
          <Reveal className="xl:sticky xl:top-0 xl:self-start xl:max-h-[calc(100vh-62px)] xl:overflow-y-auto xl:pb-1 scrollbar-none">
            <Card className="surface-card interactive-surface overflow-hidden border-white/10 bg-white/[0.055]">
              <CardHeader className="space-y-1 px-4 pt-3 pb-0">
                <p className="eyebrow">Interactive shift analysis</p>
                <CardTitle className="text-balance text-[1.1rem] leading-[1.15] font-semibold tracking-[-0.035em] text-white">
                  Edit the inputs. Watch the economics move.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-3 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow">Scenario presets</p>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                      {riskTone.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SCENARIO_PRESETS.map((preset) => (
                      <Button
                        key={preset.id}
                        type="button"
                        variant="ghost"
                        size="sm"
                        title={preset.summary}
                        onClick={() => handlePreset(preset.id)}
                        className={cn(
                          "interactive-control h-8 justify-start rounded-[0.85rem] border text-left text-[0.78rem] font-medium",
                          activePreset === preset.id
                            ? "border-white/18 bg-white/[0.09] text-white"
                            : "border-white/8 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                        )}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="-mx-0 bg-white/8" />

                <div className="space-y-1.5">
                  <p className="eyebrow">Environmental inputs</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <NumericField
                      label="Rainfall"
                      unit="mm/h"
                      value={scenario.rainfall_mm_per_hr}
                      onChange={(value) => updateNumericField("rainfall_mm_per_hr", value)}
                      onIncrement={() => adjustNumericField("rainfall_mm_per_hr", 1)}
                      onDecrement={() => adjustNumericField("rainfall_mm_per_hr", -1)}
                    />
                    <NumericField
                      label="Daily rain"
                      unit="mm"
                      value={scenario.rainfall_mm_per_day}
                      onChange={(value) => updateNumericField("rainfall_mm_per_day", value)}
                      onIncrement={() => adjustNumericField("rainfall_mm_per_day", 1)}
                      onDecrement={() => adjustNumericField("rainfall_mm_per_day", -1)}
                    />
                    <NumericField
                      label="Congestion"
                      unit="%"
                      value={scenario.traffic_congestion_pct}
                      onChange={(value) => updateNumericField("traffic_congestion_pct", value)}
                      onIncrement={() => adjustNumericField("traffic_congestion_pct", 1)}
                      onDecrement={() => adjustNumericField("traffic_congestion_pct", -1)}
                    />
                    <NumericField
                      label="Air quality"
                      unit="AQI"
                      value={scenario.aqi}
                      onChange={(value) => updateNumericField("aqi", value)}
                      onIncrement={() => adjustNumericField("aqi", 1)}
                      onDecrement={() => adjustNumericField("aqi", -1)}
                    />
                  </div>
                </div>

                <Separator className="-mx-0 bg-white/8" />

                <div className="space-y-1.5">
                  <p className="eyebrow">Shift assumptions</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <NumericField
                      label="Duration"
                      unit="h"
                      value={scenario.shift_hours}
                      onChange={(value) => updateNumericField("shift_hours", value)}
                      onIncrement={() => adjustNumericField("shift_hours", 1)}
                      onDecrement={() => adjustNumericField("shift_hours", -1)}
                    />
                    <NumericField
                      label="Deliveries"
                      unit="orders"
                      value={scenario.expected_deliveries}
                      onChange={(value) => updateNumericField("expected_deliveries", value)}
                      onIncrement={() => adjustNumericField("expected_deliveries", 1)}
                      onDecrement={() => adjustNumericField("expected_deliveries", -1)}
                    />
                    <div className="sm:col-span-2">
                      <NumericField
                        label="Per delivery"
                        unit="₹"
                        value={scenario.earning_per_delivery_inr}
                        onChange={(value) =>
                          updateNumericField("earning_per_delivery_inr", value)
                        }
                        onIncrement={() => adjustNumericField("earning_per_delivery_inr", 1)}
                        onDecrement={() => adjustNumericField("earning_per_delivery_inr", -1)}
                      />
                    </div>
                  </div>
                </div>

                <div className="interactive-control rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.82rem] font-medium text-white">Policy purchase</p>
                    </div>
                    <Switch
                      checked={scenario.policy_purchased}
                      onCheckedChange={(checked) => {
                        setActivePreset(null)
                        setScenario((current) => ({
                          ...current,
                          policy_purchased: checked,
                        }))
                      }}
                      className="shrink-0 data-checked:bg-white data-unchecked:bg-white/12"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  className="h-9 w-full rounded-full bg-white text-[0.85rem] text-black shadow-[0_16px_40px_rgba(255,255,255,0.08)] transition-all duration-200 hover:bg-zinc-100 hover:shadow-[0_20px_48px_rgba(255,255,255,0.13)] active:scale-[0.985]"
                  onClick={() => void handleAnalyze()}
                  disabled={isLoading}
                >
                  {isLoading ? "Recalculating..." : "Recalculate"}
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          <div className="space-y-3">
            <Reveal className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Disruption risk"
                value={analysis.risk_score.toFixed(2)}
                description={riskTone.summary}
                sparkline={analysis.timeline.map((point) => point.value)}
              />
              <MetricCard
                label="Daily premium"
                value={`₹${formatInr(analysis.premium_inr)}`}
                description="Cost to insure this shift."
              />
              <MetricCard
                label="Projected loss"
                value={`₹${formatInr(analysis.estimated_lost_income_inr)}`}
                description="Estimated income reduction."
              />
              <MetricCard
                label="Eligible payout"
                value={`₹${formatInr(analysis.payout_inr)}`}
                description="Settlement if trigger conditions met."
              />
            </Reveal>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.08fr)_336px]">
              <Reveal>
                <Card className="surface-card interactive-surface border-white/10 bg-white/[0.055]">
                  <CardHeader className="space-y-1 px-4 pt-4 pb-0">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="eyebrow">Risk factors</p>
                        <CardTitle className="text-balance text-[1.05rem] leading-[1.15] font-semibold tracking-[-0.035em] text-white">
                          Score is explainable at a glance.
                        </CardTitle>
                      </div>
                      <div className="w-fit rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1.5 text-[10.5px] leading-4 text-zinc-400">
                        Dominant: {analysis.dominant_factor}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5 px-4 pb-4 pt-3">
                    <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_240px]">
                      <div className="space-y-2">
                        {contributorRows.map((row) => (
                          <div
                            key={row.key}
                            className="interactive-control group rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-zinc-300",
                                  row.key === "weather" && "icon-rain",
                                  row.key === "traffic" && "icon-route",
                                  row.key === "air" && "icon-wind"
                                )}
                              >
                                <row.icon className="size-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[0.82rem] font-medium text-white">
                                    {row.label}
                                  </span>
                                  <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-zinc-400">
                                    {row.value.toFixed(2)}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-[0.7rem] leading-[1.3] text-zinc-500">
                                  {row.description}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-white/65 transition-all duration-500"
                                style={{ width: `${row.value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="interactive-control rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[0.82rem] font-medium text-white">Shift contour</p>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500">
                            <Clock3 className="size-3" />
                            {scenario.shift_hours}h
                          </div>
                        </div>
                        <div className="mt-2 h-[88px]">
                          <ChartContainer
                            className="aspect-auto h-full w-full"
                            config={chartConfig}
                          >
                            <AreaChart
                              accessibilityLayer
                              data={analysis.timeline}
                              margin={{ left: -16, right: -8, top: 6, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="riskTimeline" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                                </linearGradient>
                              </defs>
                              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                              <XAxis
                                axisLine={false}
                                dataKey="label"
                                tickLine={false}
                                tick={{ fill: "rgba(161,161,170,0.85)", fontSize: 9 }}
                              />
                              <YAxis hide domain={[0, 1]} />
                              <Area
                                dataKey="value"
                                fill="url(#riskTimeline)"
                                stroke="var(--color-risk)"
                                strokeWidth={1.8}
                                type="monotone"
                              />
                            </AreaChart>
                          </ChartContainer>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </Reveal>

              <Reveal>
                <Card
                  className={cn(
                    "surface-card interactive-surface overflow-hidden border-white/10 bg-white/[0.055]",
                    analysis.payout_triggered && "border-red-500/25"
                  )}
                >
                  <CardHeader className="space-y-1 px-4 pt-4 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="eyebrow">Payout state</p>
                        <CardTitle className="text-[1.05rem] leading-[1.15] font-semibold tracking-[-0.035em] text-white">
                          {analysis.payout_triggered ? "Payout triggered" : "Payout on standby"}
                        </CardTitle>
                      </div>
                      <div
                        className={cn(
                          "size-2.5 rounded-full border border-white/10 bg-white/25",
                          analysis.payout_triggered && "bg-red-500 shadow-[0_0_0_6px_rgba(239,68,68,0.08)]"
                        )}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5 px-4 pb-4 pt-2.5 text-[0.82rem] text-zinc-400">
                    <p className="leading-5 text-balance text-zinc-400">{analysis.trigger_reason}</p>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">Coverage ratio</span>
                        <span className="font-medium text-white">
                          {Math.round(analysis.coverage_ratio * 100)}%
                        </span>
                      </div>
                      <Separator className="my-2 bg-white/8" />
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">Protection multiple</span>
                        <span className="font-medium text-white">
                          {analysis.protection_value_ratio.toFixed(1)}x premium
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-white icon-shield">
                          <ShieldCheck className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="eyebrow">Recommendation</p>
                          <h3 className="mt-0.5 text-[0.9rem] leading-[1.4] font-semibold tracking-[-0.02em] text-white">
                            {analysis.recommendation}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-2 leading-5 text-balance text-zinc-400">{coverageFraming}</p>
                    </div>

                    <Button className="h-9 w-full rounded-full bg-white text-[0.85rem] text-black shadow-[0_16px_40px_rgba(255,255,255,0.08)] transition-all duration-200 hover:bg-zinc-100 hover:shadow-[0_20px_48px_rgba(255,255,255,0.13)] active:scale-[0.985]">
                      Authorize coverage
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

type NumericFieldProps = {
  label: string
  unit: string
  value: number
  onChange: (value: string) => void
  onIncrement: () => void
  onDecrement: () => void
}

function NumericField({
  label,
  unit,
  value,
  onChange,
  onIncrement,
  onDecrement,
}: NumericFieldProps) {
  return (
    <motion.div
      layout
      className="space-y-1.5"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-center justify-between gap-2">
        <Label className="min-w-0 truncate text-[0.78rem] font-medium tracking-tight text-zinc-300">
          {label}
        </Label>
        <span className="shrink-0 rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.18em] text-zinc-500">
          {unit}
        </span>
      </div>
      <div className="interactive-control flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-1 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus-within:border-white/18 focus-within:bg-white/[0.06]">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-6 rounded-lg border border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.09] hover:text-white"
          onClick={onDecrement}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-2.5" />
        </Button>
        <Input
          inputMode="decimal"
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
          className="h-6 flex-1 border-0 bg-transparent px-1 text-center text-[0.82rem] font-semibold tracking-[-0.03em] text-white shadow-none placeholder:text-zinc-600 focus-visible:border-transparent focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-6 rounded-lg border border-white/8 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.09] hover:text-white"
          onClick={onIncrement}
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-2.5" />
        </Button>
      </div>
    </motion.div>
  )
}

type MetricCardProps = {
  label: string
  value: string
  description: string
  sparkline?: number[]
}

function MetricCard({ label, value, description, sparkline }: MetricCardProps) {
  // Split "₹350" into currency prefix + numeric value for cleaner fintech display
  const hasCurrencyPrefix = value.startsWith("₹")
  const currencyLabel = hasCurrencyPrefix ? "₹" : null
  const displayValue = hasCurrencyPrefix ? value.slice(1) : value

  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.24 }}>
      <Card className="surface-card border-white/10 bg-white/[0.055]">
        <CardContent className="flex flex-col px-4 py-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{label}</p>
              <div className="mt-1.5 flex items-baseline gap-1">
                {currencyLabel && (
                  <span className="metric-currency">{currencyLabel}</span>
                )}
                <motion.p
                  key={value}
                  initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="metric-value-fluid font-semibold text-white"
                >
                  {displayValue}
                </motion.p>
              </div>
            </div>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-zinc-400">
              <Activity className="size-3" />
            </div>
          </div>
          {description ? (
            <p className="mt-1.5 text-[0.75rem] leading-[1.45] text-zinc-500">
              {description}
            </p>
          ) : null}
          {sparkline ? (
            <div className="mt-2 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sparkline.map((entry, index) => ({
                    label: index,
                    value: entry,
                  }))}
                  margin={{ left: 0, right: 0, top: 2, bottom: 0 }}
                >
                  <Line
                    dataKey="value"
                    dot={false}
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth={1.4}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}

