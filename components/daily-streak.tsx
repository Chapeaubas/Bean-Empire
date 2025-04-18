"use client"

import { useState, useEffect } from "react"
import { Calendar, Gift, Star, Award, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface DailyStreakProps {
  currentStreak: number
  lastClaimTimestamp: number | null
  onClaimStreak: () => void
  prestigeLevel: number
}

export default function DailyStreak({
  currentStreak,
  lastClaimTimestamp,
  onClaimStreak,
  prestigeLevel,
}: DailyStreakProps) {
  const [canClaim, setCanClaim] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState("")
  const [showRewards, setShowRewards] = useState(false)

  // Calculate if the player can claim and time until next claim
  useEffect(() => {
    const checkClaimAvailability = () => {
      const now = new Date()

      // Get today's reset time (midnight UTC)
      const todayReset = new Date(now)
      todayReset.setUTCHours(0, 0, 0, 0)

      // If never claimed, can claim immediately
      if (!lastClaimTimestamp) {
        setCanClaim(true)
        setTimeUntilNextClaim("Available now!")
        return
      }

      // Last claim date
      const lastClaimDate = new Date(lastClaimTimestamp)
      const lastClaimReset = new Date(lastClaimDate)
      lastClaimReset.setUTCHours(0, 0, 0, 0)

      // Can claim if last claim was before today's reset
      const canClaimNow = lastClaimReset < todayReset
      setCanClaim(canClaimNow)

      if (canClaimNow) {
        setTimeUntilNextClaim("Available now!")
      } else {
        // Calculate time until next reset
        const nextReset = new Date(todayReset)
        nextReset.setDate(nextReset.getDate() + 1)

        const timeUntilReset = nextReset.getTime() - now.getTime()
        const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
        const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))

        setTimeUntilNextClaim(`${hours}h ${minutes}m`)
      }
    }

    checkClaimAvailability()

    // Update every minute
    const interval = setInterval(checkClaimAvailability, 60000)
    return () => clearInterval(interval)
  }, [lastClaimTimestamp])

  // Calculate rewards based on streak length
  const calculateBaseReward = (streak: number) => {
    // Non-linear reward scaling
    if (streak >= 365) return 50000 // 1 year
    if (streak >= 180) return 20000 // 6 months
    if (streak >= 90) return 10000 // 3 months
    if (streak >= 30) return 5000 // 1 month
    if (streak >= 14) return 2000 // 2 weeks
    if (streak >= 7) return 1000 // 1 week
    if (streak >= 3) return 500 // 3 days
    return 200 // Base reward
  }

  // Get actual reward with prestige bonus
  const getReward = (streak: number) => {
    return Math.floor(calculateBaseReward(streak) * prestigeLevel)
  }

  // Get the milestone for the next significant streak increase
  const getNextMilestone = () => {
    if (currentStreak < 3) return { days: 3, reward: getReward(3) }
    if (currentStreak < 7) return { days: 7, reward: getReward(7) }
    if (currentStreak < 14) return { days: 14, reward: getReward(14) }
    if (currentStreak < 30) return { days: 30, reward: getReward(30) }
    if (currentStreak < 90) return { days: 90, reward: getReward(90) }
    if (currentStreak < 180) return { days: 180, reward: getReward(180) }
    if (currentStreak < 365) return { days: 365, reward: getReward(365) }
    return { days: currentStreak + 30, reward: getReward(currentStreak + 30) }
  }

  const nextMilestone = getNextMilestone()
  const currentReward = getReward(currentStreak)
  const nextReward = getReward(currentStreak + 1)
  const progress = nextMilestone.days > 0 ? (currentStreak / nextMilestone.days) * 100 : 100

  return (
    <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-lg p-4 border-2 border-amber-500 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-amber-300" />
          Daily Streak
        </h3>
        <div className="bg-amber-900 px-3 py-1 rounded-full flex items-center">
          <Star className="h-4 w-4 mr-1 text-amber-300" />
          <span className="font-bold">{currentStreak} days</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress to {nextMilestone.days}-day milestone</span>
          <span>{Math.floor(progress)}%</span>
        </div>
       <Progress
        value={isNaN(progress) ? 0 : progress}
        className="h-2 bg-amber-900"
        indicatorClassName="bg-gradient-to-r from-amber-400 to-yellow-300"
        />

      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-amber-200">Today's Reward:</div>
          <div className="font-bold text-white">{formatCurrency(currentReward)}</div>
        </div>

        <Button
          variant="default"
          className={`${
            canClaim
              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 animate-pulse"
              : "bg-amber-800"
          }`}
          disabled={!canClaim}
          onClick={onClaimStreak}
        >
          <Gift className="h-4 w-4 mr-2" />
          {canClaim ? "Claim Reward" : "Already Claimed"}
        </Button>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-amber-300" />
          <span className="text-amber-200">Next claim in: {timeUntilNextClaim}</span>
        </div>
        <button className="text-amber-300 hover:text-amber-100 underline" onClick={() => setShowRewards(!showRewards)}>
          {showRewards ? "Hide rewards" : "Show all rewards"}
        </button>
      </div>

      {showRewards && (
        <div className="mt-3 bg-amber-800/50 rounded-lg p-3">
          <h4 className="font-bold mb-2 flex items-center">
            <Award className="h-4 w-4 mr-1 text-amber-300" />
            Streak Rewards
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>3 days:</span>
              <span className="font-bold">{formatCurrency(getReward(3))}</span>
            </div>
            <div className="flex justify-between">
              <span>7 days:</span>
              <span className="font-bold">{formatCurrency(getReward(7))}</span>
            </div>
            <div className="flex justify-between">
              <span>14 days:</span>
              <span className="font-bold">{formatCurrency(getReward(14))}</span>
            </div>
            <div className="flex justify-between">
              <span>30 days:</span>
              <span className="font-bold">{formatCurrency(getReward(30))}</span>
            </div>
            <div className="flex justify-between">
              <span>90 days:</span>
              <span className="font-bold text-amber-300">{formatCurrency(getReward(90))}</span>
            </div>
            <div className="flex justify-between">
              <span>180 days:</span>
              <span className="font-bold text-amber-300">{formatCurrency(getReward(180))}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span>365 days:</span>
              <span className="font-bold text-amber-300">{formatCurrency(getReward(365))}</span>
            </div>
          </div>

          <div className="mt-2 text-xs text-amber-200 flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            <span>Streak Protection: You can miss 1 day every 7 days without losing your streak!</span>
          </div>
        </div>
      )}
    </div>
  )
}
