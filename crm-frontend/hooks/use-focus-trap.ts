"use client"

import { useEffect, useRef } from "react"

export function useFocusTrap(active = true) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active) return

    const root = ref.current
    if (!root) return

    // Find all focusable elements
    const focusableElements = root.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
    )

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus the first element
    firstElement.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [active])

  return ref
}
