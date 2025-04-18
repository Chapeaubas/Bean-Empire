"use client"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { Coffee, Zap } from "lucide-react"
import { motion } from "framer-motion"

interface CoffeeMachineProps {
  machineLevel: number
  speedLevel: number
  clickPowerLevel?: number
  autoBrewers?: number
  selectedIngredients: {
    beans: string | null
    milk: string | null
    extra: string | null
  }
  onCoffeeBrewed: () => void
  isCoffeeBrewedAlready: boolean
}

export default function CoffeeMachine({
  machineLevel,
  speedLevel,
  clickPowerLevel = 1,
  autoBrewers = 0,
  selectedIngredients,
  onCoffeeBrewed,
  isCoffeeBrewedAlready,
}: CoffeeMachineProps) {
  const [brewing, setBrewing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [brewingComplete, setBrewingComplete] = useState(false)
  const hasNotifiedRef = useRef(false)
  const [clickEffect, setClickEffect] = useState(false)

  // Calculate click power based on speed level and click power level
  const clickPower = speedLevel + (clickPowerLevel - 1) * 2

  // Reset progress when ingredients change
  useEffect(() => {
    setProgress(0)
    setBrewing(false)
    setBrewingComplete(false)
    hasNotifiedRef.current = false
  }, [selectedIngredients])

  // Handle brewing completion
  useEffect(() => {
    if (progress >= 100 && !brewingComplete) {
      setBrewing(false)
      setBrewingComplete(true)
    }

    if (brewingComplete && !hasNotifiedRef.current && !isCoffeeBrewedAlready) {
      hasNotifiedRef.current = true
      onCoffeeBrewed()
    }
  }, [progress, brewingComplete, onCoffeeBrewed, isCoffeeBrewedAlready])

  // Click effect animation
  useEffect(() => {
    if (clickEffect) {
      const timer = setTimeout(() => {
        setClickEffect(false)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [clickEffect])

  const handleBrewClick = () => {
    // If we haven't started brewing yet, initialize
    if (!brewing && !brewingComplete) {
      if (!selectedIngredients.beans || !selectedIngredients.milk) return
      setBrewing(true)
    }

    // If brewing is complete, don't do anything
    if (brewingComplete || isCoffeeBrewedAlready) return

    // Add progress based on click power
    setProgress((prev) => {
      const newProgress = Math.min(prev + clickPower, 100)
      return newProgress
    })

    // Show click effect with more dynamic animation
    setClickEffect(true)
  }

  const canStartBrewing =
    selectedIngredients.beans && selectedIngredients.milk && !brewingComplete && !isCoffeeBrewedAlready

  return (
    <div className="bg-amber-200 rounded-lg p-4 border-2 border-amber-400">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-amber-800 pixel-text text-sm">Machine Lvl.{machineLevel}</h3>
        <div className="text-sm text-amber-700 pixel-text">Click Power: {clickPower}</div>
      </div>

      <div className="bg-amber-700 rounded-lg p-4 relative h-40 flex flex-col justify-between">
        {/* Machine top */}
        <div className="bg-amber-800 h-1/3 rounded-t-lg flex justify-center items-center">
          <div className="bg-amber-900 w-1/4 h-2/3 rounded-md flex justify-center items-center">
            <Coffee className="text-amber-200" />
          </div>
          {autoBrewers > 0 && (
            <div className="absolute right-2 top-2 bg-green-500 rounded-full px-2 py-1 text-xs text-white pixel-text flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {autoBrewers}
            </div>
          )}
        </div>

        {/* Machine middle - brewing area */}
        <motion.div className="flex justify-center items-center h-1/3 relative">
          {brewing && (
            <div className="absolute inset-0 flex justify-center">
              <motion.div
                className="w-1/6 bg-amber-500"
                style={{
                  height: `${progress}%`,
                  position: "absolute",
                  bottom: 0,
                  borderRadius: "2px",
                }}
                initial={{ height: "0%" }}
                animate={{ height: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              ></motion.div>
            </div>
          )}

          <div className="bg-amber-600 w-1/3 h-full rounded-md flex justify-center items-center">
            {progress === 100 && (
              <motion.div
                className="bg-amber-500 w-2/3 h-2/3 rounded-md flex justify-center items-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Coffee className="text-white h-4 w-4" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Machine bottom */}
        <div className="bg-amber-800 h-1/3 rounded-b-lg flex justify-center items-center">
          <motion.button
            onClick={handleBrewClick}
            disabled={!canStartBrewing && !brewing}
            className={`
              ${
                !canStartBrewing && !brewing
                  ? "bg-gray-400"
                  : clickEffect
                    ? "bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
              } 
              text-white pixel-text transition-all duration-100
            `}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: clickEffect ? 0.95 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {!brewing && !brewingComplete ? "Start Brewing" : brewing ? "Click to Brew!" : "Coffee Ready"}
          </motion.button>
        </div>
      </div>

      <div className="mt-4">
        <Progress
          value={isNaN(progress) ? 0 : progress}
          className="h-2 bg-amber-100"
          indicatorClassName={
            progress >= 100 ? "bg-green-500 transition-all duration-300" : "bg-amber-500 transition-all duration-300"
          }
        />

        <div className="text-center text-xs mt-1 text-amber-800 pixel-text">
          {brewing ? `${Math.floor(progress)}%` : progress >= 100 ? "Complete!" : "Ready to brew"}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
        <div className="bg-amber-100 p-2 rounded-md">
          <div className="font-bold pixel-text">Beans:</div>
          <div className="pixel-text">{selectedIngredients.beans || "Not selected"}</div>
        </div>

        <div className="bg-amber-100 p-2 rounded-md">
          <div className="font-bold pixel-text">Milk:</div>
          <div className="pixel-text">{selectedIngredients.milk || "Not selected"}</div>
        </div>

        <div className="bg-amber-100 p-2 rounded-md">
          <div className="font-bold pixel-text">Extra:</div>
          <div className="pixel-text">{selectedIngredients.extra || "None"}</div>
        </div>
      </div>
    </div>
  )
}
