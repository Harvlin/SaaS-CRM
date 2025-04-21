"use client"

import { useState, useEffect, useRef } from "react"

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { root = null, rootMargin = "0px", threshold = 0, freezeOnceVisible = false } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const elementRef = useRef<Element | null>(null)
  const frozen = freezeOnceVisible && hasBeenVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
    setIsVisible(entry.isIntersecting)

    if (entry.isIntersecting && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }

  useEffect(() => {
    const node = elementRef.current

    // Do nothing if element ref is empty or we're frozen
    if (!node || frozen) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return { ref: elementRef, entry, isVisible, hasBeenVisible }
}
