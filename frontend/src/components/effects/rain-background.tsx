"use client"

import { useEffect, useRef } from "react"

type Drop = {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

export function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const drops: Drop[] = []
    const init = () => {
      drops.length = 0
      for (let i = 0; i < 160; i++) {
        drops.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: 1.5 + Math.random() * 2.8,
          length: 12 + Math.random() * 18,
          opacity: 0.06 + Math.random() * 0.16,
        })
      }
    }
    init()
    window.addEventListener("resize", init)

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const d of drops) {
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${d.opacity})`
        ctx.lineWidth = 0.7
        // Slight diagonal — rain falls at ~5° angle
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.length * 0.08, d.y + d.length)
        ctx.stroke()
        d.y += d.speed
        if (d.y > canvas.height + d.length) {
          d.y = -d.length
          d.x = Math.random() * canvas.width
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("resize", init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
