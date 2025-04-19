"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ComicModalProps {
  show: boolean
  onClose: () => void
  imageSrc: string
}

export default function ComicModal({ show, onClose, imageSrc }: ComicModalProps) {
  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="Comic"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="rounded-t-lg"
              />
            </div>

            <div className="p-4 bg-amber-800 text-center">
              <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3">
                Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
