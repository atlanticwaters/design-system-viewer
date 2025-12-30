// Fill Roles
// Semantic fill colors for interactive and container elements

export const fills = {
  // Primary fills (brand orange)
  primary: '#F96302',
  primaryHover: '#E55A02',
  primaryPressed: '#CC5002',
  primaryDisabled: 'rgba(249, 99, 2, 0.38)',

  // Secondary fills (bottle green)
  secondary: '#4A8165',
  secondaryHover: '#3D6B54',
  secondaryPressed: '#305544',
  secondaryDisabled: 'rgba(74, 129, 101, 0.38)',

  // Tertiary fills (greige)
  tertiary: '#A69F94',
  tertiaryHover: '#8F887D',
  tertiaryPressed: '#787166',
  tertiaryDisabled: 'rgba(166, 159, 148, 0.38)',

  // Neutral fills
  neutral: '#F1EDE8',
  neutralHover: '#E8E3DC',
  neutralPressed: '#DED8CF',
  neutralDisabled: 'rgba(241, 237, 232, 0.38)',

  // Inverse fills (for dark backgrounds)
  inverse: '#FFFFFF',
  inverseHover: 'rgba(255, 255, 255, 0.9)',
  inversePressed: 'rgba(255, 255, 255, 0.8)',
  inverseDisabled: 'rgba(255, 255, 255, 0.38)',

  // Semantic fills
  error: '#DF3427',
  errorHover: '#C82D21',
  errorPressed: '#B1261B',
  errorDisabled: 'rgba(223, 52, 39, 0.38)',

  success: '#4A8165',
  successHover: '#3D6B54',
  successPressed: '#305544',
  successDisabled: 'rgba(74, 129, 101, 0.38)',

  warning: '#CFB73A',
  warningHover: '#B9A334',
  warningPressed: '#A3902E',
  warningDisabled: 'rgba(207, 183, 58, 0.38)',

  info: '#5B8FA8',
  infoHover: '#4D7A91',
  infoPressed: '#40657A',
  infoDisabled: 'rgba(91, 143, 168, 0.38)',
} as const;

export const fillsDark = {
  // Primary fills (brand orange - slightly adjusted for dark mode)
  primary: '#FF7A1A',
  primaryHover: '#FF8C33',
  primaryPressed: '#F96302',
  primaryDisabled: 'rgba(255, 122, 26, 0.38)',

  // Secondary fills (bottle green - lighter for dark mode)
  secondary: '#5A9B7A',
  secondaryHover: '#6AAB8A',
  secondaryPressed: '#4A8165',
  secondaryDisabled: 'rgba(90, 155, 122, 0.38)',

  // Tertiary fills
  tertiary: '#B8B0A5',
  tertiaryHover: '#C8C0B5',
  tertiaryPressed: '#A69F94',
  tertiaryDisabled: 'rgba(184, 176, 165, 0.38)',

  // Neutral fills (inverted for dark mode)
  neutral: '#2F2F2E',
  neutralHover: '#3A3A38',
  neutralPressed: '#454543',
  neutralDisabled: 'rgba(47, 47, 46, 0.38)',

  // Inverse fills
  inverse: '#1A1A1A',
  inverseHover: 'rgba(26, 26, 26, 0.9)',
  inversePressed: 'rgba(26, 26, 26, 0.8)',
  inverseDisabled: 'rgba(26, 26, 26, 0.38)',

  // Semantic fills (adjusted for dark mode)
  error: '#EF5A4D',
  errorHover: '#F16D61',
  errorPressed: '#DF3427',
  errorDisabled: 'rgba(239, 90, 77, 0.38)',

  success: '#5A9B7A',
  successHover: '#6AAB8A',
  successPressed: '#4A8165',
  successDisabled: 'rgba(90, 155, 122, 0.38)',

  warning: '#DFC94D',
  warningHover: '#E5D261',
  warningPressed: '#CFB73A',
  warningDisabled: 'rgba(223, 201, 77, 0.38)',

  info: '#6BA0B8',
  infoHover: '#7BB0C8',
  infoPressed: '#5B8FA8',
  infoDisabled: 'rgba(107, 160, 184, 0.38)',
} as const;

// On-fill colors (text/icons on filled backgrounds)
export const onFill = {
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onNeutral: '#252524',
  onInverse: '#252524',
  onError: '#FFFFFF',
  onSuccess: '#FFFFFF',
  onWarning: '#252524',
  onInfo: '#FFFFFF',
} as const;

export const onFillDark = {
  onPrimary: '#1A1A1A',
  onSecondary: '#FFFFFF',
  onTertiary: '#1A1A1A',
  onNeutral: '#F8F5F2',
  onInverse: '#F8F5F2',
  onError: '#1A1A1A',
  onSuccess: '#FFFFFF',
  onWarning: '#1A1A1A',
  onInfo: '#1A1A1A',
} as const;

export type FillToken = keyof typeof fills;
export type OnFillToken = keyof typeof onFill;
