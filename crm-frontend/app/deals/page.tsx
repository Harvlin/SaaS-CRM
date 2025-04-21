"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, Filter, MoreHorizontal, ArrowUpDown } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Deal, DealStatus } from "@/types/deal"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DealsPage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  useEffect(() => {
    const fetchDeals = async () => {
      setIsLoading(true)
      try {
        const data = await api.deals.getAll()
        setDeals(data)
        setFilteredDeals(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load deals",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeals()
  }, [])

  useEffect(() => {
    // Filter deals based on search query and status filter
    let filtered = deals

    if (searchQuery) {
      filtered = filtered.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((deal) => deal.status === statusFilter)
    }

    setFilteredDeals(filtered)
  }, [searchQuery, statusFilter, deals])

  const handleDelete = async (id: string) => {
    try {
      await api.deals.delete(id)
      setDeals(deals.filter((deal) => deal.id !== id))
      toast({
        title: "Deal deleted",
        description: "Deal has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (dealId: string, newStatus: DealStatus) => {
    try {
      const updatedDeal = await api.deals.updateStatus(dealId, newStatus)
      setDeals(deals.map((deal) => (deal.id === dealId ? updatedDeal : deal)))
      toast({
        title: "Deal updated",
        description: `Deal status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deal status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: DealStatus) => {
    switch (status) {
      case "lead":
        return <Badge variant="outline">Lead</Badge>
      case "qualified":
        return <Badge className="bg-blue-500">Qualified</Badge>
      case "proposal":
        return <Badge className="bg-amber-500">Proposal</Badge>
      case "negotiation":
        return <Badge className="bg-purple-500">Negotiation</Badge>
      case "closed-won":
        return <Badge className="bg-green-500">Closed Won</Badge>
      case "closed-lost":
        return <Badge className="bg-destructive">Closed Lost</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Deals</h1>
          <Button asChild>
            <Link href="/deals/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Deal
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search deals..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed-won">Closed Won</SelectItem>
                <SelectItem value="closed-lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "kanban" | "list")}
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
            <h2 className="text-xl font-bold">No deals found</h2>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
            <Button asChild>
              <Link href="/deals/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Deal
              </Link>
            </Button>
          </div>
        ) : viewMode === "kanban" ? (
          <KanbanBoard deals={filteredDeals} onStatusChange={handleStatusChange} onDelete={handleDelete} />
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Deal</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Value</th>
                  <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="border-b">
                    <td className="p-4 align-middle font-medium">{deal.title}</td>
                    <td className="p-4 align-middle">{deal.customerName}</td>
                    <td className="p-4 align-middle">${deal.value.toLocaleString()}</td>
                    <td className="p-4 align-middle">{getStatusBadge(deal.status)}</td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/deals/${deal.id}`)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/deals/${deal.id}/edit`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(deal.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
