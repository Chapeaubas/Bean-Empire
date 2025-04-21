import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency with appropriate suffix for large numbers
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === undefined) return "$0"
  if (amount === 0) return "$0"

  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "UDc",
    "DDc",
    "TDc",
    "QaDc",
    "QiDc",
    "SxDc",
    "SpDc",
    "ODc",
    "NDc",
    "Vi",
    "UV",
    "DV",
    "TV",
    "QaV",
    "QiV",
    "SxV",
    "SpV",
    "OcV",
    "NoV",
    "Tg",
  ]

  // Handle negative numbers
  const sign = amount < 0 ? "-" : ""
  amount = Math.abs(amount)

  // Find the appropriate suffix
  let tier = Math.floor(Math.log10(amount) / 3)
  if (tier > suffixes.length - 1) tier = suffixes.length - 1

  const suffix = suffixes[tier]
  const scale = Math.pow(10, tier * 3)

  // Scale the number
  const scaled = amount / scale

  // Format the number
  let formatted
  if (scaled < 10) {
    formatted = scaled.toFixed(2)
  } else if (scaled < 100) {
    formatted = scaled.toFixed(1)
  } else {
    formatted = scaled.toFixed(0)
  }

  // Remove trailing zeros after decimal point
  formatted = formatted.replace(/\.0+$/, "")

  return `${sign}${formatted}${suffix}`
}

// Alias for formatCurrency
export const formatMoney = formatCurrency

// Format large numbers with appropriate suffix
export function formatNumber(num: number): string {
  if (isNaN(num) || num === undefined) return "0"
  if (num === 0) return "0"

  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "UDc",
    "DDc",
    "TDc",
    "QaDc",
    "QiDc",
    "SxDc",
    "SpDc",
    "ODc",
    "NDc",
    "Vi",
    "UV",
    "DV",
    "TV",
    "QaV",
    "QiV",
    "SxV",
    "SpV",
    "OcV",
    "NoV",
    "Tg",
  ]

  // Handle negative numbers
  const sign = num < 0 ? "-" : ""
  num = Math.abs(num)

  // Find the appropriate suffix
  let tier = Math.floor(Math.log10(num) / 3)
  if (tier > suffixes.length - 1) tier = suffixes.length - 1

  const suffix = suffixes[tier]
  const scale = Math.pow(10, tier * 3)

  // Scale the number
  const scaled = num / scale

  // Format the number
  let formatted
  if (scaled < 10) {
    formatted = scaled.toFixed(2)
  } else if (scaled < 100) {
    formatted = scaled.toFixed(1)
  } else {
    formatted = scaled.toFixed(0)
  }

  // Remove trailing zeros after decimal point
  formatted = formatted.replace(/\.0+$/, "")

  return `${sign}${formatted}${suffix}`
}

// Helper function to get month name
export function getMonthName(monthIndex: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[monthIndex]
}
