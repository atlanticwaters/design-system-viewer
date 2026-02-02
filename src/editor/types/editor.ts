/**
 * Editor Types
 * TypeScript definitions for the Token Editor
 */

// Token type values from DTCG specification
export type TokenType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'shadow'
  | 'gradient'
  | 'typography'
  | 'border'
  | 'transition';

// Token layers following OCM architecture
export type TokenLayer = 'core' | 'semantic' | 'component';

// A single editable token
export interface EditableToken {
  // Full dot-notation path (e.g., "color.text.primary")
  path: string;
  // Token value (literal or reference like "{color.brand.300}")
  $value: unknown;
  // Token type from DTCG spec
  $type?: TokenType;
  // Optional description
  $description?: string;
  // Source file path (e.g., "tokens/semantic/light.json")
  filePath: string;
  // Determined layer based on file path
  layer: TokenLayer;
  // Resolved value (if $value is a reference)
  resolvedValue?: unknown;
  // Referenced token path (extracted from {path})
  referencePath?: string;
  // Whether the reference is valid
  referenceValid?: boolean;
}

// Validation issue severity levels
export type ValidationSeverity = 'error' | 'warning' | 'info';

// Validation rule identifiers
export type ValidationRule =
  | 'dtcg-schema'         // Missing $value or $type
  | 'invalid-reference'   // Reference to non-existent token
  | 'layer-violation'     // Semantic referencing semantic, etc.
  | 'circular-reference'  // Token references itself
  | 'literal-value'       // Literal where reference expected
  | 'naming-convention';  // Invalid token path format

// A single validation issue
export interface ValidationIssue {
  severity: ValidationSeverity;
  rule: ValidationRule;
  message: string;
  // Optional suggestion for fixing
  suggestion?: string;
}

// Result of validating a token
export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

// Change types for tracking edits
export type ChangeType = 'create' | 'update' | 'delete' | 'rename';

// A pending change to be committed
export interface TokenChange {
  type: ChangeType;
  // Token path (original path if renamed)
  path: string;
  // New path if renamed
  newPath?: string;
  // Token state before change (for update/delete)
  before?: EditableToken;
  // Token state after change (for create/update)
  after?: EditableToken;
  // File that was modified
  filePath: string;
  // Timestamp of change
  timestamp: number;
}

// A file that has been modified
export interface ModifiedFile {
  path: string;
  // Number of token changes in this file
  changeCount: number;
  // Raw content after applying changes
  content: string;
  // SHA from GitHub (needed for updates)
  sha?: string;
}

// Editor state
export interface EditorState {
  // Currently selected token for editing
  selectedToken: EditableToken | null;
  // Whether editor panel is open
  isEditing: boolean;
  // All pending changes
  pendingChanges: TokenChange[];
  // Validation results for current token
  validation: ValidationResult | null;
  // Whether save is in progress
  isSaving: boolean;
  // Last error message
  error: string | null;
}

// Layer rule configuration
export interface LayerRuleConfig {
  // Which layers this layer can reference
  canReference: TokenLayer[];
  // Whether literal values are allowed
  allowLiterals: boolean;
}

// All layer rules
export type LayerRules = Record<TokenLayer, LayerRuleConfig>;

// GitHub authentication state
export interface GitHubAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: GitHubUser | null;
  token: string | null;
}

// GitHub user info
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

// Commit options
export interface CommitOptions {
  message: string;
  branch?: string;
  createPR?: boolean;
  prTitle?: string;
  prBody?: string;
}

// Commit result
export interface CommitResult {
  success: boolean;
  sha?: string;
  url?: string;
  prUrl?: string;
  error?: string;
}
