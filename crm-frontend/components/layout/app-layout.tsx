"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render layout on login page
  if (pathname === "/login" || pathname === "/register") {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (!isMounted || (isLoading && !isAuthenticated)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  // If not authenticated and not loading, the auth provider will redirect to login
  if (!isAuthenticated && !isLoading) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-secondary/30">{children}</main>
      </div>
    </div>
  )
}
