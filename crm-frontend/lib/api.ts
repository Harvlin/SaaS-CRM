import axios from "axios"
import type { User } from "@/types/user"
import type { Customer, CustomerFormData } from "@/types/customer"
import type { Deal, DealFormData } from "@/types/deal"
import type { Task, TaskFormData } from "@/types/task"
import * as mockData from "./mock-data"

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development"

// Create axios instance with base URL and credentials
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased timeout to 30 seconds
})

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: any) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message)
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
        originalError: error,
      })
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    // Handle 500 server errors
    if (error.response?.status >= 500) {
      console.error("Server Error:", error.response)
      return Promise.reject({
        message: "Server error. Please try again later.",
        originalError: error,
      })
    }

    return Promise.reject(error)
  },
)

// Helper function to handle API requests with proper error handling and mock data support
function apiRequest<T>(method: "get" | "post" | "put" | "delete" | "patch", url: string, data?: any): Promise<T> {
  // If in development mode, use mock data
  if (isDevelopment) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Handle different endpoints with mock data
        if (url === "/auth/me") {
          resolve({
            id: "user1",
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as unknown as T)
        } else if (url === "/dashboard/summary") {
          resolve(mockData.dashboardSummary as unknown as T)
        } else if (url === "/dashboard/activity") {
          resolve(mockData.recentActivity as unknown as T)
        } else if (url.startsWith("/analytics/sales")) {
          resolve({ data: mockData.salesData } as unknown as T)
        } else if (url === "/analytics/customers") {
          resolve(mockData.analyticsData.customerMetrics as unknown as T)
        } else if (url === "/analytics/deals") {
          resolve(mockData.analyticsData.dealMetrics as unknown as T)
        } else if (url === "/customers") {
          resolve(mockData.customers as unknown as T)
        } else if (url.startsWith("/customers/")) {
          const id = url.split("/")[2]
          const customer = mockData.customers.find((c) => c.id === id)
          resolve((customer || mockData.customers[0]) as unknown as T)
        } else if (url === "/deals") {
          resolve(mockData.deals as unknown as T)
        } else if (url.startsWith("/deals/")) {
          const id = url.split("/")[2]
          const deal = mockData.deals.find((d) => d.id === id)
          resolve((deal || mockData.deals[0]) as unknown as T)
        } else if (url === "/tasks") {
          resolve(mockData.tasks as unknown as T)
        } else if (url.startsWith("/tasks/")) {
          const id = url.split("/")[2]
          const task = mockData.tasks.find((t) => t.id === id)
          resolve((task || mockData.tasks[0]) as unknown as T)
        } else {
          // Default mock response
          resolve({} as unknown as T)
        }
      }, 500) // 500ms delay to simulate network
    })
  }

  // If not in development, make the actual API request
  return axiosInstance({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch((error: any) => {
      console.error(`API Error (${method.toUpperCase()} ${url}):`, error)
      throw error
    })
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      return apiRequest<User>("post", "/auth/login", { email, password })
    },
    register: async (name: string, email: string, password: string): Promise<User> => {
      return apiRequest<User>("post", "/auth/register", { name, email, password })
    },
    logout: async (): Promise<void> => {
      return apiRequest<void>("post", "/auth/logout")
    },
    me: async (): Promise<User> => {
      return apiRequest<User>("get", "/auth/me")
    },
  },

  // Customers endpoints
  customers: {
    getAll: async (): Promise<Customer[]> => {
      return apiRequest<Customer[]>("get", "/customers")
    },
    getById: async (id: string): Promise<Customer> => {
      return apiRequest<Customer>("get", `/customers/${id}`)
    },
    create: async (data: CustomerFormData): Promise<Customer> => {
      return apiRequest<Customer>("post", "/customers", data)
    },
    update: async (id: string, data: CustomerFormData): Promise<Customer> => {
      return apiRequest<Customer>("put", `/customers/${id}`, data)
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest<void>("delete", `/customers/${id}`)
    },
  },

  // Deals endpoints
  deals: {
    getAll: async (): Promise<Deal[]> => {
      return apiRequest<Deal[]>("get", "/deals")
    },
    getById: async (id: string): Promise<Deal> => {
      return apiRequest<Deal>("get", `/deals/${id}`)
    },
    create: async (data: DealFormData): Promise<Deal> => {
      return apiRequest<Deal>("post", "/deals", data)
    },
    update: async (id: string, data: DealFormData): Promise<Deal> => {
      return apiRequest<Deal>("put", `/deals/${id}`, data)
    },
    updateStatus: async (id: string, status: Deal["status"]): Promise<Deal> => {
      return apiRequest<Deal>("patch", `/deals/${id}/status`, { status })
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest<void>("delete", `/deals/${id}`)
    },
  },

  // Tasks endpoints
  tasks: {
    getAll: async (): Promise<Task[]> => {
      return apiRequest<Task[]>("get", "/tasks")
    },
    getById: async (id: string): Promise<Task> => {
      return apiRequest<Task>("get", `/tasks/${id}`)
    },
    create: async (data: TaskFormData): Promise<Task> => {
      return apiRequest<Task>("post", "/tasks", data)
    },
    update: async (id: string, data: TaskFormData): Promise<Task> => {
      return apiRequest<Task>("put", `/tasks/${id}`, data)
    },
    updateStatus: async (id: string, status: Task["status"]): Promise<Task> => {
      return apiRequest<Task>("patch", `/tasks/${id}/status`, { status })
    },
    delete: async (id: string): Promise<void> => {
      return apiRequest<void>("delete", `/tasks/${id}`)
    },
  },

  // Dashboard endpoints
  dashboard: {
    getSummary: async () => {
      return apiRequest("get", "/dashboard/summary")
    },
    getRecentActivity: async () => {
      return apiRequest("get", "/dashboard/activity")
    },
  },

  // Analytics endpoints
  analytics: {
    getSalesOverview: async (period: string) => {
      return apiRequest("get", `/analytics/sales?period=${period}`)
    },
    getCustomerMetrics: async () => {
      return apiRequest("get", "/analytics/customers")
    },
    getDealMetrics: async () => {
      return apiRequest("get", "/analytics/deals")
    },
  },
}
