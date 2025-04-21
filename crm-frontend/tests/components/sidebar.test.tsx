import { render, screen, fireEvent } from "@testing-library/react"
import { Sidebar } from "@/components/layout/sidebar"

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}))

// Mock the useAuth hook
jest.mock("@/components/auth-provider", () => ({
  useAuth: () => ({
    user: {
      name: "Test User",
      email: "test@example.com",
    },
  }),
}))

describe("Sidebar Component", () => {
  it("renders correctly", () => {
    const mockSetOpen = jest.fn()

    render(<Sidebar open={true} setOpen={mockSetOpen} />)

    // Check if the sidebar title is rendered
    expect(screen.getByText("CRM System")).toBeInTheDocument()

    // Check if navigation links are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Customers")).toBeInTheDocument()
    expect(screen.getByText("Deals")).toBeInTheDocument()
    expect(screen.getByText("Tasks")).toBeInTheDocument()
    expect(screen.getByText("Analytics")).toBeInTheDocument()

    // Check if user info is rendered
    expect(screen.getByText("Test User")).toBeInTheDocument()
    expect(screen.getByText("test@example.com")).toBeInTheDocument()
  })

  it("toggles sidebar when button is clicked", () => {
    const mockSetOpen = jest.fn()

    render(<Sidebar open={true} setOpen={mockSetOpen} />)

    // Find and click the toggle button
    const toggleButton = screen.getByRole("button", { name: /chevron/i })
    fireEvent.click(toggleButton)

    // Check if setOpen was called with the opposite value
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it("renders collapsed state correctly", () => {
    const mockSetOpen = jest.fn()

    render(<Sidebar open={false} setOpen={mockSetOpen} />)

    // In collapsed state, we should see "CRM" instead of "CRM System"
    expect(screen.getByText("CRM")).toBeInTheDocument()

    // User info should not be visible in collapsed state
    expect(screen.queryByText("Test User")).not.toBeInTheDocument()
  })
})
