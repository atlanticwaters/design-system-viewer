# Claude Code Implementation Plan

## Design Token Authoring Tools

This document provides a step-by-step implementation guide for Claude Code to build and enhance our design token authoring tools. Our scope is limited to the **Design System Viewer/Editor** and **Lint Roller Figma plugin**. The OCM pipeline (tokens-v2, Style Dictionary, Code Connect) is managed separately and we integrate with it as downstream consumers.

---

## Executive Summary

### Our Scope

| Component | Status | Our Responsibility |
|-----------|--------|-------------------|
| **Design System Viewer** | ✅ Complete | Visual token browser and component reference |
| **Token Editor** | 🚧 To Build | Extend Viewer with editing + GitHub integration |
| **Lint Roller** | ✅ Complete | Figma plugin for design linting and auto-fix |

### External Systems (Not Our Scope)

| System | Owner | Our Integration |
|--------|-------|-----------------|
| **OCM Pipeline** | OCM Team | We output DTCG JSON that OCM consumes |
| **tokens-v2** | OCM Team | Validates our token output |
| **Style Dictionary** | OCM Team | Transforms our tokens to platform code |
| **Code Connect** | OCM Team | Links Figma components to generated code |

### Goal

Build authoring tools that produce **OCM-compatible DTCG JSON**, ensuring our output validates successfully in the OCM pipeline.

---

## Project Structure

### Our Codebase

```
aspect-design-system/
├── tokens/                        # DTCG source files (we author these)
│   ├── primitives/                # Core layer
│   ├── semantic/                  # Semantic layer  
│   └── component/                 # Component layer
│
├── design-system-viewer/          # Visual reference ✅
│   ├── src/
│   │   └── App.tsx
│   ├── dist/
│   └── package.json
│
├── editor/                        # 🚧 TO BUILD: Token Editor
│   ├── src/
│   │   ├── components/
│   │   │   ├── TokenEditor/       # Editing components
│   │   │   └── GitHub/            # GitHub integration
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
└── _Figma Plugin/
    └── Lint Roller/               # Figma plugin ✅
        ├── src/
        │   ├── plugin/
        │   ├── ui/
        │   └── shared/
        └── manifest.json
```

---

## Phase 1: Token Editor Foundation

**Objective:** Extend the existing Design System Viewer with token editing capabilities.

**Duration:** 2-3 weeks

### Step 1.1: Project Setup

**Task:** Create the editor as an extension of the existing viewer.

```bash
# Copy viewer as starting point
cp -r design-system-viewer editor

# Update package.json
cd editor
npm pkg set name="@aspect/token-editor"
```

**New files to create:**

```
editor/
├── src/
│   ├── components/
│   │   ├── TokenEditor/
│   │   │   ├── EditorPanel.tsx      # Side panel for editing
│   │   │   ├── TokenForm.tsx        # Form with type-aware inputs
│   │   │   ├── ColorPicker.tsx      # Color input component
│   │   │   ├── ReferenceSelector.tsx # Token reference picker
│   │   │   └── ValidationStatus.tsx  # Inline validation display
│   │   └── GitHub/
│   │       ├── AuthButton.tsx       # GitHub OAuth login
│   │       ├── CommitDialog.tsx     # Commit/PR creation
│   │       └── PendingChanges.tsx   # Staged changes list
│   ├── hooks/
│   │   ├── useGitHubAuth.ts         # OAuth flow
│   │   ├── useTokens.ts             # Token loading/parsing
│   │   ├── useTokenMutation.ts      # Edit operations
│   │   └── usePendingChanges.ts     # Change tracking
│   ├── utils/
│   │   ├── githubApi.ts             # GitHub API wrapper
│   │   ├── tokenValidator.ts        # DTCG validation
│   │   ├── tokenParser.ts           # DTCG parsing
│   │   └── referenceResolver.ts     # {path} resolution
│   └── types/
│       └── editor.ts                # TypeScript definitions
└── package.json
```

### Step 1.2: Token Data Layer

**Task:** Implement token loading and parsing.

```typescript
// editor/src/utils/tokenParser.ts
import type { Token, TokenFile, TokenTree } from '../types/editor';

/**
 * Parse DTCG JSON into structured tokens
 */
export function parseTokenFile(json: string, filePath: string): TokenFile {
  const data = JSON.parse(json);
  const tokens: Token[] = [];
  
  function walk(obj: any, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$')) continue; // Skip DTCG meta properties
      
      if (value && typeof value === 'object' && '$value' in value) {
        // This is a token
        tokens.push({
          path: [...path, key].join('.'),
          $value: value.$value,
          $type: value.$type,
          $description: value.$description,
          filePath,
          layer: getLayerFromPath(filePath),
        });
      } else if (value && typeof value === 'object') {
        // This is a group, recurse
        walk(value, [...path, key]);
      }
    }
  }
  
  walk(data);
  
  return {
    path: filePath,
    tokens,
    raw: data,
  };
}

/**
 * Determine token layer from file path
 */
function getLayerFromPath(filePath: string): 'core' | 'semantic' | 'component' {
  if (filePath.includes('primitives/')) return 'core';
  if (filePath.includes('semantic/')) return 'semantic';
  return 'component';
}

/**
 * Resolve all token references
 */
export function resolveReferences(tokens: Token[]): Map<string, Token> {
  const tokenMap = new Map(tokens.map(t => [t.path, t]));
  
  for (const token of tokens) {
    if (isReference(token.$value)) {
      const refPath = extractReferencePath(token.$value);
      const target = tokenMap.get(refPath);
      
      token.resolvedValue = target 
        ? resolveValue(target, tokenMap)
        : undefined;
      token.referencePath = refPath;
      token.referenceValid = !!target;
    } else {
      token.resolvedValue = token.$value;
    }
  }
  
  return tokenMap;
}

function isReference(value: unknown): boolean {
  return typeof value === 'string' && 
         value.startsWith('{') && 
         value.endsWith('}');
}

function extractReferencePath(ref: string): string {
  return ref.slice(1, -1);
}

function resolveValue(token: Token, tokenMap: Map<string, Token>, visited = new Set<string>()): unknown {
  if (visited.has(token.path)) {
    throw new Error(`Circular reference detected: ${Array.from(visited).join(' -> ')} -> ${token.path}`);
  }
  
  if (!isReference(token.$value)) {
    return token.$value;
  }
  
  visited.add(token.path);
  const refPath = extractReferencePath(token.$value as string);
  const target = tokenMap.get(refPath);
  
  if (!target) return undefined;
  
  return resolveValue(target, tokenMap, visited);
}
```

### Step 1.3: Token Validation

**Task:** Implement validation that matches OCM's rules.

```typescript
// editor/src/utils/tokenValidator.ts
import type { Token, ValidationResult, ValidationIssue } from '../types/editor';

/**
 * Layer reference rules (must match OCM's rules)
 */
const LAYER_RULES = {
  core: {
    canReference: [] as string[],
    allowLiterals: true,
  },
  semantic: {
    canReference: ['core'],
    allowLiterals: false,
  },
  component: {
    canReference: ['semantic', 'core'], // core via allowlist
    allowLiterals: false,
  },
};

/**
 * Validate a single token against DTCG and layer rules
 */
export function validateToken(
  token: Token,
  allTokens: Map<string, Token>
): ValidationResult {
  const issues: ValidationIssue[] = [];
  
  // DTCG Schema validation
  if (token.$value === undefined || token.$value === null) {
    issues.push({
      severity: 'error',
      rule: 'dtcg-schema',
      message: 'Token must have $value property',
    });
  }
  
  if (!token.$type) {
    issues.push({
      severity: 'warning',
      rule: 'dtcg-schema',
      message: 'Token should have $type property',
    });
  }
  
  // Layer rule validation
  const rules = LAYER_RULES[token.layer];
  
  if (isReference(token.$value)) {
    const refPath = extractReferencePath(token.$value as string);
    const refToken = allTokens.get(refPath);
    
    // Check reference exists
    if (!refToken) {
      issues.push({
        severity: 'error',
        rule: 'invalid-reference',
        message: `Referenced token not found: ${refPath}`,
      });
    } else {
      // Check layer rules
      const refLayer = refToken.layer;
      if (!rules.canReference.includes(refLayer)) {
        issues.push({
          severity: 'error',
          rule: 'layer-violation',
          message: `${token.layer} token cannot reference ${refLayer} token. Allowed: ${rules.canReference.join(', ') || 'none'}`,
        });
      }
    }
  } else if (!rules.allowLiterals) {
    issues.push({
      severity: 'warning',
      rule: 'literal-value',
      message: `${token.layer} tokens should use references, not literal values`,
    });
  }
  
  // Naming convention validation
  if (!isValidTokenPath(token.path)) {
    issues.push({
      severity: 'warning',
      rule: 'naming-convention',
      message: 'Token path should use kebab-case segments',
    });
  }
  
  return {
    valid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
  };
}

/**
 * Validate all tokens
 */
export function validateAllTokens(tokens: Token[]): Map<string, ValidationResult> {
  const tokenMap = new Map(tokens.map(t => [t.path, t]));
  const results = new Map<string, ValidationResult>();
  
  for (const token of tokens) {
    results.set(token.path, validateToken(token, tokenMap));
  }
  
  return results;
}

function isReference(value: unknown): boolean {
  return typeof value === 'string' && 
         value.startsWith('{') && 
         value.endsWith('}');
}

function extractReferencePath(ref: string): string {
  return ref.slice(1, -1);
}

function isValidTokenPath(path: string): boolean {
  // Basic kebab-case validation
  return /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$/.test(path);
}
```

### Step 1.4: Editor UI Components

**Task:** Build the token editing interface.

```typescript
// editor/src/components/TokenEditor/EditorPanel.tsx
import { useState, useEffect } from 'react';
import { TokenForm } from './TokenForm';
import { ValidationStatus } from './ValidationStatus';
import { usePendingChanges } from '../../hooks/usePendingChanges';
import { validateToken } from '../../utils/tokenValidator';
import type { Token, ValidationResult } from '../../types/editor';

interface EditorPanelProps {
  token: Token;
  allTokens: Map<string, Token>;
  onSave: (token: Token) => void;
  onCancel: () => void;
}

export function EditorPanel({ token, allTokens, onSave, onCancel }: EditorPanelProps) {
  const [editedToken, setEditedToken] = useState<Token>({ ...token });
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const { addChange } = usePendingChanges();

  // Re-validate on changes
  useEffect(() => {
    const result = validateToken(editedToken, allTokens);
    setValidation(result);
  }, [editedToken, allTokens]);

  const handleSave = () => {
    if (!validation?.valid) return;
    
    addChange({
      type: token.path === editedToken.path ? 'update' : 'rename',
      path: token.path,
      before: token,
      after: editedToken,
    });
    
    onSave(editedToken);
  };

  const hasChanges = JSON.stringify(token) !== JSON.stringify(editedToken);

  return (
    <div className="editor-panel">
      <header className="editor-header">
        <h2>Edit Token</h2>
        <code className="token-path">{token.path}</code>
        <span className={`layer-badge layer-${token.layer}`}>
          {token.layer}
        </span>
      </header>
      
      <TokenForm
        token={editedToken}
        allTokens={allTokens}
        onChange={setEditedToken}
      />
      
      {validation && <ValidationStatus result={validation} />}
      
      <footer className="editor-footer">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={!hasChanges || !validation?.valid}
          className="btn-primary"
        >
          Save Changes
        </button>
      </footer>
    </div>
  );
}
```

```typescript
// editor/src/components/TokenEditor/TokenForm.tsx
import { ColorPicker } from './ColorPicker';
import { ReferenceSelector } from './ReferenceSelector';
import type { Token } from '../../types/editor';

interface TokenFormProps {
  token: Token;
  allTokens: Map<string, Token>;
  onChange: (token: Token) => void;
}

export function TokenForm({ token, allTokens, onChange }: TokenFormProps) {
  const isReference = typeof token.$value === 'string' && 
                      token.$value.startsWith('{');

  const handleValueChange = (value: unknown) => {
    onChange({ ...token, $value: value });
  };

  const handleTypeChange = (type: string) => {
    onChange({ ...token, $type: type as Token['$type'] });
  };

  const handleDescriptionChange = (description: string) => {
    onChange({ ...token, $description: description });
  };

  return (
    <div className="token-form">
      {/* Value input - type-aware */}
      <div className="form-group">
        <label>Value</label>
        
        {isReference ? (
          <ReferenceSelector
            value={token.$value as string}
            allTokens={allTokens}
            allowedLayers={getAllowedLayers(token.layer)}
            onChange={handleValueChange}
          />
        ) : token.$type === 'color' ? (
          <ColorPicker
            value={token.$value as string}
            onChange={handleValueChange}
          />
        ) : token.$type === 'dimension' || token.$type === 'number' ? (
          <input
            type="number"
            value={parseFloat(String(token.$value)) || 0}
            onChange={(e) => handleValueChange(
              token.$type === 'dimension' 
                ? `${e.target.value}px` 
                : parseFloat(e.target.value)
            )}
          />
        ) : (
          <input
            type="text"
            value={String(token.$value)}
            onChange={(e) => handleValueChange(e.target.value)}
          />
        )}
        
        <button 
          className="toggle-reference"
          onClick={() => handleValueChange(
            isReference ? '' : '{}'
          )}
        >
          {isReference ? 'Use Literal' : 'Use Reference'}
        </button>
      </div>

      {/* Type selector */}
      <div className="form-group">
        <label>Type</label>
        <select 
          value={token.$type || ''} 
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="">Select type...</option>
          <option value="color">color</option>
          <option value="dimension">dimension</option>
          <option value="number">number</option>
          <option value="fontFamily">fontFamily</option>
          <option value="fontWeight">fontWeight</option>
          <option value="duration">duration</option>
          <option value="cubicBezier">cubicBezier</option>
        </select>
      </div>

      {/* Description */}
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={token.$description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe what this token is for..."
        />
      </div>

      {/* Preview */}
      {token.$type === 'color' && token.resolvedValue && (
        <div className="form-group">
          <label>Preview</label>
          <div 
            className="color-preview"
            style={{ backgroundColor: token.resolvedValue as string }}
          />
        </div>
      )}
    </div>
  );
}

function getAllowedLayers(layer: Token['layer']): Token['layer'][] {
  switch (layer) {
    case 'core': return [];
    case 'semantic': return ['core'];
    case 'component': return ['semantic', 'core'];
  }
}
```

### Checkpoint 1

- [ ] Token files load and parse correctly
- [ ] Tokens display in viewer with edit buttons
- [ ] Editor panel opens when token selected
- [ ] Type-aware inputs render correctly
- [ ] Reference selector shows valid targets
- [ ] Validation runs and displays inline
- [ ] Changes tracked in pending queue

---

## Phase 2: GitHub Integration

**Objective:** Enable committing token changes directly to GitHub.

**Duration:** 1-2 weeks

### Step 2.1: GitHub OAuth

**Task:** Implement GitHub authentication flow.

```typescript
// editor/src/hooks/useGitHubAuth.ts
import { useState, useEffect, useCallback } from 'react';

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
}

interface AuthState {
  user: GitHubUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const STORAGE_KEY = 'github_token';

export function useGitHubAuth(): AuthState {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);

  // Fetch user on token change
  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Exchange code for token via your backend
      exchangeCodeForToken(code)
        .then(newToken => {
          localStorage.setItem(STORAGE_KEY, newToken);
          setToken(newToken);
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname);
        })
        .catch(console.error);
    }
  }, []);

  const login = useCallback(() => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}${window.location.pathname}`;
    const scope = 'repo';
    
    window.location.href = 
      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  };
}

async function exchangeCodeForToken(code: string): Promise<string> {
  // This needs a backend endpoint to exchange the code
  // GitHub doesn't allow client-side token exchange for security
  const response = await fetch('/api/github/oauth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) throw new Error('Token exchange failed');
  
  const data = await response.json();
  return data.access_token;
}
```

### Step 2.2: GitHub API Wrapper

**Task:** Implement file operations via GitHub API.

```typescript
// editor/src/utils/githubApi.ts

interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
}

const config: GitHubConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER,
  repo: import.meta.env.VITE_GITHUB_REPO,
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
};

/**
 * Fetch file content from GitHub
 */
export async function fetchFile(
  path: string,
  token: string
): Promise<{ content: string; sha: string }> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  const content = atob(data.content);
  
  return { content, sha: data.sha };
}

/**
 * Commit changes to GitHub
 */
export async function commitChanges(
  changes: FileChange[],
  message: string,
  token: string
): Promise<void> {
  // Get current commit SHA
  const refResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const refData = await refResponse.json();
  const baseSha = refData.object.sha;

  // Get base tree
  const commitResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/commits/${baseSha}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const commitData = await commitResponse.json();
  const baseTreeSha = commitData.tree.sha;

  // Create blobs for changed files
  const tree = await Promise.all(
    changes.map(async (change) => {
      const blobResponse = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}/git/blobs`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: change.content,
            encoding: 'utf-8',
          }),
        }
      );
      const blobData = await blobResponse.json();

      return {
        path: change.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: blobData.sha,
      };
    })
  );

  // Create new tree
  const treeResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/trees`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree,
      }),
    }
  );
  const treeData = await treeResponse.json();

  // Create commit
  const newCommitResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/commits`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        tree: treeData.sha,
        parents: [baseSha],
      }),
    }
  );
  const newCommitData = await newCommitResponse.json();

  // Update ref
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sha: newCommitData.sha,
      }),
    }
  );
}

/**
 * Create a pull request
 */
export async function createPullRequest(
  changes: FileChange[],
  title: string,
  body: string,
  token: string
): Promise<string> {
  // Create a new branch
  const branchName = `token-update-${Date.now()}`;
  
  // Get main branch SHA
  const refResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs/heads/${config.branch}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const refData = await refResponse.json();

  // Create new branch
  await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/git/refs`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: refData.object.sha,
      }),
    }
  );

  // Commit changes to new branch (similar to commitChanges but to branchName)
  // ... (implementation similar to above)

  // Create PR
  const prResponse = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        head: branchName,
        base: config.branch,
      }),
    }
  );
  const prData = await prResponse.json();

  return prData.html_url;
}

interface FileChange {
  path: string;
  content: string;
}
```

### Step 2.3: Commit Dialog

**Task:** Build the commit/PR creation UI.

```typescript
// editor/src/components/GitHub/CommitDialog.tsx
import { useState } from 'react';
import { usePendingChanges } from '../../hooks/usePendingChanges';
import { useGitHubAuth } from '../../hooks/useGitHubAuth';
import { commitChanges, createPullRequest } from '../../utils/githubApi';
import { serializeTokenFile } from '../../utils/tokenSerializer';

interface CommitDialogProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CommitDialog({ onClose, onSuccess }: CommitDialogProps) {
  const { changes, clearChanges, getModifiedFiles } = usePendingChanges();
  const { token } = useGitHubAuth();
  
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'commit' | 'pr'>('commit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileChanges = getModifiedFiles();

  const handleSubmit = async () => {
    if (!token || !message.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const serializedChanges = fileChanges.map(file => ({
        path: file.path,
        content: serializeTokenFile(file.tokens),
      }));

      if (mode === 'commit') {
        await commitChanges(serializedChanges, message, token);
      } else {
        const prUrl = await createPullRequest(
          serializedChanges,
          message,
          generatePRBody(changes),
          token
        );
        window.open(prUrl, '_blank');
      }
      
      clearChanges();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Commit failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog open className="commit-dialog">
      <h2>Commit {changes.length} Change{changes.length !== 1 ? 's' : ''}</h2>
      
      <div className="changes-summary">
        <h3>Modified Files</h3>
        {fileChanges.map(file => (
          <div key={file.path} className="file-change">
            <code>{file.path}</code>
            <span className="change-count">
              {file.changeCount} token{file.changeCount !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>
      
      <div className="changes-detail">
        <h3>Changes</h3>
        {changes.map((change, i) => (
          <div key={i} className="change-item">
            <span className={`badge badge-${change.type}`}>
              {change.type}
            </span>
            <code>{change.path}</code>
          </div>
        ))}
      </div>
      
      <div className="mode-selector">
        <label>
          <input
            type="radio"
            checked={mode === 'commit'}
            onChange={() => setMode('commit')}
          />
          Direct commit to main
        </label>
        <label>
          <input
            type="radio"
            checked={mode === 'pr'}
            onChange={() => setMode('pr')}
          />
          Create pull request
        </label>
      </div>
      
      <div className="form-group">
        <label>
          {mode === 'commit' ? 'Commit message' : 'PR title'}
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={mode === 'commit' 
            ? 'chore(tokens): update button colors' 
            : 'Update button token colors'
          }
        />
      </div>
      
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      <footer>
        <button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isSubmitting}
          className="btn-primary"
        >
          {isSubmitting 
            ? 'Submitting...' 
            : mode === 'commit' 
              ? 'Commit' 
              : 'Create PR'
          }
        </button>
      </footer>
    </dialog>
  );
}

function generatePRBody(changes: Change[]): string {
  return `## Token Changes

${changes.map(c => `- **${c.type}** \`${c.path}\``).join('\n')}

---
*Created via Token Editor*
`;
}
```

### Checkpoint 2

- [ ] GitHub OAuth flow works
- [ ] User can sign in/out
- [ ] Changes serialize correctly to JSON
- [ ] Direct commit to main works
- [ ] PR creation works
- [ ] Success/error states handled

---

## Phase 3: OCM Compatibility Testing

**Objective:** Ensure our output validates successfully with OCM.

**Duration:** 1 week

### Step 3.1: Validation Parity

**Task:** Verify our validation matches OCM's rules.

```typescript
// editor/src/utils/__tests__/tokenValidator.test.ts
import { describe, it, expect } from 'vitest';
import { validateToken, validateAllTokens } from '../tokenValidator';

describe('Token Validation (OCM Parity)', () => {
  describe('Layer Rules', () => {
    it('rejects semantic token referencing another semantic token', () => {
      const tokens = [
        { path: 'color.text.primary', $value: '{color.action.primary}', $type: 'color', layer: 'semantic' },
        { path: 'color.action.primary', $value: '{system.color.brand.300}', $type: 'color', layer: 'semantic' },
      ];
      
      const tokenMap = new Map(tokens.map(t => [t.path, t]));
      const result = validateToken(tokens[0], tokenMap);
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({ rule: 'layer-violation' })
      );
    });
    
    it('allows semantic token referencing core token', () => {
      const tokens = [
        { path: 'color.text.primary', $value: '{system.color.greige.900}', $type: 'color', layer: 'semantic' },
        { path: 'system.color.greige.900', $value: '#252524', $type: 'color', layer: 'core' },
      ];
      
      const tokenMap = new Map(tokens.map(t => [t.path, t]));
      const result = validateToken(tokens[0], tokenMap);
      
      expect(result.valid).toBe(true);
    });
    
    it('allows component token referencing semantic token', () => {
      const tokens = [
        { path: 'button.background.primary', $value: '{color.action.primary}', $type: 'color', layer: 'component' },
        { path: 'color.action.primary', $value: '{system.color.brand.300}', $type: 'color', layer: 'semantic' },
      ];
      
      const tokenMap = new Map(tokens.map(t => [t.path, t]));
      const result = validateToken(tokens[0], tokenMap);
      
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Reference Validation', () => {
    it('detects invalid references', () => {
      const tokens = [
        { path: 'color.text.primary', $value: '{nonexistent.token}', $type: 'color', layer: 'semantic' },
      ];
      
      const tokenMap = new Map(tokens.map(t => [t.path, t]));
      const result = validateToken(tokens[0], tokenMap);
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({ rule: 'invalid-reference' })
      );
    });
    
    it('detects circular references', () => {
      // Circular reference detection happens in resolveReferences
      // This test would go in tokenParser.test.ts
    });
  });
  
  describe('DTCG Compliance', () => {
    it('requires $value property', () => {
      const token = { path: 'color.test', $type: 'color', layer: 'core' };
      const result = validateToken(token as any, new Map());
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({ rule: 'dtcg-schema' })
      );
    });
  });
});
```

### Step 3.2: Integration Testing

**Task:** Test full workflow with OCM tools (if available locally).

```bash
# Test workflow
# 1. Make changes in Token Editor
# 2. Commit to test branch
# 3. Run OCM validation
npm run tokens-v2:validate

# 4. Check for validation errors
# 5. If errors, adjust our validation rules to match
```

### Checkpoint 3

- [ ] Our validation rules match OCM's rules
- [ ] Test tokens validate successfully with OCM
- [ ] Layer violations caught before commit
- [ ] Reference errors caught before commit
- [ ] DTCG schema violations caught before commit

---

## Phase 4: Lint Roller Enhancements

**Objective:** Improve Lint Roller integration with the token workflow.

**Duration:** 1 week (as needed)

### Potential Enhancements

1. **Token Source Sync** — Button to refresh tokens from GitHub Pages
2. **Validation Alignment** — Ensure suggestions follow the same layer rules
3. **Better Error Messages** — When OCM validation fails, help users understand why

These enhancements are optional and depend on user feedback.

---

## Deployment

### Token Editor

```bash
# Build
cd editor
npm run build

# Deploy to GitHub Pages
# Add to existing workflow or create new one
```

### Environment Variables

```env
# Token Editor
VITE_GITHUB_OWNER=aspect-build
VITE_GITHUB_REPO=aspect-design-system
VITE_GITHUB_BRANCH=main
VITE_GITHUB_CLIENT_ID=your-oauth-client-id
```

---

## Success Criteria

### Token Editor

- [ ] Users can view all tokens visually
- [ ] Users can edit token values with type-aware inputs
- [ ] Users can select references from valid tokens only
- [ ] Validation runs in real-time matching OCM rules
- [ ] Users can commit changes directly to GitHub
- [ ] Users can create PRs for review
- [ ] Changes pass OCM validation after commit

### Lint Roller

- [ ] Continues to work with deployed tokens
- [ ] Suggestions are compatible with OCM layer rules
- [ ] Auto-fix produces valid token bindings

### OCM Compatibility

- [ ] All tokens authored via Editor pass OCM validation
- [ ] Layer rules enforced match OCM exactly
- [ ] Reference validation matches OCM exactly
- [ ] DTCG compliance matches OCM exactly

---

## Appendix

### OCM Layer Rules Reference

These rules must be enforced in our Token Editor to ensure compatibility:

| Layer | Can Reference | Hardcoded Values |
|-------|---------------|------------------|
| Core (primitives/) | Nothing | ✅ Allowed |
| Semantic (semantic/) | Core only | ❌ Not allowed |
| Component (component/) | Semantic (preferred), Core (allowlisted) | ❌ Not allowed |

### DTCG Token Format

```json
{
  "token-name": {
    "$value": "value or {reference}",
    "$type": "color | dimension | number | ...",
    "$description": "Optional description"
  }
}
```

### File Naming

| Layer | Directory | Example |
|-------|-----------|---------|
| Core | `tokens/primitives/` | `tokens/primitives/colors.json` |
| Semantic | `tokens/semantic/` | `tokens/semantic/light.json` |
| Component | `tokens/component/` | `tokens/component/button.json` |
