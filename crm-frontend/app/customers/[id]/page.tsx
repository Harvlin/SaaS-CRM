"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Phone, Mail, Building, Clock, Plus, FileText, DollarSign } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Customer } from "@/types/customer"
import type { Deal } from "@/types/deal"
import type { Task } from "@/types/task"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
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

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true)
      try {
        const customerData = await api.customers.getById(params.id)
        setCustomer(customerData)

        // Fetch related deals and tasks
        const allDeals = await api.deals.getAll()
        const customerDeals = allDeals.filter((deal) => deal.customerId === params.id)
        setDeals(customerDeals)

        const allTasks = await api.tasks.getAll()
        const customerTasks = allTasks.filter(
          (task) => task.relatedTo?.type === "customer" && task.relatedTo.id === params.id,
        )
        setTasks(customerTasks)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive",
        })
        router.push("/customers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [params.id, router])

  const handleDelete = async () => {
    try {
      await api.customers.delete(params.id)
      toast({
        title: "Customer deleted",
        description: "Customer has been deleted successfully",
      })
      router.push("/customers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      case "lead":
        return <Badge className="bg-amber-500">Lead</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Skeleton className="h-8 w-[200px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-[100px]" />
              <Skeleton className="h-9 w-[100px]" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!customer) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h2 className="text-2xl font-bold">Customer not found</h2>
          <p className="text-muted-foreground mb-4">
            The customer you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            {getStatusBadge(customer.status)}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/customers/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the customer and all associated data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg">
                  {customer.avatar ? (
                    <img
                      src={customer.avatar || "/placeholder.svg"}
                      alt={customer.name}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    customer.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">{customer.company || "No company"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.company && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.company}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Customer since {format(new Date(customer.createdAt), "MMMM d, yyyy")}</span>
                </div>
              </div>

              {customer.notes && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{deals.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">
                      ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Open Tasks</p>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">
                      {tasks.filter((task) => task.status !== "completed").length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Last Contact</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">
                      {customer.lastContact
                        ? format(new Date(customer.lastContact), "MMM d, yyyy")
                        : "No recent contact"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deals">
          <TabsList>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="deals" className="pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Deals</CardTitle>
                <Button asChild size="sm">
                  <Link href={`/deals/new?customerId=${params.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Deal
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {deals.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No deals yet</h3>
                    <p className="text-muted-foreground">Create a new deal for this customer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{deal.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>${deal.value.toLocaleString()}</span>
                            <span>•</span>
                            <Badge variant="outline">{deal.status}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/deals/${deal.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="pt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Tasks</CardTitle>
                <Button asChild size="sm">
                  <Link href={`/tasks/new?customerId=${params.id}`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">No tasks yet</h3>
                    <p className="text-muted-foreground">Create a new task for this customer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{task.status}</Badge>
                            {task.dueDate && (
                              <>
                                <span>•</span>
                                <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/tasks/${task.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
