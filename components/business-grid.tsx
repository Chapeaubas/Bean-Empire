"use client"

import type React from "react"
import { useState, useMemo } from "react"
import BusinessCard from "@/components/business-card"
import { Button } from "@/components/ui/button"
import { Grid, List, Coffee, Globe } from "lucide-react"
import { safeNumber } from "@/lib/error-utils"
import { formatRegionName } from "@/lib/region-businesses"
import { getBusinessesForRegionMapping } from "@/lib/region-business-mappings"

interface BusinessGridProps {
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
  onBuy: (businessId: string) => void
  onBuy10: (businessId: string) => void
  onBuy100: (businessId: string) => void
  onBuyMax: (businessId: string) => void
  onCollect: (businessId: string, e: React.MouseEvent) => void
  onStart: (businessId: string) => void
  getTimeRemaining: (businessId: string) => string
  onClick?: () => void
  managerCollections?: {
    [key: string]: { amount: number; timestamp: number }
  }
  activeRegion: string // Add activeRegion prop
}

export default function BusinessGrid({
  businesses,
  businessStates,
  cash,
  onBuy,
  onBuy10,
  onBuy100,
  onBuyMax,
  onCollect,
  onStart,
  getTimeRemaining,
  onClick,
  managerCollections = {},
  activeRegion = "north_america", // Default to North America
}: BusinessGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<"all" | "owned" | "ready">("all")

  // Get region-specific businesses
  const regionBusinesses = useMemo(() => {
    return getBusinessesForRegionMapping(activeRegion)
  }, [activeRegion])

  // Map the original business IDs to the region-specific businesses
  const mappedBusinesses = useMemo(() => {
    return businesses.map((business, index) => {
      // If we have a region-specific business for this index, use it
      if (index < regionBusinesses.length) {
        return {
          ...business,
          name: regionBusinesses[index].name,
          icon: regionBusinesses[index].icon,
          // Keep the original ID for state tracking
        }
      }
      return business
    })
  }, [businesses, regionBusinesses])

  const filteredBusinesses = mappedBusinesses.filter((business) => {
    const state = businessStates[business.id]

    if (!state) return filter === "all"

    if (filter === "owned") {
      return safeNumber(state.owned, 0) > 0
    }

    if (filter === "ready") {
      return safeNumber(state.owned, 0) > 0 && safeNumber(state.progress, 0) >= 100
    }

    return true
  })

  // Format the region name for display
  const regionTitle =
    activeRegion === "north_america" ? "Your Coffee Empire" : `${formatRegionName(activeRegion)} Empire`

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold flex items-center">
          {activeRegion === "north_america" ? (
            <Coffee className="h-5 w-5 mr-2 text-amber-700" />
          ) : (
            <Globe className="h-5 w-5 mr-2 text-amber-700" />
          )}
          {regionTitle}
        </div>

        <div className="flex space-x-2">
          <div className="bg-amber-800 rounded-lg p-1 flex">
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === "grid" ? "bg-amber-700" : ""} text-amber-200`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === "list" ? "bg-amber-700" : ""} text-amber-200`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-amber-800 rounded-lg p-1 flex">
            <Button
              variant="ghost"
              size="sm"
              className={`${filter === "all" ? "bg-amber-700" : ""} text-amber-200`}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${filter === "owned" ? "bg-amber-700" : ""} text-amber-200`}
              onClick={() => setFilter("owned")}
            >
              Owned
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${filter === "ready" ? "bg-amber-700" : ""} text-amber-200`}
              onClick={() => setFilter("ready")}
            >
              Ready
            </Button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4" : "space-y-4"
        }
      >
        {filteredBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            businessState={businessStates[business.id]}
            cash={cash}
            onBuy={() => onBuy(business.id)}
            onBuy10={() => onBuy10(business.id)}
            onBuy100={() => onBuy100(business.id)}
            onBuyMax={() => onBuyMax(business.id)}
            onCollect={(e) => onCollect(business.id, e)}
            onStart={() => onStart(business.id)}
            timeRemaining={getTimeRemaining(business.id)}
            onClick={onClick}
            managerCollection={managerCollections?.[business.id]}
          />
        ))}
      </div>
    </div>
  )
}
