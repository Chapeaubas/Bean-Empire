"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, Music2, X, Settings } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import soundManager from "@/lib/sound-manager"

interface SettingsModalProps {
  show: boolean
  onClose: () => void
}

export default function SettingsModal({ show, onClose }: SettingsModalProps) {
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

    // If enabling music, try to play any pending music
    if (newState) {
      try {
        soundManager.tryPlayPendingMusic()
      } catch (error) {
        console.error("Error playing pending music:", error)
      }

      // If no music is playing, start the main theme
      if (!soundManager.getCurrentMusic()) {
        soundManager.playMusic("main")
      }
    }
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

  if (!mounted || !show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-amber-800 border-4 border-amber-600 rounded-lg p-6 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-amber-100 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-amber-300" />
            Game Settings
          </h2>
          <Button variant="ghost" onClick={onClose} className="text-amber-200 hover:text-amber-100 hover:bg-amber-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-700/50 p-4 rounded-lg">
            <h3 className="font-bold mb-4 text-amber-200">Sound Settings</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-amber-100">Sound Effects</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSound}
                  className="border-amber-600 text-amber-300 hover:bg-amber-700"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  {soundEnabled ? "On" : "Off"}
                </Button>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-amber-200 text-sm">Volume</label>
                  <span className="text-amber-200 text-sm">{Math.round(soundVolume * 100)}%</span>
                </div>
                <Slider
                  value={[soundVolume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleSoundVolumeChange}
                  disabled={!soundEnabled}
                  className="w-full"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-amber-100">Music</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMusic}
                  className="border-amber-600 text-amber-300 hover:bg-amber-700"
                >
                  {musicEnabled ? <Music className="h-4 w-4 mr-2" /> : <Music2 className="h-4 w-4 mr-2" />}
                  {musicEnabled ? "On" : "Off"}
                </Button>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-amber-200 text-sm">Volume</label>
                  <span className="text-amber-200 text-sm">{Math.round(musicVolume * 100)}%</span>
                </div>
                <Slider
                  value={[musicVolume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleMusicVolumeChange}
                  disabled={!musicEnabled}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Button
            variant="default"
            onClick={onClose}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
