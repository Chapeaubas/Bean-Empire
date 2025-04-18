import type React from "react"
import type { Metadata } from "next"
import { MetadataClient } from "./metadata-client"

export const metadata: Metadata = {
  title: "$GRIND: Bean Hustle",
  description:
    "Help $GRIND build the ultimate underground coffee empire in this pixel art coffee shop management game!",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MetadataClient>{children}</MetadataClient>
}


import './globals.css'