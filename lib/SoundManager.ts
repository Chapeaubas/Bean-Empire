// Sound manager for the game
// This handles loading and playing sound effects and background music

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private musicTracks: { [key: string]: HTMLAudioElement } = {}
  private enabled = true
  private musicEnabled = true
  private currentMusic: string | null = null
  private volume = 0.5
  private musicVolume = 0.3
  private isClient = false
  private _pendingMusic: string | null = null

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== "undefined"

    if (this.isClient) {
      this.preloadSounds()
      this.loadSettings()
    }
  }

  private preloadSounds() {
    if (!this.isClient) return

    // Game sounds
    this.loadSound("click", "/sounds/click.mp3")
    this.loadSound("collect", "/sounds/collect.mp3")
    this.loadSound("buy", "/sounds/buy.mp3")
    this.loadSound("upgrade", "/sounds/upgrade.mp3")
    this.loadSound("success", "/sounds/success.mp3")
    this.loadSound("fail", "/sounds/fail.mp3")
    this.loadSound("levelUp", "/sounds/level-up.mp3")
    this.loadSound("achievement", "/sounds/achievement.mp3")
    this.loadSound("prestige", "/sounds/prestige.mp3")

    // Music tracks
    this.loadMusic("main", "/sounds/GrindingSong.wav")
    this.loadMusic("minigame", "/sounds/minigame-theme.mp3")
  }

  private loadSettings() {
    try {
      const soundEnabled = localStorage.getItem("soundEnabled")
      if (soundEnabled !== null) {
        this.enabled = soundEnabled === "true"
      }

      const musicEnabled = localStorage.getItem("musicEnabled")
      if (musicEnabled !== null) {
        this.musicEnabled = musicEnabled === "true"
      }

      const soundVolume = localStorage.getItem("soundVolume")
      if (soundVolume !== null) {
        this.volume = Number.parseFloat(soundVolume)
      }

      const musicVolume = localStorage.getItem("musicVolume")
      if (musicVolume !== null) {
        this.musicVolume = Number.parseFloat(musicVolume)
      }
    } catch (error) {
      console.warn("Error loading sound settings:", error)
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem("soundEnabled", String(this.enabled))
      localStorage.setItem("musicEnabled", String(this.musicEnabled))
      localStorage.setItem("soundVolume", String(this.volume))
      localStorage.setItem("musicVolume", String(this.musicVolume))
    } catch (error) {
      console.warn("Error saving sound settings:", error)
    }
  }

  private loadSound(name: string, url: string) {
    if (!this.isClient) return

    try {
      this.sounds[name] = new Audio(url)
      this.sounds[name].preload = "auto"
    } catch (error) {
      console.warn(`Error loading sound ${name}:`, error)
    }
  }

  private loadMusic(name: string, url: string) {
    if (!this.isClient) return

    try {
      this.musicTracks[name] = new Audio(url)
      this.musicTracks[name].loop = true
      this.musicTracks[name].preload = "auto"
      this.musicTracks[name].volume = this.musicVolume
    } catch (error) {
      console.warn(`Error loading music ${name}:`, error)
    }
  }

  public play(sound: string) {
    if (!this.isClient || !this.enabled) return
    if (!this.sounds[sound]) {
      console.warn(`Sound "${sound}" not found`)
      return
    }

    try {
      // Clone the audio to allow overlapping sounds
      const audio = this.sounds[sound].cloneNode() as HTMLAudioElement
      audio.volume = this.volume
      audio.play().catch((e) => console.warn("Error playing sound:", e))
    } catch (error) {
      console.warn(`Error playing sound ${sound}:`, error)
    }
  }

  public playMusic(track: string) {
    if (!this.isClient || !this.musicEnabled) return
    if (this.currentMusic === track) return
    if (!this.musicTracks[track]) {
      console.warn(`Music track "${track}" not found`)
      return
    }

    // Stop current music if playing
    this.stopMusic()

    try {
      // Play new track with user interaction handling
      this.currentMusic = track
      this.musicTracks[track].volume = this.musicVolume
      this.musicTracks[track].currentTime = 0

      const playPromise = this.musicTracks[track].play()

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.warn("Autoplay prevented:", e)
          // Store the track that should be playing so we can try again later
          this._pendingMusic = track
        })
      }
    } catch (error) {
      console.warn(`Error playing music ${track}:`, error)
    }
  }

  public stopMusic() {
    if (!this.isClient || !this.currentMusic) return

    try {
      this.musicTracks[this.currentMusic].pause()
      this.musicTracks[this.currentMusic].currentTime = 0
      this.currentMusic = null
    } catch (error) {
      console.warn("Error stopping music:", error)
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    this.saveSettings()

    if (!this.isClient) return

    if (!enabled) {
      // Don't stop music when disabling sound effects
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
    this.saveSettings()

    if (!this.isClient) return

    if (!enabled) {
      this.stopMusic()
    } else if (this.currentMusic) {
      this.musicTracks[this.currentMusic].play().catch((e) => console.warn("Error playing music:", e))
    } else {
      // If no music is currently playing but music is enabled, start the main theme
      this.playMusic("main")
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.saveSettings()
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    this.saveSettings()

    if (this.isClient && this.currentMusic) {
      this.musicTracks[this.currentMusic].volume = this.musicVolume
    }
  }

  public isEnabled() {
    return this.enabled
  }

  public isMusicEnabled() {
    return this.musicEnabled
  }

  public getVolume() {
    return this.volume
  }

  public getMusicVolume() {
    return this.musicVolume
  }

  public getCurrentMusic() {
    return this.currentMusic
  }

  // Add a method to try playing pending music (to be called on user interaction)
  public tryPlayPendingMusic() {
    if (this._pendingMusic && this.musicEnabled) {
      const track = this._pendingMusic
      this._pendingMusic = null
      this.playMusic(track)
    }
  }
}

// Create a singleton instance
const soundManager = new SoundManager()

export default soundManager
