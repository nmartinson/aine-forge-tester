import { describe, it, expect } from 'vitest'
import { greet } from './greet'

describe('greet', () => {
  it('greets by name with an exclamation mark', () => {
    expect(greet('Forge')).toBe('Hello, Forge!')
  })
})
