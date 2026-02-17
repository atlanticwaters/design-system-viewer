import { fills, fillsDark, onFill, onFillDark } from '../tokens/fills';
import { SemanticColors } from '../tokens/colors';

interface FillsProps {
  semantic: SemanticColors;
  isDark: boolean;
}

interface FillSwatchProps {
  name: string;
  baseColor: string;
  hoverColor: string;
  pressedColor: string;
  disabledColor: string;
  onColor: string;
}

function FillSwatch({ name, baseColor, hoverColor, pressedColor, disabledColor, onColor }: FillSwatchProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{name}</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
      }}>
        {/* Base */}
        <div style={{
          height: 48,
          backgroundColor: baseColor,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, color: onColor }}>Base</span>
        </div>
        {/* Hover */}
        <div style={{
          height: 48,
          backgroundColor: hoverColor,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, color: onColor }}>Hover</span>
        </div>
        {/* Pressed */}
        <div style={{
          height: 48,
          backgroundColor: pressedColor,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, color: onColor }}>Press</span>
        </div>
        {/* Disabled */}
        <div style={{
          height: 48,
          backgroundColor: disabledColor,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 9, color: onColor, opacity: 0.5 }}>Off</span>
        </div>
      </div>
      <div style={{
        fontSize: 10,
        fontFamily: 'monospace',
        color: 'inherit',
        opacity: 0.6,
      }}>
        {baseColor}
      </div>
    </div>
  );
}

export function Fills({ semantic, isDark }: FillsProps) {
  const currentFills = isDark ? fillsDark : fills;
  const currentOnFill = isDark ? onFillDark : onFill;

  const fillGroups = [
    {
      title: 'Primary Fills',
      items: [
        {
          name: 'Primary',
          base: currentFills.primary,
          hover: currentFills.primaryHover,
          pressed: currentFills.primaryPressed,
          disabled: currentFills.primaryDisabled,
          on: currentOnFill.onPrimary,
        },
      ],
    },
    {
      title: 'Secondary Fills',
      items: [
        {
          name: 'Secondary',
          base: currentFills.secondary,
          hover: currentFills.secondaryHover,
          pressed: currentFills.secondaryPressed,
          disabled: currentFills.secondaryDisabled,
          on: currentOnFill.onSecondary,
        },
      ],
    },
    {
      title: 'Tertiary & Neutral Fills',
      items: [
        {
          name: 'Tertiary',
          base: currentFills.tertiary,
          hover: currentFills.tertiaryHover,
          pressed: currentFills.tertiaryPressed,
          disabled: currentFills.tertiaryDisabled,
          on: currentOnFill.onTertiary,
        },
        {
          name: 'Neutral',
          base: currentFills.neutral,
          hover: currentFills.neutralHover,
          pressed: currentFills.neutralPressed,
          disabled: currentFills.neutralDisabled,
          on: currentOnFill.onNeutral,
        },
      ],
    },
    {
      title: 'Semantic Fills',
      items: [
        {
          name: 'Error',
          base: currentFills.error,
          hover: currentFills.errorHover,
          pressed: currentFills.errorPressed,
          disabled: currentFills.errorDisabled,
          on: currentOnFill.onError,
        },
        {
          name: 'Success',
          base: currentFills.success,
          hover: currentFills.successHover,
          pressed: currentFills.successPressed,
          disabled: currentFills.successDisabled,
          on: currentOnFill.onSuccess,
        },
        {
          name: 'Warning',
          base: currentFills.warning,
          hover: currentFills.warningHover,
          pressed: currentFills.warningPressed,
          disabled: currentFills.warningDisabled,
          on: currentOnFill.onWarning,
        },
        {
          name: 'Info',
          base: currentFills.info,
          hover: currentFills.infoHover,
          pressed: currentFills.infoPressed,
          disabled: currentFills.infoDisabled,
          on: currentOnFill.onInfo,
        },
      ],
    },
    {
      title: 'Inverse Fills',
      items: [
        {
          name: 'Inverse',
          base: currentFills.inverse,
          hover: currentFills.inverseHover,
          pressed: currentFills.inversePressed,
          disabled: currentFills.inverseDisabled,
          on: currentOnFill.onInverse,
        },
      ],
    },
  ];

  return (
    <section id="fills" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Fill Roles
      </h2>

      {/* Platform comparison note */}
      <div style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: semantic.surfaceSecondary,
        marginBottom: 24,
        fontSize: 13,
        color: semantic.onSurfaceSecondary,
      }}>
        <strong style={{ color: semantic.onSurface }}>Usage:</strong> Fill colors are used for interactive elements like buttons,
        chips, and filled containers. Each fill includes states for hover, pressed, and disabled.
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}>
        {fillGroups.map(group => (
          <div key={group.title}>
            <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>{group.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {group.items.map(item => (
                <FillSwatch
                  key={item.name}
                  name={item.name}
                  baseColor={item.base}
                  hoverColor={item.hover}
                  pressedColor={item.pressed}
                  disabledColor={item.disabled}
                  onColor={item.on}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
