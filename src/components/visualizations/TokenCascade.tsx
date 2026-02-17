import { useState, useEffect, useRef, useCallback } from 'react';
import { SemanticColors, colors } from '../../tokens/colors';
import { typography } from '../../tokens/typography';
import { spacing } from '../../tokens/spacing';
import { borderRadius } from '../../tokens/radius';

interface TokenCascadeProps {
  semantic: SemanticColors;
  isDark?: boolean;
}

interface CascadeNode {
  id: string;
  label: string;
  tier: number;
  color: string;
  x: number;
  y: number;
}

interface CascadeConnection {
  from: string;
  to: string;
}

const TIER_LABELS = ['Core Tokens', 'Semantic Aliases', 'Component Styles', 'Platform Outputs'];
const TIER_COUNT = 4;
const ANIMATION_DELAY_PER_TIER = 400;

// Define the dependency graph for the cascade
function buildGraph(semantic: SemanticColors) {
  const nodes: CascadeNode[] = [
    // Tier 0: Core tokens
    { id: 'brand-300', label: 'brand.300', tier: 0, color: colors.brand['300'], x: 0, y: 0 },
    { id: 'green-500', label: 'bottleGreen.500', tier: 0, color: colors.bottleGreen['500'], x: 0, y: 1 },
    { id: 'greige-900', label: 'greige.900', tier: 0, color: colors.greige['900'], x: 0, y: 2 },
    { id: 'greige-050', label: 'greige.050', tier: 0, color: colors.greige['050'], x: 0, y: 3 },
    { id: 'cinnabar-500', label: 'cinnabar.500', tier: 0, color: colors.cinnabar['500'], x: 0, y: 4 },

    // Tier 1: Semantic aliases
    { id: 'sem-primary', label: 'primary', tier: 1, color: semantic.primary, x: 1, y: 0 },
    { id: 'sem-secondary', label: 'secondary', tier: 1, color: semantic.secondary, x: 1, y: 1 },
    { id: 'sem-onSurface', label: 'onSurface', tier: 1, color: semantic.onSurface, x: 1, y: 2 },
    { id: 'sem-surface', label: 'surface', tier: 1, color: semantic.surfaceSecondary, x: 1, y: 3 },
    { id: 'sem-error', label: 'error', tier: 1, color: semantic.error, x: 1, y: 4 },

    // Tier 2: Component styles
    { id: 'comp-btnFill', label: 'Button Fill', tier: 2, color: semantic.primary, x: 2, y: 0 },
    { id: 'comp-btnOutline', label: 'Button Outline', tier: 2, color: semantic.secondary, x: 2, y: 1 },
    { id: 'comp-cardBg', label: 'Card Surface', tier: 2, color: semantic.surfaceSecondary, x: 2, y: 2 },
    { id: 'comp-inputBorder', label: 'Input Border', tier: 2, color: semantic.border, x: 2, y: 3 },
    { id: 'comp-alertError', label: 'Alert Error', tier: 2, color: semantic.error, x: 2, y: 4 },

    // Tier 3: Platform outputs
    { id: 'plat-web', label: 'Web CSS', tier: 3, color: semantic.primary, x: 3, y: 0 },
    { id: 'plat-ios', label: 'iOS UIColor', tier: 3, color: semantic.primary, x: 3, y: 1 },
    { id: 'plat-android', label: 'Android XML', tier: 3, color: semantic.primary, x: 3, y: 2 },
    { id: 'plat-webCard', label: 'Web Card', tier: 3, color: semantic.surfaceSecondary, x: 3, y: 3 },
    { id: 'plat-iosAlert', label: 'iOS Alert', tier: 3, color: semantic.error, x: 3, y: 4 },
  ];

  const connections: CascadeConnection[] = [
    // Core → Semantic
    { from: 'brand-300', to: 'sem-primary' },
    { from: 'green-500', to: 'sem-secondary' },
    { from: 'greige-900', to: 'sem-onSurface' },
    { from: 'greige-050', to: 'sem-surface' },
    { from: 'cinnabar-500', to: 'sem-error' },
    // Semantic → Component
    { from: 'sem-primary', to: 'comp-btnFill' },
    { from: 'sem-secondary', to: 'comp-btnOutline' },
    { from: 'sem-surface', to: 'comp-cardBg' },
    { from: 'sem-onSurface', to: 'comp-inputBorder' },
    { from: 'sem-error', to: 'comp-alertError' },
    // Component → Platform
    { from: 'comp-btnFill', to: 'plat-web' },
    { from: 'comp-btnFill', to: 'plat-ios' },
    { from: 'comp-btnFill', to: 'plat-android' },
    { from: 'comp-cardBg', to: 'plat-webCard' },
    { from: 'comp-alertError', to: 'plat-iosAlert' },
  ];

  return { nodes, connections };
}

// Get all downstream connections from a given node
function getDownstream(nodeId: string, connections: CascadeConnection[]): Set<string> {
  const result = new Set<string>();
  const queue = [nodeId];
  result.add(nodeId);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const conn of connections) {
      if (conn.from === current && !result.has(conn.to)) {
        result.add(conn.to);
        queue.push(conn.to);
      }
    }
  }
  return result;
}

export function TokenCascade({ semantic, isDark }: TokenCascadeProps) {
  const [activatedNodes, setActivatedNodes] = useState<Set<string>>(new Set());
  const [activatedEdges, setActivatedEdges] = useState<Set<string>>(new Set());
  const [selectedCore, setSelectedCore] = useState<string | null>(null);
  const [leverageCount, setLeverageCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);

  const { nodes, connections } = buildGraph(semantic);

  const resetCascade = useCallback(() => {
    setActivatedNodes(new Set());
    setActivatedEdges(new Set());
    setSelectedCore(null);
    setLeverageCount(0);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  const triggerCascade = useCallback((coreNodeId: string) => {
    resetCascade();
    setSelectedCore(coreNodeId);

    const downstream = getDownstream(coreNodeId, connections);
    const downstreamNodes = nodes.filter(n => downstream.has(n.id));

    // Group by tier
    const tiers: Record<number, string[]> = {};
    for (const n of downstreamNodes) {
      if (!tiers[n.tier]) tiers[n.tier] = [];
      tiers[n.tier].push(n.id);
    }

    // Animate tier by tier
    for (let tier = 0; tier < TIER_COUNT; tier++) {
      if (!tiers[tier]) continue;
      setTimeout(() => {
        setActivatedNodes(prev => {
          const next = new Set(prev);
          for (const id of tiers[tier]) next.add(id);
          return next;
        });
        // Activate edges from previous tier to this tier
        if (tier > 0) {
          setActivatedEdges(prev => {
            const next = new Set(prev);
            for (const conn of connections) {
              if (downstream.has(conn.from) && tiers[tier]?.includes(conn.to)) {
                next.add(`${conn.from}->${conn.to}`);
              }
            }
            return next;
          });
        }
      }, tier * ANIMATION_DELAY_PER_TIER);
    }

    // Animate leverage counter
    const targetCount = 564;
    const duration = TIER_COUNT * ANIMATION_DELAY_PER_TIER + 600;
    const startTime = performance.now();
    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setLeverageCount(Math.round(eased * targetCount));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateCount);
      }
    };
    animFrameRef.current = requestAnimationFrame(animateCount);
  }, [connections, nodes, resetCascade]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Layout constants
  const NODE_W = 130;
  const NODE_H = 40;
  const COL_GAP = 60;
  const ROW_GAP = 16;
  const TIER_HEADER = 36;
  const LEFT_PAD = 16;
  const TOP_PAD = TIER_HEADER + 16;

  const totalW = TIER_COUNT * (NODE_W + COL_GAP) - COL_GAP + LEFT_PAD * 2;
  const maxRows = 5;
  const totalH = TOP_PAD + maxRows * (NODE_H + ROW_GAP) - ROW_GAP + 24;

  const getNodePos = (node: CascadeNode) => ({
    x: LEFT_PAD + node.tier * (NODE_W + COL_GAP),
    y: TOP_PAD + node.y * (NODE_H + ROW_GAP),
  });

  const svgStyle = `
    @keyframes cascadePulse {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(249, 99, 2, 0.3)); }
      50% { filter: drop-shadow(0 0 12px rgba(249, 99, 2, 0.7)); }
    }
    @keyframes drawLine {
      from { stroke-dashoffset: 200; }
      to { stroke-dashoffset: 0; }
    }
  `;

  return (
    <section id="cascade" style={{ marginBottom: spacing[12] }}>
      <h2 style={{
        ...typography.h3,
        color: semantic.onSurface,
        borderBottom: `2px solid ${semantic.primary}`,
        paddingBottom: spacing[2],
        marginBottom: spacing[4],
      }}>
        The Cascade
      </h2>
      <p style={{
        ...typography.bodyMd,
        color: semantic.onSurfaceSecondary,
        marginBottom: spacing[4],
      }}>
        Click a core token to watch it ripple through semantic aliases, component styles, and platform outputs.
      </p>

      {/* Leverage Counter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[4],
        marginBottom: spacing[4],
        padding: `${spacing[3]}px ${spacing[4]}px`,
        backgroundColor: semantic.surfaceSecondary,
        borderRadius: borderRadius.lg,
      }}>
        <div style={{
          ...typography.h4,
          color: semantic.primary,
          fontVariantNumeric: 'tabular-nums',
          minWidth: 180,
        }}>
          1 change &rarr; {leverageCount > 0 ? (
            <span style={{ fontWeight: 700 }}>{leverageCount}</span>
          ) : (
            <span style={{ opacity: 0.4 }}>???</span>
          )} updates
        </div>
        <button
          onClick={resetCascade}
          style={{
            padding: `${spacing[1]}px ${spacing[3]}px`,
            borderRadius: borderRadius.full,
            backgroundColor: 'transparent',
            border: `1px solid ${semantic.border}`,
            color: semantic.onSurfaceSecondary,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Reset
        </button>
      </div>

      {/* Cascade Diagram */}
      <div
        ref={containerRef}
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderRadius: borderRadius.lg,
          border: `1px solid ${semantic.border}`,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        <svg
          viewBox={`0 0 ${totalW} ${totalH}`}
          width="100%"
          style={{ display: 'block', minWidth: 700 }}
        >
          <style>{svgStyle}</style>

          {/* Tier labels */}
          {TIER_LABELS.map((label, i) => (
            <text
              key={label}
              x={LEFT_PAD + i * (NODE_W + COL_GAP) + NODE_W / 2}
              y={20}
              textAnchor="middle"
              fill={semantic.onSurfaceSecondary}
              fontSize="12"
              fontWeight="600"
              fontFamily={typography.bodySm.fontFamily}
            >
              {label}
            </text>
          ))}

          {/* Connection lines */}
          {connections.map(conn => {
            const fromNode = nodes.find(n => n.id === conn.from)!;
            const toNode = nodes.find(n => n.id === conn.to)!;
            const fromPos = getNodePos(fromNode);
            const toPos = getNodePos(toNode);
            const edgeKey = `${conn.from}->${conn.to}`;
            const isActive = activatedEdges.has(edgeKey);

            const x1 = fromPos.x + NODE_W;
            const y1 = fromPos.y + NODE_H / 2;
            const x2 = toPos.x;
            const y2 = toPos.y + NODE_H / 2;
            const cpx = (x1 + x2) / 2;

            return (
              <path
                key={edgeKey}
                d={`M ${x1} ${y1} C ${cpx} ${y1}, ${cpx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={isActive ? semantic.primary : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}
                strokeWidth={isActive ? 2.5 : 1}
                strokeDasharray={isActive ? '200' : 'none'}
                strokeDashoffset={isActive ? '0' : undefined}
                style={isActive ? {
                  animation: 'drawLine 0.5s ease forwards',
                  transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                } : {
                  transition: 'stroke 0.3s ease',
                }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const pos = getNodePos(node);
            const isActive = activatedNodes.has(node.id);
            const isCoreClickable = node.tier === 0;
            const isSelected = selectedCore === node.id;

            return (
              <g
                key={node.id}
                style={{ cursor: isCoreClickable ? 'pointer' : 'default' }}
                onClick={() => isCoreClickable && triggerCascade(node.id)}
              >
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  ry={8}
                  fill={isActive ? node.color : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')}
                  stroke={isSelected ? semantic.primary : (isActive ? node.color : 'transparent')}
                  strokeWidth={isSelected ? 2.5 : isActive ? 1.5 : 0}
                  style={{
                    transition: 'all 0.4s ease',
                    filter: isActive ? `drop-shadow(0 0 8px ${node.color}66)` : 'none',
                  }}
                />
                {/* Color dot */}
                <circle
                  cx={pos.x + 14}
                  cy={pos.y + NODE_H / 2}
                  r={5}
                  fill={node.color}
                  style={{
                    transition: 'all 0.4s ease',
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
                <text
                  x={pos.x + 26}
                  y={pos.y + NODE_H / 2 + 4}
                  fill={isActive ? getTextOnColor(node.color) : semantic.onSurfaceSecondary}
                  fontSize="11"
                  fontWeight={isActive ? '600' : '400'}
                  fontFamily={typography.bodySm.fontFamily}
                  style={{ transition: 'fill 0.4s ease' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p style={{
        ...typography.bodyXs,
        color: semantic.onSurfaceTertiary,
        marginTop: spacing[2],
        fontStyle: 'italic',
      }}>
        Click any core token in the first column to trigger the cascade animation.
      </p>
    </section>
  );
}

function getTextOnColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
