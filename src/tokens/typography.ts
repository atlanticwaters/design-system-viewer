// Design System Typography
// Based on tokens from /Users/awaters/Desktop/tokens/core/typography.json
// Using Open Sans as the cross-platform Google Font

export const fontFamily = {
  primary: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  display: "'THD LgVar', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const fontSize = {
  // Body sizes
  bodyXs: 12,
  bodySm: 14,
  bodyMd: 16,
  bodyLg: 18,
  bodyXl: 20,

  // Heading sizes
  h6: 16,
  h5: 18,
  h4: 20,
  h3: 24,
  h2: 28,
  h1: 32,

  // Hero sizes
  hero5: 36,
  hero4: 40,
  hero3: 48,
  hero2: 56,
  hero1: 64,
};

export const lineHeight = {
  none: 1.0,      // 100%
  tight: 1.25,    // 125%
  base: 1.5,      // 150%
};

export const letterSpacing = {
  normal: 0,
  condensed: 1,
};

// Typography style presets
export const typography = {
  // Body styles
  bodyXs: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyXs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodySm: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyMd: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyLg: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyLg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyXl: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyXl,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },

  // Body bold variants
  bodyXsBold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyXs,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodySmBold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyMdBold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },
  bodyLgBold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyLg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  },

  // Heading styles
  h6: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h5,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h4,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h3: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  h1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Hero styles
  hero5: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.hero5,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.condensed,
  },
  hero4: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.hero4,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  hero3: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.hero3,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  hero2: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.hero2,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },
  hero1: {
    fontFamily: fontFamily.display,
    fontSize: fontSize.hero1,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Label styles
  label: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodyXs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  labelLg: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
};

export type TypographyStyle = typeof typography.bodyMd;
