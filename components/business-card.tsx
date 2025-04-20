"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ChevronDown, ChevronUp, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"
import { safeNumber, safeCalculation, logError, ensureString, formatNumberSafe } from "@/lib/error-utils"
import FloatingText from "@/components/floating-text"
import ComicModal from "./comic-modal"
import soundManager from "@/lib/sound-manager"

// Extract business state type for reuse
interface BusinessState {
  owned: number
  level: number
  hasManager: boolean
  speedMultiplier: number
  profitMultiplier: number
  lastCollected: number | null
  progress: number
}

// Extract business type for reuse
interface Business {
  id: string
  name: string
  icon: string
  baseCost: number
  baseRevenue: number
  baseTime: number
  costMultiplier: number
  revenueMultiplier: number
}

interface BusinessCardProps {
  business: Business
  businessState?: BusinessState
  cash: number
  onBuy: () => void
  onBuy10: () => void
  onBuy100: () => void
  onBuyMax: () => void
  onCollect: (e: React.MouseEvent) => void
  onStart: () => void
  timeRemaining: string
  onClick?: () => void
  managerCollection?: {
    amount: number
    timestamp: number
  }
  angelInvestors?: number
  prestigeLevel?: number
  premiumItems?: Record<string, boolean | undefined>
  getAngelEffectiveness?: () => number
}

// Maximum number of iterations for calculations to prevent infinite loops
const MAX_ITERATIONS = 1000

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
  managerCollection,
  angelInvestors = 0,
  prestigeLevel = 1,
  premiumItems = {},
  getAngelEffectiveness = () => 0.05,
}: BusinessCardProps) {
  // Validate business data early
  if (!business) {
    console.error("Business data is undefined")
    return null
  }

  // Initialize state variables with default values
  const [showBuyOptions, setShowBuyOptions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState<"x1" | "x10" | "x100" | "all">("x1")
  const [showCoffeeShopComic, setShowCoffeeShopComic] = useState(false)
  const [showCoffeeCarComic, setShowCoffeeCarComic] = useState(false)
  const [showDriveThruComic, setShowDriveThruComic] = useState(false)
  const [hasSeenCoffeeShopComic, setHasSeenCoffeeShopComic] = useState(false)
  const [hasSeenCoffeeCarComic, setHasSeenCoffeeCarComic] = useState(false)
  const [hasSeenDriveThruComic, setHasSeenDriveThruComic] = useState(false)
  const [comicToShow, setComicToShow] = useState<"coffee_shop" | "coffee_car" | "coffee_drive_thru" | null>(null)

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

  // Determine which comics to potentially show
  const canShowCoffeeShopComic = business.id === "coffee_shop"
  const canShowCoffeeCarComic = business.id === "coffee_house"
  const canShowDriveThruComic = business.id === "coffee_drive_thru"

  // Load comic seen status from localStorage with error handling
  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        const shopComicSeen = localStorage.getItem("hasSeenCoffeeShopComic")
        const carComicSeen = localStorage.getItem("hasSeenCoffeeCarComic")
        const driveThruComicSeen = localStorage.getItem("hasSeenCoffeeDriveThruComic")

        if (shopComicSeen === "true") {
          setHasSeenCoffeeShopComic(true)
        }

        if (carComicSeen === "true") {
          setHasSeenCoffeeCarComic(true)
        }

        if (driveThruComicSeen === "true") {
          setHasSeenDriveThruComic(true)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Default to not showing comics if localStorage fails
      setHasSeenCoffeeShopComic(true)
      setHasSeenCoffeeCarComic(true)
      setHasSeenDriveThruComic(true)
    }
  }, [])

  // Calculate cost with error handling and memoization
  const calculateCost = useCallback(
    (amount = 1) => {
      try {
        if (!business) {
          return 0
        }

        let totalCost = 0
        const baseCost = safeNumber(business.baseCost, 0)
        const costMultiplier = safeNumber(business.costMultiplier, 1.1)
        const ownedCount = safeNumber(state.owned, 0)

        // Add safety limit to prevent infinite loops
        for (let i = 0; i < amount && i < MAX_ITERATIONS; i++) {
          const cost = safeCalculation(() => baseCost * Math.pow(costMultiplier, ownedCount + i), 0)
          totalCost += cost
        }
        return totalCost
      } catch (error) {
        logError(error, `calculateCost for ${business?.id}`)
        return 0
      }
    },
    [business, state.owned],
  )

  // Memoize cost calculations to prevent unnecessary recalculations
  const currentCost = useMemo(() => calculateCost(1), [calculateCost])
  const cost10 = useMemo(() => calculateCost(10), [calculateCost])
  const cost100 = useMemo(() => calculateCost(100), [calculateCost])

  // Memoize other calculations
  const baseRevenue = useMemo(() => safeNumber(business?.baseRevenue, 0), [business])
  const ownedCount = useMemo(() => safeNumber(state.owned, 0), [state.owned])
  const profitMultiplier = useMemo(() => safeNumber(state.profitMultiplier, 1), [state.profitMultiplier])

  // Calculate current revenue with all multipliers
  const currentRevenue = useMemo(() => {
    const angelBonus = 1 + safeNumber(angelInvestors, 0) * getAngelEffectiveness()
    const prestigeBonus = safeNumber(prestigeLevel, 1)
    const goldCoinsMultiplier = premiumItems["gold_coins"] ? 2 : 1

    return safeCalculation(
      () => baseRevenue * ownedCount * profitMultiplier * angelBonus * prestigeBonus * goldCoinsMultiplier,
      0,
    )
  }, [baseRevenue, ownedCount, profitMultiplier, angelInvestors, prestigeLevel, premiumItems, getAngelEffectiveness])

  const baseTime = useMemo(() => safeNumber(business?.baseTime, 0), [business])
  const speedMultiplier = useMemo(() => safeNumber(state.speedMultiplier, 1), [state.speedMultiplier])
  const cycleTime = useMemo(() => safeCalculation(() => baseTime / speedMultiplier, 0), [baseTime, speedMultiplier])

  // Check if business is ready to collect
  const isReady = useMemo(() => safeNumber(state.progress, 0) >= 100, [state.progress])

  // Check if business can be started
  const canStart = useMemo(
    () => state.owned > 0 && state.progress === 0 && !state.hasManager,
    [state.owned, state.progress, state.hasManager],
  )

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

  // Handle click with sound effect
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (onClick) onClick()

      if (isReady) {
        try {
          // Play collect sound
          soundManager.play("collect")
        } catch (error) {
          console.error("Error playing sound:", error)
        }
        onCollect(e)
      }
    },
    [isReady, onClick, onCollect],
  )

  // Calculate how many businesses can be afforded with current cash
  const calculateMaxAffordable = useCallback(() => {
    try {
      let count = 0
      let totalCost = 0
      let nextCost = currentCost

      // Add safety limit to prevent infinite loops
      while (cash >= totalCost + nextCost && count < MAX_ITERATIONS) {
        count++
        totalCost += nextCost
        nextCost = business.baseCost * Math.pow(business.costMultiplier, state.owned + count)
      }

      return isNaN(totalCost) ? 0 : totalCost
    } catch (error) {
      logError(error, `calculateMaxAffordable for ${business?.id}`)
      return 0
    }
  }, [business, cash, currentCost, state.owned])

  // Memoize max affordable calculation
  const maxAffordableCost = useMemo(() => calculateMaxAffordable(), [calculateMaxAffordable])

  // Function to buy maximum affordable businesses
  const buyMaxAffordable = useCallback(() => {
    onBuyMax()
  }, [onBuyMax])

  // Handle buy with sound effect and comic display
  const handleBuy = useCallback(() => {
    try {
      // Play buy sound
      soundManager.play("buy")
    } catch (error) {
      console.error("Error playing sound:", error)
    }

    if (canShowCoffeeShopComic && !hasSeenCoffeeShopComic && state.owned === 0) {
      setComicToShow("coffee_shop")
    } else if (canShowCoffeeCarComic && !hasSeenCoffeeCarComic && state.owned === 0) {
      setComicToShow("coffee_car")
    } else if (canShowDriveThruComic && !hasSeenDriveThruComic && state.owned === 0) {
      setComicToShow("coffee_drive_thru")
    } else {
      onBuy()
    }
  }, [
    canShowCoffeeShopComic,
    canShowCoffeeCarComic,
    canShowDriveThruComic,
    hasSeenCoffeeShopComic,
    hasSeenCoffeeCarComic,
    hasSeenDriveThruComic,
    onBuy,
    state.owned,
  ])

  // Handle coffee shop comic close with localStorage error handling
  const handleCoffeeShopComicClose = useCallback(() => {
    setShowCoffeeShopComic(false)
    setHasSeenCoffeeShopComic(true)
    try {
      localStorage.setItem("hasSeenCoffeeShopComic", "true")
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
    onBuy() // Proceed with the purchase after showing the comic
  }, [onBuy])

  // Handle coffee car comic close with localStorage error handling
  const handleCoffeeCarComicClose = useCallback(() => {
    setShowCoffeeCarComic(false)
    setHasSeenCoffeeCarComic(true)
    try {
      localStorage.setItem("hasSeenCoffeeCarComic", "true")
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
    onBuy() // Proceed with the purchase after showing the comic
  }, [onBuy])

  // Handle drive-thru comic close with localStorage error handling
  const handleDriveThruComicClose = useCallback(() => {
    setShowDriveThruComic(false)
    setHasSeenDriveThruComic(true)
    try {
      localStorage.setItem("hasSeenCoffeeDriveThruComic", "true")
    } catch (error) {
      console.error("Error setting localStorage:", error)
    }
    onBuy() // Proceed with the purchase after showing the comic
  }, [onBuy])

  // Ensure progress value is a valid number between 0-100
  const safeProgress = useMemo(() => safeNumber(state.progress, 0), [state.progress])

  // Determine if manager collection should be shown
  const showManagerCollection = useMemo(
    () => managerCollection && Date.now() - managerCollection.timestamp < 2000,
    [managerCollection],
  )

  // Determine button disabled state
  const buyButtonDisabled = useMemo(() => {
    const costToCheck =
      purchaseAmount === "all"
        ? maxAffordableCost
        : purchaseAmount === "x100"
          ? cost100
          : purchaseAmount === "x10"
            ? cost10
            : currentCost
    return cash < costToCheck
  }, [cash, purchaseAmount, maxAffordableCost, cost100, cost10, currentCost])

  // REMOVED: The useEffect that was automatically setting comicToShow at component mount
  // This was causing comics to appear immediately after game start

  const handleComicClose = useCallback(
    (comicType: "coffee_shop" | "coffee_car" | "coffee_drive_thru") => {
      if (comicType === "coffee_shop") {
        setShowCoffeeShopComic(false)
        setHasSeenCoffeeShopComic(true)
        try {
          localStorage.setItem("hasSeenCoffeeShopComic", "true")
        } catch (error) {
          console.error("Error setting localStorage:", error)
        }
      } else if (comicType === "coffee_car") {
        setShowCoffeeCarComic(false)
        setHasSeenCoffeeCarComic(true)
        try {
          localStorage.setItem("hasSeenCoffeeCarComic", "true")
        } catch (error) {
          console.error("Error setting localStorage:", error)
        }
      } else if (comicType === "coffee_drive_thru") {
        setShowDriveThruComic(false)
        setHasSeenDriveThruComic(true)
        try {
          localStorage.setItem("hasSeenCoffeeDriveThruComic", "true")
        } catch (error) {
          console.error("Error setting localStorage:", error)
        }
      }
      setComicToShow(null)
      onBuy()
    },
    [onBuy],
  )

  return (
    <>
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

          {/* Revenue display */}
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
        {showManagerCollection && <FloatingText amount={managerCollection!.amount} />}

        {/* Expanded Details */}
        {isExpanded && state.owned > 0 && (
          <div className="p-3 bg-amber-800/30 border-t border-amber-700">
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="text-amber-200">Base Revenue:</div>
              <div className="text-right">{formatCurrency(baseRevenue)}</div>

              <div className="text-amber-200">Owned:</div>
              <div className="text-right">{ensureString(ownedCount)}</div>

              <div className="col-span-2 mt-1 mb-1">
                <div className="text-amber-300 font-semibold border-b border-amber-600 pb-1 mb-1">
                  Multiplier Breakdown:
                </div>
                <div className="bg-amber-800/40 rounded-lg p-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Base Multiplier:</span>
                    <span className="font-bold">{formatNumberSafe(profitMultiplier, 2)}x</span>
                  </div>

                  {angelInvestors > 0 && (
                    <div className="flex justify-between text-xs mb-1">
                      <span>$GRIND Beans Bonus:</span>
                      <span className="font-bold text-green-300">
                        +{formatNumberSafe(safeNumber(angelInvestors, 0) * getAngelEffectiveness(), 2)}x
                      </span>
                    </div>
                  )}

                  {prestigeLevel > 1 && (
                    <div className="flex justify-between text-xs mb-1">
                      <span>Prestige Level Bonus:</span>
                      <span className="font-bold text-purple-300">
                        {formatNumberSafe(safeNumber(prestigeLevel, 1), 1)}x
                      </span>
                    </div>
                  )}

                  {premiumItems["gold_coins"] && (
                    <div className="flex justify-between text-xs mb-1">
                      <span>Gold Coins Bonus:</span>
                      <span className="font-bold text-yellow-300">2.0x</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs mt-2 pt-2 border-t border-amber-600">
                    <span className="font-semibold">Total Revenue Multiplier:</span>
                    <span className="font-bold text-amber-300">
                      {formatNumberSafe(
                        profitMultiplier *
                          (1 + safeNumber(angelInvestors, 0) * getAngelEffectiveness()) *
                          safeNumber(prestigeLevel, 1) *
                          (premiumItems["gold_coins"] ? 2 : 1),
                        2,
                      )}
                      x
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-amber-200">Speed Multiplier:</div>
              <div className="text-right">{formatNumberSafe(speedMultiplier, 2)}x</div>

              <div className="text-amber-200">Cycle Time:</div>
              <div className="text-right">{formatNumberSafe(cycleTime, 1)}s</div>

              <div className="col-span-2 mt-1">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-200">Total Revenue per Cycle:</span>
                  <span className="font-bold text-amber-300">{formatCurrency(currentRevenue)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-amber-200">Revenue per Second:</span>
                  <span className="font-bold text-green-300">
                    {formatCurrency(cycleTime > 0 ? currentRevenue / cycleTime : 0)}/s
                  </span>
                </div>
              </div>
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
                  scale: !buyButtonDisabled ? 1.05 : 1,
                }}
                whileTap={{
                  scale: !buyButtonDisabled ? 0.95 : 1,
                }}
              >
                <Button
                  variant="default"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 flex items-center justify-between"
                  disabled={buyButtonDisabled}
                  onClick={() => {
                    if (purchaseAmount === "x1") handleBuy()
                    else if (purchaseAmount === "x10") onBuy10()
                    else if (purchaseAmount === "x100") onBuy100()
                    else if (purchaseAmount === "all") buyMaxAffordable()
                  }}
                >
                  <span>Buy {purchaseAmount}</span>
                  <span>
                    {formatCurrency(
                      purchaseAmount === "all"
                        ? maxAffordableCost
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

          {/* Collect/Start button */}
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
            {isReady ? (
              <>
                Collect {formatCurrency(currentRevenue)}
                {ownedCount > 0 && profitMultiplier > 1 && (
                  <span className="text-xs ml-1">({formatNumberSafe(profitMultiplier, 1)}x)</span>
                )}
              </>
            ) : canStart ? (
              "Start Production"
            ) : (
              "In Progress..."
            )}
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

      {/* Comic Modals */}
      <ComicModal
        show={comicToShow === "coffee_shop"}
        onClose={() => handleComicClose("coffee_shop")}
        imageSrc="/images/comic2.png"
      />

      <ComicModal
        show={comicToShow === "coffee_car"}
        onClose={() => handleComicClose("coffee_car")}
        imageSrc="/images/comic3.png"
      />

      <ComicModal
        show={comicToShow === "coffee_drive_thru"}
        onClose={() => handleComicClose("coffee_drive_thru")}
        imageSrc="/images/comic3.3.png"
      />
    </>
  )
}
