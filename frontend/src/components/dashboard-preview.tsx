"use client"

import { motion } from "framer-motion"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { ShineBorder } from "@/components/effects/shine-border"
import { analyzeGigSafeScenario, DEFAULT_SCENARIO } from "@/lib/gigsafe"

const preview = analyzeGigSafeScenario(DEFAULT_SCENARIO)

export function DashboardPreview() {
  return (
    <motion.div
      className="relative [perspective:1800px]"
      initial={{ opacity: 0, scale: 0.98, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotateX: 2, rotateY: -3 }}
      whileTap={{ scale: 0.995 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="interactive-surface relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-zinc-950/88 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <ShineBorder className="opacity-55" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
          animate={{ x: ["-8%", "8%", "-8%"], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-white/55" />
            <span className="size-2 rounded-full bg-white/30" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
          <div className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Live dashboard preview
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="interactive-control rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
            <p className="eyebrow mb-4">Shift inputs</p>
            <div className="space-y-3 text-sm text-zinc-300">
              {[
                ["Rainfall", `${DEFAULT_SCENARIO.rainfall_mm_per_hr} mm/h`],
                ["Congestion", `${DEFAULT_SCENARIO.traffic_congestion_pct}%`],
                ["AQI", `${DEFAULT_SCENARIO.aqi}`],
                ["Duration", `${DEFAULT_SCENARIO.shift_hours} hours`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="interactive-control flex items-center justify-between rounded-2xl border border-white/8 bg-black/30 px-3 py-2"
                >
                  <span className="text-zinc-500">{label}</span>
                  <span className="font-medium text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Disruption risk", preview.risk_score.toFixed(2)],
                ["Daily premium", `₹${preview.premium_inr}`],
                ["Projected loss", `₹${preview.estimated_lost_income_inr}`],
                ["Potential payout", `₹${preview.payout_inr}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="interactive-control rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4"
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.24em] text-zinc-500">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="interactive-control rounded-[1.35rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Live shift profile</p>
                <p className="text-xs text-zinc-500">Risk contour over time</p>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={preview.timeline}
                    margin={{ left: -20, right: -12, top: 8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="previewRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.65)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                      axisLine={false}
                      dataKey="label"
                      tickLine={false}
                      tick={{ fill: "rgba(161,161,170,0.8)", fontSize: 11 }}
                    />
                    <YAxis hide domain={[0, 1]} />
                    <Area
                      dataKey="value"
                      fill="url(#previewRisk)"
                      stroke="rgba(255,255,255,0.92)"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
