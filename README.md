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

## 🚀 Onboarding Guide

### Quick Start (5 minutes)

1. **Clone the repository**
   ```bash
   git clone https://github.com/nmartinson/aine-forge-tester.git
   cd aine-forge-tester
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Development Workflow

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in the `src/` directory

3. **Test your changes locally**
   ```bash
   npm run dev
   ```
   Open your browser and verify the changes

4. **Run tests**
   ```bash
   npm run test
   ```

5. **Check linting**
   ```bash
   npm run lint
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

7. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** on GitHub for review

#### Common Development Tasks

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Run tests once | `npm run test` |
| Run tests in watch mode | `npm run test:watch` |
| Check code style | `npm run lint` |
| Fix linting issues | `npm run lint -- --fix` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Generate coverage report | `npm run test:coverage` |

### Project Structure Overview

```
src/
├── components/          # Reusable React components
│   ├── Counter.tsx      # Example: Interactive counter
│   ├── FeatureCard.tsx  # Example: Feature display card
│   ├── Header.tsx       # Example: Page header
│   └── *.test.tsx       # Component tests
├── test/
│   └── setup.ts         # Test configuration
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

### Creating a New Component

1. **Create the component file** in `src/components/`
   ```tsx
   // src/components/MyComponent.tsx
   export function MyComponent() {
     return <div>My Component</div>;
   }
   ```

2. **Create a test file** for your component
   ```tsx
   // src/components/MyComponent.test.tsx
   import { render, screen } from '@testing-library/react';
   import { MyComponent } from './MyComponent';

   describe('MyComponent', () => {
     it('renders correctly', () => {
       render(<MyComponent />);
       expect(screen.getByText('My Component')).toBeInTheDocument();
     });
   });
   ```

3. **Import and use** in `App.tsx` or other components

### Before Submitting a Pull Request

Ensure all checks pass:

```bash
# Run tests
npm run test

# Check linting
npm run lint

# Build to catch any TypeScript errors
npm run build
```

All of these must pass before your PR can be merged.

### Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**
```bash
npm run test:watch
```
This will run tests in watch mode, making it easier to debug.

**Linting errors?**
```bash
npm run lint -- --fix
```
This will automatically fix many common issues.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/nmartinson/aine-forge-tester.git
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
