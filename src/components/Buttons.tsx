import { CSSProperties } from 'react';
import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { typography } from '../tokens/typography';

interface ButtonsProps {
  semantic: SemanticColors;
}

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonStyleProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  semantic: SemanticColors;
}

function getButtonStyles({ variant, size, disabled, semantic }: ButtonStyleProps): CSSProperties {
  const baseStyle: CSSProperties = {
    fontFamily: typography.bodySmBold.fontFamily,
    fontWeight: typography.bodySmBold.fontWeight,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
    borderRadius: borderRadius.full, // Pill shape like iOS
  };

  // Size styles
  const sizeStyles: Record<ButtonSize, CSSProperties> = {
    small: { height: 28, padding: '0 16px', fontSize: 12 },
    medium: { height: 36, padding: '0 20px', fontSize: 14 },
    large: { height: 44, padding: '0 24px', fontSize: 14, width: '100%' },
  };

  // Variant styles
  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundColor: semantic.primary,
      color: colors.neutrals.white,
    },
    secondary: {
      backgroundColor: semantic.secondary,
      color: colors.neutrals.white,
    },
    outlined: {
      backgroundColor: 'transparent',
      color: semantic.onSurface,
      border: `1px solid ${semantic.border}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: semantic.onSurface,
    },
    danger: {
      backgroundColor: semantic.error,
      color: colors.neutrals.white,
    },
  };

  return { ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] };
}

interface ButtonDemoProps {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  disabled?: boolean;
  semantic: SemanticColors;
  icon?: string;
}

function ButtonDemo({ label, variant, size, disabled, semantic, icon }: ButtonDemoProps) {
  return (
    <button
      style={getButtonStyles({ variant, size, disabled, semantic })}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

export function Buttons({ semantic }: ButtonsProps) {
  const variants: ButtonVariant[] = ['primary', 'secondary', 'outlined', 'ghost', 'danger'];
  const sizes: ButtonSize[] = ['small', 'medium', 'large'];

  return (
    <section id="buttons" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Buttons
      </h2>

      {/* Platform Comparison Note */}
      <div style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: semantic.infoLight,
        marginBottom: 24,
        fontSize: 14,
        color: semantic.onSurface,
      }}>
        <strong>Platform Differences:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li><strong>iOS:</strong> Rounded pill shape (9999px radius), haptic feedback on tap, scale animation</li>
          <li><strong>Android:</strong> Material ripple effect, slight elevation on press, Material 3 shapes</li>
        </ul>
      </div>

      {/* Button Variants */}
      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Variants</h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
      }}>
        {variants.map((variant) => (
          <ButtonDemo
            key={variant}
            label={variant.charAt(0).toUpperCase() + variant.slice(1)}
            variant={variant}
            size="medium"
            semantic={semantic}
          />
        ))}
      </div>

      {/* Button Sizes */}
      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Sizes</h3>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginBottom: 32,
      }}>
        {sizes.map((size) => (
          <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 80, fontSize: 14, color: semantic.onSurfaceSecondary }}>{size}</span>
            <div style={{ flex: size === 'large' ? 1 : 'none', maxWidth: size === 'large' ? 300 : 'none' }}>
              <ButtonDemo
                label="Button"
                variant="primary"
                size={size}
                semantic={semantic}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Button States */}
      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>States</h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
      }}>
        <ButtonDemo label="Default" variant="primary" size="medium" semantic={semantic} />
        <ButtonDemo label="Disabled" variant="primary" size="medium" disabled semantic={semantic} />
        <button
          style={{
            ...getButtonStyles({ variant: 'primary', size: 'medium', semantic }),
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          Loading
        </button>
      </div>

      {/* With Icons */}
      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>With Icons</h3>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
      }}>
        <button style={getButtonStyles({ variant: 'primary', size: 'medium', semantic })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Item
        </button>
        <button style={getButtonStyles({ variant: 'outlined', size: 'medium', semantic })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>
        <button style={getButtonStyles({ variant: 'secondary', size: 'medium', semantic })}>
          Download
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </button>
      </div>

      {/* Button Group */}
      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Button Group</h3>
      <div style={{
        display: 'inline-flex',
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        border: `1px solid ${semantic.border}`,
      }}>
        {['Left', 'Center', 'Right'].map((label, i) => (
          <button
            key={label}
            style={{
              ...getButtonStyles({ variant: 'ghost', size: 'medium', semantic }),
              borderRadius: 0,
              borderRight: i < 2 ? `1px solid ${semantic.border}` : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
