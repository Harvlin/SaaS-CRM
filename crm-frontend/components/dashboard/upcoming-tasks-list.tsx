"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Task, TaskStatus } from "@/types/task"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UpcomingTasksListProps {
  isLoading: boolean
}

export function UpcomingTasksList({ isLoading }: UpcomingTasksListProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await api.tasks.getAll()
        // Filter to only show incomplete tasks
        const upcomingTasks = tasksData
          .filter((task) => task.status !== "completed")
          .sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          })
          .slice(0, 5)

        setTasks(upcomingTasks)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!isLoading) {
      fetchTasks()
    }
  }, [isLoading, toast])

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      await api.tasks.updateStatus(taskId, status)
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
      toast({
        title: "Task updated",
        description: "Task status has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "medium":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "low":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      default:
        return null
    }
  }

  if (loading || isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-9 w-[100px]" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">All caught up!</h3>
        <p className="text-muted-foreground">You have no pending tasks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center">
              {getPriorityIcon(task.priority)}
              <span className="ml-2 font-medium">{task.title}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {task.dueDate && <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>}
              {task.relatedTo && (
                <Badge variant="outline" className="ml-2">
                  {task.relatedTo.name}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => updateTaskStatus(task.id, "completed")}>
            Complete
          </Button>
        </div>
      ))}
    </div>
  )
}
