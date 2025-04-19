"use client"

import { useState } from "react"
import { Settings, Coffee, TrendingUp, Award, Clock, DollarSign, Zap, Star } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/utils"
import BaseModal from "@/components/base-modal"
import { safeNumber, formatNumberSafe } from "@/lib/error-utils"

interface StatsModalProps {
  show: boolean
  onClose: () => void
  stats: {
    totalEarnings: number
    totalClicks: number
    totalCustomersServed: number
    maxBusinessOwned: number
    prestigeLevel: number
    beanSortingHighScore: number
  }
  businesses: Array<{
    id: string
    name: string
    icon: string
    baseCost: number
    baseRevenue: number
    baseTime: number
    costMultiplier: number
    revenueMultiplier: number
  }>
  businessStates: { [key: string]: any }
  cash: number
  lifetimeEarnings: number
  prestigeLevel: number
  angelInvestors: number
}

export default function StatsModal({
  show,
  onClose,
  stats,
  businesses,
  businessStates,
  cash,
  lifetimeEarnings,
  prestigeLevel,
  angelInvestors,
}: StatsModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "businesses" | "achievements" | "milestones">("general")

  // Add these safety checks at the beginning of the component function
  // Ensure businessStates is always an object
  const safeBusinessStates = businessStates || {}

  // Ensure we have safe values for calculations
  const safeCash = safeNumber(cash, 0)
  const safeLifetimeEarnings = safeNumber(lifetimeEarnings, 0)
  const safePrestigeLevel = safeNumber(prestigeLevel, 1)
  const safeAngelInvestors = safeNumber(angelInvestors, 0)

  // Calculate total businesses owned - use safeBusinessStates
  const totalBusinessesOwned = Object.values(safeBusinessStates).reduce(
    (total, state) => total + safeNumber(state?.owned, 0),
    0,
  )

  // Calculate passive income - use safeBusinessStates
  const passiveIncome = businesses.reduce((total, business) => {
    const state = safeBusinessStates[business.id]
    if (!state || !state.hasManager || state.owned <= 0) return total

    const baseRevenue = safeNumber(business.baseRevenue, 0)
    const ownedCount = safeNumber(state.owned, 0)
    const profitMultiplier = safeNumber(state.profitMultiplier, 1)
    const speedMultiplier = safeNumber(state.speedMultiplier, 1)
    const angelBonus = 1 + safeNumber(safeAngelInvestors, 0) * 0.02 // 2% per angel
    const prestigeBonus = safeNumber(safePrestigeLevel, 1)

    const cycleTime = safeNumber(business.baseTime, 1) / speedMultiplier
    const revenuePerSecond = (baseRevenue * ownedCount * profitMultiplier * angelBonus * prestigeBonus) / cycleTime

    return total + revenuePerSecond
  }, 0)

  // Calculate time to next milestone
  const calculateTimeToNextMilestone = () => {
    const nextMilestone = 1000000 // Example: 1 million
    if (safeCash >= nextMilestone) return "Reached!"

    const cashNeeded = nextMilestone - safeCash
    if (passiveIncome <= 0) return "∞"

    const seconds = cashNeeded / passiveIncome
    if (isNaN(seconds)) return "∞"

    if (seconds < 60) return `${Math.ceil(seconds)}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`
  }

  // Calculate angel investors
  const calculateAngels = () => {
    const result = Math.floor(Math.sqrt(safeLifetimeEarnings / 1e12))
    return isNaN(result) ? 0 : result
  }

  // Calculate prestige multiplier
  const calculatePrestigeMultiplier = () => {
    const angelEffectiveness = 0.02 // 2% per angel
    const result = (1 + safeAngelInvestors * angelEffectiveness).toFixed(2)
    return isNaN(Number.parseFloat(result)) ? "1.00" : result
  }

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="Statistics"
      icon={<Settings className="h-5 w-5 mr-2 text-amber-300" />}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-amber-900/50 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium ${
              activeTab === "general" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium ${
              activeTab === "businesses" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("businesses")}
          >
            Businesses
          </button>
          <button
            className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium ${
              activeTab === "achievements" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </button>
          <button
            className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium ${
              activeTab === "milestones" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("milestones")}
          >
            Milestones
          </button>
        </div>

        {/* General Stats */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-800/50 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-amber-300" />
                  Economy
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-amber-300">Current Cash:</span>
                    <span className="font-bold">{formatCurrency(safeNumber(safeCash, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Lifetime Earnings:</span>
                    <span className="font-bold">{formatCurrency(safeNumber(safeLifetimeEarnings, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Passive Income:</span>
                    <span className="font-bold">{formatCurrency(safeNumber(passiveIncome, 0))}/sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Angel Investors:</span>
                    <span className="font-bold">{formatNumber(safeNumber(safeAngelInvestors, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Prestige Multiplier:</span>
                    <span className="font-bold">{calculatePrestigeMultiplier()}x</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-800/50 rounded-lg p-4">
                <h3 className="font-bold mb-3 flex items-center">
                  <Coffee className="h-4 w-4 mr-1 text-amber-300" />
                  Business Empire
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-amber-300">Total Businesses:</span>
                    <span className="font-bold">{formatNumber(safeNumber(totalBusinessesOwned, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Largest Business:</span>
                    <span className="font-bold">{formatNumber(safeNumber(stats.maxBusinessOwned, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Customers Served:</span>
                    <span className="font-bold">{formatNumber(safeNumber(stats.totalCustomersServed, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Total Clicks:</span>
                    <span className="font-bold">{formatNumber(safeNumber(stats.totalClicks, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Prestige Level:</span>
                    <span className="font-bold">{formatNumber(safeNumber(stats.prestigeLevel, 1))}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-amber-300" />
                Projections
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-300">Time to $1M:</span>
                  <span className="font-bold">{calculateTimeToNextMilestone()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Next Angel Investor:</span>
                  <span className="font-bold">
                    {calculateAngels() > safeAngelInvestors
                      ? "Available now!"
                      : `${formatCurrency(1e12 * Math.pow(safeAngelInvestors + 1, 2))} lifetime earnings`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Award className="h-4 w-4 mr-1 text-amber-300" />
                Achievements
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-300">Bean Sorting High Score:</span>
                  <span className="font-bold">{safeNumber(stats.beanSortingHighScore, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Businesses Stats */}
        {activeTab === "businesses" && (
          <div className="space-y-4">
            {businesses.map((business) => {
              const state = safeBusinessStates[business.id]
              if (!state || safeNumber(state.owned, 0) <= 0) return null

              const baseRevenue = safeNumber(business.baseRevenue, 0)
              const ownedCount = safeNumber(state.owned, 0)
              const profitMultiplier = safeNumber(state.profitMultiplier, 1)
              const speedMultiplier = safeNumber(state.speedMultiplier, 1)
              const angelBonus = 1 + safeNumber(safeAngelInvestors, 0) * 0.02
              const prestigeBonus = safeNumber(safePrestigeLevel, 1)

              const cycleTime = safeNumber(business.baseTime, 1) / speedMultiplier
              const revenuePerCycle = baseRevenue * ownedCount * profitMultiplier * angelBonus * prestigeBonus
              const revenuePerSecond = revenuePerCycle / cycleTime

              // Check for NaN values
              const safeCycleTime = isNaN(cycleTime) ? 1 : cycleTime
              const safeRevenuePerCycle = isNaN(revenuePerCycle) ? 0 : revenuePerCycle
              const safeRevenuePerSecond = isNaN(revenuePerSecond) ? 0 : revenuePerSecond

              return (
                <div key={business.id} className="bg-amber-800/50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-full mr-3 text-xl">
                      {business.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{business.name}</h3>
                      <div className="text-sm text-amber-300">
                        Owned: <span className="font-bold">{formatNumber(ownedCount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Revenue per Cycle</div>
                      <div className="font-bold">{formatCurrency(safeRevenuePerCycle)}</div>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Revenue per Second</div>
                      <div className="font-bold">{formatCurrency(safeRevenuePerSecond)}</div>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Cycle Time</div>
                      <div className="font-bold">{formatNumberSafe(safeCycleTime, 1)}s</div>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Manager</div>
                      <div className="font-bold">{state.hasManager ? "Yes" : "No"}</div>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Profit Multiplier</div>
                      <div className="font-bold">{formatNumberSafe(profitMultiplier, 2)}x</div>
                    </div>
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <div className="text-xs text-amber-300 mb-1">Speed Multiplier</div>
                      <div className="font-bold">{formatNumberSafe(speedMultiplier, 2)}x</div>
                    </div>
                  </div>
                </div>
              )
            })}

            {Object.values(safeBusinessStates).every((state) => !state || state.owned <= 0) && (
              <div className="text-center py-8 bg-amber-800/30 rounded-lg">
                <p className="text-amber-300">You don't own any businesses yet.</p>
                <p className="text-sm text-amber-200 mt-2">Purchase your first business to see stats here!</p>
              </div>
            )}
          </div>
        )}

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div className="space-y-4">
            <div className="bg-amber-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Award className="h-4 w-4 mr-1 text-amber-300" />
                Achievements
              </h3>
              <p className="text-amber-300 mb-4">Track your progress and earn rewards for reaching milestones!</p>

              <div className="space-y-3">
                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-amber-300" />
                      First Million
                    </h4>
                    <div className="text-xs bg-amber-900 px-2 py-0.5 rounded-full">
                      {stats.totalEarnings >= 1000000 ? "Completed" : "In Progress"}
                    </div>
                  </div>
                  <p className="text-sm text-amber-300 mb-2">Earn your first million dollars</p>
                  <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.min(100, (safeNumber(stats.totalEarnings, 0) / 1000000) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Progress</span>
                    <span>
                      {formatCurrency(safeNumber(stats.totalEarnings, 0))} / {formatCurrency(1000000)}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold flex items-center">
                      <Coffee className="h-4 w-4 mr-1 text-amber-300" />
                      Coffee Empire
                    </h4>
                    <div className="text-xs bg-amber-900 px-2 py-0.5 rounded-full">
                      {stats.maxBusinessOwned >= 100 ? "Completed" : "In Progress"}
                    </div>
                  </div>
                  <p className="text-sm text-amber-300 mb-2">Own at least 100 of any business</p>
                  <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.min(100, (safeNumber(stats.maxBusinessOwned, 0) / 100) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Progress</span>
                    <span>{formatNumber(safeNumber(stats.maxBusinessOwned, 0))} / 100</span>
                  </div>
                </div>

                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-amber-300" />
                      Customer Service Expert
                    </h4>
                    <div className="text-xs bg-amber-900 px-2 py-0.5 rounded-full">
                      {stats.totalCustomersServed >= 1000 ? "Completed" : "In Progress"}
                    </div>
                  </div>
                  <p className="text-sm text-amber-300 mb-2">Serve 1,000 customers</p>
                  <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.min(100, (safeNumber(stats.totalCustomersServed, 0) / 1000) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Progress</span>
                    <span>{formatNumber(safeNumber(stats.totalCustomersServed, 0))} / 1,000</span>
                  </div>
                </div>

                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold flex items-center">
                      <Star className="h-4 w-4 mr-1 text-amber-300" />
                      Prestige Master
                    </h4>
                    <div className="text-xs bg-amber-900 px-2 py-0.5 rounded-full">
                      {stats.prestigeLevel >= 10 ? "Completed" : "In Progress"}
                    </div>
                  </div>
                  <p className="text-sm text-amber-300 mb-2">Reach prestige level 10</p>
                  <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${Math.min(100, (safeNumber(stats.prestigeLevel, 1) / 10) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Progress</span>
                    <span>{safeNumber(stats.prestigeLevel, 1)} / 10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {activeTab === "milestones" && (
          <div className="space-y-4">
            <div className="bg-amber-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-amber-300" />
                Upcoming Milestones
              </h3>
              <p className="text-amber-300 mb-4">Track your progress towards these important milestones!</p>

              <div className="space-y-3">
                {[
                  { name: "$1 Million", value: 1000000, current: safeCash },
                  { name: "$1 Billion", value: 1000000000, current: safeCash },
                  { name: "$1 Trillion", value: 1000000000000, current: safeCash },
                  { name: "100 Businesses", value: 100, current: totalBusinessesOwned },
                  { name: "1,000 Businesses", value: 1000, current: totalBusinessesOwned },
                  { name: "10,000 Businesses", value: 10000, current: totalBusinessesOwned },
                ].map((milestone, index) => (
                  <div key={index} className="bg-amber-700/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold">{milestone.name}</h4>
                      <div className="text-xs bg-amber-900 px-2 py-0.5 rounded-full">
                        {milestone.current >= milestone.value ? "Completed" : "In Progress"}
                      </div>
                    </div>
                    <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full"
                        style={{
                          width: `${Math.min(100, (safeNumber(milestone.current, 0) / milestone.value) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>Progress</span>
                      <span>
                        {index < 3
                          ? `${formatCurrency(safeNumber(milestone.current, 0))} / ${formatCurrency(milestone.value)}`
                          : `${formatNumber(safeNumber(milestone.current, 0))} / ${formatNumber(milestone.value)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
