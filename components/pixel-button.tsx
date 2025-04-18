"use client"

import type { ButtonHTMLAttributes } from "react"
import { motion } from "framer-motion"

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  color?: "pink" | "amber" | "green"
}

export default function PixelButton({ text, color = "pink", className, ...props }: PixelButtonProps) {
  const baseColors = {
    pink: "bg-pink-500 hover:bg-pink-600 border-b-4 border-pink-700 hover:border-pink-800",
    amber: "bg-amber-500 hover:bg-amber-600 border-b-4 border-amber-700 hover:border-amber-800",
    green: "bg-green-500 hover:bg-green-600 border-b-4 border-green-700 hover:border-green-800",
  }

  return (
    <motion.button
      className={`
        ${baseColors[color]} 
        text-white font-bold py-2 px-4 sm:px-6 rounded 
        transition-colors duration-200 
        pixel-art-container
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95, y: 4, borderBottomWidth: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      <div className="uppercase tracking-wider text-lg sm:text-base">{text}</div>
    </motion.button>
  )
}
