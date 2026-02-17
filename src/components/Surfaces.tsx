import { surfaces, surfacesDark, materials, vibrancy } from '../tokens/surfaces';
import { SemanticColors } from '../tokens/colors';

interface SurfacesProps {
  semantic: SemanticColors;
  isDark: boolean;
}

interface SurfaceSwatchProps {
  name: string;
  color: string;
  semantic: SemanticColors;
  showOnDark?: boolean;
}

function SurfaceSwatch({ name, color, semantic, showOnDark }: SurfaceSwatchProps) {
  const textColor = showOnDark ? '#FFFFFF' : semantic.onSurface;
  const isTransparent = color.includes('rgba');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{
        width: '100%',
        height: 60,
        backgroundColor: isTransparent ? '#808080' : 'transparent',
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${semantic.border}`,
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 10,
            color: textColor,
            fontFamily: 'monospace',
            textShadow: isTransparent ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
          }}>
            {color}
          </span>
        </div>
      </div>
      <span style={{
        fontSize: 11,
        color: semantic.onSurfaceSecondary,
        textAlign: 'center',
      }}>
        {name}
      </span>
    </div>
  );
}

interface MaterialDemoProps {
  name: string;
  config: { blur: number; saturation: number; opacity: number };
  semantic: SemanticColors;
}

function MaterialDemo({ name, config, semantic }: MaterialDemoProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 80,
      borderRadius: 12,
      overflow: 'hidden',
      border: `1px solid ${semantic.border}`,
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, #F96302 25%, #4A8165 50%, #CFB73A 75%, #DF3427 100%)`,
      }} />
      {/* Material overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(${config.blur}px) saturate(${config.saturation})`,
        WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation})`,
        backgroundColor: `rgba(255, 255, 255, ${config.opacity})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        <span style={{
          fontSize: 14,
          fontWeight: 600,
          color: semantic.onSurface,
        }}>
          {name}
        </span>
        <span style={{
          fontSize: 10,
          color: semantic.onSurfaceSecondary,
          fontFamily: 'monospace',
        }}>
          blur: {config.blur}px
        </span>
      </div>
    </div>
  );
}

export function Surfaces({ semantic, isDark }: SurfacesProps) {
  const currentSurfaces = isDark ? surfacesDark : surfaces;

  return (
    <section id="surfaces" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Surfaces & Containers
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
          <li><strong>iOS:</strong> Uses Materials (blur effects) with vibrancy levels for layered UI</li>
          <li><strong>Android:</strong> Uses Surface Container hierarchy with tonal elevation</li>
        </ul>
      </div>

      {/* Surface Container Hierarchy (Material 3) */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>
          Surface Container Hierarchy
          <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8, color: semantic.onSurfaceSecondary }}>
            (Material 3)
          </span>
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
        }}>
          <SurfaceSwatch name="Lowest" color={currentSurfaces.surfaceContainerLowest} semantic={semantic} />
          <SurfaceSwatch name="Low" color={currentSurfaces.surfaceContainerLow} semantic={semantic} />
          <SurfaceSwatch name="Default" color={currentSurfaces.surfaceContainer} semantic={semantic} />
          <SurfaceSwatch name="High" color={currentSurfaces.surfaceContainerHigh} semantic={semantic} />
          <SurfaceSwatch name="Highest" color={currentSurfaces.surfaceContainerHighest} semantic={semantic} />
        </div>
      </div>

      {/* Brightness Variants */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Brightness Variants</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}>
          <SurfaceSwatch name="Surface" color={currentSurfaces.surface} semantic={semantic} />
          <SurfaceSwatch name="Surface Dim" color={currentSurfaces.surfaceDim} semantic={semantic} />
          <SurfaceSwatch name="Surface Bright" color={currentSurfaces.surfaceBright} semantic={semantic} />
          <SurfaceSwatch name="Surface Inverse" color={currentSurfaces.surfaceInverse} semantic={semantic} showOnDark={!isDark} />
        </div>
      </div>

      {/* Scrim & Overlays */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>Scrim & Overlays</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}>
          <SurfaceSwatch name="Scrim Light" color={currentSurfaces.scrimLight} semantic={semantic} />
          <SurfaceSwatch name="Scrim" color={currentSurfaces.scrim} semantic={semantic} />
          <SurfaceSwatch name="Scrim Heavy" color={currentSurfaces.scrimHeavy} semantic={semantic} />
        </div>
      </div>

      {/* iOS Materials */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>
          Materials
          <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8, color: semantic.onSurfaceSecondary }}>
            (iOS)
          </span>
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
        }}>
          {Object.entries(materials).map(([name, config]) => (
            <MaterialDemo key={name} name={name} config={config} semantic={semantic} />
          ))}
        </div>
      </div>

      {/* Vibrancy Levels */}
      <div>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, color: semantic.onSurface }}>
          Vibrancy Levels
          <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8, color: semantic.onSurfaceSecondary }}>
            (iOS)
          </span>
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}>
          {Object.entries(vibrancy).map(([name, opacity]) => (
            <div key={name} style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: semantic.surfaceSecondary,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 16,
                fontWeight: 600,
                color: semantic.onSurface,
                opacity: opacity,
                marginBottom: 8,
              }}>
                Sample Text
              </div>
              <div style={{ fontSize: 12, color: semantic.onSurfaceSecondary }}>
                {name}: {(opacity * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
