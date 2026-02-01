/**
 * Layer Rules
 * OCM layer rule definitions for token validation
 *
 * These rules must match OCM's validation exactly to catch errors
 * before tokens are committed to the repository.
 */

import type { TokenLayer, LayerRules, LayerRuleConfig } from '../types/editor';

/**
 * OCM Layer Rules
 *
 * | Layer     | Can Reference        | Hardcoded Values |
 * |-----------|---------------------|------------------|
 * | Core      | Nothing             | Allowed          |
 * | Semantic  | Core only           | Not allowed      |
 * | Component | Semantic, Core (*)  | Not allowed      |
 *
 * (*) Component tokens can reference Core tokens in allowlisted cases
 */
export const LAYER_RULES: LayerRules = {
  core: {
    canReference: [],
    allowLiterals: true,
  },
  semantic: {
    canReference: ['core'],
    allowLiterals: false,
  },
  component: {
    canReference: ['semantic', 'core'],
    allowLiterals: false,
  },
};

/**
 * Determine token layer from file path
 *
 * @param filePath - Path to the token file (e.g., "tokens/semantic/light.json")
 * @returns The layer this file belongs to
 */
export function getLayerFromPath(filePath: string): TokenLayer {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();

  // Check for primitives/core directory
  if (normalizedPath.includes('/primitives/') || normalizedPath.includes('/core/')) {
    return 'core';
  }

  // Check for semantic directory
  if (normalizedPath.includes('/semantic/')) {
    return 'semantic';
  }

  // Check for component directory
  if (normalizedPath.includes('/component/')) {
    return 'component';
  }

  // Default to semantic if unclear (safer default)
  return 'semantic';
}

/**
 * Get layer configuration for a given layer
 */
export function getLayerConfig(layer: TokenLayer): LayerRuleConfig {
  return LAYER_RULES[layer];
}

/**
 * Check if a layer can reference another layer
 *
 * @param sourceLayer - The layer of the token containing the reference
 * @param targetLayer - The layer of the referenced token
 * @returns true if the reference is allowed
 */
export function canReference(sourceLayer: TokenLayer, targetLayer: TokenLayer): boolean {
  const rules = LAYER_RULES[sourceLayer];
  return rules.canReference.includes(targetLayer);
}

/**
 * Check if a layer allows literal (hardcoded) values
 */
export function allowsLiterals(layer: TokenLayer): boolean {
  return LAYER_RULES[layer].allowLiterals;
}

/**
 * Get human-readable layer name
 */
export function getLayerDisplayName(layer: TokenLayer): string {
  switch (layer) {
    case 'core':
      return 'Core (Primitives)';
    case 'semantic':
      return 'Semantic';
    case 'component':
      return 'Component';
  }
}

/**
 * Get valid reference targets for a given layer
 * Returns layers that can be referenced by the source layer
 */
export function getValidReferenceTargets(sourceLayer: TokenLayer): TokenLayer[] {
  return LAYER_RULES[sourceLayer].canReference;
}
