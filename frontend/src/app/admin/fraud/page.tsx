import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type QueueAction = "Escalate" | "Review" | "Observe"

const fraudQueue: Array<{
  claimId: string
  workerId: string
  anomaly: string
  score: number
  action: QueueAction
}> = [
  {
    claimId: "CLM-8821",
    workerId: "GW-CHN-113",
    anomaly: "Timestamp cluster collision",
    score: 0.81,
    action: "Escalate",
  },
  {
    claimId: "CLM-8813",
    workerId: "GW-CHN-540",
    anomaly: "GPS drift beyond radius",
    score: 0.66,
    action: "Review",
  },
  {
    claimId: "CLM-8792",
    workerId: "GW-CHN-044",
    anomaly: "Duplicate weather trigger chain",
    score: 0.54,
    action: "Observe",
  },
]

const EXECUTIVE_METRICS = [
  { label: "Escalations", value: "6", note: "Immediate hold", tone: "text-red-300" },
  { label: "Manual review", value: "11", note: "Analyst queue", tone: "text-amber-300" },
  { label: "Cleared", value: "23", note: "Release approved", tone: "text-emerald-300" },
  { label: "Median SLA", value: "14m", note: "Review turnaround", tone: "text-zinc-100" },
] as const

const EXECUTIVE_INSIGHTS = [
  "Two claims crossed 80% anomaly confidence in the last hour.",
  "Timestamp and GPS anomalies account for most interventions.",
  "No payout release breached the 20-minute analyst response target.",
]

function riskTone(score: number): string {
  if (score >= 0.75) {
    return "text-red-300"
  }
  if (score >= 0.6) {
    return "text-amber-300"
  }
  return "text-emerald-300"
}

function riskBarClass(score: number): string {
  if (score >= 0.75) {
    return "bg-red-400"
  }
  if (score >= 0.6) {
    return "bg-amber-400"
  }
  return "bg-emerald-400"
}

function actionClass(action: QueueAction): string {
  if (action === "Escalate") {
    return "bg-red-500/14 text-red-300"
  }
  if (action === "Review") {
    return "bg-amber-500/14 text-amber-300"
  }
  return "bg-emerald-500/14 text-emerald-300"
}

export default function FraudOperationsPage() {
  return (
    <main className="relative min-h-screen px-4 pb-6 pt-5 text-zinc-100 md:px-8 md:pt-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <div className="section-wide mx-auto max-w-7xl space-y-3">
        <header className="glass-shell interactive-surface border-white/10 bg-black/35 p-4 md:p-5">
          <div className="grid gap-3 xl:grid-cols-[1.24fr_1fr]">
            <div>
              <p className="eyebrow">Operations console</p>
              <h1 className="mt-1 text-[clamp(1.4rem,2.3vw,1.9rem)] font-semibold tracking-[-0.05em] text-white">
                Fraud operations monitor
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                One-screen command view of queue quality, intervention load, and payout-protection posture.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-3">
              <p className="text-[0.66rem] uppercase tracking-[0.16em] text-zinc-500">Portfolio posture</p>
              <p className="mt-1 text-[1.4rem] font-semibold leading-tight tracking-[-0.045em] text-white">
                89% of high-risk claims blocked pre-release
              </p>
              <p className="mt-1 text-xs text-zinc-400">Guardrails are stable with no SLA overrun in this review cycle.</p>
              <Badge className="mt-2 border border-emerald-500/40 bg-emerald-500/15 text-emerald-300">Guardrails active</Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-3 xl:h-[calc(100vh-14.5rem)] xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3 xl:min-h-0">
            <section className="grid gap-2.5 sm:grid-cols-2">
              {EXECUTIVE_METRICS.map((metric) => (
                <div key={metric.label} className="interactive-control rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
                  <p className="text-[0.66rem] uppercase tracking-[0.15em] text-zinc-500">{metric.label}</p>
                  <p className={`mt-1 text-[1.4rem] font-semibold tracking-[-0.045em] ${metric.tone}`}>{metric.value}</p>
                  <p className="text-[0.68rem] text-zinc-500">{metric.note}</p>
                </div>
              ))}
            </section>

            <Card className="glass-shell interactive-surface border-white/10 bg-black/35 xl:flex xl:min-h-0 xl:flex-col">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm tracking-[-0.02em] text-white">Operational insights</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Analyst highlights for this cycle</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 p-3 pt-1 xl:min-h-0 xl:overflow-y-auto">
                {EXECUTIVE_INSIGHTS.map((insight) => (
                  <div key={insight} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-zinc-300">
                    {insight}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="glass-shell interactive-surface border-white/10 bg-black/35 xl:flex xl:min-h-0 xl:flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <CardTitle className="text-sm tracking-[-0.02em] text-white">Anomaly queue</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Sorted by confidence score for immediate analyst action.
                  </CardDescription>
                </div>
                <p className="text-xs text-zinc-500">{fraudQueue.length} highlighted cases</p>
              </div>
            </CardHeader>

            <CardContent className="pt-0 xl:min-h-0 xl:flex-1">
              <div className="overflow-x-auto rounded-xl border border-white/10 xl:h-full xl:overflow-y-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-black/80 backdrop-blur">
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                      <th className="px-3 py-2 font-medium">Claim ID</th>
                      <th className="px-3 py-2 font-medium">Worker</th>
                      <th className="px-3 py-2 font-medium">Anomaly</th>
                      <th className="px-3 py-2 font-medium">Score</th>
                      <th className="px-3 py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudQueue.map((row) => (
                      <tr key={row.claimId} className="border-b border-white/5 transition-colors duration-300 hover:bg-white/[0.03]">
                        <td className="px-3 py-2.5 font-medium text-zinc-100">{row.claimId}</td>
                        <td className="px-3 py-2.5 text-zinc-300">{row.workerId}</td>
                        <td className="px-3 py-2.5 text-zinc-300">{row.anomaly}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${riskTone(row.score)}`}>{Math.round(row.score * 100)}%</span>
                            <div className="h-1.5 w-14 rounded-full bg-white/10">
                              <div
                                className={`h-1.5 rounded-full ${riskBarClass(row.score)}`}
                                style={{ width: `${Math.round(row.score * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`rounded-full px-2 py-1 text-[0.66rem] font-medium uppercase tracking-[0.08em] ${actionClass(row.action)}`}
                          >
                            {row.action}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
