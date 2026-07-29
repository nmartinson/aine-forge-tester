import '@testing-library/jest-dom'

// Ensure React is in development mode for tests
if (typeof global !== 'undefined') {
  global.process = global.process || {}
  global.process.env = global.process.env || {}
  global.process.env.NODE_ENV = 'development'
}
