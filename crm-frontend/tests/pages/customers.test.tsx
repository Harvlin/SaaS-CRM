import type React from "react"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import CustomersPage from "@/app/customers/page"
import { api } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

// Mock the necessary dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/customers",
}))

jest.mock("@/components/layout/app-layout", () => ({
  AppLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock("@/lib/api", () => ({
  api: {
    customers: {
      getAll: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

jest.mock("@/hooks/use-toast", () => ({
  toast: jest.fn(),
}))

describe("Customers Page", () => {
  const mockCustomers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      company: "Acme Inc",
      status: "active",
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      company: "XYZ Corp",
      status: "inactive",
      createdAt: "2023-01-02T00:00:00.000Z",
      updatedAt: "2023-01-02T00:00:00.000Z",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(api.customers.getAll as jest.Mock).mockResolvedValue(mockCustomers)
  })

  it("renders the customers page with data", async () => {
    render(<CustomersPage />)

    // Initially should show loading state
    expect(screen.getByText("Customers")).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(api.customers.getAll).toHaveBeenCalled()
    })

    // Check if customer data is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
    expect(screen.getByText("Acme Inc")).toBeInTheDocument()
    expect(screen.getByText("XYZ Corp")).toBeInTheDocument()
  })

  it("filters customers based on search query", async () => {
    render(<CustomersPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(api.customers.getAll).toHaveBeenCalled()
    })

    // Enter search query
    const searchInput = screen.getByPlaceholderText("Search customers...")
    fireEvent.change(searchInput, { target: { value: "John" } })

    // Should show only John Doe
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
  })

  it("filters customers based on status", async () => {
    render(<CustomersPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(api.customers.getAll).toHaveBeenCalled()
    })

    // Open status filter dropdown
    const filterTrigger = screen.getByText("Filter by status")
    fireEvent.click(filterTrigger)

    // Select "Active" status
    const activeOption = screen.getByText("Active")
    fireEvent.click(activeOption)

    // Should show only active customers
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
  })

  it("handles customer deletion", async () => {
    ;(api.customers.delete as jest.Mock).mockResolvedValue({})

    render(<CustomersPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(api.customers.getAll).toHaveBeenCalled()
    })

    // Find and click the more menu for the first customer
    const moreButtons = screen.getAllByRole("button", { name: /open menu/i })
    fireEvent.click(moreButtons[0])

    // Click delete option
    const deleteOption = screen.getByText("Delete")
    fireEvent.click(deleteOption)

    // Confirm deletion was called
    await waitFor(() => {
      expect(api.customers.delete).toHaveBeenCalledWith("1")
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Customer deleted",
        }),
      )
    })
  })

  it("handles API error", async () => {
    ;(api.customers.getAll as jest.Mock).mockRejectedValue(new Error("API error"))

    render(<CustomersPage />)

    // Wait for error toast
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        }),
      )
    })
  })
})
