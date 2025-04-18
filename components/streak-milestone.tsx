"use client"

import { useState, useEffect } from "react"
import { Award, Star, Gift, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface StreakMilestoneProps {
  days: number
  reward: number
  onClose: () => void
  onClaim: () => void
}

export default function StreakMilestone({ days, reward, onClose, onClaim }: StreakMilestoneProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; size: number; angle: number }[]>([])

  // Generate confetti effect
  useEffect(() => {
    const particles = []
    const colors = ["#FFD700", "#FFA500", "#FF8C00", "#FF7F50", "#FF6347"]

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: 50 + (Math.random() - 0.5) * 100,
        y: 50 + (Math.random() - 0.5) * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
      })
    }

    setConfetti(particles)
  }, [])

  const handleClaim = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClaim()
      onClose()
    }, 500)
  }

  const getMilestoneTitle = () => {
    if (days >= 365) return "LEGENDARY STREAK!"
    if (days >= 180) return "AMAZING DEDICATION!"
    if (days >= 90) return "OUTSTANDING STREAK!"
    if (days >= 30) return "INCREDIBLE STREAK!"
    if (days >= 14) return "AWESOME STREAK!"
    if (days >= 7) return "GREAT STREAK!"
    return "STREAK MILESTONE!"
  }

  return (
    <div
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative w-full max-w-md">
        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((particle, index) => (
            <div
              key={index}
              className="absolute animate-confetti"
              style={{
                backgroundColor: particle.color,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: `rotate(${particle.angle}rad)`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>

        <div className="bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg border-4 border-yellow-500 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Award className="h-6 w-6 mr-2" />
              {getMilestoneTitle()}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-amber-600">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-800 rounded-full mb-4 animate-pulse">
                <Star className="h-12 w-12 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{days}-Day Streak!</h3>
              <p className="text-amber-200">You've played for {days} consecutive days!</p>
            </div>

            <div className="bg-amber-800/50 rounded-lg p-4 mb-6">
              <div className="text-lg font-bold text-amber-300 mb-1">Special Milestone Reward</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(reward)}</div>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3"
            >
              <Gift className="h-5 w-5 mr-2" />
              Claim Reward!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
