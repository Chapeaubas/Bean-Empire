"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"
import { Sparkles, Settings, HelpCircle } from "lucide-react"
import PauseMenu from "@/components/pause-menu"
import FAQModal from "@/components/faq-modal" // Import the FAQ modal component

interface GlobalActionsBarProps {
  cash: number
  onCollectAll: () => void
  onStartAll: () => void
  readyBusinesses: number
  idleBusinesses: number
  totalRevenue: number
  onPrestige: () => void
  prestigeMultiplier: number
  canPrestige: boolean
  lifetimeEarnings: number
  newAngels: number
  onShowSettings?: () => void
  onShowFAQ?: () => void
}

export default function GlobalActionsBar({
  cash,
  onCollectAll,
  onStartAll,
  readyBusinesses,
  idleBusinesses,
  totalRevenue,
  onPrestige,
  prestigeMultiplier,
  canPrestige,
  lifetimeEarnings,
  newAngels,
  onShowSettings,
  onShowFAQ,
}: GlobalActionsBarProps) {
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState(false)
  const [showPauseMenu, setShowPauseMenu] = useState(false)
  const [showLocalFAQ, setShowLocalFAQ] = useState(false) // Local state for FAQ modal

  // Ensure values are safe
  const safeCash = isNaN(cash) ? 0 : cash
  const safeReadyBusinesses = isNaN(readyBusinesses) ? 0 : readyBusinesses
  const safeIdleBusinesses = isNaN(idleBusinesses) ? 0 : idleBusinesses
  const safeTotalRevenue = isNaN(totalRevenue) ? 0 : totalRevenue

  // Calculate prestige values safely
  let safePrestigeMultiplier = 0
  if (!isNaN(prestigeMultiplier)) {
    safePrestigeMultiplier = prestigeMultiplier
  }

  // Calculate new angels using the same formula as in prestige-modal.tsx
  const safeLifetimeEarnings = isNaN(lifetimeEarnings) || lifetimeEarnings === undefined ? 0 : lifetimeEarnings
  const safeGrindBeans = Math.floor(Math.sqrt(safeLifetimeEarnings / 1e10)) || 0

  return (
    <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-2 border-t border-amber-700 sticky bottom-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {showPrestigeConfirm ? (
            <div className="flex flex-wrap items-center gap-2 w-full justify-center sm:justify-end">
              <div className="text-amber-300 text-sm">
                Reset progress for {safePrestigeMultiplier}x multiplier and {formatNumber(safeGrindBeans)} $GRIND beans?
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => setShowPrestigeConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    onPrestige()
                    setShowPrestigeConfirm(false)
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 w-full justify-center sm:justify-start">
              <Button
                variant="default"
                className={`bg-gradient-to-r ${
                  canPrestige
                    ? "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    : "from-gray-500 to-gray-600"
                } flex-1 sm:flex-none`}
                onClick={() => setShowPrestigeConfirm(true)}
                disabled={!canPrestige}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Prestige ({isNaN(safePrestigeMultiplier) ? "0" : safePrestigeMultiplier}x)
              </Button>

              <Button
                variant="default"
                className="bg-amber-600 hover:bg-amber-700 flex-1 sm:flex-none"
                onClick={onShowSettings}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          )}
        </div>

        {/* Add a dedicated FAQ button that's always visible */}
        <div className="flex items-center">
          <Button
            variant="default"
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => {
              if (onShowFAQ) {
                onShowFAQ()
              } else {
                // Use our local FAQ modal if no callback is provided
                setShowLocalFAQ(true)
                console.log("Using local FAQ modal as onShowFAQ function was not provided")
              }
            }}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </Button>
        </div>
      </div>

      {/* Render modals */}
      {showPauseMenu && <PauseMenu onResume={() => setShowPauseMenu(false)} onClose={() => setShowPauseMenu(false)} />}

      {/* Render local FAQ modal if needed */}
      <FAQModal show={showLocalFAQ} onClose={() => setShowLocalFAQ(false)} />
    </div>
  )
}
