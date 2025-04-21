export type TaskPriority = "low" | "medium" | "high"
export type TaskStatus = "todo" | "in-progress" | "completed"

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedTo?: string
  relatedTo?: {
    type: "customer" | "deal"
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assignedTo?: string
  relatedTo?: {
    type: "customer" | "deal"
    id: string
  }
}
