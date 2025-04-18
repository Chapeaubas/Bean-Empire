"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatCurrency } from "@/lib/utils"
import { Award } from "lucide-react"

interface ManagerCollectionIndicatorProps {
  collections: {
    businessId: string
    amount: number
    timestamp: number
    managerId?: string
  }[]
  maxDisplayed?: number
  duration?: number
}

export default function ManagerCollectionIndicator({
  collections,
  maxDisplayed = 3,
  duration = 2000,
}: ManagerCollectionIndicatorProps) {
  const [visibleCollections, setVisibleCollections] = useState<
    {
      id: string
      businessId: string
      amount: number
      timestamp: number
    }[]
  >([])

  // Process collections and manage which ones to display
  useEffect(() => {
    // Filter to recent collections only (within the last 5 seconds)
    const now = Date.now()
    const recentCollections = collections
      .filter((c) => now - c.timestamp < 5000)
      .map((c) => ({
        id: `${c.businessId}-${c.timestamp}`,
        businessId: c.businessId,
        amount: c.amount,
        timestamp: c.timestamp,
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxDisplayed)

    setVisibleCollections(recentCollections)

    // Clean up old collections
    const timer = setTimeout(() => {
      setVisibleCollections((prev) => prev.filter((c) => now - c.timestamp < duration))
    }, duration)

    return () => clearTimeout(timer)
  }, [collections, maxDisplayed, duration])

  if (visibleCollections.length === 0) return null

  return (
    <div className="fixed bottom-20 right-4 z-40 pointer-events-none">
      <AnimatePresence>
        {visibleCollections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              delay: index * 0.1,
            }}
            className="bg-green-800/80 border border-green-500 rounded-lg p-2 mb-2 text-white shadow-lg flex items-center"
          >
            <Award className="h-4 w-4 mr-2 text-green-300" />
            <span className="text-sm">Manager collected</span>
            <span className="ml-2 font-bold text-green-300">{formatCurrency(collection.amount)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
