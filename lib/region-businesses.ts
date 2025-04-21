// Define the region business type
export interface RegionBusiness {
  id: string
  name: string
  region: string
  cost: number
  revenue: number
  cycleTime: number // in milliseconds
  baseTime: number // in seconds
  multiplier: number
  costMultiplier: number
  baseRevenue: number
  icon: string
  description: string
}

// Define region unlock requirements
export interface RegionRequirement {
  region: string
  requirements: {
    businessId: string
    count: number
    name: string
  }[]
  description: string
}

// Region unlock requirements
export const regionRequirements: RegionRequirement[] = [
  {
    region: "Europe",
    requirements: [
      { businessId: "coffee_roastery", count: 30, name: "Coffee Warehouse" },
      { businessId: "coffee_plantation", count: 15, name: "Coffee Plantation" },
      { businessId: "coffee_factory", count: 5, name: "Coffee Factory" },
    ],
    description: "Expand your coffee empire to Europe by establishing a strong presence in North America first.",
  },
  {
    region: "Asia",
    requirements: [
      { businessId: "eu_coffee_academy", count: 75, name: "Coffee Academy" },
      { businessId: "eu_rooftop_cafe", count: 40, name: "Rooftop Café" },
      { businessId: "eu_coffee_franchise", count: 20, name: "Coffee Franchise" },
    ],
    description: "Expand to the Asian market after establishing your European operations.",
  },
  {
    region: "South America",
    requirements: [
      { businessId: "asia_tea_house", count: 60, name: "Tea & Coffee House" },
      { businessId: "asia_bean_farm", count: 30, name: "Bean Farm" },
    ],
    description: "Return to the source of coffee by expanding to South America.",
  },
  {
    region: "Africa",
    requirements: [
      { businessId: "sa_plantation", count: 50, name: "Coffee Plantation" },
      { businessId: "sa_research_center", count: 25, name: "Bean Research Center" },
    ],
    description: "Explore the rich coffee heritage of Africa.",
  },
  {
    region: "Australia",
    requirements: [
      { businessId: "africa_roastery", count: 40, name: "Artisan Roastery" },
      { businessId: "africa_coffee_resort", count: 20, name: "Coffee Resort" },
    ],
    description: "Complete your global coffee empire by expanding to Australia.",
  },
]

// Define region businesses
export const regionBusinesses: RegionBusiness[] = [
  // North America businesses (existing)
  {
    id: "na_coffee_truck",
    name: "Coffee Truck",
    region: "North America",
    cost: 50000,
    revenue: 5000,
    baseRevenue: 5000,
    cycleTime: 5000, // 5 seconds
    baseTime: 5,
    costMultiplier: 1.2,
    multiplier: 1.2,
    icon: "🚚",
    description: "Mobile coffee service that reaches customers across the city.",
  },
  {
    id: "na_drive_thru",
    name: "Drive-Thru Coffee",
    region: "North America",
    cost: 200000,
    revenue: 15000,
    baseRevenue: 15000,
    cycleTime: 10000, // 10 seconds
    baseTime: 10,
    costMultiplier: 1.5,
    multiplier: 1.5,
    icon: "🚗",
    description: "Convenient drive-thru service for coffee on the go.",
  },

  // Europe businesses (new)
  {
    id: "eu_sidewalk_cafe",
    name: "Sidewalk Café",
    region: "Europe",
    cost: 1000000,
    revenue: 100000,
    baseRevenue: 100000,
    cycleTime: 8000, // 8 seconds
    baseTime: 8,
    costMultiplier: 1.3,
    multiplier: 1.4,
    icon: "☕",
    description: "Classic European sidewalk café where customers enjoy coffee and watch the world go by.",
  },
  {
    id: "eu_espresso_bar",
    name: "Espresso Bar",
    region: "Europe",
    cost: 2500000,
    revenue: 250000,
    baseRevenue: 250000,
    cycleTime: 5000, // 5 seconds
    baseTime: 5,
    costMultiplier: 1.35,
    multiplier: 1.5,
    icon: "☕",
    description: "Italian-style standing espresso bar serving quick shots to busy professionals.",
  },
  {
    id: "eu_pastry_shop",
    name: "Coffee & Pastry Shop",
    region: "Europe",
    cost: 5000000,
    revenue: 500000,
    baseRevenue: 500000,
    cycleTime: 12000, // 12 seconds
    baseTime: 12,
    costMultiplier: 1.4,
    multiplier: 1.6,
    icon: "🥐",
    description: "Combination of coffee shop and bakery offering fresh pastries with every cup.",
  },
  {
    id: "eu_coffee_academy",
    name: "Coffee Academy",
    region: "Europe",
    cost: 10000000,
    revenue: 1000000,
    baseRevenue: 1000000,
    cycleTime: 20000, // 20 seconds
    baseTime: 20,
    costMultiplier: 1.45,
    multiplier: 1.7,
    icon: "🎓",
    description: "Training center for baristas and coffee connoisseurs from around the world.",
  },
  {
    id: "eu_historic_cafe",
    name: "Historic Café",
    region: "Europe",
    cost: 25000000,
    revenue: 2500000,
    baseRevenue: 2500000,
    cycleTime: 30000, // 30 seconds
    baseTime: 30,
    costMultiplier: 1.5,
    multiplier: 1.8,
    icon: "🏛️",
    description: "Centuries-old café in a historic building, attracting tourists and coffee enthusiasts.",
  },
  {
    id: "eu_rooftop_cafe",
    name: "Rooftop Café",
    region: "Europe",
    cost: 50000000,
    revenue: 5000000,
    baseRevenue: 5000000,
    cycleTime: 45000, // 45 seconds
    baseTime: 45,
    costMultiplier: 1.55,
    multiplier: 1.9,
    icon: "🏙️",
    description: "Exclusive rooftop café with panoramic city views and premium coffee service.",
  },
  {
    id: "eu_coffee_museum",
    name: "Coffee Museum & Café",
    region: "Europe",
    cost: 100000000,
    revenue: 10000000,
    baseRevenue: 10000000,
    cycleTime: 60000, // 60 seconds
    baseTime: 60,
    costMultiplier: 1.6,
    multiplier: 2.0,
    icon: "🏛️",
    description: "Interactive museum showcasing coffee history with a high-end café attached.",
  },
  {
    id: "eu_coffee_franchise",
    name: "European Coffee Franchise",
    region: "Europe",
    cost: 250000000,
    revenue: 25000000,
    baseRevenue: 25000000,
    cycleTime: 90000, // 90 seconds
    baseTime: 90,
    costMultiplier: 1.65,
    multiplier: 2.1,
    icon: "🏢",
    description: "Regional franchise operation with locations in major European cities.",
  },
  {
    id: "eu_coffee_castle",
    name: "Coffee Castle",
    region: "Europe",
    cost: 500000000,
    revenue: 50000000,
    baseRevenue: 50000000,
    cycleTime: 120000, // 120 seconds
    baseTime: 120,
    costMultiplier: 1.7,
    multiplier: 2.2,
    icon: "🏰",
    description: "Converted castle offering luxury coffee experiences and overnight stays.",
  },

  // Other regions' businesses would go here
]

// Helper function to get a region business by ID
export function getRegionBusinessById(id: string): RegionBusiness | undefined {
  try {
    return regionBusinesses.find((business) => business.id === id)
  } catch (error) {
    console.error(`Error getting region business by ID ${id}:`, error)
    return undefined
  }
}

// Helper function to get businesses by region
export function getBusinessesForRegion(region: string): RegionBusiness[] {
  try {
    // Normalize region name for comparison
    const normalizedRegion = region.toLowerCase().replace(/[_\s-]+/g, " ")

    return regionBusinesses.filter((business) => {
      const businessRegion = business.region.toLowerCase().replace(/[_\s-]+/g, " ")
      return businessRegion === normalizedRegion
    })
  } catch (error) {
    console.error(`Error getting businesses for region ${region}:`, error)
    return []
  }
}

// Helper function to get all unique regions
export function getAllRegions(): string[] {
  try {
    const regions = new Set(regionBusinesses.map((business) => business.region))
    return Array.from(regions)
  } catch (error) {
    console.error("Error getting all regions:", error)
    return ["North America", "Europe", "Asia", "South America", "Africa", "Australia"]
  }
}

// Helper function to normalize region name
export function normalizeRegionName(region: string): string {
  try {
    return region.toLowerCase().replace(/[_\s-]+/g, "_")
  } catch (error) {
    console.error(`Error normalizing region name ${region}:`, error)
    return "north_america" // Default fallback
  }
}

// Helper function to format region name for display
export function formatRegionName(region: string): string {
  try {
    return region
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  } catch (error) {
    console.error(`Error formatting region name ${region}:`, error)
    return "North America" // Default fallback
  }
}

// Helper function to check if a region is unlocked based on business states
export function isRegionUnlocked(region: string, businessStates: { [key: string]: any }): boolean {
  // North America is always unlocked
  if (region === "North America") return true

  // Find the requirements for this region
  const requirement = regionRequirements.find((req) => req.region === region)
  if (!requirement) return false

  // Check if all requirements are met
  return requirement.requirements.every((req) => {
    const businessState = businessStates[req.businessId]
    return businessState && businessState.owned >= req.count
  })
}

// Helper function to get the requirements for a region
export function getRegionRequirements(region: string): RegionRequirement | undefined {
  return regionRequirements.find((req) => req.region === region)
}
