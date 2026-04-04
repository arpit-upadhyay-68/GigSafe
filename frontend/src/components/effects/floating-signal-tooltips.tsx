"use client"

import { motion } from "framer-motion"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const signalMarkers = [
  {
    label: "Rainfall",
    description: "Environmental signal calibration for rainfall intensity and daily accumulation.",
    className: "left-4 top-8",
    duration: 5.4,
  },
  {
    label: "Traffic",
    description: "Urban congestion pressure that compresses route velocity during a live shift.",
    className: "right-10 top-18",
    duration: 6.2,
  },
  {
    label: "AQI",
    description: "Air quality strain used as an operational fatigue proxy in the local simulator.",
    className: "bottom-12 left-14",
    duration: 5.8,
  },
]

export function FloatingSignalTooltips() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block">
      {signalMarkers.map((marker, index) => (
        <Tooltip key={marker.label}>
          <TooltipTrigger
            className={cn(
              "pointer-events-auto absolute rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[11px] font-medium text-zinc-200 shadow-lg shadow-black/40 backdrop-blur-sm transition-colors hover:bg-white/[0.06]",
              marker.className
            )}
          >
            <motion.span
              className="block"
              animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
              transition={{
                duration: marker.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {marker.label}
            </motion.span>
          </TooltipTrigger>
          <TooltipContent className="max-w-52 border border-white/10 bg-zinc-950/90 text-zinc-100 shadow-2xl">
            {marker.description}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
