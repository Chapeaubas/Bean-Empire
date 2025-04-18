// Remove the import of useEffectEvent since it's not being used
// import { useEffectEvent } from "react"

// This function sets up the manager system to automatically collect from businesses
export function setupManagerSystem(
  managers: any[],
  getBusinessState: (businessId: string) => any,
  getBusinessData: (businessId: string) => any,
  calculateRevenue: (businessId: string) => number,
  updateBusinessState: (businessId: string, updates: any) => void,
  collectRevenue: (businessId: string, amount: number) => void,
  onManagerCollection: (collection: { businessId: string; amount: number }) => void,
  startBusiness: (businessId: string) => void,
) {
  const DEBUG = true

  if (DEBUG) console.log("Setting up manager system with", managers.length, "managers")

  // Check if there are any managers
  if (!managers || managers.length === 0) {
    if (DEBUG) console.log("No managers to set up")
    return () => {}
  }

  // Set up interval to check businesses with managers
  const interval = setInterval(() => {
    if (DEBUG) console.log("Manager system checking businesses...")

    managers.forEach((manager) => {
      try {
        const businessId = manager.businessId
        const businessState = getBusinessState(businessId)
        const businessData = getBusinessData(businessId)

        if (!businessState || !businessData) {
          if (DEBUG) console.log(`Missing data for business ${businessId}`)
          return
        }

        if (!businessState.hasManager || businessState.owned <= 0) {
          if (DEBUG) console.log(`Business ${businessId} has no manager or is not owned`)
          return
        }

        // If business is ready to collect
        if (businessState.progress >= 100) {
          if (DEBUG) console.log(`Manager collecting from ${businessId}`)

          // Calculate revenue
          const revenue = calculateRevenue(businessId)

          // Collect revenue
          collectRevenue(businessId, revenue)

          // Notify about collection
          onManagerCollection({
            businessId,
            amount: revenue,
          })

          // Reset progress
          updateBusinessState(businessId, {
            progress: 0,
            lastCollected: null,
          })

          // Start the business again
          setTimeout(() => {
            startBusiness(businessId)
          }, 100)
        }
        // If business is not started, start it
        else if (businessState.progress === 0) {
          if (DEBUG) console.log(`Manager starting ${businessId}`)
          startBusiness(businessId)
        }
      } catch (error) {
        console.error(`Error in manager system for ${manager.businessId}:`, error)
      }
    })
  }, 1000) // Check every second

  // Return cleanup function
  return () => {
    if (DEBUG) console.log("Cleaning up manager system")
    clearInterval(interval)
  }
}
