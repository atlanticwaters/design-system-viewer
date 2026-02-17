import { useState } from 'react';
import { SemanticColors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/radius';
import { allBrands, BrandPalette, BrandAppearance } from '../../tokens/brands';
import { materials, vibrancy } from '../../tokens/surfaces';
import { stateLayerOpacity } from '../../tokens/states';

interface PlatformPassportProps {
  semantic: SemanticColors;
  isDark?: boolean;
}

function BrandTabs({
  brands,
  activeIndex,
  onSelect,
  semantic,
}: {
  brands: BrandPalette[];
  activeIndex: number;
  onSelect: (i: number) => void;
  semantic: SemanticColors;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: spacing[1],
      marginBottom: spacing[3],
      flexWrap: 'wrap',
    }}>
      {brands.map((brand, i) => (
        <button
          key={brand.name}
          onClick={() => onSelect(i)}
          style={{
            padding: `${spacing[2]}px ${spacing[4]}px`,
            borderRadius: borderRadius.full,
            border: activeIndex === i ? 'none' : `1px solid ${semantic.border}`,
            backgroundColor: activeIndex === i ? brand.light.accent : 'transparent',
            color: activeIndex === i ? '#FFFFFF' : semantic.onSurfaceSecondary,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: typography.bodySm.fontFamily,
            transition: 'all 0.3s ease',
          }}
        >
          {brand.name}
        </button>
      ))}
    </div>
  );
}

function DarkModeToggle({
  isDark,
  onToggle,
  semantic,
}: {
  isDark: boolean;
  onToggle: () => void;
  semantic: SemanticColors;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: `${spacing[1]}px ${spacing[3]}px`,
        borderRadius: borderRadius.full,
        border: `1px solid ${semantic.border}`,
        backgroundColor: isDark ? semantic.surfaceSecondary : 'transparent',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: typography.bodySm.fontFamily,
        color: semantic.onSurfaceSecondary,
        transition: 'all 0.3s ease',
      }}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
      {isDark ? 'Dark' : 'Light'}
    </button>
  );
}

// Mini UI rendered inside each device frame — 9 component types
function MiniUI({
  brand,
  appearance,
  platform,
}: {
  brand: BrandPalette;
  appearance: BrandAppearance;
  platform: 'web' | 'ios' | 'android';
}) {
  const isDarkMode = appearance === brand.dark;
  const bg = appearance.surface;
  const text = appearance.onSurface;
  const textSec = appearance.onSurfaceSecondary;
  const accent = appearance.accent;
  const accentSec = appearance.accentSecondary;
  const borderColor = appearance.border;

  // Platform-specific style modifiers
  const btnRadius = platform === 'android' ? 12 : borderRadius.full;
  const cardRadius = platform === 'android' ? 12 : platform === 'ios' ? 16 : borderRadius.lg;
  const cardShadow = platform === 'web'
    ? '0 2px 8px rgba(0,0,0,0.10)'
    : platform === 'android'
      ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)'
      : 'none';
  const cardBlur = platform === 'ios' ? `blur(${materials.regular.blur}px)` : undefined;
  const cardBg = platform === 'ios'
    ? (isDarkMode ? `rgba(255,255,255,${vibrancy.quaternary})` : `rgba(255,255,255,${materials.regular.opacity})`)
    : appearance.cardBg;

  // Android elevation tonal overlay
  const androidTonal = platform === 'android' && isDarkMode
    ? `rgba(${hexToRgbStr(accent)}, ${stateLayerOpacity.hover})`
    : undefined;

  const iosBorder = platform === 'ios' ? `0.5px solid rgba(255,255,255,0.18)` : undefined;

  return (
    <div style={{
      padding: 10,
      backgroundColor: bg,
      boxShadow: androidTonal ? `inset 0 0 0 9999px ${androidTonal}` : undefined,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      fontFamily: typography.bodySm.fontFamily,
      transition: 'all 0.4s ease',
      overflowY: 'auto',
    }}>
      {/* 1. Nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={text} strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 600, color: text }}>Dashboard</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={text}>
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </div>

      {/* 2. Hero card */}
      <div style={{
        backgroundColor: cardBg,
        borderRadius: cardRadius,
        overflow: 'hidden',
        boxShadow: cardShadow,
        backdropFilter: cardBlur,
        border: iosBorder,
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          backgroundColor: accent,
          padding: '8px 10px 6px',
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>Welcome back</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 1 }}>Your tokens are ready</div>
        </div>
        <div style={{ padding: '6px 10px 8px' }}>
          <div style={{ fontSize: 10, color: textSec, lineHeight: 1.4 }}>
            Design tokens render native UIs across all platforms.
          </div>
        </div>
      </div>

      {/* 3. Button row — primary, outlined, ghost */}
      <div style={{ display: 'flex', gap: 5 }}>
        <div style={{
          flex: 1,
          backgroundColor: accent,
          color: '#FFFFFF',
          borderRadius: btnRadius,
          padding: '6px 0',
          fontSize: 10,
          fontWeight: 600,
          textAlign: 'center',
          transition: 'all 0.4s ease',
        }}>
          Primary
        </div>
        <div style={{
          flex: 1,
          backgroundColor: 'transparent',
          color: accent,
          borderRadius: btnRadius,
          padding: '6px 0',
          fontSize: 10,
          fontWeight: 600,
          textAlign: 'center',
          border: `1.5px solid ${accent}`,
          transition: 'all 0.4s ease',
        }}>
          Outlined
        </div>
        <div style={{
          flex: 1,
          backgroundColor: 'transparent',
          color: accent,
          borderRadius: btnRadius,
          padding: '6px 0',
          fontSize: 10,
          fontWeight: 600,
          textAlign: 'center',
          transition: 'all 0.4s ease',
        }}>
          Ghost
        </div>
      </div>

      {/* 4. Text input */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 600, color: textSec, marginBottom: 3 }}>Email</div>
        <div style={{
          borderRadius: platform === 'android' ? 4 : 8,
          border: `1px solid ${borderColor}`,
          padding: '5px 8px',
          fontSize: 10,
          color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
          backgroundColor: platform === 'android' ? 'transparent' : (isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'),
          transition: 'all 0.4s ease',
        }}>
          user@example.com
        </div>
      </div>

      {/* 5. List items (3) */}
      <div style={{
        backgroundColor: cardBg,
        borderRadius: cardRadius,
        overflow: 'hidden',
        boxShadow: cardShadow,
        backdropFilter: cardBlur,
        border: iosBorder,
        transition: 'all 0.4s ease',
      }}>
        {[
          { name: 'Alex Morgan', sub: 'Product Designer' },
          { name: 'Sam Chen', sub: 'Engineer' },
          { name: 'Jo Rivera', sub: 'Design Lead' },
        ].map((item, idx) => (
          <div key={item.name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderBottom: idx < 2 ? `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` : 'none',
          }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: idx === 0 ? accent : idx === 1 ? accentSec : appearance.surfaceTertiary,
              flexShrink: 0,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: text }}>{item.name}</div>
              <div style={{ fontSize: 9, color: textSec }}>{item.sub}</div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={textSec} strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>

      {/* 6. Toggle row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
        <span style={{ fontSize: 10, color: text }}>Notifications</span>
        <div style={{
          width: 32,
          height: 18,
          borderRadius: 9,
          backgroundColor: accent,
          position: 'relative',
          transition: 'all 0.4s ease',
        }}>
          <div style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: 2,
            left: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      </div>

      {/* 7. Chip row */}
      <div style={{ display: 'flex', gap: 4 }}>
        <div style={{
          padding: '3px 8px',
          borderRadius: borderRadius.full,
          backgroundColor: accent,
          color: '#FFFFFF',
          fontSize: 9,
          fontWeight: 600,
        }}>
          Active
        </div>
        <div style={{
          padding: '3px 8px',
          borderRadius: borderRadius.full,
          backgroundColor: 'transparent',
          color: textSec,
          fontSize: 9,
          fontWeight: 500,
          border: `1px solid ${borderColor}`,
        }}>
          Draft
        </div>
        <div style={{
          padding: '3px 8px',
          borderRadius: borderRadius.full,
          backgroundColor: 'transparent',
          color: textSec,
          fontSize: 9,
          fontWeight: 500,
          border: `1px solid ${borderColor}`,
        }}>
          Archive
        </div>
      </div>

      {/* 8. Alert banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        borderRadius: platform === 'android' ? 4 : 8,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        borderLeft: `3px solid ${appearance.info}`,
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: appearance.info,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: 9, color: textSec, lineHeight: 1.3 }}>
          2 updates available for your tokens.
        </span>
      </div>

      {/* 9. Bottom tab bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '5px 0 2px',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        marginTop: 'auto',
      }}>
        {[
          { label: 'Home', active: true },
          { label: 'Search', active: false },
          { label: 'Tokens', active: false },
          { label: 'Profile', active: false },
        ].map(tab => (
          <div key={tab.label} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: tab.active ? accent : (isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'),
              transition: 'all 0.4s ease',
            }} />
            <span style={{
              fontSize: 7,
              fontWeight: tab.active ? 600 : 400,
              color: tab.active ? accent : textSec,
              transition: 'all 0.4s ease',
            }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Device frame components
function BrowserFrame({ brand, appearance, semantic }: { brand: BrandPalette; appearance: BrandAppearance; semantic: SemanticColors }) {
  const isDarkMode = appearance === brand.dark;
  return (
    <div style={{
      border: `1px solid ${semantic.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      flex: 1,
      minWidth: 200,
      transition: 'all 0.4s ease',
    }}>
      {/* Browser chrome */}
      <div style={{
        backgroundColor: isDarkMode ? '#2a2a2a' : '#e8e8e8',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5F57' }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FEBC2E' }} />
          <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#28C840' }} />
        </div>
        <div style={{
          flex: 1,
          backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
          borderRadius: 4,
          padding: '3px 8px',
          fontSize: 10,
          color: isDarkMode ? '#999' : '#888',
          transition: 'all 0.4s ease',
        }}>
          app.example.com
        </div>
      </div>
      <div style={{ height: 420 }}>
        <MiniUI brand={brand} appearance={appearance} platform="web" />
      </div>
    </div>
  );
}

function IPhoneFrame({ brand, appearance, semantic }: { brand: BrandPalette; appearance: BrandAppearance; semantic: SemanticColors }) {
  return (
    <div style={{
      border: `1px solid ${semantic.border}`,
      borderRadius: 24,
      overflow: 'hidden',
      flex: 1,
      minWidth: 200,
      transition: 'all 0.4s ease',
    }}>
      {/* iPhone status bar with Dynamic Island */}
      <div style={{
        backgroundColor: appearance.surface,
        padding: '6px 16px 4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.4s ease',
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: appearance.onSurface }}>9:41</span>
        {/* Dynamic Island */}
        <div style={{
          width: 72,
          height: 18,
          borderRadius: 12,
          backgroundColor: '#000000',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }} />
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <svg width="12" height="10" viewBox="0 0 16 12" fill={appearance.onSurface}>
            <rect x="0" y="8" width="3" height="4" rx="0.5" />
            <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
            <rect x="9" y="2" width="3" height="10" rx="0.5" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
          </svg>
          <svg width="16" height="9" viewBox="0 0 25 12" fill={appearance.onSurface}>
            <rect x="0" y="1" width="22" height="10" rx="2" stroke={appearance.onSurface} strokeWidth="1" fill="none" />
            <rect x="2" y="3" width="14" height="6" rx="1" fill={appearance.onSurface} />
            <rect x="23" y="4" width="2" height="4" rx="1" fill={appearance.onSurface} />
          </svg>
        </div>
      </div>
      <div style={{ height: 420 }}>
        <MiniUI brand={brand} appearance={appearance} platform="ios" />
      </div>
      {/* Home indicator */}
      <div style={{
        backgroundColor: appearance.surface,
        padding: '4px 0 6px',
        display: 'flex',
        justifyContent: 'center',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: 100,
          height: 4,
          borderRadius: 2,
          backgroundColor: appearance.onSurface,
          opacity: 0.2,
        }} />
      </div>
    </div>
  );
}

function AndroidFrame({ brand, appearance, semantic }: { brand: BrandPalette; appearance: BrandAppearance; semantic: SemanticColors }) {
  return (
    <div style={{
      border: `1px solid ${semantic.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      flex: 1,
      minWidth: 200,
      transition: 'all 0.4s ease',
    }}>
      {/* Android status bar */}
      <div style={{
        backgroundColor: appearance.surface,
        padding: '4px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.4s ease',
      }}>
        <span style={{ fontSize: 10, color: appearance.onSurface }}>12:00</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill={appearance.onSurface}>
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg width="12" height="10" viewBox="0 0 24 16" fill={appearance.onSurface}>
            <rect x="1" y="2" width="20" height="12" rx="2" stroke={appearance.onSurface} strokeWidth="1.5" fill="none" />
            <rect x="3" y="4" width="12" height="8" rx="1" />
            <rect x="22" y="5" width="2" height="5" rx="1" />
          </svg>
        </div>
      </div>
      <div style={{ height: 420 }}>
        <MiniUI brand={brand} appearance={appearance} platform="android" />
      </div>
      {/* Gesture bar */}
      <div style={{
        backgroundColor: appearance.surface,
        padding: '6px 0 8px',
        display: 'flex',
        justifyContent: 'center',
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: 80,
          height: 4,
          borderRadius: 2,
          backgroundColor: appearance.onSurface,
          opacity: 0.3,
        }} />
      </div>
    </div>
  );
}

export function PlatformPassport({ semantic }: PlatformPassportProps) {
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [previewDark, setPreviewDark] = useState(false);
  const brand = allBrands[activeBrandIdx];
  const appearance = previewDark ? brand.dark : brand.light;

  return (
    <section id="passport" style={{ marginBottom: spacing[12] }}>
      <h2 style={{
        ...typography.h3,
        color: semantic.onSurface,
        borderBottom: `2px solid ${semantic.primary}`,
        paddingBottom: spacing[2],
        marginBottom: spacing[4],
      }}>
        Platform Passport
      </h2>
      <p style={{
        ...typography.bodyMd,
        color: semantic.onSurfaceSecondary,
        marginBottom: spacing[4],
      }}>
        The same design tokens render native-feeling UIs across Web, iOS, and Android. Switch brands and toggle appearance to see tokens in action.
      </p>

      {/* Controls row: brand tabs + dark mode toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: spacing[2],
        marginBottom: spacing[3],
      }}>
        <BrandTabs
          brands={allBrands}
          activeIndex={activeBrandIdx}
          onSelect={setActiveBrandIdx}
          semantic={semantic}
        />
        <DarkModeToggle
          isDark={previewDark}
          onToggle={() => setPreviewDark(!previewDark)}
          semantic={semantic}
        />
      </div>

      {/* Brand info pills */}
      <div style={{
        display: 'flex',
        gap: spacing[2],
        marginBottom: spacing[4],
        flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: `${spacing[1]}px ${spacing[3]}px`,
          backgroundColor: semantic.surfaceSecondary,
          borderRadius: borderRadius.full,
          fontSize: 12,
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: appearance.accent,
          }} />
          <span style={{ color: semantic.onSurfaceSecondary }}>Primary: {appearance.accent}</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: `${spacing[1]}px ${spacing[3]}px`,
          backgroundColor: semantic.surfaceSecondary,
          borderRadius: borderRadius.full,
          fontSize: 12,
        }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: appearance.accentSecondary,
          }} />
          <span style={{ color: semantic.onSurfaceSecondary }}>Secondary: {appearance.accentSecondary}</span>
        </div>
        <span style={{
          padding: `${spacing[1]}px ${spacing[3]}px`,
          backgroundColor: semantic.surfaceSecondary,
          borderRadius: borderRadius.full,
          fontSize: 12,
          color: semantic.onSurfaceSecondary,
        }}>
          {previewDark ? 'Dark' : 'Light'}
        </span>
      </div>

      {/* Device Frames */}
      <div style={{
        display: 'flex',
        gap: spacing[4],
        flexWrap: 'wrap',
      }}>
        <BrowserFrame brand={brand} appearance={appearance} semantic={semantic} />
        <IPhoneFrame brand={brand} appearance={appearance} semantic={semantic} />
        <AndroidFrame brand={brand} appearance={appearance} semantic={semantic} />
      </div>

      {/* Platform notes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: spacing[3],
        marginTop: spacing[4],
      }}>
        {[
          { label: 'Web', note: 'Box shadows, pill buttons (border-radius: 9999px)' },
          { label: 'iOS', note: 'Backdrop blur materials, vibrancy opacity layers' },
          { label: 'Android', note: 'Elevation tonal overlay, M3 state layer opacities' },
        ].map(item => (
          <div key={item.label} style={{
            padding: spacing[3],
            backgroundColor: semantic.surfaceSecondary,
            borderRadius: borderRadius.md,
            fontSize: 12,
            color: semantic.onSurfaceSecondary,
            lineHeight: 1.5,
          }}>
            <strong style={{ color: semantic.onSurface }}>{item.label}:</strong>{' '}
            {item.note}
          </div>
        ))}
      </div>
    </section>
  );
}

// Utility: hex to "r, g, b" string
function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)}`;
}
