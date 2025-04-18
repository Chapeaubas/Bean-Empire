"use client"

import type React from "react"
import { useState } from "react"
import BusinessCard from "@/components/business-card"
import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { safeNumber } from "@/lib/error-utils"

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
}: BusinessGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState<"all" | "owned" | "ready">("all")

  const filteredBusinesses = businesses.filter((business) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">Your Coffee Empire</div>

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
