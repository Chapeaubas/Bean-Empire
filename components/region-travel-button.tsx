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
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
        disabled={disabled}
      >
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="mr-2"
        >
          <Plane className="h-4 w-4" />
        </motion.div>
        Travel to {formattedRegion}
      </Button>
    </motion.div>
  )
}
