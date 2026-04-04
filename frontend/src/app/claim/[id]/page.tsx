type ClaimPageProps = {
  params: Promise<{
    id: string
  }>
}

type RuleStatus = "pass" | "warn"

const evidenceScores = [
  { label: "Location match", score: 0.94 },
  { label: "Timestamp integrity", score: 0.89 },
  { label: "Weather feed confidence", score: 0.92 },
  { label: "Traffic telemetry confidence", score: 0.78 },
]

const ruleChecks: Array<{
  label: string
  status: RuleStatus
}> = [
  { label: "Policy active during shift", status: "pass" },
  { label: "Rainfall >= 50 mm/day OR risk >= 0.75", status: "pass" },
  { label: "Duplicate claim not found", status: "pass" },
  { label: "Manual review threshold", status: "warn" },
]

function statusBadgeClass(status: RuleStatus): string {
  if (status === "pass") {
    return "bg-emerald-500/14 text-emerald-300"
  }
  return "bg-amber-500/14 text-amber-300"
}

export default async function ClaimDetailsPage({ params }: ClaimPageProps) {
  const { id: claimId } = await params
  const estimatedLostIncome = 800
  const coverageRatio = 0.7
  const provisionalAmount = Math.round(estimatedLostIncome * coverageRatio)

  return (
    <main className="relative min-h-screen px-3 pb-6 pt-4 text-zinc-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <section className="section-wide grid gap-3">
        <section className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr]">
          <header className="glass-shell interactive-surface border-white/10 bg-black/35 p-4 md:p-5">
            <p className="eyebrow">Claim details</p>
            <h1 className="mt-1 text-[clamp(1.4rem,2.5vw,1.9rem)] font-semibold tracking-[-0.05em] text-white">
              Claim #{claimId}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Provisional approval generated from automated evidence and parametric checks.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-emerald-500/14 px-2 py-1 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-emerald-300">
                Auto-approved
              </span>
              <span className="rounded-full bg-amber-500/14 px-2 py-1 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-amber-300">
                Spot-check queued
              </span>
              <span className="rounded-full bg-red-500/14 px-2 py-1 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-red-300">
                Fraud risk medium
              </span>
            </div>
          </header>

          <aside className="glass-shell interactive-surface border-white/10 bg-black/35 p-4">
            <h2 className="text-sm font-semibold tracking-[-0.02em] text-white">Payout decision</h2>
            <dl className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <div className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Lost income</dt>
                <dd className="mt-1 text-base font-semibold tracking-[-0.03em] text-zinc-100">₹{estimatedLostIncome}</dd>
              </div>
              <div className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Coverage ratio</dt>
                <dd className="mt-1 text-base font-semibold tracking-[-0.03em] text-zinc-100">
                  {Math.round(coverageRatio * 100)}%
                </dd>
              </div>
              <div className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Provisional payout</dt>
                <dd className="mt-1 text-base font-semibold tracking-[-0.03em] text-emerald-300">₹{provisionalAmount}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="grid gap-3 xl:grid-cols-2">
          <article className="glass-shell interactive-surface border-white/10 bg-black/35 p-4">
            <h2 className="text-sm font-semibold tracking-[-0.02em] text-white">Evidence confidence</h2>
            <ul className="mt-3 grid gap-2">
              {evidenceScores.map((item) => (
                <li
                  key={item.label}
                  className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{item.label}</span>
                    <span className="font-medium text-emerald-300">{Math.round(item.score * 100)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-emerald-400 transition-[width] duration-500"
                      style={{ width: `${Math.round(item.score * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-shell interactive-surface border-white/10 bg-black/35 p-4">
            <h2 className="text-sm font-semibold tracking-[-0.02em] text-white">Rule engine checks</h2>
            <ul className="mt-3 grid gap-2 text-sm">
              {ruleChecks.map((rule) => (
                <li
                  key={rule.label}
                  className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-300">{rule.label}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[0.63rem] font-medium uppercase tracking-[0.14em] ${statusBadgeClass(rule.status)}`}
                    >
                      {rule.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  )
}
