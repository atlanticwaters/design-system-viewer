// Design System Colors
// Based on tokens from https://github.com/atlanticwaters/Tokens-Studio-Sandbox

export const colors = {
  // Brand (Orange) - Primary color palette
  brand: {
    '025': '#fffaf6',
    '050': '#fef2e9',
    '100': '#fedac3',
    '200': '#fba268',
    '300': '#f96302', // Primary brand color
    '400': '#e95c02',
    '500': '#ca5002',
    '600': '#b34701',
    '700': '#953b01',
    '800': '#783001',
    '900': '#401a01',
    '950': '#180900',
  },

  // Bottle Green - Secondary/Success color palette
  bottleGreen: {
    '025': '#fafcfb',
    '050': '#f0f5f3',
    '100': '#d8e4de',
    '200': '#a0beae',
    '300': '#739e88',
    '400': '#63937b',
    '500': '#4a8165', // Secondary/Success
    '600': '#397456',
    '700': '#226242',
    '800': '#0d502e',
    '900': '#002c12',
    '950': '#001006',
  },

  // Greige - Neutral color palette
  greige: {
    '025': '#fbfaf9',
    '050': '#f8f5f2',
    '100': '#e5e1de',
    '200': '#bab7b4',
    '300': '#979492',
    '400': '#8b8887',
    '500': '#787675',
    '600': '#6a6867',
    '700': '#585756',
    '800': '#474545',
    '900': '#252524',
    '950': '#0d0d0d',
  },

  // Lemon - Warning color palette
  lemon: {
    '025': '#fefbed',
    '050': '#fdf6d2',
    '100': '#f9e270',
    '200': '#cfb73a', // Warning
    '300': '#a59547',
    '400': '#978948',
    '500': '#817747',
    '600': '#716945',
    '700': '#5c573f',
    '800': '#4a4637',
    '900': '#262521',
    '950': '#0d0d0d',
  },

  // Cinnabar - Error/Danger color palette
  cinnabar: {
    '025': '#fef9f9',
    '050': '#fdf1f0',
    '100': '#fbdad7',
    '200': '#f5a29b',
    '300': '#f06b61',
    '400': '#ed5549',
    '500': '#df3427', // Error
    '600': '#c62e23',
    '700': '#a5271d',
    '800': '#861f17',
    '900': '#49110d',
    '950': '#1c0605',
  },

  // Moonlight - Info/Accent color palette
  moonlight: {
    '025': '#fbfbfd',
    '050': '#f3f4f8',
    '100': '#dfe1eb',
    '200': '#b0b6d0',
    '300': '#8b93b9',
    '400': '#7e87b1',
    '500': '#6974a5', // Info
    '600': '#5a669b',
    '700': '#495489',
    '800': '#3a446d',
    '900': '#1e243a',
    '950': '#0b0c14',
  },

  // Chamoisee - Warm neutral palette
  chamoisee: {
    '025': '#fcfbfb',
    '050': '#f7f4f2',
    '100': '#e8e0db',
    '200': '#c7b4a8',
    '300': '#ac8f7c',
    '400': '#a3826e',
    '500': '#90705b',
    '600': '#806351',
    '700': '#6b5243',
    '800': '#554236',
    '900': '#2d231c',
    '950': '#100c0a',
  },

  // Neutrals
  neutrals: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Transparent overlays - Black
  transparentBlack: {
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

  // Transparent overlays - White
  transparentWhite: {
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

  // Shadows
  shadow: {
    '50': 'rgba(0, 0, 0, 0.05)',
    '100': 'rgba(0, 0, 0, 0.10)',
    '200': 'rgba(0, 0, 0, 0.12)',
    '300': 'rgba(0, 0, 0, 0.18)',
    '500': 'rgba(0, 0, 0, 0.24)',
  },
};

// =============================================================================
// SEMANTIC TOKENS - LIGHT MODE
// Based on semantic/light.json from Tokens Studio Sandbox
// =============================================================================

export const semanticLight = {
  // Legacy aliases (for backward compatibility)
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

  // ==========================================================================
  // NEW SYSTEM TOKENS (from Tokens Studio Sandbox)
  // ==========================================================================

  // Icon colors - on surface
  icon: {
    onSurface: {
      primary: colors.greige['900'],
      secondary: colors.greige['800'],
      tertiary: colors.greige['600'],
      inactive: colors.greige['200'],
      inverse: colors.neutrals.white,
      error: colors.cinnabar['500'],
      success: colors.bottleGreen['500'],
      warning: colors.lemon['500'],
      informational: colors.moonlight['500'],
      brandAccent1: colors.brand['300'],
      brandAccent2: colors.brand['500'],
    },
    onContainer: {
      primary: colors.greige['900'],
      secondary: colors.greige['800'],
      tertiary: colors.greige['600'],
      inactive: colors.greige['200'],
      inverse: colors.neutrals.white,
      error: colors.cinnabar['500'],
      success: colors.bottleGreen['500'],
      warning: colors.lemon['500'],
      informational: colors.moonlight['500'],
      brandAccent1: colors.brand['300'],
      brandAccent2: colors.brand['500'],
    },
  },

  // Text colors - on surface
  text: {
    onSurface: {
      primary: colors.greige['900'],
      secondary: colors.greige['800'],
      tertiary: colors.greige['600'],
      quatrenary: colors.greige['500'],
      inactive: colors.greige['300'],
      inverse: colors.neutrals.white,
      inverseAccent: colors.greige['025'],
      brandAccent1: colors.brand['300'],
      brandAccent2: colors.brand['700'],
      errorAccent1: colors.cinnabar['600'],
      errorAccent2: colors.cinnabar['800'],
      successAccent1: colors.bottleGreen['500'],
      successAccent2: colors.bottleGreen['700'],
      warningAccent1: colors.lemon['500'],
      warningAccent2: colors.lemon['700'],
      informationalAccent1: colors.moonlight['500'],
      informationalAccent2: colors.moonlight['700'],
    },
    onContainer: {
      primary: colors.greige['900'],
      secondary: colors.greige['800'],
      tertiary: colors.greige['600'],
      quatrenary: colors.greige['500'],
      inactive: colors.greige['300'],
      inverse: colors.neutrals.white,
      inverseAccent: colors.greige['025'],
      brandAccent1: colors.brand['300'],
      brandAccent2: colors.brand['700'],
      errorAccent1: colors.cinnabar['600'],
      errorAccent2: colors.cinnabar['800'],
      successAccent1: colors.bottleGreen['500'],
      successAccent2: colors.bottleGreen['700'],
      warningAccent1: colors.lemon['500'],
      warningAccent2: colors.lemon['700'],
      informationalAccent1: colors.moonlight['500'],
      informationalAccent2: colors.moonlight['700'],
    },
    link: colors.moonlight['500'],
    disabled: colors.greige['300'],
    destructive: colors.cinnabar['600'],
    placeholder: colors.greige['500'],
  },

  // Background colors
  background: {
    accent: {
      redAccent1: colors.cinnabar['100'],
      redAccent2: colors.cinnabar['500'],
      blueAccent1: colors.moonlight['100'],
      blueAccent2: colors.moonlight['500'],
      brandAccent1: colors.brand['100'],
      brandAccent2: colors.brand['400'],
      brownAccent1: colors.chamoisee['100'],
      brownAccent2: colors.chamoisee['700'],
      greenAccent1: colors.bottleGreen['100'],
      greenAccent2: colors.bottleGreen['600'],
      yellowAccent1: colors.lemon['050'],
      yellowAccent2: colors.lemon['100'],
      darkGreigeAccent1: colors.greige['600'],
      darkGreigeAccent2: colors.greige['800'],
      lightGreigeAccent1: colors.greige['100'],
      lightGreigeAccent2: colors.greige['200'],
    },
    overlay: {
      pageScrim: colors.transparentBlack['100'],
    },
    surface: {
      greige: colors.greige['050'],
      inverse: colors.greige['950'],
    },
    container: {
      brand: colors.brand['300'],
      white: colors.neutrals.white,
      greige: colors.greige['050'],
      inverse: colors.greige['900'],
      brandAccent: colors.brand['050'],
      transparent05: colors.transparentBlack['050'],
      transparent10: colors.transparentBlack['100'],
      transparent20: colors.transparentBlack['300'],
    },
  },

  // Border colors
  borderColors: {
    accent: {
      red: colors.cinnabar['500'],
      blue: colors.moonlight['500'],
      brown: colors.chamoisee['700'],
      brand: colors.brand['400'],
      green: colors.bottleGreen['500'],
      greige: colors.greige['600'],
      yellow: colors.lemon['200'],
      darkGreige: colors.greige['900'],
    },
    container: {
      primary: colors.greige['200'],
      secondary: colors.greige['900'],
      tertiary: colors.greige['900'],
      inactive: colors.greige['100'],
      inverse: colors.transparentWhite['100'],
    },
  },
};

// =============================================================================
// SEMANTIC TOKENS - DARK MODE
// Based on semantic/dark.json from Tokens Studio Sandbox
// =============================================================================

export const semanticDark = {
  // Legacy aliases (for backward compatibility)
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

  // ==========================================================================
  // NEW SYSTEM TOKENS (from Tokens Studio Sandbox)
  // ==========================================================================

  // Icon colors - on surface
  icon: {
    onSurface: {
      primary: colors.greige['100'],
      secondary: colors.greige['200'],
      tertiary: colors.greige['300'],
      inactive: colors.greige['500'],
      inverse: colors.neutrals.black,
      error: colors.cinnabar['600'],
      success: colors.bottleGreen['600'],
      warning: colors.lemon['600'],
      informational: colors.moonlight['600'],
      brandAccent1: colors.brand['400'],
      brandAccent2: colors.brand['500'],
    },
    onContainer: {
      primary: colors.greige['100'],
      secondary: colors.greige['200'],
      tertiary: colors.greige['300'],
      inactive: colors.greige['500'],
      inverse: colors.neutrals.white,
      error: colors.cinnabar['600'],
      success: colors.bottleGreen['600'],
      warning: colors.lemon['600'],
      informational: colors.moonlight['600'],
      brandAccent1: colors.brand['400'],
      brandAccent2: colors.brand['500'],
    },
  },

  // Text colors - on surface
  text: {
    onSurface: {
      primary: colors.greige['025'],
      secondary: colors.greige['100'],
      tertiary: colors.greige['200'],
      quatrenary: colors.greige['400'],
      inactive: colors.greige['300'],
      inverse: colors.greige['900'],
      inverseAccent: colors.greige['900'],
      brandAccent1: colors.brand['300'],
      brandAccent2: colors.brand['500'],
      errorAccent1: colors.cinnabar['300'],
      errorAccent2: colors.cinnabar['500'],
      successAccent1: colors.bottleGreen['200'],
      successAccent2: colors.bottleGreen['400'],
      warningAccent1: colors.lemon['200'],
      warningAccent2: colors.lemon['400'],
      informationalAccent1: colors.moonlight['300'],
      informationalAccent2: colors.moonlight['500'],
    },
    onContainer: {
      primary: colors.neutrals.white,
      secondary: colors.greige['200'],
      tertiary: colors.greige['300'],
      quatrenary: colors.greige['400'],
      inactive: colors.greige['600'],
      inverse: colors.greige['900'],
      inverseAccent: colors.greige['900'],
      brandAccent1: colors.brand['200'],
      brandAccent2: colors.brand['400'],
      errorAccent1: colors.cinnabar['500'],
      errorAccent2: colors.cinnabar['500'],
      successAccent1: colors.bottleGreen['500'],
      successAccent2: colors.bottleGreen['400'],
      warningAccent1: colors.lemon['500'],
      warningAccent2: colors.lemon['400'],
      informationalAccent1: colors.moonlight['500'],
      informationalAccent2: colors.moonlight['700'],
    },
    link: colors.moonlight['200'],
    disabled: colors.greige['200'],
    destructive: colors.cinnabar['300'],
    placeholder: colors.greige['100'],
  },

  // Background colors
  background: {
    accent: {
      redAccent1: colors.cinnabar['100'],
      redAccent2: colors.cinnabar['500'],
      blueAccent1: colors.moonlight['100'],
      blueAccent2: colors.moonlight['500'],
      brandAccent1: colors.brand['800'],
      brandAccent2: colors.brand['300'],
      brownAccent1: colors.chamoisee['800'],
      brownAccent2: colors.chamoisee['600'],
      greenAccent1: colors.bottleGreen['800'],
      greenAccent2: colors.bottleGreen['600'],
      yellowAccent1: colors.lemon['050'],
      yellowAccent2: colors.lemon['100'],
      darkGreigeAccent1: colors.greige['400'],
      darkGreigeAccent2: colors.greige['600'],
      lightGreigeAccent1: colors.greige['100'],
      lightGreigeAccent2: colors.greige['200'],
    },
    overlay: {
      pageScrim: colors.transparentBlack['100'],
    },
    surface: {
      greige: colors.greige['950'],
      inverse: colors.neutrals.white,
    },
    container: {
      brand: colors.brand['400'],
      white: colors.greige['050'],
      greige: colors.greige['800'],
      inverse: colors.greige['900'],
      brandAccent: colors.brand['100'],
      transparent05: colors.neutrals.white,
      transparent10: colors.transparentWhite['100'],
      transparent20: colors.transparentWhite['300'],
    },
  },

  // Border colors
  borderColors: {
    accent: {
      red: colors.cinnabar['500'],
      blue: colors.moonlight['500'],
      brown: colors.chamoisee['600'],
      brand: colors.brand['300'],
      green: colors.bottleGreen['500'],
      greige: colors.greige['300'],
      yellow: colors.lemon['100'],
      darkGreige: colors.greige['600'],
    },
    container: {
      primary: colors.greige['700'],
      secondary: colors.greige['600'],
      tertiary: colors.greige['600'],
      inactive: colors.greige['950'],
      inverse: colors.transparentBlack['100'],
    },
  },
};

export type SemanticColors = typeof semanticLight;
