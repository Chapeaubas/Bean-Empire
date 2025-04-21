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

  useEffect(() => {
    setMounted(true)
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
      <div className="mt-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-800 border-b border-amber-300 pb-2 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-amber-700" />
            {formattedRegionName} Region
          </h2>

          <div className="flex space-x-2">
            {otherRegions.map((region) => {
              // Only show Europe if it's unlocked
              if (region === "europe" && !isEuropeUnlocked) return null

              return (
                <RegionTravelButton
                  key={region}
                  region={region}
                  onClick={() => {
                    soundManager.play("click")
                    console.log(`Travel button clicked for region: ${region}`) // Add this line
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Globe className="h-4 w-4 mr-2" />
            Empire Map
          </Button>
        </div>
      </div>
    )
  }

  // Filter to only show owned businesses
  const ownedBusinesses = regionBusinesses.filter((business) => regionBusinessStates[business.id]?.owned === true)

  return (
    <div className="mt-8 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-800 border-b border-amber-300 pb-2 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-amber-700" />
          {formattedRegionName} Region
        </h2>

        <div className="flex space-x-2">
          {otherRegions.map((region) => {
            // Only show Europe if it's unlocked
            if (region === "europe" && !isEuropeUnlocked) return null

            return (
              <RegionTravelButton
                key={region}
                region={region}
                onClick={() => {
                  soundManager.play("click")
                  console.log(`Travel button clicked for region: ${region}`) // Add this line
                  onSetActiveRegion(region)
                }}
                disabled={showTravelAnimation} // Pass the disabled state
              />
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
