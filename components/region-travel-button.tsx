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
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640

  return (
    <motion.div whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }}>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`px-1.5 py-1 h-auto text-xs bg-blue-600 hover:bg-blue-700 flex items-center gap-1`}
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="flex-shrink-0"
        >
          <Plane className="h-3 w-3" />
        </motion.div>
        <span className="truncate">
          {isMobile ? `To ${formattedRegion.split(" ")[0]}` : `Travel to ${formattedRegion}`}
        </span>
      </Button>
    </motion.div>
  )
}
