import type { Lang } from "./dict";

export type RecFnId = "fact" | "fib";

export type CallNode = {
  id: number;
  fn: string;
  arg: number;
  result: number | null;
  base: boolean;
  children: CallNode[];
  depth: number;
  x: number; // layout order (leaf-based)
};

export type RecStep = {
  type: "enter" | "exit";
  nodeId: number;
  stack: number[];
  codeLine: number;
  desc: string;
};

export type RecTrace = {
  root: CallNode;
  steps: RecStep[];
  calls: number;
  maxDepth: number;
  leaves: number;
};

let nextId = 0;

function factTree(n: number, depth: number): CallNode {
  const node: CallNode = {
    id: nextId++,
    fn: "fact",
    arg: n,
    result: null,
    base: n <= 1,
    children: [],
    depth,
    x: 0,
  };
  if (n > 1) {
    const child = factTree(n - 1, depth + 1);
    node.children = [child];
    node.result = n * (child.result ?? 1);
  } else {
    node.result = 1;
  }
  return node;
}

function fibTree(n: number, depth: number): CallNode {
  const node: CallNode = {
    id: nextId++,
    fn: "fib",
    arg: n,
    result: null,
    base: n <= 1,
    children: [],
    depth,
    x: 0,
  };
  if (n > 1) {
    const l = fibTree(n - 1, depth + 1);
    const r = fibTree(n - 2, depth + 1);
    node.children = [l, r];
    node.result = (l.result ?? 0) + (r.result ?? 0);
  } else {
    node.result = n;
  }
  return node;
}

function layoutLeaves(root: CallNode): number {
  let counter = 0;
  let maxDepth = 0;
  (function walk(n: CallNode) {
    maxDepth = Math.max(maxDepth, n.depth);
    if (n.children.length === 0) {
      n.x = counter++;
    } else {
      n.children.forEach(walk);
      n.x = n.children.reduce((s, c) => s + c.x, 0) / n.children.length;
    }
  })(root);
  return counter;
}

function collectSteps(root: CallNode, bn: boolean): { steps: RecStep[]; maxDepth: number } {
  const steps: RecStep[] = [];
  const byId = new Map<number, CallNode>();
  (function index(n: CallNode) {
    byId.set(n.id, n);
    n.children.forEach(index);
  })(root);
  let maxDepth = 0;

  (function walk(n: CallNode, stack: number[]) {
    maxDepth = Math.max(maxDepth, stack.length + 1);
    steps.push({
      type: "enter",
      nodeId: n.id,
      stack: [...stack, n.id],
      codeLine: 1,
      desc: n.base
        ? bn
          ? `কল ${n.fn}(${n.arg}) → বেস কেস`
          : `call ${n.fn}(${n.arg}) → base case`
        : `call ${n.fn}(${n.arg})`,
    });
    for (const c of n.children) walk(c, [...stack, n.id]);
    const kids =
      n.children.length > 0
        ? ` ← ${n.children.map((c) => `${c.fn}(${c.arg})=${c.result}`).join(" + ")}`
        : "";
    steps.push({
      type: "exit",
      nodeId: n.id,
      stack: [...stack],
      codeLine: n.base ? 1 : 2,
      desc: bn ? `ফেরত ${n.result}${kids}` : `return ${n.result}${kids}`,
    });
  })(root, []);

  return { steps, maxDepth };
}

export function buildTrace(fn: RecFnId, n: number, lang: Lang = "en"): RecTrace {
  const bn = lang === "bn";
  nextId = 0;
  const root = fn === "fact" ? factTree(n, 0) : fibTree(n, 0);
  const leaves = layoutLeaves(root);
  const { steps, maxDepth } = collectSteps(root, bn);
  let calls = 0;
  (function count(node: CallNode) {
    calls++;
    node.children.forEach(count);
  })(root);
  return { root, steps, calls, maxDepth, leaves };
}

export const REC_CODE: Record<RecFnId, string[]> = {
  fact: ["fact(n):", "  if n <= 1: return 1   # base", "  return n * fact(n-1)"],
  fib: ["fib(n):", "  if n <= 1: return n   # base", "  return fib(n-1) + fib(n-2)"],
};

export const REC_LIMITS: Record<RecFnId, { min: number; max: number; def: number }> = {
  fact: { min: 1, max: 10, def: 5 },
  fib: { min: 1, max: 8, def: 6 },
};
