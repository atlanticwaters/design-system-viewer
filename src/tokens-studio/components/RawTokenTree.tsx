import React, { useState } from 'react';
import { TokensStudioFile, isToken, isTokenGroup } from '../types/tokens';

interface RawTokenTreeProps {
  tokens: TokensStudioFile;
}

interface TreeNodeProps {
  name: string;
  value: unknown;
  path: string;
  depth: number;
}

function TreeNode({ name, value, path, depth }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 1);

  const indent = depth * 16;

  const nodeStyle: React.CSSProperties = {
    paddingLeft: indent,
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 12,
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    borderBottom: '1px solid #f0f0f0',
  };

  const keyStyle: React.CSSProperties = {
    color: '#0550ae',
    cursor: isTokenGroup(value) ? 'pointer' : 'default',
  };

  const valueStyle: React.CSSProperties = {
    color: '#1a7f37',
  };

  const typeStyle: React.CSSProperties = {
    color: '#953800',
    fontSize: 10,
    marginLeft: 8,
  };

  const refStyle: React.CSSProperties = {
    color: '#8250df',
  };

  const toggleStyle: React.CSSProperties = {
    display: 'inline-block',
    width: 16,
    color: '#787675',
    cursor: 'pointer',
  };

  // Skip metadata keys at root level display
  if (name.startsWith('$') && depth === 0) {
    return null;
  }

  // Handle token values
  if (isToken(value)) {
    const isReference = typeof value.$value === 'string' && value.$value.startsWith('{');

    return (
      <div style={nodeStyle}>
        <span style={toggleStyle}></span>
        <span style={keyStyle}>{name}</span>
        <span>: </span>
        <span style={isReference ? refStyle : valueStyle}>
          {JSON.stringify(value.$value)}
        </span>
        {value.$type && <span style={typeStyle}>[{value.$type}]</span>}
        {value.$description && (
          <span style={{ color: '#787675', marginLeft: 8 }}>// {value.$description}</span>
        )}
      </div>
    );
  }

  // Handle groups
  if (isTokenGroup(value)) {
    const entries = Object.entries(value).filter(([k]) => !k.startsWith('$'));
    const count = entries.length;

    return (
      <div>
        <div style={nodeStyle}>
          <span style={toggleStyle} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '▼' : '▶'}
          </span>
          <span style={keyStyle} onClick={() => setIsExpanded(!isExpanded)}>
            {name}
          </span>
          <span style={{ color: '#787675', marginLeft: 8 }}>
            ({count} {count === 1 ? 'item' : 'items'})
          </span>
        </div>
        {isExpanded && entries.map(([key, val]) => (
          <TreeNode
            key={`${path}.${key}`}
            name={key}
            value={val}
            path={`${path}.${key}`}
            depth={depth + 1}
          />
        ))}
      </div>
    );
  }

  // Handle primitives (shouldn't happen often)
  return (
    <div style={nodeStyle}>
      <span style={toggleStyle}></span>
      <span style={keyStyle}>{name}</span>
      <span>: </span>
      <span style={valueStyle}>{JSON.stringify(value)}</span>
    </div>
  );
}

export function RawTokenTree({ tokens }: RawTokenTreeProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sectionStyle: React.CSSProperties = {
    padding: 24,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
    color: '#252524',
    borderBottom: '2px solid #f96302',
    paddingBottom: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const treeContainerStyle: React.CSSProperties = {
    backgroundColor: '#fafafa',
    border: '1px solid #e5e1de',
    borderRadius: 8,
    padding: 16,
    maxHeight: 600,
    overflow: 'auto',
  };

  const entries = Object.entries(tokens).filter(([key]) => !key.startsWith('$'));

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle} onClick={() => setIsVisible(!isVisible)}>
        <span style={{ transform: isVisible ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▶
        </span>
        Raw Token Tree (Debug)
      </h2>

      {isVisible && (
        <div style={treeContainerStyle}>
          {entries.map(([key, value]) => (
            <TreeNode
              key={key}
              name={key}
              value={value}
              path={key}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
