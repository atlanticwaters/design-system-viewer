import {
  TokensStudioFile,
  TokenType,
  ResolvedToken,
  isTokenReference,
} from '../types/tokens';
import { getTokenAtPath, getAllTokenPaths } from './tokenParser';

/**
 * Parse a token reference string to get the path
 * "{brand.brand-300}" -> "brand.brand-300"
 */
export function parseReference(ref: string): string {
  return ref.slice(1, -1);
}

/**
 * Infer token type from value when $type is not specified
 */
export function inferTokenType(value: string | number): TokenType {
  if (typeof value === 'number') {
    return 'number';
  }

  // Check for color formats
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
    return 'color';
  }

  // Check for dimension values
  if (/^\d+(\.\d+)?(px|rem|em|%|pt|vh|vw)$/.test(value)) {
    return 'dimension';
  }

  return 'text';
}

/**
 * Resolve token references in the tokens file
 * All paths are now DTCG-compliant (dot-separated only)
 */
function findTokenPath(
  tokens: TokensStudioFile,
  referencePath: string,
  currentCategory: string
): string | null {
  // First, try the reference as-is (for within same category)
  let token = getTokenAtPath(tokens, referencePath);
  if (token) return referencePath;

  // Try with Color.Default prefix (legacy format, normalized)
  const colorPath = `Color.Default.${referencePath}`;
  token = getTokenAtPath(tokens, colorPath);
  if (token) return colorPath;

  // Try with core.colors prefix (DTCG format)
  const coreColorsPath = `core.colors.${referencePath}`;
  token = getTokenAtPath(tokens, coreColorsPath);
  if (token) return coreColorsPath;

  // Try with core.colors.color prefix (nested color structure)
  const coreColorsColorPath = `core.colors.color.${referencePath}`;
  token = getTokenAtPath(tokens, coreColorsColorPath);
  if (token) return coreColorsColorPath;

  // Try with core.neutrals.color prefix (neutral colors)
  const coreNeutralsPath = `core.neutrals.color.${referencePath}`;
  token = getTokenAtPath(tokens, coreNeutralsPath);
  if (token) return coreNeutralsPath;

  // Try with core.spacing prefix (DTCG format)
  const coreSpacingPath = `core.spacing.${referencePath}`;
  token = getTokenAtPath(tokens, coreSpacingPath);
  if (token) return coreSpacingPath;

  // Try with core.spacing.spacing prefix (nested spacing structure)
  const coreSpacingNestedPath = `core.spacing.spacing.${referencePath}`;
  token = getTokenAtPath(tokens, coreSpacingNestedPath);
  if (token) return coreSpacingNestedPath;

  // Try with core.border prefix (DTCG format)
  const coreBorderPath = `core.border.${referencePath}`;
  token = getTokenAtPath(tokens, coreBorderPath);
  if (token) return coreBorderPath;

  // Try with core.border.border prefix (nested border structure)
  const coreBorderNestedPath = `core.border.border.${referencePath}`;
  token = getTokenAtPath(tokens, coreBorderNestedPath);
  if (token) return coreBorderNestedPath;

  // Try with core.elevation prefix (DTCG format)
  const coreElevationPath = `core.elevation.${referencePath}`;
  token = getTokenAtPath(tokens, coreElevationPath);
  if (token) return coreElevationPath;

  // Try with core.elevation.elevation prefix (nested elevation structure)
  const coreElevationNestedPath = `core.elevation.elevation.${referencePath}`;
  token = getTokenAtPath(tokens, coreElevationNestedPath);
  if (token) return coreElevationNestedPath;

  // Try with core typography prefixes (DTCG format)
  const typographyPrefixes = ['core.font-family', 'core.font-size', 'core.font-weight', 'core.letter-spacing', 'core.line-height'];
  for (const prefix of typographyPrefixes) {
    const typePath = `${prefix}.${referencePath}`;
    token = getTokenAtPath(tokens, typePath);
    if (token) return typePath;
  }

  // Try with Effects prefix (legacy format, normalized)
  const effectsPath = `Effects.Mode 1.${referencePath}`;
  token = getTokenAtPath(tokens, effectsPath);
  if (token) return effectsPath;

  // Try with Spacing prefix (legacy format, normalized)
  const spacingPath = `Spacing.Mode 1.${referencePath}`;
  token = getTokenAtPath(tokens, spacingPath);
  if (token) return spacingPath;

  // Try with Radius prefix (legacy format, normalized)
  const radiusPath = `Radius.Mode 1.${referencePath}`;
  token = getTokenAtPath(tokens, radiusPath);
  if (token) return radiusPath;

  // Try with Border Width prefix (legacy format, normalized)
  const borderPath = `Border Width.Mode 1.${referencePath}`;
  token = getTokenAtPath(tokens, borderPath);
  if (token) return borderPath;

  // Try within the current category
  const sameCategoryPath = `${currentCategory}.${referencePath}`;
  token = getTokenAtPath(tokens, sameCategoryPath);
  if (token) return sameCategoryPath;

  // Try with semantic.light prefix (DTCG format)
  const semanticLightPath = `semantic.light.${referencePath}`;
  token = getTokenAtPath(tokens, semanticLightPath);
  if (token) return semanticLightPath;

  // Try with semantic.dark prefix (DTCG format)
  const semanticDarkPath = `semantic.dark.${referencePath}`;
  token = getTokenAtPath(tokens, semanticDarkPath);
  if (token) return semanticDarkPath;

  // Try with component prefix (for component-to-component references)
  const componentPath = `component.${referencePath}`;
  token = getTokenAtPath(tokens, componentPath);
  if (token) return componentPath;

  // Handle references like {color.brand.brand-400} → core.colors.color.brand.brand-400
  // Extract the first segment and try various prefixes
  const segments = referencePath.split('.');
  if (segments.length >= 2) {
    const firstSegment = segments[0];
    const restOfPath = segments.slice(1).join('.');

    // Color references: {color.brand.brand-400}
    if (firstSegment === 'color') {
      const colorVariations = [
        `core.colors.color.${restOfPath}`,
        `core.neutrals.color.${restOfPath}`,
      ];
      for (const variation of colorVariations) {
        token = getTokenAtPath(tokens, variation);
        if (token) return variation;
      }
    }

    // Spacing references: {spacing.spacing-9}
    if (firstSegment === 'spacing') {
      token = getTokenAtPath(tokens, `core.spacing.spacing.${restOfPath}`);
      if (token) return `core.spacing.spacing.${restOfPath}`;
    }

    // Border references
    if (firstSegment === 'border') {
      token = getTokenAtPath(tokens, `core.border.border.${restOfPath}`);
      if (token) return `core.border.border.${restOfPath}`;
    }
  }

  return null;
}

/**
 * Resolve a single token, following references recursively
 */
export function resolveToken(
  tokens: TokensStudioFile,
  path: string,
  visited: Set<string> = new Set()
): ResolvedToken {
  // Guard against circular references
  if (visited.has(path)) {
    throw new Error(`Circular reference detected: ${path}`);
  }
  visited.add(path);

  const token = getTokenAtPath(tokens, path);
  if (!token) {
    throw new Error(`Token not found: ${path}`);
  }

  const name = path.split('.').pop() || path;
  const category = path.split('.')[0];

  // If value is a reference, resolve recursively
  if (isTokenReference(token.$value)) {
    const refPath = parseReference(token.$value as string);
    const resolvedRefPath = findTokenPath(tokens, refPath, category);

    if (!resolvedRefPath) {
      // Return unresolved reference as-is with warning
      console.warn(`Could not resolve reference: ${token.$value} in ${path}`);
      return {
        path,
        name,
        type: token.$type || 'color',
        value: token.$value,
        rawValue: token.$value,
        description: token.$description,
        isReference: true,
        referencePath: refPath,
      };
    }

    try {
      const resolved = resolveToken(tokens, resolvedRefPath, new Set(visited));
      return {
        path,
        name,
        type: token.$type || resolved.type,
        value: resolved.value,
        rawValue: token.$value,
        description: token.$description,
        isReference: true,
        referencePath: resolvedRefPath,
      };
    } catch (error) {
      console.warn(`Error resolving reference ${token.$value} in ${path}:`, error);
      return {
        path,
        name,
        type: token.$type || 'color',
        value: token.$value,
        rawValue: token.$value,
        description: token.$description,
        isReference: true,
        referencePath: refPath,
      };
    }
  }

  // Terminal value - not a reference
  return {
    path,
    name,
    type: token.$type || inferTokenType(token.$value),
    value: token.$value,
    rawValue: token.$value,
    description: token.$description,
    isReference: false,
  };
}

/**
 * Resolve all tokens in the file
 */
export function resolveAllTokens(
  tokens: TokensStudioFile
): Map<string, ResolvedToken> {
  const resolved = new Map<string, ResolvedToken>();
  const paths = getAllTokenPaths(tokens);

  for (const path of paths) {
    try {
      const resolvedToken = resolveToken(tokens, path);
      resolved.set(path, resolvedToken);
    } catch (error) {
      console.warn(`Failed to resolve token at ${path}:`, error);
    }
  }

  return resolved;
}

/**
 * Get resolved tokens for a specific category
 */
export function getResolvedTokensForCategory(
  resolved: Map<string, ResolvedToken>,
  category: string
): ResolvedToken[] {
  const tokens: ResolvedToken[] = [];

  for (const [path, token] of resolved) {
    if (path.startsWith(category)) {
      tokens.push(token);
    }
  }

  return tokens;
}

/**
 * Get resolved tokens grouped by subcategory within a category
 */
export function getResolvedTokensBySubcategory(
  resolved: Map<string, ResolvedToken>,
  category: string
): Map<string, ResolvedToken[]> {
  const grouped = new Map<string, ResolvedToken[]>();

  for (const [path, token] of resolved) {
    if (path.startsWith(category)) {
      // Get the subcategory (second level after category)
      const relativePath = path.slice(category.length + 1);
      const subcategory = relativePath.split('.')[0];

      if (!grouped.has(subcategory)) {
        grouped.set(subcategory, []);
      }
      grouped.get(subcategory)!.push(token);
    }
  }

  return grouped;
}
