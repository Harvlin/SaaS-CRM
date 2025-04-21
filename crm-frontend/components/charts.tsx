"use client"

import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Line,
  LineChart as RechartsLineChart,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

interface ChartProps {
  data: any[]
  categories: string[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  height?: number
}

export function LineChart({
  data,
  categories,
  index,
  colors = ["#3b82f6"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  height = 300,
}: ChartProps) {
  return (
    <ChartContainer className="h-full w-full" style={{ height: height }}>
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              width={yAxisWidth}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => valueFormatter(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent valueFormatter={valueFormatter} categories={categories} colors={colors} />}
            />
            <ChartLegend content={<ChartLegendContent categories={categories} colors={colors} />} />
            {categories.map((category, i) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}

export function BarChart({
  data,
  categories,
  index,
  colors = ["#3b82f6"],
  valueFormatter = (value: number) => value.toString(),
  height = 300,
}: ChartProps) {
  return (
    <ChartContainer className="h-full w-full" style={{ height: height }}>
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => value}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => valueFormatter(value)} />
            <ChartTooltip
              content={<ChartTooltipContent valueFormatter={valueFormatter} categories={categories} colors={colors} />}
            />
            <ChartLegend content={<ChartLegendContent categories={categories} colors={colors} />} />
            {categories.map((category, i) => (
              <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}
