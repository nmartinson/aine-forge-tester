# Aine Forge Tester 🛠️

A testing ground for agentic coding tools, built with React 18, TypeScript, and Vite. This project showcases a collection of interactive games and utilities designed to stress-test autonomous coding agents with varying levels of complexity.

**Live Demo:** https://nmartinson.github.io/aine-forge-tester/

## 🎮 Features & Games

The application includes a diverse set of interactive games and utilities:

| Game | Difficulty | Type |
|------|-----------|------|
| **Todo List** | Easy | Utility |
| **Counter** | Easy | Component |
| **Rock, Paper, Scissors** | Easy | Game |
| **Tic Tac Toe** | Medium | Game |
| **Memory Game** | Medium | Game |
| **Snake** | Medium | Game |
| **Word Puzzle** | Medium | Game |
| **Wordle** | Medium | Game |
| **Hangman** | Medium | Game |
| **Sudoku** | Hard | Game |
| **Towers of Hanoi** | Hard | Game |
| **3D Maze Generator & Solver** | Very Hard | Algorithm |

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 18 SPA (TypeScript)                           │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  Router (React Router v7)                      │  │   │
│  │  │  ├─ Home                                       │  │   │
│  │  │  ├─ Games (11 routes)                          │  │   │
│  │  │  └─ Getting Started                            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  ThemeProvider (Light/Dark Mode)               │  │   │
│  │  │  └─ CSS Variables (--primary-color, etc.)      │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  localStorage (Theme, Game State)              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App (Root)
├── ThemeProvider
│   └── Router
│       ├── Navbar
│       ├── Routes
│       │   ├── Home
│       │   │   ├── Header
│       │   │   ├── FeatureCard (x4)
│       │   │   ├── Counter
│       │   │   └── RockPaperScissors
│       │   ├── TodoList
│       │   ├── TicTacToe
│       │   ├── MemoryGame
│       │   ├── SnakeGame
│       │   ├── WordPuzzle
│       │   ├── Wordle
│       │   ├── Hangman
│       │   ├── Sudoku
│       │   ├── TowersOfHanoi
│       │   └── Maze3D
│       └── Footer
```

### Data Flow

```
User Interaction
       │
       ▼
Component Event Handler
       │
       ├─► Update Local State (useState)
       │
       ├─► Persist to localStorage (if needed)
       │
       └─► Re-render Component
            │
            ├─► Canvas/DOM Updates
            │
            └─► Visual Feedback
```

### Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  GitHub Repository                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Source Code (TypeScript, React, CSS)              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│              GitHub Actions CI/CD Pipeline               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  1. Lint (ESLint - zero warnings)                  │  │
│  │  2. Test (Vitest + React Testing Library)          │  │
│  │  3. Build (Vite - TypeScript compilation)          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│            GitHub Pages (Static Hosting)                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  dist/ (Optimized production build)                │  │
│  │  ├─ index.html                                     │  │
│  │  ├─ assets/ (JS, CSS, images)                      │  │
│  │  └─ Served at: /aine-forge-tester/                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/nmartinson/aine-forge-tester.git
cd aine-forge-tester

# Install dependencies
npm ci

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/aine-forge-tester/`

### Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server with hot reload

# Production
npm run build            # Build optimized production bundle
npm run preview          # Preview production build locally

# Quality Assurance
npm run lint             # Run ESLint (zero warnings required)
npm run test             # Run Vitest (single run)
npm run test:watch       # Run Vitest in watch mode
npm run test:coverage    # Generate coverage report
```

## 📁 Project Structure

```
aine-forge-tester/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Counter.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── Header.tsx
│   │   ├── Navbar.tsx
│   │   ├── RockPaperScissors.tsx
│   │   └── *.test.tsx       # Component tests
│   │
│   ├── pages/               # Route-level page components
│   │   ├── Home.tsx
│   │   ├── GettingStarted.tsx
│   │   ├── TodoList.tsx
│   │   ├── TicTacToe.tsx
│   │   ├── MemoryGame.tsx
│   │   ├── SnakeGame.tsx
│   │   ├── WordPuzzle.tsx
│   │   ├── Wordle.tsx
│   │   ├── Hangman.tsx
│   │   ├── Sudoku.tsx
│   │   ├── TowersOfHanoi.tsx
│   │   ├── Maze3D.tsx
│   │   └── *.css            # Page-specific styles
│   │
│   ├── utils/               # Shared utilities and context
│   │   ├── ThemeContext.tsx # Light/dark theme provider
│   │   └── useTheme.ts      # Theme hook
│   │
│   ├── test/                # Global test setup
│   │   └── setup.ts         # Vitest configuration
│   │
│   ├── App.tsx              # Root component with Router
│   ├── App.css              # Global app styles
│   ├── main.tsx             # Entry point
│   ├── index.css            # CSS variables and global styles
│   └── vite-env.d.ts        # Vite type definitions
│
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD pipeline
│
├── public/                  # Static assets
├── dist/                    # Production build output
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── .eslintrc.cjs            # ESLint configuration
├── agents.md                # Agentic coding tool configuration
└── README.md                # This file
```

## 🎨 Design System

### Theme System

The application supports light and dark modes with a theme system built on CSS custom properties:

- **Provider**: `ThemeProvider` wraps the entire app
- **Storage**: Theme preference persisted to `localStorage`
- **Implementation**: `data-theme` attribute on `<html>` element
- **CSS Variables**: Defined in `src/index.css`
  - `--primary-color`
  - `--secondary-color`
  - `--background-color`
  - `--text-color`
  - `--border-color`
  - And more...

### Styling Approach

- **No CSS-in-JS**: Plain `.css` files imported directly into components
- **Co-location**: CSS files placed next to their corresponding components
- **Mobile-first**: Responsive design with flexible layouts
- **Accessibility**: Semantic HTML and ARIA attributes where needed

## 🧪 Testing

The project uses **Vitest** and **React Testing Library** for comprehensive testing:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Setup

- **Environment**: jsdom (browser-like environment)
- **Globals**: Vitest globals enabled (no need to import `describe`, `it`, `expect`)
- **Setup File**: `src/test/setup.ts` configures test environment
- **Test Files**: Placed next to source files with `.test.tsx` extension

## 🔍 Code Quality

### Linting

The project enforces strict code quality standards:

```bash
npm run lint
```

- **Tool**: ESLint with TypeScript support
- **Policy**: Zero warnings allowed
- **Plugins**: React Hooks, React Refresh

### TypeScript

- **Strict Mode**: Enabled for maximum type safety
- **Version**: 5.9.3+
- **Target**: ES2020

## 📚 Documentation

- **[agents.md](./agents.md)** — Configuration for agentic coding tools
- **[Wiki: Coding Standards](https://github.com/nmartinson/aine-forge-tester/wiki/coding-standards)** — Language versions, commands, naming conventions
- **[Wiki: Theme System](https://github.com/nmartinson/aine-forge-tester/wiki/theme-system)** — How light/dark theme works
- **[Wiki: Architecture Decisions](https://github.com/nmartinson/aine-forge-tester/wiki/architecture-decisions)** — SPA structure, routing, data storage
- **[Wiki: Known Issues](https://github.com/nmartinson/aine-forge-tester/wiki/known-issues)** — Gotchas and limitations

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

```
Push to main
    │
    ▼
┌─────────────────┐
│  Lint Stage     │ (ESLint - zero warnings)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Test Stage     │ (Vitest + React Testing Library)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Build Stage    │ (Vite - TypeScript compilation)
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Deploy Stage   │ (GitHub Pages)
└─────────────────┘
```

**All stages must pass before deployment.**

## 🎯 Game Complexity Levels

### Easy (Learning)
- **Counter**: Basic state management
- **Rock, Paper, Scissors**: Simple game logic
- **Todo List**: CRUD operations with localStorage

### Medium (Intermediate)
- **Tic Tac Toe**: Game tree logic, win detection
- **Memory Game**: Array shuffling, timing
- **Snake**: Game loop, collision detection
- **Word Puzzle**: String manipulation, scoring
- **Wordle**: Word validation, feedback system
- **Hangman**: State machine, word guessing

### Hard (Advanced)
- **Sudoku**: Constraint satisfaction, backtracking algorithm
- **Towers of Hanoi**: Recursive problem solving, move validation

### Very Hard (Stress Test)
- **3D Maze Generator & Solver**: 
  - Recursive backtracking maze generation (O(n²))
  - A* pathfinding algorithm (O(n² log n))
  - Canvas rendering with custom graphics
  - Real-time performance metrics

## ⚠️ Known Limitations

- **Stateless Games**: Game state is not persisted across navigation
- **No Backend**: All data stored in-memory or localStorage
- **Network Restricted**: No external API calls (package registries only)
- **Wordle Word Length**: Known issue with word length validation (see wiki)

## 🤖 For Agentic Coding Tools

This project is specifically designed to test autonomous coding agents. See [agents.md](./agents.md) for:

- Agent initialization requirements (pun at start of session!)
- Working guidelines and best practices
- Project structure and conventions
- Known gotchas and limitations
- CI/CD pipeline requirements

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Contributing

Contributions are welcome! Please ensure:

1. All tests pass: `npm run test`
2. No linting errors: `npm run lint`
3. Production build succeeds: `npm run build`
4. Clear commit messages and PR descriptions

---

**Built for testing agentic coding tools** 🛠️ | **Deployed to GitHub Pages** 🚀
