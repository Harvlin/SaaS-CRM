"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CheckSquare,
  BarChart4,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      active: pathname.startsWith("/customers"),
    },
    {
      label: "Deals",
      icon: DollarSign,
      href: "/deals",
      active: pathname.startsWith("/deals"),
    },
    {
      label: "Tasks",
      icon: CheckSquare,
      href: "/tasks",
      active: pathname.startsWith("/tasks"),
    },
    {
      label: "Analytics",
      icon: BarChart4,
      href: "/analytics",
      active: pathname.startsWith("/analytics"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname.startsWith("/settings"),
    },
    {
      label: "Help",
      icon: HelpCircle,
      href: "/help",
      active: pathname.startsWith("/help"),
    },
  ]

  return (
    <div
      className={cn(
        "relative h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center">
          {open ? <h1 className="text-xl font-bold">CRM System</h1> : <span className="text-xl font-bold">CRM</span>}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="ml-auto">
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="py-4 px-2">
          <nav className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <route.icon className={cn("h-5 w-5", open ? "mr-3" : "mx-auto")} />
                {open && <span>{route.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>

      {open && (
        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-card">
          {isLoading ? (
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user && user.name ? user.name.charAt(0) : "?"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user && user.name ? user.name : "User"}</p>
                <p className="text-xs text-muted-foreground">{user && user.email ? user.email : ""}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">?</div>
              <div className="ml-3">
                <p className="text-sm font-medium">Guest</p>
                <p className="text-xs text-muted-foreground">Not signed in</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
