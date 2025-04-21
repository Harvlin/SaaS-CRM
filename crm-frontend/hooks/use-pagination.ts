"use client"

import { useState, useCallback } from "react"

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination({ initialPage = 1, initialPageSize = 10 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev))
  }, [])

  const goToPage = useCallback((pageNumber: number) => {
    setPage(pageNumber > 0 ? pageNumber : 1)
  }, [])

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize)
    setPage(1) // Reset to first page when changing page size
  }, [])

  return {
    page,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  }
}
