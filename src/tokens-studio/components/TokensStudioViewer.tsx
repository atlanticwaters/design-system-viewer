import React, { useState } from 'react';
import { useTokensStudio } from '../hooks/useTokensStudio';
import { TokenInput } from './TokenInput';
import { ColorTokensDisplay } from './ColorTokensDisplay';
import { TypographyTokensDisplay } from './TypographyTokensDisplay';
import { SpacingTokensDisplay } from './SpacingTokensDisplay';
import { RadiusTokensDisplay } from './RadiusTokensDisplay';
import { BorderTokensDisplay } from './BorderTokensDisplay';
import { ElevationTokensDisplay } from './ElevationTokensDisplay';
import { ComponentTokensDisplay } from './ComponentTokensDisplay';
import { RawTokenTree } from './RawTokenTree';
import { AllTokensDisplay } from './AllTokensDisplay';
import { TokenTableDisplay } from './TokenTableDisplay';
import { SemanticTokensDisplay } from './SemanticTokensDisplay';
import { PairingsDisplay } from './PairingsDisplay';
import { TokensCascadeDisplay } from './TokensCascadeDisplay';
import { PlatformPassport } from '../../components/visualizations';
import { semanticLight, semanticDark } from '../../tokens/colors';
import { FONT_OPEN_SANS } from '../utils/fonts';

type Section = 'all' | 'cascade' | 'passport' | 'semantic' | 'pairings' | 'colors' | 'typography' | 'spacing' | 'radius' | 'border' | 'effects' | 'components' | 'table' | 'raw';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'all', label: 'Overview' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'passport', label: 'Platform Passport' },
  { id: 'semantic', label: 'Semantic' },
  { id: 'pairings', label: 'Pairings' },
  { id: 'colors', label: 'Colors' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'radius', label: 'Radius' },
  { id: 'border', label: 'Border' },
  { id: 'effects', label: 'Effects' },
  { id: 'components', label: 'Components' },
  { id: 'table', label: 'Data Table' },
  { id: 'raw', label: 'Raw JSON' },
];

interface TokensStudioViewerProps {
  onBack?: () => void;
}

export function TokensStudioViewer({ onBack }: TokensStudioViewerProps) {
  const {
    parsedTokens,
    tokensFile,
    loadedFiles,
    isLoading,
    error,
    isDarkMode,
    setIsDarkMode,
    loadFromString,
    loadFromUrl,
    loadFromFile,
    loadFromMultipleFiles,
    loadFromRepo,
    repoUrl,
    clear,
    setIsLoading,
    setError,
  } = useTokensStudio({ autoLoad: true });

  const [activeSection, setActiveSection] = useState<Section>('all');

  const hasTokens = !!(parsedTokens && tokensFile);

  // Sections that don't require loaded tokens
  const standaloneSection = activeSection === 'cascade' || activeSection === 'passport';

  // If no tokens loaded AND not on a standalone tab, show input UI
  if (!hasTokens && !standaloneSection) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8f5f2',
      }}>
        {/* Minimal nav bar so Cascade is always reachable */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e1de',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '8px 16px', fontSize: 14, fontFamily: FONT_OPEN_SANS,
                borderRadius: 6, border: '1px solid #bab7b4',
                backgroundColor: '#ffffff', cursor: 'pointer',
              }}
            >
              ← Back to Hardcoded Viewer
            </button>
          )}
          <div style={{ flex: 1 }} />
          {SECTIONS.filter(s => s.id === 'cascade' || s.id === 'passport' || s.id === 'all').map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '8px 16px', fontSize: 14, fontFamily: FONT_OPEN_SANS,
                fontWeight: activeSection === section.id ? 600 : 400,
                borderRadius: 6, border: 'none', cursor: 'pointer',
                backgroundColor: activeSection === section.id ? '#252524' : 'transparent',
                color: activeSection === section.id ? '#ffffff' : '#585756',
                whiteSpace: 'nowrap',
              }}
            >
              {section.label}
            </button>
          ))}
        </div>
        <TokenInput
          onLoadString={loadFromString}
          onLoadUrl={loadFromUrl}
          onLoadFile={loadFromFile}
          onLoadMultipleFiles={loadFromMultipleFiles}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          error={error}
          setError={setError}
        />
      </div>
    );
  }

  // Calculate file count for display
  const fileCount = loadedFiles.length;

  // Viewer styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#252524' : '#f8f5f2',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  };

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
    padding: '16px 24px',
  };

  const headerTopStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    borderRadius: 6,
    border: `1px solid ${isDarkMode ? '#4a4a4a' : '#bab7b4'}`,
    backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
    color: isDarkMode ? '#fbfaf9' : '#252524',
    cursor: 'pointer',
  };

  const toggleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 6,
    backgroundColor: isDarkMode ? '#f96302' : '#252524',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: 4,
    overflowX: 'auto',
  };

  const getNavButtonStyle = (isActive: boolean, requiresTokens: boolean = false): React.CSSProperties => ({
    padding: '8px 16px',
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: isActive ? 600 : 400,
    borderRadius: 6,
    border: 'none',
    backgroundColor: isActive
      ? (isDarkMode ? '#f96302' : '#252524')
      : 'transparent',
    color: isActive
      ? '#ffffff'
      : (requiresTokens && !hasTokens)
        ? (isDarkMode ? '#4a4a4a' : '#d0d0d0')
        : (isDarkMode ? '#bab7b4' : '#585756'),
    cursor: (requiresTokens && !hasTokens) ? 'default' : 'pointer',
    whiteSpace: 'nowrap',
    opacity: (requiresTokens && !hasTokens) ? 0.5 : 1,
  });

  const mainStyle: React.CSSProperties = {
    maxWidth: (activeSection === 'cascade' || activeSection === 'passport') ? 1400 : 1200,
    margin: '0 auto',
    padding: '24px',
    transition: 'max-width 0.3s ease',
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerTopStyle}>
          <div style={titleStyle}>
            <span>🎨</span>
            Tokens Studio Viewer
            {fileCount > 0 && (
              <span style={{
                fontSize: 12,
                fontFamily: FONT_OPEN_SANS,
                fontWeight: 400,
                backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de',
                padding: '4px 8px',
                borderRadius: 4,
              }}>
                {fileCount} file{fileCount > 1 ? 's' : ''} from {repoUrl.replace('https://github.com/', '')}
              </span>
            )}
          </div>
          <div style={controlsStyle}>
            {onBack && (
              <button onClick={onBack} style={buttonStyle}>
                ← Hardcoded Viewer
              </button>
            )}
            <button onClick={() => loadFromRepo()} style={buttonStyle}>
              Reload Repo
            </button>
            <button onClick={clear} style={buttonStyle}>
              Load New File
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={toggleStyle}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
        <nav style={navStyle}>
          {SECTIONS.map(section => {
            const needsTokens = section.id !== 'cascade' && section.id !== 'passport';
            const disabled = needsTokens && !hasTokens;
            return (
              <button
                key={section.id}
                onClick={() => { if (!disabled) setActiveSection(section.id); }}
                style={getNavButtonStyle(activeSection === section.id, needsTokens)}
              >
                {section.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main style={mainStyle}>
        <div key={activeSection} className="tab-content">
          {activeSection === 'cascade' && (
            <TokensCascadeDisplay isDarkMode={isDarkMode} />
          )}
          {activeSection === 'passport' && (
            <PlatformPassport semantic={isDarkMode ? semanticDark : semanticLight} isDark={isDarkMode} />
          )}
          {hasTokens && activeSection === 'all' && (
            <AllTokensDisplay parsedTokens={parsedTokens} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'semantic' && (
            <SemanticTokensDisplay
              lightTokens={parsedTokens.colors.semantic.light}
              darkTokens={parsedTokens.colors.semantic.dark}
              isDarkMode={isDarkMode}
            />
          )}
          {hasTokens && activeSection === 'pairings' && (
            <PairingsDisplay parsedTokens={parsedTokens} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'colors' && (
            <ColorTokensDisplay colors={parsedTokens.colors} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'typography' && (
            <TypographyTokensDisplay typography={parsedTokens.typography} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'spacing' && (
            <SpacingTokensDisplay spacing={parsedTokens.spacing} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'radius' && (
            <RadiusTokensDisplay radius={parsedTokens.radius} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'border' && (
            <BorderTokensDisplay borderWidth={parsedTokens.borderWidth} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'effects' && (
            <ElevationTokensDisplay effects={parsedTokens.effects} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'components' && (
            <ComponentTokensDisplay components={parsedTokens.components} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'table' && (
            <TokenTableDisplay parsedTokens={parsedTokens} isDarkMode={isDarkMode} />
          )}
          {hasTokens && activeSection === 'raw' && (
            <RawTokenTree tokens={tokensFile} />
          )}
          {!hasTokens && !standaloneSection && (
            <div style={{
              padding: 48, textAlign: 'center',
              color: isDarkMode ? '#8b949e' : '#787675', fontFamily: FONT_OPEN_SANS,
            }}>
              Load a token file to view this tab.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
