/**
 * Capitalizes the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized
 */
export function capitalize(str: string): string {
  if (str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Capitalizes the first letter of a string (pure utility)
 * @param str - The string to capitalize
 * @returns The string with the first letter uppercased, empty string safe
 */
export function capitalizeFirst(str: string): string {
  return str.length === 0 ? '' : str.charAt(0).toUpperCase() + str.slice(1)
}
