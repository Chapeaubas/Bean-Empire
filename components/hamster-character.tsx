"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface HamsterCharacterProps {
  animation: "idle" | "working" | "happy" | "sad"
}

export default function HamsterCharacter({ animation }: HamsterCharacterProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const getHamsterImage = () => {
    const colors = ["amber", "orange", "yellow", "amber"]
    const color = colors[frame]

    return (
      <motion.div
        className="relative"
        animate={{
          y: animation === "working" ? [0, -10, 0] : 0,
          rotate: animation === "happy" ? [0, -5, 5, -5, 0] : 0,
          scale: animation === "sad" ? [1, 0.95, 1] : 1,
        }}
        transition={{
          duration: animation === "working" ? 0.5 : 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className={`w-36 h-36 sm:w-48 sm:h-48 bg-${color}-200 rounded-full relative overflow-hidden`}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    )
  }

  return <>{getHamsterImage()}</>
}
