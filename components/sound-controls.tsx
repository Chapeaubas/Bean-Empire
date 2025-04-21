"use client"

import { useState, useEffect } from "react"
import soundManager from "@/lib/sound-manager"

interface SoundControlsProps {
  className?: string
}

export default function SoundControls({ className = "" }: SoundControlsProps) {
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

  if (!mounted) return null

  return <div className={`relative ${className}`}>{/* Sound controls removed */}</div>
}
