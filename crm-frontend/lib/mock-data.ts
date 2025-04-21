// Mock data for development and testing

// Dashboard summary data
export const dashboardSummary = {
  totalCustomers: 156,
  totalDeals: 32,
  totalTasks: 18,
  totalRevenue: 287500,
  revenueChange: 12.5,
  customerChange: 8.3,
  dealsChange: 15.2,
  tasksChange: -5.1,
}

// Recent activity data
export const recentActivity = [
  {
    id: "act1",
    type: "customer",
    action: "added a new customer",
    subject: "Acme Inc",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    user: {
      name: "John Doe",
      avatar: "",
    },
  },
  {
    id: "act2",
    type: "deal",
    action: "closed a deal with",
    subject: "TechCorp Solutions",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    user: {
      name: "Jane Smith",
      avatar: "",
    },
  },
  {
    id: "act3",
    type: "task",
    action: "completed a task for",
    subject: "Quarterly Review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    user: {
      name: "John Doe",
      avatar: "",
    },
  },
  {
    id: "act4",
    type: "deal",
    action: "updated the status of",
    subject: "Enterprise Agreement",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    user: {
      name: "Jane Smith",
      avatar: "",
    },
  },
  {
    id: "act5",
    type: "customer",
    action: "added notes to",
    subject: "Global Industries",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    user: {
      name: "John Doe",
      avatar: "",
    },
  },
]

// Sales data for charts
export const salesData = [
  { date: "Jan", Revenue: 18500 },
  { date: "Feb", Revenue: 22300 },
  { date: "Mar", Revenue: 19800 },
  { date: "Apr", Revenue: 24500 },
  { date: "May", Revenue: 28900 },
  { date: "Jun", Revenue: 32400 },
  { date: "Jul", Revenue: 35700 },
  { date: "Aug", Revenue: 33200 },
  { date: "Sep", Revenue: 37800 },
  { date: "Oct", Revenue: 42100 },
  { date: "Nov", Revenue: 39600 },
  { date: "Dec", Revenue: 45200 },
]

// Deal distribution data
export const dealStageData = [
  { name: "Lead", value: 12 },
  { name: "Qualified", value: 8 },
  { name: "Proposal", value: 6 },
  { name: "Negotiation", value: 4 },
  { name: "Closed Won", value: 10 },
  { name: "Closed Lost", value: 5 },
]

// Customer data
export const customers = [
  {
    id: "cust1",
    name: "Acme Inc",
    email: "contact@acmeinc.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Inc",
    status: "active",
    notes: "Key enterprise client with multiple ongoing projects",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: "cust2",
    name: "TechCorp Solutions",
    email: "info@techcorp.com",
    phone: "+1 (555) 987-6543",
    company: "TechCorp Solutions",
    status: "active",
    notes: "Expanding their contract next quarter",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: "cust3",
    name: "Global Industries",
    email: "contact@globalind.com",
    phone: "+1 (555) 456-7890",
    company: "Global Industries",
    status: "inactive",
    notes: "Need to follow up on renewal",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 180 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
  },
  {
    id: "cust4",
    name: "Startup Innovators",
    email: "hello@startupinnovators.com",
    phone: "+1 (555) 234-5678",
    company: "Startup Innovators",
    status: "lead",
    notes: "Interested in our premium plan",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "cust5",
    name: "Local Business LLC",
    email: "info@localbusiness.com",
    phone: "+1 (555) 876-5432",
    company: "Local Business LLC",
    status: "active",
    notes: "Small account with growth potential",
    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
]

// Deal data
export const deals = [
  {
    id: "deal1",
    title: "Enterprise License Agreement",
    value: 75000,
    status: "negotiation",
    customerId: "cust1",
    customerName: "Acme Inc",
    description: "Annual enterprise license renewal with additional seats",
    closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
    probability: 80,
    assignedTo: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "deal2",
    title: "Software Implementation",
    value: 45000,
    status: "proposal",
    customerId: "cust2",
    customerName: "TechCorp Solutions",
    description: "Implementation of our software platform with custom integrations",
    closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days from now
    probability: 60,
    assignedTo: "user2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: "deal3",
    title: "Consulting Services",
    value: 28000,
    status: "closed-won",
    customerId: "cust3",
    customerName: "Global Industries",
    description: "Strategic consulting services for Q3",
    closingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    probability: 100,
    assignedTo: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: "deal4",
    title: "Starter Package",
    value: 12000,
    status: "qualified",
    customerId: "cust4",
    customerName: "Startup Innovators",
    description: "Starter package with basic features",
    closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days from now
    probability: 50,
    assignedTo: "user2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "deal5",
    title: "Support Contract",
    value: 18000,
    status: "lead",
    customerId: "cust5",
    customerName: "Local Business LLC",
    description: "Annual support and maintenance contract",
    closingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days from now
    probability: 30,
    assignedTo: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
]

// Task data
export const tasks = [
  {
    id: "task1",
    title: "Follow up on proposal",
    description: "Send follow-up email regarding the submitted proposal",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
    assignedTo: "user1",
    relatedTo: {
      type: "deal",
      id: "deal2",
      name: "Software Implementation - TechCorp Solutions",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: "task2",
    title: "Prepare contract",
    description: "Draft the contract for the enterprise agreement",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day from now
    assignedTo: "user2",
    relatedTo: {
      type: "deal",
      id: "deal1",
      name: "Enterprise License Agreement - Acme Inc",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: "task3",
    title: "Schedule kickoff meeting",
    description: "Arrange a kickoff meeting with the client team",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    assignedTo: "user1",
    relatedTo: {
      type: "customer",
      id: "cust4",
      name: "Startup Innovators",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: "task4",
    title: "Send invoice",
    description: "Generate and send invoice for the closed deal",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    assignedTo: "user2",
    relatedTo: {
      type: "deal",
      id: "deal3",
      name: "Consulting Services - Global Industries",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: "task5",
    title: "Quarterly review",
    description: "Conduct quarterly review of account performance",
    status: "todo",
    priority: "low",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    assignedTo: "user1",
    relatedTo: {
      type: "customer",
      id: "cust1",
      name: "Acme Inc",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
]

// Analytics data
export const analyticsData = {
  customerMetrics: {
    total: 156,
    active: 98,
    inactive: 32,
    leads: 26,
    growth: 8.3,
    acquisitionData: [
      { date: "Jan", "New Customers": 12 },
      { date: "Feb", "New Customers": 8 },
      { date: "Mar", "New Customers": 15 },
      { date: "Apr", "New Customers": 10 },
      { date: "May", "New Customers": 14 },
      { date: "Jun", "New Customers": 12 },
      { date: "Jul", "New Customers": 16 },
      { date: "Aug", "New Customers": 13 },
      { date: "Sep", "New Customers": 17 },
      { date: "Oct", "New Customers": 15 },
      { date: "Nov", "New Customers": 14 },
      { date: "Dec", "New Customers": 10 },
    ],
  },
  dealMetrics: {
    totalValue: 287500,
    avgDealSize: 24500,
    winRate: 68,
    conversionTime: 32,
    growth: 12.5,
    stageData: [
      { stage: "Lead", count: 12 },
      { stage: "Qualified", count: 8 },
      { stage: "Proposal", count: 6 },
      { stage: "Negotiation", count: 4 },
      { stage: "Closed Won", count: 10 },
      { stage: "Closed Lost", count: 5 },
    ],
    statusData: [
      { status: "Lead", value: 85000 },
      { status: "Qualified", value: 62000 },
      { status: "Proposal", value: 48000 },
      { status: "Negotiation", value: 32000 },
      { status: "Closed Won", value: 45000 },
      { status: "Closed Lost", value: 15500 },
    ],
  },
}
