import React, { useMemo } from 'react';
import { ParsedTokens, TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface AllTokensDisplayProps {
  parsedTokens: ParsedTokens;
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

interface TokenStats {
  total: number;
  byType: Record<string, number>;
  colors: ResolvedToken[];
  dimensions: ResolvedToken[];
  typography: ResolvedToken[];
}

function getTokenStats(parsedTokens: ParsedTokens, isDarkMode: boolean): TokenStats {
  const allTokens: ResolvedToken[] = [];

  // Core colors
  for (const palette of parsedTokens.colors.core) {
    allTokens.push(...flattenCategory(palette));
  }

  // Semantic colors (based on mode)
  const semantic = isDarkMode
    ? parsedTokens.colors.semantic.dark
    : parsedTokens.colors.semantic.light;
  for (const category of semantic) {
    allTokens.push(...flattenCategory(category));
  }

  // Typography
  allTokens.push(...flattenCategory(parsedTokens.typography));

  // Spacing
  allTokens.push(...flattenCategory(parsedTokens.spacing));

  // Radius
  allTokens.push(...flattenCategory(parsedTokens.radius));

  // Border width
  allTokens.push(...flattenCategory(parsedTokens.borderWidth));

  // Effects
  allTokens.push(...flattenCategory(parsedTokens.effects));

  const byType: Record<string, number> = {};
  for (const token of allTokens) {
    byType[token.type] = (byType[token.type] || 0) + 1;
  }

  return {
    total: allTokens.length,
    byType,
    colors: allTokens.filter(t => t.type === 'color'),
    dimensions: allTokens.filter(t => t.type === 'dimension' || t.type === 'number'),
    typography: allTokens.filter(t => t.type === 'typography' || t.type === 'text'),
  };
}

// Color swatch component
function ColorSwatch({ token, isDarkMode }: { token: ResolvedToken; isDarkMode: boolean }) {
  const colorValue = String(token.value);

  return (
    <div
      title={`${token.name}\n${colorValue}`}
      style={{
        width: 32,
        height: 32,
        backgroundColor: colorValue,
        borderRadius: 4,
        border: `1px solid ${isDarkMode ? '#4a4a4a' : '#e5e1de'}`,
        cursor: 'pointer',
        transition: 'transform 0.1s',
      }}
      onClick={() => navigator.clipboard.writeText(colorValue)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.2)';
        e.currentTarget.style.zIndex = '10';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.zIndex = '1';
      }}
    />
  );
}

// Spacing bar visualization
function SpacingBar({ token, maxValue, isDarkMode }: { token: ResolvedToken; maxValue: number; isDarkMode: boolean }) {
  const value = typeof token.value === 'number' ? token.value : parseInt(String(token.value)) || 0;
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
      }}
    >
      <div
        style={{
          width: 60,
          fontSize: 11,
          fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#8b949e' : '#585756',
          textAlign: 'right',
        }}
      >
        {token.name}
      </div>
      <div
        style={{
          flex: 1,
          height: 16,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f0eeec',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: isDarkMode ? '#f96302' : '#252524',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          width: 50,
          fontSize: 11,
          fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#fbfaf9' : '#252524',
        }}
      >
        {value}px
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  label,
  value,
  color,
  isDarkMode
}: {
  label: string;
  value: number;
  color: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        borderRadius: 12,
        padding: 20,
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        minWidth: 140,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: color,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          fontFamily: FONT_OPEN_SANS,
          color: isDarkMode ? '#8b949e' : '#585756',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Color palette section
function ColorPaletteSection({
  title,
  tokens,
  isDarkMode
}: {
  title: string;
  tokens: ResolvedToken[];
  isDarkMode: boolean;
}) {
  // Group colors by their palette name
  // Handles both legacy "Color/Default.palette.shade" and new "core/colors.color.palette.shade" paths
  const grouped = useMemo(() => {
    const groups: Record<string, ResolvedToken[]> = {};
    for (const token of tokens) {
      const parts = token.path.split('.');
      let category: string;

      // Handle different path structures
      if (token.path.includes('core/colors.color.') || token.path.includes('core/neutrals.color.')) {
        // New structure: "core/colors.color.brand.brand-025" -> "brand"
        category = parts.length > 2 ? parts[2] : parts[1];
      } else {
        // Legacy structure: "Color/Default.brand.brand-025" -> "brand"
        category = parts.length > 1 ? parts[1] : parts[0];
      }

      if (!groups[category]) groups[category] = [];
      groups[category].push(token);
    }

    // Sort tokens within each group by shade number
    for (const category of Object.keys(groups)) {
      groups[category].sort((a, b) => {
        // Extract numbers from token names (e.g., "brand-025" -> 25, "brand-950" -> 950)
        const aMatch = a.name.match(/(\d+)$/);
        const bMatch = b.name.match(/(\d+)$/);
        const aNum = aMatch ? parseInt(aMatch[1]) : 0;
        const bNum = bMatch ? parseInt(bMatch[1]) : 0;
        return aNum - bNum;
      });
    }

    return groups;
  }, [tokens]);

  return (
    <div style={{ marginBottom: 32 }}>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 16,
          color: isDarkMode ? '#fbfaf9' : '#252524',
        }}
      >
        {title}
      </h3>
      {Object.entries(grouped).map(([category, categoryTokens]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontFamily: FONT_OPEN_SANS,
              fontWeight: 500,
              marginBottom: 8,
              color: isDarkMode ? '#8b949e' : '#787675',
              textTransform: 'capitalize',
            }}
          >
            {category.replace(/-/g, ' ')}
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
            }}
          >
            {categoryTokens.map(token => (
              <ColorSwatch key={token.path} token={token} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Semantic token preview card for overview
function SemanticPreviewCard({
  name,
  lightValue,
  darkValue,
  isDarkMode,
}: {
  name: string;
  lightValue: string;
  darkValue: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        minWidth: 120,
      }}
    >
      <div style={{ display: 'flex', height: 40 }}>
        <div style={{ flex: 1, backgroundColor: lightValue }} />
        <div style={{ flex: 1, backgroundColor: darkValue }} />
      </div>
      <div style={{ padding: 8 }}>
        <div style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, fontWeight: 500, color: isDarkMode ? '#fbfaf9' : '#252524' }}>
          {name}
        </div>
      </div>
    </div>
  );
}

export function AllTokensDisplay({ parsedTokens, isDarkMode }: AllTokensDisplayProps) {
  const stats = useMemo(
    () => getTokenStats(parsedTokens, isDarkMode),
    [parsedTokens, isDarkMode]
  );

  // Get spacing/dimension tokens sorted by value
  const spacingTokens = useMemo(() => {
    return [...stats.dimensions]
      .filter(t => t.path.toLowerCase().includes('spacing'))
      .sort((a, b) => {
        const aVal = typeof a.value === 'number' ? a.value : parseInt(String(a.value)) || 0;
        const bVal = typeof b.value === 'number' ? b.value : parseInt(String(b.value)) || 0;
        return aVal - bVal;
      });
  }, [stats.dimensions]);

  const radiusTokens = useMemo(() => {
    return [...stats.dimensions]
      .filter(t => t.path.toLowerCase().includes('radius'))
      .sort((a, b) => {
        const aVal = typeof a.value === 'number' ? a.value : parseInt(String(a.value)) || 0;
        const bVal = typeof b.value === 'number' ? b.value : parseInt(String(b.value)) || 0;
        return aVal - bVal;
      });
  }, [stats.dimensions]);

  const maxSpacing = Math.max(...spacingTokens.map(t =>
    typeof t.value === 'number' ? t.value : parseInt(String(t.value)) || 0
  ), 1);

  // Get core colors (not semantic/component tokens)
  // Support both legacy "Color/Default" and new "core/colors" paths
  const coreColors = stats.colors.filter(t =>
    t.path.includes('Color/Default') ||
    t.path.includes('core/colors') ||
    t.path.includes('core/neutrals')
  );

  // Get semantic token pairs for preview
  const semanticPairs = useMemo(() => {
    const lightTokens = new Map<string, ResolvedToken>();
    const darkTokens = new Map<string, ResolvedToken>();

    for (const cat of parsedTokens.colors.semantic.light) {
      const tokens = flattenCategory(cat);
      for (const t of tokens) {
        const parts = t.path.split('.');
        const key = parts.slice(1).join('.');
        lightTokens.set(key, t);
      }
    }

    for (const cat of parsedTokens.colors.semantic.dark) {
      const tokens = flattenCategory(cat);
      for (const t of tokens) {
        const parts = t.path.split('.');
        const key = parts.slice(1).join('.');
        darkTokens.set(key, t);
      }
    }

    const pairs: { name: string; light: string; dark: string }[] = [];
    const seen = new Set<string>();

    lightTokens.forEach((token, key) => {
      if (!seen.has(key)) {
        seen.add(key);
        const darkToken = darkTokens.get(key);
        pairs.push({
          name: token.name,
          light: String(token.value),
          dark: String(darkToken?.value || token.value),
        });
      }
    });

    return pairs.slice(0, 12); // Show first 12
  }, [parsedTokens.colors.semantic]);

  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    borderBottom: '2px solid #f96302',
    paddingBottom: 8,
  };

  const cardContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  };

  const sectionCardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    flex: '1 1 300px',
    minWidth: 300,
  };

  const subsectionTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Design System Overview</h2>

      {/* Stats Overview */}
      <div style={cardContainerStyle}>
        {[
          { label: 'Total Tokens', value: stats.total, color: '#f96302' },
          { label: 'Colors', value: stats.byType['color'] || 0, color: '#3b82f6' },
          { label: 'Dimensions', value: (stats.byType['dimension'] || 0) + (stats.byType['number'] || 0), color: '#10b981' },
          { label: 'Typography', value: (stats.byType['typography'] || 0) + (stats.byType['text'] || 0), color: '#8b5cf6' },
          { label: 'Effects', value: stats.byType['shadow'] || 0, color: '#f59e0b' },
        ].map((stat, index) => (
          <div key={stat.label} className="animate-item" style={{ animationDelay: `${index * 50}ms`, flex: '1 1 auto' }}>
            <StatCard
              label={stat.label}
              value={stat.value}
              color={stat.color}
              isDarkMode={isDarkMode}
            />
          </div>
        ))}
      </div>

      {/* Semantic/Component Tokens Preview */}
      {semanticPairs.length > 0 && (
        <div style={{ ...sectionCardStyle, marginBottom: 24 }} className="animate-section">
          <h3 style={subsectionTitleStyle}>
            <span style={{
              width: 24,
              height: 24,
              background: 'linear-gradient(90deg, #ffffff 50%, #252524 50%)',
              borderRadius: 4,
              border: `1px solid ${isDarkMode ? '#4a4a4a' : '#e5e1de'}`,
            }} />
            Semantic & Component Tokens
            <span style={{
              fontSize: 12,
              fontFamily: FONT_OPEN_SANS,
              fontWeight: 400,
              color: isDarkMode ? '#8b949e' : '#787675',
              marginLeft: 8,
            }}>
              (Light / Dark)
            </span>
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {semanticPairs.map((pair, index) => (
              <div key={pair.name} className="animate-item" style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}>
                <SemanticPreviewCard
                  name={pair.name}
                  lightValue={pair.light}
                  darkValue={pair.dark}
                  isDarkMode={isDarkMode}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 12,
              fontFamily: FONT_OPEN_SANS,
              color: isDarkMode ? '#8b949e' : '#787675',
            }}
          >
            See the "Semantic" tab for all semantic and component tokens with light/dark comparison.
          </div>
        </div>
      )}

      {/* Color Palettes */}
      <div style={sectionCardStyle} className="animate-section">
        <h3 style={subsectionTitleStyle}>
          <span style={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #f96302, #fbbf24, #10b981, #3b82f6)',
            borderRadius: 4
          }} />
          Core Color Palettes
        </h3>

        {coreColors.length > 0 && (
          <ColorPaletteSection
            title="Base Colors"
            tokens={coreColors}
            isDarkMode={isDarkMode}
          />
        )}

        {coreColors.length === 0 && (
          <div style={{
            color: isDarkMode ? '#8b949e' : '#787675',
            fontStyle: 'italic',
            padding: 16,
            textAlign: 'center',
          }}>
            No core color tokens found
          </div>
        )}
      </div>

      {/* Spacing & Dimensions */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
        {spacingTokens.length > 0 && (
          <div style={{ ...sectionCardStyle, flex: '1 1 400px' }} className="animate-section">
            <h3 style={subsectionTitleStyle}>
              <span style={{ fontSize: 20 }}>↔</span>
              Spacing Scale
            </h3>
            <div>
              {spacingTokens.map((token, index) => (
                <div key={token.path} className="animate-item" style={{ animationDelay: `${index * 40}ms` }}>
                  <SpacingBar
                    token={token}
                    maxValue={maxSpacing}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {radiusTokens.length > 0 && (
          <div style={{ ...sectionCardStyle, flex: '1 1 400px' }} className="animate-section">
            <h3 style={subsectionTitleStyle}>
              <span style={{
                width: 20,
                height: 20,
                border: `2px solid ${isDarkMode ? '#fbfaf9' : '#252524'}`,
                borderRadius: 6
              }} />
              Border Radius
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
              {radiusTokens.map((token, index) => {
                const value = typeof token.value === 'number' ? token.value : parseInt(String(token.value)) || 0;
                const size = Math.max(40, Math.min(value * 2 + 40, 100));
                return (
                  <div key={token.path} className="animate-item" style={{ textAlign: 'center', animationDelay: `${index * 50}ms` }}>
                    <div
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: isDarkMode ? '#f96302' : '#252524',
                        borderRadius: value,
                        marginBottom: 8,
                      }}
                    />
                    <div style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#8b949e' : '#585756' }}>
                      {token.name}
                    </div>
                    <div style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, fontWeight: 500, color: isDarkMode ? '#fbfaf9' : '#252524' }}>
                      {value}px
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Typography Preview */}
      {stats.typography.length > 0 && (
        <div style={{ ...sectionCardStyle, marginTop: 24 }}>
          <h3 style={subsectionTitleStyle}>
            <span style={{ fontSize: 20, fontWeight: 700 }}>Aa</span>
            Typography Tokens
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {stats.typography.slice(0, 12).map(token => (
              <div
                key={token.path}
                style={{
                  padding: 12,
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
                  borderRadius: 8,
                  minWidth: 150,
                }}
              >
                <div style={{ fontSize: 11, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#8b949e' : '#787675', marginBottom: 4 }}>
                  {token.name}
                </div>
                <div style={{ fontFamily: FONT_OPEN_SANS, fontSize: 13, color: isDarkMode ? '#fbfaf9' : '#252524' }}>
                  {String(token.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click hint */}
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
        Click on any color swatch to copy its value to clipboard. Use the "Data Table" tab for detailed token information.
      </div>
    </div>
  );
}
