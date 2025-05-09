"use client"

import type React from "react"

import { useState } from "react"
import { X, Award, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import ManagerStatsCard from "@/components/manager-stats-card"
import { formatNumber } from "@/lib/utils"

interface ManagerModalProps {
  show?: boolean
  managers?: {
    id: string
    businessId: string
    name: string
    cost: number
    description: string
  }[]
  cash?: number
  onBuy?: (managerId: string) => void
  onClose: () => void
  businesses?: any
  onBuyManager?: (managerId: string) => void
  managerStats?: {
    [key: string]: {
      totalEarnings: number
      collections: number
      lastCollection: number
      businessName: string
      managerName: string
    }
  }
}

export default function ManagerModal({
  show = false,
  managers = [],
  cash = 0,
  onBuy,
  onClose,
  businesses = {},
  onBuyManager,
  managerStats = {},
}: ManagerModalProps) {
  const [activeTab, setActiveTab] = useState<"hire" | "stats">("hire")

  // If the component is not shown, don't render anything
  if (!show) return null

  // Use the correct callback function
  const handleBuyManager = onBuy || onBuyManager || (() => {})

  // Get the list of hired managers
  const hiredManagers = managers.filter((manager) => {
    return businesses[manager.businessId]?.hasManager === true
  })

  // Get the list of available managers
  const availableManagers = managers.filter((manager) => {
    return !businesses[manager.businessId]?.hasManager
  })

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4" onClick={onClose}>
      <div
        className="bg-amber-800 rounded-lg max-w-2xl w-full h-[90vh] sm:h-auto sm:max-h-[80vh] flex flex-col"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold">Managers</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Replace the Tabs component and everything inside it with this custom implementation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Custom tab buttons */}
          <div className="grid grid-cols-2 mx-2 sm:mx-4 mt-2 bg-amber-900/50 p-1 rounded-md">
            <button
              className={`flex items-center justify-center text-xs sm:text-sm py-2 px-3 rounded-sm transition-colors ${
                activeTab === "hire" ? "bg-amber-700 text-white shadow-sm" : "text-amber-300 hover:bg-amber-800/50"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setActiveTab("hire")
              }}
            >
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Hire Managers
            </button>
            <button
              className={`flex items-center justify-center text-xs sm:text-sm py-2 px-3 rounded-sm transition-colors ${
                activeTab === "stats" ? "bg-amber-700 text-white shadow-sm" : "text-amber-300 hover:bg-amber-800/50"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setActiveTab("stats")
              }}
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Performance
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 mt-0">
            {activeTab === "hire" && (
              <>
                {/* Available managers */}
                {availableManagers.length === 0 ? (
                  <div className="text-center py-8 bg-amber-800/30 rounded-lg">
                    <p className="text-amber-300">No managers available right now.</p>
                    <p className="text-sm mt-2">Purchase more businesses to unlock managers.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {availableManagers.map((manager) => (
                      <div
                        key={manager.id}
                        className="bg-amber-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                      >
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">{manager.name}</h3>
                          <p className="text-xs sm:text-sm text-amber-200">{manager.description}</p>
                        </div>

                        <Button
                          variant="default"
                          size="sm"
                          className={`${cash >= manager.cost ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"} mt-1 sm:mt-0`}
                          disabled={cash < manager.cost}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleBuyManager(manager.id)
                          }}
                        >
                          Hire ({formatCurrency(manager.cost)})
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show hired managers */}
                <div className="mt-4 pt-4 border-t border-amber-600">
                  <h3 className="font-bold mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-1 text-green-400" />
                    Hired Managers ({hiredManagers.length})
                  </h3>

                  {hiredManagers.length > 0 ? (
                    <div className="space-y-2">
                      {hiredManagers.map((manager) => (
                        <div key={manager.id} className="bg-green-800/30 border border-green-700/50 rounded-lg p-3">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2 text-green-400" />
                            <div>
                              <h4 className="font-bold">{manager.name}</h4>
                              <p className="text-sm text-green-300">{manager.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-amber-300 text-sm">No managers hired yet.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === "stats" && (
              <div className="bg-amber-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold flex items-center">
                    <Award className="h-4 w-4 mr-1 text-amber-300" />
                    Manager Performance
                  </h3>
                  <div className="bg-purple-800 px-3 py-1 rounded-lg flex items-center">
                    <span className="font-bold">{Object.keys(managerStats).length} Managers</span>
                  </div>
                </div>

                <div className="bg-amber-700/30 p-3 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-amber-800/50 p-2 rounded-lg">
                      <div className="text-xs text-amber-300 mb-1">Total Earnings</div>
                      <div className="font-bold">
                        {formatCurrency(Object.values(managerStats).reduce((sum, stat) => sum + stat.totalEarnings, 0))}
                      </div>
                    </div>
                    <div className="bg-amber-800/50 p-2 rounded-lg">
                      <div className="text-xs text-amber-300 mb-1">Total Collections</div>
                      <div className="font-bold">
                        {formatNumber(Object.values(managerStats).reduce((sum, stat) => sum + stat.collections, 0))}
                      </div>
                    </div>
                    <div className="bg-amber-800/50 p-2 rounded-lg">
                      <div className="text-xs text-amber-300 mb-1">Active Managers</div>
                      <div className="font-bold">{Object.keys(managerStats).length}</div>
                    </div>
                  </div>
                </div>

                {Object.keys(managerStats).length === 0 ? (
                  <div className="text-center py-8 bg-amber-800/30 rounded-lg">
                    <p className="text-amber-300">No manager activity yet.</p>
                    <p className="text-sm mt-2">Hire managers and let them work to see statistics here!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {Object.entries(managerStats)
                      .sort(([, a], [, b]) => b.totalEarnings - a.totalEarnings)
                      .map(([managerId, stats]) => (
                        <ManagerStatsCard key={managerId} managerId={managerId} stats={stats} />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
