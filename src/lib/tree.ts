import type { Lang } from "./dict";

/* ================= shared binary-tree model ================= */

export type TNodeSnap = { id: number; val: number; left: number; right: number; bal?: number };
export type TStep = {
  nodes: TNodeSnap[];
  root: number;
  current: number;
  edge?: [number, number];
  order: number[];
  verdict?: boolean;
  desc: string;
  codeLine: number;
};

type Mut = { val: number; left: number; right: number; h: number };

function newId(pool: Mut[]): number {
  pool.push({ val: 0, left: -1, right: -1, h: 1 });
  return pool.length - 1;
}

function snapB(pool: Mut[], withBal: boolean): TNodeSnap[] {
  return pool.map((m, id) => ({
    id,
    val: m.val,
    left: m.left,
    right: m.right,
    ...(withBal ? { bal: height(pool, m.right) - height(pool, m.left) } : {}),
  }));
}

function height(pool: Mut[], id: number): number {
  return id === -1 ? 0 : pool[id].h;
}

function fixH(pool: Mut[], id: number): void {
  pool[id].h = 1 + Math.max(height(pool, pool[id].left), height(pool, pool[id].right));
}

function bstInsertSilent(pool: Mut[], root: number, key: number): { root: number; dup: boolean } {
  if (root === -1) {
    const id = newId(pool);
    pool[id].val = key;
    return { root: id, dup: false };
  }
  let c = root;
  while (true) {
    if (key === pool[c].val) return { root, dup: true };
    const side = key < pool[c].val ? "left" : "right";
    if (pool[c][side] === -1) {
      const id = newId(pool);
      pool[id].val = key;
      pool[c][side] = id;
      return { root, dup: false };
    }
    c = pool[c][side];
  }
}

export function parseVals(s: string): number[] {
  const out: number[] = [];
  for (const t of s.split(/[^0-9-]+/)) {
    if (t === "" || t === "-") continue;
    const v = Number(t);
    if (Number.isInteger(v) && v >= 0 && v <= 99 && !out.includes(v)) out.push(v);
  }
  return out.slice(0, 12);
}

export const BST_DEFAULT = [50, 30, 70, 20, 40, 60, 80];

/* ================= BST insert / search / delete ================= */

function walk(
  pool: Mut[], root: number, key: number, withBal: boolean,
  push: (s: TStep) => void, bn: boolean, lines: { goL: number; goR: number; hit: number; miss: number }
): { node: number; parent: number } {
  let c = root;
  let p = -1;
  while (c !== -1) {
    push({
      nodes: snapB(pool, withBal), root, current: c,
      ...(p >= 0 ? { edge: [p, c] as [number, number] } : {}),
      order: [],
      desc: key === pool[c].val
        ? (bn ? `${key} মিলেছে @ ${pool[c].val}` : `${key} == ${pool[c].val} — match`)
        : key < pool[c].val
          ? (bn ? `${key} < ${pool[c].val} → বামে` : `${key} < ${pool[c].val} → go left`)
          : (bn ? `${key} > ${pool[c].val} → ডানে` : `${key} > ${pool[c].val} → go right`),
      codeLine: key === pool[c].val ? lines.hit : key < pool[c].val ? lines.goL : lines.goR,
    });
    if (key === pool[c].val) return { node: c, parent: p };
    p = c;
    c = key < pool[c].val ? pool[c].left : pool[c].right;
  }
  push({
    nodes: snapB(pool, withBal), root, current: p, order: [],
    desc: bn ? "খালি জায়গা — এখানে বসবে/নেই" : "Empty spot reached",
    codeLine: lines.miss,
  });
  return { node: -1, parent: p };
}

const WL = { goL: 1, goR: 2, hit: 3, miss: 4 };

function buildBase(values: number[]): { pool: Mut[]; root: number } {
  const pool: Mut[] = [];
  let root = -1;
  for (const v of values) root = bstInsertSilent(pool, root, v).root;
  return { pool, root };
}

export function bstInsertTrace(values: number[], key: number, lang: Lang = "en"): { steps: TStep[]; ok: boolean } {
  const bn = lang === "bn";
  const { pool, root: r0 } = buildBase(values);
  let root = r0;
  const steps: TStep[] = [{
    nodes: snapB(pool, false), root, current: root, order: [],
    desc: bn ? `ঢোকাও ${key}` : `Insert ${key}`,
    codeLine: 0,
  }];
  const w = walk(pool, root, key, false, (s) => steps.push(s), bn, WL);
  if (w.node !== -1) {
    steps.push({
      nodes: snapB(pool, false), root, current: w.node, order: [], verdict: false,
      desc: bn ? `${key} আগেই আছে — ডুপ্লিকেট নয়` : `${key} already exists — no duplicates`,
      codeLine: 5,
    });
    return { steps, ok: false };
  }
  const id = newId(pool);
  pool[id].val = key;
  if (w.parent === -1) root = id;
  else if (key < pool[w.parent].val) pool[w.parent].left = id;
  else pool[w.parent].right = id;
  steps.push({
    nodes: snapB(pool, false), root, current: id,
    edge: w.parent >= 0 ? [w.parent, id] : undefined, order: [], verdict: true,
    desc: bn ? `${key}-কে পাতা হিসেবে বসাও` : `Attach ${key} as a leaf`,
    codeLine: 5,
  });
  return { steps, ok: true };
}

export function bstSearchTrace(values: number[], key: number, lang: Lang = "en"): { steps: TStep[]; found: boolean } {
  const bn = lang === "bn";
  const { pool, root } = buildBase(values);
  const steps: TStep[] = [{
    nodes: snapB(pool, false), root, current: root, order: [],
    desc: bn ? `খুঁজো ${key}` : `Search ${key}`,
    codeLine: 0,
  }];
  const w = walk(pool, root, key, false, (s) => steps.push(s), bn, WL);
  const found = w.node !== -1;
  steps.push({
    nodes: snapB(pool, false), root, current: w.node === -1 ? w.parent : w.node, order: [],
    verdict: found,
    desc: found
      ? (bn ? `${key} মিলেছে ✓` : `${key} found ✓`)
      : (bn ? `${key} গাছে নেই ✗` : `${key} not in tree ✗`),
    codeLine: 5,
  });
  return { steps, found };
}

export function bstDeleteTrace(values: number[], key: number, lang: Lang = "en"): { steps: TStep[]; ok: boolean } {
  const bn = lang === "bn";
  const { pool, root: r0 } = buildBase(values);
  let root = r0;
  const steps: TStep[] = [{
    nodes: snapB(pool, false), root, current: root, order: [],
    desc: bn ? `মুছো ${key}` : `Delete ${key}`,
    codeLine: 0,
  }];
  const w = walk(pool, root, key, false, (s) => steps.push(s), bn, WL);
  if (w.node === -1) {
    steps.push({
      nodes: snapB(pool, false), root, current: w.parent, order: [], verdict: false,
      desc: bn ? `${key} নেই — কিছুই হবে না` : `${key} absent — nothing to do`,
      codeLine: 5,
    });
    return { steps, ok: false };
  }
  const cut = (target: number, parent: number) => {
    const L = pool[target].left;
    const R = pool[target].right;
    if (L === -1 && R === -1) {
      if (parent === -1) root = -1;
      else if (pool[parent].left === target) pool[parent].left = -1;
      else pool[parent].right = -1;
      steps.push({
        nodes: snapB(pool, false), root, current: parent, order: [], verdict: true,
        desc: bn ? `পাতা ${key} — শুধু কাটো` : `Leaf ${key} — just snip it`,
        codeLine: 6,
      });
    } else if (L === -1 || R === -1) {
      const kid = L === -1 ? R : L;
      if (parent === -1) root = kid;
      else if (pool[parent].left === target) pool[parent].left = kid;
      else pool[parent].right = kid;
      steps.push({
        nodes: snapB(pool, false), root, current: kid, edge: parent >= 0 ? [parent, kid] : undefined,
        order: [], verdict: true,
        desc: bn ? `এক সন্তান — ওকে টেনে তোলো` : `One child — pull it up`,
        codeLine: 6,
      });
    } else {
      let s = R;
      let sp = target;
      while (pool[s].left !== -1) {
        sp = s;
        s = pool[s].left;
        steps.push({
          nodes: snapB(pool, false), root, current: s, edge: [sp, s], order: [],
          desc: bn ? `উত্তরসূরি খুঁজি: ${pool[s].val}` : `Successor hunt: ${pool[s].val}`,
          codeLine: 7,
        });
      }
      const sval = pool[s].val;
      pool[target].val = sval;
      steps.push({
        nodes: snapB(pool, false), root, current: target, order: [], verdict: true,
        desc: bn ? `দুই সন্তান — উত্তরসূরি ${sval} কপি করো` : `Two children — copy successor ${sval}`,
        codeLine: 7,
      });
      const sk = pool[s].right;
      if (sp === target) pool[sp].right = sk;
      else pool[sp].left = sk;
      steps.push({
        nodes: snapB(pool, false), root, current: sp, order: [], verdict: true,
        desc: bn ? `আসল ${sval}-কে সরাও` : `Remove original ${sval}`,
        codeLine: 7,
      });
    }
  };
  cut(w.node, w.parent);
  return { steps, ok: true };
}

export const BST_CODE = [
  "start at root",
  "key < node → left",
  "key > node → right",
  "key == node → hit",
  "empty → miss",
  "insert / verdict",
  "delete: leaf / 1-child / successor",
];

/* ================= traversals ================= */

export type TravOrder = "inorder" | "preorder" | "postorder" | "level";

export function traverseTrace(values: number[], order: TravOrder, lang: Lang = "en"): { steps: TStep[]; visit: number[] } {
  const bn = lang === "bn";
  const { pool, root } = buildBase(values);
  const steps: TStep[] = [];
  const visit: number[] = [];
  const at = (id: number, extra?: Partial<TStep>) => {
    steps.push({
      nodes: snapB(pool, false), root, current: id, order: visit.map((v) => v),
      desc: bn ? `দেখো ${id === -1 ? "—" : pool[id].val}` : `Visit ${id === -1 ? "—" : pool[id].val}`,
      codeLine: 1, ...extra,
    });
  };
  const rec = (id: number, parent: number) => {
    if (id === -1) return;
    if (order === "preorder") { visit.push(id); at(id, parent >= 0 ? { edge: [parent, id] } : {}); }
    else at(id, { ...(parent >= 0 ? { edge: [parent, id] as [number, number] } : {}), desc: bn ? `যাও ${pool[id].val}` : `Go ${pool[id].val}`, codeLine: 0 });
    rec(pool[id].left, id);
    if (order === "inorder") { visit.push(id); at(id); }
    rec(pool[id].right, id);
    if (order === "postorder") { visit.push(id); at(id); }
  };
  if (order === "level") {
    const q: Array<{ id: number; p: number }> = root === -1 ? [] : [{ id: root, p: -1 }];
    while (q.length > 0) {
      const { id, p } = q.shift()!;
      visit.push(id);
      steps.push({
        nodes: snapB(pool, false), root, current: id,
        ...(p >= 0 ? { edge: [p, id] as [number, number] } : {}),
        order: [...visit],
        desc: bn ? `স্তর-ক্রমে ${pool[id].val}` : `Level takes ${pool[id].val}`,
        codeLine: 2,
      });
      if (pool[id].left !== -1) q.push({ id: pool[id].left, p: id });
      if (pool[id].right !== -1) q.push({ id: pool[id].right, p: id });
    }
  } else {
    rec(root, -1);
  }
  steps.push({
    nodes: snapB(pool, false), root, current: -1,
    order: [...visit], verdict: true,
    desc: bn ? `শেষ: ${visit.map((v) => pool[v].val).join(", ")}` : `Done: ${visit.map((v) => pool[v].val).join(", ")}`,
    codeLine: 3,
  });
  return { steps, visit: visit.map((v) => pool[v].val) };
}

export const TRAV_CODE = [
  "enter node",
  "emit (pre/in/post position)",
  "dequeue level order",
  "done",
];

/* ================= AVL ================= */

export function avlTrace(values: number[], lang: Lang = "en"): { steps: TStep[]; balanced: boolean } {
  const bn = lang === "bn";
  const pool: Mut[] = [];
  let root = -1;
  const steps: TStep[] = [];

  const rotRight = (y: number): number => {
    const x = pool[y].left;
    pool[y].left = pool[x].right;
    pool[x].right = y;
    fixH(pool, y);
    fixH(pool, x);
    return x;
  };
  const rotLeft = (x: number): number => {
    const y = pool[x].right;
    pool[x].right = pool[y].left;
    pool[y].left = x;
    fixH(pool, x);
    fixH(pool, y);
    return y;
  };
  const bal = (id: number) => height(pool, pool[id].right) - height(pool, pool[id].left);

  const ins = (id: number, key: number, parent: number): number => {
    if (id === -1) {
      const nid = newId(pool);
      pool[nid].val = key;
      steps.push({
        nodes: snapB(pool, true), root, current: nid,
        ...(parent >= 0 ? { edge: [parent, nid] as [number, number] } : {}),
        order: [], desc: bn ? `বসাও ${key}` : `Place ${key}`, codeLine: 0,
      });
      return nid;
    }
    steps.push({
      nodes: snapB(pool, true), root, current: id,
      ...(parent >= 0 ? { edge: [parent, id] as [number, number] } : {}),
      order: [], desc: key < pool[id].val
        ? (bn ? `${key} < ${pool[id].val} → বামে` : `${key} < ${pool[id].val} → left`)
        : (bn ? `${key} > ${pool[id].val} → ডানে` : `${key} > ${pool[id].val} → right`),
      codeLine: 1,
    });
    if (key < pool[id].val) pool[id].left = ins(pool[id].left, key, id);
    else pool[id].right = ins(pool[id].right, key, id);
    fixH(pool, id);
    const b = bal(id);
    steps.push({
      nodes: snapB(pool, true), root, current: id, order: [],
      desc: bn ? `${pool[id].val}-এর ব্যালান্স ${b}` : `Balance at ${pool[id].val} = ${b}`,
      codeLine: 2,
    });
    if (b < -1 && key < pool[pool[id].left].val) {
      const nr = rotRight(id);
      steps.push({ nodes: snapB(pool, true), root, current: nr, order: [], desc: bn ? `${pool[id].val}-এ ডান ঘূর্ণন (LL)` : `Right rotate at ${pool[id].val} (LL)`, codeLine: 3 });
      return nr;
    }
    if (b > 1 && key > pool[pool[id].right].val) {
      const nr = rotLeft(id);
      steps.push({ nodes: snapB(pool, true), root, current: nr, order: [], desc: bn ? `${pool[id].val}-এ বাম ঘূর্ণন (RR)` : `Left rotate at ${pool[id].val} (RR)`, codeLine: 3 });
      return nr;
    }
    if (b < -1) {
      pool[id].left = rotLeft(pool[id].left);
      steps.push({ nodes: snapB(pool, true), root, current: id, order: [], desc: bn ? `LR: আগে বাম ঘূর্ণন` : `LR: left rotate first`, codeLine: 3 });
      const nr = rotRight(id);
      steps.push({ nodes: snapB(pool, true), root, current: nr, order: [], desc: bn ? `তারপর ডান ঘূর্ণন` : `Then right rotate`, codeLine: 3 });
      return nr;
    }
    if (b > 1) {
      pool[id].right = rotRight(pool[id].right);
      steps.push({ nodes: snapB(pool, true), root, current: id, order: [], desc: bn ? `RL: আগে ডান ঘূর্ণন` : `RL: right rotate first`, codeLine: 3 });
      const nr = rotLeft(id);
      steps.push({ nodes: snapB(pool, true), root, current: nr, order: [], desc: bn ? `তারপর বাম ঘূর্ণন` : `Then left rotate`, codeLine: 3 });
      return nr;
    }
    return id;
  };

  for (const v of values) root = ins(root, v, -1);
  steps.push({
    nodes: snapB(pool, true), root, current: -1, order: [], verdict: true,
    desc: bn ? "ভারসাম্য ঠিক ✓" : "Balanced ✓", codeLine: 4,
  });
  const okAll = pool.every((m) => Math.abs(height(pool, m.right) - height(pool, m.left)) <= 1);
  return { steps, balanced: okAll };
}

export const AVL_CODE = [
  "BST insert",
  "walk down",
  "update height + balance",
  "rotate LL / RR / LR / RL",
  "done",
];

export const AVL_DEFAULT = [30, 20, 40, 10, 25, 35, 50, 5];

/* ================= binary heap ================= */

export type HStep = {
  arr: number[];
  a: number;
  b: number;
  done: boolean;
  desc: string;
  codeLine: number;
};

function hswap(a: number[], i: number, j: number): void {
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
}

export function heapTrace(values: number[], op: "build" | "insert" | "extract", key: number, lang: Lang = "en"): { steps: HStep[]; arr: number[]; out?: number } {
  const bn = lang === "bn";
  const a = [...values];
  const steps: HStep[] = [];
  const at = (x: number, y: number, desc: string, codeLine: number, isDone = false) => {
    steps.push({ arr: [...a], a: x, b: y, done: isDone, desc, codeLine });
  };
  const siftDown = (i: number, n: number) => {
    for (;;) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let m = i;
      if (l < n) {
        at(i, l, bn ? `${a[i]} বনাম ${a[l]}` : `${a[i]} vs ${a[l]}`, 1);
        if (a[l] > a[m]) m = l;
      }
      if (r < n) {
        at(i, r, bn ? `${a[m]} বনাম ${a[r]}` : `${a[m]} vs ${a[r]}`, 1);
        if (a[r] > a[m]) m = r;
      }
      if (m === i) break;
      at(i, m, bn ? `${a[i]} ↔ ${a[m]} অদল` : `Swap ${a[i]} ↔ ${a[m]}`, 2);
      hswap(a, i, m);
      i = m;
    }
  };
  const bubbleUp = (i: number) => {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      at(p, i, bn ? `${a[i]} বনাম বাবা ${a[p]}` : `${a[i]} vs parent ${a[p]}`, 3);
      if (a[i] <= a[p]) break;
      at(p, i, bn ? `ওপরে তোলো ${a[i]}` : `Bubble ${a[i]} up`, 3);
      hswap(a, p, i);
      i = p;
    }
  };
  if (op === "build") {
    at(-1, -1, bn ? "নিচ থেকে heapify" : "Heapify bottom-up", 0);
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(i, a.length);
  } else if (op === "insert") {
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let m = i;
      if (l < a.length && a[l] > a[m]) m = l;
      if (r < a.length && a[r] > a[m]) m = r;
      if (m !== i) { hswap(a, i, m); i = m; }
    }
    a.push(key);
    at(a.length - 1, a.length - 1, bn ? `শেষে ${key} বসাও` : `Append ${key}`, 3);
    bubbleUp(a.length - 1);
  } else {
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let m = i;
      if (l < a.length && a[l] > a[m]) m = l;
      if (r < a.length && a[r] > a[m]) m = r;
      if (m !== i) { hswap(a, i, m); i = m; }
    }
    const out = a[0];
    at(0, a.length - 1, bn ? `মূল ${out} ↔ শেষ ${a[a.length - 1]}` : `Root ${out} ↔ last ${a[a.length - 1]}`, 4);
    hswap(a, 0, a.length - 1);
    a.pop();
    siftDown(0, a.length);
    at(-1, -1, bn ? `বেরোলো ${out} ✓` : `Extracted ${out} ✓`, 4, true);
    return { steps, arr: a, out };
  }
  at(-1, -1, bn ? "ম্যাক্স-হিপ ✓" : "Max-heap ✓", 4, true);
  return { steps, arr: a };
}

export const HEAP_CODE = [
  "heapify / append",
  "bigger child?",
  "swap down",
  "bubble up",
  "extract root",
];

export const HEAP_DEFAULT = [40, 70, 30, 90, 20, 60];

/* ================= trie ================= */

export type RNode = { id: number; ch: string; end: boolean };
export type RStep = {
  nodes: RNode[];
  edges: Array<[number, number]>;
  current: number;
  matched: string;
  verdict?: boolean;
  desc: string;
  codeLine: number;
};

type TrieMut = { ch: string; end: boolean; kids: Map<string, number> };

function trieBuild(words: string[]): { pool: TrieMut[] } {
  const pool: TrieMut[] = [{ ch: "", end: false, kids: new Map() }];
  for (const w of words) {
    let c = 0;
    for (const ch of w) {
      const nx = pool[c].kids.get(ch);
      if (nx === undefined) {
        pool.push({ ch, end: false, kids: new Map() });
        pool[c].kids.set(ch, pool.length - 1);
        c = pool.length - 1;
      } else c = nx;
    }
    pool[c].end = true;
  }
  return { pool };
}

function snapR(pool: TrieMut[]): { nodes: RNode[]; edges: Array<[number, number]> } {
  const nodes = pool.map((m, id) => ({ id, ch: m.ch, end: m.end }));
  const edges: Array<[number, number]> = [];
  pool.forEach((m, id) => {
    for (const kid of m.kids.values()) edges.push([id, kid]);
  });
  return { nodes, edges };
}

export function trieTrace(words: string[], op: "insert" | "search", word: string, lang: Lang = "en"): { steps: RStep[]; ok: boolean } {
  const bn = lang === "bn";
  const base = op === "insert" ? words.filter((w) => w !== word) : words;
  const { pool } = trieBuild(base);
  const steps: RStep[] = [];
  const w = word.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
  let c = 0;
  let matched = "";
  steps.push({
    ...snapR(pool), current: 0, matched,
    desc: bn ? `${op === "insert" ? "ঢোকাও" : "খুঁজো"} “${w}”` : `${op === "insert" ? "Insert" : "Search"} “${w}”`,
    codeLine: 0,
  });
  for (const ch of w) {
    const nx = pool[c].kids.get(ch);
    if (nx === undefined) {
      if (op === "search") {
        steps.push({
          ...snapR(pool), current: c, matched, verdict: false,
          desc: bn ? `“${ch}” নেই — ব্যর্থ ✗` : `No “${ch}” — miss ✗`,
          codeLine: 3,
        });
        return { steps, ok: false };
      }
      pool.push({ ch, end: false, kids: new Map() });
      pool[c].kids.set(ch, pool.length - 1);
      c = pool.length - 1;
      matched += ch;
      steps.push({
        ...snapR(pool), current: c, matched,
        desc: bn ? `নতুন নোড “${ch}”` : `New node “${ch}”`,
        codeLine: 1,
      });
    } else {
      c = nx;
      matched += ch;
      steps.push({
        ...snapR(pool), current: c, matched,
        desc: bn ? `আগের “${ch}” ব্যবহার` : `Reuse “${ch}”`,
        codeLine: 1,
      });
    }
  }
  if (op === "insert") pool[c].end = true;
  const ok = op === "insert" ? true : pool[c].end;
  steps.push({
    ...snapR(pool), current: c, matched, verdict: ok,
    desc: op === "insert"
      ? (bn ? `“${w}” শেষ ✓` : `“${w}” stored ✓`)
      : ok
        ? (bn ? `“${w}” মিলেছে ✓` : `“${w}” found ✓`)
        : (bn ? `প্রিফিক্স আছে, শব্দ নয় ✗` : `Prefix only, not a word ✗`),
    codeLine: 2,
  });
  return { steps, ok };
}

export const TRIE_CODE = [
  "start at root",
  "per char: reuse / create",
  "mark end / verdict",
  "miss",
];

export const TRIE_DEFAULT = ["cat", "car", "card", "dog"];

/* ================= segment tree ================= */

export type GStep = {
  tree: (number | null)[];
  n: number;
  current: number;
  take: number[];
  skip: number[];
  acc: number;
  parts: Array<[number, number]>;
  desc: string;
  codeLine: number;
};

export function segTrace(arr: number[], ql: number, qr: number, lang: Lang = "en"): { steps: GStep[]; sum: number; parts: Array<[number, number]> } {
  const bn = lang === "bn";
  const n = arr.length;
  const tree: (number | null)[] = Array(4 * n).fill(null);
  const build = (p: number, l: number, r: number): number => {
    if (l === r) { tree[p] = arr[l]; return arr[l]; }
    const m = Math.floor((l + r) / 2);
    const s = build(2 * p + 1, l, m) + build(2 * p + 2, m + 1, r);
    tree[p] = s;
    return s;
  };
  build(0, 0, n - 1);
  const steps: GStep[] = [{
    tree: [...tree], n, current: 0, take: [], skip: [], acc: 0, parts: [],
    desc: bn ? `যোগফল-গাছ তৈরি · জিজ্ঞাসা [${ql}, ${qr}]` : `Sum-tree built · query [${ql}, ${qr}]`,
    codeLine: 0,
  }];
  let acc = 0;
  const take: number[] = [];
  const skip: number[] = [];
  const parts: Array<[number, number]> = [];
  const query = (p: number, l: number, r: number) => {
    if (r < ql || l > qr) {
      skip.push(p);
      steps.push({
        tree: [...tree], n, current: p, take: [...take], skip: [...skip], acc, parts: parts.map((x) => [...x] as [number, number]),
        desc: bn ? `[${l}, ${r}] বাইরে — বাদ` : `[${l}, ${r}] outside — skip`,
        codeLine: 1,
      });
      return;
    }
    if (ql <= l && r <= qr) {
      take.push(p);
      acc += tree[p] ?? 0;
      parts.push([l, r]);
      steps.push({
        tree: [...tree], n, current: p, take: [...take], skip: [...skip], acc, parts: parts.map((x) => [...x] as [number, number]),
        desc: bn ? `[${l}, ${r}] পুরো ভেতরে → +${tree[p]}` : `[${l}, ${r}] fully inside → +${tree[p]}`,
        codeLine: 2,
      });
      return;
    }
    steps.push({
      tree: [...tree], n, current: p, take: [...take], skip: [...skip], acc, parts: parts.map((x) => [...x] as [number, number]),
      desc: bn ? `[${l}, ${r}] আংশিক — নিচে যাও` : `[${l}, ${r}] partial — go deeper`,
      codeLine: 3,
    });
    const m = Math.floor((l + r) / 2);
    query(2 * p + 1, l, m);
    query(2 * p + 2, m + 1, r);
  };
  query(0, 0, n - 1);
  steps.push({
    tree: [...tree], n, current: -1, take: [...take], skip: [...skip], acc, parts: parts.map((x) => [...x] as [number, number]),
    desc: bn ? `যোগফল = ${acc} ✓` : `Sum = ${acc} ✓`,
    codeLine: 4,
  });
  return { steps, sum: acc, parts };
}

export const SEG_CODE = [
  "build sum tree",
  "outside → skip",
  "inside → take",
  "partial → recurse",
  "done",
];

export const SEG_DEFAULT = [5, 2, 8, 6, 1, 4];
