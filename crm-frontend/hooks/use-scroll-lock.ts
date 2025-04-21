"use client"

import { useEffect } from "react"

export function useScrollLock(lock = true) {
  useEffect(() => {
    if (!lock) return

    // Save initial body style
    const originalStyle = window.getComputedStyle(document.body).overflow
    const originalPadding = window.getComputedStyle(document.body).paddingRight

    // Get width of scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Apply styles to lock scroll
    document.body.style.overflow = "hidden"

    // Add padding to prevent layout shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyle
      document.body.style.paddingRight = originalPadding
    }
  }, [lock])
}
