# Spell Daily - PNPM Workspace

A spelling game application built with React, Express.js, and Next.js, organized as a pnpm workspace.

## Structure

This repository is organized as a pnpm workspace with the following packages:

- **`app`** (`@spell-daily/app`) - Main React application built with Vite
- **`backend`** (`@spell-daily/backend`) - Express.js API server with Prisma ORM
- **`word-library`** (`@spell-daily/word-library`) - Next.js application for word management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher

### Installation

```bash
# Install all dependencies for all packages
pnpm install
```

### Development

```bash
# Start development servers for all packages
pnpm dev

# Or run dev for a specific package
pnpm --filter @spell-daily/app dev
pnpm --filter @spell-daily/backend dev
pnpm --filter @spell-daily/word-library dev
```

### Building

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @spell-daily/app build
pnpm --filter @spell-daily/backend build
pnpm --filter @spell-daily/word-library build
```

### Other Commands

```bash
# Lint all packages
pnpm lint

# Format all packages
pnpm format

# Clean build artifacts
pnpm clean
```

## Workspace Commands

You can run commands across all packages or target specific ones:

```bash
# Run command in all packages
pnpm --recursive <command>

# Run command in specific package
pnpm --filter @spell-daily/app <command>

# Run command in parallel
pnpm --parallel <command>
```

## Backend Specific Commands

The backend package includes additional Prisma-related commands:

```bash
# Generate Prisma client
pnpm --filter @spell-daily/backend prisma:generate

# Run database migrations
pnpm --filter @spell-daily/backend prisma:migrate

# Open Prisma Studio
pnpm --filter @spell-daily/backend prisma:studio

# Push schema to database
pnpm --filter @spell-daily/backend prisma:push
```

## Package Dependencies

When adding dependencies that should be shared across packages, add them to the root `package.json`. Package-specific dependencies should be added to the individual package's `package.json`.

## Build Output

- **app**: Static files in `app/dist/`
- **backend**: Compiled JavaScript in `backend/dist/`
- **word-library**: Next.js build in `word-library/.next/`