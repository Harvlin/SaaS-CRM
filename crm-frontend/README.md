# CRM Frontend MVP

A modern CRM system built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: JWT-based authentication with HTTP-only cookies
- **Dashboard**: Overview of key metrics and recent activity
- **Customers**: Manage customer information and interactions
- **Deals**: Track sales opportunities with Kanban board
- **Tasks**: Manage to-dos with list and calendar views
- **Analytics**: Visualize sales, customer, and deal metrics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context for auth & global state
- **Data Fetching**: SWR with Axios
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/crm-frontend.git
   cd crm-frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                  # Next.js App Router pages
│   ├── analytics/        # Analytics page
│   ├── customers/        # Customer pages (list, detail, edit)
│   ├── dashboard/        # Dashboard page
│   ├── deals/            # Deals pages with Kanban board
│   ├── login/            # Authentication pages
│   ├── tasks/            # Tasks pages with list and calendar views
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── calendar/         # Calendar components
│   ├── dashboard/        # Dashboard-specific components
│   ├── kanban/           # Kanban board components
│   ├── layout/           # Layout components (Sidebar, Navbar)
│   └── ui/               # UI components (from shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API client
├── public/               # Static assets
├── tests/                # Test files
└── types/                # TypeScript type definitions
\`\`\`

## API Layer

The API client is defined in `lib/api.ts` and provides typed endpoints for all `/api/v1/...` routes. It handles authentication, error handling, and provides a clean interface for data fetching.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL for the API server

## Testing

Run tests with:

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## Deployment

This project can be deployed to Vercel with minimal configuration:

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
