"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PlusCircle, Search, Filter, MoreHorizontal, CalendarIcon, CheckSquare, Clock, AlertCircle } from "lucide-react"
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
import type { Task, TaskStatus, TaskPriority } from "@/types/task"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/calendar/calendar"
import { format } from "date-fns"

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const data = await api.tasks.getAll()
        setTasks(data)
        setFilteredTasks(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  useEffect(() => {
    // Filter tasks based on search query, status filter, and priority filter
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (task.relatedTo && task.relatedTo.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [searchQuery, statusFilter, priorityFilter, tasks])

  const handleDelete = async (id: string) => {
    try {
      await api.tasks.delete(id)
      setTasks(tasks.filter((task) => task.id !== id))
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const updatedTask = await api.tasks.updateStatus(taskId, newStatus)
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)))
      toast({
        title: "Task updated",
        description: `Task status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline">To Do</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityIcon = (priority: TaskPriority) => {
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

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tasks</h1>
          <Button asChild>
            <Link href="/tasks/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Task
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "list" | "calendar")}
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold">No tasks found</h2>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
            <Button asChild>
              <Link href="/tasks/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-start space-x-3">
                  <div className="pt-0.5">{getPriorityIcon(task.priority)}</div>
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(task.status)}
                      {task.dueDate && (
                        <span className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                      )}
                      {task.relatedTo && <Badge variant="outline">{task.relatedTo.name}</Badge>}
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status !== "completed" && (
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(task.id, "completed")}>
                      Complete
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>View details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}/edit`)}>Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Calendar tasks={filteredTasks} onStatusChange={handleStatusChange} />
        )}
      </div>
    </AppLayout>
  )
}
