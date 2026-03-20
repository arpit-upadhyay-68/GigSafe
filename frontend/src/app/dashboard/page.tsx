const workerSummary = {
  workerId: "GW-CHN-2219",
  shift: "Lunch Shift · 11:30 - 15:30",
  city: "Chennai",
  riskScore: 0.78,
  premium: 39,
  expectedIncome: 875,
  status: "high",
}

const payoutHistory = [
  { date: "2026-03-17", reason: "Rainfall Trigger", amount: 420, status: "paid" },
  { date: "2026-03-11", reason: "Traffic Congestion", amount: 280, status: "paid" },
  { date: "2026-03-03", reason: "AQI Spike", amount: 190, status: "review" },
]

const riskSegments = [
  { label: "Weather", value: 0.86, color: "#ef4444" },
  { label: "Traffic", value: 0.73, color: "#f59e0b" },
  { label: "AQI", value: 0.62, color: "#10b981" },
]

function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function statusPill(status: "paid" | "review"): string {
  if (status === "paid") {
    return "bg-emerald-500/15 text-[#10b981]"
  }
  return "bg-amber-500/15 text-[#f59e0b]"
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">GigSafe Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold">Shift Risk Overview</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Worker {workerSummary.workerId} · {workerSummary.city} · {workerSummary.shift}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-zinc-400">Risk Score</p>
              <p className="mt-1 text-2xl font-bold text-[#ef4444]">{percent(workerSummary.riskScore)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-zinc-400">Premium</p>
              <p className="mt-1 text-2xl font-bold text-[#f59e0b]">₹{workerSummary.premium}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-zinc-400">Expected Income</p>
              <p className="mt-1 text-2xl font-bold text-[#10b981]">₹{workerSummary.expectedIncome}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-lg font-semibold">Risk Composition</h2>
            <div className="mt-4 space-y-4">
              {riskSegments.map((segment) => (
                <div key={segment.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{segment.label}</span>
                    <span>{percent(segment.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/30">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: percent(segment.value), backgroundColor: segment.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-lg font-semibold">Recent Payouts</h2>
            <div className="mt-4 space-y-3">
              {payoutHistory.map((row) => (
                <div key={`${row.date}-${row.reason}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{row.reason}</p>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusPill(row.status)}`}>
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400">{row.date}</p>
                  <p className="mt-1 text-lg font-semibold">₹{row.amount}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}
