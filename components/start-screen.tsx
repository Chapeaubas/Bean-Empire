"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PixelButton from "./pixel-button"

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const [showScreen, setShowScreen] = useState(true)

  const handleStart = () => {
    setShowScreen(false)
    onStart()
  }

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
          <div className="relative w-full h-full">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
