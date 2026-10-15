'use client';

import { useMemo } from "react";
import type { TNodeSnap } from "@/lib/tree";

const DX = 62;
const DY = 62;

function binaryLayout(nodes: TNodeSnap[], root: number): { pos: Map<number, { x: number; y: number }>; W: number; H: number } {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const pos = new Map<number, { x: number; y: number }>();
  const depth = new Map<number, number>();
  let xi = 0;
  const dfs = (id: number, d: number) => {
    if (id === -1) return;
    const n = byId.get(id);
    if (!n) return;
    depth.set(id, d);
    dfs(n.left, d + 1);
    pos.set(id, { x: 30 + xi * DX, y: 34 + d * DY });
    xi++;
    dfs(n.right, d + 1);
  };
  dfs(root, 0);
  let maxD = 0;
  for (const d of depth.values()) maxD = Math.max(maxD, d);
  const contentW = 60 + xi * DX;
  const W = Math.max(120, contentW, 620);
  const shift = (W - contentW) / 2;
  for (const p of pos.values()) p.x += shift;
  return { pos, W, H: 104 + maxD * DY };
}

export function BinaryTreeSVG({
  nodes,
  root,
  nodeFill,
  nodeSub,
  edgeHL,
  onNodeClick,
}: {
  nodes: TNodeSnap[];
  root: number;
  nodeFill: (id: number) => string;
  nodeSub?: (id: number) => string | null;
  edgeHL?: Map<string, string>;
  onNodeClick?: (id: number) => void;
}) {
  const { pos, W, H } = useMemo(() => binaryLayout(nodes, root), [nodes, root]);
  const key2 = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Binary tree">
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        return [n.left, n.right]
          .filter((c) => c !== -1 && pos.has(c))
          .map((c) => {
            const q = pos.get(c)!;
            const hl = edgeHL?.get(key2(n.id, c));
            return (
              <line
                key={`${n.id}-${c}`}
                x1={p.x}
                y1={p.y + 18}
                x2={q.x}
                y2={q.y - 18}
                stroke={hl ?? undefined}
                strokeWidth={hl ? 3 : 1.5}
                className={hl ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
              />
            );
          });
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        const sub = nodeSub?.(n.id);
        return (
          <g key={n.id} onClick={() => onNodeClick?.(n.id)} className={onNodeClick ? "cursor-pointer" : undefined}>
            <circle cx={p.x} cy={p.y} r={19} fill={nodeFill(n.id)} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">
              {n.val}
            </text>
            {sub && (
              <text x={p.x} y={p.y + 36} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
                {sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function levelOf(i: number): number {
  return Math.floor(Math.log2(i + 1));
}

export function ArrayTreeSVG({
  arr,
  nodeFill,
  nodeSub,
  edgeHL,
  maxDepth,
}: {
  arr: (number | null)[];
  nodeFill: (i: number) => string;
  nodeSub?: (i: number) => string | null;
  edgeHL?: Map<string, string>;
  maxDepth?: number;
}) {
  const live = useMemo(() => arr.map((v, i) => (v === null || v === undefined ? -1 : i)).filter((i) => i >= 0), [arr]);
  const depth = useMemo(() => {
    let d = 0;
    for (const i of live) d = Math.max(d, levelOf(i));
    return Math.max(d, maxDepth ?? 0);
  }, [live, maxDepth]);
  const W = Math.max(Math.pow(2, depth) * 64 + 40, 620);
  const H = 108 + depth * DY;
  const X = (i: number) => {
    const d = levelOf(i);
    const first = Math.pow(2, d) - 1;
    const slot = W / Math.pow(2, d);
    return slot * (i - first + 0.5);
  };
  const Y = (i: number) => 36 + levelOf(i) * DY;
  const key2 = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  const kids = (i: number) => [2 * i + 1, 2 * i + 2].filter((c) => c < arr.length && arr[c] !== null && arr[c] !== undefined);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Array tree">
      {live.map((i) =>
        kids(i).map((c) => {
          const hl = edgeHL?.get(key2(i, c));
          return (
            <line
              key={`${i}-${c}`}
              x1={X(i)}
              y1={Y(i) + 18}
              x2={X(c)}
              y2={Y(c) - 18}
              stroke={hl ?? undefined}
              strokeWidth={hl ? 3 : 1.5}
              className={hl ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
            />
          );
        })
      )}
      {live.map((i) => {
        const sub = nodeSub?.(i);
        return (
          <g key={i}>
            <circle cx={X(i)} cy={Y(i)} r={19} fill={nodeFill(i)} />
            <text x={X(i)} y={Y(i) + 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">
              {arr[i]}
            </text>
            {sub && (
              <text x={X(i)} y={Y(i) + 36} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
                {sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function TrieSVG({
  nodes,
  edges,
  current,
}: {
  nodes: { id: number; ch: string; end: boolean }[];
  edges: Array<[number, number]>;
  current: number;
}) {
  const { pos, W, H } = useMemo(() => {
    const kids = new Map<number, number[]>();
    for (const n of nodes) kids.set(n.id, []);
    for (const [p, c] of edges) kids.get(p)?.push(c);
    for (const arr of kids.values()) arr.sort((a, b) => (nodes[a]?.ch ?? "").localeCompare(nodes[b]?.ch ?? ""));
    const depth = new Map<number, number>([[0, 0]]);
    const order: number[] = [0];
    const q = [0];
    while (q.length > 0) {
      const u = q.shift()!;
      for (const c of kids.get(u) ?? []) {
        depth.set(c, (depth.get(u) ?? 0) + 1);
        order.push(c);
        q.push(c);
      }
    }
    const byDepth = new Map<number, number[]>();
    for (const id of order) {
      const d = depth.get(id) ?? 0;
      if (!byDepth.has(d)) byDepth.set(d, []);
      byDepth.get(d)!.push(id);
    }
    const pos = new Map<number, { x: number; y: number }>();
    let maxW = 0;
    for (const [d, arr] of byDepth) {
      maxW = Math.max(maxW, arr.length);
      arr.forEach((id, k) => pos.set(id, { x: 34 + k * 56, y: 34 + d * DY }));
    }
    let maxD = 0;
    for (const d of depth.values()) maxD = Math.max(maxD, d);
    const contentW = 68 + maxW * 56;
    const W = Math.max(140, contentW, 620);
    const shift = (W - contentW) / 2;
    for (const p of pos.values()) p.x += shift;
    return { pos, W, H: 112 + maxD * DY };
  }, [nodes, edges]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Trie">
      {edges.map(([p, c], i) => {
        const a = pos.get(p);
        const b = pos.get(c);
        if (!a || !b) return null;
        const hot = c === current;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y + 18}
            x2={b.x}
            y2={b.y - 18}
            stroke={hot ? "#f59e0b" : undefined}
            strokeWidth={hot ? 3 : 1.5}
            className={hot ? undefined : "stroke-zinc-300 dark:stroke-zinc-700"}
          />
        );
      })}
      {nodes.map((n) => {
        const p = pos.get(n.id);
        if (!p) return null;
        return (
          <g key={n.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={n.id === current ? 21 : 18}
              fill={n.id === current ? "#f59e0b" : n.end ? "#10b981" : "#38bdf8"}
            />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="monospace">
              {n.id === 0 ? "◇" : n.ch}
            </text>
            {n.end && (
              <text x={p.x} y={p.y + 34} textAnchor="middle" fontSize="10" className="fill-zinc-400 font-mono">
                word
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
