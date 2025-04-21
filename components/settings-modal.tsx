"use client"

import { Button } from "@/components/ui/button"
import { Settings, Volume2, VolumeX, Music, Music2, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
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

  if (!show || !mounted) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-amber-800 border-2 border-amber-600 rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Settings className="h-5 w-5 mr-2 text-amber-300" />
            Settings
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-amber-300">Sound Settings</h3>

            <div className="flex justify-between items-center">
              <span>Sound Effects</span>
              <Button variant="outline" size="sm" onClick={toggleSound} className="border-amber-600 text-amber-300">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="ml-2">{soundEnabled ? "On" : "Off"}</span>
              </Button>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-amber-300 text-sm">Volume</label>
                <span className="text-amber-300 text-sm">{Math.round(soundVolume * 100)}%</span>
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
              <span>Music</span>
              <Button variant="outline" size="sm" onClick={toggleMusic} className="border-amber-600 text-amber-300">
                {musicEnabled ? <Music className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
                <span className="ml-2">{musicEnabled ? "On" : "Off"}</span>
              </Button>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-amber-300 text-sm">Volume</label>
                <span className="text-amber-300 text-sm">{Math.round(musicVolume * 100)}%</span>
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

          <div className="pt-4 border-t border-amber-700">
            <Button variant="default" className="w-full bg-amber-600 hover:bg-amber-700" onClick={onClose}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
