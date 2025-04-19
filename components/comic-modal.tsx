"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ComicModalProps {
  show: boolean
  onClose: () => void
  imageSrc: string
}

export default function ComicModal({ show, onClose, imageSrc }: ComicModalProps) {
  const [imageError, setImageError] = useState(false)

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-2xl w-full bg-amber-100 rounded-lg overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-amber-800/50 rounded-full p-1 text-white hover:bg-amber-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative w-full aspect-[3/4]">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-200 text-amber-800 p-4 text-center">
              <div>
                <p className="text-xl font-bold mb-2">Image could not be loaded</p>
                <p>Don't worry, you can still continue the game!</p>
              </div>
            </div>
          ) : (
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt="Comic"
              fill
              style={{ objectFit: "contain" }}
              priority
              className="rounded-t-lg"
              onError={() => {
                console.error(`Failed to load comic image: ${imageSrc}`)
                setImageError(true)
              }}
            />
          )}
        </div>

        <div className="p-4 bg-amber-800 text-center">
          <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3">
            Continue
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
