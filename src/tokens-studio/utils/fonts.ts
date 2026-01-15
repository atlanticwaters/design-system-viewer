/**
 * Font utilities for consistent font usage across components
 *
 * Font Strategy:
 * - THD LgVar: Use for 16px and larger
 * - Open Sans: Use for smaller than 16px
 */

// Font stacks
export const FONT_THD = "'THD LgVar', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
export const FONT_OPEN_SANS = "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

/**
 * Returns the appropriate font family based on font size
 * @param fontSize - The font size in pixels (number) or as a string like '14px'
 * @returns The font family string to use
 */
export function getFontFamily(fontSize: number | string): string {
  const size = typeof fontSize === 'string' ? parseInt(fontSize, 10) : fontSize;
  return size < 16 ? FONT_OPEN_SANS : FONT_THD;
}
