import {
  GigSafeWordmark,
  LogoCoverageRings,
  LogoDomeGuard,
  LogoGSMark,
  LogoHexSignal,
  LogoNodeNetwork,
  LogoPulseLine,
  LogoRainChart,
  LogoRiskMatrix,
  LogoShieldSignal,
  LogoSignalTower,
  LogoShieldGraph,
  LogoShieldPulse,
  LogoShieldNodes,
} from "@/components/logos/gigsafe-logos"

const LOGOS = [
  {
    n: 1,
    name: "Shield Signal",
    badge: "★ HEADER",
    concept: "Insurance shield",
    desc: "Classic heraldic shield with 3 nested upward signal arcs and a source dot. The most direct union of protection and predictive analytics. Works at 16px favicon size.",
    Component: LogoShieldSignal,
  },
  {
    n: 11,
    name: "Shield Graph",
    badge: "NEW",
    concept: "Protected growth",
    desc: "Shield outline containing a rising line graph. Symbolizes the core promise: protecting your earnings trajectory from disruption.",
    Component: LogoShieldGraph,
  },
  {
    n: 12,
    name: "Shield Pulse",
    badge: "NEW",
    concept: "Live coverage",
    desc: "Shield outline containing a vital pulse trace. Represents real-time monitoring of risk and financial health protection.",
    Component: LogoShieldPulse,
  },
  {
    n: 13,
    name: "Shield Nodes",
    badge: "NEW",
    concept: "Connected protection",
    desc: "Shield outline containing connected data nodes. Symbolizes the AI network that predicts risk to keep you safe.",
    Component: LogoShieldNodes,
  },
  {
    n: 2,
    name: "Rain Chart",
    badge: "",
    concept: "Weather → analytics",
    desc: "Raindrop silhouette containing 3 ascending bar-chart columns. A weather event literally becomes data — exactly what the GigSafe risk engine does.",
    Component: LogoRainChart,
  },
  {
    n: 3,
    name: "Coverage Rings",
    badge: "",
    concept: "Coverage radius",
    desc: "Center dot radiating 3 dashed concentric rings. Like GPS satellite coverage or radar sweep — visualises the idea of a protection zone expanding around a worker.",
    Component: LogoCoverageRings,
  },
  {
    n: 4,
    name: "Signal Tower",
    badge: "",
    concept: "Monitoring station",
    desc: "Antenna mast with 3 broadcast arcs and rain-drop dots below. A weather monitoring station broadcasting coverage — the sensor layer of the risk engine.",
    Component: LogoSignalTower,
  },
  {
    n: 5,
    name: "Pulse Line",
    badge: "",
    concept: "Income vitals",
    desc: "ECG heartbeat trace spanning the full mark. Monitoring the financial health of gig workers in real time — income as a live vital signal.",
    Component: LogoPulseLine,
  },
  {
    n: 6,
    name: "Dome Guard",
    badge: "",
    concept: "Physical shelter",
    desc: "Two nested arc domes arching over a worker dot on a ground horizon. The clearest single-frame metaphor for being covered — shelter in the storm.",
    Component: LogoDomeGuard,
  },
  {
    n: 7,
    name: "Hex Signal",
    badge: "",
    concept: "Fintech badge",
    desc: "Flat-top hexagon outline with 3 ascending signal bars inside. A professional credentialing badge — the fintech aesthetic of an insurance standard.",
    Component: LogoHexSignal,
  },
  {
    n: 8,
    name: "Node Network",
    badge: "",
    concept: "AI data network",
    desc: "Four interconnected diamond nodes inside an orbit ring. The AI risk-prediction engine — every environmental sensor feeds into the decision network.",
    Component: LogoNodeNetwork,
  },
  {
    n: 9,
    name: "Risk Matrix",
    badge: "",
    concept: "Heat-map score",
    desc: "A 3×3 dot grid where opacity maps to risk level (low bottom-left → high top-right). Makes the disruption risk score concept visually immediate at icon scale.",
    Component: LogoRiskMatrix,
  },
  {
    n: 10,
    name: "GS Mark",
    badge: "",
    concept: "Brand lettermark",
    desc: "Clean GS lettermark inside a circle. Professional corporate-identity mark — works as social avatar, app icon, or secondary brand stamp.",
    Component: LogoGSMark,
  },
] as const

function compactDescription(description: string): string {
  const firstPeriodIndex = description.indexOf(".")
  if (firstPeriodIndex === -1) {
    return description
  }
  return description.slice(0, firstPeriodIndex + 1)
}

export default function LogosPage() {
  return (
    <main className="relative min-h-screen px-3 pb-6 pt-4 text-zinc-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="ambient-grid opacity-40" />
        <div className="ambient-orb left-[-10%] top-20 size-72 opacity-30" />
        <div className="ambient-orb bottom-[-14%] right-[-10%] size-[28rem] opacity-25" />
      </div>

      <section className="section-wide grid gap-3">
        <header className="glass-shell interactive-surface border-white/10 bg-black/35 p-4 md:p-5">
          <p className="eyebrow">GigSafe brand identity</p>
          <h1 className="mt-1 text-[clamp(1.4rem,2.5vw,1.9rem)] font-semibold tracking-[-0.05em] text-white">
            Logo concept gallery
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-5 text-zinc-400">
            Monochrome SVG marks built on <code className="text-zinc-300">currentColor</code>, shown in dark and light contexts for fast investor review.
          </p>
        </header>

        <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {LOGOS.map(({ n, name, badge, concept, desc, Component }) => (
            <article
              key={n}
              className="glass-shell interactive-surface overflow-hidden border-white/10 bg-black/35"
            >
              <div className="grid grid-cols-2 border-b border-white/8">
                <div className="flex min-h-24 flex-col items-center justify-center gap-2 bg-black/35 px-2 py-3">
                  <Component size={38} />
                  <div className="flex items-end gap-1.5 opacity-55">
                    <Component size={10} />
                    <Component size={14} />
                    <Component size={18} />
                    <Component size={22} />
                  </div>
                </div>
                <div className="flex min-h-24 items-center justify-center border-l border-white/8 bg-zinc-100 px-2 py-3" style={{ color: "#09090b" }}>
                  <Component size={26} />
                </div>
              </div>

              <div className="border-b border-white/8 px-2.5 py-2">
                <GigSafeWordmark size={14} variant={n as 1} />
              </div>

              <div className="space-y-1 px-2.5 pb-2.5 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium tracking-[-0.01em] text-white">
                    {n}. {name}
                  </p>
                  {badge ? (
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.17em] text-zinc-300">
                      {badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-[0.67rem] font-medium uppercase tracking-[0.17em] text-zinc-500">
                  {concept}
                </p>
                <p className="text-xs leading-4 text-zinc-400" title={desc}>
                  {compactDescription(desc)}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="glass-shell interactive-surface border-white/10 bg-black/35 p-4">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
            <div>
              <p className="eyebrow">Wordmark strip</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {LOGOS.map(({ n, Component }) => (
                  <div
                    key={n}
                    className="interactive-control flex items-center gap-1.5 rounded-full border border-white/8 bg-black/20 px-2.5 py-1"
                  >
                    <Component size={14} />
                    <span className="text-[0.7rem] font-semibold tracking-tight text-zinc-100">GigSafe</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium tracking-[-0.01em] text-white">Recommended shortlist</p>
              <ul className="mt-2 space-y-1.5 text-sm text-zinc-400">
                <li>
                  <span className="font-medium text-zinc-200">1 Shield Signal</span> — clearest insurance + predictive analytics message.
                </li>
                <li>
                  <span className="font-medium text-zinc-200">2 Rain Chart</span> — strongest weather-to-data narrative for demos.
                </li>
                <li>
                  <span className="font-medium text-zinc-200">6 Dome Guard</span> — most intuitive emotional “shelter” metaphor.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

