// Brand Palette Configurations
// 4 brands: Sawdust, Sawdust Pro, Mahogany, Mahogany Pro
// Each brand has BOTH light and dark appearance objects
// Pro brands are distinct identities with higher-contrast, brighter accents

import { colors } from './colors';

export interface BrandAppearance {
  accent: string;
  accentSecondary: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  onSurface: string;
  onSurfaceSecondary: string;
  border: string;
  cardBg: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface BrandPalette {
  name: string;
  primary: Record<string, string>;
  secondary: Record<string, string>;
  neutral: Record<string, string>;
  light: BrandAppearance;
  dark: BrandAppearance;
}

// --- Mahogany color scales ---

const mahoganyPrimary: Record<string, string> = {
  '025': '#faf7f6',
  '050': '#f5edeb',
  '100': '#e8d5d0',
  '200': '#c9a097',
  '300': '#A0584A',
  '400': '#8B4D40',
  '500': '#6B3A2A',
  '600': '#5C3124',
  '700': '#4A271D',
  '800': '#3B1F17',
  '900': '#20110D',
  '950': '#0E0806',
};

const mahoganySecondary: Record<string, string> = {
  '025': '#f7f9fa',
  '050': '#eef2f5',
  '100': '#d4dfe6',
  '200': '#9db5c4',
  '300': '#6B8FA8',
  '400': '#5D8098',
  '500': '#4A7088',
  '600': '#3E607A',
  '700': '#314E65',
  '800': '#273E51',
  '900': '#14212B',
  '950': '#090E12',
};

const mahoganyNeutral: Record<string, string> = {
  '025': '#f9fafa',
  '050': '#f3f4f5',
  '100': '#e0e2e4',
  '200': '#b5b9bc',
  '300': '#8e9396',
  '400': '#7f8487',
  '500': '#6b7074',
  '600': '#5d6266',
  '700': '#4d5154',
  '800': '#3d4043',
  '900': '#212324',
  '950': '#0c0d0d',
};

// --- Mahogany Pro shifted scales (brighter / higher contrast) ---

const mahoganyProPrimary: Record<string, string> = {
  '025': '#fdf8f7',
  '050': '#f9efed',
  '100': '#f0dbd6',
  '200': '#d9a99e',
  '300': '#C46B5A',
  '400': '#AD5E4E',
  '500': '#8A4838',
  '600': '#753D2F',
  '700': '#5E3126',
  '800': '#4B271E',
  '900': '#291510',
  '950': '#120A08',
};

const mahoganyProSecondary: Record<string, string> = {
  '025': '#f8fafb',
  '050': '#eff4f7',
  '100': '#d9e5ec',
  '200': '#a8c2d0',
  '300': '#5A8FA8',
  '400': '#6A9DB6',
  '500': '#5A8FA8',
  '600': '#4B7C95',
  '700': '#3C657A',
  '800': '#2F5062',
  '900': '#182A34',
  '950': '#0B1318',
};

// --- Sawdust Pro shifted scales (brighter orange) ---

const sawdustProPrimary: Record<string, string> = {
  '025': '#fff9f4',
  '050': '#fff0e2',
  '100': '#ffd9b5',
  '200': '#ffab5c',
  '300': '#FF7A1A',
  '400': '#F07016',
  '500': '#D46312',
  '600': '#B8560F',
  '700': '#99470C',
  '800': '#7D3A0A',
  '900': '#431F05',
  '950': '#1A0C02',
};

const sawdustProSecondary: Record<string, string> = {
  '025': '#f7fbf9',
  '050': '#ecf4f0',
  '100': '#cfe0d7',
  '200': '#84b89c',
  '300': '#4A9B6C',
  '400': '#3D8A5C',
  '500': '#2D7A50',
  '600': '#236B43',
  '700': '#195A36',
  '800': '#10482A',
  '900': '#082816',
  '950': '#030E08',
};

// --- Brand definitions ---

export const sawdust: BrandPalette = {
  name: 'Sawdust',
  primary: { ...colors.brand },
  secondary: { ...colors.bottleGreen },
  neutral: { ...colors.greige },
  light: {
    accent: colors.brand['300'],
    accentSecondary: colors.bottleGreen['500'],
    surface: '#FFFFFF',
    surfaceSecondary: colors.greige['050'],
    surfaceTertiary: colors.greige['100'],
    onSurface: colors.greige['900'],
    onSurfaceSecondary: colors.greige['700'],
    border: colors.greige['200'],
    cardBg: '#FFFFFF',
    error: '#DF3427',
    success: colors.bottleGreen['500'],
    warning: '#E8A317',
    info: '#2B7BC0',
  },
  dark: {
    accent: colors.brand['300'],
    accentSecondary: colors.bottleGreen['400'],
    surface: colors.greige['950'],
    surfaceSecondary: colors.greige['900'],
    surfaceTertiary: colors.greige['800'],
    onSurface: colors.greige['050'],
    onSurfaceSecondary: colors.greige['200'],
    border: colors.greige['700'],
    cardBg: colors.greige['900'],
    error: '#EF5A4D',
    success: colors.bottleGreen['300'],
    warning: '#F5BD4F',
    info: '#5BA0DC',
  },
};

export const sawdustPro: BrandPalette = {
  name: 'Sawdust Pro',
  primary: sawdustProPrimary,
  secondary: sawdustProSecondary,
  neutral: { ...colors.greige },
  light: {
    accent: '#FF7A1A',
    accentSecondary: '#2D7A50',
    surface: '#FEFCFA',
    surfaceSecondary: colors.greige['050'],
    surfaceTertiary: colors.greige['100'],
    onSurface: colors.greige['950'],
    onSurfaceSecondary: colors.greige['700'],
    border: colors.greige['200'],
    cardBg: '#FFFFFF',
    error: '#D32F2F',
    success: '#2D7A50',
    warning: '#E8A317',
    info: '#1976D2',
  },
  dark: {
    accent: '#FF7A1A',
    accentSecondary: '#4A9B6C',
    surface: '#0F0D0A',
    surfaceSecondary: '#1C1916',
    surfaceTertiary: '#292521',
    onSurface: '#FAF7F4',
    onSurfaceSecondary: colors.greige['200'],
    border: colors.greige['700'],
    cardBg: '#1C1916',
    error: '#FF6B6B',
    success: '#4A9B6C',
    warning: '#FFD166',
    info: '#64B5F6',
  },
};

export const mahogany: BrandPalette = {
  name: 'Mahogany',
  primary: mahoganyPrimary,
  secondary: mahoganySecondary,
  neutral: mahoganyNeutral,
  light: {
    accent: mahoganyPrimary['300'],
    accentSecondary: mahoganySecondary['500'],
    surface: '#FFFFFF',
    surfaceSecondary: mahoganyNeutral['050'],
    surfaceTertiary: mahoganyNeutral['100'],
    onSurface: mahoganyNeutral['900'],
    onSurfaceSecondary: mahoganyNeutral['600'],
    border: mahoganyNeutral['200'],
    cardBg: '#FFFFFF',
    error: '#C62828',
    success: '#2E7D32',
    warning: '#F57F17',
    info: '#1565C0',
  },
  dark: {
    accent: mahoganyPrimary['300'],
    accentSecondary: mahoganySecondary['300'],
    surface: mahoganyNeutral['950'],
    surfaceSecondary: mahoganyNeutral['900'],
    surfaceTertiary: mahoganyNeutral['800'],
    onSurface: mahoganyNeutral['050'],
    onSurfaceSecondary: mahoganyNeutral['200'],
    border: mahoganyNeutral['700'],
    cardBg: mahoganyNeutral['900'],
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    info: '#42A5F5',
  },
};

export const mahoganyPro: BrandPalette = {
  name: 'Mahogany Pro',
  primary: mahoganyProPrimary,
  secondary: mahoganyProSecondary,
  neutral: mahoganyNeutral,
  light: {
    accent: '#C46B5A',
    accentSecondary: '#5A8FA8',
    surface: '#FDFBFA',
    surfaceSecondary: mahoganyNeutral['050'],
    surfaceTertiary: mahoganyNeutral['100'],
    onSurface: mahoganyNeutral['950'],
    onSurfaceSecondary: mahoganyNeutral['600'],
    border: mahoganyNeutral['200'],
    cardBg: '#FFFFFF',
    error: '#B71C1C',
    success: '#1B5E20',
    warning: '#E65100',
    info: '#0D47A1',
  },
  dark: {
    accent: '#C46B5A',
    accentSecondary: '#5A8FA8',
    surface: '#0A0A0B',
    surfaceSecondary: '#161718',
    surfaceTertiary: '#232425',
    onSurface: '#F5F6F7',
    onSurfaceSecondary: mahoganyNeutral['200'],
    border: mahoganyNeutral['700'],
    cardBg: '#161718',
    error: '#FF8A80',
    success: '#69F0AE',
    warning: '#FFD180',
    info: '#82B1FF',
  },
};

export const allBrands: BrandPalette[] = [sawdust, sawdustPro, mahogany, mahoganyPro];
