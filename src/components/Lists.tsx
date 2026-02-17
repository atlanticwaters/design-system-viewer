import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface ListsProps {
  semantic: SemanticColors;
}

export function Lists({ semantic }: ListsProps) {
  const listItems = [
    { id: 1, title: 'List Item One', subtitle: 'Description for item one' },
    { id: 2, title: 'List Item Two', subtitle: 'Description for item two' },
    { id: 3, title: 'List Item Three', subtitle: 'Description for item three' },
  ];

  return (
    <section id="lists" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Lists
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
          <li><strong>iOS:</strong> Inset grouped style, swipe actions, disclosure indicators</li>
          <li><strong>Android:</strong> Material list items with dividers, leading icons, trailing elements</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
      }}>
        {/* Simple List */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Simple List</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            {listItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderBottom: index < listItems.length - 1 ? `1px solid ${semantic.border}` : 'none',
                }}
              >
                <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List with Subtitles */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>List with Subtitles</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            {listItems.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderBottom: index < listItems.length - 1 ? `1px solid ${semantic.border}` : 'none',
                }}
              >
                <div style={{ ...typography.bodyMd, color: semantic.onSurface, marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ ...typography.bodySm, color: semantic.onSurfaceSecondary }}>
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List with Icons */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>List with Icons</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            {[
              { icon: '📁', title: 'Documents', count: 12 },
              { icon: '🖼️', title: 'Photos', count: 248 },
              { icon: '🎵', title: 'Music', count: 56 },
              { icon: '📹', title: 'Videos', count: 8 },
            ].map((item, index, arr) => (
              <div
                key={item.title}
                style={{
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderBottom: index < arr.length - 1 ? `1px solid ${semantic.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                }}
              >
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <span style={{ ...typography.bodyMd, color: semantic.onSurface, flex: 1 }}>
                  {item.title}
                </span>
                <span style={{ ...typography.bodySm, color: semantic.onSurfaceTertiary }}>
                  {item.count}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* List with Avatars */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>List with Avatars</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            {[
              { name: 'Alice Johnson', email: 'alice@example.com', color: colors.brand['300'] },
              { name: 'Bob Smith', email: 'bob@example.com', color: colors.bottleGreen['500'] },
              { name: 'Carol White', email: 'carol@example.com', color: colors.moonlight['500'] },
            ].map((item, index, arr) => (
              <div
                key={item.name}
                style={{
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderBottom: index < arr.length - 1 ? `1px solid ${semantic.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutrals.white,
                  fontWeight: 600,
                  fontSize: 16,
                }}>
                  {item.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...typography.bodyMd, color: semantic.onSurface }}>
                    {item.name}
                  </div>
                  <div style={{ ...typography.bodySm, color: semantic.onSurfaceSecondary }}>
                    {item.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List with Actions */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>List with Actions</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            border: `1px solid ${semantic.border}`,
            overflow: 'hidden',
          }}>
            {[
              { title: 'Notifications', action: 'toggle' },
              { title: 'Dark Mode', action: 'toggle' },
              { title: 'Language', action: 'select', value: 'English' },
              { title: 'Version', action: 'info', value: '1.0.0' },
            ].map((item, index, arr) => (
              <div
                key={item.title}
                style={{
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  borderBottom: index < arr.length - 1 ? `1px solid ${semantic.border}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>
                  {item.title}
                </span>
                {item.action === 'toggle' && (
                  <div style={{
                    width: 44,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: index === 0 ? semantic.primary : semantic.surfaceTertiary,
                    position: 'relative',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: colors.neutrals.white,
                      position: 'absolute',
                      top: 2,
                      left: index === 0 ? 20 : 2,
                      boxShadow: `0 1px 3px ${colors.shadow['200']}`,
                      transition: 'left 0.2s ease',
                    }} />
                  </div>
                )}
                {item.action === 'select' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ ...typography.bodySm, color: semantic.onSurfaceTertiary }}>
                      {item.value}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                )}
                {item.action === 'info' && (
                  <span style={{ ...typography.bodySm, color: semantic.onSurfaceTertiary }}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grouped List */}
        <div>
          <h4 style={{ marginBottom: 12, color: semantic.onSurface }}>Grouped List (iOS Style)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            <div>
              <div style={{
                ...typography.bodyXs,
                color: semantic.onSurfaceTertiary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: spacing[2],
                paddingLeft: spacing[4],
              }}>
                Account
              </div>
              <div style={{
                backgroundColor: semantic.surface,
                borderRadius: borderRadius.lg,
                border: `1px solid ${semantic.border}`,
                overflow: 'hidden',
              }}>
                {['Profile', 'Security', 'Privacy'].map((item, index, arr) => (
                  <div
                    key={item}
                    style={{
                      padding: `${spacing[3]}px ${spacing[4]}px`,
                      borderBottom: index < arr.length - 1 ? `1px solid ${semantic.border}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{item}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{
                ...typography.bodyXs,
                color: semantic.onSurfaceTertiary,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: spacing[2],
                paddingLeft: spacing[4],
              }}>
                Support
              </div>
              <div style={{
                backgroundColor: semantic.surface,
                borderRadius: borderRadius.lg,
                border: `1px solid ${semantic.border}`,
                overflow: 'hidden',
              }}>
                {['Help Center', 'Contact Us'].map((item, index, arr) => (
                  <div
                    key={item}
                    style={{
                      padding: `${spacing[3]}px ${spacing[4]}px`,
                      borderBottom: index < arr.length - 1 ? `1px solid ${semantic.border}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ ...typography.bodyMd, color: semantic.onSurface }}>{item}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.onSurfaceTertiary} strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
