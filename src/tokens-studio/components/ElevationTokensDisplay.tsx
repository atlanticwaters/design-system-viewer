import React, { useState } from 'react';
import { TokenCategory } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface ElevationTokensDisplayProps {
  effects: TokenCategory;
  isDarkMode?: boolean;
}

interface ElevationCardProps {
  name: string;
  value: string;
  isDarkMode: boolean;
}

function ElevationCard({ name, value, isDarkMode }: ElevationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Map shadow token names to blur values for visualization
  const getShadowBlur = (tokenName: string): number => {
    if (tokenName.includes('50')) return 2;
    if (tokenName.includes('100')) return 4;
    if (tokenName.includes('200')) return 8;
    if (tokenName.includes('300')) return 12;
    if (tokenName.includes('500')) return 20;
    return 8;
  };

  const blur = getShadowBlur(name);

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
    minHeight: 160,
  };

  const previewStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
    padding: 16,
  };

  const boxStyle: React.CSSProperties = {
    width: 72,
    height: 72,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
    borderRadius: 8,
    boxShadow: `0 ${blur / 2}px ${blur}px ${value}`,
    transition: 'box-shadow 0.3s ease',
  };

  const infoStyle: React.CSSProperties = {
    borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    paddingTop: 12,
    textAlign: 'center',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 4,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: "'Menlo', monospace",
    color: isDarkMode ? '#bab7b4' : '#787675',
    wordBreak: 'break-all',
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
        <div style={boxStyle} />
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{name}</div>
        <div style={valueStyle}>{value}</div>
      </div>
    </div>
  );
}

// Flatten tokens from category and subcategories
function flattenEffectsCategory(category: TokenCategory): TokenCategory['tokens'] {
  const tokens = [...category.tokens];
  if (category.subcategories) {
    for (const sub of category.subcategories) {
      tokens.push(...flattenEffectsCategory(sub));
    }
  }
  return tokens;
}

export function ElevationTokensDisplay({ effects, isDarkMode = false }: ElevationTokensDisplayProps) {
  // Get all tokens including from subcategories
  const allTokens = flattenEffectsCategory(effects);

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

  const subsectionTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    marginBottom: 16,
    marginTop: 24,
    color: isDarkMode ? '#fbfaf9' : '#252524',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  };

  const hasSubcategories = effects.subcategories && effects.subcategories.length > 0;

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Effects / Elevation</h2>
      <p style={descriptionStyle}>
        Shadow and elevation tokens for depth and hierarchy. Click to copy values.
      </p>

      {/* Render direct tokens if any */}
      {effects.tokens.length > 0 && (
        <div style={gridStyle}>
          {effects.tokens.map((token, index) => {
            const value = String(token.value);
            return (
              <div
                key={token.path}
                className="animate-item"
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                <ElevationCard
                  name={token.name}
                  value={value}
                  isDarkMode={isDarkMode}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Render subcategories */}
      {hasSubcategories && effects.subcategories!.map((subcategory) => (
        <div key={subcategory.id}>
          <h3 style={subsectionTitleStyle}>{subcategory.label}</h3>
          <div style={gridStyle}>
            {subcategory.tokens.map((token, index) => {
              const value = String(token.value);
              return (
                <div
                  key={token.path}
                  className="animate-item"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <ElevationCard
                    name={token.name}
                    value={value}
                    isDarkMode={isDarkMode}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Show message if no tokens found */}
      {allTokens.length === 0 && (
        <div style={{
          padding: 48,
          textAlign: 'center',
          color: isDarkMode ? '#8b949e' : '#787675',
        }}>
          No elevation/effects tokens found.
        </div>
      )}
    </div>
  );
}
