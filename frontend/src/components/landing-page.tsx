"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { DashboardPreview } from "@/components/dashboard-preview"
import { RainBackground } from "@/components/effects/rain-background"
import { Reveal } from "@/components/effects/reveal"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingPage() {
  return (
    <div className="h-screen overflow-hidden bg-background text-foreground">
      {/* Animated rain canvas */}
      <RainBackground />

      <main className="relative z-10 flex h-[calc(100vh-80px)] mt-[80px] items-center section-wide">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:gap-16">

          {/* Left: copy + CTA */}
          <Reveal className="relative space-y-7">
            {/* Subtle glow behind text for rain readability */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 -m-16 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.72)_0%,transparent_70%)]"
            />

            <div className="space-y-5">
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Predictive micro-insurance · Gig workers
              </motion.p>

              <motion.h1
                className="text-[clamp(2.4rem,4.5vw,4.2rem)] font-semibold leading-[1.0] tracking-[-0.058em] text-white"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                Shift protection,<br />
                before the storm<br />
                arrives.
              </motion.h1>

              <motion.p
                className="max-w-[40ch] text-[1.05rem] leading-[1.75] text-zinc-400"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                GigSafe scores rainfall, congestion, and AQI — then prices your coverage and estimates payout in real time.
              </motion.p>
            </div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/worker"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "interactive-control h-11 rounded-full bg-white px-7 text-[0.9rem] font-medium text-black shadow-[0_0_48px_rgba(255,255,255,0.18)] hover:bg-zinc-100 hover:shadow-[0_0_60px_rgba(255,255,255,0.22)]"
                )}
              >
                Open dashboard
                <ArrowRight className="size-4" />
              </Link>
              <span className="text-[0.82rem] text-zinc-600">No signup required</span>
            </motion.div>
          </Reveal>

          {/* Right: dashboard preview */}
          <Reveal delay={0.1}>
            <DashboardPreview />
          </Reveal>
        </div>
      </main>
    </div>
  )
}

