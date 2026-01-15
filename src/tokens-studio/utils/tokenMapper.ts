import {
  TokensStudioFile,
  TokenGroup,
  ParsedTokens,
  TokenCategory,
  ResolvedToken,
  isToken,
  isTokenGroup,
} from '../types/tokens';
import { resolveToken } from './tokenResolver';

/**
 * Create a human-readable label from a token/category name
 */
function formatLabel(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Map a token group to a TokenCategory with resolved tokens
 */
function mapGroupToCategory(
  tokens: TokensStudioFile,
  group: TokenGroup,
  basePath: string,
  categoryId: string,
  label: string
): TokenCategory {
  const resolvedTokens: ResolvedToken[] = [];
  const subcategories: TokenCategory[] = [];

  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;

    const currentPath = `${basePath}.${key}`;

    if (isToken(value)) {
      try {
        const resolved = resolveToken(tokens, currentPath);
        resolvedTokens.push(resolved);
      } catch (error) {
        console.warn(`Failed to resolve ${currentPath}:`, error);
      }
    } else if (isTokenGroup(value)) {
      // Check if this group has direct tokens or only subgroups
      const hasDirectTokens = Object.values(value).some(isToken);
      const hasSubgroups = Object.values(value).some(isTokenGroup);

      if (hasDirectTokens && !hasSubgroups) {
        // This is a leaf group with tokens - map all tokens
        const subCategory = mapGroupToCategory(
          tokens,
          value,
          currentPath,
          key,
          formatLabel(key)
        );
        if (subCategory.tokens.length > 0) {
          subcategories.push(subCategory);
        }
      } else if (hasSubgroups) {
        // This has nested groups - recurse
        const subCategory = mapGroupToCategory(
          tokens,
          value,
          currentPath,
          key,
          formatLabel(key)
        );
        if (subCategory.tokens.length > 0 || (subCategory.subcategories && subCategory.subcategories.length > 0)) {
          subcategories.push(subCategory);
        }
      } else {
        // Mixed or empty - try to map anyway
        const subCategory = mapGroupToCategory(
          tokens,
          value,
          currentPath,
          key,
          formatLabel(key)
        );
        if (subCategory.tokens.length > 0 || (subCategory.subcategories && subCategory.subcategories.length > 0)) {
          subcategories.push(subCategory);
        }
      }
    }
  }

  return {
    id: categoryId,
    label,
    tokens: resolvedTokens,
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  };
}

/**
 * Map Color/Default category to core palettes
 */
function mapColorPalettes(tokens: TokensStudioFile): TokenCategory[] {
  const colorDefault = tokens['Color/Default'];
  if (!colorDefault) return [];

  const palettes: TokenCategory[] = [];

  for (const [paletteName, paletteValue] of Object.entries(colorDefault)) {
    if (isTokenGroup(paletteValue)) {
      const category = mapGroupToCategory(
        tokens,
        paletteValue,
        `Color/Default.${paletteName}`,
        paletteName,
        formatLabel(paletteName)
      );
      palettes.push(category);
    }
  }

  return palettes;
}

/**
 * Map Component Tokens and Semantic Tokens for a specific mode (Light/Dark)
 * Checks both "Component Tokens/{mode}" and "Semantic Tokens/{mode}" paths
 */
function mapComponentTokens(
  tokens: TokensStudioFile,
  mode: 'Light Mode' | 'Dark Mode'
): TokenCategory[] {
  const categories: TokenCategory[] = [];

  // First check Component Tokens path
  const componentTokens = tokens[`Component Tokens/${mode}`];
  if (componentTokens) {
    for (const [categoryName, categoryValue] of Object.entries(componentTokens)) {
      if (isTokenGroup(categoryValue)) {
        const category = mapGroupToCategory(
          tokens,
          categoryValue,
          `Component Tokens/${mode}.${categoryName}`,
          categoryName,
          formatLabel(categoryName)
        );
        categories.push(category);
      }
    }
  }

  // Also check Semantic Tokens path (separate files in Tokens Studio)
  const semanticTokens = tokens[`Semantic Tokens/${mode}`];
  if (semanticTokens) {
    for (const [categoryName, categoryValue] of Object.entries(semanticTokens)) {
      if (isTokenGroup(categoryValue)) {
        const category = mapGroupToCategory(
          tokens,
          categoryValue,
          `Semantic Tokens/${mode}.${categoryName}`,
          categoryName,
          formatLabel(categoryName)
        );
        categories.push(category);
      }
    }
  }

  return categories;
}

/**
 * Map Typography tokens
 */
function mapTypography(tokens: TokensStudioFile): TokenCategory {
  const typography = tokens['Typography/Default'];
  if (!typography) {
    return { id: 'typography', label: 'Typography', tokens: [] };
  }

  return mapGroupToCategory(
    tokens,
    typography,
    'Typography/Default',
    'typography',
    'Typography'
  );
}

/**
 * Map Spacing tokens
 */
function mapSpacing(tokens: TokensStudioFile): TokenCategory {
  const spacing = tokens['Spacing/Mode 1'];
  if (!spacing) {
    return { id: 'spacing', label: 'Spacing', tokens: [] };
  }

  const resolvedTokens: ResolvedToken[] = [];

  for (const [key, value] of Object.entries(spacing)) {
    if (isToken(value)) {
      try {
        const resolved = resolveToken(tokens, `Spacing/Mode 1.${key}`);
        resolvedTokens.push(resolved);
      } catch (error) {
        console.warn(`Failed to resolve Spacing/Mode 1.${key}:`, error);
      }
    }
  }

  // Sort by numeric value
  resolvedTokens.sort((a, b) => {
    const aVal = typeof a.value === 'number' ? a.value : parseInt(String(a.value)) || 0;
    const bVal = typeof b.value === 'number' ? b.value : parseInt(String(b.value)) || 0;
    return aVal - bVal;
  });

  return {
    id: 'spacing',
    label: 'Spacing',
    tokens: resolvedTokens,
  };
}

/**
 * Map Radius tokens
 */
function mapRadius(tokens: TokensStudioFile): TokenCategory {
  const radius = tokens['Radius/Mode 1'];
  if (!radius) {
    return { id: 'radius', label: 'Border Radius', tokens: [] };
  }

  const resolvedTokens: ResolvedToken[] = [];

  for (const [key, value] of Object.entries(radius)) {
    if (isToken(value)) {
      try {
        const resolved = resolveToken(tokens, `Radius/Mode 1.${key}`);
        resolvedTokens.push(resolved);
      } catch (error) {
        console.warn(`Failed to resolve Radius/Mode 1.${key}:`, error);
      }
    }
  }

  // Sort by numeric value
  resolvedTokens.sort((a, b) => {
    const aVal = typeof a.value === 'number' ? a.value : parseInt(String(a.value)) || 0;
    const bVal = typeof b.value === 'number' ? b.value : parseInt(String(b.value)) || 0;
    return aVal - bVal;
  });

  return {
    id: 'radius',
    label: 'Border Radius',
    tokens: resolvedTokens,
  };
}

/**
 * Map Border Width tokens
 */
function mapBorderWidth(tokens: TokensStudioFile): TokenCategory {
  const borderWidth = tokens['Border Width/Mode 1'];
  if (!borderWidth) {
    return { id: 'borderWidth', label: 'Border Width', tokens: [] };
  }

  const resolvedTokens: ResolvedToken[] = [];

  for (const [key, value] of Object.entries(borderWidth)) {
    if (isToken(value)) {
      try {
        const resolved = resolveToken(tokens, `Border Width/Mode 1.${key}`);
        resolvedTokens.push(resolved);
      } catch (error) {
        console.warn(`Failed to resolve Border Width/Mode 1.${key}:`, error);
      }
    }
  }

  // Sort by numeric value
  resolvedTokens.sort((a, b) => {
    const aVal = typeof a.value === 'number' ? a.value : parseInt(String(a.value)) || 0;
    const bVal = typeof b.value === 'number' ? b.value : parseInt(String(b.value)) || 0;
    return aVal - bVal;
  });

  return {
    id: 'borderWidth',
    label: 'Border Width',
    tokens: resolvedTokens,
  };
}

/**
 * Map Effects tokens
 */
function mapEffects(tokens: TokensStudioFile): TokenCategory {
  const effects = tokens['Effects/Mode 1'];
  if (!effects) {
    return { id: 'effects', label: 'Effects', tokens: [] };
  }

  const resolvedTokens: ResolvedToken[] = [];

  for (const [key, value] of Object.entries(effects)) {
    if (isToken(value)) {
      try {
        const resolved = resolveToken(tokens, `Effects/Mode 1.${key}`);
        resolvedTokens.push(resolved);
      } catch (error) {
        console.warn(`Failed to resolve Effects/Mode 1.${key}:`, error);
      }
    }
  }

  return {
    id: 'effects',
    label: 'Effects',
    tokens: resolvedTokens,
  };
}

/**
 * Map all tokens to the ParsedTokens structure
 */
export function mapToParsedTokens(tokens: TokensStudioFile): ParsedTokens {
  return {
    colors: {
      core: mapColorPalettes(tokens),
      semantic: {
        light: mapComponentTokens(tokens, 'Light Mode'),
        dark: mapComponentTokens(tokens, 'Dark Mode'),
      },
    },
    typography: mapTypography(tokens),
    spacing: mapSpacing(tokens),
    radius: mapRadius(tokens),
    borderWidth: mapBorderWidth(tokens),
    effects: mapEffects(tokens),
  };
}

/**
 * Flatten a TokenCategory tree into a single list of tokens
 */
export function flattenCategory(category: TokenCategory): ResolvedToken[] {
  const tokens = [...category.tokens];

  if (category.subcategories) {
    for (const sub of category.subcategories) {
      tokens.push(...flattenCategory(sub));
    }
  }

  return tokens;
}

/**
 * Get all color tokens (both core and semantic for current mode)
 */
export function getAllColorTokens(
  parsed: ParsedTokens,
  isDarkMode: boolean
): ResolvedToken[] {
  const tokens: ResolvedToken[] = [];

  // Add core palette tokens
  for (const palette of parsed.colors.core) {
    tokens.push(...flattenCategory(palette));
  }

  // Add semantic tokens for current mode
  const semantic = isDarkMode ? parsed.colors.semantic.dark : parsed.colors.semantic.light;
  for (const category of semantic) {
    tokens.push(...flattenCategory(category));
  }

  return tokens;
}
