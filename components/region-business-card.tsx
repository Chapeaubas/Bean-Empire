"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play, Coins } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface RegionBusinessCardProps {
  business: any
  owned: boolean
  progress: number
  isRunning: boolean
  isReady: boolean
  onCollect: () => void
  onStart: () => void
}

export default function RegionBusinessCard({
  business,
  owned,
  progress,
  isRunning,
  isReady,
  onCollect,
  onStart,
}: RegionBusinessCardProps) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  if (!owned) return null

  return (
    <motion.div
      className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-4 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-amber-900 text-sm sm:text-base">{business.name}</h3>
        <div className="text-xl sm:text-2xl">{business.icon}</div>
      </div>

      <div className="flex justify-between text-xs sm:text-sm my-1">
        <span className="text-amber-700">Revenue:</span>
        <span className="text-green-600 font-medium">{formatCurrency(business.baseRevenue)}</span>
      </div>

      <div className="flex justify-between text-xs sm:text-sm my-1">
        <span className="text-amber-700">Cycle Time:</span>
        <span>{business.baseTime}s</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 my-2">
        <div
          className={`h-1.5 sm:h-2 rounded-full ${
            isReady ? "bg-green-500" : isRunning ? "bg-amber-500" : "bg-gray-300"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex gap-2 mt-2">
        <Button
          onClick={onStart}
          disabled={isRunning || isReady}
          className={`flex-1 py-1 h-auto text-xs sm:text-sm ${
            isRunning
              ? "bg-gray-400 cursor-not-allowed"
              : isReady
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {isMobile ? "Start" : "Start Production"}
        </Button>
        <Button
          onClick={onCollect}
          disabled={!isReady}
          className={`flex-1 py-1 h-auto text-xs sm:text-sm ${
            isReady ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <Coins className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {isMobile ? "Collect" : "Collect Revenue"}
        </Button>
      </div>
    </motion.div>
  )
}
