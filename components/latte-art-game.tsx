"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface LatteArtGameProps {
  onComplete: (score: number, reward: number) => void
  onClose: () => void
  difficultyLevel?: number
  baseReward?: number
}

export default function LatteArtGame({
  onComplete,
  onClose,
  difficultyLevel = 1,
  baseReward = 100,
}: LatteArtGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [pattern, setPattern] = useState<string>("heart") // heart, leaf, or swan
  const [patternImage, setPatternImage] = useState<HTMLImageElement | null>(null)
  const [feedback, setFeedback] = useState("")
  const [showInstructions, setShowInstructions] = useState(true)
  const [drawingPoints, setDrawingPoints] = useState<{ x: number; y: number }[]>([])

  // Load pattern image
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous" // Add this to avoid CORS issues

    if (pattern === "heart") {
      img.src = "/foamy-heart.png"
    } else if (pattern === "leaf") {
      img.src = "/foamy-leaf.png"
    } else {
      img.src = "/latte-swan-closeup.png"
    }

    img.onload = () => {
      setPatternImage(img)
      drawCanvas()
    }
  }, [pattern])

  // Game timer
  useEffect(() => {
    if (showInstructions) return

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
  }, [showInstructions])

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw latte background
    ctx.fillStyle = "#D2B48C"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw pattern image as a guide (semi-transparent)
    if (patternImage) {
      ctx.globalAlpha = 0.2
      ctx.drawImage(patternImage, 0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1.0
    }

    // Draw user's art
    if (drawingPoints.length > 1) {
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y)

      for (let i = 1; i < drawingPoints.length; i++) {
        ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y)
      }

      ctx.stroke()
    }
  }, [patternImage, drawingPoints])

  // Update canvas when drawing points change
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas, drawingPoints])

  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameOver || showInstructions) return

    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e instanceof MouseEvent ? e.clientX - rect.left : e.touches[0].clientX - rect.left
    const y = e instanceof MouseEvent ? e.clientY - rect.top : e.touches[0].clientY - rect.top

    setDrawingPoints([{ x, y }])
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || gameOver || showInstructions) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e instanceof MouseEvent ? e.clientX - rect.left : e.touches[0].clientX - rect.left
    const y = e instanceof MouseEvent ? e.clientY - rect.top : e.touches[0].clientY - rect.top

    setDrawingPoints((prev) => [...prev, { x, y }])
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      calculateScore()
    }
  }

  // Calculate score based on how well the drawing matches the pattern
  const calculateScore = () => {
    if (!patternImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // This is a simplified scoring algorithm
    // In a real game, you'd use image processing to compare the drawing with the pattern

    // For now, we'll use the number of drawing points as a simple metric
    // More points = more detailed drawing = higher score
    const pointsScore = Math.min(drawingPoints.length / 10, 100)

    // Add some randomness to make it feel more realistic
    const randomFactor = 0.7 + Math.random() * 0.6 // Between 0.7 and 1.3

    // Calculate final score (0-100)
    const newScore = Math.min(Math.floor(pointsScore * randomFactor), 100)
    setScore(newScore)

    // Give feedback based on score
    if (newScore < 30) {
      setFeedback("Needs practice! Try again.")
    } else if (newScore < 60) {
      setFeedback("Not bad! Keep improving.")
    } else if (newScore < 90) {
      setFeedback("Great job! Almost perfect!")
    } else {
      setFeedback("Perfect latte art! Amazing!")
    }
  }

  // End the game
  const endGame = () => {
    setGameOver(true)

    // Calculate reward based on score and difficulty
    const reward = Math.floor((baseReward * score * difficultyLevel) / 100)

    // Delay the completion callback to show the final score
    setTimeout(() => {
      onComplete(score, reward)
    }, 2000)
  }

  // Start the game
  const startGame = () => {
    setShowInstructions(false)
    setDrawingPoints([])
    drawCanvas()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-100 rounded-lg max-w-md w-full p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-amber-900 hover:text-amber-700">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-amber-900 text-center mb-2">Latte Art Challenge</h2>

        {showInstructions ? (
          <div className="text-center">
            <p className="mb-4 text-amber-800">Create beautiful latte art by drawing on the coffee surface!</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setPattern("heart")}
                className={`p-2 rounded ${pattern === "heart" ? "bg-amber-500" : "bg-amber-300"}`}
              >
                Heart
              </button>
              <button
                onClick={() => setPattern("leaf")}
                className={`p-2 rounded ${pattern === "leaf" ? "bg-amber-500" : "bg-amber-300"}`}
              >
                Leaf
              </button>
              <button
                onClick={() => setPattern("swan")}
                className={`p-2 rounded ${pattern === "swan" ? "bg-amber-500" : "bg-amber-300"}`}
              >
                Swan
              </button>
            </div>
            <p className="mb-4 text-amber-800">Follow the faint pattern and create your masterpiece!</p>
            <Button onClick={startGame} className="bg-amber-600 hover:bg-amber-700 text-white">
              Start Challenge
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              <div className="text-amber-800">Time: {timeLeft}s</div>
              <div className="text-amber-800">Score: {score}</div>
            </div>

            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="w-full h-64 rounded-lg border-2 border-amber-700 touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />

            <div className="mt-2 text-center">
              <p className="text-amber-800">{feedback}</p>

              {gameOver && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4">
                  <p className="text-xl font-bold text-amber-900">Final Score: {score}</p>
                  <p className="text-amber-800">Reward: ${Math.floor((baseReward * score * difficultyLevel) / 100)}</p>
                </motion.div>
              )}

              {!gameOver && (
                <Button
                  onClick={() => {
                    setDrawingPoints([])
                    drawCanvas()
                  }}
                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Clear Canvas
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
