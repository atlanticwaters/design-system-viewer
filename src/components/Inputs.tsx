import { CSSProperties } from 'react';
import { SemanticColors } from '../tokens/colors';
import { borderRadius, borderWidth } from '../tokens/radius';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';

interface InputsProps {
  semantic: SemanticColors;
}

function getInputStyles(semantic: SemanticColors, hasError?: boolean): CSSProperties {
  return {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    padding: `${spacing[2]}px ${spacing[3]}px`,
    borderRadius: borderRadius.md,
    border: `${borderWidth.xs}px solid ${hasError ? semantic.error : semantic.border}`,
    backgroundColor: semantic.surface,
    color: semantic.onSurface,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  };
}

function getLabelStyles(semantic: SemanticColors): CSSProperties {
  return {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    color: semantic.onSurfaceSecondary,
    marginBottom: spacing[1],
    display: 'block',
  };
}

export function Inputs({ semantic }: InputsProps) {
  return (
    <section id="inputs" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Inputs
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
          <li><strong>iOS:</strong> Rounded rectangle style, integrated clear button, native keyboard types</li>
          <li><strong>Android:</strong> Material outlined/filled variants, floating label animation, underline focus indicator</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}>
        {/* Basic Text Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Text Input</h4>
          <label style={getLabelStyles(semantic)}>Label</label>
          <input
            type="text"
            placeholder="Enter text..."
            style={getInputStyles(semantic)}
          />
          <div style={{ marginTop: 4, fontSize: 12, color: semantic.onSurfaceTertiary }}>
            Helper text goes here
          </div>
        </div>

        {/* Email Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Email Input</h4>
          <label style={getLabelStyles(semantic)}>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            style={getInputStyles(semantic)}
          />
        </div>

        {/* Password Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Password Input</h4>
          <label style={getLabelStyles(semantic)}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Enter password..."
              style={{ ...getInputStyles(semantic), paddingRight: 40 }}
            />
            <button
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: semantic.onSurfaceTertiary,
                padding: 4,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Search Input</h4>
          <div style={{ position: 'relative' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={semantic.onSurfaceTertiary}
              strokeWidth="2"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              style={{ ...getInputStyles(semantic), paddingLeft: 40 }}
            />
          </div>
        </div>

        {/* Number Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Number Input</h4>
          <label style={getLabelStyles(semantic)}>Quantity</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            style={getInputStyles(semantic)}
          />
        </div>

        {/* Disabled Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Disabled Input</h4>
          <label style={getLabelStyles(semantic)}>Disabled</label>
          <input
            type="text"
            placeholder="Cannot edit..."
            disabled
            style={{
              ...getInputStyles(semantic),
              backgroundColor: semantic.surfaceSecondary,
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Error State */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Error State</h4>
          <label style={{ ...getLabelStyles(semantic), color: semantic.error }}>Email</label>
          <input
            type="email"
            defaultValue="invalid-email"
            style={getInputStyles(semantic, true)}
          />
          <div style={{ marginTop: 4, fontSize: 12, color: semantic.error }}>
            Please enter a valid email address
          </div>
        </div>

        {/* Success State */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Success State</h4>
          <label style={getLabelStyles(semantic)}>Username</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              defaultValue="available_user"
              style={{
                ...getInputStyles(semantic),
                borderColor: semantic.success,
                paddingRight: 40,
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={semantic.success}
              strokeWidth="2.5"
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: semantic.success }}>
            Username is available
          </div>
        </div>

        {/* Textarea */}
        <div style={{ gridColumn: 'span 2' }}>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Textarea</h4>
          <label style={getLabelStyles(semantic)}>Message</label>
          <textarea
            placeholder="Enter your message..."
            rows={4}
            style={{
              ...getInputStyles(semantic),
              resize: 'vertical',
              minHeight: 100,
            }}
          />
          <div style={{ marginTop: 4, fontSize: 12, color: semantic.onSurfaceTertiary, textAlign: 'right' }}>
            0/500 characters
          </div>
        </div>

        {/* Select */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Select</h4>
          <label style={getLabelStyles(semantic)}>Country</label>
          <select
            style={{
              ...getInputStyles(semantic),
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: 40,
            }}
          >
            <option>Select a country...</option>
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
        </div>

        {/* Date Input */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Date Input</h4>
          <label style={getLabelStyles(semantic)}>Date of Birth</label>
          <input
            type="date"
            style={getInputStyles(semantic)}
          />
        </div>
      </div>
    </section>
  );
}
