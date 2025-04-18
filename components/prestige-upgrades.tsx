"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Coffee, TrendingUp, Clock, Zap, Lock } from "lucide-react"

interface PrestigeUpgradesProps {
  prestigePoints: number
  ownedUpgrades: string[]
  onPurchase: (upgradeId: string, cost: number) => void
}

type PrestigeUpgrade = {
  id: string
  name: string
  description: string
  cost: number
  effect: {
    type: string
    value: number
    target?: string
  }
  icon: React.ReactNode
  requiredPrestigeLevel?: number
}

export default function PrestigeUpgrades({ prestigePoints, ownedUpgrades, onPurchase }: PrestigeUpgradesProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "production" | "income" | "special">("all")

  // Define prestige upgrades
  const prestigeUpgrades: PrestigeUpgrade[] = [
    {
      id: "faster_production",
      name: "Faster Production",
      description: "All businesses produce 25% faster permanently",
      cost: 1,
      effect: {
        type: "speed",
        value: 1.25,
        target: "all",
      },
      icon: <Clock className="h-5 w-5 text-amber-300" />,
    },
    {
      id: "increased_profits",
      name: "Increased Profits",
      description: "All businesses earn 50% more permanently",
      cost: 2,
      effect: {
        type: "profit",
        value: 1.5,
        target: "all",
      },
      icon: <TrendingUp className="h-5 w-5 text-amber-300" />,
    },
    {
      id: "starting_cash",
      name: "Starting Cash",
      description: "Start with $1,000 after prestige instead of $4",
      cost: 1,
      effect: {
        type: "cash",
        value: 1000,
      },
      icon: <Coffee className="h-5 w-5 text-amber-300" />,
    },
    {
      id: "auto_managers",
      name: "Auto Managers",
      description: "Start with managers for the first 2 businesses",
      cost: 3,
      effect: {
        type: "managers",
        value: 2,
      },
      icon: <Zap className="h-5 w-5 text-amber-300" />,
      requiredPrestigeLevel: 2,
    },
    {
      id: "double_offline",
      name: "Double Offline Earnings",
      description: "Earn twice as much while offline",
      cost: 2,
      effect: {
        type: "offline",
        value: 2,
      },
      icon: <Clock className="h-5 w-5 text-amber-300" />,
    },
    {
      id: "customer_loyalty",
      name: "Customer Loyalty",
      description: "Customers leave 75% bigger tips",
      cost: 2,
      effect: {
        type: "tips",
        value: 1.75,
      },
      icon: <Coffee className="h-5 w-5 text-amber-300" />,
    },
    {
      id: "master_barista",
      name: "Master Barista",
      description: "Earn 3x more from mini-games",
      cost: 3,
      effect: {
        type: "minigames",
        value: 3,
      },
      icon: <Sparkles className="h-5 w-5 text-amber-300" />,
      requiredPrestigeLevel: 3,
    },
  ]

  // Filter upgrades based on active category
  const filteredUpgrades = prestigeUpgrades.filter((upgrade) => {
    if (activeCategory === "all") return true
    if (activeCategory === "production" && upgrade.effect.type === "speed") return true
    if (activeCategory === "income" && (upgrade.effect.type === "profit" || upgrade.effect.type === "tips")) return true
    if (activeCategory === "special" && !["speed", "profit", "tips"].includes(upgrade.effect.type)) return true
    return false
  })

  // Check if upgrade is available (has required prestige level)
  const isUpgradeAvailable = (upgrade: PrestigeUpgrade) => {
    return !upgrade.requiredPrestigeLevel || upgrade.requiredPrestigeLevel <= prestigePoints
  }

  return (
    <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
        $GRIND Beans Upgrades
      </h2>
      <p className="mb-4">Spend your $GRIND Beans on powerful upgrades that will boost your coffee empire!</p>

      <div className="flex justify-between items-center mb-4">
        <div className="bg-amber-700 px-3 py-1 rounded-lg flex items-center">
          <Sparkles className="h-4 w-4 mr-1 text-amber-300" />
          <span className="font-bold">{prestigePoints} $GRIND</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          className={
            activeCategory === "all"
              ? "bg-amber-600 hover:bg-amber-700"
              : "border-amber-600 text-amber-300 hover:bg-amber-800"
          }
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        <Button
          variant={activeCategory === "production" ? "default" : "outline"}
          size="sm"
          className={
            activeCategory === "production"
              ? "bg-amber-600 hover:bg-amber-700"
              : "border-amber-600 text-amber-300 hover:bg-amber-800"
          }
          onClick={() => setActiveCategory("production")}
        >
          Production
        </Button>
        <Button
          variant={activeCategory === "income" ? "default" : "outline"}
          size="sm"
          className={
            activeCategory === "income"
              ? "bg-amber-600 hover:bg-amber-700"
              : "border-amber-600 text-amber-300 hover:bg-amber-800"
          }
          onClick={() => setActiveCategory("income")}
        >
          Income
        </Button>
        <Button
          variant={activeCategory === "special" ? "default" : "outline"}
          size="sm"
          className={
            activeCategory === "special"
              ? "bg-amber-600 hover:bg-amber-700"
              : "border-amber-600 text-amber-300 hover:bg-amber-800"
          }
          onClick={() => setActiveCategory("special")}
        >
          Special
        </Button>
      </div>

      <div className="space-y-3">
        {filteredUpgrades.map((upgrade) => {
          const isOwned = ownedUpgrades.includes(upgrade.id)
          const isAvailable = isUpgradeAvailable(upgrade)
          const canAfford = prestigePoints >= upgrade.cost

          return (
            <div
              key={upgrade.id}
              className={`rounded-lg p-3 border ${
                isOwned
                  ? "bg-amber-700 border-green-500"
                  : !isAvailable
                    ? "bg-amber-700/30 border-amber-700/50 opacity-70"
                    : "bg-amber-700/50 border-amber-600"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 p-2 rounded-full ${
                    isOwned
                      ? "bg-green-800"
                      : !isAvailable
                        ? "bg-amber-900/50"
                        : canAfford
                          ? "bg-amber-600"
                          : "bg-amber-800"
                  }`}
                >
                  {isAvailable ? upgrade.icon : <Lock className="h-5 w-5 text-amber-400" />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{upgrade.name}</h3>
                    {isOwned ? (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Owned</span>
                    ) : !isAvailable ? (
                      <span className="bg-amber-900 text-amber-300 text-xs px-2 py-0.5 rounded-full">
                        Requires Level {upgrade.requiredPrestigeLevel}
                      </span>
                    ) : (
                      <span
                        className={`${
                          canAfford ? "bg-amber-600" : "bg-amber-900"
                        } text-white text-xs px-2 py-0.5 rounded-full`}
                      >
                        {upgrade.cost} {upgrade.cost === 1 ? "$GRIND" : "$GRIND"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-amber-300 mb-2">{upgrade.description}</p>

                  {!isOwned && (
                    <Button
                      variant="default"
                      size="sm"
                      className={
                        canAfford && isAvailable
                          ? "bg-amber-500 hover:bg-amber-600 w-full transition-all duration-200 transform hover:scale-105"
                          : "bg-amber-900 text-amber-300 cursor-not-allowed w-full"
                      }
                      disabled={!canAfford || !isAvailable}
                      onClick={() => {
                        console.log(`Attempting to purchase upgrade: ${upgrade.id}, cost: ${upgrade.cost}`)
                        if (canAfford && isAvailable) {
                          // Call onPurchase directly without any conditions
                          onPurchase(upgrade.id, upgrade.cost)
                          console.log(`Purchase function called for: ${upgrade.id}`)
                        }
                      }}
                    >
                      {isAvailable
                        ? canAfford
                          ? "Purchase Upgrade"
                          : "Not Enough $GRIND"
                        : `Unlocks at Level ${upgrade.requiredPrestigeLevel}`}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
