import type { Lang } from "./dict";

// Advanced traces: sparse table, convex hull, max flow.

// ---------------------------------------------------------------------------
// Sparse table — O(1) RMQ
// ---------------------------------------------------------------------------

export const SPARSE_CODE = [
  "st[0] = array",
  "st[k][i] = min halves",
  "k = floor(log2(len))",
  "two overlapping blocks",
  "answer = min(blocks)",
];

export type SparseStep = {
  st: (number | null)[][];
  cell?: [number, number];
  refs?: [number, number][];
  qBlocks?: [number, number][];
  desc: string;
  codeLine: number;
};

export type SparseResult = {
  steps: SparseStep[];
  answer: number;
  answerText: string;
};

export const SPARSE_ARR = [7, 2, 9, 4, 1, 8, 3, 6];
export const SPARSE_Q: [number, number] = [2, 6];

export function sparseTrace(arr: number[], ql: number, qr: number, lang: Lang = "en"): SparseResult {
  const bn = lang === "bn";
  const n = arr.length;
  const K = Math.floor(Math.log2(n)) + 1;
  const st: (number | null)[][] = Array.from({ length: K }, () => Array(n).fill(null));
  const steps: SparseStep[] = [];
  const snap = (cell: [number, number] | undefined, refs: [number, number][] | undefined, qBlocks: [number, number][] | undefined, desc: string, codeLine: number): SparseStep => ({
    st: st.map((r) => [...r]),
    cell,
    refs,
    qBlocks,
    desc,
    codeLine,
  });

  for (let i = 0; i < n; i++) {
    st[0][i] = arr[i];
    steps.push(snap([0, i], undefined, undefined, bn ? `st[0][${i}] = ${arr[i]}` : `st[0][${i}] = ${arr[i]}`, 0));
  }
  for (let k = 1; k < K; k++) {
    for (let i = 0; i + (1 << k) <= n; i++) {
      const a = st[k - 1][i] as number;
      const b = st[k - 1][i + (1 << (k - 1))] as number;
      st[k][i] = Math.min(a, b);
      steps.push(snap([k, i], [[k - 1, i], [k - 1, i + (1 << (k - 1))]], undefined, bn ? `st[${k}][${i}] = min(${a}, ${b}) = ${st[k][i]}` : `st[${k}][${i}] = min(${a}, ${b}) = ${st[k][i]}`, 1));
    }
  }
  const len = qr - ql + 1;
  const k = Math.floor(Math.log2(len));
  const b1 = st[k][ql] as number;
  const b2 = st[k][qr - (1 << k) + 1] as number;
  const ans = Math.min(b1, b2);
  steps.push(
    snap(undefined, undefined, [[k, ql], [k, qr - (1 << k) + 1]], bn ? `দৈর্ঘ্য ${len} → k=${k}: min(${b1}, ${b2}) = ${ans}` : `len ${len} → k=${k}: min(${b1}, ${b2}) = ${ans}`, 4)
  );
  return { steps, answer: ans, answerText: String(ans) };
}

// ---------------------------------------------------------------------------
// Convex hull — Graham scan
// ---------------------------------------------------------------------------

export const HULL_CODE = [
  "pivot = lowest, then sort",
  "by polar angle around pivot",
  "left turn? push",
  "right turn? pop, retry",
  "stack = hull",
];

export type HullStep = {
  stack: number[];
  cur: number;
  popped: number[];
  desc: string;
  codeLine: number;
};

export type HullResult = {
  steps: HullStep[];
  order: number[];
  hull: number[];
  answer: string;
};

export const HULL_PRESETS: { x: number; y: number }[][] = [
  [
    { x: 1, y: 4 }, { x: 3, y: 1 }, { x: 5, y: 5 }, { x: 7, y: 2 },
    { x: 8, y: 7 }, { x: 4, y: 8 }, { x: 2, y: 7 }, { x: 6, y: 4 }, { x: 9, y: 5 },
  ],
  [
    { x: 0, y: 3 }, { x: 2, y: 2 }, { x: 4, y: 4 }, { x: 5, y: 0 },
    { x: 7, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 5 }, { x: 1, y: 1 },
  ],
];

export function randomHullPoints(n = 9, max = 10): { x: number; y: number }[] {
  const seen = new Set<string>();
  const out: { x: number; y: number }[] = [];
  while (out.length < n) {
    const x = Math.floor(Math.random() * (max + 1));
    const y = Math.floor(Math.random() * (max + 1));
    const k = `${x},${y}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ x, y });
  }
  return out;
}

const cross = (o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number =>
  (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

export function hullTrace(pts: { x: number; y: number }[], lang: Lang = "en"): HullResult {
  const bn = lang === "bn";
  const n = pts.length;
  let pivot = 0;
  for (let i = 1; i < n; i++) {
    if (pts[i].y < pts[pivot].y || (pts[i].y === pts[pivot].y && pts[i].x < pts[pivot].x)) pivot = i;
  }
  const order = pts
    .map((_, i) => i)
    .filter((i) => i !== pivot)
    .sort((a, b) => {
      const c = cross(pts[pivot], pts[a], pts[b]);
      if (c !== 0) return -c;
      const da = (pts[a].x - pts[pivot].x) ** 2 + (pts[a].y - pts[pivot].y) ** 2;
      const db = (pts[b].x - pts[pivot].x) ** 2 + (pts[b].y - pts[pivot].y) ** 2;
      return da - db;
    });
  const steps: HullStep[] = [];
  const stack: number[] = [pivot];
  const snap = (cur: number, popped: number[], desc: string, codeLine: number): HullStep => ({
    stack: [...stack],
    cur,
    popped: [...popped],
    desc,
    codeLine,
  });

  steps.push(snap(pivot, [], bn ? `pivot P${pivot + 1} (${pts[pivot].x},${pts[pivot].y}) — কোণে সাজাও` : `pivot P${pivot + 1} (${pts[pivot].x},${pts[pivot].y}) — sort by angle`, 0));
  for (const idx of order) {
    while (stack.length >= 2) {
      const top = stack[stack.length - 1];
      const nxt = stack[stack.length - 2];
      const c = cross(pts[nxt], pts[top], pts[idx]);
      if (c > 0) break;
      stack.pop();
      steps.push(snap(idx, [top], bn ? `ডান-ঘোরা (cross ${c}) — P${top + 1} pop` : `right turn (cross ${c}) — pop P${top + 1}`, 3));
    }
    stack.push(idx);
    steps.push(snap(idx, [], bn ? `বাম-ঘোরা — P${idx + 1} push` : `left turn — push P${idx + 1}`, 2));
  }
  steps.push(snap(-1, [], bn ? `শেষ — hull: ${stack.map((i) => `P${i + 1}`).join(" → ")}` : `done — hull: ${stack.map((i) => `P${i + 1}`).join(" → ")}`, 4));
  return { steps, order: [pivot, ...order], hull: [...stack], answer: `${stack.length} points` };
}

// ---------------------------------------------------------------------------
// Ford-Fulkerson (Edmonds-Karp BFS)
// ---------------------------------------------------------------------------

export const FLOW_CODE = [
  "residual = capacities",
  "BFS shortest s→t path",
  "neck = min residual",
  "push neck along path",
  "no path? flow is max",
];

export type FlowEdge = { u: number; v: number; c: number };
export type FlowPreset = { name: string; labels: string[]; pos: [number, number][]; edges: FlowEdge[]; s: number; t: number };

export type FlowStep = {
  flow: number[];
  path: number[] | null;
  neck: number;
  maxFlow: number;
  cut: boolean[];
  desc: string;
  codeLine: number;
};

export type FlowResult = {
  steps: FlowStep[];
  maxFlow: number;
  cutS: number[];
  answer: string;
};

export const FLOW_PRESETS: FlowPreset[] = [
  {
    name: "CLRS",
    labels: ["s", "1", "2", "3", "4", "t"],
    pos: [[60, 200], [180, 80], [180, 320], [330, 80], [330, 320], [450, 200]],
    edges: [
      { u: 0, v: 1, c: 16 }, { u: 0, v: 2, c: 13 }, { u: 1, v: 2, c: 10 },
      { u: 1, v: 3, c: 12 }, { u: 2, v: 1, c: 4 }, { u: 2, v: 4, c: 14 },
      { u: 3, v: 2, c: 9 }, { u: 3, v: 5, c: 20 }, { u: 4, v: 3, c: 7 }, { u: 4, v: 5, c: 4 },
    ],
    s: 0,
    t: 5,
  },
  {
    name: "Small",
    labels: ["s", "a", "b", "t"],
    pos: [[60, 200], [220, 100], [220, 300], [380, 200]],
    edges: [
      { u: 0, v: 1, c: 10 }, { u: 0, v: 2, c: 10 }, { u: 1, v: 2, c: 2 },
      { u: 1, v: 3, c: 8 }, { u: 2, v: 3, c: 9 },
    ],
    s: 0,
    t: 3,
  },
];

const ekey = (u: number, v: number) => `${u}->${v}`;

export function flowTrace(p: FlowPreset, lang: Lang = "en"): FlowResult {
  const bn = lang === "bn";
  const res = new Map<string, number>();
  for (const e of p.edges) {
    res.set(ekey(e.u, e.v), (res.get(ekey(e.u, e.v)) ?? 0) + e.c);
    if (!res.has(ekey(e.v, e.u))) res.set(ekey(e.v, e.u), 0);
  }
  const flowArr = Array(p.edges.length).fill(0);
  const steps: FlowStep[] = [];
  let maxFlow = 0;
  const L = (i: number) => p.labels[i];
  const snap = (path: number[] | null, neck: number, cut: boolean[], desc: string, codeLine: number): FlowStep => ({
    flow: [...flowArr],
    path: path ? [...path] : null,
    neck,
    maxFlow,
    cut: [...cut],
    desc,
    codeLine,
  });
  const none = p.labels.map(() => false);

  steps.push(snap(null, 0, none, bn ? `${L(p.s)} থেকে ${L(p.t)} — residual = ধারণক্ষমতা` : `${L(p.s)} to ${L(p.t)} — residual = capacities`, 0));
  for (let round = 0; round < 40; round++) {
    // BFS
    const prev = new Map<number, number>();
    const q = [p.s];
    prev.set(p.s, -1);
    while (q.length > 0) {
      const u = q.shift()!;
      for (let v = 0; v < p.labels.length; v++) {
        if (prev.has(v)) continue;
        if ((res.get(ekey(u, v)) ?? 0) > 0) {
          prev.set(v, u);
          q.push(v);
        }
      }
    }
    if (!prev.has(p.t)) break;
    const path: number[] = [];
    for (let v = p.t; v !== -1; v = prev.get(v)!) path.push(v);
    path.reverse();
    let neck = Infinity;
    for (let k = 0; k + 1 < path.length; k++) neck = Math.min(neck, res.get(ekey(path[k], path[k + 1])) ?? 0);
    steps.push(snap(path, neck, none, bn ? `পথ ${path.map(L).join("→")} — neck ${neck}` : `path ${path.map(L).join("→")} — neck ${neck}`, 2));
    for (let k = 0; k + 1 < path.length; k++) {
      const u = path[k];
      const v = path[k + 1];
      res.set(ekey(u, v), (res.get(ekey(u, v)) ?? 0) - neck);
      res.set(ekey(v, u), (res.get(ekey(v, u)) ?? 0) + neck);
      p.edges.forEach((e, i) => {
        if (e.u === u && e.v === v) flowArr[i] += neck;
        if (e.u === v && e.v === u) flowArr[i] -= neck;
      });
    }
    maxFlow += neck;
    steps.push(snap(path, neck, none, bn ? `+${neck} ঠেলো — মোট ${maxFlow}` : `push +${neck} — total ${maxFlow}`, 3));
  }
  // min cut: reachable from s in residual
  const seen = new Set<number>([p.s]);
  const q = [p.s];
  while (q.length > 0) {
    const u = q.shift()!;
    for (let v = 0; v < p.labels.length; v++) {
      if (!seen.has(v) && (res.get(ekey(u, v)) ?? 0) > 0) {
        seen.add(v);
        q.push(v);
      }
    }
  }
  const cut = p.labels.map((_, i) => seen.has(i));
  const cutS = p.labels.filter((_, i) => seen.has(i));
  steps.push(snap(null, 0, cut, bn ? `শেষ — max flow ${maxFlow}, cut {${cutS.join(", ")}}` : `done — max flow ${maxFlow}, cut {${cutS.join(", ")}}`, 4));
  return { steps, maxFlow, cutS: cutS.map((l) => p.labels.indexOf(l)), answer: String(maxFlow) };
}
