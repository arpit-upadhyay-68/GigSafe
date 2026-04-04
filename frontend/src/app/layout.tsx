import type { Metadata } from "next"

import { TooltipProvider } from "@/components/ui/tooltip"
import { NavProvider } from "./nav-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "GigSafe",
  description:
    "GigSafe is a predictive micro-insurance interface for gig workers, pricing each shift from operational risk and payout readiness.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
        style={
          {
            "--font-inter": "ui-sans-serif, system-ui, sans-serif",
            "--font-jetbrains": "ui-monospace, SFMono-Regular, monospace",
          } as React.CSSProperties
        }
      >
        <TooltipProvider>
          <NavProvider />
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
