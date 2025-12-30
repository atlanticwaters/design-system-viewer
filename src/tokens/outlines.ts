// Outline & Border Roles
// Semantic outline colors for borders, dividers, and focus rings

export const outlines = {
  // Standard outlines
  outline: '#A69F94',                    // Default border color
  outlineVariant: '#DED8CF',             // Subtle dividers, decorative borders
  outlineStrong: '#787166',              // High emphasis borders

  // Focus rings
  focusRing: '#F96302',                  // Primary focus indicator
  focusRingError: '#DF3427',             // Error state focus
  focusRingSuccess: '#4A8165',           // Success state focus

  // Interactive borders
  inputDefault: '#A69F94',
  inputHover: '#787166',
  inputFocused: '#F96302',
  inputError: '#DF3427',
  inputDisabled: 'rgba(166, 159, 148, 0.38)',

  // Semantic borders
  borderPrimary: '#F96302',
  borderSecondary: '#4A8165',
  borderError: '#DF3427',
  borderSuccess: '#4A8165',
  borderWarning: '#CFB73A',
  borderInfo: '#5B8FA8',

  // Structural borders
  divider: '#E8E3DC',
  dividerStrong: '#DED8CF',
  separator: '#F1EDE8',
} as const;

export const outlinesDark = {
  // Standard outlines
  outline: '#5A5A58',
  outlineVariant: '#3A3A38',
  outlineStrong: '#8F887D',

  // Focus rings
  focusRing: '#FF7A1A',
  focusRingError: '#EF5A4D',
  focusRingSuccess: '#5A9B7A',

  // Interactive borders
  inputDefault: '#5A5A58',
  inputHover: '#8F887D',
  inputFocused: '#FF7A1A',
  inputError: '#EF5A4D',
  inputDisabled: 'rgba(90, 90, 88, 0.38)',

  // Semantic borders
  borderPrimary: '#FF7A1A',
  borderSecondary: '#5A9B7A',
  borderError: '#EF5A4D',
  borderSuccess: '#5A9B7A',
  borderWarning: '#DFC94D',
  borderInfo: '#6BA0B8',

  // Structural borders
  divider: '#2F2F2E',
  dividerStrong: '#3A3A38',
  separator: '#252524',
} as const;

// Border widths
export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
  focus: 2,
  heavy: 4,
} as const;

// Border styles for different contexts
export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
} as const;

export type OutlineToken = keyof typeof outlines;
export type BorderWidthToken = keyof typeof borderWidth;
