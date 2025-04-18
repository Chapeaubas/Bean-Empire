"use client"
import BaseModal from "@/components/base-modal"
import PrestigeUpgrades from "@/components/prestige-upgrades"
import { Sparkles } from "lucide-react"

interface PrestigeShopModalProps {
  show: boolean
  onClose: () => void
  angelInvestors: number
  prestigeUpgrades: any[]
  prestigeUpgradeStates: { [key: string]: number }
  onBuyPrestigeUpgrade: (upgradeId: string) => void
}

export default function PrestigeShopModal({
  show,
  onClose,
  angelInvestors,
  prestigeUpgrades,
  prestigeUpgradeStates,
  onBuyPrestigeUpgrade,
}: PrestigeShopModalProps) {
  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title={
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-300" />
          Prestige Shop
        </div>
      }
    >
      <div className="p-4">
        <div className="mb-4">
          <p className="text-amber-300 mb-2">
            Spend your $GRIND Beans on powerful upgrades that will boost your coffee empire!
          </p>
          <div className="bg-amber-700 px-3 py-2 rounded-lg inline-block">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
              <span className="font-bold">{angelInvestors} $GRIND Available</span>
            </div>
          </div>
        </div>

        <PrestigeUpgrades
          prestigePoints={angelInvestors}
          ownedUpgrades={Object.keys(prestigeUpgradeStates).filter((id) => prestigeUpgradeStates[id] > 0)}
          onPurchase={(upgradeId, cost) => onBuyPrestigeUpgrade(upgradeId)}
        />
      </div>
    </BaseModal>
  )
}
