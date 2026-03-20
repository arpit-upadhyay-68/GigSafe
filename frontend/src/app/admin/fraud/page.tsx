const fraudQueue = [
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

function riskTone(score: number): string {
  if (score >= 0.75) {
    return "text-[#ef4444]"
  }
  if (score >= 0.6) {
    return "text-[#f59e0b]"
  }
  return "text-[#10b981]"
}

export default function FraudAdminPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin Console</p>
          <h1 className="mt-2 text-2xl font-semibold">Fraud Scoring Monitor</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Queue sorted by anomaly score. High-risk claims are isolated from auto payout.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">High Risk Cases</p>
            <p className="mt-1 text-2xl font-semibold text-[#ef4444]">6</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">Needs Review</p>
            <p className="mt-1 text-2xl font-semibold text-[#f59e0b]">11</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">Cleared</p>
            <p className="mt-1 text-2xl font-semibold text-[#10b981]">23</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold">Anomaly Queue</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400">
                  <th className="px-3 py-2">Claim ID</th>
                  <th className="px-3 py-2">Worker</th>
                  <th className="px-3 py-2">Anomaly</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {fraudQueue.map((row) => (
                  <tr key={row.claimId} className="border-b border-white/5">
                    <td className="px-3 py-3 font-medium">{row.claimId}</td>
                    <td className="px-3 py-3">{row.workerId}</td>
                    <td className="px-3 py-3 text-zinc-300">{row.anomaly}</td>
                    <td className={`px-3 py-3 font-semibold ${riskTone(row.score)}`}>{Math.round(row.score * 100)}%</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{row.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
