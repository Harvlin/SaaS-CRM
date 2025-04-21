import { format, formatDistanceToNow, isValid } from "date-fns"

/**
 * Safely format a date string
 * @param dateString Date string to format
 * @param formatString Format string for date-fns
 * @param fallback Fallback string if date is invalid
 * @returns Formatted date string or fallback
 */
export function formatDate(
  dateString: string | undefined | null,
  formatString = "MMM d, yyyy",
  fallback = "N/A",
): string {
  if (!dateString) return fallback

  try {
    const date = new Date(dateString)
    if (!isValid(date)) return fallback
    return format(date, formatString)
  } catch (error) {
    console.error("Date formatting error:", error)
    return fallback
  }
}

/**
 * Safely format a date as relative time (e.g., "2 days ago")
 * @param dateString Date string to format
 * @param fallback Fallback string if date is invalid
 * @returns Relative time string or fallback
 */
export function formatRelativeTime(dateString: string | undefined | null, fallback = "N/A"): string {
  if (!dateString) return fallback

  try {
    const date = new Date(dateString)
    if (!isValid(date)) return fallback
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    console.error("Date formatting error:", error)
    return fallback
  }
}
