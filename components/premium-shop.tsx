"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/utils"
import { ShoppingBag, Sparkles, Lock, Info, Check, X } from "lucide-react"
import { motion } from "framer-motion"

interface PremiumItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  effect: string
  requires?: string[]
}

interface PremiumShopProps {
  angelInvestors: number
  onPurchase: (itemId: string, price: number) => void
  ownedItems: string[]
  onClose: () => void
}

export default function PremiumShop({ angelInvestors, onPurchase, ownedItems, onClose }: PremiumShopProps) {
  const [selectedItem, setSelectedItem] = useState<PremiumItem | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // Premium items with very high prices to make players grind
  const premiumItems: PremiumItem[] = [
    {
      id: "gold_hat",
      name: "Golden Propeller Hat",
      description: "A shiny golden propeller hat that makes your businesses run twice as fast!",
      price: 500, // 500 $GRIND beans
      image: "/images/gold-hat.png",
      effect: "Makes all businesses produce 2x faster",
    },
    {
      id: "gold_jacket",
      name: "Golden Jacket",
      description: "This stylish golden jacket gives all your businesses a profit boost!",
      price: 750, // 750 $GRIND beans
      image: "/images/gold-jacket.png",
      effect: "Increases all business profits by 1.5x",
    },
    {
      id: "gold_sunglasses",
      name: "Golden Sunglasses",
      description: "These flashy sunglasses make managers respect you more, offering their services at a discount.",
      price: 1000, // 1000 $GRIND beans
      image: "/images/gold-sunglasses.png",
      effect: "Reduces manager costs by 50%",
    },
    {
      id: "gold_coins",
      name: "Golden Coins",
      description: "A collection of magical golden coins that multiply your earnings.",
      price: 1500, // 1500 $GRIND beans
      image: "/images/gold-coins.png",
      effect: "Increases all money earned by 2x",
    },
    {
      id: "gold_hat_combo",
      name: "Golden Hat Combo",
      description: "The ultimate headgear! Combines the power of the Golden Hat and Golden Jacket.",
      price: 3000, // 3000 $GRIND beans
      image: "/images/gold-hat-combo.png",
      effect: "2x speed + 1.5x profit boost",
      requires: ["gold_hat", "gold_jacket"],
    },
    {
      id: "gold_hamster_upgrade",
      name: "Golden Hamster Ultimate",
      description:
        "The legendary golden hamster transformation! Combines the power of the hat, jacket, and sunglasses.",
      price: 5000, // 5000 $GRIND beans
      image: "/images/gold-hamster-upgrade.png",
      effect: "2x speed + 1.5x profit + 50% cheaper managers",
      requires: ["gold_hat", "gold_jacket", "gold_sunglasses"],
    },
  ]

  const handlePurchase = () => {
    if (!selectedItem) return

    onPurchase(selectedItem.id, selectedItem.price)
    setShowConfirm(false)
    setSelectedItem(null)
  }

  const canPurchase = (item: PremiumItem) => {
    if (ownedItems.includes(item.id)) return false
    if (angelInvestors < item.price) return false

    // Check if required items are owned
    if (item.requires && item.requires.length > 0) {
      return item.requires.every((reqId) => ownedItems.includes(reqId))
    }

    return true
  }

  const getItemStatus = (item: PremiumItem) => {
    if (ownedItems.includes(item.id)) {
      return { status: "owned", message: "Owned" }
    }

    if (item.requires && item.requires.length > 0) {
      const missingItems = item.requires.filter((reqId) => !ownedItems.includes(reqId))
      if (missingItems.length > 0) {
        return {
          status: "locked",
          message: `Requires: ${missingItems
            .map((id) => premiumItems.find((item) => item.id === id)?.name)
            .join(", ")}`,
        }
      }
    }

    if (angelInvestors < item.price) {
      return { status: "expensive", message: `Need ${item.price - angelInvestors} more $GRIND` }
    }

    return { status: "available", message: `${item.price} $GRIND` }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col border-4 border-amber-500"
      >
        <div className="flex flex-wrap justify-between items-center p-4 border-b-2 border-amber-600">
          <h2 className="text-xl font-bold flex items-center mb-2 sm:mb-0">
            <ShoppingBag className="h-6 w-6 mr-2 text-amber-300" />
            Premium Shop
          </h2>
          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
            <div className="bg-amber-700 px-3 py-1 rounded-lg flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-amber-300" />
              <span className="font-bold text-sm">{formatNumber(angelInvestors)} $GRIND</span>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-amber-200 hover:text-amber-100 hover:bg-amber-700 ml-2"
              aria-label="Close premium shop"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {showConfirm && selectedItem ? (
            <div className="bg-amber-700/50 p-6 rounded-lg border-2 border-amber-500 mb-4">
              <h3 className="text-xl font-bold mb-4">Confirm Purchase</h3>
              <div className="flex items-center mb-4">
                <div className="relative w-20 h-20 mr-4">
                  <Image
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={selectedItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg">{selectedItem.name}</p>
                  <p className="text-amber-300">{selectedItem.effect}</p>
                  <p className="text-amber-200 mt-1">Cost: {formatNumber(selectedItem.price)} $GRIND</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="default" className="bg-amber-500 hover:bg-amber-600" onClick={handlePurchase}>
                  Confirm Purchase
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-amber-700/30 p-4 rounded-lg mb-6 flex items-start">
                <Info className="h-5 w-5 mr-2 text-amber-300 flex-shrink-0 mt-1" />
                <p className="text-amber-200">
                  Welcome to the Premium Shop! Spend your hard-earned $GRIND beans on exclusive golden items that will
                  supercharge your coffee empire. These powerful upgrades persist through prestiges!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {premiumItems.map((item) => {
                  const { status, message } = getItemStatus(item)

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: status === "available" ? 1.03 : 1 }}
                      className={`bg-amber-700/40 rounded-lg border-2 ${
                        status === "owned"
                          ? "border-green-500"
                          : status === "available"
                            ? "border-amber-400"
                            : "border-amber-700/50 opacity-80"
                      } overflow-hidden`}
                    >
                      <div className="relative h-48 bg-gradient-to-b from-amber-600/30 to-amber-800/30 flex items-center justify-center p-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={180}
                          height={180}
                          className="object-contain max-h-full"
                        />

                        {status === "locked" && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="bg-amber-900/80 p-3 rounded-lg">
                              <Lock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                              <p className="text-amber-300 text-sm text-center">Unlock required items first</p>
                            </div>
                          </div>
                        )}

                        {status === "owned" && (
                          <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                            <Check className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-amber-200 text-sm mb-2">{item.description}</p>
                        <div className="text-xs text-amber-300 mb-3">Effect: {item.effect}</div>

                        <div className="flex justify-between items-center">
                          <div
                            className={`text-sm ${
                              status === "owned"
                                ? "text-green-400"
                                : status === "expensive"
                                  ? "text-red-400"
                                  : status === "locked"
                                    ? "text-amber-500"
                                    : "text-amber-300"
                            }`}
                          >
                            {message}
                          </div>

                          <Button
                            variant="default"
                            size="sm"
                            disabled={!canPurchase(item)}
                            className={canPurchase(item) ? "bg-amber-500 hover:bg-amber-600" : "bg-amber-800"}
                            onClick={() => {
                              setSelectedItem(item)
                              setShowConfirm(true)
                            }}
                          >
                            {status === "owned" ? "Purchased" : "Buy"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </>
          )}
        </div>
        {/* Fixed close button for mobile portrait mode */}
        <div className="sm:hidden fixed bottom-4 right-4 z-50">
          <Button
            variant="default"
            onClick={onClose}
            className="bg-amber-600 hover:bg-amber-700 shadow-lg rounded-full h-12 w-12 flex items-center justify-center"
            aria-label="Close premium shop"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
