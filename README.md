# Aine Forge Tester

A TypeScript/React application - main side of the conflict.

[![CI and Deploy](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml/badge.svg)](https://github.com/royceacho-wwt/aine-forge-tester/actions/workflows/ci.yml)


## 📋 Overview

This repository is set up as a foundation for testing agentic coding tools. It includes:

- **TypeScript + React 18** - Modern React with full type safety
- **Vite** - Fast development server and build tool
- **Vitest** - Unit testing framework with React Testing Library
- **ESLint** - Code linting and style enforcement
- **GitHub Actions** - CI pipeline with automated testing and deployment
- **GitHub Pages** - Automatic deployment on push to main

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
│   │   └── Header.test.tsx
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
- Add React Router for navigation
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
