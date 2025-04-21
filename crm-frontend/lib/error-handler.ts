"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function useGlobalErrorHandler() {
  const { toast } = useToast()

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason)

      // Prevent default browser handling
      event.preventDefault()

      // Show toast notification
      toast({
        title: "An error occurred",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    }

    // Add event listener
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Clean up
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [toast])

  return null
}
