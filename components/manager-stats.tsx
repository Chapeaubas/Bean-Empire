"use client"

import { useState } from "react"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { Award, TrendingUp, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ManagerStatsProps {
  managerStats: {
    [key: string]: {
      totalEarnings: number
      collections: number
      lastCollection: number
      businessName: string
      managerName: string
    }
  }
  onClose: () => void
}

export default function ManagerStats({ managerStats, onClose }: ManagerStatsProps) {
  const [sortBy, setSortBy] = useState<"earnings" | "collections" | "name">("earnings")
  const [timeFrame, setTimeFrame] = useState<"all" | "day" | "hour">("all")

  // Format time since last collection
  const formatTimeSince = (timestamp: number) => {
    if (!timestamp) return "Never"

    const now = Date.now()
    const seconds = Math.floor((now - timestamp) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  // Filter stats based on time frame
  const getFilteredStats = () => {
    const now = Date.now()
    const stats = Object.entries(managerStats).map(([id, stat]) => ({ id, ...stat }))

    if (timeFrame === "hour") {
      return stats.filter((stat) => now - stat.lastCollection < 3600000) // 1 hour
    }

    if (timeFrame === "day") {
      return stats.filter((stat) => now - stat.lastCollection < 86400000) // 24 hours
    }

    return stats
  }

  // Sort the manager stats
  const getSortedStats = () => {
    const stats = getFilteredStats()

    if (sortBy === "earnings") {
      return stats.sort((a, b) => b.totalEarnings - a.totalEarnings)
    }

    if (sortBy === "collections") {
      return stats.sort((a, b) => b.collections - a.collections)
    }

    return stats.sort((a, b) => a.managerName.localeCompare(b.managerName))
  }

  const sortedStats = getSortedStats()

  // Calculate totals
  const totalEarnings = sortedStats.reduce((sum, stat) => sum + stat.totalEarnings, 0)
  const totalCollections = sortedStats.reduce((sum, stat) => sum + stat.collections, 0)

  return (
    <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg p-4 max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Award className="h-5 w-5 mr-2 text-amber-300" />
          Manager Performance
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation() // Prevent event from bubbling up
            onClose()
          }}
        >
          Close
        </Button>
      </div>

      <div className="bg-amber-700/30 p-3 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-amber-800/50 p-2 rounded-lg">
            <div className="text-xs text-amber-300 mb-1">Total Earnings</div>
            <div className="font-bold">{formatCurrency(totalEarnings)}</div>
          </div>
          <div className="bg-amber-800/50 p-2 rounded-lg">
            <div className="text-xs text-amber-300 mb-1">Total Collections</div>
            <div className="font-bold">{formatNumber(totalCollections)}</div>
          </div>
          <div className="bg-amber-800/50 p-2 rounded-lg">
            <div className="text-xs text-amber-300 mb-1">Active Managers</div>
            <div className="font-bold">{sortedStats.length}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mb-4">
        <div className="flex space-x-1 mb-2">
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "all" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setTimeFrame("all")}
          >
            All Time
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "day" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setTimeFrame("day")}
          >
            Last 24h
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "hour" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setTimeFrame("hour")}
          >
            Last Hour
          </Button>
        </div>

        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="sm"
            className={sortBy === "earnings" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setSortBy("earnings")}
          >
            By Earnings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={sortBy === "collections" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setSortBy("collections")}
          >
            By Collections
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={sortBy === "name" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}
            onClick={() => setSortBy("name")}
          >
            By Name
          </Button>
        </div>
      </div>

      {sortedStats.length === 0 ? (
        <div className="text-center py-8 bg-amber-800/30 rounded-lg">
          <p className="text-amber-300">No manager activity in this time period.</p>
          <p className="text-sm mt-2">Hire managers and let them work to see statistics here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedStats.map((stat) => (
            <div key={stat.id} className="bg-amber-700/40 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold flex items-center">
                    <Award className="h-4 w-4 mr-1 text-amber-300" />
                    {stat.managerName}
                  </h3>
                  <div className="text-sm text-amber-300">{stat.businessName}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(stat.totalEarnings)}</div>
                  <div className="text-xs text-amber-200">{stat.collections} collections</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-amber-800/40 p-2 rounded flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-amber-300" />
                  <span>Last Collection: {formatTimeSince(stat.lastCollection)}</span>
                </div>
                <div className="bg-amber-800/40 p-2 rounded flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-amber-300" />
                  <span>Avg: {formatCurrency(stat.totalEarnings / Math.max(1, stat.collections))}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
