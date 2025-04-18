"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { X, Clock, Coffee, Check, AlertTriangle, Undo, Save } from "lucide-react"

interface LatteArtGameProps {
  onComplete: (score: number, reward: number) => void
  onClose: () => void
  difficultyLevel?: number
  baseReward?: number
}

type Point = {
  x: number
  y: number
  pressure: number
}

type Pattern = {
  id: string
  name: string
  difficulty: number
  reward: number
  image: string
}

export default function LatteArtGame({
  onComplete,
  onClose,
  difficultyLevel = 1,
  baseReward = 200,
}: LatteArtGameProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds game
  const [score, setScore] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)
  const [points, setPoints] = useState<Point[]>([])
  const [undoHistory, setUndoHistory] = useState<Point[][]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const patternCanvasRef = useRef<HTMLCanvasElement>(null)

  // Latte art patterns - defined outside of render to avoid recreation
  const patterns = useRef<Pattern[]>([
    {
      id: "heart",
      name: "Heart",
      difficulty: 1,
      reward: baseReward,
      image: "/foamy-heart.png",
    },
    {
      id: "leaf",
      name: "Rosetta Leaf",
      difficulty: 2,
      reward: baseReward * 1.5,
      image: "/foamy-leaf.png",
    },
    {
      id: "swan",
      name: "Swan",
      difficulty: 3,
      reward: baseReward * 2,
      image: "/latte-swan-closeup.png",
    },
  ]).current

  // Initialize game
  const startGame = useCallback(() => {
    setGameState("playing")
    setTimeLeft(60)
    setScore(0)
    setPoints([])
    setUndoHistory([])

    // Select a pattern based on difficulty
    const availablePatterns = patterns.filter((p) => p.difficulty <= difficultyLevel)
    const randomIndex = Math.floor(Math.random() * availablePatterns.length)
    setCurrentPattern(availablePatterns[randomIndex])
  }, [difficultyLevel, patterns])

  const calculateScore = useCallback(() => {
    // This is a simplified scoring algorithm
    // In a real game, you would compare the drawn pattern to the target pattern
    const coverage = Math.min(100, (points.length / 100) * 25) // Max 25 points for coverage
    const smoothness = Math.min(100, undoHistory.length > 0 ? 25 * (1 / undoHistory.length) * 10 : 25) // Max 25 points for smoothness
    const complexity = Math.min(100, points.length > 50 ? 25 : (points.length / 50) * 25) // Max 25 points for complexity
    const timeBonus = Math.min(100, (timeLeft / 60) * 25) // Max 25 points for time bonus

    return Math.floor(coverage + smoothness + complexity + timeBonus)
  }, [points.length, undoHistory.length, timeLeft])

  const endGame = useCallback(() => {
    setGameState("complete")
    // Calculate score based on points drawn and pattern complexity
    const finalScore = calculateScore()
    setScore(finalScore)
    // Calculate reward based on score and difficulty
    const reward = Math.floor((currentPattern?.reward || baseReward) * (finalScore / 100) * (difficultyLevel || 1))
    onComplete(finalScore, reward)
  }, [baseReward, calculateScore, currentPattern?.reward, difficultyLevel, onComplete])

  // Handle timer
  useEffect(() => {
    if (gameState !== "playing") return

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

    return () => clearInterval(timer)
  }, [gameState, endGame])

  // Draw pattern image when it changes
  useEffect(() => {
    if (!currentPattern || !patternCanvasRef.current) return

    const patternImg = new Image()
    patternImg.crossOrigin = "anonymous"
    patternImg.src = currentPattern.image
    patternImg.onload = () => {
      const ctx = patternCanvasRef.current?.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, 300, 300)
        ctx.globalAlpha = 0.3
        ctx.drawImage(patternImg, 0, 0, 300, 300)
      }
    }
  }, [currentPattern])

  // Draw on canvas when points change
  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, 300, 300)

    // Draw cup background
    ctx.fillStyle = "#8B4513" // Brown color for coffee
    ctx.beginPath()
    ctx.arc(150, 150, 140, 0, Math.PI * 2)
    ctx.fill()

    // Draw milk foam background
    ctx.fillStyle = "#F5DEB3" // Wheat color for milk foam
    ctx.beginPath()
    ctx.arc(150, 150, 130, 0, Math.PI * 2)
    ctx.fill()

    // Draw the latte art
    if (points.length > 1) {
      ctx.strokeStyle = "#8B4513" // Brown color for the art
      ctx.lineWidth = 5
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1]
        const p2 = points[i]

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }, [points])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newPoint = { x, y, pressure: 1 }

    setPoints((prev) => [...prev, newPoint])
    // Save current state for undo
    setUndoHistory((prev) => [...prev, [...points]])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || gameState !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newPoint = { x, y, pressure: 1 }

    setPoints((prev) => [...prev, newPoint])
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleUndo = () => {
    if (undoHistory.length === 0) return

    const lastState = undoHistory[undoHistory.length - 1]
    setPoints(lastState)
    setUndoHistory((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setUndoHistory((prev) => [...prev, [...points]])
    setPoints([])
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-300" />
            Latte Art Challenge
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === "intro" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              <Coffee className="h-16 w-16 mx-auto mb-4 text-amber-300" />
              <h3 className="text-xl font-bold mb-2">Create Beautiful Latte Art!</h3>
              <p className="text-amber-200 mb-4">
                Show off your barista skills by creating latte art patterns. The more accurate and complex your design,
                the higher your score!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {patterns.slice(0, 3).map((pattern) => (
                <div
                  key={pattern.id}
                  className={`bg-amber-700/50 p-3 rounded-lg text-center ${
                    pattern.difficulty > difficultyLevel ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-amber-600">
                    <img
                      src={pattern.image || "/placeholder.svg"}
                      alt={pattern.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <h4 className="font-bold">{pattern.name}</h4>
                  <p className="text-xs">
                    Difficulty: {Array(pattern.difficulty).fill("★").join("")}
                    {Array(3 - pattern.difficulty)
                      .fill("☆")
                      .join("")}
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
                <li>You have 60 seconds to create your latte art</li>
                <li>Draw by clicking and dragging on the cup</li>
                <li>Use the undo button if you make a mistake</li>
                <li>Your score is based on accuracy, complexity, and time remaining</li>
              </ul>
            </div>

            <Button
              variant="default"
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Start Creating!
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
                <span className="mr-4">Pattern: {currentPattern?.name}</span>
                <span>Difficulty: {currentPattern && Array(currentPattern.difficulty).fill("★").join("")}</span>
              </div>
            </div>

            <div className="flex-1 relative p-4 flex justify-center">
              <div className="relative">
                {/* Pattern reference (semi-transparent) */}
                <canvas
                  ref={patternCanvasRef}
                  width={300}
                  height={300}
                  className="absolute top-0 left-0 z-10 pointer-events-none"
                />

                {/* Drawing canvas */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  className="border-4 border-amber-700 rounded-full bg-amber-200 cursor-crosshair z-20"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>

            <div className="p-4 bg-amber-900/50 border-t border-amber-700 flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-300 hover:bg-amber-800"
                  onClick={handleUndo}
                  disabled={undoHistory.length === 0}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-300 hover:bg-amber-800"
                  onClick={handleClear}
                  disabled={points.length === 0}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              <Button
                variant="default"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                onClick={endGame}
              >
                <Save className="h-4 w-4 mr-1" />
                Finish Art
              </Button>
            </div>
          </div>
        )}

        {gameState === "complete" && (
          <div className="flex-1 overflow-auto p-6 text-center">
            <div className="mb-6">
              {score > 70 ? (
                <>
                  <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold mb-2">Beautiful Latte Art!</h3>
                  <p className="text-amber-200">Your customers will be impressed with your artistic skills!</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-2xl font-bold mb-2">Nice Try!</h3>
                  <p className="text-amber-200">With more practice, you'll create stunning latte art!</p>
                </>
              )}
            </div>

            <div className="mb-4">
              <h4 className="font-bold">Final Score: {score}/100</h4>
              <h4 className="font-bold">
                Reward: {formatCurrency(Math.floor((currentPattern?.reward || baseReward) * (score / 100)))}
              </h4>
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
