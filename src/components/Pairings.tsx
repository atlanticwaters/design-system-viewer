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
function PairingHalf({ backgroundColor, textColor, mode }: PairingHalfProps) {
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
          <strong style={{ color: semantic.onSurface }}>Background:</strong> {backgroundToken}
        </div>
        <div
          style={{
            fontSize: 11,
            color: semantic.onSurfaceSecondary,
          }}
        >
          <strong style={{ color: semantic.onSurface }}>Text/Icon:</strong> {textToken}
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

// Section header component
function SectionHeader({
  title,
  subtitle,
  semantic
}: {
  title: string;
  subtitle: string;
  semantic: SemanticColors;
}) {
  return (
    <h3
      style={{
        ...typography.h6,
        color: semantic.onSurface,
        marginBottom: spacing[4],
      }}
    >
      {title}
      <span
        style={{
          ...typography.bodySm,
          fontWeight: 400,
          marginLeft: spacing[2],
          color: semantic.onSurfaceSecondary,
        }}
      >
        ({subtitle})
      </span>
    </h3>
  );
}

// Grid wrapper component
function PairingGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: spacing[4],
      }}
    >
      {children}
    </div>
  );
}

export function Pairings({ semantic }: PairingsProps) {
  const currentSurfaces = surfaces;
  const currentSurfacesDark = surfacesDark;
  const currentFills = fills;
  const currentFillsDark = fillsDark;

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

      {/* ===================================================================== */}
      {/* SECTION: Icon on Surface Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Icon on Surface"
          subtitle="system.icon.on-surface-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Primary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.primary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.primary }}
            semantic={semantic}
          />
          {/* Secondary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.secondary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.secondary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.secondary }}
            semantic={semantic}
          />
          {/* Tertiary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.tertiary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.tertiary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.tertiary }}
            semantic={semantic}
          />
          {/* Error */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.error"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.error }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.error }}
            semantic={semantic}
          />
          {/* Success */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.success"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.success }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.success }}
            semantic={semantic}
          />
          {/* Warning */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.warning"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.warning }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.warning }}
            semantic={semantic}
          />
          {/* Informational */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.informational"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.informational }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.informational }}
            semantic={semantic}
          />
          {/* Brand Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="icon.onSurface.brandAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.icon.onSurface.brandAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.icon.onSurface.brandAccent1 }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Text on Surface Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Text on Surface"
          subtitle="system.text.on-surface-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Primary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.primary }}
            semantic={semantic}
          />
          {/* Secondary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.secondary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.secondary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.secondary }}
            semantic={semantic}
          />
          {/* Tertiary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.tertiary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.tertiary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.tertiary }}
            semantic={semantic}
          />
          {/* Quatrenary */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.quatrenary"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.quatrenary }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.quatrenary }}
            semantic={semantic}
          />
          {/* Brand Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.brandAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.brandAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.brandAccent1 }}
            semantic={semantic}
          />
          {/* Error Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.errorAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.errorAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.errorAccent1 }}
            semantic={semantic}
          />
          {/* Success Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.successAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.successAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.successAccent1 }}
            semantic={semantic}
          />
          {/* Warning Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.warningAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.warningAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.warningAccent1 }}
            semantic={semantic}
          />
          {/* Informational Accent 1 */}
          <DualPairingCard
            backgroundToken="surface"
            textToken="text.onSurface.informationalAccent1"
            light={{ backgroundColor: semanticLight.surface, textColor: semanticLight.text.onSurface.informationalAccent1 }}
            dark={{ backgroundColor: semanticDark.surface, textColor: semanticDark.text.onSurface.informationalAccent1 }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Background Accent Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Background Accent Colors"
          subtitle="system.background.accent-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Red Accent - with error text */}
          <DualPairingCard
            backgroundToken="background.accent.redAccent1"
            textToken="text.onSurface.errorAccent1"
            light={{ backgroundColor: semanticLight.background.accent.redAccent1, textColor: semanticLight.text.onSurface.errorAccent1 }}
            dark={{ backgroundColor: semanticDark.background.accent.redAccent1, textColor: semanticDark.text.onSurface.errorAccent1 }}
            semantic={semantic}
          />
          {/* Blue Accent - with informational text */}
          <DualPairingCard
            backgroundToken="background.accent.blueAccent1"
            textToken="text.onSurface.informationalAccent1"
            light={{ backgroundColor: semanticLight.background.accent.blueAccent1, textColor: semanticLight.text.onSurface.informationalAccent1 }}
            dark={{ backgroundColor: semanticDark.background.accent.blueAccent1, textColor: semanticDark.text.onSurface.informationalAccent1 }}
            semantic={semantic}
          />
          {/* Brand Accent - with brand text */}
          <DualPairingCard
            backgroundToken="background.accent.brandAccent1"
            textToken="text.onSurface.brandAccent2"
            light={{ backgroundColor: semanticLight.background.accent.brandAccent1, textColor: semanticLight.text.onSurface.brandAccent2 }}
            dark={{ backgroundColor: semanticDark.background.accent.brandAccent1, textColor: semanticDark.text.onSurface.brandAccent2 }}
            semantic={semantic}
          />
          {/* Green Accent - with success text */}
          <DualPairingCard
            backgroundToken="background.accent.greenAccent1"
            textToken="text.onSurface.successAccent1"
            light={{ backgroundColor: semanticLight.background.accent.greenAccent1, textColor: semanticLight.text.onSurface.successAccent1 }}
            dark={{ backgroundColor: semanticDark.background.accent.greenAccent1, textColor: semanticDark.text.onSurface.successAccent1 }}
            semantic={semantic}
          />
          {/* Yellow Accent - with warning text */}
          <DualPairingCard
            backgroundToken="background.accent.yellowAccent1"
            textToken="text.onSurface.warningAccent1"
            light={{ backgroundColor: semanticLight.background.accent.yellowAccent1, textColor: semanticLight.text.onSurface.warningAccent1 }}
            dark={{ backgroundColor: semanticDark.background.accent.yellowAccent1, textColor: semanticDark.text.onSurface.warningAccent1 }}
            semantic={semantic}
          />
          {/* Light Greige Accent - with primary text */}
          <DualPairingCard
            backgroundToken="background.accent.lightGreigeAccent1"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.background.accent.lightGreigeAccent1, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.background.accent.lightGreigeAccent1, textColor: semanticDark.text.onSurface.primary }}
            semantic={semantic}
          />
          {/* Dark Greige Accent - with inverse text */}
          <DualPairingCard
            backgroundToken="background.accent.darkGreigeAccent1"
            textToken="text.onSurface.inverse"
            light={{ backgroundColor: semanticLight.background.accent.darkGreigeAccent1, textColor: semanticLight.text.onSurface.inverse }}
            dark={{ backgroundColor: semanticDark.background.accent.darkGreigeAccent1, textColor: semanticDark.text.onSurface.inverse }}
            semantic={semantic}
          />
          {/* Brown Accent - with inverse text */}
          <DualPairingCard
            backgroundToken="background.accent.brownAccent1"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.background.accent.brownAccent1, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.background.accent.brownAccent1, textColor: semanticDark.text.onSurface.primary }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Background Container Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Background Containers"
          subtitle="system.background.container-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* White container */}
          <DualPairingCard
            backgroundToken="background.container.white"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.background.container.white, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.background.container.white, textColor: semanticDark.text.onContainer.primary }}
            semantic={semantic}
          />
          {/* Greige container */}
          <DualPairingCard
            backgroundToken="background.container.greige"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.background.container.greige, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.background.container.greige, textColor: semanticDark.text.onContainer.primary }}
            semantic={semantic}
          />
          {/* Inverse container */}
          <DualPairingCard
            backgroundToken="background.container.inverse"
            textToken="text.onSurface.inverse"
            light={{ backgroundColor: semanticLight.background.container.inverse, textColor: semanticLight.text.onSurface.inverse }}
            dark={{ backgroundColor: semanticDark.background.container.inverse, textColor: semanticDark.text.onSurface.inverse }}
            semantic={semantic}
          />
          {/* Brand container */}
          <DualPairingCard
            backgroundToken="background.container.brand"
            textToken="text.onSurface.inverse"
            light={{ backgroundColor: semanticLight.background.container.brand, textColor: semanticLight.text.onSurface.inverse }}
            dark={{ backgroundColor: semanticDark.background.container.brand, textColor: semanticDark.text.onSurface.inverse }}
            semantic={semantic}
          />
          {/* Brand Accent container */}
          <DualPairingCard
            backgroundToken="background.container.brandAccent"
            textToken="text.onSurface.brandAccent2"
            light={{ backgroundColor: semanticLight.background.container.brandAccent, textColor: semanticLight.text.onSurface.brandAccent2 }}
            dark={{ backgroundColor: semanticDark.background.container.brandAccent, textColor: semanticDark.text.onSurface.brandAccent2 }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Text on Container Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Text on Container"
          subtitle="system.text.on-container-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Primary on greige container */}
          <DualPairingCard
            backgroundToken="background.container.greige"
            textToken="text.onContainer.primary"
            light={{ backgroundColor: semanticLight.background.container.greige, textColor: semanticLight.text.onContainer.primary }}
            dark={{ backgroundColor: semanticDark.background.container.greige, textColor: semanticDark.text.onContainer.primary }}
            semantic={semantic}
          />
          {/* Secondary on greige container */}
          <DualPairingCard
            backgroundToken="background.container.greige"
            textToken="text.onContainer.secondary"
            light={{ backgroundColor: semanticLight.background.container.greige, textColor: semanticLight.text.onContainer.secondary }}
            dark={{ backgroundColor: semanticDark.background.container.greige, textColor: semanticDark.text.onContainer.secondary }}
            semantic={semantic}
          />
          {/* Tertiary on greige container */}
          <DualPairingCard
            backgroundToken="background.container.greige"
            textToken="text.onContainer.tertiary"
            light={{ backgroundColor: semanticLight.background.container.greige, textColor: semanticLight.text.onContainer.tertiary }}
            dark={{ backgroundColor: semanticDark.background.container.greige, textColor: semanticDark.text.onContainer.tertiary }}
            semantic={semantic}
          />
          {/* Brand Accent on brand container */}
          <DualPairingCard
            backgroundToken="background.container.brand"
            textToken="text.onContainer.inverse"
            light={{ backgroundColor: semanticLight.background.container.brand, textColor: semanticLight.text.onContainer.inverse }}
            dark={{ backgroundColor: semanticDark.background.container.brand, textColor: semanticDark.text.onContainer.inverse }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Icon on Container Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Icon on Container"
          subtitle="system.icon.on-container-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Primary icon on greige container */}
          <DualPairingCard
            backgroundToken="background.container.greige"
            textToken="icon.onContainer.primary"
            light={{ backgroundColor: semanticLight.background.container.greige, textColor: semanticLight.icon.onContainer.primary }}
            dark={{ backgroundColor: semanticDark.background.container.greige, textColor: semanticDark.icon.onContainer.primary }}
            semantic={semantic}
          />
          {/* Error icon on white container */}
          <DualPairingCard
            backgroundToken="background.container.white"
            textToken="icon.onContainer.error"
            light={{ backgroundColor: semanticLight.background.container.white, textColor: semanticLight.icon.onContainer.error }}
            dark={{ backgroundColor: semanticDark.background.container.white, textColor: semanticDark.icon.onContainer.error }}
            semantic={semantic}
          />
          {/* Success icon on white container */}
          <DualPairingCard
            backgroundToken="background.container.white"
            textToken="icon.onContainer.success"
            light={{ backgroundColor: semanticLight.background.container.white, textColor: semanticLight.icon.onContainer.success }}
            dark={{ backgroundColor: semanticDark.background.container.white, textColor: semanticDark.icon.onContainer.success }}
            semantic={semantic}
          />
          {/* Warning icon on white container */}
          <DualPairingCard
            backgroundToken="background.container.white"
            textToken="icon.onContainer.warning"
            light={{ backgroundColor: semanticLight.background.container.white, textColor: semanticLight.icon.onContainer.warning }}
            dark={{ backgroundColor: semanticDark.background.container.white, textColor: semanticDark.icon.onContainer.warning }}
            semantic={semantic}
          />
          {/* Inverse icon on brand container */}
          <DualPairingCard
            backgroundToken="background.container.brand"
            textToken="icon.onContainer.inverse"
            light={{ backgroundColor: semanticLight.background.container.brand, textColor: semanticLight.icon.onContainer.inverse }}
            dark={{ backgroundColor: semanticDark.background.container.brand, textColor: semanticDark.icon.onContainer.inverse }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Background Surface Colors */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Surface Colors"
          subtitle="system.background.surface-color"
          semantic={semantic}
        />
        <PairingGrid>
          {/* Greige surface with primary text */}
          <DualPairingCard
            backgroundToken="background.surface.greige"
            textToken="text.onSurface.primary"
            light={{ backgroundColor: semanticLight.background.surface.greige, textColor: semanticLight.text.onSurface.primary }}
            dark={{ backgroundColor: semanticDark.background.surface.greige, textColor: semanticDark.text.onSurface.primary }}
            semantic={semantic}
          />
          {/* Inverse surface with inverse text */}
          <DualPairingCard
            backgroundToken="background.surface.inverse"
            textToken="text.onSurface.inverse"
            light={{ backgroundColor: semanticLight.background.surface.inverse, textColor: semanticLight.text.onSurface.inverse }}
            dark={{ backgroundColor: semanticDark.background.surface.inverse, textColor: semanticDark.text.onSurface.inverse }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Fill + onFill pairings (Legacy) */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Fill Colors"
          subtitle="fills + onFill tokens"
          semantic={semantic}
        />
        <PairingGrid>
          <DualPairingCard
            backgroundToken="fills.primary"
            textToken="onFill.onPrimary"
            light={{ backgroundColor: currentFills.primary, textColor: onFill.onPrimary }}
            dark={{ backgroundColor: currentFillsDark.primary, textColor: onFillDark.onPrimary }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.secondary"
            textToken="onFill.onSecondary"
            light={{ backgroundColor: currentFills.secondary, textColor: onFill.onSecondary }}
            dark={{ backgroundColor: currentFillsDark.secondary, textColor: onFillDark.onSecondary }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.error"
            textToken="onFill.onError"
            light={{ backgroundColor: currentFills.error, textColor: onFill.onError }}
            dark={{ backgroundColor: currentFillsDark.error, textColor: onFillDark.onError }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.success"
            textToken="onFill.onSuccess"
            light={{ backgroundColor: currentFills.success, textColor: onFill.onSuccess }}
            dark={{ backgroundColor: currentFillsDark.success, textColor: onFillDark.onSuccess }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.warning"
            textToken="onFill.onWarning"
            light={{ backgroundColor: currentFills.warning, textColor: onFill.onWarning }}
            dark={{ backgroundColor: currentFillsDark.warning, textColor: onFillDark.onWarning }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.info"
            textToken="onFill.onInfo"
            light={{ backgroundColor: currentFills.info, textColor: onFill.onInfo }}
            dark={{ backgroundColor: currentFillsDark.info, textColor: onFillDark.onInfo }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.neutral"
            textToken="onFill.onNeutral"
            light={{ backgroundColor: currentFills.neutral, textColor: onFill.onNeutral }}
            dark={{ backgroundColor: currentFillsDark.neutral, textColor: onFillDark.onNeutral }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="fills.inverse"
            textToken="onFill.onInverse"
            light={{ backgroundColor: currentFills.inverse, textColor: onFill.onInverse }}
            dark={{ backgroundColor: currentFillsDark.inverse, textColor: onFillDark.onInverse }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>

      {/* ===================================================================== */}
      {/* SECTION: Material 3 Surface Containers */}
      {/* ===================================================================== */}
      <div style={{ marginBottom: spacing[8] }}>
        <SectionHeader
          title="Surface Container Hierarchy"
          subtitle="Material 3 surfaces"
          semantic={semantic}
        />
        <PairingGrid>
          <DualPairingCard
            backgroundToken="surfaceContainerLowest"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceContainerLowest, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceContainerLowest, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceContainerLow"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceContainerLow, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceContainerLow, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceContainer"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceContainer, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceContainer, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceContainerHigh"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceContainerHigh, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceContainerHigh, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceContainerHighest"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceContainerHighest, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceContainerHighest, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceDim"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceDim, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceDim, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
          <DualPairingCard
            backgroundToken="surfaceBright"
            textToken="onSurface"
            light={{ backgroundColor: currentSurfaces.surfaceBright, textColor: semanticLight.onSurface }}
            dark={{ backgroundColor: currentSurfacesDark.surfaceBright, textColor: semanticDark.onSurface }}
            semantic={semantic}
          />
        </PairingGrid>
      </div>
    </section>
  );
}
