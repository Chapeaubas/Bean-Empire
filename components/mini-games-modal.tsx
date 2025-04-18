"use client"

import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import BaseModal from "@/components/base-modal"
import { motion } from "framer-motion"

interface MiniGamesModalProps {
  show: boolean
  onClose: () => void
  onSelectGame: (game: string) => void
}

export default function MiniGamesModal({ show, onClose, onSelectGame }: MiniGamesModalProps) {
  const games = [
    {
      id: "coffee-brewing",
      name: "Coffee Brewing Challenge",
      description: "Test your timing skills to brew the perfect cup of coffee!",
      icon: "☕",
      difficulty: "Medium",
      reward: "150+ $GRIND",
    },
    {
      id: "bean-sorting",
      name: "Bean Sorting",
      description: "Sort coffee beans by type as quickly as possible to earn rewards!",
      icon: "🫘",
      difficulty: "Easy",
      reward: "100+ $GRIND",
    },
  ]

  return (
    <BaseModal
      show={show}
      onClose={onClose}
      title="Mini Games"
      icon={<Trophy className="h-5 w-5 mr-2 text-amber-300" />}
    >
      <div className="p-4">
        <p className="text-amber-300 mb-4">
          Play mini-games to earn extra $GRIND! Your prestige level increases rewards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {games.map((game) => (
            <motion.div
              key={game.id}
              className="bg-amber-700/50 rounded-lg border border-amber-600 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-4">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 flex items-center justify-center bg-amber-800 rounded-full mr-3 text-xl">
                    {game.icon}
                  </div>
                  <h3 className="font-bold">{game.name}</h3>
                </div>

                <p className="text-sm text-amber-300 mb-3">{game.description}</p>

                <div className="flex justify-between text-xs text-amber-200 mb-3">
                  <span>Difficulty: {game.difficulty}</span>
                  <span>Reward: {game.reward}</span>
                </div>

                <Button
                  variant="default"
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => onSelectGame(game.id)}
                >
                  Play Game
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseModal>
  )
}
