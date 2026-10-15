import type { Lang } from "../dict";

export type GraphAlgo = "bfs" | "dfs";

export type GNode = { id: number; label: string; x: number; y: number };
export type GGraph = { name: string; nodes: GNode[]; edges: Array<[number, number]> };

export type GStep = {
  visited: number[];
  container: number[];
  current: number;
  order: string[];
  done: boolean;
  desc: string;
  codeLine: number;
};

export type GResult = {
  steps: GStep[];
  order: string[];
  visitedCount: number;
  parent: Record<number, number>;
  start: number;
};

function adjList(g: GGraph): Map<number, number[]> {
  const m = new Map<number, number[]>();
  for (const n of g.nodes) m.set(n.id, []);
  for (const [u, v] of g.edges) {
    m.get(u)?.push(v);
    m.get(v)?.push(u);
  }
  for (const arr of m.values()) arr.sort((a, b) => a - b);
  return m;
}

function labelOf(g: GGraph, id: number): string {
  return g.nodes.find((n) => n.id === id)?.label ?? String(id);
}

function snap(
  g: GGraph,
  visitedIds: number[],
  container: number[],
  current: number,
  extra: Partial<GStep> = {}
): GStep {
  return {
    visited: [...visitedIds],
    container: [...container],
    current,
    order: visitedIds.map((id) => labelOf(g, id)),
    done: false,
    desc: "",
    codeLine: 0,
    ...extra,
  };
}

function trace(
  algo: GraphAlgo,
  g: GGraph,
  startId: number,
  lang: Lang
): GResult {
  const bn = lang === "bn";
  const adj = adjList(g);
  const startLabel = labelOf(g, startId);
  const seen: number[] = [startId];
  const container: number[] = [startId];
  const parent: Record<number, number> = {};
  const steps: GStep[] = [
    snap(g, seen, container, startId, {
      desc: bn
        ? `${startLabel} দিয়ে শুরু — ${algo === "bfs" ? "queue" : "stack"}-তে ঢোকাও`
        : `Start at ${startLabel} — push to ${algo === "bfs" ? "queue" : "stack"}`,
      codeLine: 0,
    }),
  ];

  while (container.length > 0) {
    const u = algo === "bfs" ? container.shift()! : container.pop()!;
    const neighbors = (adj.get(u) ?? []).filter((v) => !seen.includes(v));
    if (neighbors.length === 0) {
      steps.push(
        snap(g, seen, container, u, {
          desc: bn
            ? `${labelOf(g, u)}-এর নতুন প্রতিবেশী নেই — এগিয়ে যাও`
            : `${labelOf(g, u)} has no new neighbors — move on`,
          codeLine: 1,
        })
      );
      continue;
    }
    const ordered = algo === "bfs" ? neighbors : [...neighbors].reverse();
    for (const v of ordered) {
      if (seen.includes(v)) continue;
      seen.push(v);
      parent[v] = u;
      container.push(v);
      steps.push(
        snap(g, seen, container, v, {
          desc: bn
            ? `${labelOf(g, u)} থেকে ${labelOf(g, v)} দেখো`
            : `Discover ${labelOf(g, v)} from ${labelOf(g, u)}`,
          codeLine: 2,
        })
      );
    }
  }

  const orderLabels = seen.map((id) => labelOf(g, id));
  steps.push(
    snap(g, seen, [], startId, {
      done: true,
      desc: bn
        ? `শেষ — ক্রম: ${orderLabels.join(" → ")}`
        : `Done — order: ${orderLabels.join(" → ")}`,
      codeLine: 3,
    })
  );
  const parentObj: Record<number, number> = {};
  for (const [c, p] of Object.entries(parent)) {
    parentObj[Number(c)] = p;
  }
  return { steps, order: orderLabels, visitedCount: seen.length, parent: parentObj, start: startId };
}

export function bfsTrace(g: GGraph, startId: number, lang: Lang = "en"): GResult {
  return trace("bfs", g, startId, lang);
}

export function dfsTrace(g: GGraph, startId: number, lang: Lang = "en"): GResult {
  const bn = lang === "bn";
  const adj = adjList(g);
  const startLabel = labelOf(g, startId);
  const seen: number[] = [startId];
  const stack: number[] = [startId];
  const parent: Record<number, number> = {};
  const steps: GStep[] = [
    snap(g, seen, stack, startId, {
      desc: bn
        ? `${startLabel} দিয়ে শুরু — dfs(${startLabel})`
        : `Start at ${startLabel} — dfs(${startLabel})`,
      codeLine: 0,
    }),
  ];

  (function walk(u: number) {
    for (const v of adj.get(u) ?? []) {
      if (seen.includes(v)) continue;
      seen.push(v);
      parent[v] = u;
      stack.push(v);
      steps.push(
        snap(g, seen, stack, v, {
          desc: bn
            ? `${labelOf(g, u)} থেকে ${labelOf(g, v)} — ভেতরে ঢোকো`
            : `Discover ${labelOf(g, v)} from ${labelOf(g, u)} — recurse in`,
          codeLine: 2,
        })
      );
      walk(v);
    }
    stack.pop();
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      steps.push(
        snap(g, seen, stack, top, {
          desc: bn
            ? `ব্যাকট্র্যাক: ${labelOf(g, u)} → ${labelOf(g, top)}`
            : `Backtrack: ${labelOf(g, u)} → ${labelOf(g, top)}`,
          codeLine: 3,
        })
      );
    }
  })(startId);

  const orderLabels = seen.map((id) => labelOf(g, id));
  steps.push(
    snap(g, seen, [], startId, {
      done: true,
      desc: bn
        ? `শেষ — ক্রম: ${orderLabels.join(" → ")}`
        : `Done — order: ${orderLabels.join(" → ")}`,
      codeLine: 3,
    })
  );
  const parentObj: Record<number, number> = {};
  for (const [c, p] of Object.entries(parent)) {
    parentObj[Number(c)] = p;
  }
  return { steps, order: orderLabels, visitedCount: seen.length, parent: parentObj, start: startId };
}

export const GRAPH_CODE: Record<GraphAlgo, string[]> = {
  bfs: [
    "queue ← [start], visit start",
    "u = pop front; scan neighbors",
    "  unvisited → visit + push back",
    "queue empty → order complete",
  ],
  dfs: [
    "dfs(v): visit v",
    "  for each neighbor w:",
    "    if unvisited: dfs(w)",
    "  backtrack",
  ],
};

export const GRAPH_PRESETS: GGraph[] = [
  {
    name: "Sample",
    nodes: [
      { id: 0, label: "A", x: 80, y: 200 },
      { id: 1, label: "B", x: 210, y: 100 },
      { id: 2, label: "C", x: 210, y: 300 },
      { id: 3, label: "D", x: 350, y: 100 },
      { id: 4, label: "E", x: 350, y: 300 },
      { id: 5, label: "F", x: 490, y: 200 },
      { id: 6, label: "G", x: 600, y: 100 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [3, 5],
      [4, 5],
      [5, 6],
    ],
  },
  {
    name: "Dense",
    nodes: [
      { id: 0, label: "A", x: 90, y: 200 },
      { id: 1, label: "B", x: 230, y: 90 },
      { id: 2, label: "C", x: 230, y: 310 },
      { id: 3, label: "D", x: 380, y: 90 },
      { id: 4, label: "E", x: 380, y: 310 },
      { id: 5, label: "F", x: 520, y: 200 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 4],
      [2, 5],
      [3, 4],
      [3, 5],
      [4, 5],
    ],
  },
  {
    name: "Line",
    nodes: [
      { id: 0, label: "A", x: 60, y: 200 },
      { id: 1, label: "B", x: 160, y: 200 },
      { id: 2, label: "C", x: 260, y: 200 },
      { id: 3, label: "D", x: 360, y: 200 },
      { id: 4, label: "E", x: 460, y: 200 },
      { id: 5, label: "F", x: 560, y: 200 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
];
