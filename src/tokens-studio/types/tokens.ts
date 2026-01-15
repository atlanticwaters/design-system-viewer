// TypeScript interfaces for Tokens Studio DTCG-format tokens.json

export type TokenType = 'color' | 'number' | 'text' | 'dimension' | 'shadow' | 'typography';

// Base token with $type and $value
export interface BaseToken {
  $type?: TokenType;
  $value: string | number;
  $description?: string;
}

// Token group can contain tokens or nested groups
export interface TokenGroup {
  [key: string]: BaseToken | TokenGroup;
}

// Top-level structure of a Tokens Studio tokens.json file
export interface TokensStudioFile {
  'Color/Default'?: TokenGroup;
  'Effects/Mode 1'?: TokenGroup;
  'iOS Overrides/Mode 1'?: TokenGroup;
  'Component Tokens/Light Mode'?: TokenGroup;
  'Component Tokens/Dark Mode'?: TokenGroup;
  'Typography/Default'?: TokenGroup;
  'Spacing/Mode 1'?: TokenGroup;
  'Radius/Mode 1'?: TokenGroup;
  'Border Width/Mode 1'?: TokenGroup;
  $themes?: unknown[];
  $metadata?: {
    tokenSetOrder?: string[];
  };
  [key: string]: TokenGroup | unknown[] | { tokenSetOrder?: string[] } | undefined;
}

// Resolved token after reference resolution
export interface ResolvedToken {
  path: string;              // Full path: "Color/Default.brand.brand-300"
  name: string;              // Token name: "brand-300"
  type: TokenType;
  value: string | number;    // Resolved value
  rawValue: string | number; // Original value (may be reference)
  description?: string;
  isReference: boolean;
  referencePath?: string;    // Path of referenced token if isReference
}

// Category for display organization
export interface TokenCategory {
  id: string;
  label: string;
  tokens: ResolvedToken[];
  subcategories?: TokenCategory[];
}

// Parsed and organized tokens ready for display
export interface ParsedTokens {
  colors: {
    core: TokenCategory[];
    semantic: {
      light: TokenCategory[];
      dark: TokenCategory[];
    };
  };
  typography: TokenCategory;
  spacing: TokenCategory;
  radius: TokenCategory;
  borderWidth: TokenCategory;
  effects: TokenCategory;
}

// Type guard to check if a value is a token (has $value)
export function isToken(value: unknown): value is BaseToken {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$value' in value
  );
}

// Type guard to check if a value is a token group
export function isTokenGroup(value: unknown): value is TokenGroup {
  return (
    typeof value === 'object' &&
    value !== null &&
    !('$value' in value) &&
    !Array.isArray(value)
  );
}

// Type guard to check if a value is a token reference
export function isTokenReference(value: unknown): value is string {
  return typeof value === 'string' && /^\{.+\}$/.test(value);
}
