export interface Manager {
  id: string
  businessId: string
  name: string
  cost: number
  description: string
}

export interface ManagerCollection {
  businessId: string
  amount: number
  timestamp: number
  managerId?: string
}

const DEBUG = true

// Completely redesigned manager system with independent timers for each business
export function setupManagerSystem(
  managers: Manager[],
  getBusinessState: (businessId: string) => any,
  getBusinessData: (businessId: string) => any,
  calculateRevenue: (businessId: string) => number,
  updateBusinessState: (businessId: string, updates: any) => void,
  collectRevenue: (businessId: string, amount: number) => void,
  onManagerCollection: (collection: ManagerCollection) => void,
  startBusiness: (businessId: string) => void,
): () => void {
  if (DEBUG) {
    console.log("=== MANAGER SYSTEM INITIALIZATION ===")
    console.log(
      `Setting up manager system with ${managers.length} managers:`,
      managers.map((m) => `${m.name} (${m.businessId})`),
    )
  }

  // Store individual timers for each business
  const businessTimers: { [businessId: string]: NodeJS.Timeout } = {}

  // Initialize each business with its own timer
  managers.forEach((manager) => {
    const businessId = manager.businessId

    // Start the business timer
    startBusinessTimer(businessId)

    if (DEBUG) {
      console.log(`Started timer for ${businessId} managed by ${manager.name}`)
    }
  })

  // Function to start a timer for a specific business
  function startBusinessTimer(businessId: string) {
    // Clear any existing timer for this business
    if (businessTimers[businessId]) {
      clearInterval(businessTimers[businessId])
      delete businessTimers[businessId]
    }

    // Create a new timer that checks this business every 500ms
    businessTimers[businessId] = setInterval(() => {
      try {
        checkAndProcessBusiness(businessId)
      } catch (err) {
        console.error(`Error processing business ${businessId}:`, err)
      }
    }, 500)
  }

  // Function to check and process a single business
  function checkAndProcessBusiness(businessId: string) {
    const state = getBusinessState(businessId)
    const business = getBusinessData(businessId)

    if (!state || !business) {
      if (DEBUG) console.log(`[${businessId}] Missing state or data`)
      return
    }

    if (!state.owned || state.owned <= 0) {
      if (DEBUG) console.log(`[${businessId}] Not owned`)
      return
    }

    if (!state.hasManager) {
      if (DEBUG) console.log(`[${businessId}] No manager assigned`)
      return
    }

    // Find the manager for this business
    const manager = managers.find((m) => m.businessId === businessId)
    if (!manager) {
      if (DEBUG) console.log(`[${businessId}] No manager found`)
      return
    }

    if (DEBUG) {
      console.log(`Checking ${business.name} (${businessId}):`)
      console.log(`  Progress: ${state.progress?.toFixed(1)}%`)
    }

    // If business is ready to collect
    if (state.progress >= 100) {
      if (DEBUG) console.log(`[${businessId}] Ready to collect`)

      // Calculate revenue
      const revenue = calculateRevenue(businessId)
      const safeRevenue = isNaN(revenue) || revenue <= 0 ? 1 : revenue

      if (DEBUG) console.log(`[${businessId}] Collecting ${safeRevenue}`)

      // Collect the revenue
      collectRevenue(businessId, safeRevenue)

      // Notify about the collection
      onManagerCollection({
        businessId,
        amount: safeRevenue,
        timestamp: Date.now(),
        managerId: manager.id,
      })

      // Reset progress
      updateBusinessState(businessId, {
        progress: 0,
        lastCollected: null,
      })

      // Start a new production cycle immediately
      if (DEBUG) console.log(`[${businessId}] Starting new production cycle`)
      startBusiness(businessId)
    }
    // If business is idle, start it
    else if (state.progress === 0) {
      if (DEBUG) console.log(`[${businessId}] Idle, starting production`)
      startBusiness(businessId)
    }
    // Business is in progress, nothing to do
    else {
      if (DEBUG && Math.floor(state.progress) % 25 === 0) {
        console.log(`[${businessId}] In progress: ${state.progress?.toFixed(1)}%`)
      }
    }
  }

  // Return a cleanup function that clears all timers
  return () => {
    Object.values(businessTimers).forEach((timer) => clearInterval(timer))
  }
}
