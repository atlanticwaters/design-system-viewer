import { SemanticColors, colors } from '../tokens/colors';
import { borderRadius } from '../tokens/radius';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

interface AlertsProps {
  semantic: SemanticColors;
}

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title: string;
  message: string;
  semantic: SemanticColors;
  showIcon?: boolean;
  dismissible?: boolean;
}

function Alert({ variant, title, message, semantic, showIcon = true, dismissible = false }: AlertProps) {
  const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: string; color: string }> = {
    success: {
      bg: semantic.successLight,
      border: semantic.success,
      icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
      color: semantic.success,
    },
    warning: {
      bg: semantic.warningLight,
      border: semantic.warning,
      icon: 'M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      color: semantic.warning,
    },
    error: {
      bg: semantic.errorLight,
      border: semantic.error,
      icon: 'M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
      color: semantic.error,
    },
    info: {
      bg: semantic.infoLight,
      border: semantic.info,
      icon: 'M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
      color: semantic.info,
    },
  };

  const style = variantStyles[variant];

  return (
    <div style={{
      backgroundColor: style.bg,
      borderLeft: `4px solid ${style.border}`,
      borderRadius: borderRadius.md,
      padding: spacing[4],
      display: 'flex',
      gap: spacing[3],
    }}>
      {showIcon && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={style.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <path d={style.icon} />
        </svg>
      )}
      <div style={{ flex: 1 }}>
        <div style={{
          ...typography.bodyMdBold,
          color: semantic.onSurface,
          marginBottom: spacing[1],
        }}>
          {title}
        </div>
        <div style={{
          ...typography.bodySm,
          color: semantic.onSurfaceSecondary,
        }}>
          {message}
        </div>
      </div>
      {dismissible && (
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: semantic.onSurfaceTertiary,
          padding: 4,
          marginTop: -4,
          marginRight: -4,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function Alerts({ semantic }: AlertsProps) {
  return (
    <section id="alerts" style={{ marginBottom: 48 }}>
      <h2 style={{ fontFamily: "'Open Sans', sans-serif", marginBottom: 24, borderBottom: '2px solid #F96302', paddingBottom: 8, color: semantic.onSurface }}>
        Alerts & Notifications
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
          <li><strong>iOS:</strong> Native alerts with stacked buttons, action sheets from bottom</li>
          <li><strong>Android:</strong> Material Snackbars, Dialog with side-by-side buttons, Banners</li>
        </ul>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}>
        {/* Alert Variants */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Alert Variants</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <Alert
              variant="success"
              title="Success"
              message="Your changes have been saved successfully."
              semantic={semantic}
            />
            <Alert
              variant="warning"
              title="Warning"
              message="Your session will expire in 5 minutes."
              semantic={semantic}
            />
            <Alert
              variant="error"
              title="Error"
              message="Failed to save changes. Please try again."
              semantic={semantic}
            />
            <Alert
              variant="info"
              title="Information"
              message="A new version is available for download."
              semantic={semantic}
            />
          </div>
        </div>

        {/* Dismissible Alerts */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Dismissible Alerts</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <Alert
              variant="info"
              title="Dismissible Alert"
              message="Click the X button to dismiss this alert."
              semantic={semantic}
              dismissible
            />
            <Alert
              variant="success"
              title="Task Completed"
              message="You can close this notification."
              semantic={semantic}
              dismissible
            />
          </div>
        </div>

        {/* Toast Notifications */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Toast Notifications</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            {[
              { icon: '✓', text: 'Item added to cart', color: semantic.success },
              { icon: '⚠', text: 'Low stock warning', color: semantic.warning },
              { icon: '✕', text: 'Payment failed', color: semantic.error },
            ].map((toast) => (
              <div
                key={toast.text}
                style={{
                  backgroundColor: semantic.surface,
                  borderRadius: borderRadius.lg,
                  padding: `${spacing[3]}px ${spacing[4]}px`,
                  boxShadow: `0 4px 12px ${colors.shadow['200']}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[3],
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: toast.color,
                  color: colors.neutrals.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                }}>
                  {toast.icon}
                </div>
                <span style={{ ...typography.bodySm, color: semantic.onSurface, flex: 1 }}>
                  {toast.text}
                </span>
                <button style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: semantic.onSurfaceTertiary,
                  padding: 4,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Inline Messages */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Inline Messages</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <div style={{
              padding: spacing[3],
              borderRadius: borderRadius.md,
              backgroundColor: semantic.successLight,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.success} strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />
              </svg>
              <span style={{ ...typography.bodySm, color: semantic.success }}>
                Email verified successfully
              </span>
            </div>
            <div style={{
              padding: spacing[3],
              borderRadius: borderRadius.md,
              backgroundColor: semantic.errorLight,
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={semantic.error} strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6M9 9l6 6" />
              </svg>
              <span style={{ ...typography.bodySm, color: semantic.error }}>
                Password must be at least 8 characters
              </span>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div style={{ gridColumn: 'span 2' }}>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Banner</h4>
          <div style={{
            backgroundColor: semantic.primary,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]}px ${spacing[4]}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[4],
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.neutrals.white} strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span style={{ ...typography.bodySm, color: colors.neutrals.white }}>
                Get 20% off your first order! Use code: <strong>WELCOME20</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
              <button style={{
                padding: `${spacing[1]}px ${spacing[3]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: colors.neutrals.white,
                color: semantic.primary,
                border: 'none',
                cursor: 'pointer',
                fontFamily: typography.bodySm.fontFamily,
                fontSize: 13,
                fontWeight: 600,
              }}>
                Shop Now
              </button>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.neutrals.white,
                padding: 4,
                opacity: 0.8,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Dialog Preview */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Dialog (Modal)</h4>
          <div style={{
            backgroundColor: semantic.surface,
            borderRadius: borderRadius.lg,
            boxShadow: `0 8px 32px ${colors.shadow['300']}`,
            padding: spacing[5],
            maxWidth: 320,
          }}>
            <h5 style={{ ...typography.h5, color: semantic.onSurface, marginBottom: spacing[2] }}>
              Delete Item?
            </h5>
            <p style={{ ...typography.bodySm, color: semantic.onSurfaceSecondary, marginBottom: spacing[4] }}>
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: spacing[2], justifyContent: 'flex-end' }}>
              <button style={{
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: 'transparent',
                color: semantic.onSurface,
                border: `1px solid ${semantic.border}`,
                cursor: 'pointer',
                fontFamily: typography.bodySm.fontFamily,
                fontSize: 14,
                fontWeight: 600,
              }}>
                Cancel
              </button>
              <button style={{
                padding: `${spacing[2]}px ${spacing[4]}px`,
                borderRadius: borderRadius.full,
                backgroundColor: semantic.error,
                color: colors.neutrals.white,
                border: 'none',
                cursor: 'pointer',
                fontFamily: typography.bodySm.fontFamily,
                fontSize: 14,
                fontWeight: 600,
              }}>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Snackbar (Android Style) */}
        <div>
          <h4 style={{ marginBottom: 16, color: semantic.onSurface }}>Snackbar (Android Style)</h4>
          <div style={{
            backgroundColor: semantic.onSurface,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]}px ${spacing[4]}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[4],
          }}>
            <span style={{ ...typography.bodySm, color: semantic.surface }}>
              Message sent successfully
            </span>
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: semantic.primary,
              fontFamily: typography.bodySm.fontFamily,
              fontSize: 14,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Undo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
