import { useState } from 'react';
import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface TogglesProps {
  semantic: SemanticColors;
}

export function Toggles({ semantic }: TogglesProps) {
  const [switchStates, setSwitchStates] = useState([true, false, true]);
  const [checkboxStates, setCheckboxStates] = useState([true, false, false]);
  const [radioValue, setRadioValue] = useState('option1');

  return (
    <section id="toggles" style={{ marginBottom: 48 }}>
      <h2 style={{ marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Toggles
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
          <li><strong>iOS:</strong> UISwitch with green on-state, round checkmarks, custom-styled radios</li>
          <li><strong>Android:</strong> Material Switch, Material Checkbox with ripple, Material RadioButton</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 32,
      }}>
        {/* Switches */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Switches</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            {['Notifications', 'Dark Mode', 'Auto-sync'].map((label, index) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{label}</span>
                <button
                  onClick={() => {
                    const newStates = [...switchStates];
                    newStates[index] = !newStates[index];
                    setSwitchStates(newStates);
                  }}
                  style={{
                    width: 51,
                    height: 31,
                    borderRadius: 16,
                    backgroundColor: switchStates[index] ? semantic.primary : semantic.surfaceTertiary,
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 27,
                    height: 27,
                    borderRadius: '50%',
                    backgroundColor: colors.neutrals.white,
                    position: 'absolute',
                    top: 2,
                    left: switchStates[index] ? 22 : 2,
                    boxShadow: `0 2px 4px ${colors.shadow['200']}`,
                    transition: 'left 0.2s ease',
                  }} />
                </button>
              </div>
            ))}

            {/* Disabled Switch */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: 0.5,
            }}>
              <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>Disabled</span>
              <div style={{
                width: 51,
                height: 31,
                borderRadius: 16,
                backgroundColor: semantic.surfaceTertiary,
                position: 'relative',
                cursor: 'not-allowed',
              }}>
                <div style={{
                  width: 27,
                  height: 27,
                  borderRadius: '50%',
                  backgroundColor: colors.neutrals.white,
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  boxShadow: `0 2px 4px ${colors.shadow['200']}`,
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Checkboxes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {['Remember me', 'Subscribe to newsletter', 'Accept terms'].map((label, index) => (
              <label
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  cursor: 'pointer',
                }}
              >
                <button
                  onClick={() => {
                    const newStates = [...checkboxStates];
                    newStates[index] = !newStates[index];
                    setCheckboxStates(newStates);
                  }}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: borderRadius.xs,
                    backgroundColor: checkboxStates[index] ? semantic.primary : 'transparent',
                    border: checkboxStates[index] ? 'none' : `2px solid ${semantic.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  {checkboxStates[index] && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.neutrals.white} strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{label}</span>
              </label>
            ))}

            {/* Indeterminate Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              cursor: 'pointer',
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: borderRadius.xs,
                backgroundColor: semantic.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 10,
                  height: 2,
                  backgroundColor: colors.neutrals.white,
                  borderRadius: 1,
                }} />
              </div>
              <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>Indeterminate</span>
            </label>

            {/* Disabled Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              opacity: 0.5,
              cursor: 'not-allowed',
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: borderRadius.xs,
                border: `2px solid ${semantic.border}`,
              }} />
              <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>Disabled</span>
            </label>
          </div>
        </div>

        {/* Radio Buttons */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Radio Buttons</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {[
              { value: 'option1', label: 'Option One' },
              { value: 'option2', label: 'Option Two' },
              { value: 'option3', label: 'Option Three' },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                  cursor: 'pointer',
                }}
                onClick={() => setRadioValue(option.value)}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: `2px solid ${radioValue === option.value ? semantic.primary : semantic.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border-color 0.15s ease',
                }}>
                  {radioValue === option.value && (
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: semantic.primary,
                    }} />
                  )}
                </div>
                <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{option.label}</span>
              </label>
            ))}

            {/* Disabled Radio */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              opacity: 0.5,
              cursor: 'not-allowed',
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: `2px solid ${semantic.border}`,
              }} />
              <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>Disabled</span>
            </label>
          </div>
        </div>

        {/* Chip Selection */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Chip Selection</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
            {['Small', 'Medium', 'Large', 'X-Large'].map((size, index) => (
              <button
                key={size}
                style={{
                  padding: `${spacing[2]}px ${spacing[4]}px`,
                  borderRadius: borderRadius.full,
                  backgroundColor: index === 1 ? semantic.primary : 'transparent',
                  color: index === 1 ? colors.neutrals.white : semantic.onSurface,
                  border: index === 1 ? 'none' : `1px solid ${semantic.border}`,
                  cursor: 'pointer',
                  fontFamily: typography.bodySm.fontFamily,
                  fontSize: 14,
                  fontWeight: index === 1 ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Color Selection</h4>
          <div style={{ display: 'flex', gap: spacing[3] }}>
            {[
              colors.brand['300'],
              colors.bottleGreen['500'],
              colors.moonlight['500'],
              colors.greige['900'],
              colors.neutrals.white,
            ].map((color, index) => (
              <button
                key={color}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: index === 0 ? `3px solid ${semantic.onSurface}` : `1px solid ${semantic.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index === 0 && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.neutrals.white} strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Stepper */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Quantity Stepper</h4>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: `1px solid ${semantic.border}`,
            borderRadius: borderRadius.md,
            overflow: 'hidden',
          }}>
            <button style={{
              width: 44,
              height: 44,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: semantic.onSurface,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
              </svg>
            </button>
            <div style={{
              width: 60,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderLeft: `1px solid ${semantic.border}`,
              borderRight: `1px solid ${semantic.border}`,
              ...typography.bodyMd,
              color: semantic.onSurface,
              fontWeight: 600,
            }}>
              3
            </div>
            <button style={{
              width: 44,
              height: 44,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: semantic.onSurface,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
