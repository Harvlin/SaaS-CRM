export type DealStatus = "lead" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost"

export interface Deal {
  id: string
  title: string
  value: number
  status: DealStatus
  customerId: string
  customerName: string
  description?: string
  closingDate?: string
  probability?: number
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface DealFormData {
  title: string
  value: number
  status: DealStatus
  customerId: string
  description?: string
  closingDate?: string
  probability?: number
  assignedTo?: string
}
