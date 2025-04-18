"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { X, Clock, Coffee, Check, AlertTriangle, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BeanSortingGameProps {
  onComplete: (score: number, reward: number) => void
  onClose: () => void
  difficultyLevel?: number
  baseReward?: number
}

type BeanType = "arabica" | "robusta" | "defect"
type Bean = {
  id: number
  type: BeanType
  position: { x: number; y: number }
  rotation: number
  sorted: boolean
  scale: number
  color: string
  shadow: string
}

export default function BeanSortingGame({
  onComplete,
  onClose,
  difficultyLevel = 1,
  baseReward = 100,
}: BeanSortingGameProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds game
  const [beans, setBeans] = useState<Bean[]>([])
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [selectedBin, setSelectedBin] = useState<BeanType | null>(null)
  const [combo, setCombo] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const [isGameActive, setIsGameActive] = useState(false)

  // Initialize game
  useEffect(() => {
    if (gameState === "playing" && !isGameActive) {
      setIsGameActive(true)
      // Generate beans based on difficulty
      const beanCount = 10 + difficultyLevel * 5
      const newBeans: Bean[] = []

      for (let i = 0; i < beanCount; i++) {
        // Determine bean type (more defects at higher difficulties)
        let type: BeanType
        const rand = Math.random()
        if (rand < 0.4) type = "arabica"
        else if (rand < 0.8) type = "robusta"
        else type = "defect"

        // Generate bean color based on type
        let color, shadow
        if (type === "arabica") {
          color = `rgb(${150 + Math.random() * 30}, ${100 + Math.random() * 20}, ${50 + Math.random() * 20})`
          shadow = "rgba(120, 80, 40, 0.5)"
        } else if (type === "robusta") {
          color = `rgb(${100 + Math.random() * 20}, ${60 + Math.random() * 20}, ${30 + Math.random() * 20})`
          shadow = "rgba(80, 50, 30, 0.5)"
        } else {
          color = `rgb(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50})`
          shadow = "rgba(100, 100, 100, 0.5)"
        }

        newBeans.push({
          id: i,
          type,
          position: {
            x: 20 + Math.random() * 60, // percentage of container width
            y: 20 + Math.random() * 60, // percentage of container height
          },
          rotation: Math.random() * 360,
          sorted: false,
          scale: 0.8 + Math.random() * 0.4, // Random size variation
          color,
          shadow,
        })
      }

      setBeans(newBeans)

      // Start timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearInterval(timer)
        setIsGameActive(false)
      }
    }
  }, [gameState, difficultyLevel, isGameActive])

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(30)
    setScore(0)
    setMistakes(0)
    setCombo(0)
    setShowCombo(false)
    setBeans([])
    setIsGameActive(false)
  }

  const endGame = () => {
    setGameState("complete")
    setIsGameActive(false)
    // Calculate reward based on score and difficulty
    const accuracyPercentage = beans.length > 0 ? (score / beans.length) * 100 : 0
    const reward = Math.floor(baseReward * difficultyLevel * (accuracyPercentage / 100))
    onComplete(score, reward)
  }

  const handleBeanClick = (beanId: number) => {
    if (!selectedBin) return

    setBeans((prev) =>
      prev.map((bean) => {
        if (bean.id === beanId && !bean.sorted) {
          // Check if correctly sorted
          const correct = bean.type === selectedBin
          if (correct) {
            setScore((prev) => prev + 1)
            setCombo((prev) => prev + 1)
            setShowCombo(true)
            setTimeout(() => setShowCombo(false), 1000)
          } else {
            setMistakes((prev) => prev + 1)
            setCombo(0)
          }

          return { ...bean, sorted: true }
        }
        return bean
      }),
    )

    // Check if all beans are sorted
    const allSorted = beans.every((bean) => bean.sorted || bean.id === beanId)
    if (allSorted) {
      endGame()
    }
  }

  const getBinColor = (type: BeanType) => {
    switch (type) {
      case "arabica":
        return selectedBin === type ? "bg-amber-600 border-amber-400" : "bg-amber-800 border-amber-700"
      case "robusta":
        return selectedBin === type ? "bg-amber-800 border-amber-600" : "bg-amber-950 border-amber-900"
      case "defect":
        return selectedBin === type ? "bg-gray-600 border-gray-400" : "bg-gray-800 border-gray-700"
    }
  }

  function calculateReward() {
    const accuracyPercentage = beans.length > 0 ? (score / beans.length) * 100 : 0
    // Cap the reward to a reasonable amount based on the baseReward
    const reward = Math.floor(baseReward * difficultyLevel * (accuracyPercentage / 100))
    return reward
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-4 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-300" />
            Bean Sorting Challenge
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === "intro" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Sort the Coffee Beans!</h3>
              <p className="text-amber-200 mb-4">
                Sort the beans into the correct bins as quickly as possible. Be careful not to make mistakes!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-16 h-8 bg-gradient-to-b from-amber-600 to-amber-700 rounded-full mx-auto mb-2 shadow-md"></div>
                <h4 className="font-bold">Arabica</h4>
                <p className="text-xs">Light brown, oval</p>
              </div>

              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-16 h-8 bg-gradient-to-b from-amber-900 to-amber-950 rounded-full mx-auto mb-2 shadow-md"></div>
                <h4 className="font-bold">Robusta</h4>
                <p className="text-xs">Dark brown, round</p>
              </div>

              <div className="bg-amber-700/50 p-3 rounded-lg text-center">
                <div className="w-16 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full mx-auto mb-2 shadow-md"></div>
                <h4 className="font-bold">Defects</h4>
                <p className="text-xs">Discolored, irregular</p>
              </div>
            </div>

            <div className="bg-amber-700/30 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2 flex items-center justify-center">
                <Clock className="h-4 w-4 mr-2" />
                Game Rules
              </h4>
              <ul className="text-sm text-left list-disc list-inside space-y-1">
                <li>You have 30 seconds to sort as many beans as possible</li>
                <li>First select a bin, then click on beans to sort them</li>
                <li>Correct sorts earn points, mistakes reduce your score</li>
                <li>Build a combo by sorting correctly in a row!</li>
              </ul>
            </div>

            <Button
              variant="default"
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Start Sorting!
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center bg-amber-900/50">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-amber-300" />
                <span className="font-bold">{timeLeft}s</span>
              </div>

              <div className="flex items-center">
                <span className="mr-4">
                  Score: <span className="font-bold">{score}</span>
                </span>
                <span>
                  Mistakes: <span className="font-bold text-red-400">{mistakes}</span>
                </span>
              </div>
            </div>

            <div className="flex-1 relative p-4 bg-amber-700/30" ref={gameAreaRef}>
              {/* Beans */}
              <AnimatePresence>
                {beans.map(
                  (bean) =>
                    !bean.sorted && (
                      <motion.button
                        key={bean.id}
                        className="absolute cursor-pointer"
                        style={{
                          left: `${bean.position.x}%`,
                          top: `${bean.position.y}%`,
                        }}
                        onClick={() => handleBeanClick(bean.id)}
                        disabled={!selectedBin}
                        initial={{ scale: 0, rotate: bean.rotation }}
                        animate={{
                          scale: bean.scale,
                          rotate: bean.rotation,
                          transition: { type: "spring", stiffness: 300, damping: 20 },
                        }}
                        exit={{
                          scale: 0,
                          opacity: 0,
                          transition: { duration: 0.3 },
                        }}
                        whileHover={{ scale: bean.scale * 1.1 }}
                      >
                        <div
                          className="w-12 h-6 rounded-full transform-gpu"
                          style={{
                            background: `linear-gradient(to bottom, ${bean.color}, ${bean.color}cc)`,
                            boxShadow: `0 2px 4px ${bean.shadow}, inset 0 -2px 2px rgba(0,0,0,0.2), inset 0 2px 2px rgba(255,255,255,0.2)`,
                          }}
                        />
                      </motion.button>
                    ),
                )}
              </AnimatePresence>

              {/* Combo indicator */}
              <AnimatePresence>
                {showCombo && combo > 1 && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 0 }}
                    animate={{ scale: 1.2, opacity: 1, y: -20 }}
                    exit={{ scale: 0.5, opacity: 0, y: -40 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 font-bold text-2xl"
                  >
                    {combo}x Combo!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-amber-900/50 border-t border-amber-700">
              <div className="text-center mb-2">Select a bin, then click beans to sort them:</div>
              <div className="grid grid-cols-3 gap-4">
                <motion.button
                  className={`p-3 rounded-lg border-2 ${getBinColor("arabica")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("arabica")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-8 bg-gradient-to-b from-amber-600 to-amber-700 rounded-full mb-1 shadow-md"></div>
                  <span className="text-sm font-bold">Arabica</span>
                </motion.button>

                <motion.button
                  className={`p-3 rounded-lg border-2 ${getBinColor("robusta")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("robusta")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-8 bg-gradient-to-b from-amber-900 to-amber-950 rounded-full mb-1 shadow-md"></div>
                  <span className="text-sm font-bold">Robusta</span>
                </motion.button>

                <motion.button
                  className={`p-3 rounded-lg border-2 ${getBinColor("defect")} flex flex-col items-center`}
                  onClick={() => setSelectedBin("defect")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full mb-1 shadow-md"></div>
                  <span className="text-sm font-bold">Defects</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {gameState === "complete" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              {score > 7 ? (
                <>
                  <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Excellent Sorting!</h3>
                  <p className="text-amber-200">You sorted the beans with great accuracy and speed.</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <h3 className="text-2xl font-bold mb-2">Needs Improvement</h3>
                  <p className="text-amber-200">You can improve your sorting skills with more practice.</p>
                </>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-bold">Final Score: {score}</h4>
              <h4 className="font-bold">Mistakes: {mistakes}</h4>
              <h4 className="font-bold">Reward: {formatCurrency(calculateReward())}</h4>
            </div>

            <div className="bg-amber-700/30 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2 flex items-center justify-center">
                <Award className="h-4 w-4 mr-2" />
                Performance Stats
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-800/50 p-2 rounded">
                  <div className="text-xs text-amber-300 mb-1">Accuracy</div>
                  <div className="font-bold">
                    {beans.length > 0 ? Math.round((score / (score + mistakes)) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-amber-800/50 p-2 rounded">
                  <div className="text-xs text-amber-300 mb-1">Speed</div>
                  <div className="font-bold">{score > 0 ? (score / 30).toFixed(2) : 0} beans/sec</div>
                </div>
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
