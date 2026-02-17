import { outlines, outlinesDark, borderWidth } from '../tokens/outlines';
import { SemanticColors } from '../tokens/colors';

interface OutlinesProps {
  semantic: SemanticColors;
  isDark: boolean;
}

interface OutlineSwatchProps {
  name: string;
  color: string;
  semantic: SemanticColors;
  width?: number;
}

function OutlineSwatch({ name, color, semantic, width = 2 }: OutlineSwatchProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 0',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 8,
        border: `${width}px solid ${color}`,
        backgroundColor: semantic.surface,
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: semantic.onSurface }}>{name}</div>
        <div style={{ fontSize: 11, fontFamily: 'monospace', color: semantic.onSurfaceSecondary }}>{color}</div>
      </div>
    </div>
  );
}

interface InputStateProps {
  label: string;
  borderColor: string;
  semantic: SemanticColors;
  isFocused?: boolean;
  hasError?: boolean;
}

function InputStateDemo({ label, borderColor, semantic, isFocused, hasError }: InputStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <label style={{ fontSize: 11, color: semantic.onSurfaceSecondary }}>{label}</label>
      <div style={{
        height: 40,
        borderRadius: 8,
        border: `2px solid ${borderColor}`,
        backgroundColor: semantic.surface,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        boxShadow: isFocused ? `0 0 0 2px ${borderColor}33` : 'none',
        position: 'relative',
      }}>
        <span style={{ fontSize: 13, color: hasError ? borderColor : semantic.onSurfaceSecondary }}>
          {hasError ? 'Invalid input' : 'Placeholder text'}
        </span>
      </div>
    </div>
  );
}

export function Outlines({ semantic, isDark }: OutlinesProps) {
  const currentOutlines = isDark ? outlinesDark : outlines;

  return (
    <section id="outlines" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Outlines & Borders
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
        <strong style={{ color: semantic.onSurface }}>Platform Notes:</strong>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li><strong>iOS:</strong> Prefers minimal borders, uses shadows for depth separation</li>
          <li><strong>Android:</strong> Uses outline and outlineVariant for borders and dividers (Material 3)</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 32,
      }}>
        {/* Standard Outlines */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Standard Outlines</h3>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <OutlineSwatch name="Outline" color={currentOutlines.outline} semantic={semantic} />
            <OutlineSwatch name="Outline Variant" color={currentOutlines.outlineVariant} semantic={semantic} />
            <OutlineSwatch name="Outline Strong" color={currentOutlines.outlineStrong} semantic={semantic} />
          </div>
        </div>

        {/* Focus Rings */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Focus Rings</h3>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <OutlineSwatch name="Focus Ring" color={currentOutlines.focusRing} semantic={semantic} width={3} />
            <OutlineSwatch name="Focus Ring Error" color={currentOutlines.focusRingError} semantic={semantic} width={3} />
            <OutlineSwatch name="Focus Ring Success" color={currentOutlines.focusRingSuccess} semantic={semantic} width={3} />
          </div>
        </div>

        {/* Semantic Borders */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Semantic Borders</h3>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <OutlineSwatch name="Primary" color={currentOutlines.borderPrimary} semantic={semantic} />
            <OutlineSwatch name="Secondary" color={currentOutlines.borderSecondary} semantic={semantic} />
            <OutlineSwatch name="Error" color={currentOutlines.borderError} semantic={semantic} />
            <OutlineSwatch name="Success" color={currentOutlines.borderSuccess} semantic={semantic} />
            <OutlineSwatch name="Warning" color={currentOutlines.borderWarning} semantic={semantic} />
            <OutlineSwatch name="Info" color={currentOutlines.borderInfo} semantic={semantic} />
          </div>
        </div>

        {/* Structural Borders */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Structural Borders</h3>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <OutlineSwatch name="Divider" color={currentOutlines.divider} semantic={semantic} width={1} />
            <OutlineSwatch name="Divider Strong" color={currentOutlines.dividerStrong} semantic={semantic} width={1} />
            <OutlineSwatch name="Separator" color={currentOutlines.separator} semantic={semantic} width={1} />
          </div>
        </div>
      </div>

      {/* Input States Demo */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Input Border States</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          padding: 16,
          borderRadius: 8,
          backgroundColor: semantic.surfaceSecondary,
        }}>
          <InputStateDemo label="Default" borderColor={currentOutlines.inputDefault} semantic={semantic} />
          <InputStateDemo label="Hover" borderColor={currentOutlines.inputHover} semantic={semantic} />
          <InputStateDemo label="Focused" borderColor={currentOutlines.inputFocused} semantic={semantic} isFocused />
          <InputStateDemo label="Error" borderColor={currentOutlines.inputError} semantic={semantic} hasError />
          <InputStateDemo label="Disabled" borderColor={currentOutlines.inputDisabled} semantic={semantic} />
        </div>
      </div>

      {/* Border Widths */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Border Widths</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          padding: 16,
          borderRadius: 8,
          backgroundColor: semantic.surfaceSecondary,
        }}>
          {Object.entries(borderWidth).filter(([_, w]) => w > 0).map(([name, width]) => (
            <div key={name} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                border: `${width}px solid ${currentOutlines.outline}`,
                backgroundColor: semantic.surface,
              }} />
              <div style={{ fontSize: 11, color: semantic.onSurfaceSecondary }}>
                {name}: {width}px
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
