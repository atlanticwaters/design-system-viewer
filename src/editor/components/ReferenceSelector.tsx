/**
 * ReferenceSelector Component
 * Token reference picker filtered by layer rules
 */

import { useState, useMemo, useCallback } from 'react';
import type { EditableToken, TokenLayer } from '../types/editor';
import { getValidReferenceTargets, getLayerDisplayName } from '../utils/layerRules';
import { extractReferencePath, formatAsReference } from '../utils/tokenValidator';
import { ColorSwatch } from './ColorPicker';
import { FONT_OPEN_SANS } from '../../tokens-studio/utils/fonts';

interface ReferenceSelectorProps {
  // Current reference value (e.g., "{color.brand.300}")
  value: string;
  // Called when reference changes
  onChange: (value: string) => void;
  // All available tokens
  allTokens: Map<string, EditableToken>;
  // Layer of the token being edited (determines valid targets)
  sourceLayer: TokenLayer;
  // Expected token type (for filtering suggestions)
  expectedType?: string;
  isDarkMode?: boolean;
  disabled?: boolean;
}

export function ReferenceSelector({
  value,
  onChange,
  allTokens,
  sourceLayer,
  expectedType,
  isDarkMode = false,
  disabled = false,
}: ReferenceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Get valid target layers based on source layer
  const validLayers = useMemo(() => {
    return getValidReferenceTargets(sourceLayer);
  }, [sourceLayer]);

  // Filter tokens to valid targets
  const availableTokens = useMemo(() => {
    const filtered: EditableToken[] = [];

    for (const token of allTokens.values()) {
      // Check layer is valid
      if (!validLayers.includes(token.layer)) {
        continue;
      }

      // Optionally filter by type
      if (expectedType && token.$type && token.$type !== expectedType) {
        continue;
      }

      filtered.push(token);
    }

    // Sort by path
    return filtered.sort((a, b) => a.path.localeCompare(b.path));
  }, [allTokens, validLayers, expectedType]);

  // Filter by search
  const filteredTokens = useMemo(() => {
    if (!search) return availableTokens;

    const lowerSearch = search.toLowerCase();
    return availableTokens.filter(token =>
      token.path.toLowerCase().includes(lowerSearch)
    );
  }, [availableTokens, search]);

  // Group tokens by first path segment
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

  // Extract current reference path
  const currentPath = value.startsWith('{') && value.endsWith('}')
    ? extractReferencePath(value)
    : '';

  // Find current referenced token - try various prefixes since references
  // use short form (e.g., "system.text...") but allTokens uses full paths
  // (e.g., "semantic.light.system.text...")
  const currentToken = useMemo(() => {
    if (!currentPath) return undefined;

    // Try exact match first
    const exact = allTokens.get(currentPath);
    if (exact) return exact;

    // Try common prefixes for semantic/system references
    const prefixes = [
      'semantic.light.',
      'semantic.dark.',
      'core.colors.',
      'core.colors.color.',
      'core.neutrals.color.',
      'core.spacing.spacing.',
      'core.border.border.',
      'core.elevation.elevation.',
      'component.',
    ];

    for (const prefix of prefixes) {
      const prefixed = allTokens.get(prefix + currentPath);
      if (prefixed) return prefixed;
    }

    // Try handling color/spacing/border prefixes like {color.brand.brand-300}
    const segments = currentPath.split('.');
    if (segments.length >= 2) {
      const first = segments[0];
      const rest = segments.slice(1).join('.');

      if (first === 'color') {
        const colorPrefixes = ['core.colors.color.', 'core.neutrals.color.'];
        for (const cp of colorPrefixes) {
          const found = allTokens.get(cp + rest);
          if (found) return found;
        }
      } else if (first === 'spacing') {
        const found = allTokens.get('core.spacing.spacing.' + rest);
        if (found) return found;
      } else if (first === 'border') {
        const found = allTokens.get('core.border.border.' + rest);
        if (found) return found;
      }
    }

    return undefined;
  }, [currentPath, allTokens]);

  const handleSelect = useCallback((token: EditableToken) => {
    onChange(formatAsReference(token.path));
    setIsOpen(false);
    setSearch('');
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  if (validLayers.length === 0) {
    return (
      <div
        style={{
          padding: '8px 12px',
          fontSize: 13,
          fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6',
          borderRadius: 6,
        }}
      >
        Core tokens cannot reference other tokens
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Selected value display / trigger */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          fontSize: 14,
          fontFamily: 'monospace',
          borderRadius: 6,
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {currentToken ? (
          <>
            {currentToken.$type === 'color' && currentToken.resolvedValue && (
              <ColorSwatch
                color={currentToken.resolvedValue as string}
                size={20}
                isDarkMode={isDarkMode}
              />
            )}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {value}
            </span>
          </>
        ) : value ? (
          <span style={{ flex: 1, color: isDarkMode ? '#ef4444' : '#dc2626' }}>
            {value} (not found)
          </span>
        ) : (
          <span style={{ flex: 1, color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
            Select a token reference...
          </span>
        )}
        <span style={{ fontSize: 10, color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 300,
            overflow: 'auto',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
            borderRadius: 6,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
          }}
        >
          {/* Search input */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              padding: 8,
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e7eb'}`,
            }}
          >
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tokens..."
              autoFocus
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: 13,
                fontFamily: FONT_OPEN_SANS,
                borderRadius: 4,
                border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
                backgroundColor: isDarkMode ? '#252524' : '#f9fafb',
                color: isDarkMode ? '#fbfaf9' : '#252524',
                outline: 'none',
              }}
            />
          </div>

          {/* Layer info */}
          <div
            style={{
              padding: '6px 12px',
              fontSize: 11,
              fontFamily: FONT_OPEN_SANS,
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              backgroundColor: isDarkMode ? '#252524' : '#f3f4f6',
              borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e7eb'}`,
            }}
          >
            Valid targets: {validLayers.map(l => getLayerDisplayName(l)).join(', ')}
          </div>

          {/* Clear option */}
          {currentPath && (
            <button
              onClick={handleClear}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 13,
                fontFamily: FONT_OPEN_SANS,
                textAlign: 'left',
                border: 'none',
                borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e7eb'}`,
                backgroundColor: 'transparent',
                color: isDarkMode ? '#ef4444' : '#dc2626',
                cursor: 'pointer',
              }}
            >
              ✕ Clear reference
            </button>
          )}

          {/* Token list */}
          {filteredTokens.length === 0 ? (
            <div
              style={{
                padding: '16px 12px',
                fontSize: 13,
                fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#6b7280' : '#9ca3af',
                textAlign: 'center',
              }}
            >
              No matching tokens found
            </div>
          ) : (
            Array.from(groupedTokens.entries()).map(([group, tokens]) => (
              <div key={group}>
                <div
                  style={{
                    padding: '6px 12px',
                    fontSize: 11,
                    fontFamily: FONT_OPEN_SANS,
                    fontWeight: 600,
                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                    backgroundColor: isDarkMode ? '#252524' : '#f3f4f6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    position: 'sticky',
                    top: 52,
                  }}
                >
                  {group}
                </div>
                {tokens.map(token => (
                  <TokenOption
                    key={token.path}
                    token={token}
                    isSelected={token.path === currentPath}
                    onSelect={() => handleSelect(token)}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
          }}
          onClick={() => {
            setIsOpen(false);
            setSearch('');
          }}
        />
      )}
    </div>
  );
}

interface TokenOptionProps {
  token: EditableToken;
  isSelected: boolean;
  onSelect: () => void;
  isDarkMode: boolean;
}

function TokenOption({ token, isSelected, onSelect, isDarkMode }: TokenOptionProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        fontSize: 13,
        fontFamily: 'monospace',
        textAlign: 'left',
        border: 'none',
        backgroundColor: isSelected
          ? (isDarkMode ? '#f96302' : '#f3f4f6')
          : 'transparent',
        color: isSelected
          ? (isDarkMode ? '#ffffff' : '#252524')
          : (isDarkMode ? '#fbfaf9' : '#252524'),
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f9fafb';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      {/* Color preview */}
      {token.$type === 'color' && token.resolvedValue !== undefined && (
        <ColorSwatch
          color={String(token.resolvedValue)}
          size={16}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Path */}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {token.path}
      </span>

      {/* Type badge */}
      {token.$type && (
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e7eb',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
          }}
        >
          {token.$type}
        </span>
      )}

      {/* Layer badge */}
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
