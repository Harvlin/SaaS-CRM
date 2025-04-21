"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/user"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const userData = await api.auth.me()
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
        // Don't show error toast on initial load
        // as this is expected when not logged in
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated and not on login page
    if (!isLoading && !isAuthenticated && pathname !== "/login" && pathname !== "/register") {
      router.push("/login")
    }

    // Redirect to dashboard if authenticated and on login page
    if (!isLoading && isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await api.auth.login(email, password)
      setUser(userData)
      setIsAuthenticated(true)
      router.push("/dashboard")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Invalid credentials"
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await api.auth.logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await api.auth.register(name, email, password)
      setUser(userData)
      setIsAuthenticated(true)
      router.push("/dashboard")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Registration failed"
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
