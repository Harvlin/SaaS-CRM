"use client"

import { useEffect, useCallback } from "react"

type KeyCombo = string | string[]
type KeyHandler = (e: KeyboardEvent) => void

interface KeyboardShortcutOptions {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  disabled?: boolean
}

export function useKeyboardShortcut(keys: KeyCombo, callback: KeyHandler, options: KeyboardShortcutOptions = {}) {
  const { ctrl = false, alt = false, shift = false, meta = false, disabled = false } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if shortcut is disabled
      if (disabled) return

      // Check if modifier keys match
      if (ctrl !== event.ctrlKey) return
      if (alt !== event.altKey) return
      if (shift !== event.shiftKey) return
      if (meta !== event.metaKey) return

      // Convert keys to array if it's a string
      const keysArray = Array.isArray(keys) ? keys : [keys]

      // Check if the pressed key is in our keys array
      if (keysArray.includes(event.key.toLowerCase())) {
        event.preventDefault()
        callback(event)
      }
    },
    [keys, callback, ctrl, alt, shift, meta, disabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])
}
