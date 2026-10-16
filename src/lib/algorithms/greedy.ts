import type { Lang } from "../dict";

// Greedy traces: each step is a full snapshot so playback is trivial.
// Style mirrors dp.ts / kadane.ts (lang-aware descs + codeLine).

// ---------------------------------------------------------------------------
// 1. Activity selection — earliest finish first
// ---------------------------------------------------------------------------

export const ACT_CODE = [
  "sort by finish time ↑",
  "pick the first activity",
  "for the rest: s ≥ lastF?",
  "  compatible → pick",
  "  else skip",
];

export type ActItem = { s: number; f: number };

export type ActStep = {
  order: number[];
  idx: number; // cursor in order, -1 = sorting step
  picked: boolean[];
  lastF: number;
  desc: string;
  codeLine: number;
};

export type ActResult = {
  steps: ActStep[];
  order: number[];
  pickedIdx: number[];
  count: number;
};

export const ACT_PRESETS: { name: string; items: ActItem[] }[] = [
  {
    name: "CLRS",
    items: [
      { s: 1, f: 4 }, { s: 3, f: 5 }, { s: 0, f: 6 }, { s: 5, f: 7 },
      { s: 3, f: 9 }, { s: 5, f: 9 }, { s: 6, f: 10 }, { s: 8, f: 11 },
      { s: 8, f: 12 }, { s: 2, f: 14 }, { s: 12, f: 16 },
    ],
  },
  {
    name: "Small",
    items: [
      { s: 1, f: 3 }, { s: 2, f: 5 }, { s: 4, f: 6 },
      { s: 6, f: 8 }, { s: 5, f: 7 }, { s: 8, f: 10 },
    ],
  },
  {
    name: "Crowded",
    items: [
      { s: 0, f: 5 }, { s: 1, f: 2 }, { s: 2, f: 3 },
      { s: 3, f: 4 }, { s: 4, f: 6 },
    ],
  },
];

export function activityTrace(items: ActItem[], lang: Lang = "en"): ActResult {
  const bn = lang === "bn";
  const order = items.map((_, i) => i).sort((x, y) => items[x].f - items[y].f || items[x].s - items[y].s);
  const picked = Array(items.length).fill(false);
  const steps: ActStep[] = [];
  const snap = (idx: number, lastF: number, desc: string, codeLine: number): ActStep => ({
    order: [...order],
    idx,
    picked: [...picked],
    lastF,
    desc,
    codeLine,
  });

  steps.push(snap(-1, -1, bn ? `শেষ-সময় ধরে সাজাও: ${order.map((i) => `#${i + 1}`).join(" → ")}` : `sort by finish: ${order.map((i) => `#${i + 1}`).join(" → ")}`, 0));
  let lastF = -1;
  const pickedIdx: number[] = [];
  order.forEach((oi, k) => {
    const it = items[oi];
    if (k === 0 || it.s >= lastF) {
      picked[oi] = true;
      lastF = it.f;
      pickedIdx.push(oi);
      steps.push(snap(k, lastF, bn ? `#${oi + 1} [${it.s},${it.f}] নাও ✓ (শুরু ${it.s} ≥ ${k === 0 ? "—" : `lastF`})` : `#${oi + 1} [${it.s},${it.f}] pick ✓ (starts ${it.s})`, k === 0 ? 1 : 3));
    } else {
      steps.push(snap(k, lastF, bn ? `#${oi + 1} [${it.s},${it.f}] বাদ (${it.s} < lastF ${lastF})` : `#${oi + 1} [${it.s},${it.f}] skip (${it.s} < lastF ${lastF})`, 4));
    }
  });
  steps.push(snap(order.length - 1, lastF, bn ? `শেষ — ${pickedIdx.length}টি কাজ: ${pickedIdx.map((i) => `#${i + 1}`).join(", ")}` : `done — ${pickedIdx.length} activities: ${pickedIdx.map((i) => `#${i + 1}`).join(", ")}`, 4));
  return { steps, order, pickedIdx, count: pickedIdx.length };
}

// ---------------------------------------------------------------------------
// 2. Fractional knapsack — value density first
// ---------------------------------------------------------------------------

export const FRAC_CODE = [
  "sort by v/w ↓",
  "take whole if it fits",
  "else take a fraction",
  "value += frac × v",
  "O(n log n) sort",
];

export type FracItem = { w: number; v: number };

export type FracStep = {
  order: number[];
  idx: number; // cursor in order, -1 = sorting step
  frac: number[];
  capLeft: number;
  value: number;
  desc: string;
  codeLine: number;
};

export type FracResult = {
  steps: FracStep[];
  order: number[];
  value: number;
  answer: string;
};

export const FRAC_PRESETS: { name: string; items: FracItem[]; cap: number }[] = [
  {
    name: "Classic",
    items: [{ w: 10, v: 60 }, { w: 20, v: 100 }, { w: 30, v: 120 }],
    cap: 50,
  },
  {
    name: "Mixed",
    items: [{ w: 5, v: 30 }, { w: 10, v: 40 }, { w: 15, v: 45 }, { w: 20, v: 50 }],
    cap: 30,
  },
  {
    name: "Trap",
    items: [{ w: 30, v: 150 }, { w: 20, v: 90 }, { w: 10, v: 60 }],
    cap: 40,
  },
];

export function fracKnapsackTrace(items: FracItem[], cap: number, lang: Lang = "en"): FracResult {
  const bn = lang === "bn";
  const dens = (i: number) => items[i].v / items[i].w;
  const order = items.map((_, i) => i).sort((x, y) => dens(y) - dens(x));
  const frac = Array(items.length).fill(0);
  const steps: FracStep[] = [];
  let capLeft = cap;
  let value = 0;
  const snap = (idx: number, desc: string, codeLine: number): FracStep => ({
    order: [...order],
    idx,
    frac: [...frac],
    capLeft,
    value,
    desc,
    codeLine,
  });

  steps.push(snap(-1, bn ? `ঘনত্ব v/w ধরে সাজাও: ${order.map((i) => `#${i + 1}(${(dens(i)).toFixed(1)})`).join(" → ")}` : `sort by density: ${order.map((i) => `#${i + 1}(${(dens(i)).toFixed(1)})`).join(" → ")}`, 0));
  order.forEach((oi, k) => {
    const it = items[oi];
    if (capLeft <= 0) {
      steps.push(snap(k, bn ? `#${oi + 1} — থলে ভর্তি, বাদ` : `#${oi + 1} — bag full, skip`, 1));
      return;
    }
    if (it.w <= capLeft) {
      frac[oi] = 1;
      capLeft -= it.w;
      value += it.v;
      steps.push(snap(k, bn ? `#${oi + 1} পুরোটা নাও (w=${it.w}) → +${it.v}` : `#${oi + 1} take all (w=${it.w}) → +${it.v}`, 1));
    } else {
      const f = capLeft / it.w;
      frac[oi] = f;
      value += f * it.v;
      capLeft = 0;
      steps.push(snap(k, bn ? `#${oi + 1} ভগ্নাংশ ${f.toFixed(2)} নাও → +${(f * it.v).toFixed(1)}` : `#${oi + 1} take fraction ${f.toFixed(2)} → +${(f * it.v).toFixed(1)}`, 2));
    }
  });
  const val = Math.round(value * 10) / 10;
  steps.push(snap(order.length - 1, bn ? `শেষ — মোট মান ${val} (ধারণ ${cap})` : `done — total value ${val} (capacity ${cap})`, 4));
  return { steps, order, value: val, answer: String(val) };
}

// ---------------------------------------------------------------------------
// 3. Huffman coding — merge two smallest
// ---------------------------------------------------------------------------

export const HUFF_CODE = [
  "count frequencies",
  "min-heap of leaves",
  "merge two smallest ×",
  "new node freq = sum",
  "left=0 right=1 codes",
];

export type HuffStep = {
  forest: { id: number; label: string; freq: number }[];
  merged: [number, number] | null;
  newId: number | null;
  desc: string;
  codeLine: number;
};

export type HuffResult = {
  steps: HuffStep[];
  codes: { ch: string; code: string; freq: number }[];
  encoded: string;
  avgBits: number;
  savedPct: number;
  answer: string;
};

export const HUFF_TEXT = "ABRACADABRA";

type HNode = { id: number; ch: string | null; freq: number; left: number; right: number };

export function huffmanTrace(text: string, lang: Lang = "en"): HuffResult {
  const bn = lang === "bn";
  const freq = new Map<string, number>();
  for (const ch of text) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  const nodes = new Map<number, HNode>();
  let nextId = 0;
  let heap: number[] = [];
  for (const [ch, f] of [...freq.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))) {
    nodes.set(nextId, { id: nextId, ch, freq: f, left: -1, right: -1 });
    heap.push(nextId);
    nextId++;
  }
  const label = (id: number): string => {
    const n = nodes.get(id)!;
    return n.ch ?? `(${n.freq})`;
  };
  const snapForest = (): { id: number; label: string; freq: number }[] =>
    [...heap].sort((x, y) => nodes.get(y)!.freq - nodes.get(x)!.freq).map((id) => ({ id, label: label(id), freq: nodes.get(id)!.freq }));

  const steps: HuffStep[] = [];
  steps.push({ forest: snapForest(), merged: null, newId: null, desc: bn ? `ফ্রিকোয়েন্সি: ${[...freq.entries()].map(([c, f]) => `${c}×${f}`).join(", ")}` : `frequencies: ${[...freq.entries()].map(([c, f]) => `${c}×${f}`).join(", ")}`, codeLine: 0 });

  if (heap.length === 1) {
    const only = heap[0];
    nodes.set(nextId, { id: nextId, ch: null, freq: nodes.get(only)!.freq, left: only, right: -1 });
    heap = [nextId];
    nextId++;
  }
  while (heap.length > 1) {
    heap.sort((x, y) => nodes.get(x)!.freq - nodes.get(y)!.freq);
    const x = heap.shift()!;
    const y = heap.shift()!;
    const nx = nodes.get(x)!;
    const ny = nodes.get(y)!;
    const id = nextId++;
    nodes.set(id, { id, ch: null, freq: nx.freq + ny.freq, left: x, right: y });
    heap.push(id);
    steps.push({
      forest: snapForest(),
      merged: [x, y],
      newId: id,
      desc: bn ? `${label(x)}(${nx.freq}) + ${label(y)}(${ny.freq}) = ${nx.freq + ny.freq} জোড়া দাও` : `merge ${label(x)}(${nx.freq}) + ${label(y)}(${ny.freq}) = ${nx.freq + ny.freq}`,
      codeLine: 2,
    });
  }

  // codes via DFS
  const codes = new Map<string, string>();
  const root = heap[0];
  const dfs = (id: number, path: string) => {
    const n = nodes.get(id)!;
    if (n.ch !== null) {
      codes.set(n.ch, path === "" ? "0" : path);
      return;
    }
    if (n.left !== -1) dfs(n.left, path + "0");
    if (n.right !== -1) dfs(n.right, path + "1");
  };
  dfs(root, "");
  const table = [...codes.entries()]
    .map(([ch, code]) => ({ ch, code, freq: freq.get(ch)! }))
    .sort((a, b) => a.code.length - b.code.length || (a.ch < b.ch ? -1 : 1));
  const encoded = [...text].map((c) => codes.get(c)!).join(" ");
  const totalBits = [...text].reduce((s, c) => s + codes.get(c)!.length, 0);
  const avgBits = Math.round((totalBits / text.length) * 100) / 100;
  const fixed = text.length * 8;
  const savedPct = Math.round(((fixed - totalBits) / fixed) * 100);
  steps.push({
    forest: snapForest(),
    merged: null,
    newId: null,
    desc: bn ? `শেষ — গড় ${avgBits} বিট/অক্ষর, 8-বিটের চেয়ে ${savedPct}% কম` : `done — avg ${avgBits} bits/char, ${savedPct}% less than 8-bit`,
    codeLine: 4,
  });
  return { steps, codes: table, encoded, avgBits, savedPct, answer: `${avgBits} bits/char` };
}

// ---------------------------------------------------------------------------
// 4. Merge intervals — sort + sweep
// ---------------------------------------------------------------------------

export const MERGE_CODE = [
  "sort by start ↑",
  "cur = first",
  "overlap? extend end",
  "else push cur, move on",
  "push the last cur",
];

export type Interval = [number, number];

export type MergeStep = {
  order: number[];
  idx: number; // cursor, -1 = sorting step
  cur: Interval | null;
  out: Interval[];
  extended: boolean;
  desc: string;
  codeLine: number;
};

export type MergeResult = {
  steps: MergeStep[];
  order: number[];
  merged: Interval[];
  answer: string;
};

export const MERGE_PRESETS: Interval[][] = [
  [[1, 3], [2, 6], [8, 10], [9, 12], [15, 18]],
  [[1, 4], [4, 5], [6, 8], [2, 3]],
  [[1, 10], [2, 3], [4, 5], [6, 7]],
];

export function randomIntervals(n = 5): Interval[] {
  const out: Interval[] = [];
  for (let i = 0; i < n; i++) {
    const s = Math.floor(Math.random() * 14);
    out.push([s, s + 1 + Math.floor(Math.random() * 5)]);
  }
  return out;
}

export function mergeTrace(input: Interval[], lang: Lang = "en"): MergeResult {
  const bn = lang === "bn";
  const order = input.map((_, i) => i).sort((x, y) => input[x][0] - input[y][0] || input[x][1] - input[y][1]);
  const steps: MergeStep[] = [];
  const snap = (idx: number, cur: Interval | null, out: Interval[], extended: boolean, desc: string, codeLine: number): MergeStep => ({
    order: [...order],
    idx,
    cur: cur ? [...cur] as Interval : null,
    out: out.map((p) => [...p] as Interval),
    extended,
    desc,
    codeLine,
  });

  steps.push(snap(-1, null, [], false, bn ? `শুরু দিয়ে সাজাও: ${order.map((i) => `[${input[i][0]},${input[i][1]}]`).join(" ")}` : `sort by start: ${order.map((i) => `[${input[i][0]},${input[i][1]}]`).join(" ")}`, 0));
  let cur: Interval = order.length > 0 ? [...input[order[0]]] as Interval : [0, 0];
  const out: Interval[] = [];
  if (order.length > 0) {
    steps.push(snap(0, cur, out, false, bn ? `cur = [${cur[0]},${cur[1]}]` : `cur = [${cur[0]},${cur[1]}]`, 1));
    for (let k = 1; k < order.length; k++) {
      const [s, e] = input[order[k]];
      if (s <= cur[1]) {
        cur = [cur[0], Math.max(cur[1], e)] as Interval;
        steps.push(snap(k, cur, out, true, bn ? `[${s},${e}] মিলেছে — বাড়াও [${cur[0]},${cur[1]}]` : `[${s},${e}] overlaps — extend to [${cur[0]},${cur[1]}]`, 2));
      } else {
        out.push(cur);
        steps.push(snap(k, cur, out, false, bn ? `[${s},${e}] আলাদা — [${cur[0]},${cur[1]}] রাখো` : `[${s},${e}] disjoint — push [${cur[0]},${cur[1]}]`, 3));
        cur = [s, e];
      }
    }
    out.push(cur);
  }
  steps.push(snap(order.length - 1, cur, out, false, bn ? `শেষ — ${out.length}টি: ${out.map((p) => `[${p[0]},${p[1]}]`).join(" ")}` : `done — ${out.length}: ${out.map((p) => `[${p[0]},${p[1]}]`).join(" ")}`, 4));
  return { steps, order, merged: out, answer: out.map((p) => `[${p[0]},${p[1]}]`).join(" ") || "—" };
}
