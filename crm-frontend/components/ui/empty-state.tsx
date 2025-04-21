"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title,
  description,
  icon = <AlertTriangle className="h-10 w-10 text-muted-foreground" />,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={action.onClick}>{action.label}</Button>
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-10 w-10 text-destructive" />}
      title="Failed to load data"
      description="There was an error loading the data. Please try again."
      action={
        onRetry
          ? {
              label: "Try again",
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}

export function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">Loading data...</p>
    </div>
  )
}
