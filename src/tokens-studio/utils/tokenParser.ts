import { TokensStudioFile, TokenGroup, BaseToken, isToken, isTokenGroup } from '../types/tokens';

/**
 * Parse a JSON string into a TokensStudioFile structure
 */
export function parseTokensJson(jsonString: string): TokensStudioFile {
  try {
    const parsed = JSON.parse(jsonString);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Invalid tokens.json: expected an object');
    }

    return parsed as TokensStudioFile;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extract all token paths from a token group recursively
 */
export function extractTokenPaths(
  group: TokenGroup,
  basePath: string = ''
): string[] {
  const paths: string[] = [];

  for (const [key, value] of Object.entries(group)) {
    // Skip metadata keys
    if (key.startsWith('$')) continue;

    const currentPath = basePath ? `${basePath}.${key}` : key;

    if (isToken(value)) {
      paths.push(currentPath);
    } else if (isTokenGroup(value)) {
      paths.push(...extractTokenPaths(value, currentPath));
    }
  }

  return paths;
}

/**
 * Get all token paths from the entire tokens file
 */
export function getAllTokenPaths(tokens: TokensStudioFile): string[] {
  const paths: string[] = [];

  for (const [category, value] of Object.entries(tokens)) {
    // Skip metadata keys
    if (category.startsWith('$')) continue;

    if (isTokenGroup(value)) {
      const categoryPaths = extractTokenPaths(value, category);
      paths.push(...categoryPaths);
    }
  }

  return paths;
}

/**
 * Navigate to a specific token by dot-notation path
 */
export function getTokenAtPath(
  tokens: TokensStudioFile,
  path: string
): BaseToken | null {
  const parts = path.split('.');
  let current: unknown = tokens;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (isToken(current)) {
    return current;
  }

  return null;
}

/**
 * Get a token group at a specific path
 */
export function getGroupAtPath(
  tokens: TokensStudioFile,
  path: string
): TokenGroup | null {
  const parts = path.split('.');
  let current: unknown = tokens;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (isTokenGroup(current)) {
    return current;
  }

  return null;
}

/**
 * Get all category names from the tokens file
 */
export function getCategoryNames(tokens: TokensStudioFile): string[] {
  return Object.keys(tokens).filter(key => !key.startsWith('$'));
}

/**
 * Get token set order from metadata, or derive from keys
 */
export function getTokenSetOrder(tokens: TokensStudioFile): string[] {
  if (tokens.$metadata?.tokenSetOrder) {
    return tokens.$metadata.tokenSetOrder;
  }
  return getCategoryNames(tokens);
}

/**
 * Deep merge two token objects
 */
function deepMerge(target: TokenGroup, source: TokenGroup): TokenGroup {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (key in result && isTokenGroup(result[key]) && isTokenGroup(value)) {
      // Recursively merge nested groups
      result[key] = deepMerge(result[key] as TokenGroup, value as TokenGroup);
    } else {
      // Overwrite or add
      result[key] = value;
    }
  }

  return result;
}

/**
 * Derive a category name from a file path
 * e.g., "core/color-base.json" -> "core/color-base"
 * e.g., "semantic/light.json" -> "semantic/light"
 */
export function getCategoryFromPath(filePath: string): string {
  // Remove .json extension
  let category = filePath.replace(/\.json$/, '');

  // Replace path separators with forward slash for consistency
  category = category.replace(/\\/g, '/');

  return category;
}

/**
 * Parse and merge multiple token files into a single TokensStudioFile
 * This handles Tokens Studio's multi-file export format
 *
 * Files are categorized using their path structure:
 * - "Color/Default.json" -> category key "Color/Default"
 * - "Component Tokens/Light Mode.json" -> category key "Component Tokens/Light Mode"
 */
export function parseMultipleTokenFiles(
  files: { path: string; content: string }[]
): TokensStudioFile {
  const merged: TokensStudioFile = {};
  const tokenSetOrder: string[] = [];

  for (const file of files) {
    try {
      const parsed = JSON.parse(file.content);

      if (typeof parsed !== 'object' || parsed === null) {
        console.warn(`Skipping ${file.path}: not a valid object`);
        continue;
      }

      // Derive category name from file path
      // e.g., "Color/Default.json" -> "Color/Default"
      const category = getCategoryFromPath(file.path);
      tokenSetOrder.push(category);

      // Extract any metadata from the file
      if (parsed.$metadata && typeof parsed.$metadata === 'object') {
        merged.$metadata = {
          ...merged.$metadata,
          ...(parsed.$metadata as { tokenSetOrder?: string[] }),
        };
      }

      // Create a clean version without metadata
      const contentWithoutMeta: TokenGroup = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (!key.startsWith('$') && (isToken(value) || isTokenGroup(value))) {
          contentWithoutMeta[key] = value;
        }
      }

      // Always use the file path as the category key
      // This preserves the expected structure like "Color/Default", "Typography/Default", etc.
      if (merged[category] && isTokenGroup(merged[category])) {
        // Merge with existing category
        merged[category] = deepMerge(merged[category] as TokenGroup, contentWithoutMeta);
      } else {
        // Add new category
        merged[category] = contentWithoutMeta;
      }
    } catch (error) {
      console.warn(`Failed to parse ${file.path}:`, error);
    }
  }

  // Add or update token set order in metadata
  if (!merged.$metadata) {
    merged.$metadata = {};
  }
  if (!merged.$metadata.tokenSetOrder) {
    merged.$metadata.tokenSetOrder = tokenSetOrder;
  }

  return merged;
}

/**
 * Check if a parsed object looks like a Tokens Studio file
 * (has expected structure with token categories)
 */
export function isValidTokensStudioFile(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const entries = Object.entries(obj);

  // Should have at least one non-metadata key
  const hasCategories = entries.some(([key]) => !key.startsWith('$'));

  return hasCategories;
}
