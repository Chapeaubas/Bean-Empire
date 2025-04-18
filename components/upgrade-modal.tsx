"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, Zap, DollarSign, X, Filter } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import BaseModal from "@/components/base-modal"
import { safeNumber } from "@/lib/error-utils"

interface UpgradeModalProps {
  show: boolean
  onClose: () => void
  upgrades: Array<{
    id: string
    name: string
    businessId: string
    cost: number
    multiplier: number
    type: "profit" | "speed"
    description: string
    requiredLevel?: number
    requires?: string[]
  }>
  purchasedUpgrades: { [key: string]: boolean }
  cash: number
  onBuyUpgrade: (upgradeId: string) => void
  businessStates: { [key: string]: any }
}

export default function UpgradeModal(props: UpgradeModalProps) {
  const { show, onClose, upgrades, purchasedUpgrades, cash, onBuyUpgrade } = props
  // Ensure businessStates is always an object
  const businessStates = props.businessStates || {}
  const [filter, setFilter] = useState<"all" | "available" | "profit" | "speed">("all")
  const [searchTerm, setSearchTerm] = useState("")

  // In the getItemStatus function, add null checks and default values
  const getItemStatus = (item: any) => {
    // Ensure businessStates and the specific business exist before accessing properties
    const businessState = businessStates[item.businessId] || {}
    const businessLevel = safeNumber(businessState?.owned, 0)
    const requiredLevel = safeNumber(item.requiredLevel, 0)

    if (purchasedUpgrades[item.id]) {
      return { status: "owned", message: "Owned" }
    }

    if (businessLevel < requiredLevel) {
      return { status: "locked", message: `Requires Level ${requiredLevel}` }
    }

    if (cash < item.cost) {
      return { status: "expensive", message: `Need ${item.cost - cash} more $GRIND` }
    }

    return { status: "available", message: `${item.cost} $GRIND` }
  }

  // Add a safety check when accessing business state in the canPurchase function
  const canPurchase = (item: any) => {
    if (purchasedUpgrades[item.id]) return false
    if (cash < item.cost) return false

    // Check if required items are owned
    if (item.requires && item.requires.length > 0) {
      return item.requires.every((reqId: string) => purchasedUpgrades[reqId])
    }

    // Check business level requirement
    const businessState = businessStates[item.businessId] || {}
    const businessLevel = safeNumber(businessState?.owned, 0)
    const requiredLevel = safeNumber(item.requiredLevel, 0)

    return businessLevel >= requiredLevel
  }

  // Filter upgrades based on the selected filter and search term
  const filteredUpgrades = upgrades.filter((upgrade) => {
    // Filter by type
    if (filter === "profit" && upgrade.type !== "profit") return false
    if (filter === "speed" && upgrade.type !== "speed") return false

    // Filter by availability
    if (filter === "available") {
      const businessState = businessStates[upgrade.businessId] || {}
      const businessLevel = safeNumber(businessState?.owned, 0)
      const requiredLevel = safeNumber(upgrade.requiredLevel, 0)

      if (purchasedUpgrades[upgrade.id]) return false
      if (businessLevel < requiredLevel) return false
      if (cash < upgrade.cost) return false
    }

    // Filter by search term
    if (
      searchTerm &&
      !upgrade.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !upgrade.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  // Group upgrades by business
  const groupedUpgrades: { [businessId: string]: typeof upgrades } = {}
  filteredUpgrades.forEach((upgrade) => {
    if (!groupedUpgrades[upgrade.businessId]) {
      groupedUpgrades[upgrade.businessId] = []
    }
    groupedUpgrades[upgrade.businessId].push(upgrade)
  })

  // Get business name from ID
  const getBusinessName = (businessId: string) => {
    switch (businessId) {
      case "coffee_cart":
        return "Coffee Cart"
      case "coffee_shop":
        return "Coffee Shop"
      case "coffee_house":
        return "Coffee House"
      case "coffee_drive_thru":
        return "Drive-Thru Coffee"
      case "coffee_roastery":
        return "Coffee Roastery"
      case "coffee_plantation":
        return "Coffee Plantation"
      case "coffee_factory":
        return "Coffee Factory"
      case "coffee_empire":
        return "Coffee Empire"
      default:
        return businessId
    }
  }

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="Upgrades"
      icon={<TrendingUp className="h-5 w-5 mr-2 text-amber-300" />}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search upgrades..."
              className="w-full bg-amber-700/50 border border-amber-600 rounded-lg px-3 py-2 text-amber-100 placeholder-amber-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex">
            <Button
              variant="outline"
              size="sm"
              className={`${filter === "all" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}`}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${
                filter === "available" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"
              }`}
              onClick={() => setFilter("available")}
            >
              Available
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${filter === "profit" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}`}
              onClick={() => setFilter("profit")}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Profit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${filter === "speed" ? "bg-amber-700 border-amber-500" : "border-amber-600 text-amber-300"}`}
              onClick={() => setFilter("speed")}
            >
              <Zap className="h-4 w-4 mr-1" />
              Speed
            </Button>
          </div>
        </div>

        {/* Upgrades list */}
        {Object.keys(groupedUpgrades).length === 0 ? (
          <div className="text-center py-8 bg-amber-800/30 rounded-lg">
            <p className="text-amber-300">No upgrades match your filter.</p>
            <Button
              variant="outline"
              className="mt-4 border-amber-600 text-amber-300"
              onClick={() => {
                setFilter("all")
                setSearchTerm("")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedUpgrades).map(([businessId, businessUpgrades]) => (
              <div key={businessId} className="space-y-2">
                <h3 className="font-bold text-amber-300">{getBusinessName(businessId)}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {businessUpgrades.map((upgrade) => {
                    const businessState = businessStates[upgrade.businessId]
                    const businessLevel = safeNumber(businessState?.owned, 0)
                    const requiredLevel = safeNumber(upgrade.requiredLevel, 0)
                    const isPurchased = purchasedUpgrades[upgrade.id]
                    const canAfford = cash >= upgrade.cost
                    const meetsLevelRequirement = businessLevel >= requiredLevel
                    const itemStatus = getItemStatus(upgrade)

                    return (
                      <div
                        key={upgrade.id}
                        className={`rounded-lg p-3 border ${
                          isPurchased
                            ? "bg-green-800/30 border-green-700"
                            : !meetsLevelRequirement
                              ? "bg-amber-800/30 border-amber-700/50 opacity-70"
                              : !canAfford
                                ? "bg-amber-800/30 border-amber-700"
                                : "bg-amber-700/50 border-amber-600"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold flex items-center">
                            {upgrade.type === "profit" ? (
                              <DollarSign className="h-4 w-4 mr-1 text-amber-300" />
                            ) : (
                              <Zap className="h-4 w-4 mr-1 text-amber-300" />
                            )}
                            {upgrade.name}
                          </h4>
                          <div className="text-sm">
                            {isPurchased ? (
                              <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                                Purchased
                              </span>
                            ) : !meetsLevelRequirement ? (
                              <span className="bg-amber-900 text-amber-300 px-2 py-0.5 rounded-full text-xs">
                                Requires Level {requiredLevel}
                              </span>
                            ) : (
                              <span
                                className={`${
                                  canAfford ? "bg-amber-600" : "bg-amber-900"
                                } text-white px-2 py-0.5 rounded-full text-xs`}
                              >
                                {formatCurrency(upgrade.cost)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-amber-300 mb-2">{upgrade.description}</p>

                        <div className="text-xs text-amber-200 mb-2">
                          {upgrade.type === "profit" ? "Profit Multiplier" : "Speed Multiplier"}: {upgrade.multiplier}x
                        </div>

                        {!isPurchased && (
                          <Button
                            variant="default"
                            size="sm"
                            className={`w-full ${
                              canAfford && meetsLevelRequirement
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "bg-amber-900 text-amber-300 cursor-not-allowed"
                            }`}
                            disabled={!canPurchase(upgrade)}
                            onClick={() => onBuyUpgrade(upgrade.id)}
                          >
                            {!meetsLevelRequirement
                              ? `Requires Level ${requiredLevel}`
                              : !canAfford
                                ? "Not Enough Cash"
                                : "Purchase Upgrade"}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  )
}
