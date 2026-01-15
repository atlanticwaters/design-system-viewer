import React, { useState } from 'react';
import { TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS, FONT_THD } from '../utils/fonts';

interface TypographyTokensDisplayProps {
  typography: TokenCategory;
  isDarkMode?: boolean;
}

interface TypographyCardProps {
  token: ResolvedToken;
  isDarkMode: boolean;
}

function TypographyCard({ token, isDarkMode }: TypographyCardProps) {
  const [copied, setCopied] = useState(false);
  const value = token.value;
  const valueStr = String(value);

  const handleCopy = () => {
    navigator.clipboard.writeText(valueStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Determine the type of typography token for appropriate preview
  const getPreview = () => {
    const name = token.name.toLowerCase();
    const path = token.path.toLowerCase();

    // Font size
    if (name.includes('size') || path.includes('font-size')) {
      const size = typeof value === 'number' ? value : parseInt(valueStr);
      return (
        <div style={{
          fontSize: Math.min(size, 48),
          fontFamily: size >= 16 ? FONT_THD : FONT_OPEN_SANS,
          fontWeight: 600,
          color: isDarkMode ? '#fbfaf9' : '#252524',
          lineHeight: 1.2,
        }}>
          Aa
        </div>
      );
    }

    // Font weight
    if (name.includes('weight') || path.includes('font-weight')) {
      return (
        <div style={{
          fontSize: 20,
          fontFamily: FONT_THD,
          fontWeight: typeof value === 'number' ? value : (value as string),
          color: isDarkMode ? '#fbfaf9' : '#252524',
        }}>
          Sample
        </div>
      );
    }

    // Font family
    if (name.includes('family') || path.includes('font-family')) {
      return (
        <div style={{
          fontSize: 18,
          fontFamily: valueStr,
          color: isDarkMode ? '#fbfaf9' : '#252524',
        }}>
          Abc 123
        </div>
      );
    }

    // Line height
    if (name.includes('line') || path.includes('line-height')) {
      return (
        <div style={{
          fontSize: 12,
          fontFamily: FONT_OPEN_SANS,
          lineHeight: valueStr,
          color: isDarkMode ? '#fbfaf9' : '#252524',
          backgroundColor: isDarkMode ? '#3a3a3a' : '#f0eeec',
          padding: '4px 8px',
          borderRadius: 4,
        }}>
          Line 1<br />Line 2
        </div>
      );
    }

    // Letter spacing
    if (name.includes('letter') || path.includes('letter-spacing')) {
      return (
        <div style={{
          fontSize: 14,
          fontFamily: FONT_OPEN_SANS,
          letterSpacing: valueStr,
          color: isDarkMode ? '#fbfaf9' : '#252524',
          textTransform: 'uppercase',
        }}>
          Spacing
        </div>
      );
    }

    // Default
    return (
      <div style={{
        fontSize: 16,
        fontFamily: FONT_OPEN_SANS,
        color: isDarkMode ? '#fbfaf9' : '#252524',
      }}>
        {valueStr.substring(0, 20)}
      </div>
    );
  };

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
      <div style={previewStyle}>
        {copied && <div style={copiedStyle}>Copied!</div>}
        {getPreview()}
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{token.name}</div>
        <div style={valueStyle}>{valueStr}</div>
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
}

function CategorySection({ category, isDarkMode }: CategorySectionProps) {
  // Collect all tokens from subcategories recursively
  const getAllTokens = (cat: TokenCategory): ResolvedToken[] => {
    let tokens = [...cat.tokens];
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        tokens = tokens.concat(getAllTokens(sub));
      }
    }
    return tokens;
  };

  const allTokens = getAllTokens(category);

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  };

  return (
    <div style={sectionStyle} className="animate-section">
      <h3 style={headerStyle}>
        {category.label}
        <span style={countStyle}>{allTokens.length} tokens</span>
      </h3>
      <div style={gridStyle}>
        {allTokens.map((token, index) => (
          <div
            key={token.path}
            className="animate-item"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <TypographyCard token={token} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TypographyTokensDisplay({ typography, isDarkMode = false }: TypographyTokensDisplayProps) {
  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: FONT_OPEN_SANS,
    marginBottom: 24,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: '2px solid #f96302',
    paddingBottom: 8,
  };

  // If typography has subcategories, show each as a section
  if (typography.subcategories && typography.subcategories.length > 0) {
    return (
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Typography</h2>
        {typography.subcategories.map(category => (
          <CategorySection key={category.id} category={category} isDarkMode={isDarkMode} />
        ))}
        {/* Also show top-level tokens if any */}
        {typography.tokens.length > 0 && (
          <CategorySection category={typography} isDarkMode={isDarkMode} />
        )}
      </div>
    );
  }

  // Otherwise show all tokens directly
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Typography</h2>
      <div style={gridStyle}>
        {typography.tokens.map((token, index) => (
          <div
            key={token.path}
            className="animate-item"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <TypographyCard token={token} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </div>
  );
}
