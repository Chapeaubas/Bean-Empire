"use client"

import { useEffect, useState } from "react"
import { Award, Trophy, Star, Zap, TrendingUp } from "lucide-react"

interface AchievementToastProps {
  title: string
  description: string
  type: "milestone" | "achievement" | "reward" | "prestige"
  onClose: () => void
}

export default function AchievementToast({ title, description, type, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    // Start exit animation after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false)
      // Remove from DOM after animation completes
      setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case "milestone":
        return <Star className="h-8 w-8 text-amber-300" />
      case "achievement":
        return <Trophy className="h-8 w-8 text-amber-300" />
      case "reward":
        return <Zap className="h-8 w-8 text-amber-300" />
      case "prestige":
        return <TrendingUp className="h-8 w-8 text-amber-300" />
      default:
        return <Award className="h-8 w-8 text-amber-300" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "milestone":
        return "from-amber-700 to-amber-800"
      case "achievement":
        return "from-green-700 to-green-800"
      case "reward":
        return "from-blue-700 to-blue-800"
      case "prestige":
        return "from-purple-700 to-purple-800"
      default:
        return "from-amber-700 to-amber-800"
    }
  }

  return (
    <div
      className={`fixed top-20 right-4 z-50 max-w-sm w-full bg-gradient-to-r ${getBgColor()} 
        rounded-lg shadow-lg border-2 border-amber-400 p-4 flex items-center
        transition-all duration-500 transform
        ${isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className="mr-4 bg-gradient-to-r from-amber-900 to-amber-950 p-2 rounded-full">{getIcon()}</div>
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-amber-200">{description}</p>
      </div>
      <button
        onClick={() => {
          setIsAnimating(false)
          setTimeout(() => {
            setIsVisible(false)
            onClose()
          }, 500)
        }}
        className="ml-2 text-amber-300 hover:text-amber-100"
      >
        ×
      </button>
    </div>
  )
}
