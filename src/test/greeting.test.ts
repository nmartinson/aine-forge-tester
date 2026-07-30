import { describe, it, expect } from 'vitest'
import { greeting } from '../utils/greeting'

describe('greeting', () => {
  it('should return a greeting with the provided name', () => {
    expect(greeting('Alice')).toBe('Hello, Alice!')
  })

  it('should work with different names', () => {
    expect(greeting('Bob')).toBe('Hello, Bob!')
  })

  it('should handle empty strings', () => {
    expect(greeting('')).toBe('Hello, !')
  })

  it('should handle names with spaces', () => {
    expect(greeting('John Doe')).toBe('Hello, John Doe!')
  })
})
