// Interactive State System
// Covers iOS states and Material 3 state layers

// State layer opacities (Material 3 spec)
export const stateLayerOpacity = {
  hover: 0.08,      // 8% - subtle hover indication
  focus: 0.12,      // 12% - keyboard focus
  pressed: 0.12,    // 12% - active/pressed
  dragged: 0.16,    // 16% - during drag operations
  disabled: 0.38,   // 38% - disabled state
} as const;

// State layers applied to surfaces (light mode)
export const stateLayers = {
  // On primary color
  onPrimaryHover: 'rgba(249, 99, 2, 0.08)',
  onPrimaryFocus: 'rgba(249, 99, 2, 0.12)',
  onPrimaryPressed: 'rgba(249, 99, 2, 0.12)',
  onPrimaryDragged: 'rgba(249, 99, 2, 0.16)',

  // On surface (default)
  onSurfaceHover: 'rgba(37, 37, 36, 0.08)',
  onSurfaceFocus: 'rgba(37, 37, 36, 0.12)',
  onSurfacePressed: 'rgba(37, 37, 36, 0.12)',
  onSurfaceDragged: 'rgba(37, 37, 36, 0.16)',

  // On secondary
  onSecondaryHover: 'rgba(74, 129, 101, 0.08)',
  onSecondaryFocus: 'rgba(74, 129, 101, 0.12)',
  onSecondaryPressed: 'rgba(74, 129, 101, 0.12)',
  onSecondaryDragged: 'rgba(74, 129, 101, 0.16)',

  // On error
  onErrorHover: 'rgba(223, 52, 39, 0.08)',
  onErrorFocus: 'rgba(223, 52, 39, 0.12)',
  onErrorPressed: 'rgba(223, 52, 39, 0.12)',
  onErrorDragged: 'rgba(223, 52, 39, 0.16)',

  // Inverse (for dark surfaces in light mode)
  onInverseHover: 'rgba(255, 255, 255, 0.08)',
  onInverseFocus: 'rgba(255, 255, 255, 0.12)',
  onInversePressed: 'rgba(255, 255, 255, 0.12)',
  onInverseDragged: 'rgba(255, 255, 255, 0.16)',
} as const;

export const stateLayersDark = {
  // On primary color
  onPrimaryHover: 'rgba(255, 122, 26, 0.08)',
  onPrimaryFocus: 'rgba(255, 122, 26, 0.12)',
  onPrimaryPressed: 'rgba(255, 122, 26, 0.12)',
  onPrimaryDragged: 'rgba(255, 122, 26, 0.16)',

  // On surface
  onSurfaceHover: 'rgba(248, 245, 242, 0.08)',
  onSurfaceFocus: 'rgba(248, 245, 242, 0.12)',
  onSurfacePressed: 'rgba(248, 245, 242, 0.12)',
  onSurfaceDragged: 'rgba(248, 245, 242, 0.16)',

  // On secondary
  onSecondaryHover: 'rgba(90, 155, 122, 0.08)',
  onSecondaryFocus: 'rgba(90, 155, 122, 0.12)',
  onSecondaryPressed: 'rgba(90, 155, 122, 0.12)',
  onSecondaryDragged: 'rgba(90, 155, 122, 0.16)',

  // On error
  onErrorHover: 'rgba(239, 90, 77, 0.08)',
  onErrorFocus: 'rgba(239, 90, 77, 0.12)',
  onErrorPressed: 'rgba(239, 90, 77, 0.12)',
  onErrorDragged: 'rgba(239, 90, 77, 0.16)',

  // Inverse
  onInverseHover: 'rgba(26, 26, 26, 0.08)',
  onInverseFocus: 'rgba(26, 26, 26, 0.12)',
  onInversePressed: 'rgba(26, 26, 26, 0.12)',
  onInverseDragged: 'rgba(26, 26, 26, 0.16)',
} as const;

// iOS-specific state styles
export const iosStates = {
  // Highlight styles (iOS uses overlay rather than opacity change)
  highlightOverlay: 'rgba(0, 0, 0, 0.1)',
  highlightOverlayDark: 'rgba(255, 255, 255, 0.1)',

  // Selection states
  selected: {
    background: 'rgba(249, 99, 2, 0.12)',
    border: '#F96302',
  },
  selectedDark: {
    background: 'rgba(255, 122, 26, 0.12)',
    border: '#FF7A1A',
  },

  // Focus ring (iOS uses system blue by default, we use brand)
  focusRing: {
    color: '#F96302',
    width: 3,
    offset: 2,
  },
} as const;

// Android-specific elevation tonal overlay
// In dark theme, Material 3 uses tonal elevation (surface gets lighter with elevation)
export const elevationTonalOverlay = {
  level0: 'transparent',
  level1: 'rgba(249, 99, 2, 0.05)',   // +5% primary
  level2: 'rgba(249, 99, 2, 0.08)',   // +8% primary
  level3: 'rgba(249, 99, 2, 0.11)',   // +11% primary
  level4: 'rgba(249, 99, 2, 0.12)',   // +12% primary
  level5: 'rgba(249, 99, 2, 0.14)',   // +14% primary
} as const;

// Complete state definitions for components
export const componentStates = {
  button: {
    enabled: { opacity: 1, cursor: 'pointer' },
    hovered: { opacity: 1, cursor: 'pointer' },
    focused: { opacity: 1, cursor: 'pointer' },
    pressed: { opacity: 1, cursor: 'pointer' },
    disabled: { opacity: 0.38, cursor: 'not-allowed' },
    loading: { opacity: 0.7, cursor: 'wait' },
  },
  input: {
    enabled: { opacity: 1 },
    hovered: { opacity: 1 },
    focused: { opacity: 1 },
    error: { opacity: 1 },
    disabled: { opacity: 0.38 },
    readOnly: { opacity: 0.7 },
  },
  toggle: {
    off: { opacity: 1 },
    on: { opacity: 1 },
    disabled: { opacity: 0.38 },
    offHovered: { opacity: 1 },
    onHovered: { opacity: 1 },
  },
} as const;

export type StateLayerToken = keyof typeof stateLayers;
export type ElevationTonalLevel = keyof typeof elevationTonalOverlay;
