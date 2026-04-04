type SignalStatus = "up" | "slow" | "down"

const fallbackSignals: Array<{
  signal: string
  status: SignalStatus
  source: string
  confidence: string
}> = [
  { signal: "Weather API", status: "down", source: "Cached 15-min window", confidence: "Low" },
  { signal: "Traffic Feed", status: "slow", source: "Provider B mirror", confidence: "Medium" },
  { signal: "AQI Feed", status: "up", source: "Primary", confidence: "High" },
]

function signalTone(status: SignalStatus): string {
  if (status === "up") {
    return "text-emerald-300"
  }
  if (status === "slow") {
    return "text-amber-300"
  }
  return "text-red-300"
}

function signalBadge(status: SignalStatus): string {
  if (status === "up") {
    return "bg-emerald-500/14"
  }
  if (status === "slow") {
    return "bg-amber-500/14"
  }
  return "bg-red-500/14"
}

export default function DegradedClaimPage() {
  return (
    <main className="relative min-h-screen px-3 pb-6 pt-4 text-zinc-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <section className="section-wide grid gap-3">
        <section className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
          <header className="glass-shell interactive-surface border-red-500/25 bg-black/35 p-4 md:p-5">
            <p className="eyebrow">Degraded mode</p>
            <h1 className="mt-1 text-[clamp(1.4rem,2.5vw,1.9rem)] font-semibold tracking-[-0.05em] text-red-300">
              Fallback claim pipeline
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              External telemetry is unstable. Claims are temporarily priced from cached windows and backup feeds.
            </p>
          </header>

          <dl className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            <div className="interactive-control rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Fallback confidence</dt>
              <dd className="mt-1 text-xl font-semibold tracking-[-0.04em] text-amber-300">68%</dd>
            </div>
            <div className="interactive-control rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Manual review queue</dt>
              <dd className="mt-1 text-xl font-semibold tracking-[-0.04em] text-red-300">14 claims</dd>
            </div>
            <div className="interactive-control rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <dt className="text-[0.66rem] uppercase tracking-[0.14em] text-zinc-500">Interim cap</dt>
              <dd className="mt-1 text-xl font-semibold tracking-[-0.04em] text-emerald-300">₹350</dd>
            </div>
          </dl>
        </section>

        <section className="glass-shell interactive-surface border-white/10 bg-black/35 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-[-0.02em] text-white">Signal health</h2>
            <p className="text-xs text-zinc-500">Fallback source monitor</p>
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {fallbackSignals.map((item) => (
              <li
                key={item.signal}
                className="interactive-control rounded-xl border border-white/8 bg-black/20 px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-100">{item.signal}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.14em] ${signalBadge(item.status)} ${signalTone(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-300">Source: {item.source}</p>
                <p className="text-xs text-zinc-500">Confidence: {item.confidence}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  )
}
