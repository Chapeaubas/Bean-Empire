"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { RegionBusiness } from "@/lib/region-businesses"
import soundManager from "@/lib/sound-manager"
import { motion } from "framer-motion"

interface RegionBusinessCardProps {
  business: RegionBusiness
  owned: boolean
  progress: number
  onCollect: () => void
  onStart: () => void
  isRunning: boolean
  isReady: boolean
}

export default function RegionBusinessCard({
  business,
  owned,
  progress,
  onCollect,
  onStart,
  isRunning,
  isReady,
}: RegionBusinessCardProps) {
  const [progressValue, setProgressValue] = useState(progress * 100)
  const [isCollecting, setIsCollecting] = useState(false)

  useEffect(() => {
    setProgressValue(progress * 100)
  }, [progress])

  const handleCollect = () => {
    setIsCollecting(true)
    try {
      soundManager.play("collect")
    } catch (error) {
      console.error("Error playing sound:", error)
    }
    onCollect()

    // Reset the collecting animation after a short delay
    setTimeout(() => {
      setIsCollecting(false)
    }, 500)
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Card className={`w-full bg-amber-50 border-2 ${isReady ? "border-green-500" : "border-amber-800"}`}>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-bold text-amber-900">{business.name}</CardTitle>
          <div className="text-2xl">{business.icon}</div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-amber-800">Region: {business.region}</span>
            <span className="text-green-700 font-medium">{formatCurrency(business.baseRevenue)}</span>
          </div>
          <div className="flex justify-between text-xs text-amber-700 mb-3">
            <span>Cycle: {business.baseTime}s</span>
            <span>Multiplier: {business.multiplier}x</span>
          </div>
          {owned && (
            <Progress
              value={progressValue}
              className="h-2 mb-2"
              indicatorClassName={isReady ? "bg-green-500" : "bg-amber-500"}
            />
          )}
        </CardContent>
        <CardFooter className="pt-0">
          {owned ? (
            isReady ? (
              <motion.button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium"
                onClick={handleCollect}
                whileTap={{ scale: 0.95 }}
                animate={isCollecting ? { scale: [1, 1.1, 1] } : {}}
              >
                Collect {formatCurrency(business.baseRevenue)}
              </motion.button>
            ) : isRunning ? (
              <Button disabled className="w-full" size="sm">
                Running... {Math.round(progressValue)}%
              </Button>
            ) : (
              <Button
                onClick={() => {
                  try {
                    soundManager.play("click")
                  } catch (error) {
                    console.error("Error playing sound:", error)
                  }
                  onStart()
                }}
                className="w-full"
                size="sm"
              >
                Start Production
              </Button>
            )
          ) : (
            <div className="w-full text-center text-amber-800 font-medium">Not Purchased</div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
