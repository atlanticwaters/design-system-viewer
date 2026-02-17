import { stateLayerOpacity, stateLayers, stateLayersDark, elevationTonalOverlay, componentStates } from '../tokens/states';
import { SemanticColors } from '../tokens/colors';

interface StatesProps {
  semantic: SemanticColors;
  isDark: boolean;
}

interface StateLayerDemoProps {
  name: string;
  layers: {
    hover: string;
    focus: string;
    pressed: string;
    dragged: string;
  };
  baseColor: string;
  semantic: SemanticColors;
}

function StateLayerDemo({ name, layers, baseColor, semantic }: StateLayerDemoProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: semantic.onSurface }}>{name}</div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {[
          { label: 'Hover', layer: layers.hover, opacity: stateLayerOpacity.hover },
          { label: 'Focus', layer: layers.focus, opacity: stateLayerOpacity.focus },
          { label: 'Pressed', layer: layers.pressed, opacity: stateLayerOpacity.pressed },
          { label: 'Dragged', layer: layers.dragged, opacity: stateLayerOpacity.dragged },
        ].map(state => (
          <div key={state.label} style={{
            position: 'relative',
            height: 56,
            borderRadius: 8,
            overflow: 'hidden',
            border: `1px solid ${semantic.border}`,
          }}>
            {/* Base */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: baseColor,
            }} />
            {/* State layer */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: state.layer,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: semantic.onSurface }}>{state.label}</span>
              <span style={{ fontSize: 9, color: semantic.onSurfaceSecondary }}>{(state.opacity * 100).toFixed(0)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InteractiveButtonProps {
  semantic: SemanticColors;
  isDark: boolean;
}

function InteractiveButton({ semantic, isDark }: InteractiveButtonProps) {
  const layers = isDark ? stateLayersDark : stateLayers;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {['Enabled', 'Hovered', 'Focused', 'Pressed', 'Disabled'].map(state => {
        const isDisabled = state === 'Disabled';
        let stateLayer = 'transparent';
        if (state === 'Hovered') stateLayer = layers.onPrimaryHover;
        if (state === 'Focused') stateLayer = layers.onPrimaryFocus;
        if (state === 'Pressed') stateLayer = layers.onPrimaryPressed;

        return (
          <div key={state} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              position: 'relative',
              height: 40,
              minWidth: 120,
              borderRadius: 9999,
              overflow: 'hidden',
              opacity: isDisabled ? componentStates.button.disabled.opacity : 1,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#F96302',
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: stateLayer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Button</span>
              </div>
            </div>
            <span style={{ fontSize: 12, color: semantic.onSurfaceSecondary }}>{state}</span>
          </div>
        );
      })}
    </div>
  );
}

export function States({ semantic, isDark }: StatesProps) {
  const currentLayers = isDark ? stateLayersDark : stateLayers;

  return (
    <section id="states" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Interactive States
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
          <li><strong>iOS:</strong> Uses highlight overlay (10% black/white) for pressed states, system focus rings</li>
          <li><strong>Android:</strong> Uses state layer system with specific opacities (8% hover, 12% focus/pressed, 16% drag)</li>
        </ul>
      </div>

      {/* State Layer Opacities */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>
          State Layer Opacities
          <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8, color: semantic.onSurfaceSecondary }}>
            (Material 3)
          </span>
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          padding: 16,
          borderRadius: 8,
          backgroundColor: semantic.surfaceSecondary,
        }}>
          {Object.entries(stateLayerOpacity).map(([name, opacity]) => (
            <div key={name} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 80,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                border: `1px solid ${semantic.border}`,
              }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: semantic.onSurface }}>{name}</span>
              <span style={{ fontSize: 10, color: semantic.onSurfaceSecondary }}>{(opacity * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* State Layers by Color */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>State Layers by Role</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <StateLayerDemo
              name="On Surface"
              layers={{
                hover: currentLayers.onSurfaceHover,
                focus: currentLayers.onSurfaceFocus,
                pressed: currentLayers.onSurfacePressed,
                dragged: currentLayers.onSurfaceDragged,
              }}
              baseColor={semantic.surface}
              semantic={semantic}
            />
            <StateLayerDemo
              name="On Primary"
              layers={{
                hover: currentLayers.onPrimaryHover,
                focus: currentLayers.onPrimaryFocus,
                pressed: currentLayers.onPrimaryPressed,
                dragged: currentLayers.onPrimaryDragged,
              }}
              baseColor={semantic.surface}
              semantic={semantic}
            />
          </div>

          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <StateLayerDemo
              name="On Secondary"
              layers={{
                hover: currentLayers.onSecondaryHover,
                focus: currentLayers.onSecondaryFocus,
                pressed: currentLayers.onSecondaryPressed,
                dragged: currentLayers.onSecondaryDragged,
              }}
              baseColor={semantic.surface}
              semantic={semantic}
            />
            <StateLayerDemo
              name="On Error"
              layers={{
                hover: currentLayers.onErrorHover,
                focus: currentLayers.onErrorFocus,
                pressed: currentLayers.onErrorPressed,
                dragged: currentLayers.onErrorDragged,
              }}
              baseColor={semantic.surface}
              semantic={semantic}
            />
          </div>
        </div>
      </div>

      {/* Interactive Button Demo */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>Interactive Button States</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: semantic.surfaceSecondary,
          }}>
            <div style={{ fontSize: 12, marginBottom: 12, color: semantic.onSurfaceSecondary }}>With State Layers</div>
            <InteractiveButton semantic={semantic} isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Elevation Tonal Overlay (Android Dark) */}
      <div>
        <h3 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 16, fontSize: 14, color: semantic.onSurface }}>
          Elevation Tonal Overlay
          <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 8, color: semantic.onSurfaceSecondary }}>
            (Android Dark Theme)
          </span>
        </h3>
        <div style={{
          padding: 16,
          borderRadius: 8,
          backgroundColor: semantic.surfaceSecondary,
        }}>
          <p style={{ fontSize: 12, color: semantic.onSurfaceSecondary, marginBottom: 16 }}>
            In dark theme, Material 3 applies a tonal overlay based on primary color to indicate elevation.
            Higher elevation = more primary color tint.
          </p>
          <div style={{
            display: 'flex',
            gap: 8,
          }}>
            {Object.entries(elevationTonalOverlay).map(([level, color]) => (
              <div key={level} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 64,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `1px solid ${semantic.border}`,
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: '#1A1A1A',
                  }} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 11, color: '#FFFFFF' }}>{level.replace('level', 'L')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
