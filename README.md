# Aine Forge Tester 🛠️

A comprehensive collection of interactive games and utilities built with React, TypeScript, and Vite. This project serves as a testing ground for agentic coding tools and demonstrates modern web development practices.

## 🎮 Features

### Games & Interactive Apps

- **Classic Games**: Tic Tac Toe, Memory Game, Snake, Hangman, Checkers
- **Puzzle Games**: Sudoku, Wordle, Word Puzzle, Towers of Hanoi, Maze 3D
- **Skill Games**: Simon Says, Guess the Number, Flip Card, Connect Four, Donkey Kong
- **Specialized Games**: Rock Paper Scissors Lizard Spock (RPSLS)
- **Educational**: US State Map, Bike Components Finder, Mountain Bike Trail
- **Utilities**: Todo List, Getting Started Guide

### Technical Features

- 🌓 **Light/Dark Theme Support** — Persistent theme preference with localStorage
- 📱 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Development** — Vite-powered dev server with instant HMR
- 🧪 **Comprehensive Testing** — Vitest + React Testing Library
- 📋 **Type-Safe** — Full TypeScript with strict mode enabled
- 🎨 **Modern Styling** — CSS custom properties and co-located component styles
- ♿ **Accessible** — Semantic HTML and ARIA attributes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)

### Installation

```bash
# Install dependencies (use npm ci for reproducible installs)
npm ci
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/aine-forge-tester/**

The dev server automatically reloads when you make changes to the code.

### Production Build

```bash
# Create an optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

## 📚 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production bundle (TypeScript check + Vite build) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality (must have zero warnings) |
| `npm run test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Run tests with coverage report |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components (Navbar, etc.)
├── pages/              # Route-level page components (games, utilities)
├── utils/              # Shared utilities and context (ThemeContext, etc.)
├── test/               # Global test setup and utilities
├── App.tsx             # Router and ThemeProvider root
├── App.css             # Global app styles
├── main.tsx            # Entry point
└── index.css           # Global CSS variables and theme tokens
```

## 🎨 Theme System

The app supports light and dark themes with automatic persistence:

- **Toggle**: Use the theme button in the navbar
- **Persistence**: Theme preference is saved to localStorage
- **CSS Variables**: All colors use CSS custom properties defined in `src/index.css`
- **System Preference**: Respects `prefers-color-scheme` on first visit

## 🧪 Testing

Tests are written with Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Setup**: `src/test/setup.ts` configures the test environment with jsdom and necessary globals.

## 🔍 Code Quality

The project enforces strict code quality standards:

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Zero-warnings policy (run `npm run lint` to check)
- **Formatting**: Consistent code style across the project
- **Testing**: All components should have corresponding tests

## 🌐 Routing

All routes are defined in `src/App.tsx`. The app uses React Router with a base path of `/aine-forge-tester/`:

| Route | Component |
|-------|-----------| 
| `/` | Home page |
| `/getting-started` | Getting Started guide |
| `/todo` | Todo List |
| `/tictactoe` | Tic Tac Toe game |
| `/memory` | Memory Game |
| `/snake` | Snake Game |
| `/word-puzzle` | Word Puzzle |
| `/wordle` | Wordle game |
| `/hangman` | Hangman game |
| `/sudoku` | Sudoku puzzle |
| `/towers-of-hanoi` | Towers of Hanoi puzzle |
| `/maze-3d` | 3D Maze game |
| `/guess-the-number` | Guess the Number game |
| `/simon-says` | Simon Says game |
| `/checkers` | Checkers game |
| `/us-state-map` | US State Map |
| `/flip-card` | Flip Card game |
| `/donkey-kong` | Donkey Kong game |
| `/connect-four` | Connect Four game |
| `/mountain-bike-trail` | Mountain Bike Trail |
| `/bike-components-finder` | Bike Components Finder |
| `/rpsls` | Rock Paper Scissors Lizard Spock |

## 📦 Dependencies

### Runtime
- **react** (^18.2.0) — UI library
- **react-dom** (^18.2.0) — React DOM rendering
- **react-router-dom** (^7.18.1) — Client-side routing

### Development
- **TypeScript** (^5.9.3) — Type safety
- **Vite** (^4.4.0) — Build tool and dev server
- **Vitest** (^0.34.6) — Unit testing framework
- **ESLint** (^8.45.0) — Code quality
- **React Testing Library** (^14.3.1) — Component testing utilities

## 🚦 CI/CD Pipeline

The project uses GitHub Actions for continuous integration. All PRs must pass:

1. **Lint** — `npm run lint` (zero warnings required)
2. **Test** — `npm run test` (all tests must pass)
3. **Build** — `npm run build` (production build must succeed)

## 📝 Contributing

When adding new features:

1. Create a new component or page file
2. Add corresponding tests
3. Update routing in `src/App.tsx` if needed
4. Update the navbar if adding a new game
5. Run `npm run lint`, `npm run test`, and `npm run build` to verify
6. Open a pull request with a clear description

## ⚠️ Known Issues

- **Wordle**: Word length validation has a known bug
- **Stateless Games**: Game state is not persisted across navigation
- **NODE_ENV**: Test environment sets `NODE_ENV = 'development'` to override Vite defaults
- **npm ci**: Use `npm ci` instead of `npm install` for reproducible installs

See the [wiki](../../wiki) for more details on known issues and architecture decisions.

## 📄 License

This project is built for testing agentic coding tools. See LICENSE for details.

---

**Built with ❤️ for testing agentic coding tools** 🛠️
