import React, { useState } from 'react';
import { TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface ColorTokensDisplayProps {
  colors: {
    core: TokenCategory[];
    semantic: {
      light: TokenCategory[];
      dark: TokenCategory[];
    };
  };
  isDarkMode: boolean;
}

interface ColorSwatchProps {
  token: ResolvedToken;
  isDarkMode: boolean;
}

function ColorSwatch({ token, isDarkMode }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const colorValue = String(token.value);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: isDarkMode
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 2px 8px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  };

  const swatchStyle: React.CSSProperties = {
    width: '100%',
    height: 80,
    backgroundColor: colorValue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const infoStyle: React.CSSProperties = {
    padding: 12,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 4,
    wordBreak: 'break-word',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 11,
    fontFamily: "'Menlo', monospace",
    color: isDarkMode ? '#bab7b4' : '#787675',
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
      <div style={swatchStyle}>
        {copied && <div style={copiedStyle}>Copied!</div>}
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{token.name}</div>
        <div style={valueStyle}>{colorValue}</div>
        {token.isReference && (
          <div style={{ ...valueStyle, fontSize: 10, marginTop: 4, opacity: 0.7 }}>
            ← {token.referencePath}
          </div>
        )}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: TokenCategory;
  isDarkMode: boolean;
  animationDelay?: number;
}

function CategorySection({ category, isDarkMode }: CategorySectionProps) {

  // Collect all tokens from subcategories recursively
  const getAllTokens = (cat: TokenCategory): ResolvedToken[] => {
    let tokens = cat.tokens.filter(t => t.type === 'color');
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        tokens = tokens.concat(getAllTokens(sub));
      }
    }
    return tokens;
  };

  // Get all tokens and sort by shade number for proper palette display
  const allTokens = getAllTokens(category).sort((a, b) => {
    // Extract numbers from token names (e.g., "brand-025" -> 25, "brand-950" -> 950)
    const aMatch = a.name.match(/(\d+)$/);
    const bMatch = b.name.match(/(\d+)$/);
    const aNum = aMatch ? parseInt(aMatch[1]) : 0;
    const bNum = bMatch ? parseInt(bMatch[1]) : 0;
    return aNum - bNum;
  });

  if (allTokens.length === 0) {
    return null;
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: 32,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    marginBottom: 16,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const countStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 400,
    fontFamily: FONT_OPEN_SANS,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
    padding: '4px 8px',
    borderRadius: 4,
    color: isDarkMode ? '#bab7b4' : '#585756',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 16,
  };

  return (
    <div style={sectionStyle} className="animate-section">
      <h3 style={headerStyle}>
        {category.label}
        <span style={countStyle}>{allTokens.length} colors</span>
      </h3>
      <div style={gridStyle}>
        {allTokens.map((token, index) => (
          <div
            key={token.path}
            className="animate-item"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <ColorSwatch token={token} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ColorTokensDisplay({ colors, isDarkMode }: ColorTokensDisplayProps) {
  const semantic = isDarkMode ? colors.semantic.dark : colors.semantic.light;

  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: FONT_OPEN_SANS,
    marginBottom: 24,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: `2px solid #f96302`,
    paddingBottom: 8,
  };

  return (
    <div style={sectionStyle}>
      {/* Core Palettes */}
      <section style={{ marginBottom: 48 }} className="animate-section">
        <h2 style={sectionTitleStyle}>Core Color Palettes</h2>
        {colors.core.map((palette, index) => (
          <CategorySection
            key={palette.id}
            category={palette}
            isDarkMode={isDarkMode}
            animationDelay={index * 100}
          />
        ))}
      </section>

      {/* Semantic Colors */}
      <section className="animate-section">
        <h2 style={sectionTitleStyle}>
          Semantic Colors ({isDarkMode ? 'Dark' : 'Light'} Mode)
        </h2>
        {semantic.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            isDarkMode={isDarkMode}
            animationDelay={index * 100}
          />
        ))}
      </section>
    </div>
  );
}
