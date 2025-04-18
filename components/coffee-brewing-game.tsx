"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { X, Clock, Coffee, Check, AlertTriangle, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CoffeeBrewingGameProps {
  onComplete: (score: number, reward: number) => void
  onClose: () => void
  difficultyLevel?: number
  baseReward?: number
}

type BrewingStep = {
  name: string
  targetTime: number
  tolerance: number
  points: number
  icon: string
  color: string
}

export default function CoffeeBrewingGame({
  onComplete,
  onClose,
  difficultyLevel = 1,
  baseReward = 150,
}: CoffeeBrewingGameProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [results, setResults] = useState<{ step: string; timing: string; points: number }[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackColor, setFeedbackColor] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const gameStartTimeRef = useRef<number>(0)

  // Define brewing steps based on difficulty
  const brewingSteps: BrewingStep[] = [
    {
      name: "Grind Beans",
      targetTime: 3,
      tolerance: 0.5,
      points: 20,
      icon: "☕",
      color: "from-amber-600 to-amber-700",
    },
    {
      name: "Heat Water",
      targetTime: 5,
      tolerance: 0.7,
      points: 20,
      icon: "💧",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Bloom Coffee",
      targetTime: 2,
      tolerance: 0.4,
      points: 20,
      icon: "🌱",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Pour Water",
      targetTime: 4,
      tolerance: 0.6,
      points: 20,
      icon: "🫖",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Wait for Extraction",
      targetTime: 6,
      tolerance: 0.8,
      points: 20,
      icon: "⏳",
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  // Adjust difficulty
  useEffect(() => {
    if (difficultyLevel > 1) {
      brewingSteps.forEach((step) => {
        step.tolerance = Math.max(0.2, step.tolerance - difficultyLevel * 0.1)
      })
    }
  }, [difficultyLevel])

  // Timer for the game
  useEffect(() => {
    if (gameState === "playing" && !isPaused) {
      gameStartTimeRef.current = Date.now() - timeElapsed * 1000

      timerRef.current = setInterval(() => {
        setTimeElapsed((Date.now() - gameStartTimeRef.current) / 1000)
      }, 100)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState, isPaused])

  const startGame = () => {
    setGameState("playing")
    setCurrentStep(0)
    setScore(0)
    setTimeElapsed(0)
    setResults([])
    setIsPaused(false)
    gameStartTimeRef.current = Date.now()
  }

  const handleBrewingAction = () => {
    if (currentStep >= brewingSteps.length) return

    const step = brewingSteps[currentStep]
    const stepTimeElapsed = timeElapsed - results.reduce((acc, r) => acc + Number.parseFloat(r.timing.split("s")[0]), 0)

    // Calculate how close to the target time
    const timeDifference = Math.abs(stepTimeElapsed - step.targetTime)
    const isWithinTolerance = timeDifference <= step.tolerance

    // Calculate points based on accuracy
    let pointsEarned = 0
    if (timeDifference === 0) {
      pointsEarned = step.points // Perfect timing
      setFeedbackText("Perfect!")
      setFeedbackColor("text-green-400")
    } else if (isWithinTolerance) {
      const accuracyPercentage = 1 - timeDifference / step.tolerance
      pointsEarned = Math.round(step.points * accuracyPercentage)
      setFeedbackText("Good!")
      setFeedbackColor("text-blue-400")
    } else {
      pointsEarned = Math.round(step.points * 0.2) // Minimum points
      setFeedbackText("Too " + (stepTimeElapsed < step.targetTime ? "Early!" : "Late!"))
      setFeedbackColor("text-red-400")
    }

    // Show feedback
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 1000)

    // Update score and results
    setScore((prev) => prev + pointsEarned)
    setResults((prev) => [
      ...prev,
      {
        step: step.name,
        timing: `${stepTimeElapsed.toFixed(1)}s`,
        points: pointsEarned,
      },
    ])

    // Move to next step or end game
    if (currentStep < brewingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      endGame()
    }
  }

  const endGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setGameState("complete")

    // Calculate reward based on score and difficulty
    const maxPossibleScore = brewingSteps.reduce((acc, step) => acc + step.points, 0)
    const scorePercentage = score / maxPossibleScore
    const reward = Math.floor(baseReward * difficultyLevel * scorePercentage)

    onComplete(score, reward)
  }

  const calculateReward = () => {
    const maxPossibleScore = brewingSteps.reduce((acc, step) => acc + step.points, 0)
    const scorePercentage = score / maxPossibleScore
    return Math.floor(baseReward * difficultyLevel * scorePercentage)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-4 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-300" />
            Coffee Brewing Challenge
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === "intro" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Master the Perfect Brew!</h3>
              <p className="text-amber-200 mb-4">
                Brewing the perfect cup of coffee requires precise timing. Hit the button at just the right moment for
                each step!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {brewingSteps.map((step, index) => (
                <div key={index} className="bg-amber-700/50 p-3 rounded-lg text-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-b ${step.color} rounded-full mx-auto mb-2 flex items-center justify-center text-xl`}
                  >
                    {step.icon}
                  </div>
                  <h4 className="font-bold">{step.name}</h4>
                  <p className="text-xs">
                    Target: {step.targetTime}s (±{step.tolerance}s)
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-amber-700/30 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Game Rules
              </h4>
              <ul className="text-sm text-left list-disc list-inside space-y-1">
                <li>Each brewing step has an ideal timing</li>
                <li>Press the button when you think the right amount of time has passed</li>
                <li>The closer you are to the target time, the more points you earn</li>
                <li>Complete all steps to brew the perfect cup of coffee!</li>
              </ul>
            </div>

            <Button
              variant="default"
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Start Brewing!
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center bg-amber-900/50">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-300" />
                <span className="font-bold">{timeElapsed.toFixed(1)}s</span>
              </div>

              <div className="flex items-center">
                <span className="mr-4">
                  Step:{" "}
                  <span className="font-bold">
                    {currentStep + 1}/{brewingSteps.length}
                  </span>
                </span>
                <span>
                  Score: <span className="font-bold">{score}</span>
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-amber-700/30 relative">
              {/* Current step display */}
              <div className="mb-8 text-center">
                <div
                  className={`w-20 h-20 bg-gradient-to-b ${brewingSteps[currentStep].color} rounded-full mx-auto mb-4 flex items-center justify-center text-3xl`}
                >
                  {brewingSteps[currentStep].icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{brewingSteps[currentStep].name}</h3>
                <p className="text-amber-200">Target: {brewingSteps[currentStep].targetTime}s</p>
              </div>

              {/* Feedback animation */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 0 }}
                    animate={{ scale: 1.5, opacity: 1, y: -20 }}
                    exit={{ scale: 0.5, opacity: 0, y: -40 }}
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl ${feedbackColor}`}
                  >
                    {feedbackText}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action button */}
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBrewingAction}
              >
                {currentStep === 0 ? "Start Brewing!" : "Perfect Timing!"}
              </motion.button>

              {/* Previous steps results */}
              {results.length > 0 && (
                <div className="mt-8 w-full">
                  <h4 className="font-bold mb-2">Previous Steps:</h4>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div key={index} className="bg-amber-800/50 p-2 rounded flex justify-between items-center">
                        <span>{result.step}</span>
                        <div className="flex items-center">
                          <span className="mr-3">{result.timing}</span>
                          <span className="font-bold text-amber-300">+{result.points}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === "complete" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              {score >= 70 ? (
                <>
                  <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Perfect Brew!</h3>
                  <p className="text-amber-200">Your timing skills have created an exceptional cup of coffee!</p>
                </>
              ) : score >= 40 ? (
                <>
                  <Coffee className="h-16 w-16 mx-auto mb-4 text-amber-300" />
                  <h3 className="text-2xl font-bold mb-2">Good Brew</h3>
                  <p className="text-amber-200">Your coffee is decent, but there's room for improvement!</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-2xl font-bold mb-2">Needs Practice</h3>
                  <p className="text-amber-200">Your timing was off. Keep practicing for a better brew!</p>
                </>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-bold">Final Score: {score}</h4>
              <h4 className="font-bold">Reward: {formatCurrency(calculateReward())}</h4>
            </div>

            <div className="bg-amber-700/30 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2 flex items-center justify-center">
                <Zap className="h-4 w-4 mr-2" />
                Brewing Results
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="bg-amber-800/50 p-2 rounded flex justify-between items-center">
                    <span>{result.step}</span>
                    <div className="flex items-center">
                      <span className="mr-3">{result.timing}</span>
                      <span className="font-bold text-amber-300">+{result.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="default"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                onClick={startGame}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
