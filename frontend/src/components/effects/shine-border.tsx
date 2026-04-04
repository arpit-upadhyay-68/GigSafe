"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type ShineBorderProps = {
  className?: string
}

export function ShineBorder({ className }: ShineBorderProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] p-px", className)}
      style={{
        background:
          "linear-gradient(120deg, transparent 15%, rgba(255,255,255,0.22) 48%, transparent 82%)",
        backgroundSize: "220% 100%",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
      animate={{ backgroundPosition: ["200% 50%", "-120% 50%"] }}
      transition={{ duration: 6.4, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
    />
  )
}
