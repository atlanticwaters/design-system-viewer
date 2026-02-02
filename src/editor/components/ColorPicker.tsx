/**
 * ColorPicker Component
 * Color input with visual preview
 */

import React, { useState, useCallback } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode?: boolean;
  disabled?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  isDarkMode = false,
  disabled = false,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  // Update input when value prop changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only update parent if it looks like a valid color
    if (isValidColorFormat(newValue) || newValue === '') {
      onChange(newValue);
    }
  }, [onChange]);

  const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    setInputValue(hexColor);
    onChange(hexColor);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    // On blur, update parent with current value even if not perfect format
    onChange(inputValue);
  }, [inputValue, onChange]);

  // Try to convert value to hex for the color picker
  const hexValue = toHex(value) || '#000000';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Native color picker */}
      <div
        style={{
          position: 'relative',
          width: 40,
          height: 40,
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundColor: hexValue,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input
          type="color"
          value={hexValue}
          onChange={handleColorPickerChange}
          disabled={disabled}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>

      {/* Text input */}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="#000000"
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
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />

      {/* Preview swatch */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 4,
          backgroundColor: value || 'transparent',
          border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
          backgroundImage: value ? 'none' : 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 4px 4px',
        }}
        title={value || 'No color'}
      />
    </div>
  );
}

/**
 * Check if a string is a valid color format
 */
function isValidColorFormat(value: string): boolean {
  if (!value) return false;

  // Hex
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
    return true;
  }

  // RGB/RGBA
  if (/^rgba?\s*\(/.test(value)) {
    return true;
  }

  // HSL/HSLA
  if (/^hsla?\s*\(/.test(value)) {
    return true;
  }

  return false;
}

/**
 * Try to convert a color string to hex format
 */
function toHex(value: string): string | null {
  if (!value) return null;

  // Already hex
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
    // Expand 3-char hex to 6-char
    if (value.length === 4) {
      return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
    }
    return value;
  }

  // 8-char hex with alpha - strip alpha for color picker
  if (/^#[0-9a-fA-F]{8}$/.test(value)) {
    return value.slice(0, 7);
  }

  // Try to parse RGB/RGBA
  const rgbMatch = value.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return null;
}

/**
 * Simple color preview for display purposes
 */
export function ColorSwatch({
  color,
  size = 24,
  isDarkMode = false,
}: {
  color: string;
  size?: number;
  isDarkMode?: boolean;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        backgroundColor: color || 'transparent',
        border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d1d5db'}`,
        backgroundImage: color ? 'none' : 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 4px 4px',
        flexShrink: 0,
      }}
      title={color || 'No color'}
    />
  );
}
