// Sound manager for the game
// This handles loading and playing sound effects

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private musicTracks: { [key: string]: HTMLAudioElement } = {}
  private enabled = true
  private musicEnabled = true
  private currentMusic: string | null = null
  private volume = 0.5
  private musicVolume = 0.3
  private isClient = false

  constructor() {
    // Check if we're in a browser environment
    this.isClient = typeof window !== "undefined"

    if (this.isClient) {
      this.preloadSounds()
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
    this.loadMusic("main", "/sounds/main-theme.mp3")
    this.loadMusic("minigame", "/sounds/minigame-theme.mp3")
  }

  private loadSound(name: string, url: string) {
    if (!this.isClient) return

    // In a real implementation, we would load actual sound files
    // For now, we'll just create audio elements without sources
    this.sounds[name] = new Audio()
    // this.sounds[name].src = url
  }

  private loadMusic(name: string, url: string) {
    if (!this.isClient) return

    this.musicTracks[name] = new Audio()
    // this.musicTracks[name].src = url
    this.musicTracks[name].loop = true
  }

  public play(sound: string) {
    if (!this.isClient || !this.enabled) return
    if (!this.sounds[sound]) {
      console.warn(`Sound "${sound}" not found`)
      return
    }

    // Clone the audio to allow overlapping sounds
    const audio = this.sounds[sound].cloneNode() as HTMLAudioElement
    audio.volume = this.volume
    audio.play().catch((e) => console.warn("Error playing sound:", e))
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

    // Play new track
    this.currentMusic = track
    this.musicTracks[track].volume = this.musicVolume
    this.musicTracks[track].play().catch((e) => console.warn("Error playing music:", e))
  }

  public stopMusic() {
    if (!this.isClient || !this.currentMusic) return

    this.musicTracks[this.currentMusic].pause()
    this.musicTracks[this.currentMusic].currentTime = 0
    this.currentMusic = null
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!this.isClient) return

    if (!enabled) {
      this.stopMusic()
    } else if (this.currentMusic) {
      this.musicTracks[this.currentMusic].play().catch((e) => console.warn("Error playing music:", e))
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled
    if (!this.isClient) return

    if (!enabled) {
      this.stopMusic()
    } else if (this.currentMusic) {
      this.musicTracks[this.currentMusic].play().catch((e) => console.warn("Error playing music:", e))
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
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
}

// Create a singleton instance
const soundManager = new SoundManager()

export default soundManager
