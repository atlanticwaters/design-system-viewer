import React, { useState, useMemo } from 'react';
import { ParsedTokens, TokenCategory, ResolvedToken } from '../types/tokens';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface TokenTableDisplayProps {
  parsedTokens: ParsedTokens;
  isDarkMode: boolean;
}

interface TokenRowProps {
  token: ResolvedToken;
  isDarkMode: boolean;
}

function TokenRow({ token, isDarkMode }: TokenRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 200px 1fr',
    gap: 16,
    padding: '12px 16px',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    alignItems: 'center',
    fontSize: 13,
  };

  const pathStyle: React.CSSProperties = {
    fontFamily: "'Menlo', 'Monaco', monospace",
    fontSize: 11,
    color: isDarkMode ? '#8b949e' : '#585756',
    cursor: 'pointer',
    wordBreak: 'break-all',
  };

  const typeStyle: React.CSSProperties = {
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 500,
    backgroundColor: getTypeColor(token.type, isDarkMode),
    color: isDarkMode ? '#ffffff' : '#252524',
    display: 'inline-block',
    textAlign: 'center',
  };

  const valueStyle: React.CSSProperties = {
    fontFamily: "'Menlo', 'Monaco', monospace",
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const renderValue = () => {
    const value = String(token.value);

    if (token.type === 'color') {
      return (
        <div style={valueStyle}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              backgroundColor: value,
              border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
              flexShrink: 0,
            }}
          />
          <span>{value}</span>
        </div>
      );
    }

    if (token.type === 'dimension' || token.type === 'number') {
      return (
        <div style={valueStyle}>
          <div
            style={{
              width: Math.min(Number(value) || 0, 100),
              height: 8,
              borderRadius: 2,
              backgroundColor: isDarkMode ? '#f96302' : '#252524',
              flexShrink: 0,
            }}
          />
          <span>{value}{typeof token.value === 'number' ? 'px' : ''}</span>
        </div>
      );
    }

    return <span style={valueStyle}>{value}</span>;
  };

  return (
    <div
      style={rowStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? '#2a2a2a' : '#f8f5f2';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div
        style={pathStyle}
        onClick={() => handleCopy(token.path)}
        title="Click to copy path"
      >
        {copied ? '✓ Copied!' : token.path}
      </div>
      <div>
        <span style={typeStyle}>{token.type}</span>
      </div>
      <div>{renderValue()}</div>
      <div style={{ fontSize: 12, color: isDarkMode ? '#8b949e' : '#787675' }}>
        {token.isReference && (
          <span style={{ fontFamily: 'monospace', fontSize: 11 }}>
            → {token.referencePath}
          </span>
        )}
        {token.description && !token.isReference && (
          <span>{token.description}</span>
        )}
      </div>
    </div>
  );
}

function getTypeColor(type: string, isDarkMode: boolean): string {
  const colors: Record<string, { light: string; dark: string }> = {
    color: { light: '#fef2e9', dark: '#7c3d10' },
    dimension: { light: '#e6f4ea', dark: '#1e4620' },
    number: { light: '#e6f4ea', dark: '#1e4620' },
    typography: { light: '#e8eaed', dark: '#3c4043' },
    shadow: { light: '#f3e8fd', dark: '#4a1d7e' },
    text: { light: '#e8f0fe', dark: '#1a3a5c' },
  };
  const colorSet = colors[type] || { light: '#f0f0f0', dark: '#3a3a3a' };
  return isDarkMode ? colorSet.dark : colorSet.light;
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

function getAllTokens(parsedTokens: ParsedTokens, isDarkMode: boolean): ResolvedToken[] {
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

  return allTokens;
}

type SortField = 'path' | 'type' | 'value';
type FilterType = 'all' | 'color' | 'dimension' | 'number' | 'typography' | 'shadow' | 'text';

export function TokenTableDisplay({ parsedTokens, isDarkMode }: TokenTableDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('path');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const allTokens = useMemo(
    () => getAllTokens(parsedTokens, isDarkMode),
    [parsedTokens, isDarkMode]
  );

  const filteredAndSortedTokens = useMemo(() => {
    let tokens = [...allTokens];

    // Filter by type
    if (filterType !== 'all') {
      tokens = tokens.filter(t => t.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      tokens = tokens.filter(
        t =>
          t.path.toLowerCase().includes(term) ||
          t.name.toLowerCase().includes(term) ||
          String(t.value).toLowerCase().includes(term)
      );
    }

    // Sort
    tokens.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'path':
          comparison = a.path.localeCompare(b.path);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'value':
          comparison = String(a.value).localeCompare(String(b.value));
          break;
      }
      return sortAsc ? comparison : -comparison;
    });

    return tokens;
  }, [allTokens, searchTerm, sortField, sortAsc, filterType]);

  // Get unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = new Set(allTokens.map(t => t.type));
    return Array.from(types).sort();
  }, [allTokens]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

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

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 14,
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    minWidth: 250,
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 14,
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 200px 1fr',
    gap: 16,
    padding: '12px 16px',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f0eeec',
    borderBottom: `2px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isDarkMode ? '#bab7b4' : '#585756',
  };

  const sortButtonStyle: React.CSSProperties = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#252524' : '#ffffff',
    borderRadius: 8,
    border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    overflow: 'hidden',
  };

  const statsStyle: React.CSSProperties = {
    fontSize: 13,
    color: isDarkMode ? '#8b949e' : '#787675',
    marginLeft: 'auto',
  };

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Token Data Table</h2>

      <div style={controlsStyle}>
        <input
          type="text"
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          style={selectStyle}
        >
          <option value="all">All Types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <div style={statsStyle}>
          Showing {filteredAndSortedTokens.length} of {allTokens.length} tokens
        </div>
      </div>

      <div style={tableContainerStyle}>
        <div style={headerRowStyle}>
          <div style={sortButtonStyle} onClick={() => handleSort('path')}>
            Token Path {sortField === 'path' && (sortAsc ? '↑' : '↓')}
          </div>
          <div style={sortButtonStyle} onClick={() => handleSort('type')}>
            Type {sortField === 'type' && (sortAsc ? '↑' : '↓')}
          </div>
          <div style={sortButtonStyle} onClick={() => handleSort('value')}>
            Value {sortField === 'value' && (sortAsc ? '↑' : '↓')}
          </div>
          <div>Reference / Description</div>
        </div>

        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {filteredAndSortedTokens.map(token => (
            <TokenRow key={token.path} token={token} isDarkMode={isDarkMode} />
          ))}
          {filteredAndSortedTokens.length === 0 && (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: isDarkMode ? '#8b949e' : '#787675',
              }}
            >
              No tokens found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
