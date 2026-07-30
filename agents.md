# Agents Configuration

This document configures how agentic coding tools should work on the **Aine Forge Tester** project.

## 🎯 Agent Initialization

When starting work on this project, agents **MUST** begin with a pun or witty remark related to the task at hand. This sets a positive, creative tone for the session and acknowledges the collaborative nature of agentic development.

### Examples of Opening Puns

- For adding features: *"Time to forge ahead with this feature—looks like we're really going to **hammer** this out!"*
- For bug fixes: *"Looks like we've got a **bug** to squash—time to get **debugging**!"*
- For testing: *"Let's make sure this code **passes the test** of time!"*
- For refactoring: *"Time to **refactor** our approach—let's make this code **factor** in some improvements!"*

## 📋 Working Guidelines

### Before Starting

1. **Read the wiki** — Check relevant wiki pages (coding-standards, theme-system, architecture-decisions, known-issues) to understand project conventions and gotchas.
2. **Explore the codebase** — Use `list_files` and `read_file` to understand the structure before making changes.
3. **Never edit without reading** — Always read a file completely before editing it.

### During Development

1. **Follow coding standards** — Adhere to the standards documented in `coding-standards` wiki page:
   - TypeScript strict mode
   - ESLint zero-warnings policy
   - File naming conventions (PascalCase for components, camelCase for utilities)
   - CSS co-location with components
   - Test files placed next to source files

2. **Run checks frequently** — Use `npm run lint`, `npm run test`, and `npm run build` to catch issues early.

3. **Commit logically** — Make focused commits with clear messages after each logical unit of work.

4. **Test your changes** — Ensure all tests pass and no new warnings are introduced.

### After Completion

1. **Verify all checks pass**:
   - `npm run lint` — must have zero warnings
   - `npm run test` — all tests must pass
   - `npm run build` — production build must succeed

2. **Open a pull request** — Provide a clear title and markdown body describing what changed and why.

3. **Update wiki if needed** — If you discovered something durable about the project (a convention, a trap, how a subsystem works), record it in the wiki so future sessions benefit.

## 🏗️ Project Structure Quick Reference

```
src/
  components/   # Reusable UI components
  pages/        # Route-level page components
  utils/        # Shared utilities and context
  test/         # Global test setup and utility tests
  App.tsx       # Router + ThemeProvider root
  main.tsx      # Entry point
  index.css     # Global CSS variables
```

## 🎨 Design System

- **Theme system**: Light/dark mode via `data-theme` attribute on `<html>`
- **CSS tokens**: Custom properties in `src/index.css` (e.g., `--primary-color`, `--text-color`)
- **No CSS-in-JS**: Plain `.css` files imported directly into components
- **Responsive**: Mobile-first approach with flexible layouts

## 🧪 Testing Requirements

- Test environment: `jsdom`
- Testing libraries: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- Vitest globals enabled (no need to import `describe`, `it`, `expect`)
- Setup file: `src/test/setup.ts`

## ⚠️ Known Gotchas

- **yarn.lock vs npm-lock**: Use `npm ci` in CI; `package-lock.json` is authoritative
- **NODE_ENV conflict**: `src/test/setup.ts` sets `NODE_ENV = 'development'` to override Vite's test define
- **React Refresh**: Non-component exports from modules trigger warnings; use the context file pattern (separate `ContextType.ts`, `Context.tsx`, `useHook.ts`)
- **Network restrictions**: Only GitHub and package registries are accessible; no external API calls
- **Stateless game navigation**: Games don't persist state across navigation; design accordingly

## 📚 Wiki Pages

Refer to these wiki pages for detailed information:

- **coding-standards** — Language versions, commands, file layout, naming conventions, TypeScript strictness
- **theme-system** — How light/dark theme works, ThemeProvider, useTheme hook
- **authentication-system** — Login, register, profile pages, protected routes
- **architecture-decisions** — SPA structure, routing, component vs. page split, data storage
- **known-issues** — Untested pages, Wordle word-length bug, NODE_ENV conflict, unused VITE_API_URL, yarn.lock conflict, stateless game navigation

## 🚀 Continuous Integration

The CI pipeline (`.github/workflows/ci.yml`) runs:

1. **Lint** — `npm run lint` (zero warnings required)
2. **Test** — `npm run test` (all tests must pass)
3. **Build** — `npm run build` (production build must succeed)

All three must pass before a PR can be merged.

---

**Happy coding! Remember: with great code comes great responsibility—and great puns.** 🎭
