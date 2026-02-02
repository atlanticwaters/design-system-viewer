/**
 * Token Validator
 * DTCG and OCM layer rule validation
 *
 * This validator must match OCM's validation rules exactly to catch
 * errors before tokens are committed to the repository.
 */

import type {
  EditableToken,
  ValidationResult,
  ValidationIssue,
  TokenType,
} from '../types/editor';
import { LAYER_RULES } from './layerRules';

/**
 * Check if a value is a token reference
 * References are strings in the format: {path.to.token}
 */
export function isTokenReference(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.startsWith('{') &&
    value.endsWith('}') &&
    value.length > 2
  );
}

/**
 * Extract the token path from a reference string
 * "{color.brand.300}" -> "color.brand.300"
 */
export function extractReferencePath(reference: string): string {
  return reference.slice(1, -1);
}

/**
 * Format a path as a token reference
 * "color.brand.300" -> "{color.brand.300}"
 */
export function formatAsReference(path: string): string {
  return `{${path}}`;
}

/**
 * Validate token path format (DTCG standard)
 * Valid paths use dot notation only with kebab-case or camelCase segments
 * NO slashes allowed - paths must be pure dot-separated
 */
function isValidTokenPath(path: string): boolean {
  // DTCG standard: no slashes allowed
  if (path.includes('/') || path.includes('\\')) {
    return false;
  }

  // Must not start or end with a dot
  // Must not have consecutive dots
  if (!path || path.startsWith('.') || path.endsWith('.') || path.includes('..')) {
    return false;
  }

  // Each segment must be valid identifier
  const segments = path.split('.');
  // Segments can only contain letters, numbers, hyphens, and underscores
  const segmentPattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

  return segments.every(segment => segmentPattern.test(segment));
}

/**
 * Normalize a path to DTCG format (convert slashes to dots)
 */
function normalizePath(path: string): string {
  return path.replace(/[\\/]/g, '.');
}


/**
 * Validate a single token against DTCG schema and OCM layer rules
 *
 * @param token - The token to validate
 * @param allTokens - Map of all tokens for reference resolution
 * @returns ValidationResult with valid flag and issues
 */
export function validateToken(
  token: EditableToken,
  allTokens: Map<string, EditableToken>
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const rules = LAYER_RULES[token.layer];

  // DTCG Schema: $value is required
  if (token.$value === undefined || token.$value === null) {
    issues.push({
      severity: 'error',
      rule: 'dtcg-schema',
      message: 'Token must have a $value property',
      suggestion: 'Add a value or reference to another token',
    });
  }

  // DTCG Schema: $type is recommended
  if (!token.$type) {
    issues.push({
      severity: 'warning',
      rule: 'dtcg-schema',
      message: 'Token should have a $type property',
      suggestion: 'Add a type like "color", "dimension", or "number"',
    });
  }

  // Validate references
  if (isTokenReference(token.$value)) {
    const refPath = extractReferencePath(token.$value as string);

    // Check if referenced token exists
    const refToken = allTokens.get(refPath);

    if (!refToken) {
      // Try to find token by checking alternative paths
      const foundByAltPath = findTokenByAlternativePaths(refPath, allTokens);

      if (!foundByAltPath) {
        issues.push({
          severity: 'error',
          rule: 'invalid-reference',
          message: `Referenced token not found: ${refPath}`,
          suggestion: 'Check the token path spelling or ensure the referenced token exists',
        });
      }
    } else {
      // Check layer rules
      const refLayer = refToken.layer;

      if (!rules.canReference.includes(refLayer)) {
        const allowedLayers = rules.canReference.length > 0
          ? rules.canReference.join(' or ')
          : 'no other layers';

        issues.push({
          severity: 'error',
          rule: 'layer-violation',
          message: `${capitalize(token.layer)} tokens cannot reference ${refLayer} tokens`,
          suggestion: `${capitalize(token.layer)} layer can only reference: ${allowedLayers}`,
        });
      }

      // Check for circular references (simple check)
      if (refPath === token.path) {
        issues.push({
          severity: 'error',
          rule: 'circular-reference',
          message: 'Token cannot reference itself',
          suggestion: 'Use a different token reference or a literal value',
        });
      }
    }
  } else if (!rules.allowLiterals && token.$value !== undefined) {
    // Check for literal values where references are expected
    issues.push({
      severity: 'warning',
      rule: 'literal-value',
      message: `${capitalize(token.layer)} tokens should use references, not literal values`,
      suggestion: 'Replace with a reference to a core token like {color.brand.300}',
    });
  }

  // Validate naming conventions
  if (!isValidTokenPath(token.path)) {
    issues.push({
      severity: 'warning',
      rule: 'naming-convention',
      message: 'Token path should use valid naming format',
      suggestion: 'Use dot-separated segments with letters, numbers, hyphens, or underscores',
    });
  }

  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
  };
}

/**
 * Try to find a token using alternative path formats
 * Tokens may be referenced by different path patterns
 * All paths are now normalized to DTCG dot-notation
 */
function findTokenByAlternativePaths(
  path: string,
  allTokens: Map<string, EditableToken>
): EditableToken | undefined {
  // Normalize the input path first
  const normalizedPath = normalizePath(path);

  // Try exact match first
  if (allTokens.has(normalizedPath)) {
    return allTokens.get(normalizedPath);
  }

  // Build list of path variations to try (all using dot notation)
  const variations = [
    // Direct variations
    normalizedPath,
    `core.${normalizedPath}`,
    `semantic.${normalizedPath}`,
    `component.${normalizedPath}`,
    // Tokens Studio Sandbox format - core tokens (normalized to dots)
    `core.colors.${normalizedPath}`,
    `core.colors.color.${normalizedPath}`,
    `core.neutrals.color.${normalizedPath}`,
    `core.spacing.${normalizedPath}`,
    `core.border.${normalizedPath}`,
    `core.border.border.width.${normalizedPath}`,
    `core.border.border.radius.${normalizedPath}`,
    `core.elevation.${normalizedPath}`,
    `core.elevation.elevation.${normalizedPath}`,
    `core.font-family.${normalizedPath}`,
    `core.font-size.${normalizedPath}`,
    `core.font-weight.${normalizedPath}`,
    `core.letter-spacing.${normalizedPath}`,
    `core.line-height.${normalizedPath}`,
    // Semantic tokens (normalized to dots)
    `semantic.light.${normalizedPath}`,
    `semantic.dark.${normalizedPath}`,
    // Legacy format (normalized to dots)
    `Color.Default.${normalizedPath}`,
    `Spacing.Mode 1.${normalizedPath}`,
    `Radius.Mode 1.${normalizedPath}`,
    `Border Width.Mode 1.${normalizedPath}`,
    `Effects.Mode 1.${normalizedPath}`,
  ];

  for (const variation of variations) {
    if (allTokens.has(variation)) {
      return allTokens.get(variation);
    }
  }

  // Also try partial matching - the reference might be a suffix of the full path
  // e.g., "color.brand.brand-400" should match "core.colors.color.brand.brand-400"
  for (const [tokenPath, token] of allTokens) {
    if (tokenPath.endsWith(`.${normalizedPath}`)) {
      return token;
    }
  }

  return undefined;
}

/**
 * Validate all tokens in a collection
 *
 * @param tokens - Array of tokens to validate
 * @returns Map of token paths to validation results
 */
export function validateAllTokens(
  tokens: EditableToken[]
): Map<string, ValidationResult> {
  const tokenMap = new Map(tokens.map(t => [t.path, t]));
  const results = new Map<string, ValidationResult>();

  for (const token of tokens) {
    results.set(token.path, validateToken(token, tokenMap));
  }

  return results;
}

/**
 * Check if all tokens in a collection are valid
 */
export function areAllTokensValid(
  validationResults: Map<string, ValidationResult>
): boolean {
  for (const result of validationResults.values()) {
    if (!result.valid) {
      return false;
    }
  }
  return true;
}

/**
 * Get all validation errors from a results map
 */
export function getAllErrors(
  validationResults: Map<string, ValidationResult>
): Array<{ path: string; issues: ValidationIssue[] }> {
  const errors: Array<{ path: string; issues: ValidationIssue[] }> = [];

  for (const [path, result] of validationResults) {
    const errorIssues = result.issues.filter(i => i.severity === 'error');
    if (errorIssues.length > 0) {
      errors.push({ path, issues: errorIssues });
    }
  }

  return errors;
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validate a token value for a specific type
 */
export function validateValueForType(
  value: unknown,
  type: TokenType | undefined
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (value === undefined || value === null) {
    return issues;
  }

  // Skip validation for references
  if (isTokenReference(value)) {
    return issues;
  }

  switch (type) {
    case 'color':
      if (typeof value === 'string' && !isValidColor(value)) {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Color value may not be valid',
          suggestion: 'Use hex (#RGB, #RRGGBB), rgb(), rgba(), or hsl() format',
        });
      }
      break;

    case 'dimension':
      if (typeof value === 'string' && !isValidDimension(value)) {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Dimension value may not be valid',
          suggestion: 'Use a number with a unit like "16px" or "1rem"',
        });
      }
      break;

    case 'number':
      if (typeof value !== 'number' && isNaN(Number(value))) {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Number value should be numeric',
          suggestion: 'Use a plain number without units',
        });
      }
      break;

    case 'fontWeight':
      if (typeof value !== 'number' && typeof value !== 'string') {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Font weight should be a number or keyword',
          suggestion: 'Use a number (100-900) or keyword like "bold"',
        });
      }
      break;

    case 'duration':
      if (typeof value === 'string' && !isValidDuration(value)) {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Duration value may not be valid',
          suggestion: 'Use a number with ms or s unit like "200ms" or "0.2s"',
        });
      }
      break;

    case 'cubicBezier':
      if (!isValidCubicBezier(value)) {
        issues.push({
          severity: 'warning',
          rule: 'dtcg-schema',
          message: 'Cubic bezier should be an array of 4 numbers',
          suggestion: 'Use format [x1, y1, x2, y2] with values between 0 and 1',
        });
      }
      break;
  }

  return issues;
}

// Validation helpers
function isValidColor(value: string): boolean {
  // Hex colors
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    return true;
  }
  // RGB/RGBA
  if (/^rgba?\s*\(/.test(value)) {
    return true;
  }
  // HSL/HSLA
  if (/^hsla?\s*\(/.test(value)) {
    return true;
  }
  // Named colors (just check it's a simple word)
  if (/^[a-zA-Z]+$/.test(value)) {
    return true;
  }
  return false;
}

function isValidDimension(value: string): boolean {
  return /^-?[\d.]+\s*(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/.test(value);
}

function isValidDuration(value: string): boolean {
  return /^[\d.]+\s*(ms|s)$/.test(value);
}

function isValidCubicBezier(value: unknown): boolean {
  if (!Array.isArray(value) || value.length !== 4) {
    return false;
  }
  return value.every(v => typeof v === 'number');
}

/**
 * Find all tokens that reference a given token path
 * Used for impact analysis before deletion
 */
export function findDependentTokens(
  tokenPath: string,
  allTokens: Map<string, EditableToken>
): EditableToken[] {
  const dependents: EditableToken[] = [];
  const referencePattern = formatAsReference(tokenPath);

  for (const token of allTokens.values()) {
    // Skip the token itself
    if (token.path === tokenPath) continue;

    // Check if this token's value references the target
    if (typeof token.$value === 'string' && token.$value === referencePattern) {
      dependents.push(token);
    }
  }

  return dependents;
}

/**
 * Impact analysis result for token deletion
 */
export interface DeletionImpact {
  /** Tokens that directly reference this token */
  directDependents: EditableToken[];
  /** Total count of affected tokens (may include indirect) */
  affectedCount: number;
  /** Whether deletion would break other tokens */
  wouldBreakTokens: boolean;
}

/**
 * Analyze the impact of deleting a token
 */
export function analyzeDeletionImpact(
  tokenPath: string,
  allTokens: Map<string, EditableToken>
): DeletionImpact {
  const directDependents = findDependentTokens(tokenPath, allTokens);

  return {
    directDependents,
    affectedCount: directDependents.length,
    wouldBreakTokens: directDependents.length > 0,
  };
}
