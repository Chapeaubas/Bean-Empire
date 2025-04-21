"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { X, Info, Globe } from "lucide-react"
import soundManager from "@/lib/sound-manager"

interface EmpireMapModalProps {
  show: boolean
  onClose: () => void
  onSetActiveRegion: (region: string) => void
  businessStates: { [key: string]: any }
  regionBusinessStates: { [key: string]: any }
  cash: number
  totalBusinessesOwned?: number
  lifetimeEarnings?: number
  prestigeLevel?: number
  activeRegion: string
  onBuyRegionBusiness?: (businessId: string) => void
}

export default function EmpireMapModal({
  show,
  onClose,
  onSetActiveRegion,
  businessStates,
  regionBusinessStates,
  cash,
  totalBusinessesOwned,
  lifetimeEarnings,
  prestigeLevel,
  activeRegion,
  onBuyRegionBusiness,
}: EmpireMapModalProps) {
  const [activeTab, setActiveTab] = useState("map")
  const [isMobile, setIsMobile] = useState(false)
  const [isExtraSmall, setIsExtraSmall] = useState(false)
  const [mapImageError, setMapImageError] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsExtraSmall(window.innerWidth < 375)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Check if Europe is unlocked
  const isEuropeUnlocked =
    businessStates["coffee_roastery"]?.owned >= 30 &&
    businessStates["coffee_plantation"]?.owned >= 15 &&
    businessStates["coffee_factory"]?.owned >= 5

  // Check if any businesses are owned in a region
  const hasBusinessesInRegion = (region: string) => {
    const regionPrefix = region === "north_america" ? "na_" : region === "europe" ? "eu_" : ""
    return Object.keys(regionBusinessStates).some(
      (key) => key.startsWith(regionPrefix) && regionBusinessStates[key]?.owned === true,
    )
  }

  const hasNorthAmericanBusinesses = hasBusinessesInRegion("north_america")
  const hasEuropeanBusinesses = hasBusinessesInRegion("europe")

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col border-4 border-amber-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 sm:p-4">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-amber-100 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-amber-300" />
              Bean Empire World Map
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-amber-200 hover:text-amber-100 hover:bg-amber-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-2 h-8">
              <TabsTrigger value="map" className="text-xs sm:text-sm">
                World Map
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs sm:text-sm">
                Region Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-0">
              <div
                className="relative w-full bg-blue-50 rounded-md overflow-hidden"
                style={{ height: isMobile ? "180px" : "300px" }}
              >
                {/* World Map Background */}
                <div className={`absolute inset-0 ${mapImageError ? "bg-blue-200" : "bg-blue-100"}`}>
                  {!mapImageError && (
                    <img
                      src="/blue-continent-silhouette.png"
                      alt="World Map"
                      className="w-full h-full object-cover opacity-30"
                      onError={(e) => {
                        setMapImageError(true)
                        console.log("Map image failed to load")
                      }}
                    />
                  )}
                </div>

                {/* North America Region */}
                <div
                  className={`absolute cursor-pointer rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[30%] left-[25%] h-10 w-10"
                         : "top-[30%] left-[30%] h-12 w-12"
                       : "top-[35%] left-[25%] h-16 w-16"
                   }
                   ${hasNorthAmericanBusinesses ? "bg-green-500" : "bg-amber-500"} 
                   bg-opacity-70 hover:bg-opacity-100 transition-all`}
                  onClick={() => {
                    soundManager.play("click")
                    onSetActiveRegion("north_america")
                    onClose()
                  }}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "NA" : "North") : "North America"}
                    </div>
                    {!isMobile && (
                      <div className="text-[10px] text-white">
                        {hasNorthAmericanBusinesses ? "Active" : "Available"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Europe Region */}
                <div
                  className={`absolute cursor-pointer rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[30%] left-[55%] h-10 w-10"
                         : "top-[30%] left-[60%] h-12 w-12"
                       : "top-[30%] left-[55%] h-16 w-16"
                   }
                   ${!isEuropeUnlocked ? "bg-gray-500" : hasEuropeanBusinesses ? "bg-green-500" : "bg-amber-500"} 
                   bg-opacity-70 hover:bg-opacity-100 transition-all`}
                  onClick={() => {
                    if (isEuropeUnlocked) {
                      soundManager.play("click")
                      onSetActiveRegion("europe")
                      onClose()
                    } else {
                      soundManager.play("error")
                    }
                  }}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "EU" : "Europe") : "Europe"}
                    </div>
                    {!isMobile && (
                      <div className="text-[10px] text-white">
                        {!isEuropeUnlocked ? "Locked" : hasEuropeanBusinesses ? "Active" : "Available"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Asia Region - Coming Soon */}
                <div
                  className={`absolute cursor-not-allowed rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[40%] left-[75%] h-10 w-10"
                         : "top-[40%] left-[80%] h-12 w-12"
                       : "top-[40%] left-[75%] h-16 w-16"
                   }
                   bg-gray-500 bg-opacity-70 transition-all`}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "AS" : "Asia") : "Asia"}
                    </div>
                    {!isMobile && <div className="text-[10px] text-white">Coming Soon</div>}
                  </div>
                </div>

                {/* Africa Region - Coming Soon */}
                <div
                  className={`absolute cursor-not-allowed rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[60%] left-[55%] h-10 w-10"
                         : "top-[60%] left-[60%] h-12 w-12"
                       : "top-[60%] left-[55%] h-16 w-16"
                   }
                   bg-gray-500 bg-opacity-70 transition-all`}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "AF" : "Africa") : "Africa"}
                    </div>
                    {!isMobile && <div className="text-[10px] text-white">Coming Soon</div>}
                  </div>
                </div>

                {/* South America Region - Coming Soon */}
                <div
                  className={`absolute cursor-not-allowed rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[70%] left-[35%] h-10 w-10"
                         : "top-[70%] left-[40%] h-12 w-12"
                       : "top-[70%] left-[35%] h-16 w-16"
                   }
                   bg-gray-500 bg-opacity-70 transition-all`}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "SA" : "S.Am") : "South America"}
                    </div>
                    {!isMobile && <div className="text-[10px] text-white">Coming Soon</div>}
                  </div>
                </div>

                {/* Australia Region - Coming Soon */}
                <div
                  className={`absolute cursor-not-allowed rounded-full flex items-center justify-center
                   ${
                     isMobile
                       ? isExtraSmall
                         ? "top-[70%] left-[85%] h-10 w-10"
                         : "top-[70%] left-[85%] h-12 w-12"
                       : "top-[70%] left-[85%] h-16 w-16"
                   }
                   bg-gray-500 bg-opacity-70 transition-all`}
                >
                  <div className="text-center">
                    <div className={`font-bold text-white ${isMobile ? "text-[8px]" : "text-xs"}`}>
                      {isMobile ? (isExtraSmall ? "AU" : "Aus") : "Australia"}
                    </div>
                    {!isMobile && <div className="text-[10px] text-white">Coming Soon</div>}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-center text-amber-200">
                Click on a region to travel there and manage your businesses
              </div>
            </TabsContent>

            <TabsContent value="info" className="mt-0">
              <div className="space-y-2 text-sm">
                <div className="bg-amber-700/50 p-2 rounded-md">
                  <h3 className="font-bold text-amber-100 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-amber-300" />
                    North America
                  </h3>
                  <p className="text-xs mt-1 text-amber-200">
                    Your home region. Coffee shops here generate steady income and are easy to manage.
                  </p>
                  <div className="mt-1 text-xs text-amber-200">
                    <span className="font-semibold">Status:</span>{" "}
                    {hasNorthAmericanBusinesses ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-amber-300">Available</span>
                    )}
                  </div>
                </div>

                <div className="bg-amber-700/50 p-2 rounded-md">
                  <h3 className="font-bold text-amber-100 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-amber-300" />
                    Europe
                  </h3>
                  <p className="text-xs mt-1 text-amber-200">
                    European coffee markets offer higher profits but require more investment.
                  </p>
                  <div className="mt-1 text-xs text-amber-200">
                    <span className="font-semibold">Status:</span>{" "}
                    {!isEuropeUnlocked ? (
                      <span className="text-gray-400">
                        Locked (Need 30 Coffee Roasteries, 15 Plantations, 5 Factories)
                      </span>
                    ) : hasEuropeanBusinesses ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-amber-300">Available</span>
                    )}
                  </div>
                </div>

                <div className="bg-amber-700/30 p-2 rounded-md">
                  <h3 className="font-bold text-amber-100 flex items-center">
                    <Info className="h-4 w-4 mr-1 text-amber-300" />
                    Coming Soon
                  </h3>
                  <p className="text-xs mt-1 text-amber-200">
                    More regions will be available in future updates. Expand your coffee empire across the globe!
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
