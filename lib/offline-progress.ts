// Offline progress calculator for the game

import { formatCurrency } from "@/lib/utils"

interface Business {
  id: string
  name: string
  icon: string
  baseCost: number
  baseRevenue: number
  baseTime: number
  costMultiplier: number
  revenueMultiplier: number
}

interface BusinessState {
  owned: number
  level: number
  hasManager: boolean
  speedMultiplier: number
  profitMultiplier: number
  lastCollected: number | null
  progress: number
}

interface OfflineProgressResult {
  totalEarned: number
  businessEarnings: {
    businessId: string
    name: string
    earned: number
    cycles: number
  }[]
  timeAway: number
}

export function calculateOfflineProgress(
  lastOnlineTime: number,
  businesses: { [key: string]: BusinessState },
  businessData: Business[],
  prestigeLevel: number,
  globalMultiplier: number,
  offlineMultiplier = 1, // From prestige upgrades
  maxOfflineTime: number = 24 * 60 * 60 * 1000, // 24 hours in milliseconds
): OfflineProgressResult {
  const now = Date.now()
  const timeAway = Math.min(now - lastOnlineTime, maxOfflineTime)

  let totalEarned = 0
  const businessEarnings: OfflineProgressResult["businessEarnings"] = []

  // Calculate earnings for each business
  businessData.forEach((business) => {
    const state = businesses[business.id]

    // Skip if business is not owned or has no manager
    if (!state || state.owned === 0 || !state.hasManager) return

    // Calculate how many cycles completed while offline
    const cycleTime = business.baseTime / state.speedMultiplier
    const cycleTimeMs = cycleTime * 1000
    const cycles = Math.floor(timeAway / cycleTimeMs)

    // Calculate earnings
    const earningsPerCycle =
      business.baseRevenue * state.owned * state.profitMultiplier * prestigeLevel * globalMultiplier
    const earned = earningsPerCycle * cycles * offlineMultiplier

    if (earned > 0) {
      totalEarned += earned
      businessEarnings.push({
        businessId: business.id,
        name: business.name,
        earned,
        cycles,
      })
    }
  })

  return {
    totalEarned,
    businessEarnings,
    timeAway,
  }
}

export function formatOfflineProgress(result: OfflineProgressResult): string {
  const hours = Math.floor(result.timeAway / (1000 * 60 * 60))
  const minutes = Math.floor((result.timeAway % (1000 * 60 * 60)) / (1000 * 60))

  let message = `While you were away for ${hours}h ${minutes}m:\n\n`
  message += `Total earned: ${formatCurrency(result.totalEarned)}\n\n`

  if (result.businessEarnings.length > 0) {
    message += "Business earnings:\n"
    result.businessEarnings.forEach((business) => {
      message += `${business.name}: ${formatCurrency(business.earned)} (${business.cycles} cycles)\n`
    })
  } else {
    message += "No businesses generated income while you were away."
  }

  return message
}
