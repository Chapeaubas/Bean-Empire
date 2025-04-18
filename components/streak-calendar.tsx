"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Check, X } from "lucide-react"

interface StreakCalendarProps {
  streakHistory: {
    date: number
    claimed: boolean
  }[]
  currentStreak: number
}

export default function StreakCalendar({ streakHistory, currentStreak }: StreakCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendar, setCalendar] = useState<
    Array<{ date: Date; status: "empty" | "unclaimed" | "claimed" | "future" | "missed" }>
  >([])

  // Generate calendar for the current month
  useEffect(() => {
    const generateCalendar = () => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()

      // Create date for the first day of the month
      const firstDay = new Date(year, month, 1)
      // Get the day of the week (0-6, where 0 is Sunday)
      const startingDay = firstDay.getDay()

      // Get the number of days in the current month
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      // Get the current date for comparison
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      const days = []

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDay; i++) {
        days.push({ date: new Date(year, month, -startingDay + i + 1), status: "empty" as const })
      }

      // Convert streak history to a map for easier lookup
      const historyMap = new Map(streakHistory.map((entry) => [new Date(entry.date).toDateString(), entry.claimed]))

      // Fill in the days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        const dateString = date.toDateString()

        let status: "empty" | "unclaimed" | "claimed" | "future" | "missed"

        if (date > currentDate) {
          status = "future"
        } else if (historyMap.has(dateString)) {
          status = historyMap.get(dateString) ? "claimed" : "missed"
        } else {
          status = "unclaimed"
        }

        days.push({ date, status })
      }

      // Add empty cells for days after the last day of the month to complete the grid
      const remainingCells = 42 - days.length // 6 rows of 7 days
      for (let i = 1; i <= remainingCells; i++) {
        days.push({ date: new Date(year, month + 1, i), status: "empty" as const })
      }

      setCalendar(days)
    }

    generateCalendar()
  }, [currentMonth, streakHistory])

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    const now = new Date()
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)

    // Don't allow navigating past the current month
    if (newMonth <= now) {
      setCurrentMonth(newMonth)
    }
  }

  // Format month name and year
  const formatMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Get status cell color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "claimed":
        return "bg-green-500 text-white"
      case "unclaimed":
        return "bg-amber-900/30 text-amber-400"
      case "missed":
        return "bg-red-500/30 text-red-400"
      case "future":
        return "bg-amber-900/10 text-amber-700/50"
      default:
        return "bg-transparent text-transparent"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "claimed":
        return <Check className="h-3 w-3" />
      case "missed":
        return <X className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="bg-amber-800 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousMonth}
          className="text-amber-300 hover:text-amber-100 hover:bg-amber-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-lg font-bold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-amber-300" />
          {formatMonthYear()}
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={nextMonth}
          className="text-amber-300 hover:text-amber-100 hover:bg-amber-700"
          disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > new Date()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="text-center font-bold text-amber-300 text-xs">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, index) => (
          <div
            key={index}
            className={`aspect-square text-center flex flex-col items-center justify-center text-xs rounded ${getStatusColor(day.status)}`}
          >
            {day.status !== "empty" && (
              <>
                <span>{day.date.getDate()}</span>
                <div className="mt-1">{getStatusIcon(day.status)}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-amber-200">Current Streak:</span>
          <span className="font-bold">{currentStreak} days</span>
        </div>

        <div className="flex justify-between text-xs mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Claimed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500/30 rounded-full mr-1"></div>
            <span>Missed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-900/30 rounded-full mr-1"></div>
            <span>Unclaimed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
