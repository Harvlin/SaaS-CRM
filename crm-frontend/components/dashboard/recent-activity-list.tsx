import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/date-utils"

interface Activity {
  id: string
  type: "customer" | "deal" | "task"
  action: string
  subject: string
  timestamp: string
  user: {
    name: string
    avatar?: string
  }
}

interface RecentActivityListProps {
  activities: Activity[]
  isLoading: boolean
}

export function RecentActivityList({ activities, isLoading }: RecentActivityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No recent activity</p>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {activity.user.avatar ? (
              <img
                src={activity.user.avatar || "/placeholder.svg"}
                alt={activity.user.name}
                className="h-10 w-10 rounded-full"
              />
            ) : (
              activity.user.name?.charAt(0) || "?"
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium">{activity.subject}</span>
            </p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
