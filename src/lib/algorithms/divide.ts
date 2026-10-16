import type { Lang } from "../dict";

// Divide & Conquer traces. Style mirrors greedy.ts / dp.ts.

// ---------------------------------------------------------------------------
// 1. Closest pair of points
// ---------------------------------------------------------------------------

export const CP_CODE = [
  "sort points by x",
  "mid line — split halves",
  "best pair in each half",
  "strip: |x − mid| < δ, by y",
  "check ≤7 neighbors each",
];

export type Pt = { x: number; y: number };

export type CPStep = {
  order: number[]; // indices into pts, sorted by x
  midX: number | null;
  strip: boolean[];
  hl: number[]; // highlighted point indices (into pts)
  pair: [number, number] | null; // best pair (into pts)
  delta: number;
  desc: string;
  codeLine: number;
};

export type CPResult = {
  steps: CPStep[];
  pair: [Pt, Pt];
  dist: number;
  answer: string;
};

export const CP_PRESETS: { name: string; pts: Pt[] }[] = [
  {
    name: "Classic",
    pts: [
      { x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 },
      { x: 12, y: 10 }, { x: 3, y: 4 },
    ],
  },
  {
    name: "Eight",
    pts: [
      { x: 1, y: 5 }, { x: 4, y: 2 }, { x: 6, y: 8 }, { x: 9, y: 3 },
      { x: 11, y: 7 }, { x: 14, y: 1 }, { x: 16, y: 6 }, { x: 19, y: 4 },
    ],
  },
];

export function randomPoints(n = 8, max = 30): Pt[] {
  const seen = new Set<string>();
  const out: Pt[] = [];
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

const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);
const fmtD = (d: number): string => (Math.round(d * 100) / 100).toString();

export function closestPairTrace(pts: Pt[], lang: Lang = "en"): CPResult {
  const bn = lang === "bn";
  const order = pts.map((_, i) => i).sort((a, b) => pts[a].x - pts[b].x || pts[a].y - pts[b].y);
  const noStrip = pts.map(() => false);
  const steps: CPStep[] = [];
  const push = (strip: boolean[], hl: number[], pair: [number, number] | null, midX: number | null, delta: number, desc: string, codeLine: number) =>
    steps.push({ order: [...order], midX, strip: [...strip], hl: [...hl], pair, delta, desc, codeLine });

  push(noStrip, [], null, null, Infinity, bn ? `x ধরে সাজাও: ${order.map((i) => `P${i + 1}`).join(" → ")}` : `sort by x: ${order.map((i) => `P${i + 1}`).join(" → ")}`, 0);

  const mid = Math.floor(order.length / 2);
  const midX = (pts[order[mid - 1]].x + pts[order[mid]].x) / 2;
  const left = order.slice(0, mid);
  const right = order.slice(mid);

  const brute = (ids: number[]): { pair: [number, number]; d: number } => {
    let best: [number, number] = [ids[0], ids[1]];
    let d = dist(pts[ids[0]], pts[ids[1]]);
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++) {
        const dd = dist(pts[ids[i]], pts[ids[j]]);
        if (dd < d) {
          d = dd;
          best = [ids[i], ids[j]];
        }
      }
    return { pair: best, d };
  };

  push(noStrip, [], null, midX, Infinity, bn ? `মাঝ-রেখা x=${fmtD(midX)} — বাম ${left.length}টি, ডান ${right.length}টি` : `mid line x=${fmtD(midX)} — left ${left.length}, right ${right.length}`, 1);

  const bl = brute(left);
  push(noStrip, [...bl.pair], bl.pair, midX, bl.d, bn ? `বাম-সেরা P${bl.pair[0] + 1}–P${bl.pair[1] + 1} = ${fmtD(bl.d)}` : `left best P${bl.pair[0] + 1}–P${bl.pair[1] + 1} = ${fmtD(bl.d)}`, 2);
  const br = brute(right);
  push(noStrip, [...br.pair], br.pair, midX, br.d, bn ? `ডান-সেরা P${br.pair[0] + 1}–P${br.pair[1] + 1} = ${fmtD(br.d)}` : `right best P${br.pair[0] + 1}–P${br.pair[1] + 1} = ${fmtD(br.d)}`, 2);

  let delta = Math.min(bl.d, br.d);
  let best: [number, number] = bl.d <= br.d ? bl.pair : br.pair;
  const stripIds = order.filter((i) => Math.abs(pts[i].x - midX) < delta).sort((a, b) => pts[a].y - pts[b].y);
  const inStrip = pts.map((_, i) => stripIds.includes(i));
  push(inStrip, [], best, midX, delta, bn ? `δ=${fmtD(delta)} — স্ট্রিপে ${stripIds.length}টি (y-ধরে)` : `δ=${fmtD(delta)} — ${stripIds.length} in strip (by y)`, 3);

  for (let i = 0; i < stripIds.length; i++) {
    for (let j = i + 1; j < Math.min(i + 8, stripIds.length); j++) {
      const a = stripIds[i];
      const b = stripIds[j];
      if (pts[stripIds[j]].y - pts[stripIds[i]].y >= delta) break;
      const dd = dist(pts[a], pts[b]);
      if (dd < delta) {
        delta = dd;
        best = [a, b];
        push(inStrip, [a, b], best, midX, delta, bn ? `নতুন সেরা P${a + 1}–P${b + 1} = ${fmtD(dd)} ✓` : `new best P${a + 1}–P${b + 1} = ${fmtD(dd)} ✓`, 4);
      } else {
        push(inStrip, [a, b], best, midX, delta, bn ? `P${a + 1}–P${b + 1} = ${fmtD(dd)} (δ=${fmtD(delta)} — বাদ)` : `P${a + 1}–P${b + 1} = ${fmtD(dd)} (δ=${fmtD(delta)} — skip)`, 4);
      }
    }
  }
  push(inStrip, [...best], best, midX, delta, bn ? `শেষ — নিকটতম P${best[0] + 1}–P${best[1] + 1} = ${fmtD(delta)}` : `done — closest P${best[0] + 1}–P${best[1] + 1} = ${fmtD(delta)}`, 4);
  const answer = `P${best[0] + 1}–P${best[1] + 1} = ${fmtD(delta)}`;
  return { steps, pair: [pts[best[0]], pts[best[1]]], dist: delta, answer };
}

// ---------------------------------------------------------------------------
// 2. Karatsuba multiplication
// ---------------------------------------------------------------------------

export const KAR_CODE = [
  "split x,y into hi|lo",
  "z0 = lo·lo, z2 = hi·hi",
  "z1 = (hi+lo)·(hi+lo) − z2 − z0",
  "x·y = z2·10²ᵐ + z1·10ᵐ + z0",
  "1-digit? multiply direct",
];

export type KarStep = {
  expr: string;
  depth: number;
  kind: "call" | "base" | "combine";
  detail: string;
  mults: number;
  desc: string;
  codeLine: number;
};

export type KarResult = {
  steps: KarStep[];
  product: number;
  kMults: number;
  naiveMults: number;
  answer: string;
};

export const KAR_A = "123456";
export const KAR_B = "654321";

export function karatsubaTrace(aStr: string, bStr: string, lang: Lang = "en"): KarResult {
  const bn = lang === "bn";
  let L = Math.max(aStr.length, bStr.length);
  if (L % 2 === 1) L++;
  const A = aStr.padStart(L, "0");
  const B = bStr.padStart(L, "0");
  const steps: KarStep[] = [];
  let mults = 0;
  const push = (expr: string, depth: number, kind: KarStep["kind"], detail: string, desc: string, codeLine: number) =>
    steps.push({ expr, depth, kind, detail, mults, desc, codeLine });

  push(`${A} × ${B}`, 0, "call", bn ? "শুরু" : "start", bn ? `${aStr} × ${bStr} গুণ করো` : `multiply ${aStr} × ${bStr}`, 0);

  function rec(x: string, y: string, depth: number): number {
    const xs = x.replace(/^0+(?=\d)/, "");
    const ys = y.replace(/^0+(?=\d)/, "");
    const xi = Number(xs);
    const yi = Number(ys);
    if (xs.length <= 1 && ys.length <= 1) {
      mults++;
      push(`${x} × ${y}`, depth, "base", `= ${xi * yi}`, bn ? `${xs}×${ys} = ${xi * yi} (সরাসরি)` : `${xs}×${ys} = ${xi * yi} (direct)`, 4);
      return xi * yi;
    }
    let n = Math.max(xs.length, ys.length);
    if (n % 2 === 1) n++;
    const xp = xs.padStart(n, "0");
    const yp = ys.padStart(n, "0");
    const m = n / 2;
    const xh = xp.slice(0, m);
    const xl = xp.slice(m);
    const yh = yp.slice(0, m);
    const yl = yp.slice(m);
    push(`${xp} × ${yp}`, depth, "call", `${xh}|${xl} × ${yh}|${yl}`, bn ? `ভাঙো: ${xh}|${xl} × ${yh}|${yl}` : `split: ${xh}|${xl} × ${yh}|${yl}`, 0);
    const z2 = rec(xh, yh, depth + 1);
    const z0 = rec(xl, yl, depth + 1);
    const s1 = String(Number(xh) + Number(xl));
    const s2 = String(Number(yh) + Number(yl));
    const z12 = rec(s1, s2, depth + 1);
    const z1 = z12 - z2 - z0;
    const res = z2 * Math.pow(10, 2 * m) + z1 * Math.pow(10, m) + z0;
    push(`${xp} × ${yp}`, depth, "combine", `z2=${z2} z1=${z1} z0=${z0}`, bn ? `জোড়া: ${z2}·10^${2 * m} + ${z1}·10^${m} + ${z0} = ${res}` : `combine: ${z2}·10^${2 * m} + ${z1}·10^${m} + ${z0} = ${res}`, 3);
    return res;
  }

  const product = rec(A, B, 0);
  const naiveMults = L * L;
  push(`${A} × ${B}`, 0, "combine", `= ${product}`, bn ? `শেষ — গুণফল ${product} (${mults} গুণ বনাম naive ${naiveMults})` : `done — product ${product} (${mults} mults vs naive ${naiveMults})`, 3);
  return { steps, product, kMults: mults, naiveMults, answer: String(product) };
}
