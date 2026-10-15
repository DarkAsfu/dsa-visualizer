import type { Lang } from "./dict";

export type WNode = { id: number; label: string; x: number; y: number };
export type WEdge = { u: number; v: number; w: number };
export type WGraph = { nodes: WNode[]; edges: WEdge[]; directed: boolean };

export const key2 = (u: number, v: number) => `${Math.min(u, v)}-${Math.max(u, v)}`;

function N(id: number, label: string, x: number, y: number): WNode {
  return { id, label, x, y };
}

/** Undirected weighted sample (Dijkstra / Prim / Kruskal / A*). */
export const W_SAMPLE: WGraph = {
  directed: false,
  nodes: [
    N(0, "A", 80, 200),
    N(1, "B", 210, 100),
    N(2, "C", 210, 300),
    N(3, "D", 350, 100),
    N(4, "E", 350, 300),
    N(5, "F", 490, 200),
  ],
  edges: [
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 3, w: 8 },
    { u: 2, v: 4, w: 10 },
    { u: 3, v: 4, w: 2 },
    { u: 3, v: 5, w: 6 },
    { u: 4, v: 5, w: 3 },
  ],
};

/** Directed weighted with one negative edge, no negative cycle. */
export const W_BF: WGraph = {
  directed: true,
  nodes: [
    N(0, "A", 80, 200),
    N(1, "B", 220, 110),
    N(2, "C", 220, 290),
    N(3, "D", 370, 200),
    N(4, "E", 510, 200),
  ],
  edges: [
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 2, w: -3 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 3, w: 4 },
    { u: 3, v: 4, w: 1 },
    { u: 2, v: 4, w: 7 },
  ],
};

/** Directed for Floyd-Warshall (4 nodes). */
export const W_FLOYD: WGraph = {
  directed: true,
  nodes: [
    N(0, "A", 120, 120),
    N(1, "B", 380, 120),
    N(2, "C", 120, 300),
    N(3, "D", 380, 300),
  ],
  edges: [
    { u: 0, v: 1, w: 3 },
    { u: 0, v: 2, w: 8 },
    { u: 0, v: 3, w: 10 },
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 7 },
    { u: 2, v: 3, w: 2 },
  ],
};

/** Heuristic to F for A*. */
export const H_TO_F: Record<number, number> = { 0: 9, 1: 7, 2: 8, 3: 4, 4: 3, 5: 0 };

export function adjW(g: WGraph): Map<number, Array<{ to: number; w: number }>> {
  const m = new Map<number, Array<{ to: number; w: number }>>();
  for (const n of g.nodes) m.set(n.id, []);
  for (const e of g.edges) {
    m.get(e.u)?.push({ to: e.v, w: e.w });
    if (!g.directed) m.get(e.v)?.push({ to: e.u, w: e.w });
  }
  for (const arr of m.values()) arr.sort((a, b) => a.to - b.to);
  return m;
}

export function labelW(g: WGraph, id: number): string {
  return g.nodes.find((n) => n.id === id)?.label ?? String(id);
}

export function fmtD(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

// ---------------- Dijkstra ----------------
export type DStep = {
  dist: number[];
  visited: number[];
  current: number;
  edge?: [number, number];
  updated?: number;
  desc: string;
  codeLine: number;
};

export function dijkstra(g: WGraph, start: number, lang: Lang = "en"): { steps: DStep[]; dist: number[]; paths: number[][] } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = adjW(g);
  const dist = Array(n).fill(Infinity);
  const prev = Array<number>(n).fill(-1);
  const done: boolean[] = Array(n).fill(false);
  dist[start] = 0;
  const steps: DStep[] = [
    {
      dist: [...dist],
      visited: [],
      current: start,
      desc: bn ? `dist[${labelW(g, start)}] = 0, বাকি ∞` : `dist[${labelW(g, start)}] = 0, rest ∞`,
      codeLine: 0,
    },
  ];
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!done[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u === -1 || best === Infinity) break;
    const cands = g.nodes
      .filter((nd) => !done[nd.id])
      .map((nd) => `${nd.label}=${fmtD(dist[nd.id])}`)
      .join(", ");
    done[u] = true;
    steps.push({
      dist: [...dist],
      visited: done.map((d, i) => (d ? i : -1)).filter((i) => i >= 0),
      current: u,
      desc: bn
        ? `unvisited: ${cands} → সবচেয়ে ছোট ${labelW(g, u)} (${fmtD(best)}) চূড়ান্ত ✓`
        : `unvisited: ${cands} → pick smallest ${labelW(g, u)} (${fmtD(best)}), mark final ✓`,
      codeLine: 1,
    });
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (done[v]) continue;
      const oldV = dist[v];
      if (dist[u] + w < oldV) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        steps.push({
          dist: [...dist],
          visited: done.map((d, i) => (d ? i : -1)).filter((i) => i >= 0),
          current: v,
          edge: [u, v],
          updated: v,
          desc: bn
            ? `${labelW(g, u)}→${labelW(g, v)}: ${fmtD(dist[u])}+${w}=${dist[v]} < পুরনো ${fmtD(oldV)} → ${labelW(g, v)}=${dist[v]}`
            : `${labelW(g, u)}→${labelW(g, v)}: ${fmtD(dist[u])}+${w}=${dist[v]} < old ${fmtD(oldV)} → ${labelW(g, v)}=${dist[v]}`,
          codeLine: 2,
        });
      }
    }
  }
  const paths: number[][] = g.nodes.map((nd) => {
    if (!Number.isFinite(dist[nd.id])) return [];
    const p: number[] = [];
    let c = nd.id;
    while (c !== -1) {
      p.unshift(c);
      c = prev[c];
    }
    return p;
  });
  const summary = g.nodes.map((nd) => `${nd.label}=${fmtD(dist[nd.id])}`).join(", ");
  steps.push({
    dist: [...dist],
    visited: done.map((d, i) => (d ? i : -1)).filter((i) => i >= 0),
    current: start,
    desc: bn ? `শেষ ✓ — ${summary}` : `Done ✓ — ${summary}`,
    codeLine: 3,
  });
  return { steps, dist, paths };
}

export const DIJKSTRA_CODE = [
  "dist[start] = 0, rest ∞",
  "pick smallest unvisited u",
  "  relax all edges u→v",
  "done",
];

// ---------------- Bellman-Ford ----------------
export type BFStep = {
  dist: number[];
  pass: number;
  edge?: [number, number];
  w?: number;
  updated: boolean;
  desc: string;
  codeLine: number;
};

export function bellmanFord(
  g: WGraph,
  start: number,
  lang: Lang = "en"
): { steps: BFStep[]; dist: number[]; negCycle: boolean } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const dist = Array(n).fill(Infinity);
  dist[start] = 0;
  const steps: BFStep[] = [
    {
      dist: [...dist],
      pass: 0,
      updated: false,
      desc: bn ? `dist[${labelW(g, start)}] = 0 — ${n - 1} পাস চালাও` : `dist[${labelW(g, start)}] = 0 — run ${n - 1} passes`,
      codeLine: 0,
    },
  ];
  for (let p = 1; p <= n - 1; p++) {
    let changed = false;
    for (const e of g.edges) {
      if (dist[e.u] + e.w < dist[e.v]) {
        dist[e.v] = dist[e.u] + e.w;
        changed = true;
        steps.push({
          dist: [...dist],
          pass: p,
          edge: [e.u, e.v],
          w: e.w,
          updated: true,
          desc: bn
            ? `পাস ${p}: ${labelW(g, e.u)}→${labelW(g, e.v)} (${e.w}) শিথিল → ${fmtD(dist[e.v])}`
            : `Pass ${p}: relax ${labelW(g, e.u)}→${labelW(g, e.v)} (${e.w}) → ${fmtD(dist[e.v])}`,
          codeLine: 1,
        });
      }
    }
    if (!changed) {
      steps.push({
        dist: [...dist],
        pass: p,
        updated: false,
        desc: bn ? `পাস ${p}: কোনো বদল নেই — আগেই থামো` : `Pass ${p}: nothing changed — early stop`,
        codeLine: 2,
      });
      break;
    }
  }
  let negCycle = false;
  for (const e of g.edges) {
    if (dist[e.u] + e.w < dist[e.v]) {
      negCycle = true;
      steps.push({
        dist: [...dist],
        pass: n,
        edge: [e.u, e.v],
        w: e.w,
        updated: true,
        desc: bn
          ? `এখনো শিথিল হয় ${labelW(g, e.u)}→${labelW(g, e.v)} — ঋণাত্মক চক্র!`
          : `Still relaxable ${labelW(g, e.u)}→${labelW(g, e.v)} — negative cycle!`,
        codeLine: 3,
      });
      break;
    }
  }
  if (!negCycle) {
    steps.push({
      dist: [...dist],
      pass: n,
      updated: false,
      desc: bn ? "কোনো ঋণাত্মক চক্র নেই — দূরত্ব চূড়ান্ত" : "No negative cycle — distances final",
      codeLine: 3,
    });
  }
  return { steps, dist, negCycle };
}

export const BF_CODE = [
  "dist[start] = 0",
  "repeat V−1: relax every edge",
  "  early stop if calm",
  "one more pass → negative cycle?",
];

// ---------------- Floyd-Warshall ----------------
export type FWStep = {
  mat: number[][];
  k: number;
  cell?: [number, number];
  improved: boolean;
  desc: string;
  codeLine: number;
};

export function floydWarshall(g: WGraph, lang: Lang = "en"): {
  steps: FWStep[];
  mat: number[][];
  route: (s: number, t: number) => number[];
} {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const mat: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity))
  );
  const next: number[][] = Array.from({ length: n }, () => Array(n).fill(-1));
  for (const e of g.edges) {
    if (e.w < mat[e.u][e.v]) {
      mat[e.u][e.v] = e.w;
      next[e.u][e.v] = e.v;
    }
  }
  const steps: FWStep[] = [
    {
      mat: mat.map((r) => [...r]),
      k: -1,
      improved: false,
      desc: bn ? "সরাসরি এজ দিয়ে শুরু" : "Start from direct edges",
      codeLine: 0,
    },
  ];
  for (let k = 0; k < n; k++) {
    steps.push({
      mat: mat.map((r) => [...r]),
      k,
      improved: false,
      desc: bn
        ? `${labelW(g, k)} হয়ে যাওয়ার অনুমতি`
        : `Allow going via ${labelW(g, k)}`,
      codeLine: 1,
    });
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (mat[i][k] + mat[k][j] < mat[i][j]) {
          mat[i][j] = mat[i][k] + mat[k][j];
          next[i][j] = next[i][k];
          steps.push({
            mat: mat.map((r) => [...r]),
            k,
            cell: [i, j],
            improved: true,
            desc: bn
              ? `[${labelW(g, i)}][${labelW(g, j)}] = ${fmtD(mat[i][k])} + ${fmtD(mat[k][j])} = ${fmtD(mat[i][j])}`
              : `[${labelW(g, i)}][${labelW(g, j)}] = ${fmtD(mat[i][k])} + ${fmtD(mat[k][j])} = ${fmtD(mat[i][j])}`,
            codeLine: 2,
          });
        }
      }
    }
  }
  steps.push({
    mat: mat.map((r) => [...r]),
    k: n,
    improved: false,
    desc: bn ? "শেষ — সব জোড়া ক্ষুদ্রতম" : "Done — all pairs shortest",
    codeLine: 3,
  });
  const route = (s: number, t: number): number[] => {
    if (next[s][t] === -1) return [];
    const p = [s];
    let c = s;
    let guard = 0;
    while (c !== t && guard++ < n + 2) {
      c = next[c][t];
      if (c === -1) return [];
      p.push(c);
    }
    return c === t ? p : [];
  };
  return { steps, mat, route };
}

export const FW_CODE = [
  "dist = direct edges (∞ else)",
  "for k: allow via k",
  "  dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])",
  "done",
];

// ---------------- Prim ----------------
export type PStep = {
  inTree: boolean[];
  key: (number | null)[];
  edge?: [number, number];
  mst: Array<[number, number]>;
  total: number;
  current: number;
  desc: string;
  codeLine: number;
};

export function prim(g: WGraph, start: number, lang: Lang = "en"): { steps: PStep[]; total: number; mst: Array<[number, number]> } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = adjW(g);
  const inTree = Array(n).fill(false);
  const key: (number | null)[] = Array(n).fill(null);
  const parentEdge: Array<[number, number] | null> = Array(n).fill(null);
  key[start] = 0;
  const mst: Array<[number, number]> = [];
  let total = 0;
  const steps: PStep[] = [
    {
      inTree: [...inTree],
      key: [...key],
      mst: [],
      total: 0,
      current: start,
      desc: bn ? `${labelW(g, start)} থেকে বাড়াও` : `Grow from ${labelW(g, start)}`,
      codeLine: 0,
    },
  ];
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    let best: number | null = null;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && key[i] !== null && (best === null || (key[i] as number) < best)) {
        best = key[i];
        u = i;
      }
    }
    if (u === -1) break;
    inTree[u] = true;
    if (parentEdge[u]) {
      mst.push(parentEdge[u]!);
      total += key[u] as number;
    }
    steps.push({
      inTree: [...inTree],
      key: [...key],
      mst: mst.map((e) => [...e] as [number, number]),
      total,
      current: u,
      edge: parentEdge[u] ?? undefined,
      desc: bn
        ? parentEdge[u]
          ? `${labelW(g, u)} গাছে ঢুকলো (খরচ ${key[u]})`
          : `${labelW(g, u)} শুরু`
        : parentEdge[u]
          ? `${labelW(g, u)} joins the tree (cost ${key[u]})`
          : `${labelW(g, u)} is the root`,
      codeLine: 1,
    });
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (!inTree[v] && (key[v] === null || w < (key[v] as number))) {
        const first = key[v] === null;
        key[v] = w;
        parentEdge[v] = [u, v];
        if (!first) {
          steps.push({
            inTree: [...inTree],
            key: [...key],
            mst: mst.map((e) => [...e] as [number, number]),
            total,
            current: v,
            edge: [u, v],
            desc: bn
              ? `${labelW(g, v)}-এর সস্তা পথ: ${w} (${labelW(g, u)} হয়ে)`
              : `Cheaper link to ${labelW(g, v)}: ${w} (via ${labelW(g, u)})`,
            codeLine: 2,
          });
        }
      }
    }
  }
  steps.push({
    inTree: [...inTree],
    key: [...key],
    mst: mst.map((e) => [...e] as [number, number]),
    total,
    current: start,
    desc: bn ? `শেষ — মোট খরচ ${total}` : `Done — total cost ${total}`,
    codeLine: 3,
  });
  return { steps, total, mst: mst.map((e) => [...e] as [number, number]) };
}

export const PRIM_CODE = [
  "key[start] = 0, rest ∞",
  "take cheapest outside node",
  "  relax its links",
  "done — MST grown",
];

// ---------------- Kruskal ----------------
export type KStep = {
  parent: number[];
  rank: number[];
  edge: [number, number];
  w: number;
  take: boolean;
  mst: Array<[number, number]>;
  total: number;
  desc: string;
  codeLine: number;
};

function findK(parent: number[], x: number): number {
  let r = x;
  while (parent[r] !== r) r = parent[r];
  return r;
}

export function kruskal(g: WGraph, lang: Lang = "en"): { steps: KStep[]; total: number; mst: Array<[number, number]>; sorted: Array<{ u: number; v: number; w: number }> } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);
  const edges = [...g.edges].sort((a, b) => a.w - b.w);
  const mst: Array<[number, number]> = [];
  let total = 0;
  const steps: KStep[] = [
    {
      parent: [...parent],
      rank: [...rank],
      edge: [-1, -1],
      w: 0,
      take: false,
      mst: [],
      total: 0,
      desc: bn ? "এজগুলো ওজন ধরে সাজাও, একটা একটা করে দেখো" : "Sort edges by weight, consider each",
      codeLine: 0,
    },
  ];
  for (const e of edges) {
    const ru = findK(parent, e.u);
    const rv = findK(parent, e.v);
    if (ru !== rv) {
      if (rank[ru] < rank[rv]) parent[ru] = rv;
      else if (rank[ru] > rank[rv]) parent[rv] = ru;
      else {
        parent[rv] = ru;
        rank[ru]++;
      }
      mst.push([e.u, e.v]);
      total += e.w;
      steps.push({
        parent: [...parent],
        rank: [...rank],
        edge: [e.u, e.v],
        w: e.w,
        take: true,
        mst: mst.map((x) => [...x] as [number, number]),
        total,
        desc: bn
          ? `${labelW(g, e.u)}–${labelW(g, e.v)} (${e.w}) নাও — আলাদা সেট`
          : `Take ${labelW(g, e.u)}–${labelW(g, e.v)} (${e.w}) — different sets`,
        codeLine: 1,
      });
      if (mst.length === n - 1) break;
    } else {
      steps.push({
        parent: [...parent],
        rank: [...rank],
        edge: [e.u, e.v],
        w: e.w,
        take: false,
        mst: mst.map((x) => [...x] as [number, number]),
        total,
        desc: bn
          ? `${labelW(g, e.u)}–${labelW(g, e.v)} (${e.w}) বাদ — চক্র হবে`
          : `Skip ${labelW(g, e.u)}–${labelW(g, e.v)} (${e.w}) — would cycle`,
        codeLine: 2,
      });
    }
  }
  steps.push({
    parent: [...parent],
    rank: [...rank],
    edge: [-1, -1],
    w: 0,
    take: false,
    mst: mst.map((x) => [...x] as [number, number]),
    total,
    desc: bn ? `শেষ — মোট খরচ ${total}` : `Done — total cost ${total}`,
    codeLine: 3,
  });
  return { steps, total, mst: mst.map((x) => [...x] as [number, number]), sorted: edges.map((e) => ({ u: e.u, v: e.v, w: e.w })) };
}

export const KRUSKAL_CODE = [
  "sort edges by weight",
  "take it if ends differ",
  "  skip it if same set (cycle)",
  "done — MST complete",
];

// ---------------- A* ----------------
export type AStep = {
  g: (number | null)[];
  open: Array<{ id: number; f: number }>;
  closed: boolean[];
  current: number;
  updated?: number;
  path?: number[] | null;
  desc: string;
  codeLine: number;
};

export function astar(
  g: WGraph,
  start: number,
  goal: number,
  h: Record<number, number>,
  lang: Lang = "en"
): { steps: AStep[]; path: number[] | null; cost: number } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = adjW(g);
  const gs: (number | null)[] = Array(n).fill(null);
  const parent: Record<number, number> = {};
  gs[start] = 0;
  const open: Array<{ id: number; f: number }> = [{ id: start, f: h[start] ?? 0 }];
  const closed = Array(n).fill(false);
  const steps: AStep[] = [
    {
      g: [...gs],
      open: open.map((o) => ({ ...o })),
      closed: [...closed],
      current: start,
      desc: bn
        ? `${labelW(g, start)} থেকে শুরু, f = g + h`
        : `Start at ${labelW(g, start)}, f = g + h`,
      codeLine: 0,
    },
  ];
  let found: number[] | null = null;
  while (open.length > 0) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].f < open[bi].f) bi = i;
    }
    const { id: u } = open.splice(bi, 1)[0];
    if (closed[u]) continue;
    closed[u] = true;
    steps.push({
      g: [...gs],
      open: open.map((o) => ({ ...o })),
      closed: [...closed],
      current: u,
      desc: bn
        ? `সবচেয়ে ছোট f বের করো: ${labelW(g, u)}`
        : `Expand smallest f: ${labelW(g, u)}`,
      codeLine: 1,
    });
    if (u === goal) {
      const path = [u];
      let c = u;
      while (c !== start) {
        c = parent[c];
        path.unshift(c);
      }
      found = path;
      steps.push({
        g: [...gs],
        open: open.map((o) => ({ ...o })),
        closed: [...closed],
        current: u,
        path,
        desc: bn
          ? `লক্ষ্য! পথ: ${path.map((x) => labelW(g, x)).join(" → ")}`
          : `Goal! Path: ${path.map((x) => labelW(g, x)).join(" → ")}`,
        codeLine: 3,
      });
      break;
    }
    for (const { to: v, w } of adj.get(u) ?? []) {
      if (closed[v]) continue;
      const ng = (gs[u] ?? Infinity) + w;
      if (gs[v] === null || ng < gs[v]) {
        gs[v] = ng;
        parent[v] = u;
        open.push({ id: v, f: ng + (h[v] ?? 0) });
        steps.push({
          g: [...gs],
          open: open.map((o) => ({ ...o })),
          closed: [...closed],
          current: v,
          updated: v,
          desc: bn
            ? `${labelW(g, v)}: g=${ng}, f=${ng + (h[v] ?? 0)}`
            : `${labelW(g, v)}: g=${ng}, f=${ng + (h[v] ?? 0)}`,
          codeLine: 2,
        });
      }
    }
  }
  if (!found) {
    steps.push({
      g: [...gs],
      open: [],
      closed: [...closed],
      current: start,
      desc: bn ? "পথ নেই" : "No path",
      codeLine: 3,
    });
  }
  return { steps, path: found, cost: found ? (gs[goal] as number) : -1 };
}

export const ASTAR_CODE = [
  "open ← {start}, f = g + h",
  "expand smallest-f node",
  "  relax neighbors, f = g + h",
  "goal → trace path",
];
