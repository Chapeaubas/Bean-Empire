"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getBusinessesForRegion,
  getAllRegions,
  formatRegionName,
  normalizeRegionName,
  isRegionUnlocked,
  getRegionRequirements,
  type RegionBusiness,
} from "@/lib/region-businesses"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import soundManager from "@/lib/sound-manager"
import { motion } from "framer-motion"
import { Check, AlertTriangle, Globe, Lock } from "lucide-react"

interface EmpireMapModalProps {
  show: boolean
  onClose: () => void
  businessStates?: { [key: string]: any }
  regionBusinessStates?: { [key: string]: any }
  totalBusinessesOwned?: number
  lifetimeEarnings?: number
  prestigeLevel?: number
  activeRegion: string
  onSetActiveRegion: (region: string) => void
  onBuyRegionBusiness: (businessId: string) => void
  cash?: number
}

export default function EmpireMapModal({
  show,
  onClose,
  businessStates = {},
  regionBusinessStates = {},
  totalBusinessesOwned = 0,
  lifetimeEarnings = 0,
  prestigeLevel = 1,
  activeRegion,
  onSetActiveRegion,
  onBuyRegionBusiness,
  cash = 0,
}: EmpireMapModalProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [regionsList, setRegionsList] = useState<string[]>([])
  const [businessesByRegion, setBusinessesByRegion] = useState<Record<string, RegionBusiness[]>>({})
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [unlockedRegions, setUnlockedRegions] = useState<Record<string, boolean>>({})
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Initialize region data safely
  useEffect(() => {
    try {
      setLoading(true)

      // Get unique regions
      const regions = getAllRegions()
      setRegionsList(regions)

      // Set selected region based on active region or default to first region
      const normalizedActiveRegion = formatRegionName(activeRegion)
      setSelectedRegion(normalizedActiveRegion || regions[0])

      // Group businesses by region
      const businessesByRegionMap: Record<string, RegionBusiness[]> = {}
      regions.forEach((region) => {
        businessesByRegionMap[region] = getBusinessesForRegion(region)
      })
      setBusinessesByRegion(businessesByRegionMap)

      // Check which regions are unlocked
      const unlocked: Record<string, boolean> = {}
      regions.forEach((region) => {
        unlocked[region] = isRegionUnlocked(region, businessStates)
      })
      setUnlockedRegions(unlocked)

      setLoading(false)
    } catch (error) {
      console.error("Error initializing region data:", error)
      // Set default values to prevent errors
      setRegionsList(["North America", "Europe", "Asia", "South America", "Africa", "Australia"])
      setSelectedRegion("North America")
      setBusinessesByRegion({
        "North America": [],
        Europe: [],
        Asia: [],
        "South America": [],
        Africa: [],
        Australia: [],
      })
      setUnlockedRegions({
        "North America": true,
        Europe: false,
        Asia: false,
        "South America": false,
        Africa: false,
        Australia: false,
      })
      setLoading(false)
    }
  }, [activeRegion, businessStates])

  // Update active region when selected region changes
  useEffect(() => {
    if (selectedRegion && selectedRegion !== activeRegion && unlockedRegions[selectedRegion]) {
      const normalizedRegion = normalizeRegionName(selectedRegion)
      onSetActiveRegion(normalizedRegion)
    }
  }, [selectedRegion, activeRegion, onSetActiveRegion, unlockedRegions])

  // Clear purchase messages after a delay
  useEffect(() => {
    if (purchaseSuccess || purchaseError) {
      const timer = setTimeout(() => {
        setPurchaseSuccess(null)
        setPurchaseError(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [purchaseSuccess, purchaseError])

  // Handle region selection
  const handleRegionSelect = (region: string) => {
    try {
      setSelectedRegion(region)

      // Check if region is unlocked
      if (!unlockedRegions[region]) {
        soundManager.play("fail")
        setPurchaseError(`${region} is locked. Complete the requirements to unlock it.`)
        return
      }

      soundManager.play("click")
    } catch (error) {
      console.error("Error selecting region:", error)
    }
  }

  // Handle business purchase
  const handleBuyBusiness = (business: RegionBusiness) => {
    try {
      // Check if already owned
      if (regionBusinessStates[business.id]?.owned) {
        setPurchaseError(`You already own ${business.name}`)
        return
      }

      // Check if player has enough cash
      if (cash < business.cost) {
        setPurchaseError(`Not enough cash to buy ${business.name}`)
        return
      }

      // Play buy sound
      soundManager.play("buy")

      // Buy the business
      onBuyRegionBusiness(business.id)

      // Show success message
      setPurchaseSuccess(`Successfully purchased ${business.name}!`)
    } catch (error) {
      console.error("Error buying business:", error)
      setPurchaseError("Failed to purchase business")
    }
  }

  // Check if a business is owned
  const isBusinessOwned = (businessId: string) => {
    return regionBusinessStates[businessId]?.owned === true
  }

  // Get the number of businesses owned in a region
  const getOwnedBusinessesInRegion = (region: string) => {
    try {
      const businesses = getBusinessesForRegion(region)
      return businesses.filter((business) => isBusinessOwned(business.id)).length
    } catch (error) {
      console.error(`Error getting owned businesses in ${region}:`, error)
      return 0
    }
  }

  // Render the requirements for a region
  const renderRegionRequirements = (region: string) => {
    const requirements = getRegionRequirements(region)
    if (!requirements) return null

    return (
      <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-4 mb-4">
        <div className="flex items-start mb-2">
          <Lock className="h-5 w-5 mr-2 text-amber-700 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-900">Region Locked: {region}</h3>
            <p className="text-sm text-amber-700">{requirements.description}</p>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="font-semibold text-amber-800 mb-2">Requirements to Unlock:</h4>
          <ul className="space-y-2">
            {requirements.requirements.map((req, index) => {
              const current = businessStates[req.businessId]?.owned || 0
              const isComplete = current >= req.count
              const progressPercent = Math.min(100, Math.floor((current / req.count) * 100))

              return (
                <li key={index} className="flex flex-col">
                  <div className="flex justify-between text-sm">
                    <span className={isComplete ? "text-green-700" : "text-amber-700"}>
                      {req.name}: {current}/{req.count}
                    </span>
                    <span className={isComplete ? "text-green-700 font-bold" : "text-amber-700"}>
                      {isComplete ? "Complete" : `${progressPercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 rounded-full h-2 mt-1">
                    <div
                      className={`${isComplete ? "bg-green-500" : "bg-amber-500"} h-2 rounded-full`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

  // Render region tooltip
  const renderRegionTooltip = (region: string) => {
    if (region !== hoveredRegion || unlockedRegions[region]) return null

    const requirements = getRegionRequirements(region)
    if (!requirements) return null

    return (
      <div
        className="absolute z-10 bg-white/90 border-2 border-amber-400 rounded-lg p-3 shadow-lg w-64 text-left"
        style={{
          top: getRegionPosition(region).top as string,
          left: `calc(${getRegionPosition(region).left as string} + 30px)`,
        }}
      >
        <h4 className="font-bold text-amber-900 mb-1 flex items-center">
          <Lock className="h-4 w-4 mr-1 text-amber-700" />
          {region} Requirements:
        </h4>
        <ul className="space-y-1 text-xs">
          {requirements.requirements.map((req, index) => {
            const current = businessStates[req.businessId]?.owned || 0
            const isComplete = current >= req.count

            return (
              <li key={index} className="flex justify-between">
                <span className={isComplete ? "text-green-700" : "text-amber-700"}>{req.name}:</span>
                <span className={isComplete ? "text-green-700 font-bold" : "text-amber-700"}>
                  {current}/{req.count}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-amber-900 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-amber-700" />
            Bean Empire World Map
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          <>
            {/* Purchase notifications */}
            {purchaseSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center"
              >
                <Check className="h-5 w-5 mr-2 text-green-500" />
                {purchaseSuccess}
              </motion.div>
            )}

            {purchaseError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center"
              >
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                {purchaseError}
              </motion.div>
            )}

            <div className="relative w-full h-[300px] bg-blue-100 rounded-lg overflow-hidden mb-4">
              <Image
                src="/blue-continent-silhouette.png"
                alt="World Map"
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.backgroundColor = "#90cdf4"
                  target.style.display = "block"
                  target.alt = "World Map (Failed to load)"
                }}
              />
              {regionsList.map((region) => {
                const ownedCount = getOwnedBusinessesInRegion(region)
                const totalCount = getBusinessesForRegion(region).length
                const isActive = selectedRegion === region
                const isUnlocked = unlockedRegions[region]

                return (
                  <div key={region} className="absolute" style={getRegionPosition(region)}>
                    <button
                      className={`transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full 
                        ${isActive ? "bg-amber-500" : isUnlocked ? "bg-amber-300" : "bg-gray-400"} 
                        hover:bg-amber-400 transition-colors relative`}
                      onClick={() => handleRegionSelect(region)}
                      onMouseEnter={() => setHoveredRegion(region)}
                      onMouseLeave={() => setHoveredRegion(null)}
                    >
                      <span className="sr-only">{region}</span>

                      {/* Lock icon for locked regions */}
                      {!isUnlocked && (
                        <Lock className="absolute -top-3 -right-3 h-4 w-4 text-red-500 bg-white rounded-full p-0.5" />
                      )}

                      {/* Badge showing owned/total businesses */}
                      {ownedCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {ownedCount}
                        </span>
                      )}
                    </button>

                    {/* Region name label */}
                    <div className="absolute top-6 left-0 transform -translate-x-1/2 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold ${isUnlocked ? "bg-white/80" : "bg-gray-200/80"} px-2 py-1 rounded shadow`}
                      >
                        {region}
                      </span>
                    </div>

                    {/* Region tooltip with requirements */}
                    {renderRegionTooltip(region)}
                  </div>
                )
              })}
            </div>

            <Tabs defaultValue={selectedRegion} value={selectedRegion} onValueChange={setSelectedRegion}>
              <TabsList className="w-full mb-4">
                {regionsList.map((region) => {
                  const ownedCount = getOwnedBusinessesInRegion(region)
                  const totalCount = getBusinessesForRegion(region).length
                  const isUnlocked = unlockedRegions[region]

                  return (
                    <TabsTrigger
                      key={region}
                      value={region}
                      className={`flex-1 ${!isUnlocked ? "opacity-70" : ""}`}
                      disabled={!isUnlocked}
                    >
                      {region}
                      {!isUnlocked && <Lock className="ml-1 h-3 w-3" />}
                      {ownedCount > 0 && (
                        <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                          {ownedCount}/{totalCount}
                        </span>
                      )}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {regionsList.map((region) => (
                <TabsContent key={region} value={region} className="mt-0">
                  {/* Show requirements if region is locked */}
                  {!unlockedRegions[region] && renderRegionRequirements(region)}

                  {/* Show businesses if region is unlocked */}
                  {unlockedRegions[region] && (
                    <>
                      {region === "North America" ? (
                        <motion.div
                          className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="text-xl font-bold text-amber-900 mb-4">The Coffee Journey in North America</h3>

                          <div className="prose prose-amber">
                            <p className="mb-3">
                              Coffee first arrived in North America in the mid-1600s, when the British brought it to New
                              Amsterdam, which would later become New York City. By the time of the American Revolution
                              in 1773, coffee had become so popular that the colonists revolted against the heavy tea
                              taxes imposed by King George III, switching from tea to coffee as an act of patriotism.
                            </p>

                            <p className="mb-3">
                              The first coffee house in America opened in Boston in 1689. These establishments quickly
                              became centers of social interaction and political discussion. The famous Green Dragon
                              Coffee House in Boston was referred to as the "headquarters of the Revolution" by Daniel
                              Webster.
                            </p>

                            <p className="mb-3">
                              In the 1800s, pioneers moving west brought coffee with them, brewing it over campfires as
                              they traveled. By the early 20th century, coffee had become a staple in American
                              households, with brands like Folgers and Maxwell House becoming household names.
                            </p>

                            <p className="mb-3">
                              The specialty coffee movement began in the 1960s in the western United States,
                              particularly in San Francisco. The first Starbucks opened in Seattle's Pike Place Market
                              in 1971, forever changing how Americans consumed coffee.
                            </p>

                            <p>
                              Today, North America is home to thousands of independent coffee shops, roasters, and
                              specialty cafes, with Americans consuming over 400 million cups of coffee per day. The
                              continent remains one of the largest coffee markets in the world, with a rich culture of
                              innovation and entrepreneurship in the industry.
                            </p>
                          </div>

                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={() => handleRegionSelect(region)}
                              className="bg-amber-600 hover:bg-amber-700"
                            >
                              Explore North American Coffee Businesses
                            </Button>
                          </div>
                        </motion.div>
                      ) : region === "Europe" ? (
                        <motion.div
                          className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="text-xl font-bold text-amber-900 mb-4">
                            Your Coffee Empire Expands to Europe
                          </h3>

                          <div className="prose prose-amber">
                            <p className="mb-3">
                              After establishing a strong presence in North America, your Bean Empire is ready for its
                              first international expansion. Europe, with its rich coffee culture and appreciation for
                              quality brews, is the perfect next step for your growing business.
                            </p>

                            <p className="mb-3">
                              Europe's relationship with coffee dates back to the 17th century when Venetian merchants
                              brought the exotic beans from the Ottoman Empire. Coffee houses quickly spread across the
                              continent, becoming centers of intellectual discourse, artistic expression, and political
                              debate.
                            </p>

                            <p className="mb-3">
                              Each European country developed its own unique coffee traditions: Italy's espresso culture
                              gave birth to cappuccinos and lattes; Vienna's elegant coffee houses served coffee with
                              whipped cream and pastries; France embraced the café culture with its leisurely coffee
                              sipping at sidewalk tables.
                            </p>

                            <p className="mb-3">
                              Your market research shows tremendous opportunity across the continent. From cozy cafés in
                              Paris to modern coffee shops in Berlin, from traditional espresso bars in Rome to
                              innovative coffee concepts in Amsterdam, Europe offers diverse markets for your expanding
                              brand.
                            </p>

                            <p>
                              As you prepare to open your first European location, you're excited about adapting your
                              successful formula to local tastes while bringing your unique Bean Empire flair to a
                              continent that takes its coffee very seriously. This expansion marks a significant
                              milestone in your journey from a small local shop to a global coffee empire.
                            </p>
                          </div>

                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={() => handleRegionSelect(region)}
                              className="bg-amber-600 hover:bg-amber-700"
                            >
                              Begin Your European Adventure
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {businessesByRegion[region]?.map((business) => (
                            <motion.div
                              key={business.id}
                              className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-amber-900">{business.name}</h3>
                                <div className="text-2xl">{business.icon}</div>
                              </div>
                              <div className="flex justify-between text-sm my-1">
                                <span className="text-amber-700">Revenue:</span>
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(business.baseRevenue)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm my-1">
                                <span className="text-amber-700">Cycle Time:</span>
                                <span>{business.baseTime}s</span>
                              </div>
                              <div className="flex justify-between text-sm my-1">
                                <span className="text-amber-700">Multiplier:</span>
                                <span className="text-amber-900">{business.multiplier}x</span>
                              </div>
                              <div className="flex justify-between text-sm my-1">
                                <span className="text-amber-700">Cost:</span>
                                <span className="text-red-600 font-medium">{formatCurrency(business.cost)}</span>
                              </div>
                              <p className="text-xs text-amber-700 mt-2 mb-3">{business.description}</p>
                              <Button
                                onClick={() => handleBuyBusiness(business)}
                                disabled={cash < business.cost || isBusinessOwned(business.id)}
                                className={`w-full mt-3 ${
                                  isBusinessOwned(business.id)
                                    ? "bg-green-600 hover:bg-green-700"
                                    : cash < business.cost
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-amber-600 hover:bg-amber-700"
                                }`}
                              >
                                {isBusinessOwned(business.id)
                                  ? "Owned"
                                  : cash < business.cost
                                    ? `Need ${formatCurrency(business.cost - cash)} more`
                                    : `Buy (${formatCurrency(business.cost)})`}
                              </Button>
                            </motion.div>
                          ))}

                          {(!businessesByRegion[region] || businessesByRegion[region].length === 0) && (
                            <div className="col-span-2 text-center py-8 bg-amber-100 rounded-lg">
                              <p className="text-amber-800">No businesses available in this region yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function getRegionPosition(region: string): React.CSSProperties {
  switch (region) {
    case "North America":
      return { top: "30%", left: "20%" }
    case "South America":
      return { top: "60%", left: "30%" }
    case "Europe":
      return { top: "25%", left: "48%" }
    case "Africa":
      return { top: "50%", left: "50%" }
    case "Asia":
      return { top: "35%", left: "70%" }
    case "Australia":
      return { top: "70%", left: "80%" }
    default:
      return { top: "50%", left: "50%" }
  }
}
