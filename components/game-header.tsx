"use client"

import {
  Star,
  Users,
  TrendingUp,
  Award,
  Settings,
  Coffee,
  ShoppingBag,
  HelpCircle,
  Sparkles,
  Coins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { logError } from "@/lib/error-utils"
import { formatCurrency } from "@/lib/utils"
import SoundControls from "@/components/sound-controls"

interface GameHeaderProps {
  coins: number
  level: number
  passiveIncome: number
  angelInvestors: number
  prestigeLevel: number
  prestigeMultiplier: number // Add this new prop
  onShowManagers: () => void
  onShowUpgrades: () => void
  onShowStats: () => void
  onShowAchievements: () => void
  onShowPremiumShop: () => void
  onShowFAQ: () => void
  onShowPrestigeShop: () => void
  onShowMiniGames: () => void
}

// Modify the formatNumber function to include error handling
function formatNumber(value: number): string {
  try {
    if (isNaN(value)) return "0"

    // Format with at most 2 decimal places
    const formatted = value.toFixed(2)

    // Remove trailing zeros and decimal point if it's a whole number
    return Number(formatted).toString()
  } catch (error) {
    logError(error, "formatNumber in GameHeader")
    return "0"
  }
}

// Update the component to include the Prestige Shop button
export default function GameHeader({
  coins,
  level,
  passiveIncome,
  angelInvestors,
  prestigeLevel,
  prestigeMultiplier, // Add this new parameter
  onShowManagers,
  onShowUpgrades,
  onShowStats,
  onShowAchievements,
  onShowPremiumShop,
  onShowFAQ,
  onShowPrestigeShop,
  onShowMiniGames,
}: GameHeaderProps) {
  // Format passive income
  const formatPassiveIncome = (income: number) => {
    if (income >= 1e12) return `${(income / 1e12).toFixed(2)}T/s`
    if (income >= 1e9) return `${(income / 1e9).toFixed(2)}B/s`
    if (income >= 1e6) return `${(income / 1e6).toFixed(2)}M/s`
    if (income >= 1e3) return `${(income / 1e3).toFixed(2)}K/s`
    return `${income.toFixed(2)}/s`
  }

  // Ensure coins value is safe
  const safeCoins = isNaN(coins) ? 0 : coins

  return (
    <header className="bg-gradient-to-r from-amber-900 to-amber-800 p-3 shadow-md sticky top-0 z-20 border-b border-amber-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center">
            <Coffee className="h-8 w-8 mr-2 text-amber-400" />
            <h1 className="text-xl font-bold text-amber-100">$GRIND: Bean Hustle</h1>
          </div>

          {/* Desktop buttons (hidden on mobile) */}
          <div className="hidden md:flex flex-wrap gap-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowManagers}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <Users className="h-4 w-4 mr-1" />
              Managers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowUpgrades}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Upgrades
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPrestigeShop}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-purple-400 whitespace-nowrap flex items-center justify-center"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Prestige Shop
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAchievements}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <Award className="h-4 w-4 mr-1" />
              Achievements
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowStats}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <Settings className="h-4 w-4 mr-1" />
              Stats
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPremiumShop}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
              title="Premium Shop (click X to close)"
              aria-label="Open Premium Shop"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Premium
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowFAQ}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              FAQ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowMiniGames}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 whitespace-nowrap flex items-center justify-center"
            >
              <Coffee className="h-4 w-4 mr-1" />
              Mini Games
            </Button>
          </div>

          {/* Mobile buttons (hidden on desktop) */}
          <div className="flex md:hidden flex-wrap gap-2 text-sm overflow-x-auto pb-2 max-w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={onShowManagers}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Managers"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowUpgrades}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Upgrades"
            >
              <TrendingUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPrestigeShop}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-purple-400 p-2 flex items-center justify-center"
              title="Prestige Shop"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowAchievements}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Achievements"
            >
              <Award className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowStats}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Stats"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPremiumShop}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Premium Shop (tap X to close)"
              aria-label="Open Premium Shop"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowFAQ}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="FAQ"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowMiniGames}
              className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500 p-2 flex items-center justify-center"
              title="Mini Games"
            >
              <Coffee className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 text-sm items-center">
            <SoundControls className="mr-2" />

            <div className="bg-amber-800 rounded-lg px-3 py-1 flex items-center">
              <Star className="h-4 w-4 mr-2 text-amber-300" />
              <span>
                Level <span className="font-bold">{level}</span>
              </span>
            </div>
            <div className="bg-amber-800 rounded-lg px-3 py-1 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
              <span>
                $GRIND Beans <span className="font-bold">{angelInvestors}</span>
              </span>
            </div>
            <div className="bg-purple-800 rounded-lg px-3 py-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-300" />
              <span>
                Multiplier <span className="font-bold">{prestigeMultiplier.toFixed(2)}x</span>
              </span>
            </div>
            <div className="bg-amber-800 rounded-lg px-3 py-1 flex items-center">
              <Coins className="h-4 w-4 mr-2 text-amber-300" />
              <span className="font-bold">{formatCurrency(safeCoins)}</span>
            </div>
            <div className="bg-amber-800 rounded-lg px-3 py-1 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
              <span className="text-green-400 font-bold">{formatPassiveIncome(passiveIncome)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
