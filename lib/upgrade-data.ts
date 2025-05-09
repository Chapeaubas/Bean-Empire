// Comprehensive upgrade system for Bean Empire
// Inspired by Adventure Capitalist's cash upgrade system

export interface BusinessUpgrade {
  id: string
  businessId: string
  name: string
  cost: number
  multiplier: number
  type: "profit" | "speed" | "special"
  description: string
  icon?: string
  requiredLevel?: number // Business level required to unlock
  requiredPrestige?: number // Prestige level required to unlock
}

// Basic Coffee Stand Upgrades
const COFFEE_STAND_UPGRADES: BusinessUpgrade[] = [
  {
    id: "paper_cups",
    businessId: "coffee_stand",
    name: "Paper Cups",
    cost: 250,
    multiplier: 2,
    type: "profit",
    description: "Branded paper cups double your Coffee Stand profits",
    requiredLevel: 5,
  },
  {
    id: "premium_beans",
    businessId: "coffee_stand",
    name: "Premium Beans",
    cost: 1000,
    multiplier: 3,
    type: "profit",
    description: "Higher quality beans triple your Coffee Stand profits",
    requiredLevel: 25,
  },
  {
    id: "coffee_thermos",
    businessId: "coffee_stand",
    name: "Coffee Thermos",
    cost: 5000,
    multiplier: 2,
    type: "speed",
    description: "Keep coffee hot longer, serve twice as fast",
    requiredLevel: 50,
  },
  {
    id: "loyalty_cards",
    businessId: "coffee_stand",
    name: "Loyalty Cards",
    cost: 25000,
    multiplier: 4,
    type: "profit",
    description: "Repeat customers quadruple your Coffee Stand profits",
    requiredLevel: 100,
  },
  {
    id: "artisanal_recipes",
    businessId: "coffee_stand",
    name: "Artisanal Recipes",
    cost: 100000,
    multiplier: 7,
    type: "profit",
    description: "Unique coffee recipes multiply your Coffee Stand profits by 7",
    requiredLevel: 200,
  },
  {
    id: "mobile_ordering",
    businessId: "coffee_stand",
    name: "Mobile Ordering",
    cost: 500000,
    multiplier: 3,
    type: "speed",
    description: "Pre-orders make your Coffee Stand 3 times faster",
    requiredLevel: 300,
  },
  {
    id: "celebrity_endorsement",
    businessId: "coffee_stand",
    name: "Celebrity Endorsement",
    cost: 1000000,
    multiplier: 10,
    type: "profit",
    description: "A famous actor loves your coffee! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Home Espresso Machine Upgrades
const HOME_ESPRESSO_UPGRADES: BusinessUpgrade[] = [
  {
    id: "pressure_gauge",
    businessId: "home_espresso",
    name: "Pressure Gauge",
    cost: 1500,
    multiplier: 2,
    type: "profit",
    description: "Perfect pressure means perfect espresso. 2x profits",
    requiredLevel: 10,
  },
  {
    id: "temperature_control",
    businessId: "home_espresso",
    name: "Temperature Control",
    cost: 7500,
    multiplier: 3,
    type: "profit",
    description: "Precise temperature control triples your espresso profits",
    requiredLevel: 25,
  },
  {
    id: "dual_boiler",
    businessId: "home_espresso",
    name: "Dual Boiler System",
    cost: 50000,
    multiplier: 2,
    type: "speed",
    description: "Steam milk while pulling shots. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "grind_calibration",
    businessId: "home_espresso",
    name: "Grind Calibration",
    cost: 250000,
    multiplier: 4,
    type: "profit",
    description: "Perfect grind size quadruples your espresso profits",
    requiredLevel: 100,
  },
  {
    id: "bottomless_portafilter",
    businessId: "home_espresso",
    name: "Bottomless Portafilter",
    cost: 1000000,
    multiplier: 5,
    type: "profit",
    description: "See the extraction in action. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "auto_tamper",
    businessId: "home_espresso",
    name: "Automatic Tamper",
    cost: 5000000,
    multiplier: 3,
    type: "speed",
    description: "Perfect tamping every time. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "barista_certification",
    businessId: "home_espresso",
    name: "Barista Certification",
    cost: 25000000,
    multiplier: 10,
    type: "profit",
    description: "You're officially a master barista! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Coffee Shop Upgrades
const COFFEE_SHOP_UPGRADES: BusinessUpgrade[] = [
  {
    id: "comfy_chairs",
    businessId: "coffee_shop",
    name: "Comfy Chairs",
    cost: 10000,
    multiplier: 2,
    type: "profit",
    description: "Customers stay longer and order more. 2x profits",
    requiredLevel: 10,
  },
  {
    id: "wifi_upgrade",
    businessId: "coffee_shop",
    name: "Free High-Speed WiFi",
    cost: 50000,
    multiplier: 3,
    type: "profit",
    description: "Digital nomads flock to your shop. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "express_line",
    businessId: "coffee_shop",
    name: "Express Line",
    cost: 250000,
    multiplier: 2,
    type: "speed",
    description: "Separate line for simple orders. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "pastry_selection",
    businessId: "coffee_shop",
    name: "Gourmet Pastry Selection",
    cost: 1000000,
    multiplier: 4,
    type: "profit",
    description: "Delicious pastries quadruple your Coffee Shop profits",
    requiredLevel: 100,
  },
  {
    id: "signature_drinks",
    businessId: "coffee_shop",
    name: "Signature Drink Menu",
    cost: 5000000,
    multiplier: 5,
    type: "profit",
    description: "Unique drinks you can't get anywhere else. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "mobile_pos",
    businessId: "coffee_shop",
    name: "Mobile POS System",
    cost: 25000000,
    multiplier: 3,
    type: "speed",
    description: "Take orders anywhere in the shop. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "celebrity_barista",
    businessId: "coffee_shop",
    name: "Celebrity Barista",
    cost: 100000000,
    multiplier: 10,
    type: "profit",
    description: "A famous barista joins your team! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Coffee Cart Upgrades
const COFFEE_CART_UPGRADES: BusinessUpgrade[] = [
  {
    id: "cart_branding",
    businessId: "coffee_cart",
    name: "Custom Cart Branding",
    cost: 75000,
    multiplier: 2,
    type: "profit",
    description: "Eye-catching design doubles your Coffee Cart profits",
    requiredLevel: 10,
  },
  {
    id: "premium_location",
    businessId: "coffee_cart",
    name: "Premium Location",
    cost: 300000,
    multiplier: 3,
    type: "profit",
    description: "High-traffic spot triples your Coffee Cart profits",
    requiredLevel: 25,
  },
  {
    id: "dual_brewers",
    businessId: "coffee_cart",
    name: "Dual Brewing System",
    cost: 1500000,
    multiplier: 2,
    type: "speed",
    description: "Brew twice as many coffees at once. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "seasonal_specials",
    businessId: "coffee_cart",
    name: "Seasonal Specials",
    cost: 7500000,
    multiplier: 4,
    type: "profit",
    description: "Limited-time offerings quadruple your Coffee Cart profits",
    requiredLevel: 100,
  },
  {
    id: "weather_protection",
    businessId: "coffee_cart",
    name: "All-Weather Protection",
    cost: 30000000,
    multiplier: 5,
    type: "profit",
    description: "Operate in any weather condition. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "cart_fleet",
    businessId: "coffee_cart",
    name: "Coffee Cart Fleet",
    cost: 150000000,
    multiplier: 3,
    type: "speed",
    description: "Multiple carts operating simultaneously. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "city_contract",
    businessId: "coffee_cart",
    name: "City-Wide Contract",
    cost: 750000000,
    multiplier: 10,
    type: "profit",
    description: "Exclusive rights to operate in prime locations! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Roastery Upgrades
const ROASTERY_UPGRADES: BusinessUpgrade[] = [
  {
    id: "drum_roaster",
    businessId: "roastery",
    name: "Drum Roaster",
    cost: 500000,
    multiplier: 2,
    type: "profit",
    description: "Professional roasting equipment doubles your Roastery profits",
    requiredLevel: 10,
  },
  {
    id: "bean_sourcing",
    businessId: "roastery",
    name: "Direct Trade Bean Sourcing",
    cost: 2500000,
    multiplier: 3,
    type: "profit",
    description: "Premium beans from around the world. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "batch_roasting",
    businessId: "roastery",
    name: "Batch Roasting System",
    cost: 10000000,
    multiplier: 2,
    type: "speed",
    description: "Roast multiple batches at once. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "flavor_profiles",
    businessId: "roastery",
    name: "Signature Flavor Profiles",
    cost: 50000000,
    multiplier: 4,
    type: "profit",
    description: "Unique roasting recipes quadruple your Roastery profits",
    requiredLevel: 100,
  },
  {
    id: "packaging_line",
    businessId: "roastery",
    name: "Automated Packaging Line",
    cost: 250000000,
    multiplier: 5,
    type: "profit",
    description: "Professional packaging increases value. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "roasting_ai",
    businessId: "roastery",
    name: "AI Roasting Assistant",
    cost: 1000000000,
    multiplier: 3,
    type: "speed",
    description: "Perfect roast every time. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "master_roaster",
    businessId: "roastery",
    name: "Master Roaster",
    cost: 5000000000,
    multiplier: 10,
    type: "profit",
    description: "World-renowned roasting expert joins your team! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Bean Farm Upgrades
const BEAN_FARM_UPGRADES: BusinessUpgrade[] = [
  {
    id: "irrigation",
    businessId: "bean_farm",
    name: "Drip Irrigation System",
    cost: 5000000,
    multiplier: 2,
    type: "profit",
    description: "Water efficiency doubles your Bean Farm profits",
    requiredLevel: 10,
  },
  {
    id: "shade_growing",
    businessId: "bean_farm",
    name: "Shade Growing Technique",
    cost: 25000000,
    multiplier: 3,
    type: "profit",
    description: "Better flavor through traditional methods. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "harvesting_machine",
    businessId: "bean_farm",
    name: "Mechanical Harvester",
    cost: 100000000,
    multiplier: 2,
    type: "speed",
    description: "Harvest beans twice as fast",
    requiredLevel: 50,
  },
  {
    id: "organic_certification",
    businessId: "bean_farm",
    name: "Organic Certification",
    cost: 500000000,
    multiplier: 4,
    type: "profit",
    description: "Premium prices for certified organic beans. 4x profits",
    requiredLevel: 100,
  },
  {
    id: "rare_varietals",
    businessId: "bean_farm",
    name: "Rare Coffee Varietals",
    cost: 2500000000,
    multiplier: 5,
    type: "profit",
    description: "Exclusive bean varieties command premium prices. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "processing_station",
    businessId: "bean_farm",
    name: "On-Site Processing Station",
    cost: 10000000000,
    multiplier: 3,
    type: "speed",
    description: "Process beans right at the farm. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "coffee_estate",
    businessId: "bean_farm",
    name: "Prestigious Coffee Estate",
    cost: 50000000000,
    multiplier: 10,
    type: "profit",
    description: "Your farm becomes world-famous! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Bean Import Company Upgrades
const BEAN_IMPORT_UPGRADES: BusinessUpgrade[] = [
  {
    id: "shipping_contracts",
    businessId: "bean_import",
    name: "Bulk Shipping Contracts",
    cost: 75000000,
    multiplier: 2,
    type: "profit",
    description: "Better shipping rates double your Import Company profits",
    requiredLevel: 10,
  },
  {
    id: "origin_relationships",
    businessId: "bean_import",
    name: "Origin Relationships",
    cost: 350000000,
    multiplier: 3,
    type: "profit",
    description: "Direct relationships with farmers. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "customs_expediting",
    businessId: "bean_import",
    name: "Customs Expediting",
    cost: 1500000000,
    multiplier: 2,
    type: "speed",
    description: "Faster clearance through customs. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "quality_control",
    businessId: "bean_import",
    name: "Advanced Quality Control",
    cost: 7500000000,
    multiplier: 4,
    type: "profit",
    description: "Premium selection process quadruples your Import profits",
    requiredLevel: 100,
  },
  {
    id: "exclusive_regions",
    businessId: "bean_import",
    name: "Exclusive Regional Rights",
    cost: 30000000000,
    multiplier: 5,
    type: "profit",
    description: "Sole importer from prestigious growing regions. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "distribution_network",
    businessId: "bean_import",
    name: "Global Distribution Network",
    cost: 150000000000,
    multiplier: 3,
    type: "speed",
    description: "Efficient worldwide distribution. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "market_dominance",
    businessId: "bean_import",
    name: "Market Dominance",
    cost: 750000000000,
    multiplier: 10,
    type: "profit",
    description: "Control the global coffee bean market! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Coffee Franchise Upgrades
const COFFEE_FRANCHISE_UPGRADES: BusinessUpgrade[] = [
  {
    id: "brand_identity",
    businessId: "coffee_franchise",
    name: "Strong Brand Identity",
    cost: 1000000000,
    multiplier: 2,
    type: "profit",
    description: "Recognizable branding doubles your Franchise profits",
    requiredLevel: 10,
  },
  {
    id: "franchise_manual",
    businessId: "coffee_franchise",
    name: "Comprehensive Franchise Manual",
    cost: 5000000000,
    multiplier: 3,
    type: "profit",
    description: "Standardized operations across all locations. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "location_analytics",
    businessId: "coffee_franchise",
    name: "Location Analytics System",
    cost: 25000000000,
    multiplier: 2,
    type: "speed",
    description: "Quickly identify prime locations for new franchises. 2x speed",
    requiredLevel: 50,
  },
  {
    id: "franchisee_training",
    businessId: "coffee_franchise",
    name: "Elite Franchisee Training Program",
    cost: 100000000000,
    multiplier: 4,
    type: "profit",
    description: "Well-trained owners quadruple your Franchise profits",
    requiredLevel: 100,
  },
  {
    id: "global_expansion",
    businessId: "coffee_franchise",
    name: "Global Expansion Strategy",
    cost: 500000000000,
    multiplier: 5,
    type: "profit",
    description: "Take your franchise worldwide. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "franchise_automation",
    businessId: "coffee_franchise",
    name: "Franchise Management System",
    cost: 2500000000000,
    multiplier: 3,
    type: "speed",
    description: "Automated support for all franchisees. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "coffee_empire",
    businessId: "coffee_franchise",
    name: "Global Coffee Empire",
    cost: 10000000000000,
    multiplier: 10,
    type: "profit",
    description: "Your franchise becomes a household name worldwide! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Bean Research Lab Upgrades
const BEAN_RESEARCH_UPGRADES: BusinessUpgrade[] = [
  {
    id: "lab_equipment",
    businessId: "bean_research",
    name: "Advanced Lab Equipment",
    cost: 50000000000,
    multiplier: 2,
    type: "profit",
    description: "Cutting-edge research tools double your Research Lab profits",
    requiredLevel: 10,
  },
  {
    id: "research_grants",
    businessId: "bean_research",
    name: "Research Grants",
    cost: 250000000000,
    multiplier: 3,
    type: "profit",
    description: "External funding triples your Research Lab profits",
    requiredLevel: 25,
  },
  {
    id: "automated_testing",
    businessId: "bean_research",
    name: "Automated Testing Systems",
    cost: 1000000000000,
    multiplier: 2,
    type: "speed",
    description: "Run experiments twice as fast",
    requiredLevel: 50,
  },
  {
    id: "flavor_database",
    businessId: "bean_research",
    name: "Comprehensive Flavor Database",
    cost: 5000000000000,
    multiplier: 4,
    type: "profit",
    description: "Cataloged flavor profiles quadruple your Research profits",
    requiredLevel: 100,
  },
  {
    id: "genetic_research",
    businessId: "bean_research",
    name: "Coffee Genetic Research",
    cost: 25000000000000,
    multiplier: 5,
    type: "profit",
    description: "Developing superior bean varieties. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "ai_research",
    businessId: "bean_research",
    name: "AI Research Assistant",
    cost: 100000000000000,
    multiplier: 3,
    type: "speed",
    description: "AI accelerates your research. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "revolutionary_discovery",
    businessId: "bean_research",
    name: "Revolutionary Coffee Discovery",
    cost: 500000000000000,
    multiplier: 10,
    type: "profit",
    description: "Your lab makes a breakthrough that changes coffee forever! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Bean Time Machine Upgrades
const BEAN_TIME_MACHINE_UPGRADES: BusinessUpgrade[] = [
  {
    id: "temporal_stabilizer",
    businessId: "bean_time_machine",
    name: "Temporal Stabilizer",
    cost: 1000000000000,
    multiplier: 2,
    type: "profit",
    description: "Stabilize time flow to double your Time Machine profits",
    requiredLevel: 10,
  },
  {
    id: "historical_beans",
    businessId: "bean_time_machine",
    name: "Historical Bean Collection",
    cost: 5000000000000,
    multiplier: 3,
    type: "profit",
    description: "Collect extinct coffee varieties from the past. 3x profits",
    requiredLevel: 25,
  },
  {
    id: "time_dilation",
    businessId: "bean_time_machine",
    name: "Time Dilation Field",
    cost: 25000000000000,
    multiplier: 2,
    type: "speed",
    description: "Manipulate time to harvest beans twice as fast",
    requiredLevel: 50,
  },
  {
    id: "paradox_resolver",
    businessId: "bean_time_machine",
    name: "Paradox Resolution System",
    cost: 100000000000000,
    multiplier: 4,
    type: "profit",
    description: "Safely manage temporal paradoxes. 4x profits",
    requiredLevel: 100,
  },
  {
    id: "future_beans",
    businessId: "bean_time_machine",
    name: "Future Bean Technology",
    cost: 500000000000000,
    multiplier: 5,
    type: "profit",
    description: "Advanced coffee varieties from the future. 5x profits",
    requiredLevel: 200,
  },
  {
    id: "multiverse_harvester",
    businessId: "bean_time_machine",
    name: "Multiverse Bean Harvester",
    cost: 2500000000000000,
    multiplier: 3,
    type: "speed",
    description: "Collect beans from parallel universes. 3x speed",
    requiredLevel: 300,
  },
  {
    id: "time_monopoly",
    businessId: "bean_time_machine",
    name: "Temporal Coffee Monopoly",
    cost: 10000000000000000,
    multiplier: 10,
    type: "profit",
    description: "Control coffee throughout all of time! 10x profits",
    requiredLevel: 400,
    requiredPrestige: 1,
  },
]

// Combine all upgrades
export const ALL_BUSINESS_UPGRADES: BusinessUpgrade[] = [
  ...COFFEE_STAND_UPGRADES,
  ...HOME_ESPRESSO_UPGRADES,
  ...COFFEE_SHOP_UPGRADES,
  ...COFFEE_CART_UPGRADES,
  ...ROASTERY_UPGRADES,
  ...BEAN_FARM_UPGRADES,
  ...BEAN_IMPORT_UPGRADES,
  ...COFFEE_FRANCHISE_UPGRADES,
  ...BEAN_RESEARCH_UPGRADES,
  ...BEAN_TIME_MACHINE_UPGRADES,
]

// Special milestone upgrades that apply to all businesses
export const MILESTONE_UPGRADES: BusinessUpgrade[] = [
  {
    id: "bean_empire_branding",
    businessId: "all",
    name: "Bean Empire Branding",
    cost: 1000000000,
    multiplier: 2,
    type: "profit",
    description: "Your Bean Empire brand becomes recognized worldwide. 2x profits for ALL businesses",
    requiredPrestige: 1,
  },
  {
    id: "coffee_innovation",
    businessId: "all",
    name: "Coffee Innovation Patent",
    cost: 10000000000,
    multiplier: 3,
    type: "profit",
    description: "Your revolutionary coffee innovation triples profits for ALL businesses",
    requiredPrestige: 2,
  },
  {
    id: "global_supply_chain",
    businessId: "all",
    name: "Optimized Global Supply Chain",
    cost: 100000000000,
    multiplier: 2,
    type: "speed",
    description: "Streamlined operations double production speed for ALL businesses",
    requiredPrestige: 3,
  },
  {
    id: "bean_empire_university",
    businessId: "all",
    name: "Bean Empire University",
    cost: 1000000000000,
    multiplier: 5,
    type: "profit",
    description: "Train the world's best coffee professionals. 5x profits for ALL businesses",
    requiredPrestige: 5,
  },
]

// Helper function to get available upgrades based on game state
export function getAvailableUpgrades(
  businessLevels: Record<string, number>,
  ownedUpgrades: string[],
  prestigeLevel: number,
): BusinessUpgrade[] {
  return ALL_BUSINESS_UPGRADES.filter((upgrade) => {
    // Skip already owned upgrades
    if (ownedUpgrades.includes(upgrade.id)) return false

    // Check business level requirement
    const businessLevel = businessLevels[upgrade.businessId] || 0
    if (upgrade.requiredLevel && businessLevel < upgrade.requiredLevel) return false

    // Check prestige level requirement
    if (upgrade.requiredPrestige && prestigeLevel < upgrade.requiredPrestige) return false

    return true
  })
}

// Helper function to get milestone upgrades based on game state
export function getAvailableMilestoneUpgrades(ownedUpgrades: string[], prestigeLevel: number): BusinessUpgrade[] {
  return MILESTONE_UPGRADES.filter((upgrade) => {
    // Skip already owned upgrades
    if (ownedUpgrades.includes(upgrade.id)) return false

    // Check prestige level requirement
    if (upgrade.requiredPrestige && prestigeLevel < upgrade.requiredPrestige) return false

    return true
  })
}
