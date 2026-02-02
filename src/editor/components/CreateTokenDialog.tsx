/**
 * CreateTokenDialog Component
 * Dialog for creating a new token
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { EditableToken, TokenLayer, TokenType } from '../types/editor';
import { validateToken } from '../utils/tokenValidator';
import { getLayerFromPath, LAYER_RULES } from '../utils/layerRules';
import { ValidationStatus } from './ValidationStatus';
import { ColorPicker } from './ColorPicker';
import { ReferenceSelector } from './ReferenceSelector';
import { FONT_OPEN_SANS, FONT_THD } from '../../tokens-studio/utils/fonts';

interface CreateTokenDialogProps {
  allTokens: Map<string, EditableToken>;
  onCreateToken: (token: EditableToken) => void;
  onClose: () => void;
  isDarkMode?: boolean;
  suggestedLayer?: TokenLayer;
  suggestedPath?: string;
}

const TOKEN_TYPES: TokenType[] = [
  'color',
  'dimension',
  'number',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'shadow',
  'border',
  'typography',
];

export function CreateTokenDialog({
  allTokens,
  onCreateToken,
  onClose,
  isDarkMode = false,
  suggestedLayer,
  suggestedPath = '',
}: CreateTokenDialogProps) {
  const [path, setPath] = useState(suggestedPath);
  const [type, setType] = useState<TokenType | ''>('color');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [useReference, setUseReference] = useState(false);

  // Derive layer from path
  const layer = useMemo((): TokenLayer => {
    if (suggestedLayer) return suggestedLayer;
    return getLayerFromPath(path) || 'core';
  }, [path, suggestedLayer]);

  // Derive file path from layer and token path
  const filePath = useMemo(() => {
    const firstSegment = path.split('.')[0];
    switch (layer) {
      case 'core':
        return `tokens/core/${firstSegment || 'colors'}.json`;
      case 'semantic':
        return `tokens/semantic/${firstSegment || 'light'}.json`;
      case 'component':
        return `tokens/component/${firstSegment || 'button'}.json`;
    }
  }, [layer, path]);

  // Create a preview token for validation
  const previewToken = useMemo((): EditableToken => ({
    path,
    $value: value,
    $type: type || undefined,
    $description: description || undefined,
    layer,
    filePath,
    resolvedValue: undefined,
  }), [path, value, type, description, layer, filePath]);

  // Validate the token
  const validation = useMemo(() => {
    if (!path) return null;
    return validateToken(previewToken, allTokens);
  }, [previewToken, allTokens, path]);

  // Check if path already exists
  const pathExists = useMemo(() => allTokens.has(path), [allTokens, path]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!path || !value) return;
    if (pathExists) return;
    if (validation && !validation.valid) return;

    onCreateToken(previewToken);
  }, [path, value, pathExists, validation, previewToken, onCreateToken]);

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
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: 20,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 500,
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const canCreate = path && value && !pathExists && (!validation || validation.valid);
  const layerRules = LAYER_RULES[layer];

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
            Create New Token
          </h2>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 13,
              fontFamily: FONT_OPEN_SANS,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}
          >
            Create a DTCG-compliant token with validation
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div style={contentStyle}>
            {/* Path */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Token Path *</label>
              <input
                type="text"
                value={path}
                onChange={e => setPath(e.target.value)}
                placeholder="e.g., color.text.primary"
                style={{
                  ...inputStyle,
                  fontFamily: 'monospace',
                  borderColor: pathExists
                    ? (isDarkMode ? '#ef4444' : '#dc2626')
                    : (isDarkMode ? '#4a4a4a' : '#d1d5db'),
                }}
              />
              {pathExists && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: isDarkMode ? '#ef4444' : '#dc2626' }}>
                  A token with this path already exists
                </p>
              )}
              <p style={{ margin: '8px 0 0', fontSize: 11, color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                Layer detected: <strong style={{ color: getLayerColor(layer, isDarkMode) }}>{layer}</strong>
                {' '}— File: {filePath}
              </p>
            </div>

            {/* Type */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as TokenType)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select type...</option>
                {TOKEN_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div style={formGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Value *</label>
                {layer !== 'core' && (
                  <button
                    type="button"
                    onClick={() => {
                      setUseReference(!useReference);
                      setValue('');
                    }}
                    style={{
                      padding: '4px 10px',
                      fontSize: 11,
                      fontFamily: FONT_OPEN_SANS,
                      borderRadius: 4,
                      border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
                      backgroundColor: useReference
                        ? (isDarkMode ? '#f96302' : '#252524')
                        : 'transparent',
                      color: useReference
                        ? '#ffffff'
                        : (isDarkMode ? '#9ca3af' : '#6b7280'),
                      cursor: 'pointer',
                    }}
                  >
                    {useReference ? 'Using Reference' : 'Use Reference'}
                  </button>
                )}
              </div>

              {!layerRules.allowLiterals && !useReference && (
                <p style={{ margin: '0 0 8px', fontSize: 12, color: isDarkMode ? '#fbbf24' : '#d97706' }}>
                  Note: {layer} layer should use references, not literal values
                </p>
              )}

              {useReference ? (
                <ReferenceSelector
                  value={value}
                  onChange={v => setValue(v)}
                  allTokens={allTokens}
                  sourceLayer={layer}
                  expectedType={type || undefined}
                  isDarkMode={isDarkMode}
                />
              ) : type === 'color' ? (
                <ColorPicker
                  value={value}
                  onChange={v => setValue(v)}
                  isDarkMode={isDarkMode}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder={getPlaceholder(type as TokenType)}
                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                />
              )}
            </div>

            {/* Description */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this token is for..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 60,
                }}
              />
            </div>

            {/* Validation */}
            {path && validation && (
              <ValidationStatus result={validation} isDarkMode={isDarkMode} />
            )}
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <button
              type="button"
              onClick={onClose}
              style={{
                ...buttonStyle,
                backgroundColor: 'transparent',
                color: isDarkMode ? '#fbfaf9' : '#252524',
                border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canCreate}
              style={{
                ...buttonStyle,
                backgroundColor: '#f96302',
                color: '#ffffff',
                border: 'none',
                opacity: canCreate ? 1 : 0.5,
                cursor: canCreate ? 'pointer' : 'not-allowed',
              }}
            >
              Create Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getPlaceholder(type: TokenType | ''): string {
  switch (type) {
    case 'color':
      return '#000000';
    case 'dimension':
      return '16px';
    case 'number':
      return '1';
    case 'fontFamily':
      return '"Open Sans", sans-serif';
    case 'fontWeight':
      return '400';
    case 'duration':
      return '200ms';
    case 'cubicBezier':
      return '[0.4, 0, 0.2, 1]';
    default:
      return 'Enter value...';
  }
}

function getLayerColor(layer: TokenLayer, isDarkMode: boolean): string {
  switch (layer) {
    case 'core':
      return isDarkMode ? '#a78bfa' : '#7c3aed';
    case 'semantic':
      return isDarkMode ? '#60a5fa' : '#2563eb';
    case 'component':
      return isDarkMode ? '#34d399' : '#059669';
  }
}
