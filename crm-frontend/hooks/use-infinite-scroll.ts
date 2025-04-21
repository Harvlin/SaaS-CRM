"use client"

import { useState, useEffect, useCallback } from "react"
import { useIntersectionObserver } from "./use-intersection-observer"

interface UseInfiniteScrollOptions<T> {
  initialData?: T[]
  fetchItems: (page: number) => Promise<T[]>
  hasMore?: boolean
  pageSize?: number
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll<T>({
  initialData = [],
  fetchItems,
  hasMore: initialHasMore = true,
  pageSize = 10,
  threshold = 0.5,
  rootMargin = "0px",
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialData)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(initialHasMore)

  // Create intersection observer hook
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
  })

  // Load more items when the sentinel becomes visible
  useEffect(() => {
    if (isVisible && hasMore && !loading) {
      loadMore()
    }
  }, [isVisible, hasMore, loading])

  // Function to load more items
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newItems = await fetchItems(page)

      if (newItems.length === 0 || newItems.length < pageSize) {
        setHasMore(false)
      }

      setItems((prevItems) => [...prevItems, ...newItems])
      setPage((prevPage) => prevPage + 1)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load more items"))
    } finally {
      setLoading(false)
    }
  }, [fetchItems, page, loading, hasMore, pageSize])

  // Function to reset the infinite scroll
  const reset = useCallback(() => {
    setItems(initialData)
    setPage(1)
    setLoading(false)
    setError(null)
    setHasMore(initialHasMore)
  }, [initialData, initialHasMore])

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    sentinelRef: ref,
  }
}
