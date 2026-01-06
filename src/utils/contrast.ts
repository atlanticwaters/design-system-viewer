// WCAG Contrast Ratio Calculation Utilities

/**
 * Parse a hex color string to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Handle 3-character hex
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);

  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Parse an rgba color string to RGB values
 * Composites against white for light backgrounds or black for dark backgrounds
 */
export function rgbaToRgb(
  rgba: string,
  backgroundIsLight: boolean = true
): { r: number; g: number; b: number } | null {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);

  if (!match) return null;

  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = match[4] ? parseFloat(match[4]) : 1;

  // Composite against white (255) or black (0) based on background
  const bg = backgroundIsLight ? 255 : 0;

  return {
    r: Math.round(r * a + bg * (1 - a)),
    g: Math.round(g * a + bg * (1 - a)),
    b: Math.round(b * a + bg * (1 - a)),
  };
}

/**
 * Parse any color string (hex or rgba) to RGB values
 */
export function parseColor(
  color: string,
  backgroundIsLight: boolean = true
): { r: number; g: number; b: number } | null {
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  if (color.startsWith('rgb')) {
    return rgbaToRgb(color, backgroundIsLight);
  }
  return null;
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio like 4.5 (representing 4.5:1)
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgRgb = parseColor(foreground);
  const bgRgb = parseColor(background);

  if (!fgRgb || !bgRgb) {
    console.warn('Could not parse colors:', { foreground, background });
    return 1;
  }

  const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG rating types
 */
export type WcagRating = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/**
 * Determine WCAG compliance level based on contrast ratio
 * - AAA: >= 7:1 (enhanced accessibility)
 * - AA: >= 4.5:1 (minimum for normal text)
 * - AA Large: >= 3:1 (acceptable for large text 18pt+ or 14pt bold)
 * - Fail: < 3:1 (does not meet accessibility standards)
 */
export function getWcagRating(ratio: number): WcagRating {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}
