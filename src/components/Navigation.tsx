import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface NavigationProps {
  semantic: SemanticColors;
}

export function Navigation({ semantic }: NavigationProps) {
  return (
    <section id="navigation" style={{ marginBottom: 48 }}>
      <h2 style={{ marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Navigation
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
          <li><strong>iOS:</strong> Bottom tab bar (5 max), large title navigation, swipe-back gesture</li>
          <li><strong>Android:</strong> Bottom navigation (3-5 items), top app bar, predictive back animation</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
      }}>
        {/* Top Navigation Bar */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Top Navigation Bar</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${spacing[3]}px ${spacing[4]}px`,
              borderBottom: `1px solid ${semantic.border}`,
            }}>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: semantic.primary,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </button>
              <span style={{ ...typography.h6, color: semantic.onSurface }}>Page Title</span>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: semantic.primary,
                padding: 4,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
            <div style={{ padding: spacing[4], height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: semantic.onSurfaceTertiary }}>Content Area</span>
            </div>
          </div>
        </div>

        {/* Large Title Navigation (iOS) */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Large Title (iOS Style)</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            <div style={{
              padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
            }}>
              <h1 style={{ ...typography.hero4, color: semantic.onSurface, margin: 0 }}>Settings</h1>
            </div>
            <div style={{
              padding: `0 ${spacing[4]}px ${spacing[3]}px`,
            }}>
              <div style={{
                backgroundColor: semantic.surfaceSecondary,
                borderRadius: borderRadius.md,
                padding: `${spacing[2]}px ${spacing[3]}px`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing[2],
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span style={{ ...typography.bodySm, color: semantic.onSurfaceTertiary }}>Search</span>
              </div>
            </div>
            <div style={{ padding: spacing[4], height: 60 }}>
              <span style={{ color: semantic.onSurfaceTertiary }}>List content...</span>
            </div>
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Bottom Tab Bar</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            <div style={{ padding: spacing[4], height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: semantic.onSurfaceTertiary }}>Screen Content</span>
            </div>
            <div style={{
              display: 'flex',
              borderTop: `1px solid ${semantic.border}`,
              backgroundColor: semantic.surface,
            }}>
              {[
                { icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', label: 'Home', active: true },
                { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'Search', active: false },
                { icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', label: 'Orders', active: false },
                { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', label: 'Profile', active: false },
              ].map((tab) => (
                <button
                  key={tab.label}
                  style={{
                    flex: 1,
                    padding: `${spacing[2]}px 0`,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    color: tab.active ? semantic.primary : semantic.onSurfaceTertiary,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={tab.icon} />
                  </svg>
                  <span style={{ fontSize: 10 }}>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Segmented Control */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Segmented Control</h4>
          <div style={{
            backgroundColor: semantic.surfaceSecondary,
            borderRadius: borderRadius.md,
            padding: 3,
            display: 'inline-flex',
          }}>
            {['Day', 'Week', 'Month', 'Year'].map((segment, index) => (
              <button
                key={segment}
                style={{
                  padding: `${spacing[2]}px ${spacing[4]}px`,
                  borderRadius: borderRadius.sm,
                  border: 'none',
                  backgroundColor: index === 1 ? semantic.surface : 'transparent',
                  color: index === 1 ? semantic.onSurface : semantic.onSurfaceSecondary,
                  cursor: 'pointer',
                  fontFamily: typography.bodySm.fontFamily,
                  fontSize: 14,
                  fontWeight: index === 1 ? 600 : 400,
                  boxShadow: index === 1 ? `0 1px 3px ${colors.shadow['100']}` : 'none',
                }}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumbs */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Breadcrumbs</h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}>
            {['Home', 'Products', 'Category', 'Item'].map((crumb, index, arr) => (
              <div key={crumb} style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                <span
                  style={{
                    ...typography.bodySm,
                    color: index === arr.length - 1 ? semantic.onSurface : semantic.primary,
                    cursor: index === arr.length - 1 ? 'default' : 'pointer',
                  }}
                >
                  {crumb}
                </span>
                {index < arr.length - 1 && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Pagination</h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
          }}>
            <button style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.md,
              border: `1px solid ${semantic.border}`,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: semantic.onSurfaceTertiary,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            {[1, 2, 3, '...', 10].map((page, index) => (
              <button
                key={index}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: borderRadius.md,
                  border: page === 2 ? 'none' : `1px solid ${semantic.border}`,
                  backgroundColor: page === 2 ? semantic.primary : 'transparent',
                  color: page === 2 ? colors.neutrals.white : semantic.onSurface,
                  cursor: typeof page === 'number' ? 'pointer' : 'default',
                  fontFamily: typography.bodySm.fontFamily,
                  fontSize: 14,
                }}
              >
                {page}
              </button>
            ))}
            <button style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.md,
              border: `1px solid ${semantic.border}`,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: semantic.onSurface,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Steps/Stepper */}
        <div style={{ gridColumn: 'span 2' }}>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Stepper</h4>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {['Cart', 'Shipping', 'Payment', 'Review'].map((step, index, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', flex: index < arr.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: index <= 1 ? semantic.primary : semantic.surfaceTertiary,
                    color: index <= 1 ? colors.neutrals.white : semantic.onSurfaceSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 14,
                  }}>
                    {index < 1 ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span style={{
                    marginTop: spacing[2],
                    ...typography.bodyXs,
                    color: index <= 1 ? semantic.onSurface : semantic.onSurfaceTertiary,
                    fontWeight: index === 1 ? 600 : 400,
                  }}>
                    {step}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: index < 1 ? semantic.primary : semantic.surfaceTertiary,
                    margin: `0 ${spacing[2]}px`,
                    marginBottom: spacing[6],
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
