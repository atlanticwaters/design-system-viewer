/**
 * CommitDialog Component
 * Dialog for committing token changes to GitHub
 */

import React, { useState, useCallback } from 'react';
import type { TokenChange } from '../../types/editor';
import { FONT_OPEN_SANS, FONT_THD } from '../../../tokens-studio/utils/fonts';

interface CommitDialogProps {
  changes: TokenChange[];
  onCommit: (message: string, createPR: boolean, prTitle?: string) => Promise<void>;
  onClose: () => void;
  isDarkMode?: boolean;
  isAuthenticated: boolean;
  username?: string;
}

export function CommitDialog({
  changes,
  onCommit,
  onClose,
  isDarkMode = false,
  isAuthenticated,
  username,
}: CommitDialogProps) {
  const [commitMessage, setCommitMessage] = useState(() => {
    // Generate default commit message based on changes
    const added = changes.filter(c => c.type === 'create').length;
    const modified = changes.filter(c => c.type === 'update').length;
    const deleted = changes.filter(c => c.type === 'delete').length;

    const parts: string[] = [];
    if (added > 0) parts.push(`add ${added} token${added > 1 ? 's' : ''}`);
    if (modified > 0) parts.push(`update ${modified} token${modified > 1 ? 's' : ''}`);
    if (deleted > 0) parts.push(`remove ${deleted} token${deleted > 1 ? 's' : ''}`);

    return `chore(tokens): ${parts.join(', ')}`;
  });

  const [createPR, setCreatePR] = useState(false);
  const [prTitle, setPrTitle] = useState('Update design tokens');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commitMessage.trim()) {
      setError('Commit message is required');
      return;
    }

    if (createPR && !prTitle.trim()) {
      setError('PR title is required when creating a pull request');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCommit(commitMessage, createPR, createPR ? prTitle : undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to commit changes');
      setIsSubmitting(false);
    }
  }, [commitMessage, createPR, prTitle, onCommit]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const dialogStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderRadius: 12,
    width: 500,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  };

  const headerStyle: React.CSSProperties = {
    padding: '20px 24px',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const contentStyle: React.CSSProperties = {
    padding: 24,
    overflow: 'auto',
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#252524' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    outline: 'none',
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 500,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: FONT_THD,
              color: isDarkMode ? '#fbfaf9' : '#252524',
            }}
          >
            Commit Changes
          </h2>
          {isAuthenticated && username && (
            <p
              style={{
                margin: '8px 0 0',
                fontSize: 13,
                fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#9ca3af' : '#6b7280',
              }}
            >
              Committing as <strong>{username}</strong>
            </p>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div style={contentStyle}>
            {/* Changes summary */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  margin: '0 0 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Changes ({changes.length})
              </h3>
              <div
                style={{
                  maxHeight: 150,
                  overflow: 'auto',
                  backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                {changes.map((change, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 0',
                      fontSize: 13,
                      fontFamily: 'monospace',
                      color: isDarkMode ? '#fbfaf9' : '#252524',
                      borderBottom: i < changes.length - 1
                        ? `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`
                        : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: getChangeColor(change.type, isDarkMode),
                        color: '#ffffff',
                      }}
                    >
                      {getChangeIcon(change.type)}
                    </span>
                    <span>{change.path}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commit message */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#9ca3af' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Commit Message
              </label>
              <textarea
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                disabled={isSubmitting}
                placeholder="Describe your changes..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 80,
                }}
              />
            </div>

            {/* Create PR checkbox */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontFamily: FONT_OPEN_SANS,
                  color: isDarkMode ? '#fbfaf9' : '#252524',
                }}
              >
                <input
                  type="checkbox"
                  checked={createPR}
                  onChange={e => setCreatePR(e.target.checked)}
                  disabled={isSubmitting}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: 'pointer',
                  }}
                />
                Create a Pull Request instead of direct commit
              </label>
            </div>

            {/* PR Title (conditional) */}
            {createPR && (
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: FONT_OPEN_SANS,
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Pull Request Title
                </label>
                <input
                  type="text"
                  value={prTitle}
                  onChange={e => setPrTitle(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter PR title..."
                  style={inputStyle}
                />
              </div>
            )}

            {/* Error message */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 6,
                  backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
                  color: isDarkMode ? '#fca5a5' : '#dc2626',
                  fontSize: 13,
                  fontFamily: FONT_OPEN_SANS,
                }}
              >
                {error}
              </div>
            )}

            {/* Not authenticated warning */}
            {!isAuthenticated && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 6,
                  backgroundColor: isDarkMode ? '#422006' : '#fffbeb',
                  color: isDarkMode ? '#fcd34d' : '#d97706',
                  fontSize: 13,
                  fontFamily: FONT_OPEN_SANS,
                }}
              >
                You need to authenticate with GitHub to commit changes.
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                ...buttonBaseStyle,
                backgroundColor: 'transparent',
                color: isDarkMode ? '#fbfaf9' : '#252524',
                border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              style={{
                ...buttonBaseStyle,
                backgroundColor: '#f96302',
                color: '#ffffff',
                border: 'none',
                opacity: (isSubmitting || !isAuthenticated) ? 0.5 : 1,
                cursor: (isSubmitting || !isAuthenticated) ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting
                ? 'Committing...'
                : createPR
                  ? 'Create Pull Request'
                  : 'Commit Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getChangeColor(type: TokenChange['type'], isDarkMode: boolean): string {
  switch (type) {
    case 'create':
      return isDarkMode ? '#22c55e' : '#16a34a';
    case 'update':
      return isDarkMode ? '#3b82f6' : '#2563eb';
    case 'delete':
      return isDarkMode ? '#ef4444' : '#dc2626';
    case 'rename':
      return isDarkMode ? '#a855f7' : '#9333ea';
    default:
      return isDarkMode ? '#6b7280' : '#9ca3af';
  }
}

function getChangeIcon(type: TokenChange['type']): string {
  switch (type) {
    case 'create':
      return '+';
    case 'update':
      return '~';
    case 'delete':
      return '-';
    case 'rename':
      return '→';
    default:
      return '?';
  }
}
