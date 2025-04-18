"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Coffee, X, ChevronRight } from "lucide-react"

interface SeasonalEventBannerProps {
  event: {
    id: string
    name: string
    description: string
    startMonth: number
    endMonth: number
    duration?: number
    effects: {
      specialBusiness?: any
      globalMultiplier?: number
      specialUpgrades?: any[]
    }
  }
  onDismiss: () => void
  onViewDetails: () => void
}

export default function SeasonalEventBanner({ event, onDismiss, onViewDetails }: SeasonalEventBannerProps) {
  const [expanded, setExpanded] = useState(false)

  // Get month names for display
  const getMonthName = (monthIndex: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[monthIndex]
  }

  // Format date range
  const getDateRange = () => {
    if (event.duration === 1) {
      return `${getMonthName(event.startMonth)} 1st only!`
    }

    if (event.startMonth > event.endMonth) {
      return `${getMonthName(event.startMonth)} - ${getMonthName(event.endMonth)}`
    }

    return `${getMonthName(event.startMonth)} - ${getMonthName(event.endMonth)}`
  }

  // Get background color based on event
  const getEventColor = () => {
    switch (event.id) {
      case "pumpkin_spice":
        return "from-amber-600 to-orange-700"
      case "holiday_blend":
        return "from-red-600 to-green-700"
      case "summer_iced":
        return "from-blue-500 to-cyan-600"
      case "coffee_day":
        return "from-amber-500 to-amber-700"
      default:
        return "from-amber-600 to-amber-800"
    }
  }

  return (
    <div className={`rounded-lg overflow-hidden border-2 border-amber-300 mb-4 shadow-lg`}>
      <div className={`bg-gradient-to-r ${getEventColor()} p-3 relative`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 text-white/80 hover:text-white hover:bg-white/10"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-center">
          <div className="mr-3 bg-white/20 p-2 rounded-full">
            <Coffee className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white">{event.name}</h3>
            <div className="flex items-center text-xs text-white/80">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{getDateRange()}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white/90 hover:text-white hover:bg-white/10"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Less" : "More"}
          </Button>
        </div>

        {expanded && (
          <div className="mt-3 text-white/90 text-sm">
            <p>{event.description}</p>

            <div className="mt-2 bg-black/20 p-2 rounded">
              <div className="font-bold mb-1">Special Effects:</div>
              <ul className="list-disc list-inside text-xs space-y-1">
                {event.effects.globalMultiplier && (
                  <li>{event.effects.globalMultiplier}x multiplier to all businesses</li>
                )}
                {event.effects.specialBusiness && (
                  <li>Unlock special business: {event.effects.specialBusiness.name}</li>
                )}
                {event.effects.specialUpgrades && event.effects.specialUpgrades.length > 0 && (
                  <li>{event.effects.specialUpgrades.length} special upgrade(s) available</li>
                )}
              </ul>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="default"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
                onClick={onViewDetails}
              >
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
