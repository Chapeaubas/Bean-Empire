"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface BaseModalProps {
  show?: boolean
  onClose?: () => void
  title: string
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
  maxHeight?: string
  showFooter?: boolean
}

export default function BaseModal({
  show = false,
  onClose = () => {},
  title,
  icon,
  children,
  footer,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[80vh]",
  showFooter = true,
}: BaseModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold text-amber-100 flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose} className="text-amber-200 hover:text-amber-100 hover:bg-amber-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">{children}</div>

        {showFooter && (
          <div className="border-t border-amber-700 p-4 flex justify-end">
            <Button
              onClick={onClose}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
