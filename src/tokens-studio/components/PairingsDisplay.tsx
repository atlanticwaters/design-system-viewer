import React, { useMemo, useState } from 'react';
import { ParsedTokens, TokenCategory, ResolvedToken } from '../types/tokens';
import { getContrastRatio, getWcagRating, WcagRating } from '../../utils/contrast';
import { FONT_OPEN_SANS } from '../utils/fonts';

interface PairingsDisplayProps {
  parsedTokens: ParsedTokens;
  isDarkMode: boolean;
}

// Flatten token category to get all tokens
function flattenCategory(category: TokenCategory): ResolvedToken[] {
  const tokens = [...category.tokens];
  if (category.subcategories) {
    for (const sub of category.subcategories) {
      tokens.push(...flattenCategory(sub));
    }
  }
  return tokens;
}

// Get badge colors based on WCAG rating
function getRatingColors(rating: WcagRating) {
  switch (rating) {
    case 'AAA':
      return { bg: '#4A8165', text: '#FFFFFF' };
    case 'AA':
      return { bg: '#6974A5', text: '#FFFFFF' };
    case 'AA Large':
      return { bg: '#CFB73A', text: '#252524' };
    case 'Fail':
      return { bg: '#DF3427', text: '#FFFFFF' };
  }
}

// Sample icon component
function SampleIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Single half of the pairing card (light or dark)
function PairingHalf({
  backgroundColor,
  textColor,
  mode,
}: {
  backgroundColor: string;
  textColor: string;
  mode: 'Light' | 'Dark';
}) {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const rating = getWcagRating(ratio);
  const ratingColors = getRatingColors(rating);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Mode label */}
      <div
        style={{
          padding: '4px 8px',
          backgroundColor: mode === 'Light' ? '#F8F5F2' : '#252524',
          color: mode === 'Light' ? '#585756' : '#BAB7B4',
          fontSize: 10,
          fontFamily: FONT_OPEN_SANS,
          fontWeight: 600,
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {mode}
      </div>

      {/* Sample Area */}
      <div
        style={{
          backgroundColor: backgroundColor,
          padding: 16,
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flex: 1,
        }}
      >
        <span
          style={{
            color: textColor,
            fontSize: 14,
            fontFamily: FONT_OPEN_SANS,
            fontWeight: 500,
          }}
        >
          Text
        </span>
        <SampleIcon color={textColor} />
      </div>

      {/* Rating Area */}
      <div
        style={{
          padding: 8,
          backgroundColor: mode === 'Light' ? '#F8F5F2' : '#1A1A1A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: FONT_OPEN_SANS,
            color: mode === 'Light' ? '#252524' : '#F8F5F2',
          }}
        >
          {ratio.toFixed(1)}:1
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 9,
            fontFamily: FONT_OPEN_SANS,
            fontWeight: 700,
            backgroundColor: ratingColors.bg,
            color: ratingColors.text,
          }}
        >
          {rating}
        </span>
      </div>
    </div>
  );
}

// Dual pairing card showing light and dark side by side
function DualPairingCard({
  surfaceToken,
  textToken,
  lightSurface,
  lightText,
  darkSurface,
  darkText,
  isDarkMode,
}: {
  surfaceToken: string;
  textToken: string;
  lightSurface: string;
  lightText: string;
  darkSurface: string;
  darkText: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
      }}
    >
      {/* Token Labels */}
      <div
        style={{
          padding: 8,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          borderBottom: `1px solid ${isDarkMode ? '#3a3a3a' : '#e5e1de'}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#8b949e' : '#787675',
            marginBottom: 2,
          }}
        >
          <strong style={{ color: isDarkMode ? '#fbfaf9' : '#252524' }}>Surface:</strong> {surfaceToken}
        </div>
        <div
          style={{
            fontSize: 11,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#8b949e' : '#787675',
          }}
        >
          <strong style={{ color: isDarkMode ? '#fbfaf9' : '#252524' }}>Text:</strong> {textToken}
        </div>
      </div>

      {/* Light/Dark comparison */}
      <div style={{ display: 'flex' }}>
        <PairingHalf
          backgroundColor={lightSurface}
          textColor={lightText}
          mode="Light"
        />
        <div style={{ width: 1, backgroundColor: isDarkMode ? '#3a3a3a' : '#e5e1de' }} />
        <PairingHalf
          backgroundColor={darkSurface}
          textColor={darkText}
          mode="Dark"
        />
      </div>
    </div>
  );
}

// Section component for grouping pairings
function PairingSection({
  title,
  subtitle,
  pairings,
  isDarkMode,
}: {
  title: string;
  subtitle?: string;
  pairings: Array<{
    surfaceToken: string;
    textToken: string;
    lightSurface: string;
    lightText: string;
    darkSurface: string;
    darkText: string;
  }>;
  isDarkMode: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (pairings.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }} className="animate-section">
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          fontFamily: FONT_OPEN_SANS,
          textTransform: 'capitalize' as const,
          color: isDarkMode ? '#fbfaf9' : '#252524',
          marginBottom: 4,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          ▶
        </span>
        {title}
        <span style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, fontWeight: 400, color: isDarkMode ? '#8b949e' : '#787675' }}>
          ({pairings.length} pairings)
        </span>
      </h3>
      {subtitle && (
        <p
          style={{
            fontSize: 13,
            fontFamily: FONT_OPEN_SANS,
            color: isDarkMode ? '#8b949e' : '#787675',
            marginBottom: 16,
            marginLeft: 24,
          }}
        >
          {subtitle}
        </p>
      )}
      {isExpanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {pairings.map((pairing, idx) => (
            <div key={`${pairing.surfaceToken}-${pairing.textToken}-${idx}`} className="animate-item" style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}>
              <DualPairingCard {...pairing} isDarkMode={isDarkMode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PairingsDisplay({ parsedTokens, isDarkMode }: PairingsDisplayProps) {
  // Build structured token maps from semantic tokens
  // Structure: Background.Surface-Color, Background.Container-Color, Text.On-Surface-Color, Text.On-Container-Color
  const { structuredLight, structuredDark } = useMemo(() => {

    // Structured maps for specific categories
    const structLight = {
      surfaceColors: new Map<string, string>(),
      containerColors: new Map<string, string>(),
      onSurfaceColors: new Map<string, string>(),
      onContainerColors: new Map<string, string>(),
    };
    const structDark = {
      surfaceColors: new Map<string, string>(),
      containerColors: new Map<string, string>(),
      onSurfaceColors: new Map<string, string>(),
      onContainerColors: new Map<string, string>(),
    };

    // Process light tokens
    for (const category of parsedTokens.colors.semantic.light) {
      const tokens = flattenCategory(category);
      for (const token of tokens) {
        const pathLower = token.path.toLowerCase();

        // Categorize tokens based on their path structure
        // Pattern: "Semantic Tokens/Light Mode.Background.Surface-Color.{name}"
        if (pathLower.includes('background.surface-color') || pathLower.includes('background/surface-color')) {
          structLight.surfaceColors.set(token.name, String(token.value));
        } else if (pathLower.includes('background.container-color') || pathLower.includes('background/container-color')) {
          structLight.containerColors.set(token.name, String(token.value));
        } else if (pathLower.includes('text.on-surface-color') || pathLower.includes('text/on-surface-color')) {
          structLight.onSurfaceColors.set(token.name, String(token.value));
        } else if (pathLower.includes('text.on-container-color') || pathLower.includes('text/on-container-color')) {
          structLight.onContainerColors.set(token.name, String(token.value));
        }
        // Also check Icon categories
        else if (pathLower.includes('icon.on-surface-color') || pathLower.includes('icon/on-surface-color')) {
          // Don't overwrite if already set from Text
          if (!structLight.onSurfaceColors.has(token.name)) {
            structLight.onSurfaceColors.set(token.name, String(token.value));
          }
        } else if (pathLower.includes('icon.on-container-color') || pathLower.includes('icon/on-container-color')) {
          if (!structLight.onContainerColors.has(token.name)) {
            structLight.onContainerColors.set(token.name, String(token.value));
          }
        }
      }
    }

    // Process dark tokens
    for (const category of parsedTokens.colors.semantic.dark) {
      const tokens = flattenCategory(category);
      for (const token of tokens) {
        const pathLower = token.path.toLowerCase();

        if (pathLower.includes('background.surface-color') || pathLower.includes('background/surface-color')) {
          structDark.surfaceColors.set(token.name, String(token.value));
        } else if (pathLower.includes('background.container-color') || pathLower.includes('background/container-color')) {
          structDark.containerColors.set(token.name, String(token.value));
        } else if (pathLower.includes('text.on-surface-color') || pathLower.includes('text/on-surface-color')) {
          structDark.onSurfaceColors.set(token.name, String(token.value));
        } else if (pathLower.includes('text.on-container-color') || pathLower.includes('text/on-container-color')) {
          structDark.onContainerColors.set(token.name, String(token.value));
        }
        else if (pathLower.includes('icon.on-surface-color') || pathLower.includes('icon/on-surface-color')) {
          if (!structDark.onSurfaceColors.has(token.name)) {
            structDark.onSurfaceColors.set(token.name, String(token.value));
          }
        } else if (pathLower.includes('icon.on-container-color') || pathLower.includes('icon/on-container-color')) {
          if (!structDark.onContainerColors.has(token.name)) {
            structDark.onContainerColors.set(token.name, String(token.value));
          }
        }
      }
    }

    return {
      structuredLight: structLight,
      structuredDark: structDark,
    };
  }, [parsedTokens.colors.semantic]);

  // Build pairings from structured semantic tokens
  const pairings = useMemo(() => {
    type PairingType = {
      surfaceToken: string;
      textToken: string;
      lightSurface: string;
      lightText: string;
      darkSurface: string;
      darkText: string;
    };

    const surfacePairings: PairingType[] = [];
    const containerPairings: PairingType[] = [];

    // Create Surface + On-Surface pairings
    // For each surface color, pair it with each on-surface text color
    for (const [surfaceName, lightSurface] of structuredLight.surfaceColors.entries()) {
      const darkSurface = structuredDark.surfaceColors.get(surfaceName);
      if (!darkSurface) continue;

      for (const [textName, lightText] of structuredLight.onSurfaceColors.entries()) {
        const darkText = structuredDark.onSurfaceColors.get(textName);
        if (!darkText) continue;

        surfacePairings.push({
          surfaceToken: `Surface: ${surfaceName}`,
          textToken: `On-Surface: ${textName}`,
          lightSurface,
          lightText,
          darkSurface,
          darkText,
        });
      }
    }

    // Create Container + On-Container pairings
    for (const [containerName, lightSurface] of structuredLight.containerColors.entries()) {
      const darkSurface = structuredDark.containerColors.get(containerName);
      if (!darkSurface) continue;

      for (const [textName, lightText] of structuredLight.onContainerColors.entries()) {
        const darkText = structuredDark.onContainerColors.get(textName);
        if (!darkText) continue;

        containerPairings.push({
          surfaceToken: `Container: ${containerName}`,
          textToken: `On-Container: ${textName}`,
          lightSurface,
          lightText,
          darkSurface,
          darkText,
        });
      }
    }

    return { surfacePairings, containerPairings };
  }, [structuredLight, structuredDark]);

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

  const totalPairings =
    pairings.surfacePairings.length +
    pairings.containerPairings.length;

  if (totalPairings === 0) {
    return (
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Text/Surface Pairings</h2>
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            color: isDarkMode ? '#8b949e' : '#787675',
          }}
        >
          No surface/text pairings found. Load a tokens file with Component Tokens (Light Mode/Dark Mode) containing surface, on-surface, container, and on-container tokens to see pairings here.
        </div>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <h2 style={sectionTitleStyle}>Text/Surface Pairings</h2>

      {/* WCAG Guidelines Info */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f5f2',
          marginBottom: 24,
        }}
      >
        <h4 style={{ fontSize: 14, fontFamily: FONT_OPEN_SANS, fontWeight: 600, color: isDarkMode ? '#fbfaf9' : '#252524', marginBottom: 8 }}>
          WCAG Contrast Guidelines
        </h4>
        <div style={{ fontSize: 13, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#8b949e' : '#787675' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <span>
              <strong style={{ color: '#4A8165' }}>AAA</strong>: 7:1+ (enhanced)
            </span>
            <span>
              <strong style={{ color: '#6974A5' }}>AA</strong>: 4.5:1+ (normal text)
            </span>
            <span>
              <strong style={{ color: '#CFB73A' }}>AA Large</strong>: 3:1+ (large text)
            </span>
            <span>
              <strong style={{ color: '#DF3427' }}>Fail</strong>: &lt;3:1
            </span>
          </div>
        </div>
        <p style={{ fontSize: 12, fontFamily: FONT_OPEN_SANS, color: isDarkMode ? '#6b6b6b' : '#bab7b4', marginTop: 8 }}>
          Each card shows Light mode on the left and Dark mode on the right for direct comparison.
        </p>
      </div>

      {/* Surface Pairings */}
      <PairingSection
        title="On-Surface Pairings"
        subtitle="Text colors designed for use on surface backgrounds"
        pairings={pairings.surfacePairings}
        isDarkMode={isDarkMode}
      />

      {/* Container Pairings */}
      <PairingSection
        title="On-Container Pairings"
        subtitle="Text colors designed for use on container backgrounds"
        pairings={pairings.containerPairings}
        isDarkMode={isDarkMode}
      />

      {/* Summary */}
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
        Showing {totalPairings} text/surface pairings. Toggle dark mode in the header to verify both themes look correct.
      </div>
    </div>
  );
}
