"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, LineChart } from "@/components/charts"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { DollarSign, Users, TrendingUp, BarChart4 } from "lucide-react"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [salesData, setSalesData] = useState([])
  const [customerData, setCustomerData] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    leads: 0,
    growth: 0,
    acquisitionData: [],
  })
  const [dealData, setDealData] = useState({
    totalValue: 0,
    avgDealSize: 0,
    winRate: 0,
    conversionTime: 0,
    stageData: [],
    statusData: [],
  })

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true)
      try {
        const [salesOverview, customerMetrics, dealMetrics] = await Promise.all([
          api.analytics.getSalesOverview(period),
          api.analytics.getCustomerMetrics(),
          api.analytics.getDealMetrics(),
        ])

        setSalesData(salesOverview.data)
        setCustomerData(customerMetrics)
        setDealData(dealMetrics)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [period])

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Analytics</h1>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">${dealData.totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {dealData.growth >= 0 ? "+" : ""}
                    {dealData.growth}% from previous period
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
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{customerData.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {customerData.growth >= 0 ? "+" : ""}
                    {customerData.growth}% from previous period
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{dealData.winRate}%</div>
                  <p className="text-xs text-muted-foreground">Based on closed deals</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-[100px]" />
              ) : (
                <>
                  <div className="text-2xl font-bold">${dealData.avgDealSize.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Per closed deal</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales">
          <TabsList>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {isLoading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : (
                  <LineChart
                    data={salesData}
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
          </TabsContent>
          <TabsContent value="customers" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Status</CardTitle>
                  <CardDescription>Distribution of customers by status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <BarChart
                      data={[
                        { name: "Active", value: customerData.active },
                        { name: "Inactive", value: customerData.inactive },
                        { name: "Leads", value: customerData.leads },
                      ]}
                      categories={["value"]}
                      index="name"
                      colors={["#3b82f6"]}
                      valueFormatter={(value) => value.toString()}
                      height={350}
                    />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Customer Acquisition</CardTitle>
                  <CardDescription>New customers over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <LineChart
                      data={customerData.acquisitionData}
                      categories={["New Customers"]}
                      index="date"
                      colors={["#3b82f6"]}
                      valueFormatter={(value) => value.toString()}
                      height={350}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="deals" className="pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Deal Stages</CardTitle>
                  <CardDescription>Distribution of deals by stage</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <BarChart
                      data={dealData.stageData}
                      categories={["count"]}
                      index="stage"
                      colors={["#3b82f6"]}
                      valueFormatter={(value) => value.toString()}
                      height={350}
                    />
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Deal Status</CardTitle>
                  <CardDescription>Distribution of deals by status</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <BarChart
                      data={dealData.statusData}
                      categories={["value"]}
                      index="status"
                      colors={["#3b82f6"]}
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      height={350}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
