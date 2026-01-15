import React, { useState, useMemo } from 'react';
import { TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface SemanticTokensDisplayProps {
  lightTokens: TokenCategory[];
  darkTokens: TokenCategory[];
  isDarkMode: boolean;
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

// Icon visual - sample clock icon
function IconPreview({ lightColor, darkColor }: { lightColor: string; darkColor: string }) {
  return (
    <div style={{ display: 'flex', height: 56 }}>
      <div
        style={{
          flex: 1,
          backgroundColor: '#f8f5f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={lightColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#252524',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={darkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
    </div>
  );
}

// Text visual - sample text "Aa"
function TextPreview({ lightColor, darkColor }: { lightColor: string; darkColor: string }) {
  return (
    <div style={{ display: 'flex', height: 56 }}>
      <div
        style={{
          flex: 1,
          backgroundColor: '#f8f5f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: lightColor, fontSize: 22, fontWeight: 600, fontFamily: FONT_OPEN_SANS }}>Aa</span>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#252524',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: darkColor, fontSize: 22, fontWeight: 600, fontFamily: FONT_OPEN_SANS }}>Aa</span>
      </div>
    </div>
  );
}

// Border visual - bordered rectangle
function BorderPreview({ lightColor, darkColor }: { lightColor: string; darkColor: string }) {
  return (
    <div style={{ display: 'flex', height: 56 }}>
      <div
        style={{
          flex: 1,
          backgroundColor: '#f8f5f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 36, height: 28, border: `2px solid ${lightColor}`, borderRadius: 4 }} />
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#252524',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 36, height: 28, border: `2px solid ${darkColor}`, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// Elevation visual - elevated card with shadow
function ElevationPreview({ lightValue, darkValue }: { lightValue: string; darkValue: string }) {
  const lightShadow = lightValue.includes('px') ? lightValue : '0 4px 12px rgba(0,0,0,0.15)';
  const darkShadow = darkValue.includes('px') ? darkValue : '0 4px 12px rgba(0,0,0,0.4)';

  return (
    <div style={{ display: 'flex', height: 56 }}>
      <div
        style={{
          flex: 1,
          backgroundColor: '#f8f5f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 36, height: 24, backgroundColor: '#ffffff', borderRadius: 4, boxShadow: lightShadow }} />
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: '#252524',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 36, height: 24, backgroundColor: '#3a3a3a', borderRadius: 4, boxShadow: darkShadow }} />
      </div>
    </div>
  );
}

// Background/Surface visual - color swatch
function BackgroundPreview({ lightColor, darkColor }: { lightColor: string; darkColor: string }) {
  return (
    <div style={{ display: 'flex', height: 56 }}>
      <div style={{ flex: 1, backgroundColor: lightColor }} />
      <div style={{ flex: 1, backgroundColor: darkColor }} />
    </div>
  );
}

// Get the appropriate preview based on category type
function getPreviewComponent(categoryType: string, lightValue: string, darkValue: string) {
  const typeLower = categoryType.toLowerCase();

  if (typeLower.includes('icon')) {
    return <IconPreview lightColor={lightValue} darkColor={darkValue} />;
  }
  if (typeLower.includes('text')) {
    return <TextPreview lightColor={lightValue} darkColor={darkValue} />;
  }
  if (typeLower.includes('border')) {
    return <BorderPreview lightColor={lightValue} darkColor={darkValue} />;
  }
  if (typeLower.includes('elevation') || typeLower.includes('shadow')) {
    return <ElevationPreview lightValue={lightValue} darkValue={darkValue} />;
  }
  // Default: background/surface/container
  return <BackgroundPreview lightColor={lightValue} darkColor={darkValue} />;
}

// Semantic token card with visual preview and hover-to-reveal details
function SemanticTokenCard({
  name,
  lightValue,
  darkValue,
  lightRef,
  darkRef,
  categoryType,
  isDarkMode,
}: {
  name: string;
  lightValue: string;
  darkValue: string;
  lightRef?: string;
  darkRef?: string;
  categoryType: string;
  isDarkMode: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const currentValue = isDarkMode ? darkValue : lightValue;
  const currentRef = isDarkMode ? darkRef : lightRef;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Fixed card height for consistent layout
  const cardHeight = 140;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        borderRadius: 12,
        overflow: 'hidden',
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        height: cardHeight,
        position: 'relative',
      }}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Visual Preview */}
      {getPreviewComponent(categoryType, lightValue, darkValue)}

      {/* Light/Dark Labels */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}` }}>
        <div
          style={{
            flex: 1,
            padding: '4px 0',
            textAlign: 'center',
            fontSize: 9,
            fontFamily: FONT_OPEN_SANS,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: isDarkMode ? '#8b949e' : '#787675',
            backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
          }}
        >
          Light
        </div>
        <div
          style={{
            flex: 1,
            padding: '4px 0',
            textAlign: 'center',
            fontSize: 9,
            fontFamily: FONT_OPEN_SANS,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: isDarkMode ? '#8b949e' : '#787675',
            backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
          }}
        >
          Dark
        </div>
      </div>

      {/* Token Info - Base State */}
      <div
        style={{
          padding: '10px 12px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontFamily: FONT_OPEN_SANS,
            fontWeight: 600,
            color: isDarkMode ? '#fbfaf9' : '#252524',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {copied ? '✓ Copied!' : name}
        </div>
        <div
          style={{
            fontSize: 11,
            fontFamily: "'Menlo', monospace",
            color: isDarkMode ? '#8b949e' : '#787675',
            marginTop: 2,
          }}
        >
          {currentValue}
        </div>
      </div>

      {/* Hover Overlay with Token Details */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: isDarkMode ? 'rgba(37, 37, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          padding: '10px 12px',
          transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.2s ease',
          borderTop: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: "'Menlo', monospace",
            color: isDarkMode ? '#bab7b4' : '#585756',
            marginBottom: currentRef ? 4 : 0,
          }}
        >
          <span style={{ color: isDarkMode ? '#8b949e' : '#787675' }}>Light:</span> {lightValue}
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: "'Menlo', monospace",
            color: isDarkMode ? '#bab7b4' : '#585756',
          }}
        >
          <span style={{ color: isDarkMode ? '#8b949e' : '#787675' }}>Dark:</span> {darkValue}
        </div>
        {currentRef && (
          <div
            style={{
              fontSize: 9,
              fontFamily: FONT_OPEN_SANS,
              color: isDarkMode ? '#6b6b6b' : '#bab7b4',
              marginTop: 4,
            }}
          >
            → {currentRef}
          </div>
        )}
      </div>
    </div>
  );
}

// Get category icon
function getCategoryIcon(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('icon')) return '🎯';
  if (cat.includes('text')) return '✏️';
  if (cat.includes('border')) return '🔲';
  if (cat.includes('elevation') || cat.includes('shadow')) return '📦';
  if (cat.includes('background') || cat.includes('surface') || cat.includes('container')) return '🎨';
  if (cat.includes('button')) return '🔘';
  if (cat.includes('feedback') || cat.includes('status')) return '💬';
  return '⬛';
}

// Category section with cards and collapsible header
function CategorySection({
  category,
  tokens,
  isDarkMode,
  defaultExpanded = true,
}: {
  category: string;
  tokens: Array<{
    name: string;
    semanticPath: string;
    lightToken?: ResolvedToken;
    darkToken?: ResolvedToken;
  }>;
  isDarkMode: boolean;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (tokens.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }} className="animate-section">
      {/* Section Header - Clickable */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: isExpanded ? 16 : 0,
          paddingBottom: 8,
          borderBottom: `2px solid ${isDarkMode ? '#f96302' : '#252524'}`,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            fontSize: 12,
            color: isDarkMode ? '#bab7b4' : '#585756',
          }}
        >
          ▶
        </span>
        <span style={{ fontSize: 20 }}>{getCategoryIcon(category)}</span>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: isDarkMode ? '#fbfaf9' : '#252524',
            margin: 0,
            flex: 1,
          }}
        >
          {category.replace(/-/g, ' ')}
        </h3>
        <span
          style={{
            fontSize: 12,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#8b949e' : '#787675',
            backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
            padding: '2px 10px',
            borderRadius: 10,
          }}
        >
          {tokens.length}
        </span>
      </div>

      {/* Cards Grid - Collapsible */}
      {isExpanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {tokens.map((token, index) => (
            <div key={token.semanticPath} className="animate-item" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
              <SemanticTokenCard
                name={token.name}
                lightValue={String(token.lightToken?.value || token.darkToken?.value || '#000000')}
                darkValue={String(token.darkToken?.value || token.lightToken?.value || '#000000')}
                lightRef={token.lightToken?.isReference ? token.lightToken.referencePath : undefined}
                darkRef={token.darkToken?.isReference ? token.darkToken.referencePath : undefined}
                categoryType={category}
                isDarkMode={isDarkMode}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SemanticTokensDisplay({
  lightTokens,
  darkTokens,
  isDarkMode,
}: SemanticTokensDisplayProps) {
  // Flatten and organize tokens by category
  const { tokensByCategory, totalTokens } = useMemo(() => {
    const lightMap = new Map<string, ResolvedToken>();
    const darkMap = new Map<string, ResolvedToken>();
    const categorized = new Map<string, Array<{
      name: string;
      semanticPath: string;
      lightToken?: ResolvedToken;
      darkToken?: ResolvedToken;
    }>>();

    // Process light tokens
    for (const category of lightTokens) {
      const tokens = flattenCategory(category);
      for (const token of tokens) {
        const parts = token.path.split('.');
        const semanticPath = parts.slice(1).join('.');
        lightMap.set(semanticPath, token);
      }
    }

    // Process dark tokens
    for (const category of darkTokens) {
      const tokens = flattenCategory(category);
      for (const token of tokens) {
        const parts = token.path.split('.');
        const semanticPath = parts.slice(1).join('.');
        darkMap.set(semanticPath, token);
      }
    }

    // Combine into categorized structure
    const allPaths = new Set([...lightMap.keys(), ...darkMap.keys()]);

    for (const path of allPaths) {
      const parts = path.split('.');
      const categoryName = parts[0] || 'Other';
      const tokenName = parts.slice(1).join('.');

      if (!categorized.has(categoryName)) {
        categorized.set(categoryName, []);
      }

      categorized.get(categoryName)!.push({
        name: tokenName,
        semanticPath: path,
        lightToken: lightMap.get(path),
        darkToken: darkMap.get(path),
      });
    }

    // Sort tokens within each category
    for (const [, categoryTokens] of categorized) {
      categoryTokens.sort((a, b) => a.name.localeCompare(b.name));
    }

    return {
      tokensByCategory: categorized,
      totalTokens: allPaths.size,
    };
  }, [lightTokens, darkTokens]);

  // Define category display order
  const categoryOrder = ['Background', 'Text', 'Icon', 'Border', 'Elevation'];
  const sortedCategories = Array.from(tokensByCategory.keys()).sort((a, b) => {
    const aIndex = categoryOrder.findIndex(c => a.toLowerCase().includes(c.toLowerCase()));
    const bIndex = categoryOrder.findIndex(c => b.toLowerCase().includes(c.toLowerCase()));
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: '2px solid #f96302',
    paddingBottom: 8,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#8b949e' : '#787675',
    marginBottom: 24,
  };

  if (totalTokens === 0) {
    return (
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Semantic Tokens</h2>
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            color: isDarkMode ? '#8b949e' : '#787675',
          }}
        >
          No semantic tokens found. Load a tokens file with Component Tokens to see them here.
        </div>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Semantic & Component Tokens</h2>
      <p style={subtitleStyle}>
        Design tokens that adapt between light and dark modes. Hover over cards for details, click to copy.
      </p>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          marginBottom: 32,
          padding: 16,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          borderRadius: 8,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 20,
              background: 'linear-gradient(90deg, #f8f5f2 50%, #252524 50%)',
              borderRadius: 4,
              border: `1px solid ${isDarkMode ? '#4a4a4a' : '#e5e1de'}`,
            }}
          />
          <span style={{ fontSize: 13, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#fbfaf9' : '#252524' }}>
            Light / Dark Preview
          </span>
        </div>
        <div style={{ fontSize: 13, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#8b949e' : '#787675' }}>
          <strong style={{ color: isDarkMode ? '#fbfaf9' : '#252524' }}>{totalTokens}</strong> semantic tokens
        </div>
      </div>

      {/* Category Sections */}
      {sortedCategories.map((category) => (
        <CategorySection
          key={category}
          category={category}
          tokens={tokensByCategory.get(category) || []}
          isDarkMode={isDarkMode}
        />
      ))}

      <div
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          borderRadius: 8,
          fontSize: 13,
          fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#8b949e' : '#787675',
          textAlign: 'center',
        }}
      >
        Click any card to copy the current mode's value. See the "Pairings" tab for accessibility contrast analysis.
      </div>
    </div>
  );
}
