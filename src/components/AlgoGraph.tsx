'use client';

import type { WEdge, WNode } from "@/lib/weighted";

export type EdgeHL = { color: string; width?: number };

/** Shared weighted/directed graph renderer. */
export default function AlgoGraph({
  nodes,
  edges,
  directed,
  nodeFill,
  nodeSub,
  edgeHL,
  onNodeClick,
  height = 340,
}: {
  nodes: WNode[];
  edges: WEdge[];
  directed: boolean;
  nodeFill: (id: number) => string;
  nodeSub?: (id: number) => string | null;
  edgeHL?: Map<string, EdgeHL>;
  onNodeClick?: (id: number) => void;
  height?: number;
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const W = 640;
  const H = 400;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      style={{ maxHeight: height }}
      role="img"
      aria-label="Graph"
    >
      <defs>
        <marker id="ag-aw" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9" fill="none" strokeWidth="1.6" className="stroke-zinc-400" />
        </marker>
        <marker id="ag-hl" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9" fill="none" stroke="#f59e0b" strokeWidth="2" />
        </marker>
      </defs>
      {edges.map((e, k) => {
        const a = byId.get(e.u);
        const b = byId.get(e.v);
        if (!a || !b) return null;
        const key = `${Math.min(e.u, e.v)}-${Math.max(e.u, e.v)}`;
        const hl = edgeHL?.get(key);
        // shorten line so arrowhead doesn't hide under node
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.max(1, Math.hypot(dx, dy));
        const r = 21;
        const x1 = a.x + (dx / len) * (directed ? 2 : 0);
        const y1 = a.y + (dy / len) * (directed ? 2 : 0);
        const x2 = b.x - (dx / len) * (r + (directed ? 4 : 0));
        const y2 = b.y - (dy / len) * (r + (directed ? 4 : 0));
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return (
          <g key={`${key}-${k}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={hl ? hl.color : undefined}
              strokeWidth={hl?.width ?? (hl ? 3 : 1.5)}
              className={hl ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
              markerEnd={directed ? (hl ? "url(#ag-hl)" : "url(#ag-aw)") : undefined}
            />
            {e.w !== 1 && (
              <g>
                <rect
                  x={mx - 13}
                  y={my - 10}
                  width="26"
                  height="18"
                  rx="9"
                  className="fill-white stroke-zinc-200 dark:fill-zinc-950 dark:stroke-zinc-700"
                />
                <text
                  x={mx}
                  y={my + 3.5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  className="fill-zinc-700 font-mono dark:fill-zinc-200"
                >
                  {e.w}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n) => (
        <g
          key={n.id}
          onClick={onNodeClick ? () => onNodeClick(n.id) : undefined}
          className={onNodeClick ? "cursor-pointer" : ""}
        >
          <circle cx={n.x} cy={n.y} r={20} fill={nodeFill(n.id)} />
          <text
            x={n.x}
            y={n.y + 6}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#fff"
            fontFamily="monospace"
          >
            {n.label}
          </text>
          {nodeSub?.(n.id) && (
            <text
              x={n.x}
              y={n.y + 36}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              className="fill-zinc-500 font-mono dark:fill-zinc-400"
            >
              {nodeSub?.(n.id)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
