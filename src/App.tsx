import { useState } from 'react';
import {
  ColorPalette,
  Typography,
  Buttons,
  Inputs,
  Cards,
  Lists,
  Navigation,
  Toggles,
  Alerts,
  Surfaces,
  Fills,
  Outlines,
  States,
  Pairings,
  TokenCascade,
} from './components';
import { PlatformPassport } from './components/visualizations';
import { semanticLight, semanticDark, colors } from './tokens/colors';
import { typography } from './tokens/typography';
import { spacing } from './tokens/spacing';
import { borderRadius } from './tokens/radius';
import { TokensStudioViewer } from './tokens-studio';

type ViewerMode = 'hardcoded' | 'tokens-studio';

function App() {
  const [viewerMode, setViewerMode] = useState<ViewerMode>('tokens-studio');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('colors');

  // Render Tokens Studio Viewer if in that mode
  if (viewerMode === 'tokens-studio') {
    return <TokensStudioViewer onBack={() => setViewerMode('hardcoded')} />;
  }

  const semantic = isDarkMode ? semanticDark : semanticLight;

  const sections = [
    { id: 'colors', label: 'Colors' },
    { id: 'surfaces', label: 'Surfaces' },
    { id: 'fills', label: 'Fills' },
    { id: 'pairings', label: 'Pairings' },
    { id: 'outlines', label: 'Outlines' },
    { id: 'states', label: 'States' },
    { id: 'typography', label: 'Typography' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'inputs', label: 'Inputs' },
    { id: 'cards', label: 'Cards' },
    { id: 'lists', label: 'Lists' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'toggles', label: 'Toggles' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'cascade', label: 'Token Cascade' },
    { id: 'passport', label: 'Platform Passport' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: semantic.surface,
      color: semantic.onSurface,
      transition: 'background-color 0.3s ease, color 0.3s ease',
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: semantic.surface,
        borderBottom: `1px solid ${semantic.border}`,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: `${spacing[4]}px ${spacing[6]}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              ...typography.h3,
              color: semantic.onSurface,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <span style={{ color: semantic.primary }}>Design System</span>
              <span style={{ fontWeight: 400 }}>Viewer</span>
            </h1>
            <p style={{
              ...typography.bodySm,
              color: semantic.onSurfaceSecondary,
              margin: `${spacing[1]}px 0 0`,
            }}>
              iOS 18 + Android 15 Component Reference
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
            {/* Platform Badges */}
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <span style={{
                padding: `${spacing[1]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: semantic.surfaceSecondary,
                fontSize: 12,
                fontWeight: 500,
              }}>
                iOS 18
              </span>
              <span style={{
                padding: `${spacing[1]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: semantic.surfaceSecondary,
                fontSize: 12,
                fontWeight: 500,
              }}>
                Android 15
              </span>
            </div>

            {/* Tokens Studio Viewer Toggle */}
            <button
              onClick={() => setViewerMode('tokens-studio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: colors.brand['300'],
                border: 'none',
                cursor: 'pointer',
                color: colors.neutrals.white,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <span>🎨</span>
              Tokens Studio
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
                padding: `${spacing[2]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: semantic.surfaceSecondary,
                border: 'none',
                cursor: 'pointer',
                color: semantic.onSurface,
              }}
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: `0 ${spacing[6]}px ${spacing[3]}px`,
          display: 'flex',
          gap: spacing[1],
          overflowX: 'auto',
        }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              style={{
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: activeSection === section.id ? semantic.primary : 'transparent',
                color: activeSection === section.id ? colors.neutrals.white : semantic.onSurfaceSecondary,
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: `${spacing[8]}px ${spacing[6]}px`,
      }}>
        {/* Font Info Banner */}
        <div style={{
          backgroundColor: semantic.surfaceSecondary,
          borderRadius: borderRadius.lg,
          padding: spacing[4],
          marginBottom: spacing[8],
          display: 'flex',
          alignItems: 'center',
          gap: spacing[4],
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: borderRadius.md,
            backgroundColor: semantic.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.neutrals.white} strokeWidth="2">
              <path d="M4 7V4h16v3M9 20h6M12 4v16" />
            </svg>
          </div>
          <div>
            <h3 style={{ ...typography.h6, color: semantic.onSurface, margin: 0 }}>
              Font: Open Sans
            </h3>
            <p style={{ ...typography.bodySm, color: semantic.onSurfaceSecondary, margin: `${spacing[1]}px 0 0` }}>
              Cross-platform Google Font used consistently across iOS, Android, and Web
            </p>
          </div>
        </div>

        <ColorPalette semantic={semantic} isDarkMode={isDarkMode} />
        <Surfaces semantic={semantic} isDark={isDarkMode} />
        <Fills semantic={semantic} isDark={isDarkMode} />
        <Pairings semantic={semantic} isDark={isDarkMode} />
        <Outlines semantic={semantic} isDark={isDarkMode} />
        <States semantic={semantic} isDark={isDarkMode} />
        <Typography semantic={semantic} />
        <Buttons semantic={semantic} />
        <Inputs semantic={semantic} />
        <Cards semantic={semantic} />
        <Lists semantic={semantic} />
        <Navigation semantic={semantic} />
        <Toggles semantic={semantic} />
        <Alerts semantic={semantic} />
        <TokenCascade semantic={semantic} isDark={isDarkMode} />
        <PlatformPassport semantic={semantic} isDark={isDarkMode} />

        {/* Footer */}
        <footer style={{
          marginTop: spacing[12],
          paddingTop: spacing[8],
          borderTop: `1px solid ${semantic.border}`,
          textAlign: 'center',
        }}>
          <p style={{ ...typography.bodySm, color: semantic.onSurfaceTertiary }}>
            Design System Viewer - Built for iOS 18 & Android 15 comparison
          </p>
          <p style={{ ...typography.bodyXs, color: semantic.onSurfaceTertiary, marginTop: spacing[2] }}>
            Tokens sourced from Figma export (v1.0.0, 2025-12-09)
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
