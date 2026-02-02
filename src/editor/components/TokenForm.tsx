/**
 * TokenForm Component
 * Dynamic form with type-aware inputs for editing tokens
 */

import React, { useCallback, useState } from 'react';
import type { EditableToken, TokenType } from '../types/editor';
import { isTokenReference } from '../utils/tokenValidator';
import { ColorPicker, ColorSwatch } from './ColorPicker';
import { ReferenceSelector } from './ReferenceSelector';
import { FONT_OPEN_SANS } from '../../tokens-studio/utils/fonts';

interface TokenFormProps {
  token: EditableToken;
  allTokens: Map<string, EditableToken>;
  onChange: (updates: Partial<EditableToken>) => void;
  isDarkMode?: boolean;
  disabled?: boolean;
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

export function TokenForm({
  token,
  allTokens,
  onChange,
  isDarkMode = false,
  disabled = false,
}: TokenFormProps) {
  // Track if user wants to use reference or literal
  const [useReference, setUseReference] = useState(() => {
    return isTokenReference(token.$value);
  });

  const handleValueChange = useCallback((value: unknown) => {
    onChange({ $value: value });
  }, [onChange]);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ $type: e.target.value as TokenType });
  }, [onChange]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ $description: e.target.value || undefined });
  }, [onChange]);

  const toggleValueMode = useCallback(() => {
    const newUseReference = !useReference;
    setUseReference(newUseReference);

    if (newUseReference) {
      // Switch to reference - clear value
      onChange({ $value: '' });
    } else {
      // Switch to literal - set default based on type
      onChange({ $value: getDefaultValue(token.$type) });
    }
  }, [useReference, token.$type, onChange]);

  const formGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
    opacity: disabled ? 0.5 : 1,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    fontSize: 12,
    fontFamily: FONT_OPEN_SANS,
    borderRadius: 4,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#f3f4f6',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={{ fontFamily: FONT_OPEN_SANS }}>
      {/* Value input */}
      <div style={formGroupStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={labelStyle}>Value</label>
          {token.layer !== 'core' ? (
            <button
              onClick={toggleValueMode}
              disabled={disabled}
              style={{
                ...buttonStyle,
                backgroundColor: useReference
                  ? (isDarkMode ? '#f96302' : '#252524')
                  : 'transparent',
                color: useReference
                  ? '#ffffff'
                  : (isDarkMode ? '#9ca3af' : '#6b7280'),
              }}
            >
              {useReference ? 'Using Reference' : 'Use Reference'}
            </button>
          ) : null}
        </div>

        {useReference ? (
          <ReferenceSelector
            value={String(token.$value || '')}
            onChange={(value) => handleValueChange(value)}
            allTokens={allTokens}
            sourceLayer={token.layer}
            expectedType={token.$type}
            isDarkMode={isDarkMode}
            disabled={disabled}
          />
        ) : (
          <ValueInput
            value={token.$value}
            type={token.$type}
            onChange={handleValueChange}
            isDarkMode={isDarkMode}
            disabled={disabled}
          />
        )}

        {/* Resolved value preview */}
        {token.resolvedValue !== undefined && String(token.resolvedValue) !== String(token.$value) ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              fontSize: 13,
              borderRadius: 6,
              backgroundColor: isDarkMode ? '#252524' : '#f3f4f6',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
            }}
          >
            <span>Resolves to:</span>
            {token.$type === 'color' ? (
              <ColorSwatch
                color={String(token.resolvedValue)}
                size={16}
                isDarkMode={isDarkMode}
              />
            ) : null}
            <code style={{ fontFamily: 'monospace' }}>
              {String(token.resolvedValue)}
            </code>
          </div>
        ) : null}
      </div>

      {/* Type selector */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Type</label>
        <select
          value={token.$type || ''}
          onChange={handleTypeChange}
          disabled={disabled}
          style={{
            ...inputStyle,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="">Select type...</option>
          {TOKEN_TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div style={formGroupStyle}>
        <label style={labelStyle}>Description (optional)</label>
        <textarea
          value={token.$description || ''}
          onChange={handleDescriptionChange}
          disabled={disabled}
          placeholder="Describe what this token is for..."
          rows={2}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: 60,
          }}
        />
      </div>

      {/* Preview for colors */}
      {token.$type === 'color' && token.resolvedValue !== undefined ? (
        <div style={formGroupStyle}>
          <label style={labelStyle}>Preview</label>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                backgroundColor: String(token.resolvedValue),
                border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                <code style={{ fontFamily: 'monospace' }}>{String(token.resolvedValue)}</code>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface ValueInputProps {
  value: unknown;
  type: TokenType | undefined;
  onChange: (value: unknown) => void;
  isDarkMode: boolean;
  disabled: boolean;
}

function ValueInput({ value, type, onChange, isDarkMode, disabled }: ValueInputProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    fontSize: 14,
    fontFamily: 'monospace',
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  switch (type) {
    case 'color':
      return (
        <ColorPicker
          value={String(value || '')}
          onChange={onChange}
          isDarkMode={isDarkMode}
          disabled={disabled}
        />
      );

    case 'dimension':
      return (
        <DimensionInput
          value={String(value || '')}
          onChange={onChange}
          isDarkMode={isDarkMode}
          disabled={disabled}
        />
      );

    case 'number':
    case 'fontWeight':
      return (
        <input
          type="number"
          value={value !== undefined ? Number(value) : ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          disabled={disabled}
          style={inputStyle}
        />
      );

    case 'duration':
      return (
        <DurationInput
          value={String(value || '')}
          onChange={onChange}
          isDarkMode={isDarkMode}
          disabled={disabled}
        />
      );

    case 'fontFamily':
      return (
        <input
          type="text"
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          placeholder="'Font Name', sans-serif"
          disabled={disabled}
          style={inputStyle}
        />
      );

    case 'cubicBezier':
      return (
        <CubicBezierInput
          value={value}
          onChange={onChange}
          isDarkMode={isDarkMode}
          disabled={disabled}
        />
      );

    default:
      return (
        <input
          type="text"
          value={String(value || '')}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          style={inputStyle}
        />
      );
  }
}

interface DimensionInputProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  disabled: boolean;
}

function DimensionInput({ value, onChange, isDarkMode, disabled }: DimensionInputProps) {
  const match = value.match(/^(-?[\d.]+)\s*(px|rem|em|%|vw|vh)?$/);
  const numValue = match ? match[1] : '';
  const unit = match ? match[2] || 'px' : 'px';

  const [currentUnit, setCurrentUnit] = useState(unit);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${e.target.value}${currentUnit}`);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setCurrentUnit(newUnit);
    onChange(`${numValue}${newUnit}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="number"
        value={numValue}
        onChange={handleNumberChange}
        disabled={disabled}
        style={{
          flex: 1,
          padding: '8px 12px',
          fontSize: 14,
          fontFamily: 'monospace',
          borderRadius: 6,
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          outline: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <select
        value={currentUnit}
        onChange={handleUnitChange}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          fontSize: 14,
          fontFamily: FONT_OPEN_SANS,
          borderRadius: 6,
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <option value="px">px</option>
        <option value="rem">rem</option>
        <option value="em">em</option>
        <option value="%">%</option>
        <option value="vw">vw</option>
        <option value="vh">vh</option>
      </select>
    </div>
  );
}

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode: boolean;
  disabled: boolean;
}

function DurationInput({ value, onChange, isDarkMode, disabled }: DurationInputProps) {
  const match = value.match(/^([\d.]+)\s*(ms|s)?$/);
  const numValue = match ? match[1] : '';
  const unit = match ? match[2] || 'ms' : 'ms';

  const [currentUnit, setCurrentUnit] = useState(unit);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${e.target.value}${currentUnit}`);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setCurrentUnit(newUnit);
    onChange(`${numValue}${newUnit}`);
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input
        type="number"
        value={numValue}
        onChange={handleNumberChange}
        disabled={disabled}
        step="10"
        style={{
          flex: 1,
          padding: '8px 12px',
          fontSize: 14,
          fontFamily: 'monospace',
          borderRadius: 6,
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          outline: 'none',
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <select
        value={currentUnit}
        onChange={handleUnitChange}
        disabled={disabled}
        style={{
          padding: '8px 12px',
          fontSize: 14,
          fontFamily: FONT_OPEN_SANS,
          borderRadius: 6,
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          color: isDarkMode ? '#fbfaf9' : '#252524',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <option value="ms">ms</option>
        <option value="s">s</option>
      </select>
    </div>
  );
}

interface CubicBezierInputProps {
  value: unknown;
  onChange: (value: number[]) => void;
  isDarkMode: boolean;
  disabled: boolean;
}

function CubicBezierInput({ value, onChange, isDarkMode, disabled }: CubicBezierInputProps) {
  const bezier = Array.isArray(value) && value.length === 4
    ? value as number[]
    : [0.4, 0, 0.2, 1];

  const handleChange = (index: number, newValue: string) => {
    const updated = [...bezier];
    updated[index] = parseFloat(newValue) || 0;
    onChange(updated);
  };

  const inputStyle: React.CSSProperties = {
    width: 60,
    padding: '6px 8px',
    fontSize: 13,
    fontFamily: 'monospace',
    borderRadius: 4,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    textAlign: 'center',
    outline: 'none',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>[</span>
      <input
        type="number"
        value={bezier[0]}
        onChange={e => handleChange(0, e.target.value)}
        disabled={disabled}
        step="0.1"
        min="0"
        max="1"
        style={inputStyle}
      />
      <span style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>,</span>
      <input
        type="number"
        value={bezier[1]}
        onChange={e => handleChange(1, e.target.value)}
        disabled={disabled}
        step="0.1"
        style={inputStyle}
      />
      <span style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>,</span>
      <input
        type="number"
        value={bezier[2]}
        onChange={e => handleChange(2, e.target.value)}
        disabled={disabled}
        step="0.1"
        min="0"
        max="1"
        style={inputStyle}
      />
      <span style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>,</span>
      <input
        type="number"
        value={bezier[3]}
        onChange={e => handleChange(3, e.target.value)}
        disabled={disabled}
        step="0.1"
        style={inputStyle}
      />
      <span style={{ color: isDarkMode ? '#6b7280' : '#9ca3af' }}>]</span>
    </div>
  );
}

function getDefaultValue(type: TokenType | undefined): unknown {
  switch (type) {
    case 'color':
      return '#000000';
    case 'dimension':
      return '0px';
    case 'number':
    case 'fontWeight':
      return 0;
    case 'duration':
      return '0ms';
    case 'fontFamily':
      return '';
    case 'cubicBezier':
      return [0.4, 0, 0.2, 1];
    default:
      return '';
  }
}
