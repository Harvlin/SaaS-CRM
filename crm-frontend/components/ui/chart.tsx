"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full rounded-md border", className)} {...props} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("relative", className)} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltipContent = ({ categories, colors, valueFormatter, payload }: any) => {
  if (!payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border p-2 bg-popover text-popover-foreground">
      <p className="font-semibold">{payload[0].payload.date}</p>
      {categories.map((category: string, i: number) => (
        <p key={category} className="text-sm">
          <span
            className="inline-block mr-2 w-2 h-2 rounded-full"
            style={{ backgroundColor: colors[i % colors.length] }}
          ></span>
          {category}: {valueFormatter(payload[0].payload[category])}
        </p>
      ))}
    </div>
  )
}

const ChartLegendContent = ({ categories, colors }: any) => {
  return (
    <div className="flex items-center space-x-4">
      {categories.map((category: string, i: number) => (
        <div key={category} className="flex items-center">
          <span
            className="inline-block mr-2 w-3 h-3 rounded-full"
            style={{ backgroundColor: colors[i % colors.length] }}
          ></span>
          <span className="text-sm">{category}</span>
        </div>
      ))}
    </div>
  )
}

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("", className)} {...props} />,
)
ChartLegend.displayName = "ChartLegend"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
