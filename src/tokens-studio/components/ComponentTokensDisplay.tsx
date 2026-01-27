import React, { useState, useMemo } from 'react';
import { TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface ComponentTokensDisplayProps {
  components: TokenCategory[];
  isDarkMode: boolean;
}

// Group tokens by their hierarchy path for better organization
interface TokenGroup {
  name: string;
  tokens: ResolvedToken[];
  subgroups: Map<string, TokenGroup>;
}

function buildTokenHierarchy(tokens: ResolvedToken[]): TokenGroup {
  const root: TokenGroup = { name: 'root', tokens: [], subgroups: new Map() };

  for (const token of tokens) {
    // Parse the path to extract hierarchy levels
    // e.g., "components/button.Button.icon.Ghost.Default" -> ["icon", "Ghost", "Default"]
    const pathParts = token.path.split('.');
    // Skip the first part (components/button) and second part (Button - component name)
    const hierarchy = pathParts.slice(2);

    if (hierarchy.length === 0) {
      root.tokens.push(token);
      continue;
    }

    // Navigate/create the hierarchy
    let current = root;
    for (let i = 0; i < hierarchy.length - 1; i++) {
      const level = hierarchy[i];
      if (!current.subgroups.has(level)) {
        current.subgroups.set(level, { name: level, tokens: [], subgroups: new Map() });
      }
      current = current.subgroups.get(level)!;
    }
    current.tokens.push(token);
  }

  return root;
}

// Get state order for consistent display
const STATE_ORDER = ['Default', 'Hover', 'Active', 'Active-Pressed', 'Focus', 'Success', 'Inactive', 'Disabled'];
function getStateOrder(stateName: string): number {
  const idx = STATE_ORDER.findIndex(s => stateName.toLowerCase().includes(s.toLowerCase()));
  return idx >= 0 ? idx : 99;
}

interface StateSwatchProps {
  token: ResolvedToken;
  isDarkMode: boolean;
}

function StateSwatch({ token, isDarkMode }: StateSwatchProps) {
  const [copied, setCopied] = useState(false);
  const value = String(token.value);
  const isColor = token.type === 'color';
  const stateName = token.name;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swatchStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    transition: 'background-color 0.15s ease',
    position: 'relative',
  };

  const colorBoxStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: isColor ? value : (isDarkMode ? '#3a3a3a' : '#e5e1de'),
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#d0d0d0'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 9,
    color: isDarkMode ? '#8b949e' : '#787675',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#8b949e' : '#787675',
    textAlign: 'center',
    maxWidth: 48,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const copiedStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: '3px 6px',
    borderRadius: 3,
    fontSize: 9,
    fontFamily: FONT_OPEN_SANS,
    zIndex: 10,
  };

  return (
    <div
      style={swatchStyle}
      onClick={handleCopy}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? '#3a3a3a' : '#f0eeec';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      title={`${token.path}\n${value}`}
    >
      {copied && <div style={copiedStyle}>Copied!</div>}
      <div style={colorBoxStyle}>
        {!isColor && (typeof token.value === 'number' ? token.value : '...')}
      </div>
      <div style={labelStyle}>{stateName}</div>
    </div>
  );
}

interface VariantCardProps {
  variantName: string;
  tokens: ResolvedToken[];
  isDarkMode: boolean;
}

function VariantCard({ variantName, tokens, isDarkMode }: VariantCardProps) {
  // Sort tokens by state order
  const sortedTokens = [...tokens].sort((a, b) => {
    return getStateOrder(a.name) - getStateOrder(b.name);
  });

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    borderRadius: 8,
    padding: 12,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const headerStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const statesStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>{variantName}</div>
      <div style={statesStyle}>
        {sortedTokens.map(token => (
          <StateSwatch key={token.path} token={token} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}

interface TokenTypeSectionProps {
  typeName: string;
  group: TokenGroup;
  isDarkMode: boolean;
}

function TokenTypeSection({ typeName, group, isDarkMode }: TokenTypeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Count total tokens in this type
  const countTokens = (g: TokenGroup): number => {
    let count = g.tokens.length;
    g.subgroups.forEach(sub => {
      count += countTokens(sub);
    });
    return count;
  };
  const tokenCount = countTokens(group);

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f0eeec',
    borderRadius: 6,
    cursor: 'pointer',
    marginBottom: isExpanded ? 12 : 0,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    flex: 1,
  };

  const countStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: FONT_OPEN_SANS,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
    padding: '2px 6px',
    borderRadius: 8,
    color: isDarkMode ? '#bab7b4' : '#585756',
  };

  const chevronStyle: React.CSSProperties = {
    fontSize: 12,
    color: isDarkMode ? '#8b949e' : '#787675',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 12,
  };

  // Format type name for display
  const formatTypeName = (name: string) => {
    return name
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={headerStyle}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#252525' : '#e8e5e2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#f0eeec';
        }}
      >
        <span style={chevronStyle}>▶</span>
        <span style={titleStyle}>{formatTypeName(typeName)}</span>
        <span style={countStyle}>{tokenCount}</span>
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: 12 }}>
          {/* Direct tokens in this type */}
          {group.tokens.length > 0 && (
            <div style={{ ...gridStyle, marginBottom: 12 }}>
              <VariantCard
                variantName="General"
                tokens={group.tokens}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
          {/* Variant subgroups */}
          <div style={gridStyle}>
            {Array.from(group.subgroups.entries()).map(([variantName, variantGroup]) => (
              <VariantCard
                key={variantName}
                variantName={formatTypeName(variantName)}
                tokens={variantGroup.tokens}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      )}
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

  // Build hierarchical structure from tokens
  const hierarchy = useMemo(() => buildTokenHierarchy(allTokens), [allTokens]);

  if (tokenCount === 0) {
    return null;
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f5f2',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: isExpanded ? 16 : 0,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    transition: 'background-color 0.15s ease',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: FONT_OPEN_SANS,
    color: isDarkMode ? '#fbfaf9' : '#252524',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const countStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 400,
    fontFamily: FONT_OPEN_SANS,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
    padding: '3px 10px',
    borderRadius: 12,
    color: isDarkMode ? '#bab7b4' : '#585756',
  };

  const chevronStyle: React.CSSProperties = {
    fontSize: 16,
    color: isDarkMode ? '#8b949e' : '#787675',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
  };

  // Get token types (icon, text, background, etc.) - these are the first-level subgroups
  const tokenTypes = Array.from(hierarchy.subgroups.entries());

  return (
    <div style={{ marginBottom: 20 }} className="animate-section">
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
        {tokenTypes.length > 0 && (
          <div style={{
            fontSize: 11,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#6a6a6a' : '#a0a0a0',
          }}>
            {tokenTypes.map(([name]) => name).join(' • ')}
          </div>
        )}
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: 12 }}>
          {/* Render token types (icon, text, background, etc.) */}
          {tokenTypes.map(([typeName, typeGroup]) => (
            <TokenTypeSection
              key={typeName}
              typeName={typeName}
              group={typeGroup}
              isDarkMode={isDarkMode}
            />
          ))}
          {/* Direct tokens without type grouping */}
          {hierarchy.tokens.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}>
                <VariantCard
                  variantName="Other"
                  tokens={hierarchy.tokens}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}
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
      if (comp.label.toLowerCase().includes(term)) return true;
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
        Design tokens for UI components, organized by token type (icon, text, background) and variant.
        Click any color swatch to copy its value.
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
            defaultExpanded={index === 0 && filteredComponents.length <= 3}
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
