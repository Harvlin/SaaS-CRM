"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { debounce } from "@/lib/debounce"

interface UseFilterOptions<T> {
  data: T[]
  searchFields?: (keyof T)[]
  filterFields?: Record<string, (item: T, value: any) => boolean>
  debounceMs?: number
}

export function useFilter<T extends object>({
  data,
  searchFields = [],
  filterFields = {},
  debounceMs = 300,
}: UseFilterOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [filteredData, setFilteredData] = useState<T[]>(data)

  // Create debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query)
    }, debounceMs),
    [debounceMs],
  )

  // Handle search input change
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value)
    },
    [debouncedSearch],
  )

  // Set a filter value
  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setFilters({})
  }, [])

  // Apply filters and search whenever dependencies change
  useEffect(() => {
    let result = [...data]

    // Apply search if searchQuery exists and searchFields are provided
    if (searchQuery && searchFields.length > 0) {
      const lowerQuery = searchQuery.toLowerCase()
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return value !== null && value !== undefined && String(value).toLowerCase().includes(lowerQuery)
        }),
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      // Skip empty filter values
      if (value === "" || value === null || value === undefined || value === "all") {
        return
      }

      // Use custom filter function if provided
      if (filterFields[key]) {
        result = result.filter((item) => filterFields[key](item, value))
      } else if (result.length > 0 && key in result[0]) {
        // Default equality filter - only apply if there are items and the key exists
        result = result.filter((item) => item[key as keyof T] === value)
      }
    })

    setFilteredData(result)
  }, [data, searchQuery, filters, searchFields, filterFields])

  return {
    filteredData,
    searchQuery,
    filters,
    handleSearchChange,
    setFilter,
    resetFilters,
  }
}
