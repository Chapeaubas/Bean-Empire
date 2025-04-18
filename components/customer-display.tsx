"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { Star, DollarSign, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CustomerDisplayProps {
  customer: {
    id: string
    name: string
    description: string
    preferences: {
      quality: number
      price: number
      speed: number
      loyalty: number
    }
    spendingLimit: number
    visitFrequency: number
    icon: string
  }
  businessQuality: number
  onServe: (amount: number, tip: number) => void
  onLeave: () => void
}

export default function CustomerDisplay({ customer, businessQuality, onServe, onLeave }: CustomerDisplayProps) {
  const [patience, setPatience] = useState(100)
  const [served, setServed] = useState(false)
  const [orderAmount, setOrderAmount] = useState(0)
  const [tip, setTip] = useState(0)

  // Calculate order amount based on customer type and spending limit
  useEffect(() => {
    const baseAmount = Math.floor(customer.spendingLimit * (0.5 + Math.random() * 0.5))
    setOrderAmount(baseAmount)

    // Calculate potential tip based on quality match and customer preferences
    const qualityMatch = 1 - Math.abs(customer.preferences.quality - businessQuality)
    const potentialTip = Math.floor(baseAmount * qualityMatch * customer.preferences.loyalty)
    setTip(potentialTip)
  }, [customer, businessQuality])

  // Patience decreases over time
  useEffect(() => {
    if (served) return

    const patienceDecreaseRate = 100 / (30 * (customer.preferences.speed + 0.5)) // Higher speed preference = more patient

    const interval = setInterval(() => {
      setPatience((prev) => {
        const newPatience = Math.max(0, prev - patienceDecreaseRate)
        if (newPatience === 0) {
          clearInterval(interval)
          onLeave()
        }
        return newPatience
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [customer, served, onLeave])

  const handleServe = () => {
    setServed(true)
    onServe(orderAmount, tip)
  }

  return (
    <div className={`bg-amber-800 rounded-lg p-3 border-2 ${served ? "border-green-500" : "border-amber-600"}`}>
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 flex items-center justify-center bg-amber-700 rounded-full mr-3 text-xl">
          {customer.icon}
        </div>
        <div>
          <h3 className="font-bold">{customer.name}</h3>
          <p className="text-xs text-amber-300">{customer.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-amber-700/50 p-2 rounded flex items-center">
          <DollarSign className="h-3 w-3 mr-1 text-amber-300" />
          <span className="text-xs">Order: {formatCurrency(orderAmount)}</span>
        </div>

        <div className="bg-amber-700/50 p-2 rounded flex items-center">
          <Star className="h-3 w-3 mr-1 text-amber-300" />
          <span className="text-xs">Tip: {formatCurrency(tip)}</span>
        </div>
      </div>

      {!served && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Patience
              </span>
              <span>{Math.floor(patience)}%</span>
            </div>
            <Progress
              value={patience}
              className="h-2 bg-amber-900"
              indicatorClassName={`${patience > 60 ? "bg-green-500" : patience > 30 ? "bg-amber-500" : "bg-red-500"}`}
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-1 px-3 rounded text-sm"
            onClick={handleServe}
          >
            Serve Customer
          </button>
        </>
      )}

      {served && (
        <div className="text-center text-green-400 text-sm py-1">
          Customer served! {tip > 0 && `+${formatCurrency(tip)} tip`}
        </div>
      )}
    </div>
  )
}
