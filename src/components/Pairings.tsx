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

interface PairingCardProps {
  backgroundColor: string;
  backgroundToken: string;
  textColor: string;
  textToken: string;
  semantic: SemanticColors;
}

// Sample icon component (clock icon)
function SampleIcon({ color, size = 18 }: { color: string; size?: number }) {
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

// Get badge colors based on WCAG rating
function getRatingColors(rating: WcagRating, semantic: SemanticColors) {
  switch (rating) {
    case 'AAA':
      return { bg: semantic.success, text: '#FFFFFF' };
    case 'AA':
      return { bg: semantic.info, text: '#FFFFFF' };
    case 'AA Large':
      return { bg: semantic.warning, text: '#252524' };
    case 'Fail':
      return { bg: semantic.error, text: '#FFFFFF' };
  }
}

function PairingCard({
  backgroundColor,
  backgroundToken,
  textColor,
  textToken,
  semantic,
}: PairingCardProps) {
  const ratio = getContrastRatio(textColor, backgroundColor);
  const rating = getWcagRating(ratio);
  const ratingColors = getRatingColors(rating, semantic);

  return (
    <div
      style={{
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${semantic.border}`,
      }}
    >
      {/* Sample Area */}
      <div
        style={{
          backgroundColor: backgroundColor,
          padding: spacing[6],
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing[3],
        }}
      >
        <span
          style={{
            color: textColor,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          Sample Text
        </span>
        <SampleIcon color={textColor} />
      </div>

      {/* Info Area */}
      <div
        style={{
          padding: spacing[3],
          backgroundColor: semantic.surfaceSecondary,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: semantic.onSurfaceSecondary,
            marginBottom: spacing[1],
          }}
        >
          <strong style={{ color: semantic.onSurface }}>Surface:</strong> {backgroundToken}
        </div>
        <div
          style={{
            fontSize: 11,
            color: semantic.onSurfaceSecondary,
            marginBottom: spacing[2],
          }}
        >
          <strong style={{ color: semantic.onSurface }}>Text:</strong> {textToken}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontFamily: 'monospace',
              color: semantic.onSurface,
            }}
          >
            {ratio.toFixed(2)}:1
          </span>
          <span
            style={{
              padding: `${spacing[1]}px ${spacing[2]}px`,
              borderRadius: borderRadius.sm,
              fontSize: 10,
              fontWeight: 600,
              backgroundColor: ratingColors.bg,
              color: ratingColors.text,
            }}
          >
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Pairings({ semantic, isDark }: PairingsProps) {
  const currentSurfaces = isDark ? surfacesDark : surfaces;
  const currentFills = isDark ? fillsDark : fills;
  const currentOnFill = isDark ? onFillDark : onFill;

  // Surface + Text pairings data
  const surfacePairings = [
    {
      name: 'surface',
      color: currentSurfaces.surface,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceContainerLowest',
      color: currentSurfaces.surfaceContainerLowest,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceContainerLow',
      color: currentSurfaces.surfaceContainerLow,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceContainer',
      color: currentSurfaces.surfaceContainer,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceContainerHigh',
      color: currentSurfaces.surfaceContainerHigh,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceContainerHighest',
      color: currentSurfaces.surfaceContainerHighest,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceDim',
      color: currentSurfaces.surfaceDim,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceBright',
      color: currentSurfaces.surfaceBright,
      textPairings: [
        { token: 'onSurface', color: semantic.onSurface },
        { token: 'onSurfaceSecondary', color: semantic.onSurfaceSecondary },
        { token: 'onSurfaceTertiary', color: semantic.onSurfaceTertiary },
      ],
    },
    {
      name: 'surfaceInverse',
      color: currentSurfaces.surfaceInverse,
      textPairings: [
        {
          token: 'onSurface (inverted)',
          color: isDark ? semanticLight.onSurface : semanticDark.onSurface,
        },
        {
          token: 'onSurfaceSecondary (inv)',
          color: isDark ? semanticLight.onSurfaceSecondary : semanticDark.onSurfaceSecondary,
        },
      ],
    },
  ];

  // Fill + onFill pairings data
  const fillPairings = [
    { fillName: 'primary', fillColor: currentFills.primary, textToken: 'onPrimary', textColor: currentOnFill.onPrimary },
    { fillName: 'secondary', fillColor: currentFills.secondary, textToken: 'onSecondary', textColor: currentOnFill.onSecondary },
    { fillName: 'tertiary', fillColor: currentFills.tertiary, textToken: 'onTertiary', textColor: currentOnFill.onTertiary },
    { fillName: 'neutral', fillColor: currentFills.neutral, textToken: 'onNeutral', textColor: currentOnFill.onNeutral },
    { fillName: 'inverse', fillColor: currentFills.inverse, textToken: 'onInverse', textColor: currentOnFill.onInverse },
    { fillName: 'error', fillColor: currentFills.error, textToken: 'onError', textColor: currentOnFill.onError },
    { fillName: 'success', fillColor: currentFills.success, textToken: 'onSuccess', textColor: currentOnFill.onSuccess },
    { fillName: 'warning', fillColor: currentFills.warning, textToken: 'onWarning', textColor: currentOnFill.onWarning },
    { fillName: 'info', fillColor: currentFills.info, textToken: 'onInfo', textColor: currentOnFill.onInfo },
  ];

  // Semantic text on surfaces data
  const semanticTextPairings = [
    { textName: 'primary', textColor: semantic.primary },
    { textName: 'secondary', textColor: semantic.secondary },
    { textName: 'error', textColor: semantic.error },
    { textName: 'success', textColor: semantic.success },
    { textName: 'warning', textColor: semantic.warning },
    { textName: 'info', textColor: semantic.info },
  ];

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
              <strong style={{ color: semantic.success }}>AAA</strong>: 7:1+ (enhanced)
            </span>
            <span>
              <strong style={{ color: semantic.info }}>AA</strong>: 4.5:1+ (normal text)
            </span>
            <span>
              <strong style={{ color: semantic.warning }}>AA Large</strong>: 3:1+ (large text)
            </span>
            <span>
              <strong style={{ color: semantic.error }}>Fail</strong>: &lt;3:1
            </span>
          </div>
        </div>
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing[4],
          }}
        >
          {surfacePairings.flatMap((surface) =>
            surface.textPairings.map((text) => (
              <PairingCard
                key={`${surface.name}-${text.token}`}
                backgroundColor={surface.color}
                backgroundToken={surface.name}
                textColor={text.color}
                textToken={text.token}
                semantic={semantic}
              />
            ))
          )}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing[4],
          }}
        >
          {fillPairings.map((pairing) => (
            <PairingCard
              key={`fill-${pairing.fillName}`}
              backgroundColor={pairing.fillColor}
              backgroundToken={pairing.fillName}
              textColor={pairing.textColor}
              textToken={pairing.textToken}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing[4],
          }}
        >
          {semanticTextPairings.map((pairing) => (
            <PairingCard
              key={`semantic-${pairing.textName}`}
              backgroundColor={currentSurfaces.surface}
              backgroundToken="surface"
              textColor={pairing.textColor}
              textToken={pairing.textName}
              semantic={semantic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
