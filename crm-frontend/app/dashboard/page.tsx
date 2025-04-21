"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppLayout } from "@/components/layout/app-layout"
import { api } from "@/lib/api"
import { BarChart, LineChart } from "@/components/charts"
import { DollarSign, Users, CheckSquare, TrendingUp, RefreshCw } from "lucide-react"
import { RecentActivityList } from "@/components/dashboard/recent-activity-list"
import { UpcomingTasksList } from "@/components/dashboard/upcoming-tasks-list"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/ui/empty-state"

export default function DashboardPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalDeals: 0,
    totalTasks: 0,
    totalRevenue: 0,
    revenueChange: 0,
    customerChange: 0,
    dealsChange: 0,
    tasksChange: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [salesData, setSalesData] = useState([])
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Use Promise.allSettled to prevent one failed request from blocking others
      const [summaryResult, activityResult, salesResult] = await Promise.allSettled([
        api.dashboard.getSummary(),
        api.dashboard.getRecentActivity(),
        api.analytics.getSalesOverview("month"),
      ])

      // Handle each result individually
      if (summaryResult.status === "fulfilled") {
        setSummary(
          summaryResult.value || {
            totalCustomers: 0,
            totalDeals: 0,
            totalTasks: 0,
            totalRevenue: 0,
            revenueChange: 0,
            customerChange: 0,
            dealsChange: 0,
            tasksChange: 0,
          },
        )
      } else {
        console.error("Summary data error:", summaryResult.reason)
      }

      if (activityResult.status === "fulfilled") {
        setRecentActivity(activityResult.value || [])
      } else {
        console.error("Activity data error:", activityResult.reason)
      }

      if (salesResult.status === "fulfilled") {
        setSalesData(salesResult.value?.data || [])
      } else {
        console.error("Sales data error:", salesResult.reason)
      }

      // If all requests failed, set an error
      if (
        summaryResult.status === "rejected" &&
        activityResult.status === "rejected" &&
        salesResult.status === "rejected"
      ) {
        setError("Failed to load dashboard data. Please try again.")
      }
    } catch (error: any) {
      console.error("Dashboard data error:", error)
      setError("Failed to load dashboard data. Please try refreshing the page.")
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [toast])

  // Fallback data for charts if API fails
  const fallbackChartData = [
    { date: "Jan", Revenue: 0 },
    { date: "Feb", Revenue: 0 },
    { date: "Mar", Revenue: 0 },
  ]

  const fallbackDealData = [
    { name: "Lead", value: 0 },
    { name: "Qualified", value: 0 },
    { name: "Proposal", value: 0 },
    { name: "Negotiation", value: 0 },
    { name: "Closed Won", value: 0 },
    { name: "Closed Lost", value: 0 },
  ]

  if (error) {
    return (
      <AppLayout>
        <ErrorState onRetry={fetchDashboardData} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.revenueChange >= 0 ? "+" : ""}
                    {summary.revenueChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.customerChange >= 0 ? "+" : ""}
                    {summary.customerChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary.totalDeals}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.dealsChange >= 0 ? "+" : ""}
                    {summary.dealsChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{summary.totalTasks}</div>
                  <p className="text-xs text-muted-foreground">
                    {summary.tasksChange >= 0 ? "+" : ""}
                    {summary.tasksChange}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : (
                <LineChart
                  data={salesData.length > 0 ? salesData : fallbackChartData}
                  categories={["Revenue"]}
                  index="date"
                  colors={["#3b82f6"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  yAxisWidth={60}
                  height={350}
                />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList activities={recentActivity} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Tasks</TabsTrigger>
              <TabsTrigger value="deals">Deal Distribution</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="upcoming" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks that need your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingTasksList isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="deals" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Deal Distribution</CardTitle>
                <CardDescription>Current deals by stage</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <BarChart
                    data={fallbackDealData}
                    categories={["value"]}
                    index="name"
                    colors={["#3b82f6"]}
                    valueFormatter={(value) => value.toString()}
                    height={350}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
