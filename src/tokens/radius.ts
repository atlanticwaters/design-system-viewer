// Design System Border Radius
// Based on tokens from /Users/awaters/Desktop/tokens/core/radius.json

export const radius = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 6,
  6: 8,
  7: 12,
  8: 16,
  9: 20,
  10: 24,
  11: 28,
  12: 32,
  13: 36,
  14: 40,
  15: 44,
  16: 48,
  17: 52,
  18: 56,
  19: 60,
  20: 64,
  full: 9999,  // Pill shape
};

// Named radius for common use cases
export const borderRadius = {
  none: radius[0],
  xs: radius[2],     // 2px - subtle rounding
  sm: radius[4],     // 4px - small components
  md: radius[6],     // 8px - medium components
  lg: radius[8],     // 16px - large components
  xl: radius[10],    // 24px - extra large
  full: radius.full, // 9999px - pill shape (buttons)
};

// Border widths
export const borderWidth = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
};
