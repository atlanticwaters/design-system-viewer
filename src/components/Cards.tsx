import { CSSProperties } from 'react';
import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface CardsProps {
  semantic: SemanticColors;
}

function getCardStyles(semantic: SemanticColors, elevated?: boolean): CSSProperties {
  return {
    backgroundColor: semantic.surface,
    borderRadius: borderRadius.lg,
    border: elevated ? 'none' : `1px solid ${semantic.border}`,
    boxShadow: elevated
      ? `0 4px 12px ${colors.shadow['200']}, 0 1px 3px ${colors.shadow['100']}`
      : 'none',
    overflow: 'hidden',
  };
}

export function Cards({ semantic }: CardsProps) {
  return (
    <section id="cards" style={{ marginBottom: 48 }}>
      <h2 style={{ marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Cards
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
          <li><strong>iOS:</strong> Inset grouped style, continuous corners, subtle shadows</li>
          <li><strong>Android:</strong> Material elevation system, outlined or filled variants, larger corner radii</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
      }}>
        {/* Basic Card */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Basic Card</h4>
          <div style={getCardStyles(semantic)}>
            <div style={{ padding: spacing[4] }}>
              <h5 style={{
                ...typography.h5,
                color: semantic.onSurface,
                marginBottom: spacing[2],
              }}>
                Card Title
              </h5>
              <p style={{
                ...typography.bodyMd,
                color: semantic.onSurfaceSecondary,
                margin: 0,
              }}>
                This is a basic card component with a title and description text.
              </p>
            </div>
          </div>
        </div>

        {/* Elevated Card */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Elevated Card</h4>
          <div style={getCardStyles(semantic, true)}>
            <div style={{ padding: spacing[4] }}>
              <h5 style={{
                ...typography.h5,
                color: semantic.onSurface,
                marginBottom: spacing[2],
              }}>
                Elevated Card
              </h5>
              <p style={{
                ...typography.bodyMd,
                color: semantic.onSurfaceSecondary,
                margin: 0,
              }}>
                This card has a shadow to create elevation and visual hierarchy.
              </p>
            </div>
          </div>
        </div>

        {/* Card with Image */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Card with Image</h4>
          <div style={getCardStyles(semantic, true)}>
            <div style={{
              height: 140,
              backgroundColor: semantic.surfaceTertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div style={{ padding: spacing[4] }}>
              <h5 style={{
                ...typography.h5,
                color: semantic.onSurface,
                marginBottom: spacing[1],
              }}>
                Image Card
              </h5>
              <p style={{
                ...typography.bodySm,
                color: semantic.onSurfaceSecondary,
                margin: 0,
              }}>
                Cards can include images at the top.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Card */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Interactive Card</h4>
          <div
            style={{
              ...getCardStyles(semantic, true),
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${colors.shadow['300']}, 0 2px 6px ${colors.shadow['200']}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.shadow['200']}, 0 1px 3px ${colors.shadow['100']}`;
            }}
          >
            <div style={{ padding: spacing[4] }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h5 style={{
                    ...typography.h5,
                    color: semantic.onSurface,
                    marginBottom: spacing[1],
                  }}>
                    Clickable Card
                  </h5>
                  <p style={{
                    ...typography.bodySm,
                    color: semantic.onSurfaceSecondary,
                    margin: 0,
                  }}>
                    Hover to see the interaction effect.
                  </p>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card with Actions */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Card with Actions</h4>
          <div style={getCardStyles(semantic)}>
            <div style={{ padding: spacing[4] }}>
              <h5 style={{
                ...typography.h5,
                color: semantic.onSurface,
                marginBottom: spacing[2],
              }}>
                Action Card
              </h5>
              <p style={{
                ...typography.bodySm,
                color: semantic.onSurfaceSecondary,
                marginBottom: spacing[4],
              }}>
                Cards can include action buttons at the bottom.
              </p>
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <button style={{
                  flex: 1,
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${semantic.border}`,
                  backgroundColor: 'transparent',
                  color: semantic.onSurface,
                  cursor: 'pointer',
                  fontFamily: typography.bodySmBold.fontFamily,
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Cancel
                </button>
                <button style={{
                  flex: 1,
                  padding: `${spacing[2]}px ${spacing[3]}px`,
                  borderRadius: borderRadius.full,
                  border: 'none',
                  backgroundColor: semantic.primary,
                  color: colors.neutrals.white,
                  cursor: 'pointer',
                  fontFamily: typography.bodySmBold.fontFamily,
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card with Header */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Card with Header</h4>
          <div style={getCardStyles(semantic)}>
            <div style={{
              padding: `${spacing[3]}px ${spacing[4]}px`,
              borderBottom: `1px solid ${semantic.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h5 style={{
                ...typography.h6,
                color: semantic.onSurface,
                margin: 0,
              }}>
                Header
              </h5>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: semantic.onSurfaceTertiary,
                padding: 4,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
            <div style={{ padding: spacing[4] }}>
              <p style={{
                ...typography.bodyMd,
                color: semantic.onSurfaceSecondary,
                margin: 0,
              }}>
                Content with a separate header section.
              </p>
            </div>
          </div>
        </div>

        {/* Product Card */}
        <div style={{ gridColumn: 'span 2' }}>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Product Card</h4>
          <div style={{
            ...getCardStyles(semantic, true),
            display: 'flex',
            maxWidth: 500,
          }}>
            <div style={{
              width: 140,
              backgroundColor: semantic.surfaceTertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <div style={{ padding: spacing[4], flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[2] }}>
                <div>
                  <span style={{
                    ...typography.bodyXs,
                    color: semantic.onSurfaceTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    Category
                  </span>
                  <h5 style={{
                    ...typography.h5,
                    color: semantic.onSurface,
                    marginTop: spacing[1],
                  }}>
                    Product Name
                  </h5>
                </div>
                <span style={{
                  ...typography.h4,
                  color: semantic.primary,
                }}>
                  $99
                </span>
              </div>
              <p style={{
                ...typography.bodySm,
                color: semantic.onSurfaceSecondary,
                marginBottom: spacing[3],
              }}>
                Brief product description with key features and benefits.
              </p>
              <button style={{
                width: '100%',
                padding: `${spacing[2]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                border: 'none',
                backgroundColor: semantic.primary,
                color: colors.neutrals.white,
                cursor: 'pointer',
                fontFamily: typography.bodySmBold.fontFamily,
                fontSize: 14,
                fontWeight: 600,
              }}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
