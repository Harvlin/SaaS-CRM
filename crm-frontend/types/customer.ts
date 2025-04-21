export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "active" | "inactive" | "lead"
  notes?: string
  lastContact?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerFormData {
  name: string
  email: string
  phone?: string
  company?: string
  status: "active" | "inactive" | "lead"
  notes?: string
}
