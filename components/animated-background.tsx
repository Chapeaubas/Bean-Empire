"use client"

import { useEffect, useRef } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Coffee bean particles
    const particles: {
      x: number
      y: number
      size: number
      speed: number
      rotation: number
      rotationSpeed: number
      opacity: number
    }[] = []

    // Create particles
    const createParticles = () => {
      const particleCount = Math.min(Math.floor(window.innerWidth / 20), 50)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 5 + Math.random() * 15,
          speed: 0.2 + Math.random() * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: 0.1 + Math.random() * 0.2,
        })
      }
    }

    createParticles()

    // Draw coffee bean
    const drawBean = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity

      // Bean shape
      ctx.beginPath()
      ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#5D4037"
      ctx.fill()

      // Bean line
      ctx.beginPath()
      ctx.moveTo(0, -size / 2)
      ctx.lineTo(0, size / 2)
      ctx.strokeStyle = "#3E2723"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particles
        particle.y += particle.speed
        particle.rotation += particle.rotationSpeed

        // Reset particles that go off screen
        if (particle.y > canvas.height + particle.size) {
          particle.y = -particle.size
          particle.x = Math.random() * canvas.width
        }

        // Draw the bean
        drawBean(particle.x, particle.y, particle.size, particle.rotation, particle.opacity)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-30" />
}
