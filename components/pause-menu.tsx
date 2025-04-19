"use client"

import { Volume2, VolumeX, Music, Music2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import soundManager from "@/lib/sound-manager"

interface PauseMenuProps {
  onResume: () => void
  onClose: () => void
}

export default function PauseMenu({ onResume, onClose }: PauseMenuProps) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.5)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [mounted, setMounted] = useState(false)

  // Initialize state from sound manager
  useEffect(() => {
    setMounted(true)
    setSoundEnabled(soundManager.isEnabled())
    setMusicEnabled(soundManager.isMusicEnabled())
    setSoundVolume(soundManager.getVolume())
    setMusicVolume(soundManager.getMusicVolume())
  }, [])

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    soundManager.setEnabled(newState)
  }

  const toggleMusic = () => {
    const newState = !musicEnabled
    setMusicEnabled(newState)
    soundManager.setMusicEnabled(newState)
  }

  const handleSoundVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setSoundVolume(newVolume)
    soundManager.setVolume(newVolume)
  }

  const handleMusicVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setMusicVolume(newVolume)
    soundManager.setMusicVolume(newVolume)
  }

  if (!mounted) return null

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

          <div className="bg-amber-200 p-4 rounded-lg">
            <h3 className="font-bold text-amber-800 mb-3">Sound Settings</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-amber-800">Sound Effects</span>
                <Button variant="outline" size="sm" onClick={toggleSound} className="border-amber-600 text-amber-700">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="ml-2">{soundEnabled ? "On" : "Off"}</span>
                </Button>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-amber-800 text-sm">Volume</label>
                  <span className="text-amber-800 text-sm">{Math.round(soundVolume * 100)}%</span>
                </div>
                <Slider
                  value={[soundVolume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleSoundVolumeChange}
                  disabled={!soundEnabled}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-800">Music</span>
                <Button variant="outline" size="sm" onClick={toggleMusic} className="border-amber-600 text-amber-700">
                  {musicEnabled ? <Music className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                  <span className="ml-2">{musicEnabled ? "On" : "Off"}</span>
                </Button>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-amber-800 text-sm">Volume</label>
                  <span className="text-amber-800 text-sm">{Math.round(musicVolume * 100)}%</span>
                </div>
                <Slider
                  value={[musicVolume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleMusicVolumeChange}
                  disabled={!musicEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
