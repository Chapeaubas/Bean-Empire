"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import BusinessGrid from "@/components/business-grid"
import GlobalActionsBar from "@/components/global-actions-bar"
import GameHeader from "@/components/game-header"
import ManagerModal from "@/components/manager-modal"
import UpgradeModal from "@/components/upgrade-modal"
import StatsModal from "@/components/stats-modal"
import PrestigeModal from "@/components/prestige-modal"
import AchievementsPanel from "@/components/achievements-panel"
import OfflineProgressModal from "@/components/offline-progress-modal"
import PremiumShop from "@/components/premium-shop"
import FAQModal from "@/components/faq-modal"

import AnimatedBackground from "@/components/animated-background"
import StartScreen from "@/components/start-screen"
import ErrorBoundary from "@/components/error-boundary"
import { calculateOfflineProgress } from "@/lib/offline-progress"
import { ACHIEVEMENTS } from "@/lib/game-data"

// Add these imports at the top of the file
import { safeNumber, safeCalculation, logError } from "@/lib/error-utils"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the new manager system
import { setupManagerSystem } from "@/lib/manager-system"

// Add this to the imports at the top
import DebugPanel from "@/components/debug-panel"
import { Bug } from "lucide-react"

// Add this to the imports at the top
import PrestigeShopModal from "@/components/prestige-shop-modal"

// Add these imports
import MiniGamesModal from "@/components/mini-games-modal"
import BeanSortingGame from "@/components/bean-sorting-game"
import CoffeeBrewingGame from "@/components/coffee-brewing-game"

// Add this to the imports at the top of the file
import soundManager from "@/lib/sound-manager"

// Add this near the top of the file, after imports
const DEBUG = true

// Initial game data
const initialBusinesses = [
  {
    id: "coffee_cart",
    name: "Coffee Farmer",
    icon: "🛒",
    baseCost: 4,
    baseRevenue: 1,
    baseTime: 1,
    costMultiplier: 1.07,
    revenueMultiplier: 1.03,
  },
  {
    id: "coffee_shop",
    name: "Coffee Cart",
    icon: "☕",
    baseCost: 60,
    baseRevenue: 60,
    baseTime: 3,
    costMultiplier: 1.15,
    revenueMultiplier: 1.14,
  },
  {
    id: "coffee_house",
    name: "Coffee Car",
    icon: "🏠",
    baseCost: 720,
    baseRevenue: 540,
    baseTime: 6,
    costMultiplier: 1.14,
    revenueMultiplier: 1.13,
  },
  {
    id: "coffee_drive_thru",
    name: "Coffee Shop",
    icon: "🚗",
    baseCost: 8640,
    baseRevenue: 4320,
    baseTime: 12,
    costMultiplier: 1.13,
    revenueMultiplier: 1.12,
  },
  {
    id: "coffee_roastery",
    name: "Coffee Warehouse",
    icon: "🔥",
    baseCost: 103680,
    baseRevenue: 51840,
    baseTime: 24,
    costMultiplier: 1.12,
    revenueMultiplier: 1.11,
  },
  {
    id: "coffee_plantation",
    name: "Coffee Plantation",
    icon: "🌱",
    baseCost: 1244160,
    baseRevenue: 622080,
    baseTime: 96,
    costMultiplier: 1.11,
    revenueMultiplier: 1.1,
  },
  {
    id: "coffee_factory",
    name: "Coffee Factory",
    icon: "🏭",
    baseCost: 14929920,
    baseRevenue: 7464960,
    baseTime: 384,
    costMultiplier: 1.1,
    revenueMultiplier: 1.09,
  },
  {
    id: "coffee_empire",
    name: "Coffee Empire",
    icon: "👑",
    baseCost: 179159040,
    baseRevenue: 89579520,
    baseTime: 1536,
    costMultiplier: 1.09,
    revenueMultiplier: 1.08,
  },
]

// Initial managers
const initialManagers = [
  {
    id: "manager_1",
    name: "Barista Bob",
    businessId: "coffee_cart",
    cost: 1000,
    description: "Automatically runs your Coffee Cart",
  },
  {
    id: "manager_2",
    name: "Supervisor Sarah",
    businessId: "coffee_shop",
    cost: 15000,
    description: "Automatically runs your Coffee Shop",
  },
  {
    id: "manager_3",
    name: "Manager Mike",
    businessId: "coffee_house",
    cost: 100000,
    description: "Automatically runs your Coffee House",
  },
  {
    id: "manager_4",
    name: "Director Dave",
    businessId: "coffee_drive_thru",
    cost: 500000,
    description: "Automatically runs your Drive-Thru Coffee",
  },
  {
    id: "manager_5",
    name: "Executive Emma",
    businessId: "coffee_roastery",
    cost: 1200000,
    description: "Automatically runs your Coffee Roastery",
  },
  {
    id: "manager_6",
    name: "VP Victoria",
    businessId: "coffee_plantation",
    cost: 10000000,
    description: "Automatically runs your Coffee Plantation",
  },
  {
    id: "manager_7",
    name: "President Paul",
    businessId: "coffee_factory",
    cost: 100000000,
    description: "Automatically runs your Coffee Factory",
  },
  {
    id: "manager_8",
    name: "CEO Charlie",
    businessId: "coffee_empire",
    cost: 1000000000,
    description: "Automatically runs your Coffee Empire",
  },
]

// Initial upgrades
const initialUpgrades = [
  {
    id: "upgrade_cart_1",
    name: "Better Beans",
    businessId: "coffee_cart",
    cost: 500,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Carts",
    requiredLevel: 10,
  },
  {
    id: "upgrade_cart_2",
    name: "Faster Brewing",
    businessId: "coffee_cart",
    cost: 2000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Carts produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_shop_1",
    name: "Comfy Chairs",
    businessId: "coffee_shop",
    cost: 10000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Shops",
    requiredLevel: 10,
  },
  {
    id: "upgrade_shop_2",
    name: "Espresso Machines",
    businessId: "coffee_shop",
    cost: 50000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Shops produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_house_1",
    name: "Artisanal Blends",
    businessId: "coffee_house",
    cost: 75000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Houses",
    requiredLevel: 10,
  },
  {
    id: "upgrade_house_2",
    name: "Barista Training",
    businessId: "coffee_house",
    cost: 300000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Houses produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_drive_1",
    name: "Digital Menu Boards",
    businessId: "coffee_drive_thru",
    cost: 400000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Drive-Thru Coffee",
    requiredLevel: 10,
  },
  {
    id: "upgrade_drive_2",
    name: "Double Drive-Thru Lanes",
    businessId: "coffee_drive_thru",
    cost: 1600000,
    multiplier: 2,
    type: "speed",
    description: "Drive-Thru Coffee produces twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_roastery_1",
    name: "Premium Roasting Equipment",
    businessId: "coffee_roastery",
    cost: 1000000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Roasteries",
    requiredLevel: 10,
  },
  {
    id: "upgrade_roastery_2",
    name: "Automated Packaging",
    businessId: "coffee_roastery",
    cost: 4000000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Roasteries produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_plantation_1",
    name: "Organic Certification",
    businessId: "coffee_plantation",
    cost: 8000000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Plantations",
    requiredLevel: 10,
  },
  {
    id: "upgrade_plantation_2",
    name: "Irrigation Systems",
    businessId: "coffee_plantation",
    cost: 32000000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Plantations produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_factory_1",
    name: "Quality Control",
    businessId: "coffee_factory",
    cost: 64000000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Factories",
    requiredLevel: 10,
  },
  {
    id: "upgrade_factory_2",
    name: "Assembly Line Upgrade",
    businessId: "coffee_factory",
    cost: 256000000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Factories produce twice as fast",
    requiredLevel: 25,
  },
  {
    id: "upgrade_empire_1",
    name: "Global Brand Recognition",
    businessId: "coffee_empire",
    cost: 512000000,
    multiplier: 2,
    type: "profit",
    description: "Double profits from Coffee Empires",
    requiredLevel: 10,
  },
  {
    id: "upgrade_empire_2",
    name: "International Logistics",
    businessId: "coffee_empire",
    cost: 2048000000,
    multiplier: 2,
    type: "speed",
    description: "Coffee Empires produce twice as fast",
    requiredLevel: 25,
  },
]

// Prestige upgrades
const prestigeUpgrades = [
  {
    id: "prestige_profit",
    name: "Bean Quality",
    description: "Increase all business profits",
    baseCost: 1,
    costMultiplier: 2,
    effect: {
      type: "profit",
      value: 0.1, // +10% per level
    },
  },
  {
    id: "prestige_speed",
    name: "Brewing Efficiency",
    description: "Decrease production time for all businesses",
    baseCost: 2,
    costMultiplier: 2,
    effect: {
      type: "speed",
      value: 0.1, // +10% per level
    },
  },
  {
    id: "prestige_offline",
    name: "Manager Training",
    description: "Increase offline earnings",
    baseCost: 3,
    costMultiplier: 2,
    effect: {
      type: "offline",
      value: 0.1, // +10% per level
    },
  },
  {
    id: "prestige_angel",
    name: "$GRIND Investor Influence",
    description: "Increase $GRIND effectiveness",
    baseCost: 5,
    costMultiplier: 2,
    effect: {
      type: "angel",
      value: 0.01, // +1% per level
    },
  },
]

// Add this at the beginning of the Home component
export default function Home() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false)
  // Set initial cash to a high value for testing
  const [cash, setCash] = useState(1000000000)
  const businessTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})
  const managerSystemTimer = useRef<NodeJS.Timeout | null>(null)
  // Set initial lifetime earnings to a high value to enable prestige
  const [lifetimeEarnings, setLifetimeEarnings] = useState(2000000000000)
  const [businessStates, setBusinessStates] = useState<{ [key: string]: any }>({})
  const [managers, setManagers] = useState<{ [key: string]: boolean }>({})
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<{ [key: string]: boolean }>({})
  const [prestigeLevel, setPrestigeLevel] = useState(1)
  const [angelInvestors, setAngelInvestors] = useState(0)
  const [prestigeUpgradeStates, setPrestigeUpgradeStates] = useState<{ [key: string]: number }>({})
  const [achievements, setAchievements] = useState<{ [key: string]: boolean }>({})
  const [premiumItems, setPremiumItems] = useState<{ [key: string]: boolean }>({})
  const [stats, setStats] = useState({
    totalEarnings: 2000000000000, // Set to match lifetimeEarnings
    totalClicks: 0,
    totalCustomersServed: 0,
    maxBusinessOwned: 0,
    prestigeLevel: 1,
    beanSortingHighScore: 0,
  })

  // Manager collections for visual feedback
  const [managerCollections, setManagerCollections] = useState<{
    [key: string]: { amount: number; timestamp: number }
  }>({})

  // Manager stats for tracking performance
  const [managerStats, setManagerStats] = useState<{
    [key: string]: {
      totalEarnings: number
      collections: number
      lastCollection: number
      businessName: string
      managerName: string
    }
  }>({})

  // Add error state
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Modal visibility states
  const [showManagerModal, setShowManagerModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [showPrestigeModal, setShowPrestigeModal] = useState(false)
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false)
  const [showOfflineProgress, setShowOfflineProgress] = useState(false)
  const [showPremiumShop, setShowPremiumShop] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [offlineProgressData, setOfflineProgressData] = useState<any>(null)

  // Add this to the state declarations in the Home component
  const [showDebugPanel, setShowDebugPanel] = useState(false)

  // Add this to the state declarations in the Home component
  const [showPrestigeShopModal, setShowPrestigeShopModal] = useState(false)

  // Add this to the state declarations in the Home component, after the other modal states
  const [showMiniGamesModal, setShowMiniGamesModal] = useState(false)
  const [activeMiniGame, setActiveMiniGame] = useState<string | null>(null)

  // Error handler function
  const handleError = useCallback((error: unknown, context: string) => {
    logError(error, context)
    setHasError(true)
    setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
  }, [])

  // Refs to prevent infinite loops
  const businessStatesRef = useRef(businessStates)
  const cashRef = useRef(cash)
  const lifetimeEarningsRef = useRef(lifetimeEarnings)
  const statsRef = useRef(stats)
  const angelInvestorsRef = useRef(angelInvestors)
  const prestigeLevelRef = useRef(prestigeLevel)
  const premiumItemsRef = useRef(premiumItems)
  const managersRef = useRef(managers)
  const managerStatsRef = useRef(managerStats)

  // Update refs when state changes
  useEffect(() => {
    businessStatesRef.current = businessStates
  }, [businessStates])

  useEffect(() => {
    cashRef.current = cash
  }, [cash])

  useEffect(() => {
    lifetimeEarningsRef.current = lifetimeEarnings
  }, [lifetimeEarnings])

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  useEffect(() => {
    angelInvestorsRef.current = angelInvestors
  }, [angelInvestors])

  useEffect(() => {
    prestigeLevelRef.current = prestigeLevel
  }, [prestigeLevel])

  useEffect(() => {
    premiumItemsRef.current = premiumItems
  }, [premiumItems])

  useEffect(() => {
    managersRef.current = managers
  }, [managers])

  useEffect(() => {
    managerStatsRef.current = managerStats
  }, [managerStats])

  // Initialize business states
  const [isInitialized, setIsInitialized] = useState(false)
  const isInitializedRef = useRef(isInitialized)

  useEffect(() => {
    if (!gameStarted || isInitialized) return

    setIsInitialized(true)
    isInitializedRef.current = true

    const initialBusinessStates: { [key: string]: any } = {}
    initialBusinesses.forEach((business) => {
      initialBusinessStates[business.id] = {
        owned: business.id === "coffee_cart" ? 1 : 0,
        level: 1,
        hasManager: false,
        speedMultiplier: 1,
        profitMultiplier: 1,
        lastCollected: null,
        progress: 0,
      }
    })

    setBusinessStates(initialBusinessStates)
    businessStatesRef.current = initialBusinessStates

    // Set last online time
    localStorage.setItem("lastOnlineTime", Date.now().toString())
    const interval = setInterval(() => {
      localStorage.setItem("lastOnlineTime", Date.now().toString())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [gameStarted, isInitialized])

  // Check for offline progress separately
  useEffect(() => {
    if (!gameStarted || !isInitialized) return

    // Check for offline progress
    const lastOnlineTime = localStorage.getItem("lastOnlineTime")
    if (lastOnlineTime) {
      try {
        const parsedTime = Number.parseInt(lastOnlineTime)
        if (!isNaN(parsedTime)) {
          const offlineProgress = calculateOfflineProgress(
            parsedTime,
            businessStatesRef.current,
            initialBusinesses,
            prestigeLevel,
            1 + angelInvestors * getAngelEffectiveness(),
            getOfflineMultiplier(),
          )

          if (offlineProgress && offlineProgress.totalEarned > 0) {
            setOfflineProgressData(offlineProgress)
            setShowOfflineProgress(true)
          }
        }
      } catch (error) {
        console.error("Error calculating offline progress:", error)
      }
    }
  }, [gameStarted, prestigeLevel, angelInvestors, isInitialized])

  // Also update the getAngelEffectiveness function to ensure it's returning the correct value

  // Find the getAngelEffectiveness function (around line 500-550)
  // Replace it with this updated version:

  // Get angel effectiveness (base + upgrades)
  const getAngelEffectiveness = () => {
    // Increased base effectiveness from 2% to 5% per angel
    const baseEffectiveness = 0.05 // 5% per angel
    // Add bonus from prestige upgrades
    const upgradeBonus = (prestigeUpgradeStates["prestige_angel"] || 0) * 0.02 // +2% per level

    const totalEffectiveness = baseEffectiveness + upgradeBonus
    console.log("Angel effectiveness calculation:", { baseEffectiveness, upgradeBonus, totalEffectiveness })

    return totalEffectiveness
  }

  // Get offline earnings multiplier
  const getOfflineMultiplier = () => {
    return 1 + (prestigeUpgradeStates["prestige_offline"] || 0) * 0.1 // +10% per level
  }

  // Apply premium item effects to business states
  const applyPremiumItemEffects = (businessState: any) => {
    const state = { ...businessState }

    // Apply gold hat effect (2x speed)
    if (premiumItems["gold_hat"] || premiumItems["gold_hat_combo"] || premiumItems["gold_hamster_upgrade"]) {
      state.speedMultiplier *= 2
    }

    // Apply gold jacket effect (1.5x profit)
    if (premiumItems["gold_jacket"] || premiumItems["gold_hat_combo"] || premiumItems["gold_hamster_upgrade"]) {
      state.profitMultiplier *= 1.5
    }

    // Gold coins effect (2x money earned) is applied at collection time

    return state
  }

  // Get manager cost with premium item discount
  const getManagerCost = (managerCost: number) => {
    // Apply gold sunglasses effect (50% cheaper managers)
    if (premiumItems["gold_sunglasses"] || premiumItems["gold_hamster_upgrade"]) {
      return managerCost * 0.5
    }
    return managerCost
  }

  // Calculate time remaining for a business
  const getTimeRemaining = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business || !state || state.owned === 0) return ""
    if (state.progress >= 100) return "Ready!"

    const baseTime = business.baseTime
    const speedMultiplier = state.speedMultiplier || 1
    const adjustedTime = baseTime / speedMultiplier

    if (isNaN(adjustedTime)) return "0s"

    const remainingSeconds = (adjustedTime * (100 - state.progress)) / 100
    if (isNaN(remainingSeconds)) return "0s"

    if (remainingSeconds < 60) {
      return `${Math.ceil(remainingSeconds)}s`
    } else {
      return `${Math.ceil(remainingSeconds / 60)}m ${Math.ceil(remainingSeconds % 60)}s`
    }
  }

  // Calculate revenue for a business
  const calculateRevenue = useCallback((businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStatesRef.current[businessId]

    if (DEBUG) console.log("🧮 Revenue check:", { businessId, state, business })

    if (!business || !state || state.owned === 0) {
      if (DEBUG) console.log("❌ Cannot calculate revenue: missing state or business data")
      return 0
    }

    const baseRevenue = safeNumber(business.baseRevenue, 0)
    const ownedCount = safeNumber(state.owned, 0)
    const profitMultiplier = safeNumber(state.profitMultiplier, 1)
    const angelBonus = 1 + safeNumber(angelInvestorsRef.current, 0) * getAngelEffectiveness()
    const prestigeBonus = safeNumber(prestigeLevelRef.current, 1)

    // Apply gold coins effect (2x money earned)
    const goldCoinsMultiplier = premiumItemsRef.current["gold_coins"] ? 2 : 1

    // Calculate the total revenue
    const totalRevenue = safeCalculation(
      () => baseRevenue * ownedCount * profitMultiplier * angelBonus * prestigeBonus * goldCoinsMultiplier,
      0,
    )

    if (DEBUG) {
      console.log("💰 Revenue calculation details:", {
        businessId,
        businessName: business.name,
        baseRevenue,
        ownedCount,
        profitMultiplier,
        angelBonus: angelBonus.toFixed(2),
        prestigeBonus,
        goldCoinsMultiplier,
        totalRevenue: totalRevenue.toFixed(2),
      })
    }

    // Ensure we return a valid number
    return isNaN(totalRevenue) ? 1 : Math.max(1, totalRevenue)
  }, [])

  // Update the startBusiness function to ensure it works properly with the manager system

  // Start a business production cycle
  const _startBusiness = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    // Validate
    if (!business || !state || state.owned === 0) return

    if (DEBUG) console.log(`Starting business ${businessId}, current progress: ${state.progress}%`)

    // If progress is already started and not complete, don't restart
    if (state.progress > 0 && state.progress < 100) {
      if (DEBUG) console.log(`Business ${businessId} already in progress (${state.progress}%), not restarting`)
      return
    }

    // Avoid starting again if a timer is already running for this business
    if (businessTimers.current[businessId]) {
      if (DEBUG) console.log(`Clearing existing timer for ${businessId}`)
      clearInterval(businessTimers.current[businessId])
      delete businessTimers.current[businessId]
    }

    const speedMultiplier = safeNumber(state.speedMultiplier, 1)
    const duration = (business.baseTime / speedMultiplier) * 1000 // convert to ms
    const startTime = Date.now()

    if (DEBUG)
      console.log(`Starting business ${businessId} with duration ${duration}ms, speed multiplier: ${speedMultiplier}`)

    // Set initial progress
    setBusinessStates((prev) => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        progress: 0.1,
        lastCollected: startTime,
      },
    }))

    // Also update the ref for immediate access
    businessStatesRef.current = {
      ...businessStatesRef.current,
      [businessId]: {
        ...businessStatesRef.current[businessId],
        progress: 0.1,
        lastCollected: startTime,
      },
    }

    // Start interval specific to this business
    businessTimers.current[businessId] = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percent = Math.min((elapsed / duration) * 100, 100)

      if (DEBUG && Math.floor(percent) % 10 === 0) {
        console.log(`Business ${businessId} progress: ${percent.toFixed(1)}%`)
      }

      setBusinessStates((prev) => {
        // If the business no longer exists in the state, clear the timer
        if (!prev[businessId]) {
          if (businessTimers.current[businessId]) {
            clearInterval(businessTimers.current[businessId])
            delete businessTimers.current[businessId]
          }
          return prev
        }

        return {
          ...prev,
          [businessId]: {
            ...prev[businessId],
            progress: percent,
          },
        }
      })

      // Also update the ref for immediate access
      if (businessStatesRef.current[businessId]) {
        businessStatesRef.current = {
          ...businessStatesRef.current,
          [businessId]: {
            ...businessStatesRef.current[businessId],
            progress: percent,
          },
        }
      }

      if (percent >= 100) {
        if (DEBUG) console.log(`Business ${businessId} reached 100%`)
        clearInterval(businessTimers.current[businessId])
        delete businessTimers.current[businessId]
      }
    }, 100) // update every 100ms
  }

  // Collect revenue from a business
  const _collectBusiness = (businessId: string, e: React.MouseEvent) => {
    try {
      const business = initialBusinesses.find((b) => b.id === businessId)
      const state = businessStates[businessId]

      if (!business || !state || state.owned === 0 || state.progress < 100) return

      // Calculate revenue
      const revenue = calculateRevenue(businessId)

      // Update cash and stats
      setCash((prev) => prev + revenue)
      setLifetimeEarnings((prev) => prev + revenue)
      setStats((prev) => ({
        ...prev,
        totalEarnings: safeNumber(prev.totalEarnings, 0) + revenue,
        totalCustomersServed: safeNumber(prev.totalCustomersServed, 0) + safeNumber(state.owned, 0),
      }))

      // Reset progress
      setBusinessStates((prev) => ({
        ...prev,
        [businessId]: {
          ...prev[businessId],
          progress: 0,
          lastCollected: null,
        },
      }))

      // Check for achievements
      checkAchievements()
    } catch (error) {
      logError(error, `collectBusiness for ${businessId}`)
      // Provide fallback behavior or show error message to user
    }
  }

  // Buy a business
  const _buyBusiness = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate cost
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    const cost = baseCost * Math.pow(costMultiplier, ownedCount)

    // Ensure cost is a valid number
    const safeCost = isNaN(cost) ? 0 : cost

    // Check if player has enough cash
    if (cash < safeCost) return

    // Update cash and business state
    setCash((prev) => prev - safeCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 1,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 1),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy 10 businesses
  const _buy10Businesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate total cost for 10 businesses
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0

    for (let i = 0; i < 10; i++) {
      totalCost += baseCost * Math.pow(costMultiplier, ownedCount + i)
    }

    // Ensure totalCost is a valid number
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost

    // Check if player has enough cash
    if (cash < safeTotalCost) return

    // Update cash and business state
    setCash((prev) => prev - safeTotalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 10,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 10),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy 100 businesses
  const _buy100Businesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate total cost for 100 businesses
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0

    for (let i = 0; i < 100; i++) {
      totalCost += baseCost * Math.pow(costMultiplier, ownedCount + i)
    }

    // Ensure totalCost is a valid number
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost

    // Check if player has enough cash
    if (cash < safeTotalCost) return

    // Update cash and business state
    setCash((prev) => prev - safeTotalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 100,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 100),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy max businesses
  const _buyMaxBusinesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate how many businesses can be bought
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0
    let canBuy = 0

    for (let i = 0; i < 1000; i++) {
      // Limit to 1000 to prevent infinite loops
      const nextCost = baseCost * Math.pow(costMultiplier, ownedCount + i)
      if (isNaN(nextCost) || totalCost + nextCost > cash) break
      totalCost += nextCost
      canBuy++
    }

    if (canBuy === 0) return

    // Update cash and business state
    setCash((prev) => prev - totalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + canBuy,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + canBuy),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Process manager collection
  const processManagerCollection = (businessId: string, amount: number) => {
    if (DEBUG) {
      console.log(`Manager collecting ${amount} from ${businessId}`)
      console.log(`Current cash: ${cashRef.current}`)
    }

    // Ensure amount is a valid number and greater than 0
    const safeAmount = isNaN(amount) || amount <= 0 ? 1 : amount

    // Update cash and stats
    setCash((prev) => {
      const newCash = prev + safeAmount
      if (DEBUG) console.log(`New cash after collection: ${newCash}`)
      return newCash
    })

    setLifetimeEarnings((prev) => prev + safeAmount)
    setStats((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + safeAmount,
      totalCustomersServed: prev.totalCustomersServed + (businessStates[businessId]?.owned || 0),
    }))

    // Find the manager for this business
    const manager = initialManagers.find((m) => m.businessId === businessId)
    if (manager) {
      // Update manager statistics
      setManagerStats((prev) => {
        const now = Date.now()
        const managerId = manager.id
        const business = initialBusinesses.find((b) => b.id === businessId)
        const currentStats = prev[managerId] || {
          totalEarnings: 0,
          collections: 0,
          lastCollection: 0,
          businessName: business?.name || "Unknown",
          managerName: manager.name,
        }

        return {
          ...prev,
          [managerId]: {
            ...currentStats,
            totalEarnings: currentStats.totalEarnings + safeAmount,
            collections: currentStats.collections + 1,
            lastCollection: now,
          },
        }
      })
    }

    // Add visual feedback for manager collection
    setManagerCollections((prev) => ({
      ...prev,
      [businessId]: {
        amount: safeAmount,
        timestamp: Date.now(),
      },
    }))

    // Check for achievements
    checkAchievements()
  }

  // Update business state
  const updateBusinessState = (businessId: string, updates: any) => {
    if (DEBUG) console.log(`Updating business state for ${businessId}:`, updates)

    // Immediately update the ref for faster access by other functions
    if (businessStatesRef.current[businessId]) {
      businessStatesRef.current = {
        ...businessStatesRef.current,
        [businessId]: {
          ...businessStatesRef.current[businessId],
          ...updates,
        },
      }
    }

    // Then update the state to trigger a re-render
    setBusinessStates((prev) => {
      if (!prev[businessId]) return prev // Skip if business doesn't exist

      return {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          ...updates,
        },
      }
    })
  }

  // Buy a manager
  const _buyManager = (managerId: string) => {
    if (DEBUG) console.log("Buying manager:", managerId)
    const manager = initialManagers.find((m) => m.id === managerId)

    if (!manager) {
      console.error("Manager not found:", managerId)
      return
    }

    // Apply gold sunglasses effect (50% cheaper managers)
    const managerCost = getManagerCost(manager.cost)

    // Check if player has enough cash
    if (cash < managerCost) {
      if (DEBUG) console.log("Not enough cash to buy manager")
      return
    }

    // Update cash
    setCash((prev) => prev - managerCost)

    // Update managers state - IMPORTANT: Do this first
    const newManagers = {
      ...managersRef.current,
      [managerId]: true,
    }

    // Update the ref immediately
    managersRef.current = newManagers

    // Then update the state
    setManagers(newManagers)

    // Update business state to have a manager
    const newBusinessStates = {
      ...businessStatesRef.current,
      [manager.businessId]: {
        ...businessStatesRef.current[manager.businessId],
        hasManager: true,
      },
    }

    // Update the ref immediately
    businessStatesRef.current = newBusinessStates

    // Then update the state
    setBusinessStates(newBusinessStates)

    // Start the business if it's idle
    const state = businessStatesRef.current[manager.businessId]
    if (state && state.owned > 0 && state.progress === 0) {
      if (DEBUG) console.log(`Starting idle business ${manager.businessId} after hiring manager`)
      _startBusiness(manager.businessId)
    }

    // Always recreate the manager system when a new manager is hired
    if (DEBUG) console.log("Recreating manager system after hiring new manager")
    if (managerSystemTimer.current) {
      clearInterval(managerSystemTimer.current)
      managerSystemTimer.current = null
    }

    // Use a small timeout to ensure state updates have propagated
    setTimeout(() => {
      initializeManagerSystem()
    }, 100)
  }

  // Setup the manager system timer - completely rewritten
  const setupManagerSystemTimer = () => {
    if (DEBUG) console.log("Setting up manager system timer")

    // Clear any existing timer
    if (managerSystemTimer.current) {
      if (typeof managerSystemTimer.current === "function") {
        managerSystemTimer.current()
      } else {
        clearInterval(managerSystemTimer.current)
      }
      managerSystemTimer.current = null
    }

    // Get all hired managers
    const hiredManagers = initialManagers.filter((manager) => {
      const isHired = managersRef.current[manager.id]
      if (DEBUG) console.log(`Manager ${manager.name} for ${manager.businessId}: hired=${isHired}`)
      return isHired
    })

    if (hiredManagers.length === 0) {
      if (DEBUG) console.log("No managers hired, not setting up manager system")
      return
    }

    if (DEBUG) {
      console.log(`Setting up manager system with ${hiredManagers.length} managers:`)
      hiredManagers.forEach((m) => {
        console.log(`- ${m.name} (${m.businessId})`)

        // Verify the business state
        const state = businessStatesRef.current[m.businessId]
        console.log(
          `  Business state: owned=${state?.owned}, hasManager=${state?.hasManager}, progress=${state?.progress?.toFixed(1)}%`,
        )
      })
    }

    // Setup the manager system with the current list of hired managers
    const cleanupFunction = setupManagerSystem(
      hiredManagers,
      // Get business state - use a direct function to avoid closure issues
      (businessId) => {
        return businessStatesRef.current[businessId]
      },
      // Get business data
      (businessId) => initialBusinesses.find((b) => b.id === businessId),
      // Calculate revenue
      calculateRevenue,
      // Update business state - use a direct function to avoid closure issues
      (businessId, updates) => {
        // Update the ref immediately
        if (businessStatesRef.current[businessId]) {
          businessStatesRef.current = {
            ...businessStatesRef.current,
            [businessId]: {
              ...businessStatesRef.current[businessId],
              ...updates,
            },
          }
        }

        // Then update the state
        setBusinessStates((prev) => {
          if (!prev[businessId]) return prev

          return {
            ...prev,
            [businessId]: {
              ...prev[businessId],
              ...updates,
            },
          }
        })
      },
      // Collect revenue
      processManagerCollection,
      // Handle manager collection
      (collection) => {
        if (DEBUG) console.log(`Manager collection notification:`, collection)
        setManagerCollections((prev) => ({
          ...prev,
          [collection.businessId]: {
            amount: collection.amount,
            timestamp: Date.now(),
          },
        }))
      },
      // Start business - use the direct function to avoid closure issues
      startBusiness,
    )

    // Store the cleanup function
    managerSystemTimer.current = cleanupFunction

    if (DEBUG) console.log("Manager system set up successfully")
  }

  // Make sure to use this function in both places where the manager system is set up
  // Remove this line since we already have a full function declaration for setupManagerSystemTimerFn later in the code.

  // Start a business production cycle - fixed to work better with managers
  const startBusiness = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStatesRef.current[businessId]

    // Validate
    if (!business || !state || state.owned === 0) {
      if (DEBUG) console.log(`Cannot start business ${businessId}: invalid state`)
      return
    }

    if (DEBUG) console.log(`Starting business ${businessId}, current progress: ${state.progress}%`)

    // If progress is already started and not complete, don't restart
    if (state.progress > 0 && state.progress < 100) {
      if (DEBUG) console.log(`Business ${businessId} already in progress (${state.progress}%), not restarting`)
      return
    }

    // Avoid starting again if a timer is already running for this business
    if (businessTimers.current[businessId]) {
      if (DEBUG) console.log(`Clearing existing timer for ${businessId}`)
      clearInterval(businessTimers.current[businessId])
      delete businessTimers.current[businessId]
    }

    const speedMultiplier = safeNumber(state.speedMultiplier, 1)
    const duration = (business.baseTime / speedMultiplier) * 1000 // convert to ms
    const startTime = Date.now()

    if (DEBUG)
      console.log(`Starting business ${businessId} with duration ${duration}ms, speed multiplier: ${speedMultiplier}`)

    // Set initial progress - update ref first
    businessStatesRef.current = {
      ...businessStatesRef.current,
      [businessId]: {
        ...businessStatesRef.current[businessId],
        progress: 0.1,
        lastCollected: startTime,
      },
    }

    // Then update state
    setBusinessStates((prev) => ({
      ...prev,
      [businessId]: {
        ...prev[businessId],
        progress: 0.1,
        lastCollected: startTime,
      },
    }))

    // Start interval specific to this business
    businessTimers.current[businessId] = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percent = Math.min((elapsed / duration) * 100, 100)

      if (DEBUG && Math.floor(percent) % 25 === 0) {
        console.log(`Business ${businessId} progress: ${percent.toFixed(1)}%`)
      }

      // Update ref first
      if (businessStatesRef.current[businessId]) {
        businessStatesRef.current = {
          ...businessStatesRef.current,
          [businessId]: {
            ...businessStatesRef.current[businessId],
            progress: percent,
          },
        }
      }

      // Then update state
      setBusinessStates((prev) => {
        // If the business no longer exists in the state, clear the timer
        if (!prev[businessId]) {
          if (businessTimers.current[businessId]) {
            clearInterval(businessTimers.current[businessId])
            delete businessTimers.current[businessId]
          }
          return prev
        }

        return {
          ...prev,
          [businessId]: {
            ...prev[businessId],
            progress: percent,
          },
        }
      })

      if (percent >= 100) {
        if (DEBUG) console.log(`Business ${businessId} reached 100%`)
        clearInterval(businessTimers.current[businessId])
        delete businessTimers.current[businessId]

        // If this business has a manager, let the manager system handle it
        const hasManager = businessStatesRef.current[businessId]?.hasManager
        if (hasManager && DEBUG) {
          console.log(`Business ${businessId} has a manager, letting manager system handle collection`)
        }
      }
    }, 100) // update every 100ms
  }

  // Collect revenue from a business
  const collectBusiness = (businessId: string, e: React.MouseEvent) => {
    try {
      const business = initialBusinesses.find((b) => b.id === businessId)
      const state = businessStates[businessId]

      if (!business || !state || state.owned === 0 || state.progress < 100) return

      // Calculate revenue
      const revenue = calculateRevenue(businessId)

      if (DEBUG) {
        console.log(`Collecting from ${businessId}, calculated revenue: ${revenue.toFixed(2)}`)
      }

      // Update cash and stats
      setCash((prev) => prev + revenue)
      setLifetimeEarnings((prev) => prev + revenue)
      setStats((prev) => ({
        ...prev,
        totalEarnings: safeNumber(prev.totalEarnings, 0) + revenue,
        totalCustomersServed: safeNumber(prev.totalCustomersServed, 0) + safeNumber(state.owned, 0),
      }))

      // Reset progress
      setBusinessStates((prev) => ({
        ...prev,
        [businessId]: {
          ...prev[businessId],
          progress: 0,
          lastCollected: null,
        },
      }))

      // Check for achievements
      checkAchievements()
    } catch (error) {
      logError(error, `collectBusiness for ${businessId}`)
      // Provide fallback behavior or show error message to user
    }
  }

  // Buy a business
  const buyBusiness = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate cost
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    const cost = baseCost * Math.pow(costMultiplier, ownedCount)

    // Ensure cost is a valid number
    const safeCost = isNaN(cost) ? 0 : cost

    // Check if player has enough cash
    if (cash < safeCost) return

    // Update cash and business state
    setCash((prev) => prev - safeCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 1,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 1),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy 10 businesses
  const buy10Businesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate total cost for 10 businesses
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0

    for (let i = 0; i < 10; i++) {
      totalCost += baseCost * Math.pow(costMultiplier, ownedCount + i)
    }

    // Ensure totalCost is a valid number
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost

    // Check if player has enough cash
    if (cash < safeTotalCost) return

    // Update cash and business state
    setCash((prev) => prev - safeTotalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 10,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 10),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy 100 businesses
  const buy100Businesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate total cost for 100 businesses
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0

    for (let i = 0; i < 100; i++) {
      totalCost += baseCost * Math.pow(costMultiplier, ownedCount + i)
    }

    // Ensure totalCost is a valid number
    const safeTotalCost = isNaN(totalCost) ? 0 : totalCost

    // Check if player has enough cash
    if (cash < safeTotalCost) return

    // Update cash and business state
    setCash((prev) => prev - safeTotalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + 100,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + 100),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Buy max businesses
  const buyMaxBusinesses = (businessId: string) => {
    const business = initialBusinesses.find((b) => b.id === businessId)
    const state = businessStates[businessId]

    if (!business) return

    // Calculate how many businesses can be bought
    const baseCost = business.baseCost
    const costMultiplier = business.costMultiplier
    const ownedCount = state?.owned || 0
    let totalCost = 0
    let canBuy = 0

    for (let i = 0; i < 1000; i++) {
      // Limit to 1000 to prevent infinite loops
      const nextCost = baseCost * Math.pow(costMultiplier, ownedCount + i)
      if (isNaN(nextCost) || totalCost + nextCost > cash) break
      totalCost += nextCost
      canBuy++
    }

    if (canBuy === 0) return

    // Update cash and business state
    setCash((prev) => prev - totalCost)
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [businessId]: {
          ...prev[businessId],
          owned: (prev[businessId]?.owned || 0) + canBuy,
          level: Math.max(prev[businessId]?.level || 1, 1),
        },
      }

      // Apply premium item effects
      newState[businessId] = applyPremiumItemEffects(newState[businessId])

      return newState
    })

    // Update stats
    setStats((prev) => ({
      ...prev,
      maxBusinessOwned: Math.max(prev.maxBusinessOwned, (businessStates[businessId]?.owned || 0) + canBuy),
    }))

    // Check for achievements
    checkAchievements()
  }

  // Process manager collection

  // Update business state

  // Buy a manager
  const buyManager = (managerId: string) => {
    if (DEBUG) console.log("Buying manager:", managerId)
    const manager = initialManagers.find((m) => m.id === managerId)

    if (!manager) {
      console.error("Manager not found:", managerId)
      return
    }

    // Apply gold sunglasses effect (50% cheaper managers)
    const managerCost = getManagerCost(manager.cost)

    // Check if player has enough cash
    if (cash < managerCost) {
      if (DEBUG) console.log("Not enough cash to buy manager")
      return
    }

    // Update cash
    setCash((prev) => prev - managerCost)

    // Update managers state - IMPORTANT: Do this first
    const newManagers = {
      ...managersRef.current,
      [managerId]: true,
    }

    // Update the ref immediately
    managersRef.current = newManagers

    // Then update the state
    setManagers(newManagers)

    // Update business state to have a manager
    const newBusinessStates = {
      ...businessStatesRef.current,
      [manager.businessId]: {
        ...businessStatesRef.current[manager.businessId],
        hasManager: true,
      },
    }

    // Update the ref immediately
    businessStatesRef.current = newBusinessStates

    // Then update the state
    setBusinessStates(newBusinessStates)

    // Start the business if it's idle
    const state = businessStatesRef.current[manager.businessId]
    if (state && state.owned > 0 && state.progress === 0) {
      if (DEBUG) console.log(`Starting idle business ${manager.businessId} after hiring manager`)
      _startBusiness(manager.businessId)
    }

    // Always recreate the manager system after hiring a new manager
    if (DEBUG) console.log("Recreating manager system after hiring new manager")
    if (managerSystemTimer.current) {
      clearInterval(managerSystemTimer.current)
      managerSystemTimer.current = null
    }

    // Use a small timeout to ensure state updates have propagated
    setTimeout(() => {
      initializeManagerSystem()
    }, 100)
  }

  // Setup the manager system timer - completely rewritten
  const initializeManagerSystem = () => {
    if (DEBUG) console.log("Setting up manager system timer")

    // Clear any existing timer
    if (managerSystemTimer.current) {
      clearInterval(managerSystemTimer.current)
      managerSystemTimer.current = null
    }

    // Get all hired managers
    const hiredManagers = initialManagers.filter((manager) => {
      const isHired = managersRef.current[manager.id]
      if (DEBUG) console.log(`Manager ${manager.name} for ${manager.businessId}: hired=${isHired}`)
      return isHired
    })

    if (hiredManagers.length === 0) {
      if (DEBUG) console.log("No managers hired, not setting up manager system")
      return
    }

    if (DEBUG) {
      console.log(`Setting up manager system with ${hiredManagers.length} managers:`)
      hiredManagers.forEach((m) => {
        console.log(`- ${m.name} (${m.businessId})`)

        // Verify the business state
        const state = businessStatesRef.current[m.businessId]
        console.log(
          `  Business state: owned=${state?.owned}, hasManager=${state?.hasManager}, progress=${state?.progress?.toFixed(1)}%`,
        )
      })
    }

    // Setup the manager system with the current list of hired managers
    managerSystemTimer.current = setupManagerSystem(
      hiredManagers,
      // Get business state - use a direct function to avoid closure issues
      (businessId) => {
        return businessStatesRef.current[businessId]
      },
      // Get business data
      (businessId) => initialBusinesses.find((b) => b.id === businessId),
      // Calculate revenue
      calculateRevenue,
      // Update business state - use a direct function to avoid closure issues
      (businessId, updates) => {
        // Update the ref immediately
        if (businessStatesRef.current[businessId]) {
          businessStatesRef.current = {
            ...businessStatesRef.current,
            [businessId]: {
              ...businessStatesRef.current[businessId],
              ...updates,
            },
          }
        }

        // Then update the state
        setBusinessStates((prev) => {
          if (!prev[businessId]) return prev

          return {
            ...prev,
            [businessId]: {
              ...prev[businessId],
              ...updates,
            },
          }
        })
      },
      // Collect revenue
      processManagerCollection,
      // Handle manager collection
      (collection) => {
        if (DEBUG) console.log(`Manager collection notification:`, collection)
        setManagerCollections((prev) => ({
          ...prev,
          [collection.businessId]: {
            amount: collection.amount,
            timestamp: Date.now(),
          },
        }))
      },
      // Start business - use the direct function to avoid closure issues
      startBusiness,
    )

    if (DEBUG) console.log("Manager system set up successfully")
  }

  // Buy an upgrade
  const buyUpgrade = (upgradeId: string) => {
    const upgrade = initialUpgrades.find((u) => u.id === upgradeId)

    if (!upgrade || purchasedUpgrades[upgradeId]) return

    // Check if player has enough cash
    if (cash < upgrade.cost) return

    // Check if business level requirement is met
    const businessState = businessStates[upgrade.businessId]
    if (!businessState || businessState.owned < upgrade.requiredLevel) return

    // Update cash and upgrades
    setCash((prev) => prev - upgrade.cost)
    setPurchasedUpgrades((prev) => ({
      ...prev,
      [upgradeId]: true,
    }))

    // Apply upgrade effect
    setBusinessStates((prev) => {
      const newState = {
        ...prev,
        [upgrade.businessId]: {
          ...prev[upgrade.businessId],
          [upgrade.type === "profit" ? "profitMultiplier" : "speedMultiplier"]:
            prev[upgrade.businessId][upgrade.type === "profit" ? "profitMultiplier" : "speedMultiplier"] *
            upgrade.multiplier,
        },
      }

      // Apply premium item effects
      newState[upgrade.businessId] = applyPremiumItemEffects(newState[upgrade.businessId])

      return newState
    })
  }

  // Buy a prestige upgrade
  const buyPrestigeUpgrade = (upgradeId: string) => {
    const upgrade = prestigeUpgrades.find((u) => u.id === upgradeId)

    if (!upgrade) return

    const currentLevel = prestigeUpgradeStates[upgradeId] || 0
    const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel)

    // Ensure cost is a valid number
    const safeCost = isNaN(cost) ? 0 : cost

    // Check if player has enough $GRIND investors
    if (angelInvestors < safeCost) return

    // Update $GRIND investors and upgrade level
    setAngelInvestors((prev) => prev - safeCost)
    setPrestigeUpgradeStates((prev) => ({
      ...prev,
      [upgradeId]: (prev[upgradeId] || 0) + 1,
    }))

    // Apply global effects
    if (upgrade.effect.type === "profit" || upgrade.effect.type === "speed") {
      const multiplierType = upgrade.effect.type === "profit" ? "profitMultiplier" : "speedMultiplier"
      const multiplierValue = 1 + upgrade.effect.value

      setBusinessStates((prev) => {
        const newState = { ...prev }
        Object.keys(newState).forEach((businessId) => {
          newState[businessId] = {
            ...newState[businessId],
            [multiplierType]: (newState[businessId][multiplierType] || 1) * multiplierValue,
          }

          // Apply premium item effects
          newState[businessId] = applyPremiumItemEffects(newState[businessId])
        })
        return newState
      })
    }
  }

  // Buy a premium item
  const buyPremiumItem = (itemId: string, price: number) => {
    // Check if player has enough $GRIND investors
    if (angelInvestors < price) return

    // Update $GRIND investors and premium items
    setAngelInvestors((prev) => prev - price)
    setPremiumItems((prev) => ({
      ...prev,
      [itemId]: true,
    }))

    // Apply premium item effects to all businesses
    setBusinessStates((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((businessId) => {
        // Apply premium item effects
        newState[businessId] = applyPremiumItemEffects(newState[businessId])
      })
      return newState
    })
  }

  // Prestige (reset game with bonuses)
  const prestige = () => {
    // Calculate new $GRIND investors - REDUCED THRESHOLD from 1e12 to 1e10 to make prestiging easier
    const newAngels = Math.floor(Math.sqrt(lifetimeEarnings / 1e10))
    const totalAngels = angelInvestors + newAngels

    // Add this console log to help with debugging
    console.log(
      `Prestiging: ${newAngels} new $GRIND Beans, total: ${totalAngels}, effectiveness: ${getAngelEffectiveness()}, multiplier: ${1 + totalAngels * getAngelEffectiveness()}x`,
    )

    // Clear all timers
    Object.keys(businessTimers.current).forEach((businessId) => {
      clearInterval(businessTimers.current[businessId])
      delete businessTimers.current[businessId]
    })

    if (managerSystemTimer.current) {
      clearInterval(managerSystemTimer.current)
      managerSystemTimer.current = null
    }

    // Reset game state
    setCash(4)
    setLifetimeEarnings(4)
    setBusinessStates({})
    setManagers({})
    setPurchasedUpgrades({})
    setPrestigeLevel((prev) => prev + 1)
    setAngelInvestors(totalAngels)

    // Update stats
    setStats((prev) => ({
      ...prev,
      prestigeLevel: prev.prestigeLevel + 1,
    }))

    // Close modals
    setShowPrestigeModal(false)

    // Check for achievements
    checkAchievements()

    // Don't reset manager stats during prestige
    // This allows players to see lifetime stats across prestiges

    // Initialize business states again
    const initialBusinessStates: { [key: string]: any } = {}
    initialBusinesses.forEach((business) => {
      // Calculate the angel bonus
      const angelBonus = 1 + totalAngels * getAngelEffectiveness()

      initialBusinessStates[business.id] = {
        owned: business.id === "coffee_cart" ? 1 : 0,
        level: 1,
        hasManager: false,
        speedMultiplier: 1,
        // Apply angel bonus to profit multiplier for new businesses
        profitMultiplier: angelBonus,
        lastCollected: null,
        progress: 0,
      }
    })

    // Apply premium item effects to initial business states
    Object.keys(initialBusinessStates).forEach((businessId) => {
      initialBusinessStates[businessId] = applyPremiumItemEffects(initialBusinessStates[businessId])
    })

    setBusinessStates(initialBusinessStates)
    businessStatesRef.current = initialBusinessStates

    // Log the new state for debugging
    console.log(
      "After prestige - Angel investors:",
      totalAngels,
      "Angel effectiveness:",
      getAngelEffectiveness(),
      "Angel bonus:",
      1 + totalAngels * getAngelEffectiveness(),
    )

    // In the prestige function, add this line to clear all comic flags
    localStorage.removeItem("hasSeenCoffeeShopComic")
    localStorage.removeItem("hasSeenCoffeeCarComic")
    localStorage.removeItem("hasSeenDriveThruComic")
  }

  // Add this function to handle mini-game rewards, after the other game functions
  const handleMiniGameComplete = useCallback((score: number, reward: number) => {
    // Add the reward to the player's cash
    setCash((prev) => prev + reward)
    setLifetimeEarnings((prev) => prev + reward)

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + reward,
      beanSortingHighScore: Math.max(prev.beanSortingHighScore, score),
    }))

    // Close the mini-game
    setActiveMiniGame(null)
  }, [])

  // Check for achievements
  const checkAchievements = useCallback(() => {
    const newAchievements = { ...achievements }
    let changed = false

    ACHIEVEMENTS.forEach((achievement) => {
      if (newAchievements[achievement.id]) return // Already unlocked

      let unlocked = false
      switch (achievement.requirement.type) {
        case "earnings":
          unlocked = stats.totalEarnings >= achievement.requirement.value
          break
        case "businesses":
          unlocked = stats.maxBusinessOwned >= achievement.requirement.value
          break
        case "minigame":
          unlocked = stats.beanSortingHighScore >= achievement.requirement.value
          break
        case "customers":
          unlocked = stats.totalCustomersServed >= achievement.requirement.value
          break
        case "prestige":
          unlocked = stats.prestigeLevel >= achievement.requirement.value
          break
      }

      if (unlocked) {
        newAchievements[achievement.id] = true
        changed = true

        // Apply achievement reward
        if (achievement.reward.type === "cash") {
          setCash((prev) => prev + achievement.reward.value)
        } else if (achievement.reward.type === "multiplier") {
          // Apply global multiplier
          setBusinessStates((prev) => {
            const newState = { ...prev }
            Object.keys(newState).forEach((businessId) => {
              newState[businessId] = {
                ...newState[businessId],
                profitMultiplier: (newState[businessId].profitMultiplier || 1) * achievement.reward.value,
              }

              // Apply premium item effects
              newState[businessId] = applyPremiumItemEffects(newState[businessId])
            })
            return newState
          })
        }
      }
    })

    if (changed) {
      setAchievements(newAchievements)
    }
  }, [achievements, stats])

  // Get achievement progress
  const getAchievementProgress = useCallback(
    (achievement: any) => {
      let current = 0

      switch (achievement.requirement.type) {
        case "earnings":
          current = stats.totalEarnings
          break
        case "businesses":
          current = stats.maxBusinessOwned
          break
        case "minigame":
          current = stats.beanSortingHighScore
          break
        case "customers":
          current = stats.totalCustomersServed
          break
        case "prestige":
          current = stats.prestigeLevel
          break
      }

      // Ensure we don't return NaN
      const progress = (current / achievement.requirement.value) * 100
      return isNaN(progress) ? 0 : Math.min(100, progress)
    },
    [stats],
  )

  // Collect all ready businesses
  const collectAllBusinesses = useCallback(() => {
    let totalRevenue = 0
    const angelBonus = 1 + angelInvestors * getAngelEffectiveness()
    const prestigeBonus = prestigeLevel

    // Apply gold coins effect (2x money earned)
    const goldCoinsMultiplier = premiumItems["gold_coins"] ? 2 : 1

    Object.keys(businessStates).forEach((businessId) => {
      const business = initialBusinesses.find((b) => b.id === businessId)
      const state = businessStates[businessId]

      if (!business || !state || state.owned === 0 || state.progress < 100) return

      // Calculate revenue
      const revenue = calculateRevenue(businessId)
      // Ensure revenue is a valid number
      const safeRevenue = isNaN(revenue) ? 0 : revenue

      totalRevenue += safeRevenue

      // Reset progress
      setBusinessStates((prev) => ({
        ...prev,
        [businessId]: {
          ...prev[businessId],
          progress: 0,
          lastCollected: null,
        },
      }))
    })

    // Update cash and stats
    if (totalRevenue > 0) {
      setCash((prev) => prev + totalRevenue)
      setLifetimeEarnings((prev) => prev + totalRevenue)
      setStats((prev) => ({
        ...prev,
        totalEarnings: prev.totalEarnings + totalRevenue,
      }))
    }
  }, [angelInvestors, prestigeLevel, businessStates, calculateRevenue, premiumItems])

  // Start all idle businesses
  const startAllBusinesses = useCallback(() => {
    const now = Date.now()

    setBusinessStates((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((businessId) => {
        const state = newState[businessId]
        if (state.owned > 0 && state.progress === 0) {
          newState[businessId] = {
            ...state,
            progress: 0.1,
            lastCollected: now,
          }
        }
      })
      return newState
    })
  }, [])

  // Collect offline earnings
  const collectOfflineEarnings = useCallback(() => {
    if (!offlineProgressData) return

    const safeEarnings = isNaN(offlineProgressData.totalEarned) ? 0 : offlineProgressData.totalEarned

    setCash((prev) => prev + safeEarnings)
    setLifetimeEarnings((prev) => prev + safeEarnings)
    setStats((prev) => ({
      ...prev,
      totalEarnings: prev.totalEarnings + safeEarnings,
    }))

    setShowOfflineProgress(false)
    setOfflineProgressData(null)
  }, [offlineProgressData])

  // Update business progress
  useEffect(() => {
    if (!gameStarted || Object.keys(businessStates).length === 0) return

    const interval = setInterval(() => {
      const now = Date.now()

      setBusinessStates((prev) => {
        const newState = { ...prev }
        let updated = false

        Object.keys(newState).forEach((businessId) => {
          const state = newState[businessId]
          const business = initialBusinesses.find((b) => b.id === businessId)

          if (!business || !state || state.owned === 0) return

          // Update progress for businesses that are currently producing
          if (state.progress > 0 && state.progress < 100 && state.lastCollected) {
            const elapsedTime = now - state.lastCollected
            const baseTime = business.baseTime * 1000 // Convert to ms
            const speedMultiplier = state.speedMultiplier || 1
            const adjustedTime = baseTime / speedMultiplier

            if (isNaN(adjustedTime) || adjustedTime <= 0) {
              console.error("Invalid adjusted time:", { baseTime, speedMultiplier, adjustedTime })
              return
            }

            const progressIncrease = (elapsedTime / adjustedTime) * 100
            const newProgress = Math.min(100, state.progress + progressIncrease)

            if (newProgress !== state.progress) {
              newState[businessId] = {
                ...state,
                progress: newProgress,
                lastCollected: now,
              }
              updated = true
            }
          }
        })

        return updated ? newState : prev
      })
    }, 100) // Update every 100ms for smooth progress

    return () => clearInterval(interval)
  }, [gameStarted, businessStates])

  // Setup manager system when the game starts or when managers change
  useEffect(() => {
    if (!gameStarted || Object.keys(businessStates).length === 0) return

    if (DEBUG) console.log("Setting up manager system based on state changes")

    // Check if any managers are hired
    const hasManagers = Object.values(businessStates).some((state) => state.hasManager)

    if (hasManagers) {
      if (DEBUG) console.log("Found businesses with managers, setting up manager system")
      initializeManagerSystem()
    }

    return () => {
      // Clean up manager system when component unmounts
      if (managerSystemTimer.current) {
        clearInterval(managerSystemTimer.current)
        managerSystemTimer.current = null
      }
    }
  }, [gameStarted, managers])

  // Calculate ready and idle businesses
  const readyBusinesses = Object.values(businessStates).filter(
    (state) => state.owned > 0 && state.progress >= 100,
  ).length

  const idleBusinesses = Object.values(businessStates).filter((state) => state.owned > 0 && state.progress === 0).length

  // Calculate total revenue for ready businesses
  const totalReadyRevenue = Object.keys(businessStates).reduce((total, businessId) => {
    const state = businessStates[businessId]
    if (!state || state.owned === 0 || state.progress < 100) return total
    return total + calculateRevenue(businessId)
  }, 0)

  // Calculate prestige multiplier and new $GRIND beans
  const calculatePrestigeMultiplier = useCallback(() => {
    const newAngels = Math.floor(Math.sqrt(lifetimeEarnings / 1e10))
    if (newAngels === 0) return 0

    const angelEffectiveness = getAngelEffectiveness()
    const multiplier = newAngels * angelEffectiveness
    return isNaN(multiplier) ? 0 : +multiplier.toFixed(2)
  }, [lifetimeEarnings])

  // Get the number of new $GRIND beans that would be earned on prestige
  const getNewAngels = useCallback(() => {
    // More generous formula - cubic root instead of square root
    return Math.floor(Math.cbrt(lifetimeEarnings / 1e8))
  }, [lifetimeEarnings])

  // Check if player can prestige
  const canPrestige = calculatePrestigeMultiplier() > 0

  // Start the game
  const handleStartGame = useCallback(() => {
    setGameStarted(true)

    // Add a small delay before playing music to ensure the audio context is ready
    setTimeout(() => {
      try {
        soundManager.playMusic("main")
      } catch (error) {
        console.error("Error playing music:", error)
      }
    }, 100)
  }, [])

  // Add these debug functions to the Home component
  const resetManagerSystem = useCallback(() => {
    if (DEBUG) console.log("Resetting manager system")

    // Clear the existing timer
    if (managerSystemTimer.current) {
      clearInterval(managerSystemTimer.current)
      managerSystemTimer.current = null
    }

    // Setup the manager system again
    initializeManagerSystem()
  }, [])

  const fixAllBusinesses = useCallback(() => {
    if (DEBUG) console.log("Fixing all businesses")

    // Update all businesses with managers to ensure they're in a valid state
    setBusinessStates((prev) => {
      const newState = { ...prev }

      Object.keys(newState).forEach((businessId) => {
        const state = newState[businessId]
        if (state.hasManager && state.owned > 0) {
          // If progress is stuck at 100%, reset it to 0
          if (state.progress >= 100) {
            newState[businessId] = {
              ...state,
              progress: 0,
              lastCollected: null,
            }
          }
          // If progress is 0, make sure it's ready to start
          else if (state.progress === 0) {
            newState[businessId] = {
              ...state,
              lastCollected: null,
            }
          }
        }
      })

      return newState
    })

    // Update the ref
    businessStatesRef.current = { ...businessStates }

    // Reset the manager system
    resetManagerSystem()
  }, [resetManagerSystem])

  const clearLocalStorage = useCallback(() => {
    if (DEBUG) console.log("Clearing local storage")
    localStorage.clear()
  }, [])

  // Add this function to the Home component

  // Force start all businesses with managers
  const forceStartAllManagerBusinesses = useCallback(() => {
    if (DEBUG) console.log("Force starting all businesses with managers")

    // Get all businesses with managers
    const businessesWithManagers = Object.entries(businessStatesRef.current)
      .filter(([_, state]) => state?.hasManager && state?.owned > 0)
      .map(([id]) => id)

    if (businessesWithManagers.length === 0) {
      if (DEBUG) console.log("No businesses with managers found")
      return
    }

    // Force start each business
    businessesWithManagers.forEach((businessId) => {
      if (DEBUG) console.log(`Force starting business ${businessId}`)

      // Reset progress to 0
      updateBusinessState(businessId, {
        progress: 0,
        lastCollected: null,
      })

      // Start the business
      startBusiness(businessId)
    })

    // Reset the manager system
    resetManagerSystem()
  }, [resetManagerSystem])

  // Wrap the entire return in an error boundary
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-amber-950 text-amber-100 flex items-center justify-center">
          <div className="bg-amber-800 p-8 rounded-lg max-w-md text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-300" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-6">We encountered an error while loading the game. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()} className="bg-amber-600 hover:bg-amber-700">
              Refresh Page
            </Button>
          </div>
        </div>
      }
      onReset={() => {
        setHasError(false)
        setErrorMessage("")
      }}
    >
      {hasError ? (
        <div className="min-h-screen bg-amber-950 text-amber-100 flex items-center justify-center">
          <div className="bg-amber-800 p-8 rounded-lg max-w-md text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-300" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="mb-2">{errorMessage}</p>
            <p className="mb-6 text-sm text-amber-300">Don't worry, your game progress is saved.</p>
            <Button onClick={() => setHasError(false)} className="bg-amber-600 hover:bg-amber-700">
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-amber-950 text-amber-100 relative overflow-hidden">
          <AnimatedBackground />

          {!gameStarted ? (
            <StartScreen onStart={handleStartGame} />
          ) : (
            <>
              <GameHeader
                coins={cash}
                level={prestigeLevel}
                passiveIncome={
                  Object.keys(businessStates).reduce((total, businessId) => {
                    const business = initialBusinesses.find((b) => b.id === businessId)
                    const state = businessStates[businessId]
                    if (!business || !state || state.owned === 0 || !state.hasManager) return total

                    const baseRevenue = business.baseRevenue || 0
                    const ownedCount = state.owned || 0
                    const profitMultiplier = state.profitMultiplier || 1
                    const speedMultiplier = state.speedMultiplier || 1
                    const angelBonus = 1 + (angelInvestors || 0) * getAngelEffectiveness()
                    const prestigeBonus = prestigeLevel || 1
                    const goldCoinsMultiplier = premiumItems["gold_coins"] ? 2 : 1

                    const cycleTime = (business.baseTime || 1) / speedMultiplier
                    const revenuePerSecond =
                      (baseRevenue * ownedCount * profitMultiplier * angelBonus * prestigeBonus * goldCoinsMultiplier) /
                      cycleTime

                    return total + (isNaN(revenuePerSecond) ? 0 : revenuePerSecond)
                  }, 0) || 0
                }
                angelInvestors={angelInvestors}
                prestigeLevel={prestigeLevel}
                prestigeMultiplier={1 + angelInvestors * getAngelEffectiveness()} // Add this line to pass the prestige multiplier
                onShowManagers={() => setShowManagerModal(true)}
                onShowUpgrades={() => setShowUpgradeModal(true)}
                onShowStats={() => setShowStatsModal(true)}
                onShowAchievements={() => setShowAchievementsPanel(true)}
                onShowPremiumShop={() => setShowPremiumShop(true)}
                onShowFAQ={() => setShowFAQModal(true)}
                onShowPrestigeShop={() => setShowPrestigeShopModal(true)}
                onShowMiniGames={() => setShowMiniGamesModal(true)}
              />

              <main className="container mx-auto p-4 pb-24">
                <BusinessGrid
                  businesses={initialBusinesses}
                  businessStates={businessStates}
                  cash={cash}
                  onBuy={buyBusiness}
                  onBuy10={buy10Businesses}
                  onBuy100={buy100Businesses}
                  onBuyMax={buyMaxBusinesses}
                  onCollect={collectBusiness}
                  onStart={startBusiness}
                  getTimeRemaining={getTimeRemaining}
                  onClick={() => setStats((prev) => ({ ...prev, totalClicks: prev.totalClicks + 1 }))}
                  managerCollections={managerCollections}
                />
              </main>

              <GlobalActionsBar
                cash={cash}
                onCollectAll={collectAllBusinesses}
                onStartAll={startAllBusinesses}
                readyBusinesses={readyBusinesses}
                idleBusinesses={idleBusinesses}
                totalRevenue={isNaN(totalReadyRevenue) ? 0 : totalReadyRevenue}
                onPrestige={() => setShowPrestigeModal(true)}
                prestigeMultiplier={calculatePrestigeMultiplier()}
                canPrestige={canPrestige}
              />

              <ManagerModal
                show={showManagerModal}
                onClose={() => setShowManagerModal(false)}
                managers={initialManagers}
                cash={cash}
                onBuyManager={_buyManager}
                businesses={businessStates}
                managerStats={managerStats}
              />

              <UpgradeModal
                show={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                upgrades={initialUpgrades}
                purchasedUpgrades={purchasedUpgrades}
                cash={cash}
                onBuyUpgrade={buyUpgrade}
                businessStates={businessStates || {}} // Ensure this is never undefined
              />

              <StatsModal
                show={showStatsModal}
                onClose={() => setShowStatsModal(false)}
                stats={stats}
                businesses={initialBusinesses}
                cash={cash}
                lifetimeEarnings={lifetimeEarnings}
                prestigeLevel={prestigeLevel}
                angelInvestors={angelInvestors}
                managerStats={managerStats}
              />

              <PrestigeModal
                show={showPrestigeModal}
                onClose={() => setShowPrestigeModal(false)}
                onPrestige={prestige}
                lifetimeEarnings={lifetimeEarnings}
                prestigeLevel={prestigeLevel}
                angelInvestors={angelInvestors}
                newAngels={getNewAngels()}
                angelEffectiveness={getAngelEffectiveness()}
                prestigeUpgrades={prestigeUpgrades}
                prestigeUpgradeStates={prestigeUpgradeStates}
                onBuyPrestigeUpgrade={buyPrestigeUpgrade}
              />

              <AchievementsPanel
                show={showAchievementsPanel}
                onClose={() => setShowAchievementsPanel(false)}
                achievements={achievements}
                getAchievementProgress={getAchievementProgress}
              />

              {showPremiumShop && (
                <PremiumShop
                  show={showPremiumShop}
                  onClose={() => setShowPremiumShop(false)}
                  angelInvestors={angelInvestors}
                  onPurchase={buyPremiumItem}
                  ownedItems={Object.keys(premiumItems).filter((key) => premiumItems[key])}
                />
              )}

              <FAQModal show={showFAQModal} onClose={() => setShowFAQModal(false)} />

              <OfflineProgressModal
                show={showOfflineProgress}
                offlineProgressData={offlineProgressData}
                onCollect={collectOfflineEarnings}
                onClose={() => setShowOfflineProgress(false)}
              />

              <PrestigeShopModal
                show={showPrestigeShopModal}
                onClose={() => setShowPrestigeShopModal(false)}
                angelInvestors={angelInvestors}
                prestigeUpgrades={prestigeUpgrades}
                prestigeUpgradeStates={prestigeUpgradeStates}
                onBuyPrestigeUpgrade={buyPrestigeUpgrade}
              />

              {/* Mini Games Modal */}
              <MiniGamesModal
                show={showMiniGamesModal}
                onClose={() => setShowMiniGamesModal(false)}
                onSelectGame={(game) => {
                  setActiveMiniGame(game)
                  setShowMiniGamesModal(false)
                }}
              />

              {/* Active Mini Game */}
              {activeMiniGame === "coffee-brewing" && (
                <CoffeeBrewingGame
                  onComplete={handleMiniGameComplete}
                  onClose={() => setActiveMiniGame(null)}
                  difficultyLevel={prestigeLevel}
                  baseReward={150 * prestigeLevel}
                />
              )}

              {activeMiniGame === "bean-sorting" && (
                <BeanSortingGame
                  onComplete={handleMiniGameComplete}
                  onClose={() => setActiveMiniGame(null)}
                  difficultyLevel={prestigeLevel}
                  baseReward={100 * prestigeLevel}
                />
              )}

              {/* Debug button */}
              <div className="fixed bottom-24 right-4 z-40">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                  onClick={() => setShowDebugPanel(true)}
                >
                  <Bug className="h-5 w-5" />
                </Button>
              </div>

              {/* Debug panel */}
              <DebugPanel
                isOpen={showDebugPanel}
                onClose={() => setShowDebugPanel(false)}
                businessStates={businessStates}
                managers={managers}
                onResetManagers={resetManagerSystem}
                onFixAllBusinesses={fixAllBusinesses}
                onClearLocalStorage={clearLocalStorage}
                onForceStartAllManagerBusinesses={forceStartAllManagerBusinesses}
              />
            </>
          )}
        </div>
      )}
    </ErrorBoundary>
  )
}
