"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ChevronDown, ChevronUp, Clock, Award } from "lucide-react"

// Import framer-motion at the top of the file
import { motion } from "framer-motion"

// Add these imports at the top of the file
import { safeNumber, safeCalculation, logError, ensureString, formatNumberSafe } from "@/lib/error-utils"

// Add this import at the top of the file
import FloatingText from "@/components/floating-text"

interface BusinessCardProps {
  business: {
    id: string
    name: string
    icon: string
    baseCost: number
    baseRevenue: number
    baseTime: number
    costMultiplier: number
    revenueMultiplier: number
  }
  businessState?: {
    owned: number
    level: number
    hasManager: boolean
    speedMultiplier: number
    profitMultiplier: number
    lastCollected: number | null
    progress: number
  }
  cash: number
  onBuy: () => void
  onBuy10: () => void
  onBuy100: () => void
  onBuyMax: () => void
  onCollect: (e: React.MouseEvent) => void
  onStart: () => void
  timeRemaining: string
  onClick?: () => void
  // Add this to the BusinessCardProps interface
  managerCollection?: {
    amount: number
    timestamp: number
  }
}

export default function BusinessCard({
  business,
  businessState,
  cash,
  onBuy,
  onBuy10,
  onBuy100,
  onBuyMax,
  onCollect,
  onStart,
  timeRemaining,
  onClick,
  // Add this to the destructured props in the function parameters
  managerCollection,
}: BusinessCardProps) {
  // Add this check at the beginning of the component
  if (!business) {
    console.error("Business data is undefined")
    return null // Return null or a placeholder component
  }

  // Initialize state variables with default values
  const [showBuyOptions, setShowBuyOptions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState<"x1" | "x10" | "x100" | "all">("x1")

  // Use a default value if businessState is undefined
  const state = businessState || {
    owned: 0,
    level: 0,
    hasManager: false,
    speedMultiplier: 1,
    profitMultiplier: 1,
    lastCollected: null,
    progress: 0,
  }

  // Modify the calculateCost function to include error handling
  const calculateCost = (amount = 1) => {
    try {
      if (!business) {
        console.error("Business data is undefined")
        return 0
      }

      let totalCost = 0
      const baseCost = safeNumber(business.baseCost, 0)
      const costMultiplier = safeNumber(business.costMultiplier, 1.1)
      const ownedCount = safeNumber(state.owned, 0)

      for (let i = 0; i < amount; i++) {
        const cost = safeCalculation(() => baseCost * Math.pow(costMultiplier, ownedCount + i), 0)
        totalCost += cost
      }
      return totalCost
    } catch (error) {
      logError(error, `calculateCost for ${business?.id}`)
      return 0
    }
  }

  const currentCost = calculateCost()
  const cost10 = calculateCost(10)
  const cost100 = calculateCost(100)

  // Add error handling to other calculations
  const baseRevenue = safeNumber(business?.baseRevenue, 0)
  const ownedCount = safeNumber(state.owned, 0)
  const profitMultiplier = safeNumber(state.profitMultiplier, 1)
  const currentRevenue = safeCalculation(() => baseRevenue * ownedCount * profitMultiplier, 0)

  const baseTime = safeNumber(business?.baseTime, 0)
  const speedMultiplier = safeNumber(state.speedMultiplier, 1)
  const cycleTime = safeCalculation(() => baseTime / speedMultiplier, 0)

  // Check if business is ready to collect
  const isReady = safeNumber(state.progress, 0) >= 100

  // Check if business can be started
  const canStart = state.owned > 0 && state.progress === 0 && !state.hasManager

  // Animation for collection
  useEffect(() => {
    if (isReady && !isAnimating) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isReady, isAnimating])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onClick) onClick()

      if (isReady) {
        onCollect(e)
      }
    },
    [isReady, onClick, onCollect],
  )

  // Calculate how many businesses can be afforded with current cash
  const calculateMaxAffordable = () => {
    let count = 0
    let totalCost = 0
    let nextCost = currentCost

    while (cash >= totalCost + nextCost) {
      count++
      totalCost += nextCost
      nextCost = business.baseCost * Math.pow(business.costMultiplier, state.owned + count)
    }

    return isNaN(totalCost) ? 0 : totalCost
  }

  // Function to buy maximum affordable businesses
  const buyMaxAffordable = () => {
    onBuyMax()
  }

  // Ensure progress value is a valid number between 0-100
  const safeProgress = safeNumber(state.progress, 0)

  return (
    <motion.div
      className={`bg-gradient-to-b from-amber-700 to-amber-800 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-lg
  ${state.owned > 0 ? "border-amber-400" : "border-amber-600"}
  ${isReady ? "animate-pulse-subtle" : ""}
  ${isAnimating ? "scale-105" : ""}
  ${state.hasManager ? "manager-pulse" : ""}
`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Business Header */}
      <div
        className="flex items-center p-3 bg-gradient-to-r from-amber-800 to-amber-900 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 rounded-full mr-3 text-2xl shadow-lg border border-amber-400 transform hover:scale-105 transition-transform">
          <div className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{business.icon}</div>
        </div>

        <div className="flex-1">
          <h3 className="font-bold flex items-center">
            {business.name}
            {state.hasManager && <Award className="h-4 w-4 ml-2 text-green-400" />}
          </h3>
          <div className="text-sm text-amber-300">
            Owned: <span className="font-bold">{ensureString(ownedCount)}</span>
          </div>
        </div>

        {/* Update the revenue display */}
        <div className="text-right">
          <div className="text-amber-300 font-bold">{formatCurrency(currentRevenue)}</div>
          <div className="text-xs text-amber-200 flex items-center justify-end">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatNumberSafe(cycleTime, 1)}s</span>
          </div>
        </div>

        <div className="ml-2">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-amber-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-amber-300" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {state.owned > 0 && (
        <div className={`px-3 py-2 bg-amber-800/50 ${isReady ? "bg-green-900/20" : ""}`} onClick={handleClick}>
          <div className="flex justify-between text-xs mb-1">
            <span>{state.hasManager ? "Auto-collecting" : "Progress"}</span>
            <span className="text-amber-300">{timeRemaining}</span>
          </div>
          <div className="h-3 bg-amber-900 rounded-full overflow-hidden">
            <div
              className={`h-full ${isReady ? "bg-green-500" : "bg-amber-500"} transition-all duration-300`}
              style={{ width: `${Math.min(Math.max(safeProgress, 0), 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Manager Collection Animation */}
      {managerCollection && Date.now() - managerCollection.timestamp < 2000 && (
        <FloatingText amount={managerCollection.amount} />
      )}

      {/* Expanded Details */}
      {isExpanded && state.owned > 0 && (
        <div className="p-3 bg-amber-800/30 border-t border-amber-700">
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="text-amber-200">Base Revenue:</div>
            <div className="text-right">{formatCurrency(baseRevenue)}</div>

            <div className="text-amber-200">Revenue Multiplier:</div>
            <div className="text-right">{formatNumberSafe(profitMultiplier, 2)}x</div>

            <div className="text-amber-200">Speed Multiplier:</div>
            <div className="text-right">{formatNumberSafe(speedMultiplier, 2)}x</div>

            <div className="text-amber-200">Cycle Time:</div>
            <div className="text-right">{formatNumberSafe(cycleTime, 1)}s</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3 flex flex-col space-y-2 bg-amber-800/20">
        {/* Buy Button with Amount Toggle */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <motion.div
              whileHover={{
                scale:
                  cash >=
                  (purchaseAmount === "all"
                    ? calculateMaxAffordable()
                    : purchaseAmount === "x100"
                      ? cost100
                      : purchaseAmount === "x10"
                        ? cost10
                        : currentCost)
                    ? 1.05
                    : 1,
              }}
              whileTap={{
                scale:
                  cash >=
                  (purchaseAmount === "all"
                    ? calculateMaxAffordable()
                    : purchaseAmount === "x100"
                      ? cost100
                      : purchaseAmount === "x10"
                        ? cost10
                        : currentCost)
                    ? 0.95
                    : 1,
              }}
            >
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center justify-between"
                disabled={
                  cash <
                  (purchaseAmount === "all"
                    ? calculateMaxAffordable()
                    : purchaseAmount === "x100"
                      ? cost100
                      : purchaseAmount === "x10"
                        ? cost10
                        : currentCost)
                }
                onClick={() => {
                  if (purchaseAmount === "x1") onBuy()
                  else if (purchaseAmount === "x10") onBuy10()
                  else if (purchaseAmount === "x100") onBuy100()
                  else if (purchaseAmount === "all") buyMaxAffordable()
                }}
              >
                <span>Buy {purchaseAmount}</span>
                <span>
                  {formatCurrency(
                    purchaseAmount === "all"
                      ? calculateMaxAffordable()
                      : purchaseAmount === "x100"
                        ? cost100
                        : purchaseAmount === "x10"
                          ? cost10
                          : currentCost,
                  )}
                </span>
              </Button>
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              className="bg-amber-700 border-amber-500 text-amber-200 hover:bg-amber-800"
              onClick={() => {
                setPurchaseAmount((prev) => {
                  if (prev === "x1") return "x10"
                  if (prev === "x10") return "x100"
                  if (prev === "x100") return "all"
                  return "x1"
                })
              }}
            >
              {purchaseAmount}
            </Button>
          </motion.div>
        </div>

        {/* Update the collect button */}
        <Button
          variant="default"
          className={`w-full ${
            isReady
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse"
              : canStart
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "bg-gray-600"
          }`}
          onClick={(e) => (isReady ? onCollect(e) : canStart ? onStart() : null)}
          disabled={!isReady && !canStart}
        >
          {isReady ? `Collect ${formatCurrency(currentRevenue)}` : canStart ? "Start Production" : "In Progress..."}
        </Button>

        {/* Manager Indicator */}
        {state.hasManager && state.owned > 0 && (
          <div className="text-center text-xs text-green-300 bg-green-900/30 py-2 rounded flex items-center justify-center">
            <Award className="h-4 w-4 mr-1" />
            Manager Hired - Auto-collecting!
          </div>
        )}
      </div>
    </motion.div>
  )
}
