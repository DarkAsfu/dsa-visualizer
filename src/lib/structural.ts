import type { Lang } from "./dict";
import type { WGraph } from "./weighted";

export function labelS(g: WGraph, id: number): string {
  return g.nodes.find((n) => n.id === id)?.label ?? String(id);
}

function dagAdj(g: WGraph): Map<number, number[]> {
  const m = new Map<number, number[]>();
  for (const n of g.nodes) m.set(n.id, []);
  for (const e of g.edges) m.get(e.u)?.push(e.v);
  for (const arr of m.values()) arr.sort((a, b) => a - b);
  return m;
}

/** Layered DAG preset for topological sort. */
export const DAG: WGraph = {
  directed: true,
  nodes: [
    { id: 0, label: "A", x: 80, y: 200 },
    { id: 1, label: "B", x: 220, y: 110 },
    { id: 2, label: "C", x: 220, y: 290 },
    { id: 3, label: "D", x: 360, y: 110 },
    { id: 4, label: "E", x: 360, y: 290 },
    { id: 5, label: "F", x: 500, y: 200 },
  ],
  edges: [
    { u: 0, v: 1, w: 1 },
    { u: 0, v: 2, w: 1 },
    { u: 1, v: 3, w: 1 },
    { u: 2, v: 3, w: 1 },
    { u: 2, v: 4, w: 1 },
    { u: 3, v: 5, w: 1 },
    { u: 4, v: 5, w: 1 },
  ],
};

/** Directed triangle + tail for cycle detection. */
export const CYCLE_D: WGraph = {
  directed: true,
  nodes: [
    { id: 0, label: "A", x: 150, y: 200 },
    { id: 1, label: "B", x: 320, y: 110 },
    { id: 2, label: "C", x: 320, y: 290 },
    { id: 3, label: "D", x: 490, y: 200 },
  ],
  edges: [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 1 },
    { u: 2, v: 0, w: 1 },
    { u: 2, v: 3, w: 1 },
  ],
};

/** Two SCCs + loner for Kosaraju. */
export const KOSA: WGraph = {
  directed: true,
  nodes: [
    { id: 0, label: "A", x: 90, y: 200 },
    { id: 1, label: "B", x: 220, y: 200 },
    { id: 2, label: "C", x: 360, y: 200 },
    { id: 3, label: "D", x: 490, y: 200 },
    { id: 4, label: "E", x: 590, y: 300 },
  ],
  edges: [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 0, w: 1 },
    { u: 1, v: 2, w: 1 },
    { u: 2, v: 3, w: 1 },
    { u: 3, v: 2, w: 1 },
    { u: 3, v: 4, w: 1 },
  ],
};

/** Even cycle + leaf for bipartite check. */
export const BIPART: WGraph = {
  directed: false,
  nodes: [
    { id: 0, label: "A", x: 120, y: 200 },
    { id: 1, label: "B", x: 260, y: 110 },
    { id: 2, label: "C", x: 260, y: 290 },
    { id: 3, label: "D", x: 400, y: 200 },
    { id: 4, label: "E", x: 530, y: 200 },
  ],
  edges: [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 3, w: 1 },
    { u: 3, v: 2, w: 1 },
    { u: 2, v: 0, w: 1 },
    { u: 3, v: 4, w: 1 },
  ],
};

// ---------------- Topological sort (Kahn) ----------------
export type TStep = {
  indeg: number[];
  queue: number[];
  order: number[];
  current: number;
  desc: string;
  codeLine: number;
};

export function topoSort(g: WGraph, lang: Lang = "en"): { steps: TStep[]; order: number[] } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = dagAdj(g);
  const indeg = Array(n).fill(0);
  for (const e of g.edges) indeg[e.v]++;
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  const order: number[] = [];
  const steps: TStep[] = [
    {
      indeg: [...indeg],
      queue: [...queue],
      order: [],
      current: queue[0] ?? -1,
      desc: bn ? "indegree ০ দিয়ে শুরু" : "Start with indegree-0 nodes",
      codeLine: 0,
    },
  ];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    steps.push({
      indeg: [...indeg],
      queue: [...queue],
      order: [...order],
      current: u,
      desc: bn ? `${labelS(g, u)} ক্রমে নাও` : `Take ${labelS(g, u)} into the order`,
      codeLine: 1,
    });
    for (const v of adj.get(u) ?? []) {
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
    steps.push({
      indeg: [...indeg],
      queue: [...queue],
      order: [...order],
      current: u,
      desc: bn
        ? `${labelS(g, u)}-এর এজ মুছলো — indegree আপডেট`
        : `Erase ${labelS(g, u)}'s edges — indegrees updated`,
      codeLine: 2,
    });
  }
  steps.push({
    indeg: [...indeg],
    queue: [],
    order: [...order],
    current: -1,
    desc:
      order.length === n
        ? bn
          ? `শেষ — ক্রম: ${order.map((x) => labelS(g, x)).join(" → ")}`
          : `Done — order: ${order.map((x) => labelS(g, x)).join(" → ")}`
        : bn
          ? "চক্র আছে — topo সম্ভব নয়"
          : "Cycle exists — no topo order",
    codeLine: 3,
  });
  return { steps, order };
}

export const TOPO_CODE = [
  "queue ← indegree-0 nodes",
  "pop u → order",
  "  erase u's edges",
  "done (or cycle!)",
];

// ---------------- Directed cycle (DFS colors) ----------------
export type CStep = {
  color: number[];
  stack: number[];
  edge?: [number, number];
  kind?: "tree" | "back";
  cyclePath?: number[];
  verdict?: boolean;
  current: number;
  desc: string;
  codeLine: number;
};

export function dirCycle(g: WGraph, start: number, lang: Lang = "en"): { steps: CStep[]; hasCycle: boolean } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = dagAdj(g);
  const color = Array(n).fill(0);
  const stack: number[] = [];
  const steps: CStep[] = [
    {
      color: [...color],
      stack: [],
      current: start,
      desc: bn ? `${labelS(g, start)} থেকে DFS — ধূসর = স্ট্যাকে` : `DFS from ${labelS(g, start)} — gray = on stack`,
      codeLine: 0,
    },
  ];
  let hasCycle = false;
  let cyclePath: number[] | undefined;
  (function walk(u: number): boolean {
    color[u] = 1;
    stack.push(u);
    for (const v of adj.get(u) ?? []) {
      if (hasCycle) return true;
      if (color[v] === 0) {
        steps.push({
          color: [...color],
          stack: [...stack],
          edge: [u, v],
          kind: "tree",
          current: v,
          desc: bn
            ? `${labelS(g, u)} → ${labelS(g, v)} গাছের এজ — ভেতরে যাও`
            : `Tree edge ${labelS(g, u)} → ${labelS(g, v)} — go deep`,
          codeLine: 1,
        });
        if (walk(v)) return true;
      } else if (color[v] === 1) {
        hasCycle = true;
        const at = stack.indexOf(v);
        cyclePath = [...stack.slice(at), v];
        steps.push({
          color: [...color],
          stack: [...stack],
          edge: [u, v],
          kind: "back",
          cyclePath,
          verdict: true,
          current: v,
          desc: bn
            ? `ব্যাক এজ ${labelS(g, u)} → ${labelS(g, v)} — চক্র!`
            : `Back edge ${labelS(g, u)} → ${labelS(g, v)} — cycle!`,
          codeLine: 2,
        });
        return true;
      }
    }
    stack.pop();
    color[u] = 2;
    steps.push({
      color: [...color],
      stack: [...stack],
      current: u,
      desc: bn ? `${labelS(g, u)} শেষ (কালো)` : `${labelS(g, u)} done (black)`,
      codeLine: 3,
    });
    return false;
  })(start);
  if (!hasCycle) {
    steps.push({
      color: [...color],
      stack: [],
      verdict: false,
      current: start,
      desc: bn ? "ব্যাক এজ নেই — acyclic" : "No back edge — acyclic",
      codeLine: 3,
    });
  }
  return { steps, hasCycle };
}

export const CYCLE_CODE = [
  "dfs(v): gray, push stack",
  "  white neighbor → tree edge",
  "  gray neighbor → back edge = cycle!",
  "pop → black",
];

// ---------------- Kosaraju ----------------
export type KOStep = {
  phase: 1 | 2;
  order: number[];
  comp: (number | null)[];
  current: number;
  desc: string;
  codeLine: number;
};

export function kosaraju(g: WGraph, lang: Lang = "en"): { steps: KOStep[]; comps: number[][] } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = dagAdj(g);
  const radj = new Map<number, number[]>();
  for (const x of g.nodes) radj.set(x.id, []);
  for (const e of g.edges) radj.get(e.v)?.push(e.u);
  for (const arr of radj.values()) arr.sort((a, b) => a - b);
  const seen = new Set<number>();
  const order: number[] = [];
  const steps: KOStep[] = [
    {
      phase: 1,
      order: [],
      comp: Array(n).fill(null),
      current: -1,
      desc: bn ? "পাস ১: finish ক্রমে সাজাও" : "Pass 1: order by finish time",
      codeLine: 0,
    },
  ];
  (function walk1(u: number) {
    seen.add(u);
    for (const v of adj.get(u) ?? []) if (!seen.has(v)) walk1(v);
    order.push(u);
    steps.push({
      phase: 1,
      order: [...order],
      comp: Array(n).fill(null),
      current: u,
      desc: bn ? `${labelS(g, u)} শেষ — ক্রমে ঢোকাও` : `${labelS(g, u)} finished — record it`,
      codeLine: 1,
    });
  })(0);
  for (const x of g.nodes) {
    if (!seen.has(x.id)) {
      (function walkRest(u: number) {
        seen.add(u);
        for (const v of adj.get(u) ?? []) if (!seen.has(v)) walkRest(v);
        order.push(u);
        steps.push({
          phase: 1,
          order: [...order],
          comp: Array(n).fill(null),
          current: u,
          desc: bn ? `${labelS(g, u)} শেষ — ক্রমে ঢোকাও` : `${labelS(g, u)} finished — record it`,
          codeLine: 1,
        });
      })(x.id);
    }
  }
  const comp: (number | null)[] = Array(n).fill(null);
  const comps: number[][] = [];
  let cid = 0;
  for (let k = order.length - 1; k >= 0; k--) {
    const s = order[k];
    if (comp[s] !== null) continue;
    const cur: number[] = [];
    (function walk2(u: number) {
      comp[u] = cid;
      cur.push(u);
      for (const v of radj.get(u) ?? []) if (comp[v] === null) walk2(v);
    })(s);
    comps.push(cur);
    steps.push({
      phase: 2,
      order: [...order],
      comp: [...comp],
      current: s,
      desc: bn
        ? `উল্টো গ্রাফে ${labelS(g, s)} থেকে — কম্পোনেন্ট ${cid + 1}: ${cur.map((x) => labelS(g, x)).join(", ")}`
        : `On reversed graph from ${labelS(g, s)} — component ${cid + 1}: ${cur.map((x) => labelS(g, x)).join(", ")}`,
      codeLine: 2,
    });
    cid++;
  }
  steps.push({
    phase: 2,
    order: [...order],
    comp: [...comp],
    current: -1,
    desc: bn ? `শেষ — ${comps.length}টি SCC` : `Done — ${comps.length} SCCs`,
    codeLine: 3,
  });
  return { steps, comps };
}

export const KOSA_CODE = [
  "pass 1: DFS finish order",
  "  record when done",
  "pass 2: reversed graph, latest first",
  "each tree = one SCC",
];

// ---------------- Bipartite ----------------
export type BStep = {
  color: (0 | 1 | null)[];
  current: number;
  edge?: [number, number];
  conflict?: boolean;
  desc: string;
  codeLine: number;
};

export function bipartite(g: WGraph, lang: Lang = "en"): { steps: BStep[]; ok: boolean; color: (0 | 1 | null)[] } {
  const bn = lang === "bn";
  const n = g.nodes.length;
  const adj = new Map<number, number[]>();
  for (const x of g.nodes) adj.set(x.id, []);
  for (const e of g.edges) {
    adj.get(e.u)?.push(e.v);
    adj.get(e.v)?.push(e.u);
  }
  const color: (0 | 1 | null)[] = Array(n).fill(null);
  const steps: BStep[] = [
    {
      color: [...color],
      current: 0,
      desc: bn ? "A-কে রং ০ দাও, প্রতিবেশী উল্টো রং পাবে" : "Paint A color 0, neighbors get the opposite",
      codeLine: 0,
    },
  ];
  color[0] = 0;
  const queue = [0];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj.get(u) ?? []) {
      if (color[v] === null) {
        color[v] = color[u] === 0 ? 1 : 0;
        queue.push(v);
        steps.push({
          color: [...color],
          current: v,
          edge: [u, v],
          desc: bn
            ? `${labelS(g, v)} পেলো রং ${color[v]} (${labelS(g, u)}-এর উল্টো)`
            : `${labelS(g, v)} gets color ${color[v]} (opposite of ${labelS(g, u)})`,
          codeLine: 1,
        });
      } else if (color[v] === color[u]) {
        steps.push({
          color: [...color],
          current: v,
          edge: [u, v],
          conflict: true,
          desc: bn
            ? `${labelS(g, u)}–${labelS(g, v)} একই রং — bipartite নয়!`
            : `${labelS(g, u)}–${labelS(g, v)} share a color — not bipartite!`,
          codeLine: 2,
        });
        return { steps, ok: false, color: [...color] };
      }
    }
  }
  steps.push({
    color: [...color],
    current: -1,
    desc: bn ? "কোনো সংঘাত নেই — bipartite!" : "No conflicts — bipartite!",
    codeLine: 3,
  });
  return { steps, ok: true, color: [...color] };
}

export const BIPART_CODE = [
  "paint start color 0",
  "neighbor gets opposite color",
  "  same color edge → fail",
  "done — bipartite!",
];

// ---------------- Union-Find demo ----------------
export type UFStep = {
  parent: number[];
  rank: number[];
  focus?: number[];
  path?: number[];
  op: string;
  desc: string;
  codeLine: number;
};

const UF_OPS: Array<[string, number, number]> = [
  ["union", 0, 1],
  ["union", 2, 3],
  ["union", 1, 2],
  ["find", 0, -1],
  ["union", 4, 5],
  ["union", 3, 4],
];

export function unionFindDemo(lang: Lang = "en"): { steps: UFStep[] } {
  const bn = lang === "bn";
  const L = (i: number) => String.fromCharCode(65 + i);
  const parent = [0, 1, 2, 3, 4, 5];
  const rank = [0, 0, 0, 0, 0, 0];
  const steps: UFStep[] = [
    {
      parent: [...parent],
      rank: [...rank],
      op: "make-set",
      desc: bn ? "সবাই নিজের parent — ৬টা সেট" : "Everyone is their own parent — 6 sets",
      codeLine: 0,
    },
  ];
  function find(x: number): number {
    let r = x;
    while (parent[r] !== r) r = parent[r];
    return r;
  }
  for (const [op, a, b] of UF_OPS) {
    if (op === "find") {
      const path: number[] = [];
      let r = a;
      while (parent[r] !== r) {
        path.push(r);
        r = parent[r];
      }
      path.push(r);
      steps.push({
        parent: [...parent],
        rank: [...rank],
        focus: [a],
        path,
        op: `find(${L(a)})`,
        desc: bn
          ? `find(${L(a)}) পথ: ${path.map(L).join(" → ")}`
          : `find(${L(a)}) path: ${path.map(L).join(" → ")}`,
        codeLine: 3,
      });
      for (const x of path) parent[x] = r;
      steps.push({
        parent: [...parent],
        rank: [...rank],
        focus: [a],
        path,
        op: `find(${L(a)})`,
        desc: bn ? "পথ সংকুচিত — সবাই সরাসরি root-এ" : "Path compressed — all point at root",
        codeLine: 3,
      });
      continue;
    }
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) {
      steps.push({
        parent: [...parent],
        rank: [...rank],
        focus: [a, b],
        op: `union(${L(a)}, ${L(b)})`,
        desc: bn ? `একই সেট — কিছু নয়` : `Same set — nothing to do`,
        codeLine: 1,
      });
      continue;
    }
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
    steps.push({
      parent: [...parent],
      rank: [...rank],
      focus: [a, b],
      op: `union(${L(a)}, ${L(b)})`,
      desc: bn
        ? `union(${L(a)}, ${L(b)}) — ছোট গাছ বড়র নিচে`
        : `union(${L(a)}, ${L(b)}) — smaller tree under larger`,
      codeLine: 2,
    });
  }
  return { steps };
}

export const UF_CODE = [
  "everyone: parent = self",
  "union: find both roots",
  "  attach by rank",
  "find: compress the path",
];

// ---------------- Flood fill ----------------
export type FStep = {
  filled: number[];
  current: number;
  desc: string;
  codeLine: number;
};

export function floodFill(
  rows: number,
  cols: number,
  walls: Set<number>,
  start: number,
  lang: Lang = "en"
): { steps: FStep[]; count: number } {
  const bn = lang === "bn";
  const seen = new Set<number>([start]);
  const order = [start];
  const queue = [start];
  const steps: FStep[] = [
    {
      filled: [start],
      current: start,
      desc: bn ? "বালতি ঢালো — রং ছড়ায়" : "Pour the bucket — color spreads",
      codeLine: 0,
    },
  ];
  const at = (i: number): [number, number] => [Math.floor(i / cols), i % cols];
  while (queue.length > 0) {
    const u = queue.shift()!;
    const [r, c] = at(u);
    const nbs: number[] = [];
    if (r > 0) nbs.push(u - cols);
    if (r < rows - 1) nbs.push(u + cols);
    if (c > 0) nbs.push(u - 1);
    if (c < cols - 1) nbs.push(u + 1);
    for (const v of nbs) {
      if (walls.has(v) || seen.has(v)) continue;
      seen.add(v);
      order.push(v);
      queue.push(v);
      steps.push({
        filled: [...order],
        current: v,
        desc: bn ? `সেল ${v} রঙিন` : `Paint cell ${v}`,
        codeLine: 1,
      });
    }
  }
  steps.push({
    filled: [...order],
    current: start,
    desc: bn ? `শেষ — ${order.length} সেল ভরেছে` : `Done — ${order.length} cells filled`,
    codeLine: 2,
  });
  return { steps, count: order.length };
}

export const FLOOD_CODE = [
  "queue ← [start], fill it",
  "  spread to 4 neighbors",
  "walls block, seen skip",
];
