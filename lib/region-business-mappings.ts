// Define region-specific business mappings
// This maps the standard business IDs to region-specific businesses

import { formatRegionName } from "./region-businesses"

// Define the business type
export interface RegionBusinessMapping {
  id: string
  name: string
  icon: string
  baseCost: number
  baseRevenue: number
  baseTime: number
  costMultiplier: number
  revenueMultiplier: number
  description: string
}

// Define the mappings for each region
export const regionBusinessMappings: Record<string, Record<string, RegionBusinessMapping>> = {
  north_america: {
    // North America uses the default businesses
    coffee_cart: {
      id: "coffee_cart",
      name: "Coffee Farmer",
      icon: "🛒",
      baseCost: 4,
      baseRevenue: 1,
      baseTime: 1,
      costMultiplier: 1.07,
      revenueMultiplier: 1.03,
      description: "A small coffee cart to get started with your coffee empire.",
    },
    coffee_shop: {
      id: "coffee_shop",
      name: "Coffee Cart",
      icon: "☕",
      baseCost: 60,
      baseRevenue: 60,
      baseTime: 3,
      costMultiplier: 1.15,
      revenueMultiplier: 1.14,
      description: "A mobile coffee cart that can be moved to high-traffic areas.",
    },
    coffee_house: {
      id: "coffee_house",
      name: "Coffee Car",
      icon: "🏠",
      baseCost: 720,
      baseRevenue: 540,
      baseTime: 6,
      costMultiplier: 1.14,
      revenueMultiplier: 1.13,
      description: "A coffee car that can travel to different locations.",
    },
    coffee_drive_thru: {
      id: "coffee_drive_thru",
      name: "Coffee Shop",
      icon: "🚗",
      baseCost: 8640,
      baseRevenue: 4320,
      baseTime: 12,
      costMultiplier: 1.13,
      revenueMultiplier: 1.12,
      description: "A small coffee shop with seating for customers.",
    },
    coffee_roastery: {
      id: "coffee_roastery",
      name: "Coffee Warehouse",
      icon: "🔥",
      baseCost: 103680,
      baseRevenue: 51840,
      baseTime: 24,
      costMultiplier: 1.12,
      revenueMultiplier: 1.11,
      description: "A warehouse for storing and distributing coffee beans.",
    },
    coffee_plantation: {
      id: "coffee_plantation",
      name: "Coffee Plantation",
      icon: "🌱",
      baseCost: 1244160,
      baseRevenue: 622080,
      baseTime: 96,
      costMultiplier: 1.11,
      revenueMultiplier: 1.1,
      description: "A plantation for growing your own coffee beans.",
    },
    coffee_factory: {
      id: "coffee_factory",
      name: "Coffee Factory",
      icon: "🏭",
      baseCost: 14929920,
      baseRevenue: 7464960,
      baseTime: 384,
      costMultiplier: 1.1,
      revenueMultiplier: 1.09,
      description: "A factory for processing and packaging coffee products.",
    },
    coffee_empire: {
      id: "coffee_empire",
      name: "Coffee Empire",
      icon: "👑",
      baseCost: 179159040,
      baseRevenue: 89579520,
      baseTime: 1536,
      costMultiplier: 1.09,
      revenueMultiplier: 1.08,
      description: "The headquarters of your coffee empire.",
    },
  },
  europe: {
    // European businesses
    coffee_cart: {
      id: "eu_sidewalk_cafe",
      name: "Sidewalk Café",
      icon: "☕",
      baseCost: 4,
      baseRevenue: 1,
      baseTime: 1,
      costMultiplier: 1.07,
      revenueMultiplier: 1.03,
      description: "Classic European sidewalk café where customers enjoy coffee and watch the world go by.",
    },
    coffee_shop: {
      id: "eu_espresso_bar",
      name: "Espresso Bar",
      icon: "☕",
      baseCost: 60,
      baseRevenue: 60,
      baseTime: 3,
      costMultiplier: 1.15,
      revenueMultiplier: 1.14,
      description: "Italian-style standing espresso bar serving quick shots to busy professionals.",
    },
    coffee_house: {
      id: "eu_pastry_shop",
      name: "Coffee & Pastry Shop",
      icon: "🥐",
      baseCost: 720,
      baseRevenue: 540,
      baseTime: 6,
      costMultiplier: 1.14,
      revenueMultiplier: 1.13,
      description: "Combination of coffee shop and bakery offering fresh pastries with every cup.",
    },
    coffee_drive_thru: {
      id: "eu_coffee_academy",
      name: "Coffee Academy",
      icon: "🎓",
      baseCost: 8640,
      baseRevenue: 4320,
      baseTime: 12,
      costMultiplier: 1.13,
      revenueMultiplier: 1.12,
      description: "Training center for baristas and coffee connoisseurs from around the world.",
    },
    coffee_roastery: {
      id: "eu_historic_cafe",
      name: "Historic Café",
      icon: "🏛️",
      baseCost: 103680,
      baseRevenue: 51840,
      baseTime: 24,
      costMultiplier: 1.12,
      revenueMultiplier: 1.11,
      description: "Centuries-old café in a historic building, attracting tourists and coffee enthusiasts.",
    },
    coffee_plantation: {
      id: "eu_rooftop_cafe",
      name: "Rooftop Café",
      icon: "🏙️",
      baseCost: 1244160,
      baseRevenue: 622080,
      baseTime: 96,
      costMultiplier: 1.11,
      revenueMultiplier: 1.1,
      description: "Exclusive rooftop café with panoramic city views and premium coffee service.",
    },
    coffee_factory: {
      id: "eu_coffee_museum",
      name: "Coffee Museum & Café",
      icon: "🏛️",
      baseCost: 14929920,
      baseRevenue: 7464960,
      baseTime: 384,
      costMultiplier: 1.1,
      revenueMultiplier: 1.09,
      description: "Interactive museum showcasing coffee history with a high-end café attached.",
    },
    coffee_empire: {
      id: "eu_coffee_franchise",
      name: "European Coffee Franchise",
      icon: "🏢",
      baseCost: 179159040,
      baseRevenue: 89579520,
      baseTime: 1536,
      costMultiplier: 1.09,
      revenueMultiplier: 1.08,
      description: "Regional franchise operation with locations in major European cities.",
    },
    // Additional European business
    coffee_castle: {
      id: "eu_coffee_castle",
      name: "Coffee Castle",
      icon: "🏰",
      baseCost: 500000000,
      baseRevenue: 50000000,
      baseTime: 120,
      costMultiplier: 1.7,
      revenueMultiplier: 2.2,
      description: "Converted castle offering luxury coffee experiences and overnight stays.",
    },
  },
  // Add other regions as needed
}

// Helper function to get businesses for a specific region
export function getBusinessesForRegionMapping(region: string): RegionBusinessMapping[] {
  const normalizedRegion = region.toLowerCase().replace(/[_\s-]+/g, "_")
  const regionMapping = regionBusinessMappings[normalizedRegion]

  if (!regionMapping) {
    // Default to North America if region not found
    return Object.values(regionBusinessMappings.north_america)
  }

  return Object.values(regionMapping)
}

// Helper function to get a business mapping by ID for a specific region
export function getBusinessMappingById(region: string, businessId: string): RegionBusinessMapping | undefined {
  const normalizedRegion = region.toLowerCase().replace(/[_\s-]+/g, "_")
  const regionMapping = regionBusinessMappings[normalizedRegion]

  if (!regionMapping) {
    // Default to North America if region not found
    return regionBusinessMappings.north_america[businessId]
  }

  return regionMapping[businessId]
}

// Helper function to get the display name for a region
export function getRegionDisplayName(region: string): string {
  return formatRegionName(region)
}
