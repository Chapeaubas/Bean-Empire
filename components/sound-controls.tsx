"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music, Music2 } from "lucide-react"
import soundManager from "@/lib/sound-manager"
import { Slider } from "@/components/ui/slider"

interface SoundControlsProps {
  className?: string
}

export default function SoundControls({ className = "" }: SoundControlsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.5)
  const [musicVolume, setMusicVolume] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize state from sound manager
  useEffect(() => {
    setMounted(true)
    setSoundEnabled(soundManager.isEnabled())
    setMusicEnabled(soundManager.isMusicEnabled())
    setSoundVolume(soundManager.getVolume())
    setMusicVolume(soundManager.getMusicVolume())
  }, [])

  // Start background music when component mounts
  useEffect(() => {
    if (mounted && musicEnabled && !soundManager.getCurrentMusic()) {
      soundManager.playMusic("main")
    }
  }, [mounted, musicEnabled])

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    soundManager.setEnabled(newState)
  }

  const toggleMusic = () => {
    const newState = !musicEnabled
    setMusicEnabled(newState)
    soundManager.setMusicEnabled(newState)

    // If enabling music and no music is playing, start the main theme
    if (newState && !soundManager.getCurrentMusic()) {
      soundManager.playMusic("main")
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

  if (!mounted) return null

  return (
    <div className={`relative ${className}`}>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="bg-amber-800 border-amber-700 text-amber-300 hover:bg-amber-700"
          title={soundEnabled ? "Mute Sound Effects" : "Unmute Sound Effects"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleMusic}
          className="bg-amber-800 border-amber-700 text-amber-300 hover:bg-amber-700"
          title={musicEnabled ? "Mute Music" : "Unmute Music"}
        >
          {musicEnabled ? <Music className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowControls(!showControls)}
          className="bg-amber-800 border-amber-700 text-amber-300 hover:bg-amber-700"
        >
          {showControls ? "Hide Controls" : "Volume Controls"}
        </Button>
      </div>

      {showControls && (
        <div className="absolute top-full mt-2 right-0 bg-amber-800 border border-amber-700 rounded-lg p-4 w-64 z-50">
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <label className="text-amber-300 text-sm">Sound Effects</label>
              <span className="text-amber-300 text-sm">{Math.round(soundVolume * 100)}%</span>
            </div>
            <Slider
              value={[soundVolume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleSoundVolumeChange}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-amber-300 text-sm">Music</label>
              <span className="text-amber-300 text-sm">{Math.round(musicVolume * 100)}%</span>
            </div>
            <Slider
              value={[musicVolume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleMusicVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}
