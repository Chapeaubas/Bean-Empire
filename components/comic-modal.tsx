"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import PixelButton from "./pixel-button"

interface ComicModalProps {
  show: boolean
  onClose: () => void
  imageSrc: string
}

export default function ComicModal({ show, onClose, imageSrc }: ComicModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center max-w-2xl w-full"
          >
            <div className="relative w-full aspect-square mb-6 bg-white rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="$GRIND Comic"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="rounded-lg"
              />
            </div>
            <PixelButton text="Continue" color="amber" onClick={onClose} className="text-xl px-8 py-4" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
