import { AxiosError } from "axios"

/**
 * Extract a user-friendly error message from an API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle Axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const data = error.response.data
      if (data?.message) {
        return data.message
      }
      if (data?.error) {
        return data.error
      }
      return `Server error: ${error.response.status}`
    } else if (error.request) {
      // The request was made but no response was received
      return "No response from server. Please check your internet connection."
    }
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return error.message
  }

  return "An unknown error occurred"
}

/**
 * Check if an error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request
  }
  return false
}

/**
 * Check if an error is a server error (5xx)
 */
export function isServerError(error: unknown): boolean {
  if (error instanceof AxiosError && error.response) {
    return error.response.status >= 500
  }
  return false
}

/**
 * Check if an error is an authentication error (401)
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError && error.response) {
    return error.response.status === 401
  }
  return false
}
