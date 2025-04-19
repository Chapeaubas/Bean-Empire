"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PixelButton from "./pixel-button"
import soundManager from "@/lib/sound-manager"

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const [showScreen, setShowScreen] = useState(true)
  const [showComic, setShowComic] = useState(false)
  const [hasSeenComic, setHasSeenComic] = useState(false)

  // Check if user has seen the comic before with error handling
  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        const comicSeen = localStorage.getItem("comicSeen")
        if (comicSeen) {
          setHasSeenComic(true)
        }
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
      // Default to not showing the comic if localStorage fails
      setHasSeenComic(false)
    }
  }, [])

  const handleStart = useCallback(() => {
    // Try to play any pending music when user interacts
    try {
      soundManager.tryPlayPendingMusic()
    } catch (error) {
      console.error("Error playing pending music:", error)
    }

    // If they haven't seen the comic, show it first
    if (!hasSeenComic) {
      setShowComic(true)
      try {
        localStorage.setItem("comicSeen", "true")
      } catch (error) {
        console.error("Error setting localStorage:", error)
      }
    } else {
      // Otherwise go straight to the game
      setShowScreen(false)
      onStart()
    }
  }, [hasSeenComic, onStart])

  const handleFinishComic = useCallback(() => {
    setShowComic(false)
    setShowScreen(false)
    onStart()
  }, [onStart])

  return (
    <AnimatePresence>
      {showScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
        >
          {showComic ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center max-w-2xl w-full p-4"
            >
              <div className="relative w-full aspect-[3/4] mb-6">
                <Image
                  src="/images/comic1.png"
                  alt="$GRIND Comic"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  className="rounded-lg shadow-2xl"
                  onError={(e) => {
                    console.error("Error loading comic image:", e)
                    // Fallback if image fails to load
                    const imgElement = e.currentTarget as HTMLImageElement
                    imgElement.src = "/superhero-cityscape.png"
                    imgElement.alt = "Comic (Failed to load)"
                  }}
                />
              </div>
              <PixelButton
                text="Let's Start Grinding!"
                color="amber"
                onClick={handleFinishComic}
                className="text-xl px-8 py-4"
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                className="relative w-full h-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Image
                  src="/Startscreen1.png"
                  alt="$GRIND: Bean Hustle"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  className="pixel-art"
                  onError={(e) => {
                    console.error("Error loading start screen image:", e)
                    // Fallback if image fails to load
                    const imgElement = e.currentTarget as HTMLImageElement
                    imgElement.src = "/fantasy-adventure-start.png"
                    imgElement.alt = "Game Start Screen (Failed to load)"
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-end pb-12"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
              >
                <PixelButton text="START GAME ✨" color="amber" onClick={handleStart} className="text-xl px-8 py-4" />
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
