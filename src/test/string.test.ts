import { describe, it, expect } from 'vitest'
import { capitalize, capitalizeFirst } from '../utils/string'

describe('capitalize', () => {
  it('should capitalize a lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should capitalize strings with multiple words', () => {
    expect(capitalize('hello world')).toBe('Hello world')
  })

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('should handle strings already starting with uppercase', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })

  it('should handle strings starting with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello')
  })

  it('should handle strings starting with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc')
  })
})

describe('capitalizeFirst', () => {
  it('should capitalize a lowercase string', () => {
    expect(capitalizeFirst('hello')).toBe('Hello')
  })

  it('should handle empty strings', () => {
    expect(capitalizeFirst('')).toBe('')
  })

  it('should handle single character strings', () => {
    expect(capitalizeFirst('a')).toBe('A')
  })
})
