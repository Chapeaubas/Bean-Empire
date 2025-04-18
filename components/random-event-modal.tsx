"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { AlertTriangle, Gift, TrendingUp, Clock, Coffee, X, Zap } from "lucide-react"

type EventType = "positive" | "negative" | "challenge" | "special"

interface RandomEventModalProps {
  event: {
    id: string
    title: string
    description: string
    type: EventType
    duration?: number // in seconds, for temporary effects
    options?: {
      text: string
      effect: string
      value: number
    }[]
    defaultEffect?: {
      type: string
      value: number
      target?: string
    }
  }
  onAccept: (optionIndex?: number) => void
  onDecline: () => void
  onClose: () => void
}

export default function RandomEventModal({ event, onAccept, onDecline, onClose }: RandomEventModalProps) {
  const [timeLeft, setTimeLeft] = useState(10) // 10 second countdown to auto-close
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  const getEventIcon = () => {
    switch (event.type) {
      case "positive":
        return <Gift className="h-8 w-8 text-green-400" />
      case "negative":
        return <AlertTriangle className="h-8 w-8 text-red-400" />
      case "challenge":
        return <TrendingUp className="h-8 w-8 text-blue-400" />
      case "special":
        return <Zap className="h-8 w-8 text-purple-400" />
      default:
        return <Coffee className="h-8 w-8 text-amber-400" />
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case "positive":
        return "from-green-800 to-green-900 border-green-600"
      case "negative":
        return "from-red-800 to-red-900 border-red-600"
      case "challenge":
        return "from-blue-800 to-blue-900 border-blue-600"
      case "special":
        return "from-purple-800 to-purple-900 border-purple-600"
      default:
        return "from-amber-800 to-amber-900 border-amber-600"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`bg-gradient-to-b ${getEventColor()} rounded-lg max-w-md w-full max-h-[80vh] flex flex-col border-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            {getEventIcon()}
            <span className="ml-2">Random Event</span>
          </h2>
          <div className="flex items-center">
            <span className="text-sm mr-2">
              <Clock className="h-4 w-4 inline mr-1" />
              {timeLeft}s
            </span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-lg font-bold mb-2">{event.title}</h3>
          <p className="mb-4">{event.description}</p>

          {event.duration && (
            <div className="bg-black/20 p-2 rounded-md mb-4 text-sm">
              <Clock className="h-4 w-4 inline mr-1" />
              Effect lasts for {event.duration} seconds
            </div>
          )}

          {event.options ? (
            <div className="space-y-3 mt-4">
              <h4 className="font-bold">Choose your response:</h4>
              {event.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedOption === index
                      ? "bg-white/20 border-white"
                      : "bg-black/20 border-transparent hover:bg-black/30"
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <div className="font-bold">{option.text}</div>
                  <div className="text-sm mt-1">{option.effect}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-black/20 p-3 rounded-md">
              <div className="font-bold">Effect:</div>
              <div className="text-sm mt-1">
                {event.defaultEffect?.type === "multiplier"
                  ? `${event.defaultEffect.value > 0 ? "+" : ""}${event.defaultEffect.value}x multiplier to ${
                      event.defaultEffect.target || "all businesses"
                    }`
                  : event.defaultEffect?.type === "cash"
                    ? `${event.defaultEffect.value > 0 ? "+" : ""}${formatCurrency(
                        Math.abs(event.defaultEffect.value),
                      )} cash`
                    : "No effect specified"}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-amber-700 flex justify-between">
          <Button variant="outline" onClick={onDecline} className="border-white/30 text-white/90 hover:bg-white/10">
            {event.options ? "Decline" : "Close"}
          </Button>
          {event.options ? (
            <Button
              variant="default"
              onClick={() => onAccept(selectedOption !== null ? selectedOption : undefined)}
              disabled={selectedOption === null}
              className={
                selectedOption !== null
                  ? "bg-white/20 hover:bg-white/30 text-white"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }
            >
              Accept
            </Button>
          ) : (
            <Button variant="default" onClick={() => onAccept()} className="bg-white/20 hover:bg-white/30 text-white">
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
