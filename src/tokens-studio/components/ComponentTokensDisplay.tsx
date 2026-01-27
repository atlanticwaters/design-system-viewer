import React, { useState, useMemo } from 'react';
import { TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface ComponentTokensDisplayProps {
  components: TokenCategory[];
  isDarkMode: boolean;
}

interface TokenCardProps {
  token: ResolvedToken;
  isDarkMode: boolean;
}

function TokenCard({ token, isDarkMode }: TokenCardProps) {
  const [copied, setCopied] = useState(false);
  const value = String(token.value);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isColor = token.type === 'color';
  const colorValue = isColor ? value : null;

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: isDarkMode
      ? '0 1px 4px rgba(0,0,0,0.3)'
      : '0 1px 4px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  };

  const swatchStyle: React.CSSProperties = {
    width: '100%',
    height: 48,
    backgroundColor: colorValue || (isDarkMode ? '#3a3a3a' : '#f0eeec'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const infoStyle: React.CSSProperties = {
    padding: 10,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 4,
    wordBreak: 'break-word',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: "'Menlo', monospace",
    color: isDarkMode ? '#bab7b4' : '#787675',
    wordBreak: 'break-all',
  };

  const typeStyle: React.CSSProperties = {
    fontSize: 9,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#6a6a6a' : '#a0a0a0',
    marginTop: 4,
    textTransform: 'uppercase',
  };

  const copiedStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontFamily: FONT_OPEN_SANS,
  };

  // For non-color tokens, show value text in the swatch area
  const nonColorDisplay = !isColor && (
    <div style={{
      fontSize: 12,
      fontFamily: "'Menlo', monospace",
      color: isDarkMode ? '#8b949e' : '#585756',
      textAlign: 'center',
      padding: 4,
    }}>
      {typeof token.value === 'number' ? token.value : value.slice(0, 20)}
    </div>
  );

  return (
    <div
      style={cardStyle}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 4px 12px rgba(0,0,0,0.4)'
          : '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDarkMode
          ? '0 1px 4px rgba(0,0,0,0.3)'
          : '0 1px 4px rgba(0,0,0,0.08)';
      }}
    >
      <div style={swatchStyle}>
        {copied && <div style={copiedStyle}>Copied!</div>}
        {nonColorDisplay}
      </div>
      <div style={infoStyle}>
        <div style={nameStyle}>{token.name}</div>
        <div style={valueStyle}>{value}</div>
        <div style={typeStyle}>{token.type}</div>
        {token.isReference && (
          <div style={{ ...valueStyle, fontSize: 9, marginTop: 4, opacity: 0.6 }}>
            ← {token.referencePath}
          </div>
        )}
      </div>
    </div>
  );
}

interface ComponentSectionProps {
  category: TokenCategory;
  isDarkMode: boolean;
  defaultExpanded?: boolean;
}

function flattenCategory(category: TokenCategory): ResolvedToken[] {
  const tokens = [...category.tokens];
  if (category.subcategories) {
    for (const sub of category.subcategories) {
      tokens.push(...flattenCategory(sub));
    }
  }
  return tokens;
}

function ComponentSection({ category, isDarkMode, defaultExpanded = false }: ComponentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const allTokens = useMemo(() => flattenCategory(category), [category]);
  const tokenCount = allTokens.length;

  if (tokenCount === 0) {
    return null;
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f5f2',
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: isExpanded ? 16 : 0,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    transition: 'background-color 0.15s ease',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const countStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 400,
    fontFamily: FONT_OPEN_SANS,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
    padding: '2px 8px',
    borderRadius: 10,
    color: isDarkMode ? '#bab7b4' : '#585756',
  };

  const chevronStyle: React.CSSProperties = {
    fontSize: 14,
    color: isDarkMode ? '#8b949e' : '#787675',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 12,
  };

  // Group tokens by subcategory for better organization
  const renderTokens = () => {
    if (category.subcategories && category.subcategories.length > 0) {
      return (
        <>
          {category.tokens.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={gridStyle}>
                {category.tokens.map((token, index) => (
                  <div
                    key={token.path}
                    className="animate-item"
                    style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                  >
                    <TokenCard token={token} isDarkMode={isDarkMode} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {category.subcategories.map((sub) => (
            <div key={sub.id} style={{ marginBottom: 20 }}>
              <h4 style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_OPEN_SANS,
                color: isDarkMode ? '#bab7b4' : '#585756',
                marginBottom: 12,
                paddingLeft: 4,
              }}>
                {sub.label}
              </h4>
              <div style={gridStyle}>
                {flattenCategory(sub).map((token, index) => (
                  <div
                    key={token.path}
                    className="animate-item"
                    style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
                  >
                    <TokenCard token={token} isDarkMode={isDarkMode} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }

    return (
      <div style={gridStyle}>
        {allTokens.map((token, index) => (
          <div
            key={token.path}
            className="animate-item"
            style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}
          >
            <TokenCard token={token} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 16 }} className="animate-section">
      <div
        style={headerStyle}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#252525' : '#f0eeec';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f8f5f2';
        }}
      >
        <div style={titleStyle}>
          <span style={chevronStyle}>▶</span>
          {category.label}
          <span style={countStyle}>{tokenCount} tokens</span>
        </div>
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: 8 }}>
          {renderTokens()}
        </div>
      )}
    </div>
  );
}

export function ComponentTokensDisplay({ components, isDarkMode }: ComponentTokensDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchTerm.trim()) {
      return components;
    }
    const term = searchTerm.toLowerCase();
    return components.filter(comp => {
      // Check component name
      if (comp.label.toLowerCase().includes(term)) return true;
      // Check token names within component
      const allTokens = flattenCategory(comp);
      return allTokens.some(t =>
        t.name.toLowerCase().includes(term) ||
        t.path.toLowerCase().includes(term)
      );
    });
  }, [components, searchTerm]);

  // Calculate total token count
  const totalTokens = useMemo(() => {
    return components.reduce((sum, comp) => sum + flattenCategory(comp).length, 0);
  }, [components]);

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

  const searchStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 400,
    padding: '10px 14px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    borderRadius: 8,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 24,
    outline: 'none',
  };

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 24,
    marginBottom: 24,
    flexWrap: 'wrap',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: 8,
    padding: '12px 20px',
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    color: '#f96302',
    lineHeight: 1,
    marginBottom: 4,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: 11,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#8b949e' : '#787675',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Component Tokens</h2>
      <p style={descriptionStyle}>
        Design tokens for UI components. Click any token to copy its value. Expand components to see their tokens.
      </p>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{components.length}</div>
          <div style={statLabelStyle}>Components</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{totalTokens}</div>
          <div style={statLabelStyle}>Total Tokens</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search components or tokens..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={searchStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#f96302';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = isDarkMode ? '#3a3a3a' : '#e5e1de';
        }}
      />

      {/* Components */}
      {filteredComponents.length > 0 ? (
        filteredComponents.map((component, index) => (
          <ComponentSection
            key={component.id}
            category={component}
            isDarkMode={isDarkMode}
            defaultExpanded={index === 0 && filteredComponents.length <= 5}
          />
        ))
      ) : (
        <div style={{
          padding: 48,
          textAlign: 'center',
          color: isDarkMode ? '#8b949e' : '#787675',
          fontFamily: FONT_OPEN_SANS,
        }}>
          {searchTerm ? 'No components or tokens match your search.' : 'No component tokens found.'}
        </div>
      )}
    </div>
  );
}
