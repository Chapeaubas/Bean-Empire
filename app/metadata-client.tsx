"use client"

import type React from "react"
import "@/app/globals.css"
import { Press_Start_2P } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"

// Load pixel font
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export function MetadataClient({
  children,
}: {
  children: React.ReactNode
}) {
  // Add global error handler
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      console.error("Global error:", event.error)
      // You could also send this to an error tracking service
      event.preventDefault()
    }

    window.addEventListener("error", handleGlobalError)

    return () => {
      window.removeEventListener("error", handleGlobalError)
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${pixelFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
