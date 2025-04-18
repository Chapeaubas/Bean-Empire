"use client"

import { Coffee, Zap, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import HamsterCharacter from "@/components/hamster-character"
import PixelButton from "@/components/pixel-button"

interface UpgradeShopProps {
  coins: number
  machineLevel: number
  speedLevel: number
  tipLevel: number
  onUpgrade: (type: "machine" | "speed" | "tip") => void
  onContinue: () => void
  onBackToMenu: () => void
}

export default function UpgradeShop({
  coins,
  machineLevel,
  speedLevel,
  tipLevel,
  onUpgrade,
  onContinue,
  onBackToMenu,
}: UpgradeShopProps) {
  const machineCost = machineLevel * 50
  const speedCost = speedLevel * 40
  const tipCost = tipLevel * 30

  return (
    <div className="w-full max-w-4xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800">$GRIND's Coffee Shop</h2>
        <p className="text-amber-600">Upgrade your equipment to handle more orders!</p>
      </div>

      <div className="flex justify-center mb-6">
        <HamsterCharacter animation="happy" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-amber-300">
          <CardHeader className="bg-amber-100">
            <CardTitle className="flex items-center text-amber-800">
              <Coffee className="mr-2" />
              Coffee Machine
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="mb-2">Current Level: {machineLevel}</p>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade your machine to handle more complex orders and earn bigger rewards.
            </p>
            <div className="text-amber-700 font-bold flex items-center">
              <Coins className="mr-1 h-4 w-4" />
              Cost: {machineCost} $GRIND
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => onUpgrade("machine")}
              disabled={coins < machineCost}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Upgrade Machine
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-amber-300">
          <CardHeader className="bg-amber-100">
            <CardTitle className="flex items-center text-amber-800">
              <Zap className="mr-2" />
              Brewing Speed
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="mb-2">Current Level: {speedLevel}</p>
            <p className="text-sm text-gray-600 mb-4">
              Increase your brewing speed to serve more customers in less time.
            </p>
            <div className="text-amber-700 font-bold flex items-center">
              <Coins className="mr-1 h-4 w-4" />
              Cost: {speedCost} $GRIND
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => onUpgrade("speed")}
              disabled={coins < speedCost}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Upgrade Speed
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-amber-300">
          <CardHeader className="bg-amber-100">
            <CardTitle className="flex items-center text-amber-800">
              <Coins className="mr-2" />
              Tip Jar
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-4">
            <p className="mb-2">Current Level: {tipLevel}</p>
            <p className="text-sm text-gray-600 mb-4">Upgrade your tip jar to earn bigger tips for perfect orders.</p>
            <div className="text-amber-700 font-bold flex items-center">
              <Coins className="mr-1 h-4 w-4" />
              Cost: {tipCost} $GRIND
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => onUpgrade("tip")}
              disabled={coins < tipCost}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Upgrade Tip Jar
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <PixelButton text="Back to Menu" color="pink" onClick={onBackToMenu} className="px-8 py-3" />
        <PixelButton text="Continue to Next Level" color="green" onClick={onContinue} className="px-8 py-3" />
      </div>
    </div>
  )
}
