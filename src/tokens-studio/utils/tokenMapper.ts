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
 * Map Color.Default category to core palettes
 * Also checks "core.colors" and "core.neutrals" paths (DTCG normalized format)
 */
function mapColorPalettes(tokens: TokensStudioFile): TokenCategory[] {
  const palettes: TokenCategory[] = [];

  // Check legacy "Color.Default" path (normalized from Color/Default)
  const colorDefault = tokens['Color.Default'];
  if (colorDefault) {
    for (const [paletteName, paletteValue] of Object.entries(colorDefault)) {
      if (isTokenGroup(paletteValue)) {
        const category = mapGroupToCategory(
          tokens,
          paletteValue,
          `Color.Default.${paletteName}`,
          paletteName,
          formatLabel(paletteName)
        );
        palettes.push(category);
      }
    }
  }

  // Check DTCG "core.colors" path (normalized from core/colors)
  // Structure: core.colors.color.{palette-name}
  const coreColors = tokens['core.colors'];
  if (coreColors && isTokenGroup(coreColors)) {
    const colorGroup = coreColors['color'];
    if (colorGroup && isTokenGroup(colorGroup)) {
      // Iterate over each palette (brand, bottle-green, etc.)
      for (const [paletteName, paletteValue] of Object.entries(colorGroup)) {
        if (isTokenGroup(paletteValue)) {
          const category = mapGroupToCategory(
            tokens,
            paletteValue,
            `core.colors.color.${paletteName}`,
            paletteName,
            formatLabel(paletteName)
          );
          palettes.push(category);
        }
      }
    }
  }

  // Check DTCG "core.neutrals" path (normalized from core/neutrals)
  // Structure: core.neutrals.color.{palette-name}
  const coreNeutrals = tokens['core.neutrals'];
  if (coreNeutrals && isTokenGroup(coreNeutrals)) {
    const colorGroup = coreNeutrals['color'];
    if (colorGroup && isTokenGroup(colorGroup)) {
      for (const [paletteName, paletteValue] of Object.entries(colorGroup)) {
        if (isTokenGroup(paletteValue)) {
          const category = mapGroupToCategory(
            tokens,
            paletteValue,
            `core.neutrals.color.${paletteName}`,
            paletteName,
            formatLabel(paletteName)
          );
          palettes.push(category);
        }
      }
    }
  }

  return palettes;
}

/**
 * Map Component Tokens and Semantic Tokens for a specific mode (Light/Dark)
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Component Tokens.{mode}" (legacy, normalized)
 * - "Semantic Tokens.{mode}" (legacy, normalized)
 * - "semantic.light" or "semantic.dark" (DTCG format)
 */
function mapComponentTokens(
  tokens: TokensStudioFile,
  mode: 'Light Mode' | 'Dark Mode'
): TokenCategory[] {
  const categories: TokenCategory[] = [];

  // First check Component Tokens path (legacy format, normalized)
  const componentTokens = tokens[`Component Tokens.${mode}`];
  if (componentTokens) {
    for (const [categoryName, categoryValue] of Object.entries(componentTokens)) {
      if (isTokenGroup(categoryValue)) {
        const category = mapGroupToCategory(
          tokens,
          categoryValue,
          `Component Tokens.${mode}.${categoryName}`,
          categoryName,
          formatLabel(categoryName)
        );
        categories.push(category);
      }
    }
  }

  // Also check Semantic Tokens path (legacy format, normalized)
  const semanticTokens = tokens[`Semantic Tokens.${mode}`];
  if (semanticTokens) {
    for (const [categoryName, categoryValue] of Object.entries(semanticTokens)) {
      if (isTokenGroup(categoryValue)) {
        const category = mapGroupToCategory(
          tokens,
          categoryValue,
          `Semantic Tokens.${mode}.${categoryName}`,
          categoryName,
          formatLabel(categoryName)
        );
        categories.push(category);
      }
    }
  }

  // Check for DTCG format: "semantic.light" or "semantic.dark"
  const sandboxMode = mode === 'Light Mode' ? 'light' : 'dark';
  const sandboxTokens = tokens[`semantic.${sandboxMode}`];
  if (sandboxTokens) {
    for (const [categoryName, categoryValue] of Object.entries(sandboxTokens)) {
      if (isTokenGroup(categoryValue)) {
        const category = mapGroupToCategory(
          tokens,
          categoryValue,
          `semantic.${sandboxMode}.${categoryName}`,
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
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Typography.Default" (legacy, normalized)
 * - "core.font-family", "core.font-size", etc. (DTCG format)
 */
function mapTypography(tokens: TokensStudioFile): TokenCategory {
  const subcategories: TokenCategory[] = [];

  // Check legacy "Typography.Default" path (normalized)
  const typography = tokens['Typography.Default'];
  if (typography && isTokenGroup(typography)) {
    return mapGroupToCategory(
      tokens,
      typography,
      'Typography.Default',
      'typography',
      'Typography'
    );
  }

  // Check DTCG paths for typography
  const typographyPaths = [
    { key: 'core.font-family', label: 'Font Family' },
    { key: 'core.font-size', label: 'Font Size' },
    { key: 'core.font-weight', label: 'Font Weight' },
    { key: 'core.letter-spacing', label: 'Letter Spacing' },
    { key: 'core.line-height', label: 'Line Height' },
  ];

  for (const { key, label } of typographyPaths) {
    const group = tokens[key];
    if (group && isTokenGroup(group)) {
      const category = mapGroupToCategory(tokens, group, key, key, label);
      if (category.tokens.length > 0 || (category.subcategories && category.subcategories.length > 0)) {
        subcategories.push(category);
      }
    }
  }

  return {
    id: 'typography',
    label: 'Typography',
    tokens: [],
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  };
}

/**
 * Map Spacing tokens
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Spacing.Mode 1" (legacy, normalized)
 * - "core.spacing" (DTCG format)
 */
function mapSpacing(tokens: TokensStudioFile): TokenCategory {
  const resolvedTokens: ResolvedToken[] = [];

  // Check legacy "Spacing.Mode 1" path (normalized)
  const spacing = tokens['Spacing.Mode 1'];
  if (spacing) {
    for (const [key, value] of Object.entries(spacing)) {
      if (isToken(value)) {
        try {
          const resolved = resolveToken(tokens, `Spacing.Mode 1.${key}`);
          resolvedTokens.push(resolved);
        } catch (error) {
          console.warn(`Failed to resolve Spacing.Mode 1.${key}:`, error);
        }
      }
    }
  }

  // Check DTCG "core.spacing" path
  const coreSpacing = tokens['core.spacing'];
  if (coreSpacing && isTokenGroup(coreSpacing)) {
    const category = mapGroupToCategory(tokens, coreSpacing, 'core.spacing', 'spacing', 'Spacing');
    resolvedTokens.push(...category.tokens);
    if (category.subcategories) {
      for (const sub of category.subcategories) {
        resolvedTokens.push(...sub.tokens);
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
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Radius.Mode 1" (legacy, normalized)
 * - "core.border.border.radius" (DTCG format)
 */
function mapRadius(tokens: TokensStudioFile): TokenCategory {
  const resolvedTokens: ResolvedToken[] = [];

  // Check legacy "Radius.Mode 1" path (normalized)
  const radius = tokens['Radius.Mode 1'];
  if (radius) {
    for (const [key, value] of Object.entries(radius)) {
      if (isToken(value)) {
        try {
          const resolved = resolveToken(tokens, `Radius.Mode 1.${key}`);
          resolvedTokens.push(resolved);
        } catch (error) {
          console.warn(`Failed to resolve Radius.Mode 1.${key}:`, error);
        }
      }
    }
  }

  // Check DTCG "core.border" path for radius
  const coreBorder = tokens['core.border'];
  if (coreBorder && isTokenGroup(coreBorder)) {
    const borderGroup = coreBorder['border'];
    if (borderGroup && isTokenGroup(borderGroup)) {
      const radiusGroup = borderGroup['radius'];
      if (radiusGroup && isTokenGroup(radiusGroup)) {
        for (const [key, value] of Object.entries(radiusGroup)) {
          if (isToken(value)) {
            try {
              const resolved = resolveToken(tokens, `core.border.border.radius.${key}`);
              resolvedTokens.push(resolved);
            } catch (error) {
              console.warn(`Failed to resolve core.border.border.radius.${key}:`, error);
            }
          }
        }
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
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Border Width.Mode 1" (legacy, normalized)
 * - "core.border.border.width" (DTCG format)
 */
function mapBorderWidth(tokens: TokensStudioFile): TokenCategory {
  const resolvedTokens: ResolvedToken[] = [];

  // Check legacy "Border Width.Mode 1" path (normalized)
  const borderWidth = tokens['Border Width.Mode 1'];
  if (borderWidth) {
    for (const [key, value] of Object.entries(borderWidth)) {
      if (isToken(value)) {
        try {
          const resolved = resolveToken(tokens, `Border Width.Mode 1.${key}`);
          resolvedTokens.push(resolved);
        } catch (error) {
          console.warn(`Failed to resolve Border Width.Mode 1.${key}:`, error);
        }
      }
    }
  }

  // Check DTCG "core.border" path for width
  const coreBorder = tokens['core.border'];
  if (coreBorder && isTokenGroup(coreBorder)) {
    const borderGroup = coreBorder['border'];
    if (borderGroup && isTokenGroup(borderGroup)) {
      const widthGroup = borderGroup['width'];
      if (widthGroup && isTokenGroup(widthGroup)) {
        for (const [key, value] of Object.entries(widthGroup)) {
          if (isToken(value)) {
            try {
              const resolved = resolveToken(tokens, `core.border.border.width.${key}`);
              resolvedTokens.push(resolved);
            } catch (error) {
              console.warn(`Failed to resolve core.border.border.width.${key}:`, error);
            }
          }
        }
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
 * All paths are DTCG-compliant (dot-separated)
 * Checks multiple path patterns:
 * - "Effects.Mode 1" (legacy, normalized)
 * - "core.elevation.elevation" (DTCG format)
 */
function mapEffects(tokens: TokensStudioFile): TokenCategory {
  const resolvedTokens: ResolvedToken[] = [];
  const subcategories: TokenCategory[] = [];

  // Check legacy "Effects.Mode 1" path (normalized)
  const effects = tokens['Effects.Mode 1'];
  if (effects) {
    for (const [key, value] of Object.entries(effects)) {
      if (isToken(value)) {
        try {
          const resolved = resolveToken(tokens, `Effects.Mode 1.${key}`);
          resolvedTokens.push(resolved);
        } catch (error) {
          console.warn(`Failed to resolve Effects.Mode 1.${key}:`, error);
        }
      }
    }
  }

  // Check DTCG "core.elevation" path
  // Structure: core.elevation.elevation.{category}
  const coreElevation = tokens['core.elevation'];
  if (coreElevation && isTokenGroup(coreElevation)) {
    const elevationGroup = coreElevation['elevation'];
    if (elevationGroup && isTokenGroup(elevationGroup)) {
      // Iterate over each elevation category (shadow-blur, shadow-color, etc.)
      for (const [categoryName, categoryValue] of Object.entries(elevationGroup)) {
        if (isTokenGroup(categoryValue)) {
          const category = mapGroupToCategory(
            tokens,
            categoryValue,
            `core.elevation.elevation.${categoryName}`,
            categoryName,
            formatLabel(categoryName)
          );
          if (category.tokens.length > 0) {
            subcategories.push(category);
          }
        }
      }
    }
  }

  return {
    id: 'effects',
    label: 'Effects',
    tokens: resolvedTokens,
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  };
}

/**
 * Map Component token files from DTCG "components.*" or "component.*" paths
 * These are individual component token files like button.json, checkbox.json, etc.
 * All paths are DTCG-compliant (dot-separated)
 */
function mapComponentFiles(tokens: TokensStudioFile): TokenCategory[] {
  const components: TokenCategory[] = [];

  // Look for keys that start with "components." or "component." (handles both plural and singular)
  for (const [key, value] of Object.entries(tokens)) {
    let componentName: string | null = null;

    if (key.startsWith('components.')) {
      componentName = key.replace('components.', '');
    } else if (key.startsWith('component.')) {
      componentName = key.replace('component.', '');
    }

    if (componentName && isTokenGroup(value)) {
      const category = mapGroupToCategory(
        tokens,
        value,
        key,
        componentName,
        formatLabel(componentName)
      );
      if (category.tokens.length > 0 || (category.subcategories && category.subcategories.length > 0)) {
        components.push(category);
      }
    }
  }

  // Sort components alphabetically
  components.sort((a, b) => a.label.localeCompare(b.label));

  return components;
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
    components: mapComponentFiles(tokens),
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
