// Design System Colors
// Based on tokens from /Users/awaters/Desktop/tokens/core/color.json

export const colors = {
  // Brand (Orange) - Primary color palette
  brand: {
    '025': '#FFFAF6',
    '050': '#FEF2E9',
    '100': '#FEDAC3',
    '200': '#FBA268',
    '300': '#F96302', // Primary brand color
    '400': '#E95C02',
    '500': '#CA5002',
    '600': '#B34701',
    '700': '#953B01',
    '800': '#783001',
    '900': '#401A01',
    '950': '#180900',
  },

  // Bottle Green - Secondary/Success color palette
  bottleGreen: {
    '025': '#FAFCFB',
    '050': '#F0F5F3',
    '100': '#D8E4DE',
    '200': '#A0BEAE',
    '300': '#739E88',
    '400': '#63937B',
    '500': '#4A8165', // Secondary/Success
    '600': '#397456',
    '700': '#226242',
    '800': '#0D502E',
    '900': '#002C12',
    '950': '#001006',
  },

  // Greige - Neutral color palette
  greige: {
    '025': '#FBFAF9',
    '050': '#F8F5F2',
    '100': '#E5E1DE',
    '200': '#BAB7B4',
    '300': '#979492',
    '400': '#8B8887',
    '500': '#787675',
    '600': '#6A6867',
    '700': '#585756',
    '800': '#474545',
    '900': '#252524',
    '950': '#0D0D0D',
  },

  // Lemon - Warning color palette
  lemon: {
    '025': '#FEFBED',
    '050': '#FDF6D2',
    '100': '#F9E270',
    '200': '#CFB73A', // Warning
    '300': '#A59547',
    '400': '#978948',
    '500': '#817747',
    '600': '#716945',
    '700': '#5C573F',
    '800': '#4A4637',
    '900': '#262521',
    '950': '#0D0D0D',
  },

  // Cinnabar - Error/Danger color palette
  cinnabar: {
    '025': '#FEF9F9',
    '050': '#FDF1F0',
    '100': '#FBDAD7',
    '200': '#F5A29B',
    '300': '#F06B61',
    '400': '#ED5549',
    '500': '#DF3427', // Error
    '600': '#C62E23',
    '700': '#A5271D',
    '800': '#861F17',
    '900': '#49110D',
    '950': '#1C0605',
  },

  // Moonlight - Info/Accent color palette
  moonlight: {
    '025': '#FBFBFD',
    '050': '#F3F4F8',
    '100': '#DFE1EB',
    '200': '#B0B6D0',
    '300': '#8B93B9',
    '400': '#7E87B1',
    '500': '#6974A5', // Info
    '600': '#5A669B',
    '700': '#495489',
    '800': '#3A446D',
    '900': '#1E243A',
    '950': '#0B0C14',
  },

  // Chamoisee - Warm neutral palette
  chamoisee: {
    '025': '#FCFBFB',
    '050': '#F7F4F2',
    '100': '#E8E0DB',
    '200': '#C7B4A8',
    '300': '#AC8F7C',
    '400': '#A3826E',
    '500': '#90705B',
    '600': '#806351',
    '700': '#6B5243',
    '800': '#554236',
    '900': '#2D231C',
    '950': '#100C0A',
  },

  // Neutrals
  neutrals: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Shadows
  shadow: {
    '50': 'rgba(0, 0, 0, 0.05)',
    '100': 'rgba(0, 0, 0, 0.10)',
    '200': 'rgba(0, 0, 0, 0.12)',
    '300': 'rgba(0, 0, 0, 0.18)',
    '500': 'rgba(0, 0, 0, 0.24)',
  },

  // Transparent overlays
  transparentWhite: {
    '025': 'rgba(255, 255, 255, 0.02)',
    '050': 'rgba(255, 255, 255, 0.05)',
    '100': 'rgba(255, 255, 255, 0.10)',
    '200': 'rgba(255, 255, 255, 0.15)',
    '300': 'rgba(255, 255, 255, 0.20)',
    '500': 'rgba(255, 255, 255, 0.32)',
    '600': 'rgba(255, 255, 255, 0.50)',
    '700': 'rgba(255, 255, 255, 0.60)',
    '800': 'rgba(255, 255, 255, 0.70)',
    '900': 'rgba(255, 255, 255, 0.88)',
  },

  transparentBlack: {
    '025': 'rgba(0, 0, 0, 0.02)',
    '050': 'rgba(0, 0, 0, 0.05)',
    '100': 'rgba(0, 0, 0, 0.10)',
    '200': 'rgba(0, 0, 0, 0.15)',
    '300': 'rgba(0, 0, 0, 0.20)',
    '500': 'rgba(0, 0, 0, 0.32)',
    '600': 'rgba(0, 0, 0, 0.50)',
    '700': 'rgba(0, 0, 0, 0.60)',
    '800': 'rgba(0, 0, 0, 0.70)',
    '900': 'rgba(0, 0, 0, 0.88)',
  },
};

// Semantic color aliases for light mode
export const semanticLight = {
  primary: colors.brand['300'],
  primaryHover: colors.brand['400'],
  primaryPressed: colors.brand['500'],

  secondary: colors.bottleGreen['500'],
  secondaryHover: colors.bottleGreen['600'],
  secondaryPressed: colors.bottleGreen['700'],

  surface: colors.neutrals.white,
  surfaceSecondary: colors.greige['050'],
  surfaceTertiary: colors.greige['100'],

  onSurface: colors.greige['900'],
  onSurfaceSecondary: colors.greige['700'],
  onSurfaceTertiary: colors.greige['500'],

  border: colors.greige['200'],
  borderStrong: colors.greige['400'],

  success: colors.bottleGreen['500'],
  successLight: colors.bottleGreen['050'],

  warning: colors.lemon['200'],
  warningLight: colors.lemon['050'],

  error: colors.cinnabar['500'],
  errorLight: colors.cinnabar['050'],

  info: colors.moonlight['500'],
  infoLight: colors.moonlight['050'],
};

// Semantic color aliases for dark mode
export const semanticDark = {
  primary: colors.brand['300'],
  primaryHover: colors.brand['200'],
  primaryPressed: colors.brand['400'],

  secondary: colors.bottleGreen['400'],
  secondaryHover: colors.bottleGreen['300'],
  secondaryPressed: colors.bottleGreen['500'],

  surface: colors.greige['950'],
  surfaceSecondary: colors.greige['900'],
  surfaceTertiary: colors.greige['800'],

  onSurface: colors.greige['050'],
  onSurfaceSecondary: colors.greige['200'],
  onSurfaceTertiary: colors.greige['400'],

  border: colors.greige['700'],
  borderStrong: colors.greige['500'],

  success: colors.bottleGreen['400'],
  successLight: colors.bottleGreen['900'],

  warning: colors.lemon['100'],
  warningLight: colors.lemon['900'],

  error: colors.cinnabar['400'],
  errorLight: colors.cinnabar['900'],

  info: colors.moonlight['400'],
  infoLight: colors.moonlight['900'],
};

export type SemanticColors = typeof semanticLight;
