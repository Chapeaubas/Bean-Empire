"use client"

import { useState, useEffect } from "react"
import { getBusinessesForRegion, formatRegionName } from "@/lib/region-businesses"
import RegionBusinessCard from "./region-business-card"
import { Button } from "@/components/ui/button"
import soundManager from "@/lib/sound-manager"
import { Globe } from "lucide-react"
import RegionTravelButton from "./region-travel-button"

interface RegionBusinessGridProps {
  activeRegion: string
  regionBusinessStates: { [key: string]: any }
  businessStates: { [key: string]: any }
  cash: number
  onBuyRegionBusiness: (businessId: string) => void
  onCollectRegionBusiness: (businessId: string) => void
  onStartRegionBusiness: (businessId: string) => void
  onShowEmpireMap: () => void
  onSetActiveRegion: (region: string) => void
  showTravelAnimation?: boolean // Add this prop
}

export default function RegionBusinessGrid(props: RegionBusinessGridProps) {
  const {
    activeRegion,
    regionBusinessStates,
    businessStates,
    cash,
    onBuyRegionBusiness,
    onCollectRegionBusiness,
    onStartRegionBusiness,
    onShowEmpireMap,
    onSetActiveRegion,
    showTravelAnimation,
  } = props
  const [mounted, setMounted] = useState(false)
  const [regionBusinesses, setRegionBusinesses] = useState<any[]>([])
  const [formattedRegionName, setFormattedRegionName] = useState("")
  const [otherRegions, setOtherRegions] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)

    try {
      // Format the region name for display
      setFormattedRegionName(formatRegionName(activeRegion))

      // Get businesses for the active region
      const businesses = getBusinessesForRegion(formatRegionName(activeRegion))
      setRegionBusinesses(businesses)

      // Get other available regions for travel buttons
      if (activeRegion === "north_america") {
        setOtherRegions(["europe"])
      } else if (activeRegion === "europe") {
        setOtherRegions(["north_america"])
      } else {
        setOtherRegions(["north_america", "europe"])
      }
    } catch (error) {
      console.error("Error loading region businesses:", error)
      setRegionBusinesses([])
      setOtherRegions([])
    }

    return () => window.removeEventListener("resize", checkMobile)
  }, [activeRegion])

  if (!mounted) return null

  // Check if any businesses are owned in this region
  const hasOwnedBusinesses = regionBusinesses.some((business) => regionBusinessStates[business.id]?.owned === true)

  // Check if Europe is unlocked (for travel button)
  const isEuropeUnlocked =
    businessStates["coffee_roastery"]?.owned >= 30 &&
    businessStates["coffee_plantation"]?.owned >= 15 &&
    businessStates["coffee_factory"]?.owned >= 5

  // If no businesses are owned, show a message
  if (!hasOwnedBusinesses) {
    return (
      <div className="mt-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
          <h2 className="text-base sm:text-xl font-bold text-amber-800 border-b border-amber-300 pb-1 flex items-center">
            <Globe className="h-4 w-4 mr-1 text-amber-700" />
            {isMobile ? formattedRegionName : `${formattedRegionName} Region`}
          </h2>

          <div className="flex space-x-2 self-end">
            {otherRegions.map((region) => {
              // Only show Europe if it's unlocked
              if (region === "europe" && !isEuropeUnlocked) return null

              return (
                <RegionTravelButton
                  key={region}
                  region={region}
                  onClick={() => {
                    soundManager.play("click")
                    onSetActiveRegion(region)
                  }}
                  disabled={showTravelAnimation} // Pass the disabled state
                />
              )
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => {
              soundManager.play("click")
              onShowEmpireMap()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-xs py-1 h-auto"
          >
            <Globe className="h-3 w-3 mr-1" />
            Empire Map
          </Button>
        </div>
      </div>
    )
  }

  // Filter to only show owned businesses
  const ownedBusinesses = regionBusinesses.filter((business) => regionBusinessStates[business.id]?.owned === true)

  return (
    <div className="mt-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h2 className="text-base sm:text-xl font-bold text-amber-800 border-b border-amber-300 pb-1 flex items-center">
          <Globe className="h-4 w-4 mr-1 text-amber-700" />
          {isMobile ? formattedRegionName : `${formattedRegionName} Region`}
        </h2>

        <div className="flex space-x-2 self-end">
          {otherRegions.map((region) => {
            // Only show Europe if it's unlocked
            if (region === "europe" && !isEuropeUnlocked) return null

            return (
              <RegionTravelButton
                key={region}
                region={region}
                onClick={() => {
                  soundManager.play("click")
                  onSetActiveRegion(region)
                }}
                disabled={showTravelAnimation} // Pass the disabled state
              />
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {ownedBusinesses.map((business) => (
          <RegionBusinessCard
            key={business.id}
            business={business}
            owned={regionBusinessStates[business.id]?.owned === true}
            progress={regionBusinessStates[business.id]?.progress || 0}
            isRunning={
              regionBusinessStates[business.id]?.progress > 0 && regionBusinessStates[business.id]?.progress < 100
            }
            isReady={regionBusinessStates[business.id]?.progress >= 100}
            onCollect={() => onCollectRegionBusiness(business.id)}
            onStart={() => onStartRegionBusiness(business.id)}
          />
        ))}
      </div>
    </div>
  )
}
