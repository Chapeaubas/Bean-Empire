"use client"

import { formatCurrency } from "@/lib/utils"
import { Award, TrendingUp, Clock, Zap, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ManagerStatsCardProps {
  managerId: string
  stats: {
    totalEarnings: number
    collections: number
    lastCollection: number
    businessName: string
    managerName: string
    efficiency?: number
    level?: number
  }
}

export default function ManagerStatsCard({ managerId, stats }: ManagerStatsCardProps) {
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

  // Calculate collections per minute
  const collectionsPerMinute = () => {
    if (!stats.lastCollection || stats.collections === 0) return 0

    const now = Date.now()
    const timeSinceFirstCollection = now - (stats.lastCollection - stats.collections * 60000)
    const minutes = timeSinceFirstCollection / 60000

    if (minutes <= 0) return 0
    return stats.collections / minutes
  }

  // Calculate average earnings
  const averageEarnings = stats.collections > 0 ? stats.totalEarnings / stats.collections : 0

  // Calculate efficiency percentage
  const efficiencyPercentage = ((stats.efficiency || 1) * 100).toFixed(0)

  return (
    <div className="bg-amber-700/40 rounded-lg p-3 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold flex items-center">
            <Award className="h-4 w-4 mr-1 text-amber-300" />
            {stats.managerName}
            {stats.level && stats.level > 1 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">Lvl {stats.level}</span>
            )}
          </h3>
          <div className="text-sm text-amber-300">{stats.businessName}</div>
        </div>
        <div className="text-right">
          <div className="font-bold">{formatCurrency(stats.totalEarnings)}</div>
          <div className="text-xs text-amber-200">{stats.collections} collections</div>
        </div>
      </div>

      {stats.efficiency && stats.efficiency > 1 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center">
              <Zap className="h-3 w-3 mr-1 text-amber-300" />
              Efficiency
            </span>
            <span>{efficiencyPercentage}%</span>
          </div>
          <Progress
            value={Number.parseFloat(efficiencyPercentage)}
            className="h-1.5 bg-amber-900"
            indicatorClassName="bg-gradient-to-r from-amber-400 to-yellow-300"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
        <div className="bg-amber-800/40 p-2 rounded flex items-center">
          <Clock className="h-3 w-3 mr-1 text-amber-300" />
          <span>Last: {formatTimeSince(stats.lastCollection)}</span>
        </div>
        <div className="bg-amber-800/40 p-2 rounded flex items-center">
          <TrendingUp className="h-3 w-3 mr-1 text-amber-300" />
          <span>Avg: {formatCurrency(averageEarnings)}</span>
        </div>
        <div className="bg-amber-800/40 p-2 rounded flex items-center">
          <Zap className="h-3 w-3 mr-1 text-amber-300" />
          <span>Rate: {collectionsPerMinute().toFixed(1)}/min</span>
        </div>
        <div className="bg-amber-800/40 p-2 rounded flex items-center">
          <Star className="h-3 w-3 mr-1 text-amber-300" />
          <span>Total: {formatCurrency(stats.totalEarnings)}</span>
        </div>
      </div>
    </div>
  )
}
