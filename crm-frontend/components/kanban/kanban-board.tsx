"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Deal, DealStatus } from "@/types/deal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, ExternalLink, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface KanbanBoardProps {
  deals: Deal[]
  onStatusChange: (dealId: string, newStatus: DealStatus) => Promise<void>
  onDelete: (dealId: string) => Promise<void>
}

export function KanbanBoard({ deals, onStatusChange, onDelete }: KanbanBoardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const columns: { id: DealStatus; title: string }[] = [
    { id: "lead", title: "Lead" },
    { id: "qualified", title: "Qualified" },
    { id: "proposal", title: "Proposal" },
    { id: "negotiation", title: "Negotiation" },
    { id: "closed-won", title: "Closed Won" },
    { id: "closed-lost", title: "Closed Lost" },
  ]

  const handleDragStart = useCallback(
    (e: React.DragEvent, dealId: string) => {
      try {
        e.dataTransfer.setData("dealId", dealId)
        setDraggingId(dealId)
      } catch (error) {
        console.error("Drag start error:", error)
        toast({
          title: "Error",
          description: "There was an issue starting the drag operation",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent, status: DealStatus) => {
      e.preventDefault()

      if (isProcessing) return

      try {
        const dealId = e.dataTransfer.getData("dealId")
        setDraggingId(null)

        if (dealId) {
          const deal = deals.find((d) => d.id === dealId)
          if (deal && deal.status !== status) {
            setIsProcessing(true)
            await onStatusChange(dealId, status)
          }
        }
      } catch (error) {
        console.error("Drop error:", error)
        toast({
          title: "Error",
          description: "Failed to update deal status",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [deals, isProcessing, onStatusChange, toast],
  )

  const getColumnDeals = useCallback(
    (status: DealStatus) => {
      return deals.filter((deal) => deal.status === status)
    },
    [deals],
  )

  const getColumnTotal = useCallback(
    (status: DealStatus) => {
      return getColumnDeals(status).reduce((sum, deal) => sum + deal.value, 0)
    },
    [getColumnDeals],
  )

  return (
    <div className="flex overflow-x-auto pb-4 space-x-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="bg-card rounded-lg border shadow-sm h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{column.title}</h3>
                <Badge variant="outline">{getColumnDeals(column.id).length}</Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                {getColumnTotal(column.id).toLocaleString()}
              </div>
            </div>
            <div className="p-2 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
              {getColumnDeals(column.id).length === 0 ? (
                <div className="flex items-center justify-center h-24 border border-dashed rounded-lg m-2">
                  <p className="text-sm text-muted-foreground">No deals</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getColumnDeals(column.id).map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      className={`border rounded-lg bg-background p-3 cursor-move ${
                        draggingId === deal.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{deal.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/deals/${deal.id}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/deals/${deal.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the deal. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(deal.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{deal.customerName || "No customer"}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
                        {deal.closingDate && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(deal.closingDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
