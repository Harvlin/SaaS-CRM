"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle2 } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface CalendarProps {
  tasks: Task[]
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>
}

export function Calendar({ tasks, onStatusChange }: CalendarProps) {
  const router = useRouter()
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = useState(today)
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 }),
  })

  function previousMonth() {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  const selectedDayTasks = tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), selectedDay))

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => task.dueDate && isSameDay(new Date(task.dueDate), day))
  }

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-xl">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentMonth(format(today, "MMM-yyyy"))
              setSelectedDay(today)
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 mt-6 text-xs leading-6 text-center text-muted-foreground">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7 mt-2 text-sm">
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={`
              py-1.5 relative
              ${dayIdx === 0 ? "col-start-" + (getDay(day) + 1) : ""}
            `}
          >
            <button
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`
                mx-auto flex h-8 w-8 items-center justify-center rounded-full
                ${isEqual(day, selectedDay) ? "bg-primary text-primary-foreground" : ""}
                ${!isEqual(day, selectedDay) && isToday(day) ? "bg-accent text-accent-foreground" : ""}
                ${!isEqual(day, selectedDay) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) ? "text-foreground" : "text-muted-foreground"}
              `}
            >
              <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
            </button>

            {getTasksForDay(day).length > 0 && (
              <div className="absolute bottom-1 w-full flex justify-center">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Tasks for {format(selectedDay, "MMMM d, yyyy")}</h2>

        <div className="mt-4 space-y-2">
          {selectedDayTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tasks for this day.</p>
          ) : (
            selectedDayTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={task.status === "completed" ? "default" : "outline"}>
                          {task.status === "todo"
                            ? "To Do"
                            : task.status === "in-progress"
                              ? "In Progress"
                              : "Completed"}
                        </Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                        {task.relatedTo && <span className="text-xs text-muted-foreground">{task.relatedTo.name}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {task.status !== "completed" && (
                        <Button variant="ghost" size="icon" onClick={() => onStatusChange(task.id, "completed")}>
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="sr-only">Complete</span>
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
                          <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}/edit`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onStatusChange(task.id, "todo")}>
                            Mark as To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
                            Mark as Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
