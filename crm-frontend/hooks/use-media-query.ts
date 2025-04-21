"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Check if window is available (client-side)
    if (typeof window === "undefined") return

    const media = window.matchMedia(query)

    // Set initial value
    setMatches(media.matches)

    // Create listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    media.addEventListener("change", listener)

    // Clean up
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  // Return false on the server, actual value on the client
  return isClient ? matches : false
}

// Predefined media queries
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)")
}

export function useIsDarkMode() {
  return useMediaQuery("(prefers-color-scheme: dark)")
}
