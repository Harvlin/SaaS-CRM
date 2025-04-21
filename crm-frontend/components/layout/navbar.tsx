"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Menu, X, User, LogOut, Settings, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  const { user, logout, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.startsWith("/customers")) return "Customers"
    if (pathname.startsWith("/deals")) return "Deals"
    if (pathname.startsWith("/tasks")) return "Tasks"
    if (pathname.startsWith("/analytics")) return "Analytics"
    if (pathname.startsWith("/settings")) return "Settings"
    if (pathname.startsWith("/help")) return "Help"
    return "CRM System"
  }

  return (
    <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <h1 className="text-lg font-semibold">{getPageTitle()}</h1>

      <div className="ml-auto flex items-center space-x-2">
        {searchOpen ? (
          <div className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pr-8"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
              {isLoading ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user?.name ? user.name.charAt(0) : "?"}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
