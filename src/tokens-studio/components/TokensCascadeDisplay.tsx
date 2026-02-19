import React, { useState, useMemo, useCallback } from 'react';
import { FONT_OPEN_SANS } from '../utils/fonts';

// ---------------------------------------------------------------------------
// Cascade data model
// ---------------------------------------------------------------------------

type TokenType = 'color' | 'spacing' | 'shadow' | 'fill';

interface CascadeChain {
  id: string;
  category: string;
  tokenType: TokenType;
  coreToken: {
    name: string;
    defaultValue: string;
    palette?: string;
    shade?: string;
    preset?: string;
  };
  semanticToken: { name: string; description: string };
  componentToken: { name: string; description: string };
  previewType: PreviewType;
}

type PreviewType =
  // Color
  | 'button-primary'
  | 'button-secondary'
  | 'button-destructive'
  | 'card-surface'
  | 'card-brand'
  | 'text-primary'
  | 'text-secondary'
  | 'text-link'
  | 'text-error'
  | 'badge-success'
  | 'badge-warning'
  | 'badge-info'
  | 'badge-error'
  | 'input-border'
  | 'input-focus'
  | 'alert-success'
  | 'alert-warning'
  | 'alert-error'
  | 'alert-info'
  | 'toggle-on'
  | 'chip'
  | 'avatar'
  | 'divider'
  | 'nav-item'
  | 'tooltip'
  | 'progress-bar'
  | 'skeleton'
  // Spacing
  | 'spacing-card-padding'
  | 'spacing-stack-gap'
  | 'spacing-inline-gap'
  | 'spacing-section-margin'
  | 'spacing-input-padding'
  // Shadow
  | 'shadow-card'
  | 'shadow-dropdown'
  | 'shadow-modal'
  | 'shadow-button'
  | 'shadow-floating-action'
  | 'shadow-tooltip'
  // Border
  | 'border-input'
  | 'border-card'
  | 'border-divider'
  | 'border-button-outline'
  | 'border-focus-ring'
  | 'border-accent'
  // Fill
  | 'fill-button-primary'
  | 'fill-button-secondary'
  | 'fill-card-surface'
  | 'fill-chip'
  | 'fill-nav-active';

// ---------------------------------------------------------------------------
// Scales
// ---------------------------------------------------------------------------

const SPACING_SCALE = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

const SHADOW_SCALE: { name: string; value: string }[] = [
  { name: 'none', value: 'none' },
  { name: 'xs', value: '0 1px 2px rgba(0,0,0,0.05)' },
  { name: 'sm', value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' },
  { name: 'md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' },
  { name: 'lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' },
  { name: 'xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' },
  { name: '2xl', value: '0 25px 50px -12px rgba(0,0,0,0.25)' },
];


// ---------------------------------------------------------------------------
// Default palette values (matching colors.ts)
// ---------------------------------------------------------------------------

const PALETTES: Record<string, Record<string, string>> = {
  brand: {
    '025': '#fffaf6', '050': '#fef2e9', '100': '#fedac3', '200': '#fba268',
    '300': '#f96302', '400': '#e95c02', '500': '#ca5002', '600': '#b34701',
    '700': '#953b01', '800': '#783001', '900': '#401a01', '950': '#180900',
  },
  'bottle-green': {
    '025': '#fafcfb', '050': '#f0f5f3', '100': '#d8e4de', '200': '#a0beae',
    '300': '#739e88', '400': '#63937b', '500': '#4a8165', '600': '#397456',
    '700': '#226242', '800': '#0d502e', '900': '#002c12', '950': '#001006',
  },
  greige: {
    '025': '#fbfaf9', '050': '#f8f5f2', '100': '#e5e1de', '200': '#bab7b4',
    '300': '#979492', '400': '#8b8887', '500': '#787675', '600': '#6a6867',
    '700': '#585756', '800': '#474545', '900': '#252524', '950': '#0d0d0d',
  },
  lemon: {
    '025': '#fefbed', '050': '#fdf6d2', '100': '#f9e270', '200': '#cfb73a',
    '300': '#a59547', '400': '#978948', '500': '#817747', '600': '#716945',
    '700': '#5c573f', '800': '#4a4637', '900': '#262521', '950': '#0d0d0d',
  },
  cinnabar: {
    '025': '#fef9f9', '050': '#fdf1f0', '100': '#fbdad7', '200': '#f5a29b',
    '300': '#f06b61', '400': '#ed5549', '500': '#df3427', '600': '#c62e23',
    '700': '#a5271d', '800': '#861f17', '900': '#49110d', '950': '#1c0605',
  },
  moonlight: {
    '025': '#fbfbfd', '050': '#f3f4f8', '100': '#dfe1eb', '200': '#b0b6d0',
    '300': '#8b93b9', '400': '#7e87b1', '500': '#6974a5', '600': '#5a669b',
    '700': '#495489', '800': '#3a446d', '900': '#1e243a', '950': '#0b0c14',
  },
  chamoisee: {
    '025': '#fcfbfb', '050': '#f7f4f2', '100': '#e8e0db', '200': '#c7b4a8',
    '300': '#ac8f7c', '400': '#a3826e', '500': '#90705b', '600': '#806351',
    '700': '#6b5243', '800': '#554236', '900': '#2d231c', '950': '#100c0a',
  },
};

// ---------------------------------------------------------------------------
// Cascade chain definitions
// ---------------------------------------------------------------------------

const CASCADE_CHAINS: CascadeChain[] = [
  // ── Brand / Primary ──────────────────────────────────────────────────
  {
    id: 'brand-primary-btn',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-300', palette: 'brand', shade: '300', defaultValue: '#f96302' },
    semanticToken: { name: 'primary', description: 'Primary action color' },
    componentToken: { name: 'Button / Primary / Background', description: 'Fill color for primary buttons' },
    previewType: 'button-primary',
  },
  {
    id: 'brand-hover-btn',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-400', palette: 'brand', shade: '400', defaultValue: '#e95c02' },
    semanticToken: { name: 'primaryHover', description: 'Hover state for primary elements' },
    componentToken: { name: 'Button / Primary / Hover', description: 'Fill on hover of primary buttons' },
    previewType: 'button-primary',
  },
  {
    id: 'brand-text-accent',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-300', palette: 'brand', shade: '300', defaultValue: '#f96302' },
    semanticToken: { name: 'text.onSurface.brandAccent1', description: 'Brand accent text on surfaces' },
    componentToken: { name: 'Badge / Brand / Text', description: 'Brand badge label color' },
    previewType: 'chip',
  },
  {
    id: 'brand-bg-accent',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-100', palette: 'brand', shade: '100', defaultValue: '#fedac3' },
    semanticToken: { name: 'background.accent.brandAccent1', description: 'Light brand accent background' },
    componentToken: { name: 'Card / Brand / Background', description: 'Brand accent card fill' },
    previewType: 'card-brand',
  },
  {
    id: 'brand-container',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-050', palette: 'brand', shade: '050', defaultValue: '#fef2e9' },
    semanticToken: { name: 'background.container.brandAccent', description: 'Subtle brand container fill' },
    componentToken: { name: 'Tooltip / Brand / Background', description: 'Brand tooltip fill' },
    previewType: 'tooltip',
  },
  {
    id: 'brand-progress',
    category: 'Brand / Primary',
    tokenType: 'color',
    coreToken: { name: 'brand-500', palette: 'brand', shade: '500', defaultValue: '#ca5002' },
    semanticToken: { name: 'primaryPressed', description: 'Active / pressed state' },
    componentToken: { name: 'ProgressBar / Fill', description: 'Progress indicator fill' },
    previewType: 'progress-bar',
  },

  // ── Neutrals / Surface ───────────────────────────────────────────────
  {
    id: 'greige-onsurface',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-900', palette: 'greige', shade: '900', defaultValue: '#252524' },
    semanticToken: { name: 'onSurface', description: 'Primary text on light surfaces' },
    componentToken: { name: 'Card / Text / Primary', description: 'Main card body text color' },
    previewType: 'text-primary',
  },
  {
    id: 'greige-surface-secondary',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-050', palette: 'greige', shade: '050', defaultValue: '#f8f5f2' },
    semanticToken: { name: 'surfaceSecondary', description: 'Secondary surface background' },
    componentToken: { name: 'Card / Surface', description: 'Card background fill' },
    previewType: 'card-surface',
  },
  {
    id: 'greige-border',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-200', palette: 'greige', shade: '200', defaultValue: '#bab7b4' },
    semanticToken: { name: 'border', description: 'Default border color' },
    componentToken: { name: 'Input / Border / Default', description: 'Input field resting border' },
    previewType: 'input-border',
  },
  {
    id: 'greige-text-secondary',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-700', palette: 'greige', shade: '700', defaultValue: '#585756' },
    semanticToken: { name: 'onSurfaceSecondary', description: 'Secondary text on surfaces' },
    componentToken: { name: 'Card / Text / Subtitle', description: 'Card subtitle text color' },
    previewType: 'text-secondary',
  },
  {
    id: 'greige-surface-tertiary',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-100', palette: 'greige', shade: '100', defaultValue: '#e5e1de' },
    semanticToken: { name: 'surfaceTertiary', description: 'Tertiary background' },
    componentToken: { name: 'Chip / Background', description: 'Filter chip background' },
    previewType: 'chip',
  },
  {
    id: 'greige-divider',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-200', palette: 'greige', shade: '200', defaultValue: '#bab7b4' },
    semanticToken: { name: 'borderColors.container.primary', description: 'Container border' },
    componentToken: { name: 'Divider / Default', description: 'Horizontal separator line' },
    previewType: 'divider',
  },
  {
    id: 'greige-skeleton',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-100', palette: 'greige', shade: '100', defaultValue: '#e5e1de' },
    semanticToken: { name: 'background.accent.lightGreigeAccent1', description: 'Light greige accent' },
    componentToken: { name: 'Skeleton / Shimmer', description: 'Loading skeleton base color' },
    previewType: 'skeleton',
  },
  {
    id: 'greige-inverse',
    category: 'Neutrals / Surface',
    tokenType: 'color',
    coreToken: { name: 'greige-950', palette: 'greige', shade: '950', defaultValue: '#0d0d0d' },
    semanticToken: { name: 'background.surface.inverse', description: 'Inverse surface (dark)' },
    componentToken: { name: 'NavBar / Background', description: 'Dark navigation bar background' },
    previewType: 'nav-item',
  },

  // ── Error / Danger ───────────────────────────────────────────────────
  {
    id: 'cinnabar-error',
    category: 'Error / Danger',
    tokenType: 'color',
    coreToken: { name: 'cinnabar-500', palette: 'cinnabar', shade: '500', defaultValue: '#df3427' },
    semanticToken: { name: 'error', description: 'Error / danger indicator' },
    componentToken: { name: 'Alert / Error / Icon', description: 'Error alert icon color' },
    previewType: 'alert-error',
  },
  {
    id: 'cinnabar-error-text',
    category: 'Error / Danger',
    tokenType: 'color',
    coreToken: { name: 'cinnabar-600', palette: 'cinnabar', shade: '600', defaultValue: '#c62e23' },
    semanticToken: { name: 'text.onSurface.errorAccent1', description: 'Error text on surfaces' },
    componentToken: { name: 'Form / Error / Message', description: 'Inline validation error text' },
    previewType: 'text-error',
  },
  {
    id: 'cinnabar-error-light',
    category: 'Error / Danger',
    tokenType: 'color',
    coreToken: { name: 'cinnabar-050', palette: 'cinnabar', shade: '050', defaultValue: '#fdf1f0' },
    semanticToken: { name: 'errorLight', description: 'Light error background' },
    componentToken: { name: 'Alert / Error / Background', description: 'Error alert container fill' },
    previewType: 'alert-error',
  },
  {
    id: 'cinnabar-destructive-btn',
    category: 'Error / Danger',
    tokenType: 'color',
    coreToken: { name: 'cinnabar-500', palette: 'cinnabar', shade: '500', defaultValue: '#df3427' },
    semanticToken: { name: 'text.destructive', description: 'Destructive action text' },
    componentToken: { name: 'Button / Destructive / Text', description: 'Destructive button label' },
    previewType: 'button-destructive',
  },
  {
    id: 'cinnabar-badge',
    category: 'Error / Danger',
    tokenType: 'color',
    coreToken: { name: 'cinnabar-500', palette: 'cinnabar', shade: '500', defaultValue: '#df3427' },
    semanticToken: { name: 'icon.onSurface.error', description: 'Error icon on surface' },
    componentToken: { name: 'Badge / Error / Background', description: 'Error badge fill' },
    previewType: 'badge-error',
  },

  // ── Success ──────────────────────────────────────────────────────────
  {
    id: 'green-success',
    category: 'Success',
    tokenType: 'color',
    coreToken: { name: 'bottle-green-500', palette: 'bottle-green', shade: '500', defaultValue: '#4a8165' },
    semanticToken: { name: 'success', description: 'Success indicator' },
    componentToken: { name: 'Badge / Success / Background', description: 'Success badge fill' },
    previewType: 'badge-success',
  },
  {
    id: 'green-success-light',
    category: 'Success',
    tokenType: 'color',
    coreToken: { name: 'bottle-green-050', palette: 'bottle-green', shade: '050', defaultValue: '#f0f5f3' },
    semanticToken: { name: 'successLight', description: 'Light success background' },
    componentToken: { name: 'Alert / Success / Background', description: 'Success alert container fill' },
    previewType: 'alert-success',
  },
  {
    id: 'green-secondary-btn',
    category: 'Success',
    tokenType: 'color',
    coreToken: { name: 'bottle-green-500', palette: 'bottle-green', shade: '500', defaultValue: '#4a8165' },
    semanticToken: { name: 'secondary', description: 'Secondary action color' },
    componentToken: { name: 'Button / Secondary / Background', description: 'Secondary button fill' },
    previewType: 'button-secondary',
  },
  {
    id: 'green-toggle',
    category: 'Success',
    tokenType: 'color',
    coreToken: { name: 'bottle-green-500', palette: 'bottle-green', shade: '500', defaultValue: '#4a8165' },
    semanticToken: { name: 'icon.onSurface.success', description: 'Success icon color' },
    componentToken: { name: 'Toggle / On / Track', description: 'Toggle on-state track color' },
    previewType: 'toggle-on',
  },

  // ── Warning ──────────────────────────────────────────────────────────
  {
    id: 'lemon-warning',
    category: 'Warning',
    tokenType: 'color',
    coreToken: { name: 'lemon-200', palette: 'lemon', shade: '200', defaultValue: '#cfb73a' },
    semanticToken: { name: 'warning', description: 'Warning indicator' },
    componentToken: { name: 'Badge / Warning / Background', description: 'Warning badge fill' },
    previewType: 'badge-warning',
  },
  {
    id: 'lemon-warning-light',
    category: 'Warning',
    tokenType: 'color',
    coreToken: { name: 'lemon-050', palette: 'lemon', shade: '050', defaultValue: '#fdf6d2' },
    semanticToken: { name: 'warningLight', description: 'Light warning background' },
    componentToken: { name: 'Alert / Warning / Background', description: 'Warning alert container fill' },
    previewType: 'alert-warning',
  },

  // ── Info ─────────────────────────────────────────────────────────────
  {
    id: 'moonlight-info',
    category: 'Info',
    tokenType: 'color',
    coreToken: { name: 'moonlight-500', palette: 'moonlight', shade: '500', defaultValue: '#6974a5' },
    semanticToken: { name: 'info', description: 'Informational indicator' },
    componentToken: { name: 'Badge / Info / Background', description: 'Info badge fill' },
    previewType: 'badge-info',
  },
  {
    id: 'moonlight-link',
    category: 'Info',
    tokenType: 'color',
    coreToken: { name: 'moonlight-500', palette: 'moonlight', shade: '500', defaultValue: '#6974a5' },
    semanticToken: { name: 'text.link', description: 'Hyperlink text color' },
    componentToken: { name: 'Link / Text / Default', description: 'Inline link text color' },
    previewType: 'text-link',
  },
  {
    id: 'moonlight-info-light',
    category: 'Info',
    tokenType: 'color',
    coreToken: { name: 'moonlight-050', palette: 'moonlight', shade: '050', defaultValue: '#f3f4f8' },
    semanticToken: { name: 'infoLight', description: 'Light info background' },
    componentToken: { name: 'Alert / Info / Background', description: 'Info alert container fill' },
    previewType: 'alert-info',
  },

  // ── Accent / Decorative ──────────────────────────────────────────────
  {
    id: 'chamoisee-avatar',
    category: 'Accent / Decorative',
    tokenType: 'color',
    coreToken: { name: 'chamoisee-700', palette: 'chamoisee', shade: '700', defaultValue: '#6b5243' },
    semanticToken: { name: 'background.accent.brownAccent2', description: 'Brown accent background' },
    componentToken: { name: 'Avatar / Fallback / Background', description: 'Avatar placeholder fill' },
    previewType: 'avatar',
  },
  {
    id: 'moonlight-input-focus',
    category: 'Accent / Decorative',
    tokenType: 'color',
    coreToken: { name: 'moonlight-500', palette: 'moonlight', shade: '500', defaultValue: '#6974a5' },
    semanticToken: { name: 'borderColors.accent.blue', description: 'Blue accent border' },
    componentToken: { name: 'Input / Border / Focus', description: 'Input focus ring color' },
    previewType: 'input-focus',
  },

  // ── Spacing / Layout ────────────────────────────────────────────────
  {
    id: 'spacing-card-padding',
    category: 'Spacing / Layout',
    tokenType: 'spacing',
    coreToken: { name: 'space-16', defaultValue: '16' },
    semanticToken: { name: 'spacing.card.padding', description: 'Internal card padding' },
    componentToken: { name: 'Card / Padding', description: 'Padding inside card containers' },
    previewType: 'spacing-card-padding',
  },
  {
    id: 'spacing-content-gap',
    category: 'Spacing / Layout',
    tokenType: 'spacing',
    coreToken: { name: 'space-12', defaultValue: '12' },
    semanticToken: { name: 'spacing.content.gap', description: 'Gap between content items' },
    componentToken: { name: 'Stack / Gap', description: 'Vertical stack spacing' },
    previewType: 'spacing-stack-gap',
  },
  {
    id: 'spacing-section-margin',
    category: 'Spacing / Layout',
    tokenType: 'spacing',
    coreToken: { name: 'space-32', defaultValue: '32' },
    semanticToken: { name: 'spacing.section.margin', description: 'Margin between sections' },
    componentToken: { name: 'Section / Margin', description: 'Vertical section spacing' },
    previewType: 'spacing-section-margin',
  },
  {
    id: 'spacing-inline-gap',
    category: 'Spacing / Layout',
    tokenType: 'spacing',
    coreToken: { name: 'space-8', defaultValue: '8' },
    semanticToken: { name: 'spacing.inline.gap', description: 'Gap between inline elements' },
    componentToken: { name: 'Inline / Gap', description: 'Horizontal element spacing' },
    previewType: 'spacing-inline-gap',
  },

  // ── Spacing / Compact ───────────────────────────────────────────────
  {
    id: 'spacing-input-padding',
    category: 'Spacing / Compact',
    tokenType: 'spacing',
    coreToken: { name: 'space-8', defaultValue: '8' },
    semanticToken: { name: 'spacing.input.padding', description: 'Input internal padding' },
    componentToken: { name: 'Input / Padding', description: 'Text field inner spacing' },
    previewType: 'spacing-input-padding',
  },
  {
    id: 'spacing-compact-gap',
    category: 'Spacing / Compact',
    tokenType: 'spacing',
    coreToken: { name: 'space-4', defaultValue: '4' },
    semanticToken: { name: 'spacing.compact.gap', description: 'Tight layout gap' },
    componentToken: { name: 'Compact / Gap', description: 'Dense layout spacing' },
    previewType: 'spacing-inline-gap',
  },
  {
    id: 'spacing-list-gap',
    category: 'Spacing / Compact',
    tokenType: 'spacing',
    coreToken: { name: 'space-12', defaultValue: '12' },
    semanticToken: { name: 'spacing.list.gap', description: 'Gap between list items' },
    componentToken: { name: 'List / Item / Gap', description: 'Vertical list item spacing' },
    previewType: 'spacing-stack-gap',
  },
  {
    id: 'spacing-nav-padding',
    category: 'Spacing / Compact',
    tokenType: 'spacing',
    coreToken: { name: 'space-16', defaultValue: '16' },
    semanticToken: { name: 'spacing.nav.padding', description: 'Navigation padding' },
    componentToken: { name: 'Nav / Padding', description: 'Navigation item internal padding' },
    previewType: 'spacing-card-padding',
  },

  // ── Shadow / Surface ────────────────────────────────────────────────
  {
    id: 'shadow-card',
    category: 'Shadow / Surface',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.md', preset: 'md', defaultValue: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' },
    semanticToken: { name: 'elevation.card', description: 'Card surface elevation' },
    componentToken: { name: 'Card / Shadow', description: 'Drop shadow on card components' },
    previewType: 'shadow-card',
  },
  {
    id: 'shadow-dropdown',
    category: 'Shadow / Surface',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.lg', preset: 'lg', defaultValue: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' },
    semanticToken: { name: 'elevation.dropdown', description: 'Dropdown menu elevation' },
    componentToken: { name: 'Dropdown / Shadow', description: 'Shadow on dropdown menus' },
    previewType: 'shadow-dropdown',
  },
  {
    id: 'shadow-modal',
    category: 'Shadow / Surface',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.xl', preset: 'xl', defaultValue: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' },
    semanticToken: { name: 'elevation.modal', description: 'Modal dialog elevation' },
    componentToken: { name: 'Modal / Shadow', description: 'Shadow on modal overlays' },
    previewType: 'shadow-modal',
  },

  // ── Shadow / Interactive ────────────────────────────────────────────
  {
    id: 'shadow-button',
    category: 'Shadow / Interactive',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.sm', preset: 'sm', defaultValue: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' },
    semanticToken: { name: 'elevation.button', description: 'Button elevation' },
    componentToken: { name: 'Button / Shadow', description: 'Subtle shadow on buttons' },
    previewType: 'shadow-button',
  },
  {
    id: 'shadow-fab',
    category: 'Shadow / Interactive',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.lg', preset: 'lg', defaultValue: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)' },
    semanticToken: { name: 'elevation.fab', description: 'FAB elevation' },
    componentToken: { name: 'FAB / Shadow', description: 'Floating action button shadow' },
    previewType: 'shadow-floating-action',
  },
  {
    id: 'shadow-tooltip',
    category: 'Shadow / Interactive',
    tokenType: 'shadow',
    coreToken: { name: 'shadow.md', preset: 'md', defaultValue: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' },
    semanticToken: { name: 'elevation.tooltip', description: 'Tooltip elevation' },
    componentToken: { name: 'Tooltip / Shadow', description: 'Shadow on tooltip popups' },
    previewType: 'shadow-tooltip',
  },

  // ── Border / Input ──────────────────────────────────────────────────
  {
    id: 'border-input-default',
    category: 'Border / Input',
    tokenType: 'spacing',
    coreToken: { name: 'space-1', defaultValue: '1' },
    semanticToken: { name: 'borderWidth.input.default', description: 'Default input border width' },
    componentToken: { name: 'Input / Border / Width', description: 'Input resting border thickness' },
    previewType: 'border-input',
  },
  {
    id: 'border-input-focus',
    category: 'Border / Input',
    tokenType: 'spacing',
    coreToken: { name: 'space-2', defaultValue: '2' },
    semanticToken: { name: 'borderWidth.input.focus', description: 'Focus ring border width' },
    componentToken: { name: 'Input / Focus / Ring', description: 'Input focus state ring thickness' },
    previewType: 'border-focus-ring',
  },
  {
    id: 'border-button-outline',
    category: 'Border / Input',
    tokenType: 'spacing',
    coreToken: { name: 'space-1', defaultValue: '1' },
    semanticToken: { name: 'borderWidth.button.outline', description: 'Outline button border' },
    componentToken: { name: 'Button / Outline / Border', description: 'Outlined button border thickness' },
    previewType: 'border-button-outline',
  },

  // ── Border / Container ──────────────────────────────────────────────
  {
    id: 'border-card',
    category: 'Border / Container',
    tokenType: 'spacing',
    coreToken: { name: 'space-1', defaultValue: '1' },
    semanticToken: { name: 'borderWidth.card', description: 'Card container border' },
    componentToken: { name: 'Card / Border / Width', description: 'Card border thickness' },
    previewType: 'border-card',
  },
  {
    id: 'border-divider',
    category: 'Border / Container',
    tokenType: 'spacing',
    coreToken: { name: 'space-1', defaultValue: '1' },
    semanticToken: { name: 'borderWidth.divider', description: 'Divider line width' },
    componentToken: { name: 'Divider / Width', description: 'Horizontal separator thickness' },
    previewType: 'border-divider',
  },
  {
    id: 'border-accent',
    category: 'Border / Container',
    tokenType: 'spacing',
    coreToken: { name: 'space-4', defaultValue: '4' },
    semanticToken: { name: 'borderWidth.accent', description: 'Accent border width' },
    componentToken: { name: 'Card / Accent / Border', description: 'Left accent border on cards' },
    previewType: 'border-accent',
  },

  // ── Fill / Interactive ──────────────────────────────────────────────
  {
    id: 'fill-primary-btn',
    category: 'Fill / Interactive',
    tokenType: 'fill',
    coreToken: { name: 'brand-300', palette: 'brand', shade: '300', defaultValue: '#f96302' },
    semanticToken: { name: 'fill.primary', description: 'Primary interactive fill' },
    componentToken: { name: 'Button / Primary / Fill', description: 'Primary button background' },
    previewType: 'fill-button-primary',
  },
  {
    id: 'fill-secondary-btn',
    category: 'Fill / Interactive',
    tokenType: 'fill',
    coreToken: { name: 'bottle-green-500', palette: 'bottle-green', shade: '500', defaultValue: '#4a8165' },
    semanticToken: { name: 'fill.secondary', description: 'Secondary interactive fill' },
    componentToken: { name: 'Button / Secondary / Fill', description: 'Secondary button background' },
    previewType: 'fill-button-secondary',
  },
  {
    id: 'fill-error-btn',
    category: 'Fill / Interactive',
    tokenType: 'fill',
    coreToken: { name: 'cinnabar-500', palette: 'cinnabar', shade: '500', defaultValue: '#df3427' },
    semanticToken: { name: 'fill.error', description: 'Error interactive fill' },
    componentToken: { name: 'Button / Error / Fill', description: 'Error button background' },
    previewType: 'fill-button-primary',
  },
  {
    id: 'fill-active-chip',
    category: 'Fill / Interactive',
    tokenType: 'fill',
    coreToken: { name: 'brand-100', palette: 'brand', shade: '100', defaultValue: '#fedac3' },
    semanticToken: { name: 'fill.chip.active', description: 'Active chip fill' },
    componentToken: { name: 'Chip / Active / Fill', description: 'Selected chip background' },
    previewType: 'fill-chip',
  },

  // ── Fill / Surface ──────────────────────────────────────────────────
  {
    id: 'fill-default-surface',
    category: 'Fill / Surface',
    tokenType: 'fill',
    coreToken: { name: 'greige-025', palette: 'greige', shade: '025', defaultValue: '#fbfaf9' },
    semanticToken: { name: 'fill.surface.default', description: 'Default surface fill' },
    componentToken: { name: 'Card / Surface / Fill', description: 'Default card background' },
    previewType: 'fill-card-surface',
  },
  {
    id: 'fill-secondary-surface',
    category: 'Fill / Surface',
    tokenType: 'fill',
    coreToken: { name: 'greige-050', palette: 'greige', shade: '050', defaultValue: '#f8f5f2' },
    semanticToken: { name: 'fill.surface.secondary', description: 'Secondary surface fill' },
    componentToken: { name: 'Sidebar / Fill', description: 'Secondary panel background' },
    previewType: 'fill-card-surface',
  },
  {
    id: 'fill-inverse-surface',
    category: 'Fill / Surface',
    tokenType: 'fill',
    coreToken: { name: 'greige-950', palette: 'greige', shade: '950', defaultValue: '#0d0d0d' },
    semanticToken: { name: 'fill.surface.inverse', description: 'Inverse surface fill' },
    componentToken: { name: 'NavBar / Fill', description: 'Dark navigation background' },
    previewType: 'fill-nav-active',
  },
  {
    id: 'fill-accent-surface',
    category: 'Fill / Surface',
    tokenType: 'fill',
    coreToken: { name: 'brand-050', palette: 'brand', shade: '050', defaultValue: '#fef2e9' },
    semanticToken: { name: 'fill.surface.accent', description: 'Accent surface fill' },
    componentToken: { name: 'Banner / Accent / Fill', description: 'Accent banner background' },
    previewType: 'fill-card-surface',
  },
];

// ---------------------------------------------------------------------------
// Component Preview renderers
// ---------------------------------------------------------------------------

function renderPreview(type: PreviewType, value: string, isDarkMode: boolean): React.ReactNode {
  const bg = isDarkMode ? '#1a1a1a' : '#ffffff';
  const textColor = isDarkMode ? '#fbfaf9' : '#252524';
  const subtleText = isDarkMode ? '#8b949e' : '#787675';

  const wrap: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 56,
    padding: '8px 12px',
    backgroundColor: bg,
    borderRadius: 8,
  };

  switch (type) {
    // ── Color previews ──────────────────────────────────────────────
    case 'button-primary':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 20px', borderRadius: 6, backgroundColor: value, color: '#fff',
            fontSize: 13, fontWeight: 600, fontFamily: FONT_OPEN_SANS, whiteSpace: 'nowrap',
          }}>
            Add to Cart
          </div>
        </div>
      );
    case 'button-secondary':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 20px', borderRadius: 6, backgroundColor: value, color: '#fff',
            fontSize: 13, fontWeight: 600, fontFamily: FONT_OPEN_SANS, whiteSpace: 'nowrap',
          }}>
            Save
          </div>
        </div>
      );
    case 'button-destructive':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 20px', borderRadius: 6, backgroundColor: 'transparent',
            border: `2px solid ${value}`, color: value,
            fontSize: 13, fontWeight: 600, fontFamily: FONT_OPEN_SANS, whiteSpace: 'nowrap',
          }}>
            Delete
          </div>
        </div>
      );
    case 'card-surface':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 140, backgroundColor: value, borderRadius: 8,
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`, padding: '10px 12px',
          }}>
            <div style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 6 }} />
            <div style={{ width: 90, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#474545' : '#e5e1de' }} />
          </div>
        </div>
      );
    case 'card-brand':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 140, backgroundColor: value, borderRadius: 8, padding: '10px 12px',
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
          }}>
            <div style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.15)', marginBottom: 6 }} />
            <div style={{ width: 80, height: 5, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.08)' }} />
          </div>
        </div>
      );
    case 'text-primary':
      return (
        <div style={wrap}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: value, fontFamily: FONT_OPEN_SANS }}>Heading</div>
            <div style={{ fontSize: 11, color: subtleText, fontFamily: FONT_OPEN_SANS, marginTop: 2 }}>Body text sample</div>
          </div>
        </div>
      );
    case 'text-secondary':
      return (
        <div style={wrap}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: textColor, fontFamily: FONT_OPEN_SANS }}>Title</div>
            <div style={{ fontSize: 11, color: value, fontFamily: FONT_OPEN_SANS, marginTop: 2 }}>Subtitle text</div>
          </div>
        </div>
      );
    case 'text-link':
      return (
        <div style={wrap}>
          <span style={{
            fontSize: 13, color: value, fontFamily: FONT_OPEN_SANS, textDecoration: 'underline',
            cursor: 'pointer', fontWeight: 500,
          }}>
            View details
          </span>
        </div>
      );
    case 'text-error':
      return (
        <div style={wrap}>
          <div>
            <div style={{
              width: '100%', maxWidth: 120, padding: '6px 8px', borderRadius: 4,
              border: `1px solid ${value}`, backgroundColor: bg, marginBottom: 4,
            }}>
              <div style={{ width: 50, height: 4, borderRadius: 2, backgroundColor: isDarkMode ? '#585756' : '#bab7b4' }} />
            </div>
            <div style={{ fontSize: 11, color: value, fontFamily: FONT_OPEN_SANS }}>This field is required</div>
          </div>
        </div>
      );
    case 'badge-success':
      return (
        <div style={wrap}>
          <div style={{
            padding: '4px 12px', borderRadius: 20, backgroundColor: value, color: '#fff',
            fontSize: 11, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
          }}>
            Completed
          </div>
        </div>
      );
    case 'badge-warning':
      return (
        <div style={wrap}>
          <div style={{
            padding: '4px 12px', borderRadius: 20, backgroundColor: value, color: '#fff',
            fontSize: 11, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
          }}>
            Pending
          </div>
        </div>
      );
    case 'badge-info':
      return (
        <div style={wrap}>
          <div style={{
            padding: '4px 12px', borderRadius: 20, backgroundColor: value, color: '#fff',
            fontSize: 11, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
          }}>
            New
          </div>
        </div>
      );
    case 'badge-error':
      return (
        <div style={wrap}>
          <div style={{
            padding: '4px 12px', borderRadius: 20, backgroundColor: value, color: '#fff',
            fontSize: 11, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
          }}>
            3 Errors
          </div>
        </div>
      );
    case 'input-border':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '7px 10px', borderRadius: 6,
            border: `1.5px solid ${value}`, backgroundColor: bg, fontFamily: FONT_OPEN_SANS,
            fontSize: 12, color: subtleText,
          }}>
            Placeholder...
          </div>
        </div>
      );
    case 'input-focus':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '7px 10px', borderRadius: 6,
            border: `2px solid ${value}`, backgroundColor: bg, fontFamily: FONT_OPEN_SANS,
            fontSize: 12, color: textColor, boxShadow: `0 0 0 3px ${value}33`,
          }}>
            Focused
          </div>
        </div>
      );
    case 'alert-success':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 150, padding: '8px 10px', borderRadius: 6,
            backgroundColor: value, borderLeft: `3px solid ${isDarkMode ? '#397456' : '#4a8165'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>&#10003;</span>
            <span style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#d8e4de' : '#226242' }}>Saved successfully</span>
          </div>
        </div>
      );
    case 'alert-warning':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 150, padding: '8px 10px', borderRadius: 6,
            backgroundColor: value, borderLeft: `3px solid ${isDarkMode ? '#cfb73a' : '#a59547'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>&#9888;</span>
            <span style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#f9e270' : '#5c573f' }}>Check input</span>
          </div>
        </div>
      );
    case 'alert-error':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 150, padding: '8px 10px', borderRadius: 6,
            backgroundColor: value, borderLeft: `3px solid ${isDarkMode ? '#ed5549' : '#df3427'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>&#10007;</span>
            <span style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#fbdad7' : '#861f17' }}>Request failed</span>
          </div>
        </div>
      );
    case 'alert-info':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 150, padding: '8px 10px', borderRadius: 6,
            backgroundColor: value, borderLeft: `3px solid ${isDarkMode ? '#7e87b1' : '#6974a5'}`,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 13 }}>&#8505;</span>
            <span style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#dfe1eb' : '#3a446d' }}>Tip available</span>
          </div>
        </div>
      );
    case 'toggle-on':
      return (
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 40, height: 22, borderRadius: 11, backgroundColor: value, position: 'relative',
              transition: 'background-color 0.2s',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff',
                position: 'absolute', top: 2, left: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, color: textColor }}>On</span>
          </div>
        </div>
      );
    case 'chip':
      return (
        <div style={wrap}>
          <div style={{
            padding: '5px 14px', borderRadius: 16,
            backgroundColor: `${value}22`, border: `1px solid ${value}`,
            fontSize: 12, fontWeight: 500, fontFamily: FONT_OPEN_SANS, color: value,
          }}>
            Filter
          </div>
        </div>
      );
    case 'avatar':
      return (
        <div style={wrap}>
          <div style={{
            width: 38, height: 38, borderRadius: 19, backgroundColor: value,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: FONT_OPEN_SANS,
          }}>
            JD
          </div>
        </div>
      );
    case 'divider':
      return (
        <div style={wrap}>
          <div style={{ width: '100%', maxWidth: 130 }}>
            <div style={{ width: 60, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 8 }} />
            <div style={{ height: 1, backgroundColor: value, width: '100%', marginBottom: 8 }} />
            <div style={{ width: 80, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4' }} />
          </div>
        </div>
      );
    case 'tooltip':
      return (
        <div style={wrap}>
          <div style={{
            padding: '6px 12px', borderRadius: 6, backgroundColor: value,
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            fontSize: 11, fontFamily: FONT_OPEN_SANS, color: textColor,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            Tooltip hint
            <div style={{
              width: 8, height: 8, backgroundColor: value, position: 'absolute',
              bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
              borderRight: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
              borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            }} />
          </div>
        </div>
      );
    case 'progress-bar':
      return (
        <div style={wrap}>
          <div style={{ width: '100%', maxWidth: 130 }}>
            <div style={{
              height: 8, borderRadius: 4, backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
              overflow: 'hidden',
            }}>
              <div style={{
                width: '65%', height: '100%', borderRadius: 4, backgroundColor: value,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontSize: 10, fontFamily: FONT_OPEN_SANS, color: subtleText, marginTop: 4, textAlign: 'right' }}>65%</div>
          </div>
        </div>
      );
    case 'skeleton':
      return (
        <div style={wrap}>
          <div style={{ width: '100%', maxWidth: 130 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 15, backgroundColor: value, marginBottom: 6,
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{ width: 90, height: 6, borderRadius: 3, backgroundColor: value, marginBottom: 4 }} />
            <div style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: value }} />
          </div>
        </div>
      );
    case 'nav-item':
      return (
        <div style={{ ...wrap, backgroundColor: value, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 130 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, color: '#fff', fontWeight: 500 }}>Dashboard</span>
          </div>
        </div>
      );

    // ── Spacing previews ────────────────────────────────────────────
    case 'spacing-card-padding': {
      const px = Math.max(0, Math.min(96, parseFloat(value) || 0));
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 140, position: 'relative',
            border: `1px dashed ${isDarkMode ? '#585756' : '#bab7b4'}`,
            borderRadius: 8, padding: Math.min(px, 32),
            backgroundColor: isDarkMode ? 'rgba(249,99,2,0.06)' : 'rgba(249,99,2,0.04)',
          }}>
            <div style={{
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f0ede9',
              borderRadius: 4, padding: '6px 8px',
              fontSize: 10, fontFamily: FONT_OPEN_SANS,
              color: subtleText, textAlign: 'center',
            }}>
              {px}px
            </div>
          </div>
        </div>
      );
    }
    case 'spacing-stack-gap': {
      const px = Math.max(0, Math.min(96, parseFloat(value) || 0));
      return (
        <div style={wrap}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: Math.min(px, 24), width: '100%', maxWidth: 130 }}>
            {[70, 100, 55].map((w, i) => (
              <div key={i} style={{
                width: `${w}%`, height: 8, borderRadius: 4,
                backgroundColor: isDarkMode ? '#474545' : '#e5e1de',
              }} />
            ))}
          </div>
        </div>
      );
    }
    case 'spacing-inline-gap': {
      const px = Math.max(0, Math.min(96, parseFloat(value) || 0));
      return (
        <div style={wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: Math.min(px, 32) }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              backgroundColor: isDarkMode ? '#474545' : '#e5e1de',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, color: textColor, whiteSpace: 'nowrap' }}>Label</span>
          </div>
        </div>
      );
    }
    case 'spacing-section-margin': {
      const px = Math.max(0, Math.min(96, parseFloat(value) || 0));
      return (
        <div style={wrap}>
          <div style={{ width: '100%', maxWidth: 130 }}>
            <div style={{
              height: 18, borderRadius: 4,
              backgroundColor: isDarkMode ? '#474545' : '#e5e1de',
              marginBottom: Math.min(px, 32),
            }} />
            <div style={{
              height: 18, borderRadius: 4,
              backgroundColor: isDarkMode ? '#3a3a3a' : '#f0ede9',
            }} />
          </div>
        </div>
      );
    }
    case 'spacing-input-padding': {
      const px = Math.max(0, Math.min(96, parseFloat(value) || 0));
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130,
            border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
            borderRadius: 6, padding: Math.min(px, 24),
            backgroundColor: bg,
          }}>
            <span style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: subtleText }}>Input</span>
          </div>
        </div>
      );
    }

    // ── Shadow previews ─────────────────────────────────────────────
    case 'shadow-card':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 120, padding: '10px 12px',
            borderRadius: 8, backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            boxShadow: value === 'none' ? undefined : value,
            border: value === 'none' ? `1px dashed ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` : `1px solid ${isDarkMode ? '#2a2a2a' : '#ffffff'}`,
          }}>
            <div style={{ width: 50, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 4 }} />
            <div style={{ width: 80, height: 4, borderRadius: 2, backgroundColor: isDarkMode ? '#474545' : '#e5e1de' }} />
          </div>
        </div>
      );
    case 'shadow-dropdown':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 110, borderRadius: 6,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            boxShadow: value === 'none' ? undefined : value,
            border: value === 'none' ? `1px dashed ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` : `1px solid ${isDarkMode ? '#3a3a3a' : '#eae7e4'}`,
            overflow: 'hidden',
          }}>
            {['Option A', 'Option B', 'Option C'].map((label, i) => (
              <div key={i} style={{
                padding: '5px 10px', fontSize: 10, fontFamily: FONT_OPEN_SANS, color: textColor,
                backgroundColor: i === 1 ? (isDarkMode ? '#3a3a3a' : '#f8f5f2') : 'transparent',
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      );
    case 'shadow-modal':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '10px', borderRadius: 10,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            boxShadow: value === 'none' ? undefined : value,
            border: value === 'none' ? `1px dashed ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` : `1px solid ${isDarkMode ? '#3a3a3a' : '#eae7e4'}`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: FONT_OPEN_SANS, color: textColor, marginBottom: 4 }}>Modal</div>
            <div style={{ width: '100%', height: 4, borderRadius: 2, backgroundColor: isDarkMode ? '#474545' : '#e5e1de', marginBottom: 6 }} />
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <div style={{ padding: '2px 8px', borderRadius: 3, backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de', fontSize: 8, fontFamily: FONT_OPEN_SANS, color: subtleText }}>Cancel</div>
              <div style={{ padding: '2px 8px', borderRadius: 3, backgroundColor: '#f96302', fontSize: 8, fontFamily: FONT_OPEN_SANS, color: '#fff' }}>OK</div>
            </div>
          </div>
        </div>
      );
    case 'shadow-button':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 18px', borderRadius: 6,
            backgroundColor: isDarkMode ? '#3a3a3a' : '#f8f5f2',
            boxShadow: value === 'none' ? undefined : value,
            fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS, color: textColor,
          }}>
            Click me
          </div>
        </div>
      );
    case 'shadow-floating-action':
      return (
        <div style={wrap}>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: '#f96302',
            boxShadow: value === 'none' ? undefined : value,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: '#fff', fontWeight: 300,
          }}>
            +
          </div>
        </div>
      );
    case 'shadow-tooltip':
      return (
        <div style={wrap}>
          <div style={{
            padding: '5px 10px', borderRadius: 5,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            boxShadow: value === 'none' ? undefined : value,
            border: value === 'none' ? `1px dashed ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` : `1px solid ${isDarkMode ? '#3a3a3a' : '#eae7e4'}`,
            fontSize: 10, fontFamily: FONT_OPEN_SANS, color: textColor,
          }}>
            Tooltip
          </div>
        </div>
      );

    // ── Border previews ─────────────────────────────────────────────
    case 'border-input': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '7px 10px', borderRadius: 6,
            border: `${px}px solid ${isDarkMode ? '#8b949e' : '#585756'}`,
            backgroundColor: bg, fontSize: 12, fontFamily: FONT_OPEN_SANS, color: subtleText,
          }}>
            Input
          </div>
        </div>
      );
    }
    case 'border-card': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '10px 12px', borderRadius: 8,
            border: `${px}px solid ${isDarkMode ? '#585756' : '#bab7b4'}`,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
          }}>
            <div style={{ width: 50, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 4 }} />
            <div style={{ width: 80, height: 4, borderRadius: 2, backgroundColor: isDarkMode ? '#474545' : '#e5e1de' }} />
          </div>
        </div>
      );
    }
    case 'border-divider': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{ width: '100%', maxWidth: 130 }}>
            <div style={{ width: 60, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 8 }} />
            <div style={{ height: Math.max(px, 0.5), backgroundColor: isDarkMode ? '#8b949e' : '#585756', width: '100%', marginBottom: 8, borderRadius: px > 1 ? 1 : 0 }} />
            <div style={{ width: 80, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4' }} />
          </div>
        </div>
      );
    }
    case 'border-button-outline': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 18px', borderRadius: 6, backgroundColor: 'transparent',
            border: `${px}px solid ${isDarkMode ? '#8b949e' : '#585756'}`,
            fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS, color: textColor,
          }}>
            Outline
          </div>
        </div>
      );
    }
    case 'border-focus-ring': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '7px 10px', borderRadius: 6,
            border: `${px}px solid ${isDarkMode ? '#7e87b1' : '#6974a5'}`,
            backgroundColor: bg, fontSize: 12, fontFamily: FONT_OPEN_SANS, color: textColor,
            boxShadow: `0 0 0 ${Math.max(px, 1)}px ${isDarkMode ? 'rgba(126,135,177,0.2)' : 'rgba(105,116,165,0.2)'}`,
          }}>
            Focused
          </div>
        </div>
      );
    }
    case 'border-accent': {
      const px = parseFloat(value) || 0;
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 130, padding: '10px 12px', borderRadius: 6,
            borderLeft: `${px}px solid #f96302`,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#fef2e9',
          }}>
            <div style={{ width: 50, height: 5, borderRadius: 3, backgroundColor: isDarkMode ? '#585756' : '#bab7b4', marginBottom: 4 }} />
            <div style={{ width: 70, height: 4, borderRadius: 2, backgroundColor: isDarkMode ? '#474545' : '#e5e1de' }} />
          </div>
        </div>
      );
    }

    // ── Fill previews ───────────────────────────────────────────────
    case 'fill-button-primary':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 20px', borderRadius: 6, backgroundColor: value,
            color: isLightColor(value) ? '#252524' : '#fff',
            fontSize: 13, fontWeight: 600, fontFamily: FONT_OPEN_SANS, whiteSpace: 'nowrap',
          }}>
            Submit
          </div>
        </div>
      );
    case 'fill-button-secondary':
      return (
        <div style={wrap}>
          <div style={{
            padding: '8px 20px', borderRadius: 6, backgroundColor: value,
            color: isLightColor(value) ? '#252524' : '#fff',
            fontSize: 13, fontWeight: 600, fontFamily: FONT_OPEN_SANS, whiteSpace: 'nowrap',
          }}>
            Save
          </div>
        </div>
      );
    case 'fill-card-surface':
      return (
        <div style={wrap}>
          <div style={{
            width: '100%', maxWidth: 140, backgroundColor: value, borderRadius: 8,
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`, padding: '10px 12px',
          }}>
            <div style={{ width: 60, height: 6, borderRadius: 3, backgroundColor: isLightColor(value) ? '#bab7b4' : 'rgba(255,255,255,0.3)', marginBottom: 6 }} />
            <div style={{ width: 90, height: 5, borderRadius: 3, backgroundColor: isLightColor(value) ? '#e5e1de' : 'rgba(255,255,255,0.15)' }} />
          </div>
        </div>
      );
    case 'fill-chip':
      return (
        <div style={wrap}>
          <div style={{
            padding: '5px 14px', borderRadius: 16, backgroundColor: value,
            fontSize: 12, fontWeight: 500, fontFamily: FONT_OPEN_SANS,
            color: isLightColor(value) ? '#252524' : '#fff',
          }}>
            Active
          </div>
        </div>
      );
    case 'fill-nav-active':
      return (
        <div style={{ ...wrap, backgroundColor: value, borderRadius: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', maxWidth: 130 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: isLightColor(value) ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, color: isLightColor(value) ? '#252524' : '#fff', fontWeight: 500 }}>Dashboard</span>
          </div>
        </div>
      );

    default:
      return <div style={wrap}><div style={{ width: 24, height: 24, borderRadius: 4, backgroundColor: value }} /></div>;
  }
}

// ---------------------------------------------------------------------------
// Arrow connector
// ---------------------------------------------------------------------------

function CascadeArrow({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isDarkMode ? '#585756' : '#bab7b4', fontSize: 18, padding: '0 2px',
      flexShrink: 0, userSelect: 'none',
    }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M0 6h16m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** Check if a hex color is perceptually light */
function isLightColor(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// ---------------------------------------------------------------------------
// Editable core-token cells
// ---------------------------------------------------------------------------

interface CoreTokenCellProps {
  chain: CascadeChain;
  currentValue: string;
  isOverridden: boolean;
  onChange: (id: string, value: string) => void;
  onReset: (id: string) => void;
  isDarkMode: boolean;
}

// ── Color / Fill editor ─────────────────────────────────────────────────

function ColorCoreTokenCell({ chain, currentValue, isOverridden, onChange, onReset, isDarkMode }: CoreTokenCellProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const palette = PALETTES[chain.coreToken.palette || ''] || {};
  const shades = Object.entries(palette);
  const currentShade = shades.find(([, hex]) => hex === currentValue)?.[0] || chain.coreToken.shade;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, position: 'relative',
    }}>
      <div style={{
        fontSize: 10, fontFamily: FONT_OPEN_SANS, fontWeight: 600,
        color: isDarkMode ? '#8b949e' : '#787675', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {chain.coreToken.palette} / {currentShade}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          style={{
            width: 32, height: 32, borderRadius: 6, cursor: 'pointer', padding: 0,
            border: `2px solid ${isOverridden ? '#f96302' : (isDarkMode ? '#4a4a4a' : '#d0d0d0')}`,
            backgroundColor: currentValue, flexShrink: 0,
            boxShadow: isOverridden ? '0 0 0 2px rgba(249,99,2,0.25)' : 'none',
            position: 'relative',
          }}
          title="Choose from palette"
        >
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 0, height: 0,
            borderLeft: '3px solid transparent', borderRight: '3px solid transparent',
            borderTop: `4px solid ${isLightColor(currentValue) ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)'}`,
          }} />
        </button>

        <div style={{
          fontSize: 11, fontFamily: "'Menlo', monospace",
          color: isDarkMode ? '#bab7b4' : '#585756',
          padding: '3px 6px', borderRadius: 4,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
        }}>
          {currentValue}
        </div>

        {isOverridden && (
          <button
            onClick={() => { onReset(chain.id); setPickerOpen(false); }}
            title="Reset to default"
            style={{
              width: 20, height: 20, borderRadius: 4, border: 'none',
              backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
              color: isDarkMode ? '#bab7b4' : '#787675', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, flexShrink: 0, padding: 0,
            }}
          >
            &#8634;
          </button>
        )}
      </div>

      <div style={{
        fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#fbfaf9' : '#252524',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {chain.coreToken.name}
      </div>

      {pickerOpen && (
        <>
          <div
            onClick={() => setPickerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 1000,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            borderRadius: 10, padding: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            width: 220,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
              color: isDarkMode ? '#8b949e' : '#787675',
            }}>
              {chain.coreToken.palette}
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3,
            }}>
              {shades.map(([shade, hex]) => {
                const isSelected = hex === currentValue;
                const isDefault = hex === chain.coreToken.defaultValue;
                return (
                  <button
                    key={shade}
                    onClick={() => {
                      onChange(chain.id, hex);
                      setPickerOpen(false);
                    }}
                    title={`${shade}: ${hex}`}
                    style={{
                      width: '100%', aspectRatio: '1', borderRadius: 4, cursor: 'pointer',
                      backgroundColor: hex, padding: 0,
                      border: isSelected
                        ? '2px solid #f96302'
                        : isDefault
                          ? `2px dashed ${isDarkMode ? '#585756' : '#bab7b4'}`
                          : `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
                      boxShadow: isSelected ? '0 0 0 2px rgba(249,99,2,0.3)' : 'none',
                      position: 'relative',
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute', inset: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: isLightColor(hex) ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                        fontSize: 10, fontWeight: 700,
                      }}>
                        &#10003;
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3, marginTop: 2,
            }}>
              {shades.map(([shade]) => (
                <div key={shade} style={{
                  fontSize: 7, fontFamily: FONT_OPEN_SANS, textAlign: 'center',
                  color: isDarkMode ? '#585756' : '#bab7b4',
                }}>
                  {shade}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Spacing editor ──────────────────────────────────────────────────────

function SpacingCoreTokenCell({ chain, currentValue, isOverridden, onChange, onReset, isDarkMode }: CoreTokenCellProps) {
  const px = parseFloat(currentValue) || 0;
  const presetChips = SPACING_SCALE.filter(v => v <= 48);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
      <div style={{
        fontSize: 10, fontFamily: FONT_OPEN_SANS, fontWeight: 600,
        color: isDarkMode ? '#8b949e' : '#787675', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        spacing
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          border: `2px solid ${isOverridden ? '#f96302' : (isDarkMode ? '#4a4a4a' : '#d0d0d0')}`,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#fbfaf9' : '#252524',
          boxShadow: isOverridden ? '0 0 0 2px rgba(249,99,2,0.25)' : 'none',
          flexShrink: 0,
        }}>
          {px}
        </div>

        <div style={{
          fontSize: 11, fontFamily: "'Menlo', monospace",
          color: isDarkMode ? '#bab7b4' : '#585756',
          padding: '3px 6px', borderRadius: 4,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
        }}>
          {px}px
        </div>

        {isOverridden && (
          <button
            onClick={() => onReset(chain.id)}
            title="Reset to default"
            style={{
              width: 20, height: 20, borderRadius: 4, border: 'none',
              backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
              color: isDarkMode ? '#bab7b4' : '#787675', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, flexShrink: 0, padding: 0,
            }}
          >
            &#8634;
          </button>
        )}
      </div>

      <input
        type="range"
        min="0" max="96" step="1"
        value={px}
        onChange={(e) => onChange(chain.id, e.target.value)}
        style={{ width: '100%', accentColor: '#f96302', cursor: 'pointer' }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {presetChips.map(v => (
          <button
            key={v}
            onClick={() => onChange(chain.id, String(v))}
            style={{
              padding: '1px 5px', borderRadius: 3, fontSize: 9,
              fontFamily: FONT_OPEN_SANS, cursor: 'pointer',
              backgroundColor: px === v ? '#f96302' : (isDarkMode ? '#2a2a2a' : '#f8f5f2'),
              color: px === v ? '#fff' : (isDarkMode ? '#bab7b4' : '#585756'),
              border: `1px solid ${px === v ? '#f96302' : (isDarkMode ? '#3a3a3a' : '#e5e1de')}`,
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div style={{
        fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#fbfaf9' : '#252524',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {chain.coreToken.name}
      </div>
    </div>
  );
}

// ── Shadow editor ───────────────────────────────────────────────────────

function ShadowCoreTokenCell({ chain, currentValue, isOverridden, onChange, onReset, isDarkMode }: CoreTokenCellProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const currentPreset = SHADOW_SCALE.find(s => s.value === currentValue)?.name || 'custom';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, position: 'relative' }}>
      <div style={{
        fontSize: 10, fontFamily: FONT_OPEN_SANS, fontWeight: 600,
        color: isDarkMode ? '#8b949e' : '#787675', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        shadow / {currentPreset}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          style={{
            width: 32, height: 32, borderRadius: 6, cursor: 'pointer', padding: 0,
            border: `2px solid ${isOverridden ? '#f96302' : (isDarkMode ? '#4a4a4a' : '#d0d0d0')}`,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            boxShadow: currentValue === 'none' ? (isOverridden ? '0 0 0 2px rgba(249,99,2,0.25)' : 'none') : `${currentValue}${isOverridden ? ', 0 0 0 2px rgba(249,99,2,0.25)' : ''}`,
            flexShrink: 0, position: 'relative',
          }}
          title="Choose shadow preset"
        >
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 0, height: 0,
            borderLeft: '3px solid transparent', borderRight: '3px solid transparent',
            borderTop: `4px solid ${isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}`,
          }} />
        </button>

        <div style={{
          fontSize: 10, fontFamily: "'Menlo', monospace",
          color: isDarkMode ? '#bab7b4' : '#585756',
          padding: '3px 6px', borderRadius: 4,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {currentPreset}
        </div>

        {isOverridden && (
          <button
            onClick={() => { onReset(chain.id); setPickerOpen(false); }}
            title="Reset to default"
            style={{
              width: 20, height: 20, borderRadius: 4, border: 'none',
              backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
              color: isDarkMode ? '#bab7b4' : '#787675', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, flexShrink: 0, padding: 0,
            }}
          >
            &#8634;
          </button>
        )}
      </div>

      <div style={{
        fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#fbfaf9' : '#252524',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {chain.coreToken.name}
      </div>

      {pickerOpen && (
        <>
          <div onClick={() => setPickerOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 1000,
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            borderRadius: 10, padding: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            width: 250,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
              textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8,
              color: isDarkMode ? '#8b949e' : '#787675',
            }}>
              Shadow Presets
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {SHADOW_SCALE.map(s => {
                const isSelected = s.value === currentValue;
                const isDefault = s.value === chain.coreToken.defaultValue;
                return (
                  <button
                    key={s.name}
                    onClick={() => { onChange(chain.id, s.value); setPickerOpen(false); }}
                    title={s.name}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: 6, borderRadius: 6, cursor: 'pointer',
                      border: isSelected
                        ? '2px solid #f96302'
                        : isDefault
                          ? `2px dashed ${isDarkMode ? '#585756' : '#bab7b4'}`
                          : `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
                      boxShadow: isSelected ? '0 0 0 2px rgba(249,99,2,0.3)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 4,
                      backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
                      boxShadow: s.value === 'none' ? undefined : s.value,
                      border: s.value === 'none' ? `1px dashed ${isDarkMode ? '#585756' : '#d0d0d0'}` : 'none',
                    }} />
                    <span style={{ fontSize: 8, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#8b949e' : '#787675' }}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Token info cell (semantic / component column)
// ---------------------------------------------------------------------------

interface TokenInfoCellProps {
  name: string;
  description: string;
  resolvedValue: string;
  tokenType: TokenType;
  tier: 'semantic' | 'component';
  isDarkMode: boolean;
}

function TokenInfoCell({ name, description, resolvedValue, tokenType, tier, isDarkMode }: TokenInfoCellProps) {
  const tierColor = tier === 'semantic'
    ? (isDarkMode ? '#7e87b1' : '#6974a5')
    : (isDarkMode ? '#63937b' : '#4a8165');

  const isColor = tokenType === 'color' || tokenType === 'fill';
  const isSpacing = tokenType === 'spacing';
  const isShadow = tokenType === 'shadow';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div style={{
        fontSize: 9, fontFamily: FONT_OPEN_SANS, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: 0.8, color: tierColor,
      }}>
        {tier}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {isColor && (
          <div style={{
            width: 22, height: 22, borderRadius: 4, backgroundColor: resolvedValue, flexShrink: 0,
            border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d0d0d0'}`,
          }} />
        )}
        {isSpacing && (
          <div style={{
            width: 22, height: 22, borderRadius: 4, flexShrink: 0,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
            display: 'flex', alignItems: 'flex-end', padding: 2,
          }}>
            <div style={{
              width: Math.min(Math.max((parseFloat(resolvedValue) / 96) * 18, 2), 18),
              height: 4,
              backgroundColor: '#f96302',
              borderRadius: 1,
            }} />
          </div>
        )}
        {isShadow && (
          <div style={{
            width: 22, height: 22, borderRadius: 4, flexShrink: 0,
            backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
            boxShadow: resolvedValue === 'none' ? undefined : resolvedValue,
            border: resolvedValue === 'none' ? `1px dashed ${isDarkMode ? '#585756' : '#d0d0d0'}` : 'none',
          }} />
        )}
        <div style={{
          fontSize: 11, fontFamily: "'Menlo', monospace",
          color: isDarkMode ? '#bab7b4' : '#585756',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {isColor ? resolvedValue : isSpacing ? `${resolvedValue}px` : isShadow ? (SHADOW_SCALE.find(s => s.value === resolvedValue)?.name || 'custom') : resolvedValue}
        </div>
      </div>

      <div style={{
        fontSize: 12, fontWeight: 600, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#fbfaf9' : '#252524',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {name}
      </div>

      <div style={{
        fontSize: 10, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#6b6b6b' : '#979492',
      }}>
        {description}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single cascade row
// ---------------------------------------------------------------------------

interface CascadeRowProps {
  chain: CascadeChain;
  coreValue: string;
  isOverridden: boolean;
  onChange: (id: string, value: string) => void;
  onReset: (id: string) => void;
  isDarkMode: boolean;
}

function CascadeRow({ chain, coreValue, isOverridden, onChange, onReset, isDarkMode }: CascadeRowProps) {
  const EditorCell = chain.tokenType === 'spacing' ? SpacingCoreTokenCell
    : chain.tokenType === 'shadow' ? ShadowCoreTokenCell
    : ColorCoreTokenCell;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 24px 1fr 24px 1fr 24px minmax(140px, 180px)',
      alignItems: 'center',
      gap: 8,
      padding: '14px 16px',
      backgroundColor: isOverridden
        ? (isDarkMode ? 'rgba(249,99,2,0.06)' : 'rgba(249,99,2,0.04)')
        : (isDarkMode ? '#1e1e1e' : '#ffffff'),
      borderRadius: 10,
      border: `1px solid ${isOverridden ? (isDarkMode ? 'rgba(249,99,2,0.25)' : 'rgba(249,99,2,0.2)') : (isDarkMode ? '#2e2e2e' : '#eae7e4')}`,
      transition: 'background-color 0.2s, border-color 0.2s',
    }}>
      <EditorCell
        chain={chain}
        currentValue={coreValue}
        isOverridden={isOverridden}
        onChange={onChange}
        onReset={onReset}
        isDarkMode={isDarkMode}
      />

      <CascadeArrow isDarkMode={isDarkMode} />

      <TokenInfoCell
        name={chain.semanticToken.name}
        description={chain.semanticToken.description}
        resolvedValue={coreValue}
        tokenType={chain.tokenType}
        tier="semantic"
        isDarkMode={isDarkMode}
      />

      <CascadeArrow isDarkMode={isDarkMode} />

      <TokenInfoCell
        name={chain.componentToken.name}
        description={chain.componentToken.description}
        resolvedValue={coreValue}
        tokenType={chain.tokenType}
        tier="component"
        isDarkMode={isDarkMode}
      />

      <CascadeArrow isDarkMode={isDarkMode} />

      <div style={{ minWidth: 0 }}>
        {renderPreview(chain.previewType, coreValue, isDarkMode)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Token type filter config
// ---------------------------------------------------------------------------

const TOKEN_TYPE_FILTERS: { type: TokenType | null; label: string }[] = [
  { type: null, label: 'All Types' },
  { type: 'color', label: 'Color' },
  { type: 'fill', label: 'Fill' },
  { type: 'spacing', label: 'Spacing' },
  { type: 'shadow', label: 'Shadow' },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface TokensCascadeDisplayProps {
  isDarkMode: boolean;
}

export function TokensCascadeDisplay({ isDarkMode }: TokensCascadeDisplayProps) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    return new Set(CASCADE_CHAINS.map(c => c.category));
  });
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTokenType, setFilterTokenType] = useState<TokenType | null>(null);

  const handleChange = useCallback((id: string, value: string) => {
    setOverrides(prev => ({ ...prev, [id]: value }));
  }, []);

  const handleReset = useCallback((id: string) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => { setOverrides({}); }, []);

  const toggleCategory = useCallback((cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }, []);

  const handleTokenTypeFilter = useCallback((type: TokenType | null) => {
    setFilterTokenType(type);
    setFilterCategory(null);
  }, []);

  const getValue = useCallback((chain: CascadeChain): string => {
    if (overrides[chain.id]) return overrides[chain.id];
    return chain.coreToken.defaultValue;
  }, [overrides]);

  // Type counts
  const typeCounts = useMemo(() => {
    const counts: Partial<Record<TokenType, number>> = {};
    for (const chain of CASCADE_CHAINS) {
      counts[chain.tokenType] = (counts[chain.tokenType] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter by token type first
  const typeFilteredChains = useMemo(() => {
    if (!filterTokenType) return CASCADE_CHAINS;
    return CASCADE_CHAINS.filter(c => c.tokenType === filterTokenType);
  }, [filterTokenType]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CascadeChain[]>();
    for (const chain of typeFilteredChains) {
      if (!map.has(chain.category)) map.set(chain.category, []);
      map.get(chain.category)!.push(chain);
    }
    return map;
  }, [typeFilteredChains]);

  const categories = useMemo(() => Array.from(grouped.keys()), [grouped]);
  const overrideCount = Object.keys(overrides).length;

  const visibleCategories = filterCategory
    ? categories.filter(c => c === filterCategory)
    : categories;

  const allCategories = useMemo(() => {
    const s = new Set<string>();
    CASCADE_CHAINS.forEach(c => s.add(c.category));
    return s;
  }, []);

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: '2px solid #f96302', paddingBottom: 8, marginBottom: 8,
  };

  const descStyle: React.CSSProperties = {
    fontSize: 14, fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#8b949e' : '#787675', marginBottom: 20, lineHeight: 1.6,
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={sectionTitleStyle}>Token Cascade</h2>
      <p style={descStyle}>
        Explore how <strong>core tokens</strong> cascade through <strong>semantic</strong> and <strong>component</strong> layers into real UI.
        Edit any core token to see how changes ripple through the entire system in real time.
      </p>

      {/* Token type filter */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, alignItems: 'center',
      }}>
        <span style={{
          fontSize: 11, fontFamily: FONT_OPEN_SANS, fontWeight: 600,
          color: isDarkMode ? '#585756' : '#bab7b4', textTransform: 'uppercase', letterSpacing: 0.5,
          marginRight: 4,
        }}>
          Type
        </span>
        {TOKEN_TYPE_FILTERS.map(({ type, label }) => {
          const count = type ? (typeCounts[type] || 0) : CASCADE_CHAINS.length;
          const isActive = filterTokenType === type;
          return (
            <button
              key={label}
              onClick={() => handleTokenTypeFilter(type)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 11, fontFamily: FONT_OPEN_SANS,
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? (isDarkMode ? '#f96302' : '#252524') : (isDarkMode ? '#2a2a2a' : '#f8f5f2'),
                color: isActive ? '#fff' : (isDarkMode ? '#bab7b4' : '#585756'),
                border: `1px solid ${isActive ? 'transparent' : (isDarkMode ? '#3a3a3a' : '#e5e1de')}`,
                cursor: 'pointer',
              }}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Category filter + actions */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center',
      }}>
        <button
          onClick={() => setFilterCategory(null)}
          style={{
            padding: '5px 14px', borderRadius: 20, fontSize: 12, fontFamily: FONT_OPEN_SANS,
            fontWeight: filterCategory === null ? 600 : 400,
            backgroundColor: filterCategory === null ? (isDarkMode ? '#f96302' : '#252524') : (isDarkMode ? '#2a2a2a' : '#f8f5f2'),
            color: filterCategory === null ? '#fff' : (isDarkMode ? '#bab7b4' : '#585756'),
            border: `1px solid ${filterCategory === null ? 'transparent' : (isDarkMode ? '#3a3a3a' : '#e5e1de')}`,
            cursor: 'pointer',
          }}
        >
          All ({typeFilteredChains.length})
        </button>
        {categories.map(cat => {
          const count = grouped.get(cat)?.length || 0;
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(isActive ? null : cat)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontFamily: FONT_OPEN_SANS,
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? (isDarkMode ? '#f96302' : '#252524') : (isDarkMode ? '#2a2a2a' : '#f8f5f2'),
                color: isActive ? '#fff' : (isDarkMode ? '#bab7b4' : '#585756'),
                border: `1px solid ${isActive ? 'transparent' : (isDarkMode ? '#3a3a3a' : '#e5e1de')}`,
                cursor: 'pointer',
              }}
            >
              {cat} ({count})
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {overrideCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 12, fontFamily: FONT_OPEN_SANS,
              color: '#f96302', fontWeight: 600,
            }}>
              {overrideCount} override{overrideCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={handleResetAll}
              style={{
                padding: '5px 14px', borderRadius: 6, fontSize: 12, fontFamily: FONT_OPEN_SANS,
                fontWeight: 600, backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
                color: isDarkMode ? '#fbfaf9' : '#252524',
                border: 'none', cursor: 'pointer',
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 24px 1fr 24px 1fr 24px minmax(140px, 180px)',
        gap: 8, padding: '0 16px', marginBottom: 8,
      }}>
        {['Core Token', '', 'Semantic Token', '', 'Component Token', '', 'Preview'].map((label, i) => (
          <div key={i} style={{
            fontSize: 10, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
            textTransform: 'uppercase', letterSpacing: 1,
            color: isDarkMode ? '#585756' : '#bab7b4',
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* Cascade rows grouped by category */}
      {visibleCategories.map(category => {
        const chains = grouped.get(category) || [];
        const isExpanded = expandedCategories.has(category);

        return (
          <div key={category} style={{ marginBottom: 20 }}>
            <div
              onClick={() => toggleCategory(category)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                cursor: 'pointer', userSelect: 'none',
                borderBottom: `1px solid ${isDarkMode ? '#2e2e2e' : '#eae7e4'}`,
                marginBottom: isExpanded ? 8 : 0,
              }}
            >
              <span style={{
                display: 'inline-block',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease', fontSize: 11,
                color: isDarkMode ? '#585756' : '#bab7b4',
              }}>
                &#9654;
              </span>
              <span style={{
                fontSize: 15, fontWeight: 700, fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#fbfaf9' : '#252524',
              }}>
                {category}
              </span>
              <span style={{
                fontSize: 11, fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#585756' : '#bab7b4',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
                padding: '2px 8px', borderRadius: 8,
              }}>
                {chains.length}
              </span>
            </div>

            {isExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {chains.map(chain => (
                  <CascadeRow
                    key={chain.id}
                    chain={chain}
                    coreValue={getValue(chain)}
                    isOverridden={chain.id in overrides}
                    onChange={handleChange}
                    onReset={handleReset}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div style={{
        marginTop: 24, padding: 16, borderRadius: 8,
        backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
        fontSize: 13, fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#8b949e' : '#787675', textAlign: 'center',
      }}>
        {CASCADE_CHAINS.length} cascade chains across {allCategories.size} categories.
        {filterTokenType && ` Showing ${typeFilteredChains.length} ${filterTokenType} tokens.`}
        {' '}Edit a core token to preview how changes cascade through the design system.
      </div>
    </div>
  );
}
