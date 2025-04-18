"use client"

import { Award, X, Star, Coffee, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ACHIEVEMENTS } from "@/lib/game-data"

interface AchievementsPanelProps {
  show: boolean
  onClose: () => void
  achievements: { [key: string]: boolean }
  getAchievementProgress: (achievement: any) => number
}

export default function AchievementsPanel({
  show,
  onClose,
  achievements,
  getAchievementProgress,
}: AchievementsPanelProps) {
  if (!show) return null

  // Get icon for achievement
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "💰":
        return <TrendingUp className="h-5 w-5 text-amber-300" />
      case "👑":
        return <Star className="h-5 w-5 text-amber-300" />
      case "🏆":
        return <Award className="h-5 w-5 text-amber-300" />
      case "🤝":
        return <Coffee className="h-5 w-5 text-amber-300" />
      case "✨":
        return <Zap className="h-5 w-5 text-amber-300" />
      default:
        return <Award className="h-5 w-5 text-amber-300" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col border-2 border-amber-600">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold flex items-center">
            <Award className="h-5 w-5 mr-2 text-amber-300" />
            Achievements
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievements[achievement.id]
              const progress = getAchievementProgress(achievement)

              return (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-4 border ${
                    isUnlocked ? "bg-green-800/30 border-green-600" : "bg-amber-700/50 border-amber-600"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full mr-3 ${
                        isUnlocked ? "bg-green-700" : "bg-amber-800"
                      }`}
                    >
                      {getAchievementIcon(achievement.icon)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{achievement.name}</h3>
                        {isUnlocked ? (
                          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Completed</span>
                        ) : (
                          <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {Math.floor(progress)}%
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-amber-300 mb-2">{achievement.description}</p>

                      {!isUnlocked && (
                        <div className="w-full bg-amber-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      )}

                      <div className="mt-2 text-xs">
                        <span className="text-amber-300">Reward: </span>
                        <span>
                          {achievement.reward.type === "cash"
                            ? `${achievement.reward.value} coins`
                            : `${achievement.reward.value}x multiplier`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
