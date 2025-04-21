"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Plane } from "lucide-react"
import { formatRegionName } from "@/lib/region-businesses"

interface RegionTravelAnimationProps {
  fromRegion: string
  toRegion: string
  onComplete: () => void
}

export default function RegionTravelAnimation({ fromRegion, toRegion, onComplete }: RegionTravelAnimationProps) {
  const fromRegionName = formatRegionName(fromRegion)
  const toRegionName = formatRegionName(toRegion)

  // Auto-complete after animation
  // Fix the issue with the animation completion
  // The problem is that the animation might be triggering multiple times or not properly completing

  // Make sure the onComplete callback is only called once
  // Add a state to track if the animation has completed

  // Update the useEffect to ensure it only triggers once
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // 3 seconds for the animation

    // Return cleanup function to prevent multiple triggers
    return () => {
      clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-3xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Traveling from {fromRegionName} to {toRegionName}
        </motion.div>

        <div className="relative w-full h-20">
          <motion.div
            className="absolute text-white flex items-center"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <Plane className="h-16 w-16 text-blue-400" />
          </motion.div>
        </div>

        <motion.div
          className="text-xl text-amber-300 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 1, duration: 2, times: [0, 0.5, 1] }}
        >
          Expanding your coffee empire...
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
