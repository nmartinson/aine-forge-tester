# Aine Forge Tester

A TypeScript/React application designed as a testing ground for agentic coding tools.

[![CI and Deploy](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml/badge.svg)](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml)


## 📋 Overview

This repository is set up as a foundation for testing agentic coding tools. It includes:

- **TypeScript + React 18** - Modern React with full type safety
- **Vite** - Fast development server and build tool
- **React Router v7** - Client-side routing for multi-page navigation
- **Vitest** - Unit testing framework with React Testing Library
- **ESLint** - Code linting and style enforcement
- **GitHub Actions** - CI pipeline with automated testing and deployment
- **GitHub Pages** - Automatic deployment on push to main

## 🏗️ Architecture

### High-Level Overview

The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         React Application               │
│  (TypeScript + React 18 + React Router) │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼────┐      ┌───▼────┐
   │ Pages  │      │ Layout  │
   └────────┘      └────────┘
       │                │
   ┌───▼────────────────▼────┐
   │   Reusable Components   │
   │  (Counter, FeatureCard) │
   └────────────────────────┘
```

### Directory Structure & Responsibilities

```
src/
├── main.tsx              # Application entry point
│                         # Renders React app into DOM
│
├── App.tsx               # Root component
│                         # Sets up React Router with routes
│                         # Renders Navbar, Routes, and Footer
│
├── components/           # Reusable UI components
│   ├── Navbar.tsx        # Navigation bar (appears on all pages)
│   ├── Header.tsx        # Page header component
│   ├── Counter.tsx       # Interactive counter with state
│   ├── FeatureCard.tsx   # Card component for displaying features
│   └── *.css             # Component-scoped styles
│
├── pages/                # Page-level components (route targets)
│   ├── Home.tsx          # Landing page
│   ├── GettingStarted.tsx # Getting started guide page
│   └── *.css             # Page-scoped styles
│
├── test/                 # Testing configuration
│   └── setup.ts          # Vitest setup and global test config
│
├── index.css             # Global styles
└── vite-env.d.ts         # Vite environment type definitions
```

### Data Flow

1. **Entry Point** (`main.tsx`) → Renders the React app
2. **Root Component** (`App.tsx`) → Sets up routing and layout
3. **Router** → Directs to appropriate page based on URL
4. **Pages** → Compose reusable components
5. **Components** → Render UI and handle local state

### Component Hierarchy

```
App
├── Navbar
├── Routes
│   ├── Home
│   │   ├── Header
│   │   ├── FeatureCard (multiple)
│   │   └── Counter
│   └── GettingStarted
│       └── Header
└── Footer
```

### Styling Strategy

- **Component-scoped CSS**: Each component has its own `.css` file
- **Global styles**: `index.css` for application-wide styling
- **No CSS-in-JS**: Plain CSS for simplicity and performance
- **Responsive design**: Mobile-first approach

### Routing

The application uses **React Router v7** for client-side navigation:

- `/` → Home page
- `/getting-started` → Getting started guide
- Base path: `/aine-forge-tester/` (for GitHub Pages deployment)

### Testing Architecture

- **Unit Tests**: Component tests using Vitest + React Testing Library
- **Test Files**: Colocated with components (`*.test.tsx`)
- **Test Setup**: Configured in `src/test/setup.ts`
- **Coverage**: Available via `npm run test:coverage`

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/royceacho-wwt/aine-forge-tester.git
cd aine-forge-tester

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## 🧪 Testing Scenarios

This repo is designed for testing agentic coding tools. Here are some suggested scenarios:

### Beginner
- Add a new prop to an existing component
- Update styling for a component
- Add a new test case

### Intermediate
- Create a new component with state
- Implement a form with validation
- Add a theme toggle (dark/light mode)

### Advanced
- Add a new page and route
- Implement data fetching with a mock API
- Add state management (Context API or Zustand)
- Create a complete CRUD feature

## 🔧 Configuration

### GitHub Pages Setup

To enable GitHub Pages deployment:

1. Go to repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions"
3. The workflow will automatically deploy on push to `main`

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:3000
```

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `npm run test`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request

## 📄 License

MIT
