/**
 * Capitalizes first letter of given string and replaces hyphens with spaces.
 *
 * @param {string} value string to be capitalized
 * @return {string} capitalized string
 */
export function capitalizeFirstLetter(value: string): string {
  const newValue = value.replace("-", " ");
  return newValue.charAt(0).toUpperCase() + newValue.slice(1);
}
