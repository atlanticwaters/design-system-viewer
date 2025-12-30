// Surface Container Hierarchy
// Covers both iOS surface needs and Material 3 surface container system

export const surfaces = {
  // Base surfaces
  surface: '#FFFFFF',
  surfaceInverse: '#1A1A1A',

  // Material 3 Surface Container Hierarchy (light mode)
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8F5F2',      // greige-025
  surfaceContainer: '#F1EDE8',          // greige-050
  surfaceContainerHigh: '#E8E3DC',      // greige-100
  surfaceContainerHighest: '#DED8CF',   // greige-200

  // Brightness variants
  surfaceDim: '#E8E3DC',                // greige-100
  surfaceBright: '#FFFFFF',

  // Scrim & Overlays
  scrim: 'rgba(0, 0, 0, 0.32)',
  scrimLight: 'rgba(0, 0, 0, 0.08)',
  scrimHeavy: 'rgba(0, 0, 0, 0.64)',
} as const;

export const surfacesDark = {
  // Base surfaces
  surface: '#1A1A1A',
  surfaceInverse: '#FFFFFF',

  // Material 3 Surface Container Hierarchy (dark mode)
  surfaceContainerLowest: '#0D0D0D',
  surfaceContainerLow: '#1A1A1A',
  surfaceContainer: '#252524',
  surfaceContainerHigh: '#2F2F2E',
  surfaceContainerHighest: '#3A3A38',

  // Brightness variants
  surfaceDim: '#1A1A1A',
  surfaceBright: '#3A3A38',

  // Scrim & Overlays
  scrim: 'rgba(0, 0, 0, 0.64)',
  scrimLight: 'rgba(0, 0, 0, 0.32)',
  scrimHeavy: 'rgba(0, 0, 0, 0.80)',
} as const;

// iOS Materials (blur effect types)
// These are conceptual - actual implementation uses CSS backdrop-filter or native APIs
export const materials = {
  ultraThin: {
    blur: 4,
    saturation: 1.8,
    opacity: 0.3,
  },
  thin: {
    blur: 10,
    saturation: 1.8,
    opacity: 0.5,
  },
  regular: {
    blur: 20,
    saturation: 1.8,
    opacity: 0.7,
  },
  thick: {
    blur: 30,
    saturation: 1.8,
    opacity: 0.85,
  },
  chrome: {
    blur: 30,
    saturation: 1.2,
    opacity: 0.9,
  },
} as const;

// iOS Vibrancy levels (content visibility on materials)
export const vibrancy = {
  primary: 1.0,      // Highest contrast - titles, important content
  secondary: 0.7,    // Standard content
  tertiary: 0.5,     // Less prominent content
  quaternary: 0.3,   // Subtle, decorative content
} as const;

export type SurfaceToken = keyof typeof surfaces;
export type MaterialType = keyof typeof materials;
export type VibrancyLevel = keyof typeof vibrancy;
