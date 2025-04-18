"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, Award, AlertTriangle, Info, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatNumber } from "@/lib/utils"
import BaseModal from "@/components/base-modal"
import { safeNumber } from "@/lib/error-utils"

interface PrestigeModalProps {
  show: boolean
  onClose: () => void
  onPrestige: () => void
  lifetimeEarnings: number
  prestigeLevel: number
  angelInvestors: number
  newAngels: number
  angelEffectiveness: number
  prestigeUpgrades: Array<{
    id: string
    name: string
    description: string
    baseCost: number
    costMultiplier: number
    effect: {
      type: string
      value: number
    }
  }>
  prestigeUpgradeStates: { [key: string]: number }
  onBuyPrestigeUpgrade: (upgradeId: string) => void
}

export default function PrestigeModal({
  show,
  onClose,
  onPrestige,
  lifetimeEarnings,
  prestigeLevel,
  angelInvestors,
  newAngels,
  angelEffectiveness,
  prestigeUpgrades,
  prestigeUpgradeStates,
  onBuyPrestigeUpgrade,
}: PrestigeModalProps) {
  const [activeTab, setActiveTab] = useState<"prestige" | "upgrades">("prestige")
  const [showConfirm, setShowConfirm] = useState(false)

  // Ensure values are safe
  const safeLifetimeEarnings = safeNumber(lifetimeEarnings, 0)
  const safePrestigeLevel = safeNumber(prestigeLevel, 1)
  const safeAngelInvestors = safeNumber(angelInvestors, 0)
  const safeNewAngels = safeNumber(newAngels, 0)
  const safeAngelEffectiveness = safeNumber(angelEffectiveness, 0.02)

  // Calculate prestige multiplier
  const calculatePrestigeMultiplier = () => {
    return (1 + (safeAngelInvestors + safeNewAngels) * safeAngelEffectiveness).toFixed(2)
  }

  // Calculate current multiplier
  const calculateCurrentMultiplier = () => {
    return (1 + safeAngelInvestors * safeAngelEffectiveness).toFixed(2)
  }

  // Calculate next prestige level requirement
  const calculateNextPrestigeRequirement = () => {
    const nextLevel = safePrestigeLevel + 1
    const baseRequirement = 1e12 // 1 trillion
    return baseRequirement * Math.pow(nextLevel, 2)
  }

  return (
    <BaseModal
      show={show}
      onClose={() => {
        setShowConfirm(false)
        onClose()
      }}
      title="Prestige"
      icon={<Sparkles className="h-5 w-5 mr-2 text-amber-300" />}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-amber-900/50 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              activeTab === "prestige" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("prestige")}
          >
            Prestige
          </button>
          <button
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              activeTab === "upgrades" ? "bg-amber-700 text-white" : "text-amber-300 hover:bg-amber-800/50"
            }`}
            onClick={() => setActiveTab("upgrades")}
          >
            $GRIND Upgrades
          </button>
        </div>

        {/* Prestige Tab */}
        {activeTab === "prestige" && (
          <div className="space-y-4">
            <div className="bg-amber-800/50 rounded-lg p-4">
              <h3 className="font-bold mb-3 flex items-center">
                <Star className="h-4 w-4 mr-1 text-amber-300" />
                Prestige Information
              </h3>
              <p className="text-amber-300 mb-4">
                Prestige resets your progress but grants $GRIND Beans that boost your future earnings!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="text-sm text-amber-300 mb-1">Current Prestige Level</div>
                  <div className="font-bold text-lg">{safePrestigeLevel}</div>
                </div>
                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="text-sm text-amber-300 mb-1">Current $GRIND Beans</div>
                  <div className="font-bold text-lg">{formatNumber(safeAngelInvestors)}</div>
                </div>
                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="text-sm text-amber-300 mb-1">Current Multiplier</div>
                  <div className="font-bold text-lg">{calculateCurrentMultiplier()}x</div>
                </div>
                <div className="bg-amber-700/50 p-3 rounded-lg">
                  <div className="text-sm text-amber-300 mb-1">Lifetime Earnings</div>
                  <div className="font-bold text-lg">{formatCurrency(safeLifetimeEarnings)}</div>
                </div>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-purple-300" />
                  New $GRIND Beans Available
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-purple-300 mb-1">New $GRIND Beans</div>
                    <div className="font-bold text-lg">{formatNumber(safeNewAngels)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1">New Total Multiplier</div>
                    <div className="font-bold text-lg">{calculatePrestigeMultiplier()}x</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1">$GRIND Beans</div>
                    <div className="font-bold text-lg">{formatNumber(safeNewAngels)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 mr-2 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">What happens when you prestige?</h4>
                    <ul className="text-sm space-y-1 list-disc list-inside text-amber-200">
                      <li>Your businesses, cash, and upgrades will be reset</li>
                      <li>You'll gain {formatNumber(safeNewAngels)} new $GRIND Beans</li>
                      <li>Each $GRIND Bean gives you a {(safeAngelEffectiveness * 100).toFixed(0)}% profit boost</li>
                      <li>Your Prestige Level will increase to {safePrestigeLevel + 1}</li>
                      <li>You'll keep your $GRIND Upgrades and Achievements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {showConfirm ? (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                <div className="flex items-start mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Are you sure you want to prestige?</h4>
                    <p className="text-sm text-red-300">
                      This will reset your progress but grant you {formatNumber(safeNewAngels)} $GRIND Beans.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-600 text-red-300 hover:bg-red-900/30"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      onPrestige()
                      setShowConfirm(false)
                    }}
                  >
                    Confirm Prestige
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="default"
                className={`w-full ${
                  safeNewAngels > 0
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    : "bg-gray-600"
                }`}
                disabled={safeNewAngels <= 0}
                onClick={() => setShowConfirm(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Prestige Now
              </Button>
            )}

            {safeNewAngels <= 0 && (
              <div className="text-center text-amber-300 text-sm">
                You need at least {formatCurrency(calculateNextPrestigeRequirement())} lifetime earnings to gain $GRIND
                Beans.
              </div>
            )}
          </div>
        )}

        {/* Upgrades Tab */}
        {activeTab === "upgrades" && (
          <div className="space-y-4">
            <div className="bg-amber-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold flex items-center">
                  <Award className="h-4 w-4 mr-1 text-amber-300" />
                  $GRIND Upgrades
                </h3>
                <div className="bg-purple-800 px-3 py-1 rounded-lg flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-purple-300" />
                  <span className="font-bold">{formatNumber(safeAngelInvestors)} $GRIND Beans</span>
                </div>
              </div>
              <p className="text-amber-300 mb-4">
                Spend your $GRIND Beans on powerful upgrades that persist through prestiges!
              </p>

              <div className="space-y-3">
                {prestigeUpgrades.map((upgrade) => {
                  const currentLevel = prestigeUpgradeStates[upgrade.id] || 0
                  const cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel)
                  const canAfford = safeAngelInvestors >= cost

                  return (
                    <div
                      key={upgrade.id}
                      className={`rounded-lg p-3 border ${
                        canAfford ? "bg-amber-700/50 border-amber-600" : "bg-amber-800/30 border-amber-700"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold flex items-center">
                          {upgrade.effect.type === "profit" ? (
                            <TrendingUp className="h-4 w-4 mr-1 text-amber-300" />
                          ) : upgrade.effect.type === "speed" ? (
                            <Star className="h-4 w-4 mr-1 text-amber-300" />
                          ) : (
                            <Award className="h-4 w-4 mr-1 text-amber-300" />
                          )}
                          {upgrade.name}
                        </h4>
                        <div className="text-sm">
                          <span
                            className={`${
                              canAfford ? "bg-amber-600" : "bg-amber-900"
                            } text-white px-2 py-0.5 rounded-full text-xs`}
                          >
                            {formatNumber(cost)} $GRIND Beans
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-amber-300 mb-2">{upgrade.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-amber-200">
                          Current Level: <span className="font-bold">{currentLevel}</span>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          className={`${
                            canAfford
                              ? "bg-amber-500 hover:bg-amber-600"
                              : "bg-amber-900 text-amber-300 cursor-not-allowed"
                          }`}
                          disabled={!canAfford}
                          onClick={() => onBuyPrestigeUpgrade(upgrade.id)}
                        >
                          {canAfford ? "Purchase Upgrade" : "Not Enough $GRIND Beans"}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
