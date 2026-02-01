/**
 * Token Converter
 * Utilities to convert between tokens-studio types and editor types
 */

import type { ResolvedToken } from '../../tokens-studio/types/tokens';
import type { EditableToken, TokenType, TokenLayer } from '../types/editor';

/**
 * Convert a ResolvedToken to an EditableToken
 */
export function resolvedToEditable(
  token: ResolvedToken,
  filePath: string = 'tokens/unknown.json'
): EditableToken {
  return {
    path: token.path,
    $value: token.rawValue, // Use raw value (may be reference)
    $type: token.type as TokenType,
    $description: token.description,
    filePath,
    layer: inferLayerFromPath(token.path),
    resolvedValue: token.isReference ? token.value : undefined,
    referencePath: token.referencePath,
    referenceValid: token.isReference ? true : undefined,
  };
}

/**
 * Convert multiple ResolvedTokens to EditableTokens
 */
export function resolvedMapToEditableMap(
  resolvedTokens: Map<string, ResolvedToken>
): Map<string, EditableToken> {
  const editableMap = new Map<string, EditableToken>();

  for (const [path, token] of resolvedTokens) {
    const filePath = inferFilePathFromPath(token.path);
    editableMap.set(path, resolvedToEditable(token, filePath));
  }

  return editableMap;
}

/**
 * Infer the layer from a token path
 * This is a heuristic based on path patterns
 */
function inferLayerFromPath(path: string): TokenLayer {
  const lowerPath = path.toLowerCase();

  // Check for core/primitive patterns
  if (
    lowerPath.includes('color/default') ||
    lowerPath.includes('typography/default') ||
    lowerPath.includes('spacing/') ||
    lowerPath.includes('radius/') ||
    lowerPath.includes('border width/') ||
    lowerPath.includes('/core') ||
    lowerPath.includes('/primitives')
  ) {
    return 'core';
  }

  // Check for semantic patterns
  if (
    lowerPath.includes('/semantic') ||
    lowerPath.includes('light mode') ||
    lowerPath.includes('dark mode') ||
    lowerPath.startsWith('system.')
  ) {
    return 'semantic';
  }

  // Check for component patterns
  if (
    lowerPath.includes('component') ||
    lowerPath.startsWith('component.')
  ) {
    return 'component';
  }

  // Default to core for raw values
  return 'core';
}

/**
 * Infer the file path from a token path
 */
function inferFilePathFromPath(path: string): string {
  const lowerPath = path.toLowerCase();

  // Try to extract the set name from the path
  const setMatch = path.match(/^([^.]+)\./);
  if (setMatch) {
    const setName = setMatch[1];

    // Map common set names to file paths
    if (setName.includes('Color')) {
      return 'tokens/core/colors.json';
    }
    if (setName.includes('Typography')) {
      return 'tokens/core/typography.json';
    }
    if (setName.includes('Spacing')) {
      return 'tokens/core/spacing.json';
    }
    if (setName.includes('Radius')) {
      return 'tokens/core/radius.json';
    }
    if (setName.includes('Border')) {
      return 'tokens/core/border.json';
    }
    if (setName.includes('Component') && setName.includes('Light')) {
      return 'tokens/semantic/light.json';
    }
    if (setName.includes('Component') && setName.includes('Dark')) {
      return 'tokens/semantic/dark.json';
    }
  }

  // Check for semantic layer patterns
  if (lowerPath.startsWith('system.') || lowerPath.startsWith('component.')) {
    if (lowerPath.includes('light') || !lowerPath.includes('dark')) {
      return 'tokens/semantic/light.json';
    }
    return 'tokens/semantic/dark.json';
  }

  // Default
  return 'tokens/core/colors.json';
}

/**
 * Get a summary of tokens by layer
 */
export function getTokenSummaryByLayer(
  tokens: Map<string, EditableToken>
): { core: number; semantic: number; component: number } {
  let core = 0;
  let semantic = 0;
  let component = 0;

  for (const token of tokens.values()) {
    switch (token.layer) {
      case 'core':
        core++;
        break;
      case 'semantic':
        semantic++;
        break;
      case 'component':
        component++;
        break;
    }
  }

  return { core, semantic, component };
}
