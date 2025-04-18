"use client"

import { Button } from "@/components/ui/button"
import { Clock, Coffee, Check } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { safeNumber } from "@/lib/error-utils"

interface OfflineProgressModalProps {
  show: boolean
  offlineProgressData: {
    totalEarned: number
    businessEarnings: {
      businessId: string
      name: string
      earned: number
      cycles: number
    }[]
    timeAway: number
  } | null
  onCollect: () => void
  onClose: () => void
}

export default function OfflineProgressModal({
  show,
  offlineProgressData,
  onCollect,
  onClose,
}: OfflineProgressModalProps) {
  if (!show || !offlineProgressData) return null

  // Format time away
  const formatTimeAway = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  // Ensure values are safe
  const safeTotalEarned = safeNumber(offlineProgressData.totalEarned, 0)
  const safeTimeAway = safeNumber(offlineProgressData.timeAway, 0)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-md w-full border-2 border-amber-600">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-amber-300" />
          </div>

          <h2 className="text-xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-amber-300 mb-4">
            You were away for {formatTimeAway(safeTimeAway)}. Your businesses have been hard at work!
          </p>

          <div className="bg-amber-700/50 rounded-lg p-4 mb-6">
            <div className="text-lg font-bold mb-2">Earnings While Away</div>
            <div className="text-2xl font-bold text-amber-300 mb-4">{formatCurrency(safeTotalEarned)}</div>

            {offlineProgressData.businessEarnings.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {offlineProgressData.businessEarnings.map((business, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Coffee className="h-3 w-3 mr-1 text-amber-300" />
                      <span>{business.name}</span>
                    </div>
                    <div className="text-amber-300">
                      {formatCurrency(business.earned)} ({formatNumber(business.cycles)} cycles)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-amber-300 text-sm">
                No businesses generated income while you were away.
              </div>
            )}
          </div>

          <Button
            variant="default"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            onClick={onCollect}
          >
            <Check className="h-4 w-4 mr-2" />
            Collect {formatCurrency(safeTotalEarned)}
          </Button>
        </div>
      </div>
    </div>
  )
}
