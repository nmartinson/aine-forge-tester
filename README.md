# Aine Forge Tester

A TypeScript/React application designed as a testing ground for agentic coding tools.

[![CI and Deploy](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml/badge.svg)](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml)


## 📋 Overview

This repository is set up as a foundation for testing agentic coding tools. It includes:

- **TypeScript + React 18** - Modern React with full type safety
- **Vite** - Fast development server and build tool
- **Vitest** - Unit testing framework with React Testing Library
- **ESLint** - Code linting and style enforcement
- **GitHub Actions** - CI pipeline with automated testing and deployment
- **GitHub Pages** - Automatic deployment on push to main
- **React Router** - Client-side routing for multi-page navigation

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- 

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

## 🏗️ Architecture

### High-Level Overview

The application follows a component-based architecture with clear separation of concerns:

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

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Build & Dev** | Vite | Fast bundling and HMR |
| **Language** | TypeScript | Type-safe development |
| **UI Framework** | React 18 | Component-based UI |
| **Routing** | React Router v7 | Client-side navigation |
| **Testing** | Vitest + React Testing Library | Unit and component testing |
| **Linting** | ESLint + TypeScript ESLint | Code quality |
| **Deployment** | GitHub Actions + GitHub Pages | CI/CD pipeline |

### Directory Structure

```
aine-forge-tester/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── public/
│   └── vite.svg                   # Static assets
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── Counter.tsx            # Counter component with state
│   │   ├── Counter.test.tsx       # Counter tests
│   │   ├── Counter.css
│   │   ├── FeatureCard.tsx        # Feature display card
│   │   ├── FeatureCard.test.tsx   # FeatureCard tests
│   │   ├── FeatureCard.css
│   │   ├── Header.tsx             # Page header component
│   │   ├── Header.test.tsx        # Header tests
│   │   ├── Header.css
│   │   ├── Navbar.tsx             # Navigation bar with routing
│   │   └── Navbar.css
│   ├── pages/                     # Page-level components
│   │   ├── Home.tsx               # Home page
│   │   ├── Home.css
│   │   ├── GettingStarted.tsx     # Getting started guide page
│   │   └── GettingStarted.css
│   ├── test/
│   │   └── setup.ts               # Vitest configuration
│   ├── App.tsx                    # Root component with routing
│   ├── App.css
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts              # Vite type definitions
├── index.html                     # HTML entry point
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.node.json             # TypeScript config for build tools
├── vite.config.ts                 # Vite configuration
└── README.md                      # This file
```

### Component Architecture

#### Pages
- **Home** (`src/pages/Home.tsx`) - Landing page showcasing the application
- **GettingStarted** (`src/pages/GettingStarted.tsx`) - Documentation and setup guide

#### Layout Components
- **Navbar** (`src/components/Navbar.tsx`) - Navigation bar with React Router links
- **Header** (`src/components/Header.tsx`) - Page header with title and description

#### Feature Components
- **Counter** (`src/components/Counter.tsx`) - Interactive counter with increment/decrement
- **FeatureCard** (`src/components/FeatureCard.tsx`) - Reusable card for displaying features

#### Root Component
- **App** (`src/App.tsx`) - Main application component that:
  - Sets up React Router with basename for GitHub Pages
  - Renders the Navbar for navigation
  - Defines routes for pages
  - Renders the footer

### Data Flow

```
main.tsx (Entry Point)
    ↓
App.tsx (Router Setup)
    ├── Navbar (Navigation)
    └── Routes
        ├── Home Page
        │   ├── Header
        │   └── FeatureCard(s)
        └── GettingStarted Page
            ├── Header
            └── Content
```

### Styling Approach

- **CSS Modules**: Each component has a corresponding `.css` file
- **Global Styles**: `src/index.css` contains global styling
- **Responsive Design**: Components are built to be responsive

### Testing Strategy

- **Unit Tests**: Each component has a `.test.tsx` file
- **Test Framework**: Vitest with React Testing Library
- **Test Environment**: jsdom for DOM simulation
- **Coverage**: Run `npm run test:coverage` to generate coverage reports

### Build & Deployment

1. **Development**: Vite provides fast HMR during development
2. **Production Build**: TypeScript compilation + Vite bundling
3. **Deployment**: GitHub Actions automatically builds and deploys to GitHub Pages on push to `main`
4. **Base Path**: Application is served from `/aine-forge-tester/` on GitHub Pages

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
├── public/
│   └── vite.svg            # Favicon
├── src/
│   ├── components/
│   │   ├── Counter.tsx     # Interactive counter component
│   │   ├── Counter.css
│   │   ├── Counter.test.tsx
│   │   ├── FeatureCard.tsx # Feature display card
│   │   ├── FeatureCard.css
│   │   ├── FeatureCard.test.tsx
│   │   ├── Header.tsx      # Page header
│   │   ├── Header.css
│   │   ├── Header.test.tsx
│   │   ├── Navbar.tsx      # Navigation bar
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.tsx        # Home page
│   │   ├── Home.css
│   │   ├── GettingStarted.tsx
│   │   └── GettingStarted.css
│   ├── test/
│   │   └── setup.ts        # Test configuration
│   ├── App.tsx             # Main application
│   ├── App.css
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

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
- Add additional pages with React Router
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

### Vite Configuration

The `vite.config.ts` file includes:
- React plugin for JSX support
- Base path configuration for GitHub Pages (`/aine-forge-tester/`)
- Vitest configuration with jsdom environment

### TypeScript Configuration

- `tsconfig.json` - Main TypeScript configuration for source code
- `tsconfig.node.json` - Separate configuration for build tools

## 📝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `npm run test`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request

## 📄 License

MIT
