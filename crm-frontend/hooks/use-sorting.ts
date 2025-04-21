"use client"

import { useState, useCallback } from "react"

type SortDirection = "asc" | "desc"

interface UseSortingOptions<T> {
  initialSortField?: keyof T
  initialSortDirection?: SortDirection
}

export function useSorting<T extends object>({
  initialSortField,
  initialSortDirection = "asc",
}: UseSortingOptions<T> = {}) {
  const [sortField, setSortField] = useState<keyof T | undefined>(initialSortField)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection)

  const toggleSort = useCallback(
    (field: keyof T) => {
      if (sortField === field) {
        // Toggle direction if same field
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        // Set new field and reset direction to asc
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField],
  )

  const sortData = useCallback(
    (data: T[]) => {
      if (!sortField) return [...data]

      return [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue === bValue) return 0

        // Handle different types
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1
        if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1

        // Default comparison
        return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : aValue > bValue ? -1 : 1
      })
    },
    [sortField, sortDirection],
  )

  return {
    sortField,
    sortDirection,
    toggleSort,
    sortData,
  }
}
