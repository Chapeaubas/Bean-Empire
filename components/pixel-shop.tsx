"use client"

interface PixelShopProps {
  coins: number
  level: number
  score: number
  machineLevel: number
  speedLevel: number
  tipLevel: number
  clickPowerLevel?: number
  autoBrewers?: number
  incomeMultiplier?: number
  onUpgrade: (type: "machine" | "speed" | "tip" | "clickPower" | "autoBrewer" | "multiplier") => void
  onContinueGame: () => void
  onBackToMenu: () => void
}

export default function PixelShop({
  coins,
  level,
  score,
  machineLevel,
  speedLevel,
  tipLevel,
  clickPowerLevel = 1,
  autoBrewers = 0,
  incomeMultiplier = 1,
  onUpgrade,
  onContinueGame,
  onBackToMenu,
}: PixelShopProps) {
  // Calculate costs based on current levels
  const machineCost = machineLevel * 50
  const speedCost = speedLevel * 40
  const tipCost = tipLevel * 30
  const clickPowerCost = clickPowerLevel * 35
  const autoBrewerCost = Math.floor(100 * Math.pow(1.5, autoBrewers))
  const multiplierCost = Math.floor(200 * Math.pow(2, incomeMultiplier - 1))

  // Track if user can afford upgrades
  const canAffordMachine = coins >= machineCost
  const canAffordSpeed = coins >= speedCost
  const canAffordTip = coins >= tipCost
  const canAffordClickPower = coins >= clickPowerCost
  const canAffordAutoBrewer = coins >= autoBrewerCost
  const canAffordMultiplier = coins >= multiplierCost

  return (
    <div className="w-full max-w-4xl mx-auto bg-amber-100 border-4 border-amber-800 rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-amber-800 pixel-text">$GRIND Coffee Empire</h2>
        <p className="text-amber-700 pixel-text mt-2">
          Prestige Level {level} | Total Earnings: {score} $GRIND
        </p>
        <p className="text-amber-600 pixel-text mt-1">Current Balance: {coins} $GRIND coins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Coffee Machine Upgrade */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Coffee Machine</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Current Level: {machineLevel}</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">Upgrade your machine to handle more complex orders.</p>
          <button
            onClick={() => canAffordMachine && onUpgrade("machine")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordMachine && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordMachine}
          >
            Upgrade: {machineCost} $GRIND
          </button>
        </div>

        {/* Brewing Speed Upgrade */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Brewing Speed</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Current Level: {speedLevel}</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">Increase your brewing speed with each click.</p>
          <button
            onClick={() => canAffordSpeed && onUpgrade("speed")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordSpeed && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordSpeed}
          >
            Upgrade: {speedCost} $GRIND
          </button>
        </div>

        {/* Click Power Upgrade */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Click Power</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Current Level: {clickPowerLevel}</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">Increase % per click when brewing coffee.</p>
          <button
            onClick={() => canAffordClickPower && onUpgrade("clickPower")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordClickPower && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordClickPower}
          >
            Upgrade: {clickPowerCost} $GRIND
          </button>
        </div>

        {/* Tip Jar Upgrade */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Tip Jar</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Current Level: {tipLevel}</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">Upgrade your tip jar to earn bigger tips.</p>
          <button
            onClick={() => canAffordTip && onUpgrade("tip")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordTip && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordTip}
          >
            Upgrade: {tipCost} $GRIND
          </button>
        </div>

        {/* Auto-Brewer - NEW */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Auto-Brewer</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Owned: {autoBrewers}</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">
            Earn passive income without clicking! Each brewer generates 5 $GRIND per second.
          </p>
          <button
            onClick={() => canAffordAutoBrewer && onUpgrade("autoBrewer")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordAutoBrewer && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordAutoBrewer}
          >
            Buy: {autoBrewerCost} $GRIND
          </button>
        </div>

        {/* Income Multiplier - NEW */}
        <div className="bg-amber-200 border-2 border-amber-400 rounded-lg p-4">
          <h3 className="text-amber-800 font-bold pixel-text mb-2">Income Multiplier</h3>
          <p className="text-amber-700 pixel-text text-sm mb-1">Current: {incomeMultiplier.toFixed(1)}x</p>
          <p className="text-amber-600 pixel-text text-xs mb-3">
            Multiply ALL income by an additional 0.5x! Affects both active and passive income.
          </p>
          <button
            onClick={() => canAffordMultiplier && onUpgrade("multiplier")}
            className={`w-full bg-red-600 text-white text-sm px-3 py-2 rounded pixel-text ${
              !canAffordMultiplier && "opacity-70 cursor-not-allowed"
            }`}
            disabled={!canAffordMultiplier}
          >
            Upgrade: {multiplierCost} $GRIND
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onContinueGame}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md pixel-text text-lg"
        >
          Continue Game
        </button>
      </div>
    </div>
  )
}
