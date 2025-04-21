"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/error-utils"

interface UseAsyncActionOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: unknown) => void
  successMessage?: string
  errorMessage?: string
}

export function useAsyncAction<T>(asyncFn: (...args: any[]) => Promise<T>, options: UseAsyncActionOptions<T> = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const execute = useCallback(
    async (...args: any[]) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await asyncFn(...args)

        if (options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          })
        }

        if (options.onSuccess) {
          options.onSuccess(result)
        }

        return result
      } catch (err) {
        const errorMsg = getErrorMessage(err)
        setError(errorMsg)

        toast({
          title: "Error",
          description: options.errorMessage || errorMsg,
          variant: "destructive",
        })

        if (options.onError) {
          options.onError(err)
        }

        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [asyncFn, options, toast],
  )

  return {
    execute,
    isLoading,
    error,
    reset: () => setError(null),
  }
}
