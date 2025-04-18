"use client"

import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface FloatingTextProps {
  amount: number
}

export default function FloatingText({ amount }: FloatingTextProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-400 font-bold text-lg z-50 px-2 py-1 bg-green-900/30 rounded-lg"
        initial={{ opacity: 0, y: 0, scale: 0.5 }}
        animate={{ opacity: 1, y: -50, scale: 1.2 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        +{formatCurrency(amount)}
      </motion.div>
    </div>
  )
}
