"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bug, RefreshCw, Wrench, Trash2, Activity, Play } from "lucide-react"

interface DebugPanelProps {
  isOpen: boolean
  onClose: () => void
  businessStates: { [key: string]: any }
  managers: { [key: string]: boolean }
  onResetManagers: () => void
  onFixAllBusinesses: () => void
  onClearLocalStorage: () => void
  onForceStartAllManagerBusinesses?: () => void
}

export default function DebugPanel({
  isOpen,
  onClose,
  businessStates,
  managers,
  onResetManagers,
  onFixAllBusinesses,
  onClearLocalStorage,
  onForceStartAllManagerBusinesses,
}: DebugPanelProps) {
  const [activeTab, setActiveTab] = useState<"businesses" | "managers" | "actions">("businesses")

  if (!isOpen) return null

  // Get businesses with managers
  const businessesWithManagers = Object.entries(businessStates)
    .filter(([_, state]) => state.hasManager && state.owned > 0)
    .map(([id, state]) => ({
      id,
      owned: state.owned,
      progress: state.progress,
      hasManager: state.hasManager,
    }))

  // Get hired managers
  const hiredManagers = Object.entries(managers)
    .filter(([_, isHired]) => isHired)
    .map(([id]) => id)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-red-950 border-2 border-red-800 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-red-800">
          <h2 className="text-xl font-bold flex items-center">
            <Bug className="h-5 w-5 mr-2 text-red-400" />
            Debug Panel
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex border-b border-red-800">
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === "businesses" ? "bg-red-900 text-white" : "text-red-300 hover:bg-red-900/50"
            }`}
            onClick={() => setActiveTab("businesses")}
          >
            Businesses
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === "managers" ? "bg-red-900 text-white" : "text-red-300 hover:bg-red-900/50"
            }`}
            onClick={() => setActiveTab("managers")}
          >
            Managers
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === "actions" ? "bg-red-900 text-white" : "text-red-300 hover:bg-red-900/50"
            }`}
            onClick={() => setActiveTab("actions")}
          >
            Actions
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "businesses" && (
            <div>
              <h3 className="font-bold mb-2">Businesses with Managers ({businessesWithManagers.length})</h3>
              {businessesWithManagers.length === 0 ? (
                <p className="text-red-300">No businesses with managers found.</p>
              ) : (
                <div className="space-y-2">
                  {businessesWithManagers.map((business) => (
                    <div key={business.id} className="bg-red-900/30 p-2 rounded border border-red-800">
                      <div className="flex justify-between">
                        <span>ID: {business.id}</span>
                        <span>Owned: {business.owned}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Progress: {business.progress?.toFixed(1)}%</span>
                        <span>Has Manager: {business.hasManager ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "managers" && (
            <div>
              <h3 className="font-bold mb-2">Hired Managers ({hiredManagers.length})</h3>
              {hiredManagers.length === 0 ? (
                <p className="text-red-300">No managers hired.</p>
              ) : (
                <div className="space-y-2">
                  {hiredManagers.map((managerId) => (
                    <div key={managerId} className="bg-red-900/30 p-2 rounded border border-red-800">
                      <span>Manager ID: {managerId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Debug Actions</h3>
                <p className="text-red-300 text-sm mb-4">
                  These actions can help fix issues with the game. Use them if you encounter problems.
                </p>

                <div className="space-y-3">
                  <div className="bg-red-900/30 p-3 rounded border border-red-800">
                    <h4 className="font-bold flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 text-red-400" />
                      Reset Manager System
                    </h4>
                    <p className="text-sm text-red-300 mb-2">
                      Recreates the manager system. Use this if managers stop working.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-700 hover:bg-red-800"
                      onClick={onResetManagers}
                    >
                      Reset Managers
                    </Button>
                  </div>

                  <div className="bg-red-900/30 p-3 rounded border border-red-800">
                    <h4 className="font-bold flex items-center">
                      <Wrench className="h-4 w-4 mr-2 text-red-400" />
                      Fix All Businesses
                    </h4>
                    <p className="text-sm text-red-300 mb-2">
                      Resets progress for stuck businesses and restarts the manager system.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-700 hover:bg-red-800"
                      onClick={onFixAllBusinesses}
                    >
                      Fix Businesses
                    </Button>
                  </div>

                  {onForceStartAllManagerBusinesses && (
                    <div className="bg-red-900/30 p-3 rounded border border-red-800">
                      <h4 className="font-bold flex items-center">
                        <Play className="h-4 w-4 mr-2 text-red-400" />
                        Force Start All Manager Businesses
                      </h4>
                      <p className="text-sm text-red-300 mb-2">
                        Force starts all businesses with managers. Use this if businesses are stuck.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-700 hover:bg-red-800"
                        onClick={onForceStartAllManagerBusinesses}
                      >
                        Force Start
                      </Button>
                    </div>
                  )}

                  <div className="bg-red-900/30 p-3 rounded border border-red-800">
                    <h4 className="font-bold flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-red-400" />
                      Check Manager Status
                    </h4>
                    <p className="text-sm text-red-300 mb-2">
                      Logs the current status of all businesses with managers to the console.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-700 hover:bg-red-800"
                      onClick={() => {
                        console.log("=== MANAGER STATUS CHECK ===")
                        businessesWithManagers.forEach((business) => {
                          console.log(`Business ${business.id}:`)
                          console.log(`  Owned: ${business.owned}`)
                          console.log(`  Progress: ${business.progress?.toFixed(1)}%`)
                          console.log(`  Has Manager: ${business.hasManager}`)
                        })
                      }}
                    >
                      Check Status
                    </Button>
                  </div>

                  <div className="bg-red-900/30 p-3 rounded border border-red-800">
                    <h4 className="font-bold flex items-center">
                      <Trash2 className="h-4 w-4 mr-2 text-red-400" />
                      Clear Local Storage
                    </h4>
                    <p className="text-sm text-red-300 mb-2">
                      Clears all saved data. Use this as a last resort if the game is completely broken.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-700 hover:bg-red-800"
                      onClick={onClearLocalStorage}
                    >
                      Clear Storage
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
