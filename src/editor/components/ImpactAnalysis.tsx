/**
 * ImpactAnalysis Component
 * Shows tokens that would be affected by deleting a token
 */

import type { EditableToken } from '../types/editor';
import type { DeletionImpact } from '../utils/tokenValidator';
import { FONT_OPEN_SANS } from '../../tokens-studio/utils/fonts';

interface ImpactAnalysisProps {
  impact: DeletionImpact;
  isDarkMode?: boolean;
}

export function ImpactAnalysis({
  impact,
  isDarkMode = false,
}: ImpactAnalysisProps) {
  if (!impact.wouldBreakTokens) {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 6,
          backgroundColor: isDarkMode ? '#14532d' : '#f0fdf4',
          color: isDarkMode ? '#4ade80' : '#15803d',
          fontSize: 13,
          fontFamily: FONT_OPEN_SANS,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>✓</span>
        No other tokens reference this token. Safe to delete.
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: 6,
        border: `1px solid ${isDarkMode ? '#7f1d1d' : '#fecaca'}`,
        overflow: 'hidden',
      }}
    >
      {/* Warning header */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
          color: isDarkMode ? '#fca5a5' : '#dc2626',
          fontSize: 13,
          fontFamily: FONT_OPEN_SANS,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>⚠</span>
        <strong>{impact.affectedCount}</strong> token{impact.affectedCount !== 1 ? 's' : ''} reference{impact.affectedCount === 1 ? 's' : ''} this token
      </div>

      {/* Dependent tokens list */}
      <div
        style={{
          padding: 12,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          maxHeight: 150,
          overflow: 'auto',
        }}
      >
        {impact.directDependents.map((token) => (
          <DependentTokenRow
            key={token.path}
            token={token}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      {/* Warning message */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: isDarkMode ? '#1f1f1f' : '#f9fafb',
          borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e7eb'}`,
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          fontSize: 12,
          fontFamily: FONT_OPEN_SANS,
        }}
      >
        Deleting this token will cause validation errors in the tokens listed above.
      </div>
    </div>
  );
}

function DependentTokenRow({
  token,
  isDarkMode,
}: {
  token: EditableToken;
  isDarkMode: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        marginBottom: 4,
        borderRadius: 4,
        backgroundColor: isDarkMode ? '#252524' : '#f3f4f6',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: getLayerColor(token.layer, isDarkMode),
          flexShrink: 0,
        }}
      />
      <code
        style={{
          flex: 1,
          fontSize: 12,
          fontFamily: 'monospace',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {token.path}
      </code>
      <span
        style={{
          fontSize: 10,
          padding: '2px 6px',
          borderRadius: 3,
          backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        }}
      >
        {token.layer}
      </span>
    </div>
  );
}

function getLayerColor(layer: string, isDarkMode: boolean): string {
  switch (layer) {
    case 'core':
      return isDarkMode ? '#a78bfa' : '#8b5cf6';
    case 'semantic':
      return isDarkMode ? '#60a5fa' : '#3b82f6';
    case 'component':
      return isDarkMode ? '#34d399' : '#10b981';
    default:
      return isDarkMode ? '#6b7280' : '#9ca3af';
  }
}

/**
 * Inline warning for delete button
 */
export function DeleteWarningBadge({
  count,
  isDarkMode = false,
}: {
  count: number;
  isDarkMode?: boolean;
}) {
  if (count === 0) return null;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 9,
        backgroundColor: isDarkMode ? '#ef4444' : '#dc2626',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: FONT_OPEN_SANS,
      }}
      title={`${count} token${count !== 1 ? 's' : ''} depend on this token`}
    >
      {count}
    </span>
  );
}
