"use client"

import { useState, useCallback } from "react"
import { useToast } from "./use-toast"

interface UseClipboardOptions {
  successDuration?: number
  onSuccess?: () => void
  onError?: (error: Error) => void
  showToast?: boolean
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { successDuration = 2000, onSuccess, onError, showToast = true } = options

  const [hasCopied, setHasCopied] = useState(false)
  const [value, setValue] = useState<string>("")
  const { toast } = useToast()

  const copy = useCallback(
    async (textToCopy: string) => {
      try {
        await navigator.clipboard.writeText(textToCopy)
        setValue(textToCopy)
        setHasCopied(true)

        if (showToast) {
          toast({
            title: "Copied to clipboard",
            description: "The text has been copied to your clipboard.",
          })
        }

        if (onSuccess) {
          onSuccess()
        }

        // Reset after successDuration
        setTimeout(() => {
          setHasCopied(false)
        }, successDuration)
      } catch (error) {
        console.error("Failed to copy text:", error)

        if (showToast) {
          toast({
            title: "Copy failed",
            description: "Failed to copy text to clipboard.",
            variant: "destructive",
          })
        }

        if (onError && error instanceof Error) {
          onError(error)
        }
      }
    },
    [successDuration, onSuccess, onError, showToast, toast],
  )

  return { copy, hasCopied, value }
}
