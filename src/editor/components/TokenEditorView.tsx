/**
 * TokenEditorView Component
 * Main view for the token editor with token list and editing panel
 */

import React, { useMemo, useState, useCallback } from 'react';
import type { ResolvedToken } from '../../tokens-studio/types/tokens';
import type { EditableToken, TokenLayer } from '../types/editor';
import { useTokenEditor } from '../hooks/useTokenEditor';
import { useGitHubAuth } from '../hooks/useGitHubAuth';
import { EditorPanel, EditorBackdrop } from './EditorPanel';
import { ValidationIndicator } from './ValidationStatus';
import { ColorSwatch } from './ColorPicker';
import { CreateTokenDialog } from './CreateTokenDialog';
import { AuthButton } from './GitHub/AuthButton';
import { PendingChanges } from './GitHub/PendingChanges';
import { CommitDialog } from './GitHub/CommitDialog';
import { resolvedMapToEditableMap, getTokenSummaryByLayer } from '../utils/tokenConverter';
import { validateToken } from '../utils/tokenValidator';
import { FONT_OPEN_SANS, FONT_THD } from '../../tokens-studio/utils/fonts';
import {
  commitMultipleFiles,
  createBranch,
  createPullRequest,
} from '../../tokens-studio/utils/githubApi';

interface TokenEditorViewProps {
  resolvedTokens: Map<string, ResolvedToken>;
  isDarkMode?: boolean;
  repoOwner?: string;
  repoName?: string;
  originalFiles?: Map<string, string>;
}

export function TokenEditorView({
  resolvedTokens,
  isDarkMode = false,
  repoOwner,
  repoName,
  originalFiles = new Map(),
}: TokenEditorViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [layerFilter, setLayerFilter] = useState<TokenLayer | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitError, setCommitError] = useState<string | null>(null);

  // GitHub authentication
  const gitHubAuth = useGitHubAuth(repoOwner, repoName);

  // Convert ResolvedTokens to EditableTokens
  const allTokens = useMemo(() => {
    return resolvedMapToEditableMap(resolvedTokens);
  }, [resolvedTokens]);

  // Initialize editor hook
  const editor = useTokenEditor({ allTokens });

  // Get token types for filter
  const tokenTypes = useMemo(() => {
    const types = new Set<string>();
    for (const token of allTokens.values()) {
      if (token.$type) {
        types.add(token.$type);
      }
    }
    return Array.from(types).sort();
  }, [allTokens]);

  // Filter tokens
  const filteredTokens = useMemo(() => {
    const tokens: EditableToken[] = [];

    for (const token of allTokens.values()) {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!token.path.toLowerCase().includes(query)) {
          continue;
        }
      }

      // Layer filter
      if (layerFilter !== 'all' && token.layer !== layerFilter) {
        continue;
      }

      // Type filter
      if (typeFilter !== 'all' && token.$type !== typeFilter) {
        continue;
      }

      tokens.push(token);
    }

    // Sort by path
    return tokens.sort((a, b) => a.path.localeCompare(b.path));
  }, [allTokens, searchQuery, layerFilter, typeFilter]);

  // Group by first path segment
  const groupedTokens = useMemo(() => {
    const groups = new Map<string, EditableToken[]>();

    for (const token of filteredTokens) {
      const firstSegment = token.path.split('.')[0];
      const existing = groups.get(firstSegment) || [];
      existing.push(token);
      groups.set(firstSegment, existing);
    }

    return groups;
  }, [filteredTokens]);

  // Get summary
  const summary = useMemo(() => getTokenSummaryByLayer(allTokens), [allTokens]);

  const handleTokenClick = useCallback((token: EditableToken) => {
    editor.selectToken(token);
  }, [editor]);

  // Handle committing changes to GitHub
  const handleCommit = useCallback(async (
    message: string,
    createPR: boolean,
    prTitle?: string
  ) => {
    const auth = gitHubAuth.getAuth();
    if (!auth || !repoOwner || !repoName) {
      setCommitError('Missing authentication or repository information');
      return;
    }

    setIsCommitting(true);
    setCommitError(null);

    try {
      const modifiedFiles = editor.pendingChanges.getModifiedFiles(originalFiles);
      const fileUpdates = modifiedFiles.map(f => ({
        path: f.path,
        content: f.content,
      }));

      if (fileUpdates.length === 0) {
        setCommitError('No changes to commit');
        setIsCommitting(false);
        return;
      }

      if (createPR) {
        // Create branch, commit, then create PR
        const branchName = `token-updates-${Date.now()}`;
        await createBranch(repoOwner, repoName, branchName, 'main', auth);
        await commitMultipleFiles(repoOwner, repoName, fileUpdates, message, auth, branchName);
        const pr = await createPullRequest(
          repoOwner,
          repoName,
          prTitle || 'Update design tokens',
          message,
          branchName,
          'main',
          auth
        );
        console.log('Created PR:', pr.url);
      } else {
        // Direct commit to main
        const result = await commitMultipleFiles(repoOwner, repoName, fileUpdates, message, auth);
        console.log('Committed:', result.url);
      }

      editor.pendingChanges.clearChanges();
      setShowCommitDialog(false);
    } catch (err) {
      setCommitError(err instanceof Error ? err.message : 'Failed to commit changes');
    } finally {
      setIsCommitting(false);
    }
  }, [gitHubAuth, repoOwner, repoName, originalFiles, editor.pendingChanges]);

  const containerStyle: React.CSSProperties = {
    padding: 24,
    fontFamily: FONT_OPEN_SANS,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: 24,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    outline: 'none',
  };

  return (
    <>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: 24,
              fontWeight: 700,
              fontFamily: FONT_THD,
              color: isDarkMode ? '#fbfaf9' : '#252524',
            }}
          >
            Token Editor
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}
          >
            {allTokens.size} tokens ({summary.core} core, {summary.semantic} semantic, {summary.component} component)
            {editor.pendingChanges.changeCount > 0 && (
              <span style={{ color: '#f96302', marginLeft: 12 }}>
                {editor.pendingChanges.changeCount} pending change{editor.pendingChanges.changeCount !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <div style={filtersStyle}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            style={{ ...inputStyle, width: 200 }}
          />

          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value as TokenLayer | 'all')}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="all">All Layers</option>
            <option value="core">Core</option>
            <option value="semantic">Semantic</option>
            <option value="component">Component</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="all">All Types</option>
            {tokenTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <span
            style={{
              fontSize: 13,
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              marginLeft: 'auto',
            }}
          >
            {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
          </span>

          <button
            onClick={() => setShowCreateDialog(true)}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontFamily: FONT_OPEN_SANS,
              fontWeight: 500,
              borderRadius: 6,
              backgroundColor: '#f96302',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Add Token
          </button>

          {/* GitHub Auth Button */}
          <AuthButton
            isAuthenticated={gitHubAuth.isAuthenticated}
            isLoading={gitHubAuth.isLoading}
            user={gitHubAuth.user}
            canWrite={gitHubAuth.canWrite}
            error={gitHubAuth.error}
            onLogin={gitHubAuth.login}
            onLogout={gitHubAuth.logout}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Pending Changes */}
        {editor.pendingChanges.hasChanges && (
          <div style={{ marginBottom: 16 }}>
            <PendingChanges
              changes={editor.pendingChanges.changes}
              onDiscardChange={editor.pendingChanges.removeChange}
              onDiscardAll={editor.pendingChanges.clearChanges}
              onCommit={() => setShowCommitDialog(true)}
              isDarkMode={isDarkMode}
              disabled={!repoOwner || !repoName || isCommitting}
            />
            {!repoOwner && editor.pendingChanges.hasChanges && (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                }}
              >
                Loading tokens from local files. To commit changes, load from a GitHub repository.
              </p>
            )}
          </div>
        )}

        {/* Token list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from(groupedTokens.entries()).map(([group, tokens]) => (
            <TokenGroup
              key={group}
              name={group}
              tokens={tokens}
              allTokens={allTokens}
              selectedPath={editor.selectedToken?.path}
              pendingChanges={editor.pendingChanges}
              onTokenClick={handleTokenClick}
              isDarkMode={isDarkMode}
            />
          ))}

          {filteredTokens.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: isDarkMode ? '#6b7280' : '#9ca3af',
              }}
            >
              No tokens found
            </div>
          )}
        </div>
      </div>

      {/* Editor panel */}
      {editor.isEditing && editor.selectedToken && (
        <>
          <EditorBackdrop
            onClick={() => {
              if (editor.hasUnsavedChanges) {
                if (confirm('You have unsaved changes. Discard them?')) {
                  editor.clearSelection();
                }
              } else {
                editor.clearSelection();
              }
            }}
            isDarkMode={isDarkMode}
          />
          <EditorPanel
            token={editor.selectedToken}
            originalToken={editor.originalToken}
            allTokens={allTokens}
            validation={editor.validation}
            hasUnsavedChanges={editor.hasUnsavedChanges}
            isSaving={editor.isSaving}
            error={editor.error}
            onChange={editor.updateToken}
            onSave={editor.saveToken}
            onDiscard={editor.discardChanges}
            onDelete={editor.deleteToken}
            onClose={editor.clearSelection}
            isDarkMode={isDarkMode}
          />
        </>
      )}

      {/* Create token dialog */}
      {showCreateDialog && (
        <CreateTokenDialog
          allTokens={allTokens}
          onCreateToken={(token) => {
            editor.createToken(token);
            setShowCreateDialog(false);
          }}
          onClose={() => setShowCreateDialog(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Commit dialog */}
      {showCommitDialog && (
        <CommitDialog
          changes={editor.pendingChanges.changes}
          onCommit={handleCommit}
          onClose={() => {
            setShowCommitDialog(false);
            setCommitError(null);
          }}
          isDarkMode={isDarkMode}
          isAuthenticated={gitHubAuth.isAuthenticated}
          username={gitHubAuth.user?.login}
        />
      )}
    </>
  );
}

interface TokenGroupProps {
  name: string;
  tokens: EditableToken[];
  allTokens: Map<string, EditableToken>;
  selectedPath: string | undefined;
  pendingChanges: ReturnType<typeof import('../hooks/usePendingChanges').usePendingChanges>;
  onTokenClick: (token: EditableToken) => void;
  isDarkMode: boolean;
}

function TokenGroup({
  name,
  tokens,
  allTokens,
  selectedPath,
  pendingChanges,
  onTokenClick,
  isDarkMode,
}: TokenGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#252524' : '#ffffff',
        borderRadius: 8,
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f5f2',
          border: 'none',
          borderBottom: isExpanded ? `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` : 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 12, color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#fbfaf9' : '#252524',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 12,
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            marginLeft: 'auto',
          }}
        >
          {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </span>
      </button>

      {isExpanded && (
        <div style={{ padding: 8 }}>
          {tokens.map((token) => (
            <TokenRow
              key={token.path}
              token={token}
              allTokens={allTokens}
              isSelected={token.path === selectedPath}
              hasChanges={pendingChanges.hasChangeForToken(token.path)}
              onClick={() => onTokenClick(token)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TokenRowProps {
  token: EditableToken;
  allTokens: Map<string, EditableToken>;
  isSelected: boolean;
  hasChanges: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

function TokenRow({
  token,
  allTokens,
  isSelected,
  hasChanges,
  onClick,
  isDarkMode,
}: TokenRowProps) {
  const validation = useMemo(() => validateToken(token, allTokens), [token, allTokens]);

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: isSelected
          ? (isDarkMode ? '#2a2a2a' : '#f3f4f6')
          : 'transparent',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* Color preview */}
      {token.$type === 'color' && (
        <ColorSwatch
          color={(token.resolvedValue || token.$value) as string}
          size={24}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Token path */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: 'monospace',
            color: isDarkMode ? '#fbfaf9' : '#252524',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {token.path.split('.').slice(1).join('.')}
        </div>
        <div
          style={{
            fontSize: 11,
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            marginTop: 2,
          }}
        >
          {token.$type || 'unknown'}
        </div>
      </div>

      {/* Value preview */}
      <div
        style={{
          fontSize: 12,
          fontFamily: 'monospace',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          maxWidth: 150,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        title={String(token.$value)}
      >
        {String(token.$value).slice(0, 30)}
        {String(token.$value).length > 30 ? '...' : ''}
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {hasChanges && (
          <span
            style={{
              fontSize: 10,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: '#f96302',
              color: '#ffffff',
            }}
          >
            Changed
          </span>
        )}

        <ValidationIndicator result={validation} isDarkMode={isDarkMode} />

        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: getLayerColor(token.layer, isDarkMode),
            color: '#ffffff',
          }}
        >
          {token.layer}
        </span>
      </div>
    </button>
  );
}

function getLayerColor(layer: TokenLayer, isDarkMode: boolean): string {
  switch (layer) {
    case 'core':
      return isDarkMode ? '#7c3aed' : '#8b5cf6';
    case 'semantic':
      return isDarkMode ? '#2563eb' : '#3b82f6';
    case 'component':
      return isDarkMode ? '#059669' : '#10b981';
  }
}
