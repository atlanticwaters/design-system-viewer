/**
 * PendingChanges Component
 * Displays a summary of uncommitted token changes
 */

import React from 'react';
import type { TokenChange } from '../../types/editor';
import { FONT_OPEN_SANS } from '../../../tokens-studio/utils/fonts';

interface PendingChangesProps {
  changes: TokenChange[];
  onDiscardChange: (path: string) => void;
  onDiscardAll: () => void;
  onCommit: () => void;
  isDarkMode?: boolean;
  disabled?: boolean;
}

export function PendingChanges({
  changes,
  onDiscardChange,
  onDiscardAll,
  onCommit,
  isDarkMode = false,
  disabled = false,
}: PendingChangesProps) {
  if (changes.length === 0) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
    borderRadius: 8,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const listStyle: React.CSSProperties = {
    maxHeight: 200,
    overflow: 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: 12,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 500,
    borderRadius: 4,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#f96302',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT_OPEN_SANS,
            }}
          >
            {changes.length}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: FONT_OPEN_SANS,
              color: isDarkMode ? '#fbfaf9' : '#252524',
            }}
          >
            Pending Changes
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onDiscardAll}
            disabled={disabled}
            style={{
              ...buttonStyle,
              backgroundColor: 'transparent',
              color: isDarkMode ? '#ef4444' : '#dc2626',
              border: `1px solid ${isDarkMode ? '#7f1d1d' : '#fecaca'}`,
            }}
          >
            Discard All
          </button>
          <button
            onClick={onCommit}
            disabled={disabled}
            style={{
              ...buttonStyle,
              backgroundColor: '#f96302',
              color: '#ffffff',
              border: 'none',
            }}
          >
            Commit
          </button>
        </div>
      </div>

      {/* Changes list */}
      <div style={listStyle}>
        {changes.map((change, i) => (
          <div
            key={change.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderBottom: i < changes.length - 1
                ? `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`
                : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChangeTypeIcon type={change.type} isDarkMode={isDarkMode} />
              <span
                style={{
                  fontSize: 13,
                  fontFamily: 'monospace',
                  color: isDarkMode ? '#fbfaf9' : '#252524',
                }}
              >
                {change.path}
              </span>
            </div>

            <button
              onClick={() => onDiscardChange(change.path)}
              disabled={disabled}
              title="Discard this change"
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: isDarkMode ? '#6b7280' : '#9ca3af',
                fontSize: 16,
                lineHeight: 1,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangeTypeIcon({
  type,
  isDarkMode,
}: {
  type: TokenChange['type'];
  isDarkMode: boolean;
}) {
  const colors: Record<TokenChange['type'], string> = {
    create: isDarkMode ? '#22c55e' : '#16a34a',
    update: isDarkMode ? '#3b82f6' : '#2563eb',
    delete: isDarkMode ? '#ef4444' : '#dc2626',
    rename: isDarkMode ? '#a855f7' : '#9333ea',
  };

  const icons: Record<TokenChange['type'], string> = {
    create: '+',
    update: '~',
    delete: '-',
    rename: '→',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18,
        borderRadius: 3,
        backgroundColor: colors[type],
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'monospace',
      }}
    >
      {icons[type]}
    </span>
  );
}

/**
 * Compact badge showing pending changes count
 */
export function PendingChangesBadge({
  count,
  onClick,
  isDarkMode: _isDarkMode = false,
}: {
  count: number;
  onClick: () => void;
  isDarkMode?: boolean;
}) {
  if (count === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 20,
        backgroundColor: '#f96302',
        color: '#ffffff',
        border: 'none',
        fontSize: 13,
        fontFamily: FONT_OPEN_SANS,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={`${count} pending change${count === 1 ? '' : 's'}`}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        {count}
      </span>
      <span>Changes</span>
    </button>
  );
}
