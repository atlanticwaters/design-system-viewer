/**
 * ValidationStatus Component
 * Displays validation results inline in the editor
 */

import React from 'react';
import type { ValidationResult, ValidationIssue, ValidationSeverity } from '../types/editor';
import { FONT_OPEN_SANS } from '../../tokens-studio/utils/fonts';

interface ValidationStatusProps {
  result: ValidationResult | null;
  isDarkMode?: boolean;
}

const SEVERITY_ICONS: Record<ValidationSeverity, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const SEVERITY_COLORS: Record<ValidationSeverity, { light: string; dark: string }> = {
  error: { light: '#dc2626', dark: '#ef4444' },
  warning: { light: '#d97706', dark: '#f59e0b' },
  info: { light: '#2563eb', dark: '#3b82f6' },
};

const SEVERITY_BG: Record<ValidationSeverity, { light: string; dark: string }> = {
  error: { light: '#fef2f2', dark: '#450a0a' },
  warning: { light: '#fffbeb', dark: '#451a03' },
  info: { light: '#eff6ff', dark: '#1e3a5f' },
};

export function ValidationStatus({ result, isDarkMode = false }: ValidationStatusProps) {
  if (!result) return null;

  const containerStyle: React.CSSProperties = {
    marginTop: 16,
    fontFamily: FONT_OPEN_SANS,
    fontSize: 13,
  };

  if (result.valid && result.issues.length === 0) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 6,
            backgroundColor: isDarkMode ? '#052e16' : '#f0fdf4',
            color: isDarkMode ? '#4ade80' : '#16a34a',
          }}
        >
          <span>✓</span>
          <span>Valid</span>
        </div>
      </div>
    );
  }

  // Group issues by severity
  const errors = result.issues.filter(i => i.severity === 'error');
  const warnings = result.issues.filter(i => i.severity === 'warning');
  // const infos = result.issues.filter(i => i.severity === 'info');

  return (
    <div style={containerStyle}>
      {/* Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8,
          color: isDarkMode ? '#9ca3af' : '#6b7280',
        }}
      >
        {errors.length > 0 && (
          <span style={{ color: SEVERITY_COLORS.error[isDarkMode ? 'dark' : 'light'] }}>
            {errors.length} error{errors.length !== 1 ? 's' : ''}
          </span>
        )}
        {warnings.length > 0 && (
          <span style={{ color: SEVERITY_COLORS.warning[isDarkMode ? 'dark' : 'light'] }}>
            {warnings.length} warning{warnings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Issues list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {result.issues.map((issue, index) => (
          <IssueItem key={index} issue={issue} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}

interface IssueItemProps {
  issue: ValidationIssue;
  isDarkMode: boolean;
}

function IssueItem({ issue, isDarkMode }: IssueItemProps) {
  const colorKey = isDarkMode ? 'dark' : 'light';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 12px',
        borderRadius: 6,
        backgroundColor: SEVERITY_BG[issue.severity][colorKey],
        borderLeft: `3px solid ${SEVERITY_COLORS[issue.severity][colorKey]}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: SEVERITY_COLORS[issue.severity][colorKey],
        }}
      >
        <span>{SEVERITY_ICONS[issue.severity]}</span>
        <span style={{ fontWeight: 500 }}>{issue.message}</span>
      </div>

      {issue.suggestion && (
        <div
          style={{
            marginLeft: 20,
            fontSize: 12,
            color: isDarkMode ? '#9ca3af' : '#6b7280',
          }}
        >
          💡 {issue.suggestion}
        </div>
      )}

      <div
        style={{
          marginLeft: 20,
          fontSize: 11,
          color: isDarkMode ? '#6b7280' : '#9ca3af',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {issue.rule}
      </div>
    </div>
  );
}

/**
 * Compact validation indicator for list views
 */
export function ValidationIndicator({
  result,
  isDarkMode = false,
}: ValidationStatusProps) {
  if (!result) return null;

  const errors = result.issues.filter(i => i.severity === 'error').length;
  const warnings = result.issues.filter(i => i.severity === 'warning').length;

  if (errors === 0 && warnings === 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: isDarkMode ? '#052e16' : '#dcfce7',
          color: isDarkMode ? '#4ade80' : '#16a34a',
          fontSize: 10,
        }}
        title="Valid"
      >
        ✓
      </span>
    );
  }

  if (errors > 0) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 16,
          height: 16,
          padding: '0 4px',
          borderRadius: 8,
          backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2',
          color: SEVERITY_COLORS.error[isDarkMode ? 'dark' : 'light'],
          fontSize: 10,
          fontWeight: 600,
        }}
        title={`${errors} error${errors !== 1 ? 's' : ''}`}
      >
        {errors}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 16,
        height: 16,
        padding: '0 4px',
        borderRadius: 8,
        backgroundColor: isDarkMode ? '#451a03' : '#fffbeb',
        color: SEVERITY_COLORS.warning[isDarkMode ? 'dark' : 'light'],
        fontSize: 10,
        fontWeight: 600,
      }}
      title={`${warnings} warning${warnings !== 1 ? 's' : ''}`}
    >
      {warnings}
    </span>
  );
}
