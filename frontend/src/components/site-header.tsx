"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type NavMode = "worker" | "admin"

const WORKER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/worker", label: "My Dashboard" },
  { href: "/policy", label: "My Policy" },
  { href: "/premium", label: "Calculator" },
  { href: "/claims", label: "Claims" },
] as const

const ADMIN_LINKS = [
  { href: "/admin/fraud", label: "Fraud Monitor" },
  { href: "/admin/analytics", label: "Analytics" },
] as const

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/worker") {
    return pathname === "/worker" || pathname.startsWith("/dashboard")
  }
  if (href === "/claims") {
    return pathname === "/claims" || pathname.startsWith("/claim")
  }
  if (href === "/") {
    return pathname === "/"
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [viewOverride, setViewOverride] = useState<NavMode>("worker")
  const mode: NavMode = pathname.startsWith("/admin") ? "admin" : viewOverride
  const links = mode === "worker" ? WORKER_LINKS : ADMIN_LINKS

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="section-wide px-0">
        <div className="glass-shell transition-[border-color,background-color,box-shadow] duration-300">
          <div className="flex min-h-14 flex-wrap items-center gap-2 px-3 py-2 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/"
                className="flex shrink-0 items-center opacity-95 transition-opacity duration-200 hover:opacity-100"
              >
            {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="GigSafe" className="h-8 w-auto" />
              </Link>
              <nav className="hidden md:flex" aria-label="Primary">
                <div className="chip-group">
                  {links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "chip-control text-[0.8rem]",
                        isActivePath(pathname, item.href) && "chip-control-active"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <div className="chip-group">
                <Button
                  variant="ghost"
                  size="sm"
                  aria-pressed={mode === "worker"}
                  onClick={() => setViewOverride("worker")}
                  className={cn(
                    "chip-control h-7 rounded-full border border-transparent px-2.5 text-[0.74rem] hover:bg-white/10",
                    mode === "worker" && "chip-control-active border-white/20 text-black hover:bg-white"
                  )}
                >
                  Worker
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-pressed={mode === "admin"}
                  onClick={() => setViewOverride("admin")}
                  className={cn(
                    "chip-control h-7 rounded-full border border-transparent px-2.5 text-[0.74rem] hover:bg-white/10",
                    mode === "admin" && "chip-control-active border-white/20 text-black hover:bg-white"
                  )}
                >
                  Operations
                </Button>
              </div>
            </div>

            <nav className="flex w-full md:hidden" aria-label="Primary mobile">
              <div className="chip-group scrollbar-none w-full justify-start overflow-x-auto">
                {links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "chip-control shrink-0 px-2.5 py-1 text-[0.74rem]",
                      isActivePath(pathname, item.href) && "chip-control-active"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
