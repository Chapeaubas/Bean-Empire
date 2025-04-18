"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PauseMenuProps {
  onResume: () => void
  onToggleSound: () => void
  soundEnabled: boolean
  onClose: () => void
}

export default function PauseMenu({ onResume, onToggleSound, soundEnabled, onClose }: PauseMenuProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-amber-100 border-4 border-amber-800 rounded-lg p-8 w-full max-w-md shadow-2xl pixel-art-container"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-6 text-center pixel-text">Game Paused</h2>

        <div className="space-y-4">
          <Button
            onClick={onResume}
            className="w-full bg-green-600 hover:bg-green-700 text-white pixel-text py-2 sm:py-3"
          >
            Resume Game
          </Button>

          <Button
            onClick={onToggleSound}
            variant="outline"
            className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 pixel-text py-2 sm:py-3"
          >
            {soundEnabled ? <VolumeX className="mr-2" /> : <Volume2 className="mr-2" />}
            {soundEnabled ? "Mute" : "Unmute"}
          </Button>
        </div>
      </div>
    </div>
  )
}
