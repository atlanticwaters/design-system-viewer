/**
 * Token Serializer
 * Serialize tokens back to DTCG-compliant JSON
 */

import type { EditableToken, TokenChange } from '../types/editor';

/**
 * Token file structure - nested JSON with $value tokens
 */
interface TokenFileStructure {
  [key: string]: TokenFileStructure | TokenValue;
}

interface TokenValue {
  $value: unknown;
  $type?: string;
  $description?: string;
}

/**
 * Check if an object is a token value (has $value property)
 */
function isTokenValue(obj: unknown): obj is TokenValue {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '$value' in obj
  );
}

/**
 * Convert a flat token path to nested structure
 * "color.text.primary" -> { color: { text: { primary: {} } } }
 */
function pathToNested(path: string, value: TokenValue): TokenFileStructure {
  const segments = path.split('.');
  const result: TokenFileStructure = {};

  let current = result;
  for (let i = 0; i < segments.length - 1; i++) {
    current[segments[i]] = {};
    current = current[segments[i]] as TokenFileStructure;
  }

  current[segments[segments.length - 1]] = value;
  return result;
}

/**
 * Deep merge two token file structures
 */
function deepMerge(target: TokenFileStructure, source: TokenFileStructure): TokenFileStructure {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (isTokenValue(source[key])) {
      // It's a token, just assign it
      result[key] = source[key];
    } else if (
      key in result &&
      typeof result[key] === 'object' &&
      !isTokenValue(result[key]) &&
      typeof source[key] === 'object'
    ) {
      // Both are nested objects, merge them
      result[key] = deepMerge(
        result[key] as TokenFileStructure,
        source[key] as TokenFileStructure
      );
    } else {
      // New key or different type, assign
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Remove a token from a nested structure by path
 */
function removeFromNested(structure: TokenFileStructure, path: string): TokenFileStructure {
  const segments = path.split('.');
  const result = JSON.parse(JSON.stringify(structure)) as TokenFileStructure;

  // Navigate to parent
  let current = result;
  for (let i = 0; i < segments.length - 1; i++) {
    if (!(segments[i] in current)) {
      return result; // Path doesn't exist
    }
    current = current[segments[i]] as TokenFileStructure;
  }

  // Delete the final segment
  delete current[segments[segments.length - 1]];

  // Clean up empty parent objects
  cleanupEmptyObjects(result);

  return result;
}

/**
 * Recursively remove empty objects from structure
 */
function cleanupEmptyObjects(structure: TokenFileStructure): boolean {
  for (const key of Object.keys(structure)) {
    const value = structure[key];
    if (typeof value === 'object' && !isTokenValue(value)) {
      if (cleanupEmptyObjects(value as TokenFileStructure)) {
        delete structure[key];
      }
    }
  }
  return Object.keys(structure).length === 0;
}

/**
 * Convert EditableToken to TokenValue for serialization
 */
function tokenToValue(token: EditableToken): TokenValue {
  const value: TokenValue = {
    $value: token.$value,
  };

  if (token.$type) {
    value.$type = token.$type;
  }

  if (token.$description) {
    value.$description = token.$description;
  }

  return value;
}

/**
 * Apply a set of changes to a token file structure
 *
 * @param original - Original file content (JSON string or parsed object)
 * @param changes - Array of changes to apply
 * @returns Updated file structure
 */
export function applyChangesToFile(
  original: string | TokenFileStructure,
  changes: TokenChange[]
): TokenFileStructure {
  let structure: TokenFileStructure =
    typeof original === 'string' ? JSON.parse(original) : { ...original };

  for (const change of changes) {
    switch (change.type) {
      case 'create':
      case 'update':
        if (change.after) {
          const tokenPath = change.newPath || change.path;
          const nested = pathToNested(tokenPath, tokenToValue(change.after));
          structure = deepMerge(structure, nested);
        }
        break;

      case 'delete':
        structure = removeFromNested(structure, change.path);
        break;

      case 'rename':
        if (change.before && change.after && change.newPath) {
          // Remove old path
          structure = removeFromNested(structure, change.path);
          // Add at new path
          const nested = pathToNested(change.newPath, tokenToValue(change.after));
          structure = deepMerge(structure, nested);
        }
        break;
    }
  }

  return structure;
}

/**
 * Serialize a token file structure to formatted JSON string
 */
export function serializeToJson(structure: TokenFileStructure, indent = 2): string {
  return JSON.stringify(structure, null, indent);
}

/**
 * Group changes by file path
 */
export function groupChangesByFile(
  changes: TokenChange[]
): Map<string, TokenChange[]> {
  const grouped = new Map<string, TokenChange[]>();

  for (const change of changes) {
    const existing = grouped.get(change.filePath) || [];
    existing.push(change);
    grouped.set(change.filePath, existing);
  }

  return grouped;
}

/**
 * Generate file updates from changes
 *
 * @param changes - All pending changes
 * @param fileContents - Map of file paths to their current content
 * @returns Map of file paths to updated content
 */
export function generateFileUpdates(
  changes: TokenChange[],
  fileContents: Map<string, string>
): Map<string, string> {
  const grouped = groupChangesByFile(changes);
  const updates = new Map<string, string>();

  for (const [filePath, fileChanges] of grouped) {
    const original = fileContents.get(filePath) || '{}';
    const updated = applyChangesToFile(original, fileChanges);
    updates.set(filePath, serializeToJson(updated));
  }

  return updates;
}

/**
 * Parse a JSON file and extract all tokens as EditableTokens
 */
export function parseTokenFile(
  json: string,
  filePath: string,
  layer: 'core' | 'semantic' | 'component'
): EditableToken[] {
  const data = JSON.parse(json);
  const tokens: EditableToken[] = [];

  function walk(obj: TokenFileStructure, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      // Skip DTCG meta properties at file level
      if (key.startsWith('$')) continue;

      if (isTokenValue(value)) {
        tokens.push({
          path: [...path, key].join('.'),
          $value: value.$value,
          $type: value.$type as EditableToken['$type'],
          $description: value.$description,
          filePath,
          layer,
        });
      } else if (typeof value === 'object' && value !== null) {
        walk(value as TokenFileStructure, [...path, key]);
      }
    }
  }

  walk(data);
  return tokens;
}
