/**
 * Utility functions for error handling and safe operations
 */

// Log errors with context
export function logError(error: unknown, context: string): void {
  console.error(`Error in ${context}:`, error)

  // In a production app, you might want to send this to a logging service
  // Example: sendToErrorLoggingService(error, context)
}

// Safely handle numbers to prevent NaN
export function safeNumber(value: any, defaultValue = 0): number {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return defaultValue
  }
  return Number(value)
}

// Safely perform calculations
export function safeCalculation(calculation: () => number, defaultValue = 0): number {
  try {
    const result = calculation()
    return isNaN(result) ? defaultValue : result
  } catch (error) {
    logError(error, "safeCalculation")
    return defaultValue
  }
}

// Safely access nested object properties
export function safeAccess<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const parts = path.split(".")
    let current = obj

    for (const part of parts) {
      if (current === null || current === undefined) {
        return defaultValue
      }
      current = current[part]
    }

    return current === null || current === undefined ? defaultValue : (current as T)
  } catch (error) {
    logError(error, `safeAccess: ${path}`)
    return defaultValue
  }
}

// Format a number with at most 2 decimal places and remove trailing zeros
export function formatNumberSafe(value: any): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return "0"
  }

  const num = Number(value)
  const formatted = num.toFixed(2)
  return formatted.replace(/\.?0+$/, "") || "0"
}

// Ensure any value is converted to a string safely
export function ensureString(value: any): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "number" && isNaN(value)) {
    return "0"
  }

  return String(value)
}

// Wrap a function with error handling
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  context: string,
  fallbackValue?: ReturnType<T>,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args)
    } catch (error) {
      logError(error, context)
      return fallbackValue as ReturnType<T>
    }
  }
}
