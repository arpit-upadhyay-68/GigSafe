type ClaimPageProps = {
  params: Promise<{
    id: string
  }>
}

const evidenceScores = [
  { label: "Location match", score: 0.94 },
  { label: "Timestamp integrity", score: 0.89 },
  { label: "Weather feed confidence", score: 0.92 },
  { label: "Traffic telemetry confidence", score: 0.78 },
]

const ruleChecks = [
  { label: "Policy active during shift", status: "pass" },
  { label: "Rainfall >= 50 mm/day OR risk >= 0.75", status: "pass" },
  { label: "Duplicate claim not found", status: "pass" },
  { label: "Manual review threshold", status: "warn" },
]

function statusClass(status: string): string {
  if (status === "pass") {
    return "text-[#10b981]"
  }
  return "text-[#f59e0b]"
}

export default async function ClaimDetailsPage({ params }: ClaimPageProps) {
  const { id: claimId } = await params
  const provisionalAmount = 560

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Claim Details</p>
          <h1 className="mt-2 text-2xl font-semibold">Claim #{claimId}</h1>
          <p className="mt-2 text-sm text-zinc-300">Status: Provisional approval with automated evidence scoring.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-[#10b981]">Auto-approved</span>
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-medium text-[#f59e0b]">Manual spot-check queued</span>
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-medium text-[#ef4444]">Fraud risk: Medium</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-lg font-semibold">Evidence Confidence</h2>
            <div className="mt-4 space-y-4">
              {evidenceScores.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span>{Math.round(item.score * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/30">
                    <div className="h-2 rounded-full bg-[#10b981]" style={{ width: `${Math.round(item.score * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <h2 className="text-lg font-semibold">Rule Engine Checks</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {ruleChecks.map((rule) => (
                <li key={rule.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span>{rule.label}</span>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${statusClass(rule.status)}`}>
                      {rule.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold">Payout Decision</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Estimated lost income: ₹800 · Coverage ratio: 70% · Provisional payout: <span className="font-semibold text-[#10b981]">₹{provisionalAmount}</span>
          </p>
        </section>
      </div>
    </main>
  )
}
