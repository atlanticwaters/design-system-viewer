import React, { useState } from 'react';
import { TokenCategory } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface SpacingTokensDisplayProps {
  spacing: TokenCategory;
  isDarkMode?: boolean;
}

interface SpacingCardProps {
  name: string;
  value: number;
  description?: string;
  isDarkMode: boolean;
}

function SpacingCard({ name, value, description, isDarkMode }: SpacingCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${value}px`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Scale the visual bar (cap at 160px for display)
  const barWidth = Math.min(value, 160);
  const barHeight = Math.min(Math.max(value / 4, 8), 32);

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: 12,
    padding: 16,
    boxShadow: isDarkMode
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minHeight: 120,
  };

  const previewStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    position: 'relative',
  };

  const barContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const barStyle: React.CSSProperties = {
    width: barWidth,
    height: barHeight,
    backgroundColor: '#f96302',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  };

  const infoStyle: React.CSSProperties = {
    borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    paddingTop: 12,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 4,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 11,
    fontFamily: "'Menlo', monospace",
    color: isDarkMode ? '#bab7b4' : '#787675',
  };

  const descStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#787675' : '#9a9897',
    marginTop: 4,
  };

  const copiedStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 4,
    fontSize: 11,
    fontFamily: FONT_OPEN_SANS,
    zIndex: 10,
  };

  return (
    <div
      style={cardStyle}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 4px 16px rgba(0,0,0,0.4)'
          : '0 4px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div style={previewStyle}>
        {copied && <div style={copiedStyle}>Copied!</div>}
        <div style={barContainerStyle}>
          <div style={barStyle} />
        </div>
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{name}</div>
        <div style={valueStyle}>{value}px</div>
        {description && <div style={descStyle}>{description}</div>}
      </div>
    </div>
  );
}

export function SpacingTokensDisplay({ spacing, isDarkMode = false }: SpacingTokensDisplayProps) {
  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: FONT_OPEN_SANS,
    marginBottom: 8,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: '2px solid #f96302',
    paddingBottom: 8,
  };

  const descriptionStyle: React.CSSProperties = {
    color: isDarkMode ? '#bab7b4' : '#585756',
    fontFamily: FONT_OPEN_SANS,
    fontSize: 14,
    marginBottom: 24,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Spacing</h2>
      <p style={descriptionStyle}>
        Spacing scale based on a 4px grid system. Click to copy values.
      </p>

      <div style={gridStyle}>
        {spacing.tokens.map((token, index) => {
          const value = typeof token.value === 'number'
            ? token.value
            : parseInt(String(token.value)) || 0;

          return (
            <div
              key={token.path}
              className="animate-item"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <SpacingCard
                name={token.name}
                value={value}
                description={token.description}
                isDarkMode={isDarkMode}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
