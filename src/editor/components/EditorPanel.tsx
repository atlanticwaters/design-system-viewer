/**
 * EditorPanel Component
 * Side panel for editing a selected token
 */

import React, { useState, useMemo } from 'react';
import type { EditableToken, ValidationResult } from '../types/editor';
import { TokenForm } from './TokenForm';
import { ValidationStatus } from './ValidationStatus';
import { ImpactAnalysis } from './ImpactAnalysis';
import { analyzeDeletionImpact } from '../utils/tokenValidator';
import { FONT_OPEN_SANS, FONT_THD } from '../../tokens-studio/utils/fonts';

interface EditorPanelProps {
  // The token being edited
  token: EditableToken;
  // Original token before edits
  originalToken: EditableToken | null;
  // All tokens for reference resolution
  allTokens: Map<string, EditableToken>;
  // Validation result
  validation: ValidationResult | null;
  // Whether there are unsaved changes
  hasUnsavedChanges: boolean;
  // Whether save is in progress
  isSaving: boolean;
  // Error message
  error: string | null;
  // Callbacks
  onChange: (updates: Partial<EditableToken>) => void;
  onSave: () => void;
  onDiscard: () => void;
  onDelete: () => void;
  onClose: () => void;
  // Theme
  isDarkMode?: boolean;
}

export function EditorPanel({
  token,
  originalToken: _originalToken,
  allTokens,
  validation,
  hasUnsavedChanges,
  isSaving,
  error,
  onChange,
  onSave,
  onDiscard,
  onDelete,
  onClose,
  isDarkMode = false,
}: EditorPanelProps) {
  // Delete confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Analyze deletion impact
  const deletionImpact = useMemo(() => {
    return analyzeDeletionImpact(token.path, allTokens);
  }, [token.path, allTokens]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && validation?.valid) {
          onSave();
        }
      }
      // Escape to close
      if (e.key === 'Escape') {
        if (hasUnsavedChanges) {
          // Prompt before closing
          if (confirm('You have unsaved changes. Discard them?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, validation, onSave, onClose]);

  const containerStyle: React.CSSProperties = {
    width: 400,
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderLeft: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 200,
    boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    padding: 20,
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
    display: 'flex',
    gap: 12,
    justifyContent: 'space-between',
  };

  const buttonBaseStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 500,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: '#f96302',
    color: '#ffffff',
    border: 'none',
    opacity: (!hasUnsavedChanges || !validation?.valid || isSaving) ? 0.5 : 1,
    cursor: (!hasUnsavedChanges || !validation?.valid || isSaving) ? 'not-allowed' : 'pointer',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
  };

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonBaseStyle,
    backgroundColor: 'transparent',
    color: isDarkMode ? '#ef4444' : '#dc2626',
    border: `1px solid ${isDarkMode ? '#7f1d1d' : '#fecaca'}`,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                fontFamily: FONT_THD,
                color: isDarkMode ? '#fbfaf9' : '#252524',
              }}
            >
              Edit Token
            </h2>
            {hasUnsavedChanges && (
              <span
                style={{
                  fontSize: 12,
                  color: '#f96302',
                  fontFamily: FONT_OPEN_SANS,
                }}
              >
                Unsaved changes
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
            }}
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        {/* Token path */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <code
            style={{
              fontSize: 14,
              fontFamily: 'monospace',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
              padding: '4px 8px',
              borderRadius: 4,
            }}
          >
            {token.path}
          </code>

          <span
            style={{
              fontSize: 11,
              fontFamily: FONT_OPEN_SANS,
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: getLayerColor(token.layer, isDarkMode),
              padding: '3px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
            }}
          >
            {token.layer}
          </span>
        </div>

        {/* File path */}
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#6b7280' : '#9ca3af',
          }}
        >
          {token.filePath}
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* Error message */}
        {error && (
          <div
            style={{
              marginBottom: 16,
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

        {/* Token form */}
        <TokenForm
          token={token}
          allTokens={allTokens}
          onChange={onChange}
          isDarkMode={isDarkMode}
          disabled={isSaving}
        />

        {/* Validation status */}
        <ValidationStatus result={validation} isDarkMode={isDarkMode} />

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div style={{ marginTop: 16 }}>
            <h4
              style={{
                margin: '0 0 12px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#ef4444' : '#dc2626',
              }}
            >
              Confirm Deletion
            </h4>
            <ImpactAnalysis impact={deletionImpact} isDarkMode={isDarkMode} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete();
                }}
                style={{
                  ...dangerButtonStyle,
                  backgroundColor: isDarkMode ? '#dc2626' : '#ef4444',
                  color: '#ffffff',
                }}
              >
                {deletionImpact.wouldBreakTokens ? 'Delete Anyway' : 'Delete Token'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSaving || showDeleteConfirm}
            style={{
              ...dangerButtonStyle,
              opacity: (isSaving || showDeleteConfirm) ? 0.5 : 1,
              cursor: (isSaving || showDeleteConfirm) ? 'not-allowed' : 'pointer',
            }}
          >
            Delete
            {deletionImpact.affectedCount > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  padding: '1px 5px',
                  borderRadius: 8,
                  backgroundColor: isDarkMode ? '#7f1d1d' : '#fecaca',
                  color: isDarkMode ? '#fca5a5' : '#dc2626',
                  fontSize: 11,
                }}
              >
                {deletionImpact.affectedCount}
              </span>
            )}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onDiscard}
            disabled={!hasUnsavedChanges || isSaving}
            style={{
              ...secondaryButtonStyle,
              opacity: (!hasUnsavedChanges || isSaving) ? 0.5 : 1,
              cursor: (!hasUnsavedChanges || isSaving) ? 'not-allowed' : 'pointer',
            }}
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={!hasUnsavedChanges || !validation?.valid || isSaving}
            style={primaryButtonStyle}
            title={!validation?.valid ? 'Fix validation errors first' : 'Save changes (⌘S)'}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function getLayerColor(layer: string, isDarkMode: boolean): string {
  switch (layer) {
    case 'core':
      return isDarkMode ? '#7c3aed' : '#8b5cf6';
    case 'semantic':
      return isDarkMode ? '#2563eb' : '#3b82f6';
    case 'component':
      return isDarkMode ? '#059669' : '#10b981';
    default:
      return isDarkMode ? '#6b7280' : '#9ca3af';
  }
}

/**
 * Backdrop component for the editor panel
 */
export function EditorBackdrop({
  onClick,
  isDarkMode = false,
}: {
  onClick: () => void;
  isDarkMode?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 400, // Leave room for panel
        bottom: 0,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)',
        zIndex: 199,
      }}
    />
  );
}
