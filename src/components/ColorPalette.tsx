import { colors, SemanticColors } from '../tokens/colors';

interface ColorSwatchProps {
  name: string;
  color: string;
  isDark?: boolean;
}

function ColorSwatch({ name, color, isDark }: ColorSwatchProps) {
  const textColor = isDark ? '#fff' : '#000';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <div style={{
        width: 64,
        height: 64,
        backgroundColor: color,
        borderRadius: 8,
        border: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 4,
      }}>
        <span style={{
          fontSize: 10,
          color: textColor,
          fontWeight: 500,
          textShadow: isDark ? 'none' : '0 0 2px rgba(255,255,255,0.8)',
        }}>
          {color}
        </span>
      </div>
      <span style={{ fontSize: 11, color: '#666' }}>{name}</span>
    </div>
  );
}

interface ColorRowProps {
  name: string;
  palette: Record<string, string>;
}

function ColorRow({ name, palette }: ColorRowProps) {
  const entries = Object.entries(palette);

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ marginBottom: 12, textTransform: 'capitalize' }}>{name}</h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {entries.map(([shade, color]) => {
          const shadeNum = parseInt(shade);
          const isDark = !isNaN(shadeNum) && shadeNum >= 500;
          return (
            <ColorSwatch
              key={shade}
              name={shade}
              color={color}
              isDark={isDark}
            />
          );
        })}
      </div>
    </div>
  );
}

interface SemanticColorGridProps {
  semantic: SemanticColors;
  title: string;
}

function SemanticColorGrid({ semantic, title }: SemanticColorGridProps) {
  // Filter to only flat string color values (exclude nested objects like icon, text, background, borderColors)
  const entries = Object.entries(semantic).filter(
    ([, value]) => typeof value === 'string'
  ) as [string, string][];

  return (
    <div style={{ marginBottom: 32 }}>
      <h4 style={{ marginBottom: 12 }}>{title}</h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 12,
      }}>
        {entries.map(([name, color]) => (
          <div key={name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 8,
            borderRadius: 6,
            backgroundColor: 'rgba(0,0,0,0.02)',
          }}>
            <div style={{
              width: 32,
              height: 32,
              backgroundColor: color,
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.1)',
              flexShrink: 0,
            }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>{name}</div>
              <div style={{ fontSize: 10, color: '#666', fontFamily: 'monospace' }}>{color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ColorPaletteProps {
  semantic: SemanticColors;
  isDarkMode: boolean;
}

export function ColorPalette({ semantic, isDarkMode }: ColorPaletteProps) {
  return (
    <section id="colors" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8 }}>
        Colors
      </h2>

      <SemanticColorGrid
        semantic={semantic}
        title={isDarkMode ? "Semantic Colors (Dark Mode)" : "Semantic Colors (Light Mode)"}
      />

      <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, marginTop: 32 }}>Core Palettes</h3>

      <ColorRow name="Brand (Primary)" palette={colors.brand} />
      <ColorRow name="Bottle Green (Secondary/Success)" palette={colors.bottleGreen} />
      <ColorRow name="Cinnabar (Error)" palette={colors.cinnabar} />
      <ColorRow name="Lemon (Warning)" palette={colors.lemon} />
      <ColorRow name="Moonlight (Info)" palette={colors.moonlight} />
      <ColorRow name="Greige (Neutral)" palette={colors.greige} />
      <ColorRow name="Chamoisee (Warm Neutral)" palette={colors.chamoisee} />
      <ColorRow name="Neutrals" palette={colors.neutrals} />
    </section>
  );
}
