# CRM App - React + TypeScript + Vite + Tailwind + React Router + React Query

This is a modern React application built with the following tech stack:

- **React 19** - Latest React with React Compiler
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack React Query (v5)** - Server state management
- **ESLint** - Code linting

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── assets/         # Static assets
├── App.tsx         # Main app component with routing
└── main.tsx        # App entry point
```

## ✨ Features Included

### Tailwind CSS

- Pre-configured with PostCSS
- Responsive design utilities
- Custom component styling

### React Router

- Browser-based routing
- Navigation between pages
- Nested routing support

### React Query (TanStack Query)

- Server state management
- Automatic caching and synchronization
- DevTools included for development

## 🛠 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## 🔧 Configuration Details

### PostCSS Setup

The project uses `@tailwindcss/postcss` plugin (required for Tailwind CSS v4+) along with Autoprefixer for vendor prefixing.

### Vite Plugins

This project uses [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with Babel for Fast Refresh.

### React Compiler

The React Compiler is enabled for optimized performance. See [React Compiler documentation](https://react.dev/learn/react-compiler) for more information.

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Vite Documentation](https://vitejs.dev)
