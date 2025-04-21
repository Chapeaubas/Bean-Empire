"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plane } from "lucide-react"
import { formatRegionName } from "@/lib/region-businesses"

interface RegionTravelButtonProps {
  region: string
  onClick: () => void
  disabled?: boolean
}

export default function RegionTravelButton({ region, onClick, disabled = false }: RegionTravelButtonProps) {
  const formattedRegion = formatRegionName(region)

  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-1.5 h-auto text-xs bg-blue-600 hover:bg-blue-700 flex items-center gap-1`}
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="mr-1 sm:mr-2 flex-shrink-0"
        >
          <Plane className="h-3 w-3 sm:h-4 sm:w-4" />
        </motion.div>
        <span className="truncate">Travel to {formattedRegion}</span>
      </Button>
    </motion.div>
  )
}
