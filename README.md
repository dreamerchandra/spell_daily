# Spell Daily - Yarn Workspace

A spelling game application built with React, Express.js, and Next.js, organized as a yarn workspace.

## Structure

This repository is organized as a yarn workspace with the following packages:

- **`app`** (`@spell-daily/app`) - Main React application built with Vite
- **`backend`** (`@spell-daily/backend`) - Express.js API server with Prisma ORM
- **`word-library`** (`@spell-daily/word-library`) - Next.js application for word management

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Yarn 4 or higher (managed via corepack)

### Installation

```bash
# Enable corepack (if not already enabled)
corepack enable

# Install all dependencies for all packages
yarn install
```

### Development

```bash
# Start development servers for all packages
yarn dev

# Or run dev for a specific package
yarn workspace @spell-daily/app dev
yarn workspace @spell-daily/backend dev
yarn workspace @spell-daily/word-library dev
```

### Building

```bash
# Build all packages
yarn build

# Build a specific package
yarn workspace @spell-daily/app build
yarn workspace @spell-daily/backend build
yarn workspace @spell-daily/word-library build
```

### Other Commands

```bash
# Lint all packages
yarn lint

# Format all packages
yarn format

# Clean build artifacts
yarn clean
```

## Workspace Commands

You can run commands across all packages or target specific ones:

```bash
# Run command in all packages
yarn workspaces foreach --all run <command>

# Run command in specific package
yarn workspace @spell-daily/app <command>

# Run command in parallel
yarn workspaces foreach --all --parallel run <command>
```

## Backend Specific Commands

The backend package includes additional Prisma-related commands:

```bash
# Generate Prisma client
yarn workspace @spell-daily/backend run prisma:generate

# Run database migrations
yarn workspace @spell-daily/backend run prisma:migrate

# Open Prisma Studio
yarn workspace @spell-daily/backend run prisma:studio

# Push schema to database
yarn workspace @spell-daily/backend run prisma:push
```

## Package Dependencies

When adding dependencies that should be shared across packages, add them to the root `package.json`. Package-specific dependencies should be added to the individual package's `package.json`.

## Code Formatting

The workspace uses a unified Prettier configuration located at the root level:

- Configuration: `.prettierrc.json`
- Ignore patterns: `.prettierignore`

All packages use the same formatting rules, ensuring consistency across the codebase.

## Build Output

- **app**: Static files in `app/dist/`
- **backend**: Compiled JavaScript in `backend/dist/`
- **word-library**: Next.js build in `word-library/.next/`
