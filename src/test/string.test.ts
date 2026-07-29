import { describe, it, expect } from 'vitest';
import { capitalize } from '../utils/string';

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle strings with multiple words', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle strings that already start with uppercase', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle strings with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello');
  });

  it('should handle strings with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });
});
