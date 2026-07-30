import { describe, it, expect } from 'vitest'
import { farewell } from '../utils/farewell'

describe('farewell', () => {
  it('should return a farewell message with the given name', () => {
    expect(farewell('Alice')).toBe('Goodbye, Alice!')
  })

  it('should work with different names', () => {
    expect(farewell('Bob')).toBe('Goodbye, Bob!')
  })

  it('should handle empty strings', () => {
    expect(farewell('')).toBe('Goodbye, !')
  })

  it('should handle names with special characters', () => {
    expect(farewell("O'Brien")).toBe("Goodbye, O'Brien!")
  })

  it('should handle names with spaces', () => {
    expect(farewell('John Doe')).toBe('Goodbye, John Doe!')
  })
})
