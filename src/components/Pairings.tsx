import { SemanticColors, semanticLight, semanticDark } from '../tokens/colors';
import { surfaces, surfacesDark } from '../tokens/surfaces';
import { fills, fillsDark, onFill, onFillDark } from '../tokens/fills';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { borderRadius } from '../tokens/radius';
import { getContrastRatio, getWcagRating, WcagRating } from '../utils/contrast';

interface PairingsProps {
  semantic: SemanticColors;
  isDark: boolean;
}

interface PairingHalfProps {
  backgroundColor: string;
  textColor: string;
  mode: 'Light' | 'Dark';
  semantic: SemanticColors;
}

interface DualPairingCardProps {
  backgroundToken: string;
  textToken: string;
  light: { backgroundColor: string; textColor: string };
  dark: { backgroundColor: string; textColor: string };
  semantic: SemanticColors;
}

// Sample icon component (clock icon)
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

// Get badge colors based on WCAG rating (uses fixed colors for consistency)
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

// Single half of the pairing card (light or dark)
function PairingHalf({ backgroundColor, textColor, mode }: Omit<PairingHalfProps, 'semantic'>) {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const rating = getWcagRating(ratio);
  const ratingColors = getRatingColors(rating);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Mode label */}
      <div
        style={{
          padding: `${spacing[1]}px ${spacing[2]}px`,
          backgroundColor: mode === 'Light' ? '#F8F5F2' : '#252524',
          color: mode === 'Light' ? '#585756' : '#BAB7B4',
          fontSize: 10,
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
          padding: spacing[4],
          minHeight: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[2],
          flex: 1,
        }}
      >
        <span
          style={{
            color: textColor,
            fontSize: 14,
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
          padding: spacing[2],
          backgroundColor: mode === 'Light' ? '#F8F5F2' : '#1A1A1A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: 'monospace',
            color: mode === 'Light' ? '#252524' : '#F8F5F2',
          }}
        >
          {ratio.toFixed(1)}:1
        </span>
        <span
          style={{
            padding: `2px ${spacing[2]}px`,
            borderRadius: borderRadius.sm,
            fontSize: 9,
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
  backgroundToken,
  textToken,
  light,
  dark,
  semantic,
}: DualPairingCardProps) {
  return (
    <div
      style={{
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${semantic.border}`,
      }}
    >
      {/* Token Labels */}
      <div
        style={{
          padding: spacing[2],
          backgroundColor: semantic.surfaceSecondary,
          borderBottom: `1px solid ${semantic.border}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: semantic.onSurfaceSecondary,
            marginBottom: 2,
          }}
        >
          <strong style={{ color: semantic.onSurface }}>Surface:</strong> {backgroundToken}
        </div>
        <div
          style={{
            fontSize: 11,
            color: semantic.onSurfaceSecondary,
          }}
        >
          <strong style={{ color: semantic.onSurface }}>Text:</strong> {textToken}
        </div>
      </div>

      {/* Light/Dark comparison */}
      <div style={{ display: 'flex' }}>
        <PairingHalf
          backgroundColor={light.backgroundColor}
          textColor={light.textColor}
          mode="Light"
        />
        <div style={{ width: 1, backgroundColor: semantic.border }} />
        <PairingHalf
          backgroundColor={dark.backgroundColor}
          textColor={dark.textColor}
          mode="Dark"
        />
      </div>
    </div>
  );
}

export function Pairings({ semantic }: PairingsProps) {
  // Surface + Text pairings data (showing all surface types with all text levels)
  const surfaceTextPairings = [
    { surfaceToken: 'surface', textToken: 'onSurface' },
    { surfaceToken: 'surface', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surface', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceContainerLowest', textToken: 'onSurface' },
    { surfaceToken: 'surfaceContainerLowest', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceContainerLowest', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceContainerLow', textToken: 'onSurface' },
    { surfaceToken: 'surfaceContainerLow', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceContainerLow', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceContainer', textToken: 'onSurface' },
    { surfaceToken: 'surfaceContainer', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceContainer', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceContainerHigh', textToken: 'onSurface' },
    { surfaceToken: 'surfaceContainerHigh', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceContainerHigh', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceContainerHighest', textToken: 'onSurface' },
    { surfaceToken: 'surfaceContainerHighest', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceContainerHighest', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceDim', textToken: 'onSurface' },
    { surfaceToken: 'surfaceDim', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceDim', textToken: 'onSurfaceTertiary' },
    { surfaceToken: 'surfaceBright', textToken: 'onSurface' },
    { surfaceToken: 'surfaceBright', textToken: 'onSurfaceSecondary' },
    { surfaceToken: 'surfaceBright', textToken: 'onSurfaceTertiary' },
  ];

  // Inverse surface pairings (uses opposite mode's text colors)
  const inverseSurfacePairings = [
    { surfaceToken: 'surfaceInverse', textToken: 'onSurface (inv)' },
    { surfaceToken: 'surfaceInverse', textToken: 'onSurfaceSecondary (inv)' },
  ];

  // Fill + onFill pairings
  const fillPairings = [
    { fillToken: 'primary', textToken: 'onPrimary' },
    { fillToken: 'secondary', textToken: 'onSecondary' },
    { fillToken: 'tertiary', textToken: 'onTertiary' },
    { fillToken: 'neutral', textToken: 'onNeutral' },
    { fillToken: 'inverse', textToken: 'onInverse' },
    { fillToken: 'error', textToken: 'onError' },
    { fillToken: 'success', textToken: 'onSuccess' },
    { fillToken: 'warning', textToken: 'onWarning' },
    { fillToken: 'info', textToken: 'onInfo' },
  ];

  // Semantic text on surface pairings
  const semanticTextTokens = ['primary', 'secondary', 'error', 'success', 'warning', 'info'];

  // Helper to get surface color
  const getSurfaceColor = (token: string, isDark: boolean) => {
    const surfaceMap = isDark ? surfacesDark : surfaces;
    return surfaceMap[token as keyof typeof surfaceMap] || surfaceMap.surface;
  };

  // Helper to get text color
  const getTextColor = (token: string, isDark: boolean) => {
    const semanticMap = isDark ? semanticDark : semanticLight;
    const tokenKey = token.replace(' (inv)', '') as keyof typeof semanticMap;

    // Handle inverse surface text (use opposite mode)
    if (token.includes('(inv)')) {
      const oppositeMap = isDark ? semanticLight : semanticDark;
      return oppositeMap[tokenKey as keyof typeof oppositeMap];
    }

    return semanticMap[tokenKey];
  };

  // Helper to get fill color
  const getFillColor = (token: string, isDark: boolean) => {
    const fillMap = isDark ? fillsDark : fills;
    return fillMap[token as keyof typeof fillMap];
  };

  // Helper to get onFill color
  const getOnFillColor = (token: string, isDark: boolean) => {
    const onFillMap = isDark ? onFillDark : onFill;
    return onFillMap[token as keyof typeof onFillMap];
  };

  return (
    <section id="pairings" style={{ marginBottom: spacing[12] }}>
      <h2
        style={{
          ...typography.h4,
          color: semantic.primary,
          borderBottom: `2px solid ${semantic.primary}`,
          paddingBottom: spacing[2],
          marginBottom: spacing[6],
        }}
      >
        Text/Surface Pairings
      </h2>

      {/* WCAG Guidelines Info */}
      <div
        style={{
          padding: spacing[4],
          borderRadius: borderRadius.lg,
          backgroundColor: semantic.surfaceSecondary,
          marginBottom: spacing[6],
        }}
      >
        <h4 style={{ ...typography.bodyMdBold, color: semantic.onSurface, marginBottom: spacing[2] }}>
          WCAG Contrast Guidelines
        </h4>
        <div style={{ ...typography.bodySm, color: semantic.onSurfaceSecondary }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[4] }}>
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
        <p style={{ ...typography.bodyXs, color: semantic.onSurfaceTertiary, marginTop: spacing[2] }}>
          Each card shows Light mode on the left and Dark mode on the right for direct comparison.
        </p>
      </div>

      {/* Section 1: Text on Surfaces */}
      <div style={{ marginBottom: spacing[8] }}>
        <h3
          style={{
            ...typography.h6,
            color: semantic.onSurface,
            marginBottom: spacing[4],
          }}
        >
          Text on Surfaces
          <span
            style={{
              ...typography.bodySm,
              fontWeight: 400,
              marginLeft: spacing[2],
              color: semantic.onSurfaceSecondary,
            }}
          >
            (onSurface tokens)
          </span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[4],
          }}
        >
          {surfaceTextPairings.map((pairing) => (
            <DualPairingCard
              key={`${pairing.surfaceToken}-${pairing.textToken}`}
              backgroundToken={pairing.surfaceToken}
              textToken={pairing.textToken}
              light={{
                backgroundColor: getSurfaceColor(pairing.surfaceToken, false),
                textColor: getTextColor(pairing.textToken, false),
              }}
              dark={{
                backgroundColor: getSurfaceColor(pairing.surfaceToken, true),
                textColor: getTextColor(pairing.textToken, true),
              }}
              semantic={semantic}
            />
          ))}
        </div>
      </div>

      {/* Section 1b: Inverse Surface */}
      <div style={{ marginBottom: spacing[8] }}>
        <h3
          style={{
            ...typography.h6,
            color: semantic.onSurface,
            marginBottom: spacing[4],
          }}
        >
          Inverse Surface
          <span
            style={{
              ...typography.bodySm,
              fontWeight: 400,
              marginLeft: spacing[2],
              color: semantic.onSurfaceSecondary,
            }}
          >
            (uses opposite mode text)
          </span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[4],
          }}
        >
          {inverseSurfacePairings.map((pairing) => (
            <DualPairingCard
              key={`${pairing.surfaceToken}-${pairing.textToken}`}
              backgroundToken={pairing.surfaceToken}
              textToken={pairing.textToken}
              light={{
                backgroundColor: getSurfaceColor(pairing.surfaceToken, false),
                textColor: getTextColor(pairing.textToken, false),
              }}
              dark={{
                backgroundColor: getSurfaceColor(pairing.surfaceToken, true),
                textColor: getTextColor(pairing.textToken, true),
              }}
              semantic={semantic}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Text on Fills */}
      <div style={{ marginBottom: spacing[8] }}>
        <h3
          style={{
            ...typography.h6,
            color: semantic.onSurface,
            marginBottom: spacing[4],
          }}
        >
          Text on Fills
          <span
            style={{
              ...typography.bodySm,
              fontWeight: 400,
              marginLeft: spacing[2],
              color: semantic.onSurfaceSecondary,
            }}
          >
            (onFill tokens)
          </span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[4],
          }}
        >
          {fillPairings.map((pairing) => (
            <DualPairingCard
              key={`fill-${pairing.fillToken}`}
              backgroundToken={pairing.fillToken}
              textToken={pairing.textToken}
              light={{
                backgroundColor: getFillColor(pairing.fillToken, false),
                textColor: getOnFillColor(pairing.textToken, false),
              }}
              dark={{
                backgroundColor: getFillColor(pairing.fillToken, true),
                textColor: getOnFillColor(pairing.textToken, true),
              }}
              semantic={semantic}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Semantic Text Colors */}
      <div style={{ marginBottom: spacing[8] }}>
        <h3
          style={{
            ...typography.h6,
            color: semantic.onSurface,
            marginBottom: spacing[4],
          }}
        >
          Semantic Text Colors
          <span
            style={{
              ...typography.bodySm,
              fontWeight: 400,
              marginLeft: spacing[2],
              color: semantic.onSurfaceSecondary,
            }}
          >
            (on default surface)
          </span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing[4],
          }}
        >
          {semanticTextTokens.map((textToken) => (
            <DualPairingCard
              key={`semantic-${textToken}`}
              backgroundToken="surface"
              textToken={textToken}
              light={{
                backgroundColor: surfaces.surface,
                textColor: semanticLight[textToken as keyof typeof semanticLight] as string,
              }}
              dark={{
                backgroundColor: surfacesDark.surface,
                textColor: semanticDark[textToken as keyof typeof semanticDark] as string,
              }}
              semantic={semantic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
