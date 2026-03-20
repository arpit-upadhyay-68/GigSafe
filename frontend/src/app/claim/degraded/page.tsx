const fallbackSignals = [
  { signal: "Weather API", status: "down", source: "Cached 15-min window", confidence: "Low" },
  { signal: "Traffic Feed", status: "slow", source: "Provider B mirror", confidence: "Medium" },
  { signal: "AQI Feed", status: "up", source: "Primary", confidence: "High" },
]

function signalTone(status: string): string {
  if (status === "up") {
    return "text-[#10b981]"
  }
  if (status === "slow") {
    return "text-[#f59e0b]"
  }
  return "text-[#ef4444]"
}

export default function DegradedClaimPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="rounded-2xl border border-red-500/30 bg-[#111827] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Degraded Mode</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#ef4444]">Claim Pipeline Under Fallback</h1>
          <p className="mt-2 text-sm text-zinc-300">
            External telemetry instability detected. Claim scoring is using fallback providers and cached windows.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-[#111827] p-6">
          <h2 className="text-lg font-semibold">Signal Health</h2>
          <div className="mt-4 space-y-3">
            {fallbackSignals.map((item) => (
              <div key={item.signal} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{item.signal}</p>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${signalTone(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-300">Source: {item.source}</p>
                <p className="text-sm text-zinc-400">Confidence: {item.confidence}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">Fallback Confidence</p>
            <p className="mt-1 text-2xl font-semibold text-[#f59e0b]">68%</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">Manual Review Queue</p>
            <p className="mt-1 text-2xl font-semibold text-[#ef4444]">14 claims</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-zinc-400">Interim Cap</p>
            <p className="mt-1 text-2xl font-semibold text-[#10b981]">₹350</p>
          </div>
        </section>
      </div>
    </main>
  )
}
