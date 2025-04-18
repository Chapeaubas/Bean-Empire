"use client"

import { Button } from "@/components/ui/button"

interface AngelEffectivenessUpgradeProps {
  prestigePoints: number
  ownedPrestigeUpgrades: string[]
  onPurchase: (upgradeId: string, cost: number) => void
}

export default function AngelEffectivenessUpgrade({
  prestigePoints,
  ownedPrestigeUpgrades,
  onPurchase,
}: AngelEffectivenessUpgradeProps) {
  const hasBasicUpgrade = ownedPrestigeUpgrades.includes("angel_effectiveness")
  const hasAdvancedUpgrade = ownedPrestigeUpgrades.includes("angel_effectiveness_2")
  const hasSuperUpgrade = ownedPrestigeUpgrades.includes("angel_effectiveness_3")

  const basicCost = 10
  const advancedCost = 50
  const superCost = 250

  return (
    <div className="space-y-3">
      <div className="bg-amber-700 rounded-lg p-3 flex justify-between items-center">
        <div>
          <h3 className="font-bold">$GRIND Effectiveness I</h3>
          <p className="text-sm text-amber-300">
            Each $GRIND gives 3% bonus instead of 2%. (Cost: {basicCost} $GRIND Beans)
          </p>
        </div>
        <Button
          variant="default"
          className={
            prestigePoints >= basicCost && !hasBasicUpgrade ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-500"
          }
          disabled={prestigePoints < basicCost || hasBasicUpgrade}
          onClick={() => onPurchase("angel_effectiveness", basicCost)}
        >
          {hasBasicUpgrade ? "Purchased" : `Buy (${basicCost} $GRIND Beans)`}
        </Button>
      </div>

      <div className="bg-amber-700 rounded-lg p-3 flex justify-between items-center">
        <div>
          <h3 className="font-bold">$GRIND Effectiveness II</h3>
          <p className="text-sm text-amber-300">
            Each $GRIND gives 4% bonus instead of 3%. (Cost: {advancedCost} $GRIND Beans)
          </p>
        </div>
        <Button
          variant="default"
          className={
            prestigePoints >= advancedCost && hasBasicUpgrade && !hasAdvancedUpgrade
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-gray-500"
          }
          disabled={prestigePoints < advancedCost || !hasBasicUpgrade || hasAdvancedUpgrade}
          onClick={() => onPurchase("angel_effectiveness_2", advancedCost)}
        >
          {hasAdvancedUpgrade ? "Purchased" : `Buy (${advancedCost} $GRIND Beans)`}
        </Button>
      </div>

      <div className="bg-amber-700 rounded-lg p-3 flex justify-between items-center">
        <div>
          <h3 className="font-bold">$GRIND Effectiveness III</h3>
          <p className="text-sm text-amber-300">
            Each $GRIND gives 5% bonus instead of 4%. (Cost: {superCost} $GRIND Beans)
          </p>
        </div>
        <Button
          variant="default"
          className={
            prestigePoints >= superCost && hasAdvancedUpgrade && !hasSuperUpgrade
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-gray-500"
          }
          disabled={prestigePoints < superCost || !hasAdvancedUpgrade || hasSuperUpgrade}
          onClick={() => onPurchase("angel_effectiveness_3", superCost)}
        >
          {hasSuperUpgrade ? "Purchased" : `Buy (${superCost} $GRIND Beans)`}
        </Button>
      </div>
    </div>
  )
}
