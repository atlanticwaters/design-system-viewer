import { typography, fontSize, fontWeight, lineHeight, fontFamily } from '../tokens/typography';
import { SemanticColors } from '../tokens/colors';

interface TypographyProps {
  semantic: SemanticColors;
}

interface TypographySampleProps {
  name: string;
  style: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  semantic: SemanticColors;
}

function TypographySample({ name, style, semantic }: TypographySampleProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid ${semantic.border}`,
    }}>
      <span style={{
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        color: semantic.onSurface,
      }}>
        {name}
      </span>
      <span style={{
        fontSize: 12,
        color: semantic.onSurfaceSecondary,
        fontFamily: 'monospace',
        textAlign: 'right',
      }}>
        {style.fontSize}px / {style.fontWeight} / {(style.lineHeight * 100).toFixed(0)}%
      </span>
    </div>
  );
}

export function Typography({ semantic }: TypographyProps) {
  return (
    <section id="typography" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Typography
      </h2>

      <div style={{
        padding: 16,
        borderRadius: 8,
        backgroundColor: semantic.surfaceSecondary,
        marginBottom: 24,
      }}>
        <h4 style={{ marginBottom: 8, color: semantic.onSurface }}>Font Family</h4>
        <code style={{ fontSize: 14, color: semantic.onSurfaceSecondary }}>{fontFamily.primary}</code>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
      }}>
        {/* Hero Styles */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Hero Styles</h3>
          <TypographySample name="Hero 1" style={typography.hero1} semantic={semantic} />
          <TypographySample name="Hero 2" style={typography.hero2} semantic={semantic} />
          <TypographySample name="Hero 3" style={typography.hero3} semantic={semantic} />
          <TypographySample name="Hero 4" style={typography.hero4} semantic={semantic} />
          <TypographySample name="Hero 5" style={typography.hero5} semantic={semantic} />
        </div>

        {/* Heading Styles */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Heading Styles</h3>
          <TypographySample name="Heading 1" style={typography.h1} semantic={semantic} />
          <TypographySample name="Heading 2" style={typography.h2} semantic={semantic} />
          <TypographySample name="Heading 3" style={typography.h3} semantic={semantic} />
          <TypographySample name="Heading 4" style={typography.h4} semantic={semantic} />
          <TypographySample name="Heading 5" style={typography.h5} semantic={semantic} />
          <TypographySample name="Heading 6" style={typography.h6} semantic={semantic} />
        </div>

        {/* Body Styles */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Body Styles</h3>
          <TypographySample name="Body XL" style={typography.bodyXl} semantic={semantic} />
          <TypographySample name="Body LG" style={typography.bodyLg} semantic={semantic} />
          <TypographySample name="Body MD" style={typography.bodyMd} semantic={semantic} />
          <TypographySample name="Body SM" style={typography.bodySm} semantic={semantic} />
          <TypographySample name="Body XS" style={typography.bodyXs} semantic={semantic} />
        </div>

        {/* Body Bold Styles */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Body Bold Styles</h3>
          <TypographySample name="Body LG Bold" style={typography.bodyLgBold} semantic={semantic} />
          <TypographySample name="Body MD Bold" style={typography.bodyMdBold} semantic={semantic} />
          <TypographySample name="Body SM Bold" style={typography.bodySmBold} semantic={semantic} />
          <TypographySample name="Body XS Bold" style={typography.bodyXsBold} semantic={semantic} />
        </div>

        {/* Label Styles */}
        <div>
          <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Label Styles</h3>
          <TypographySample name="Label" style={typography.label} semantic={semantic} />
          <TypographySample name="Label LG" style={typography.labelLg} semantic={semantic} />
        </div>
      </div>

      {/* Reference Tables */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Reference</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <h4 style={{ marginBottom: 8, fontSize: 14, color: semantic.onSurface }}>Font Sizes</h4>
            {Object.entries(fontSize).map(([name, size]) => (
              <div key={name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: semantic.onSurfaceSecondary,
                padding: '2px 0',
              }}>
                <span>{name}</span>
                <span>{size}px</span>
              </div>
            ))}
          </div>

          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <h4 style={{ marginBottom: 8, fontSize: 14, color: semantic.onSurface }}>Font Weights</h4>
            {Object.entries(fontWeight).map(([name, weight]) => (
              <div key={name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: semantic.onSurfaceSecondary,
                padding: '2px 0',
              }}>
                <span>{name}</span>
                <span>{weight}</span>
              </div>
            ))}
          </div>

          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <h4 style={{ marginBottom: 8, fontSize: 14, color: semantic.onSurface }}>Line Heights</h4>
            {Object.entries(lineHeight).map(([name, height]) => (
              <div key={name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                color: semantic.onSurfaceSecondary,
                padding: '2px 0',
              }}>
                <span>{name}</span>
                <span>{(height * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
