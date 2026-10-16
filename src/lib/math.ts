import type { Lang } from "./dict";

// Math & Number Theory traces.

// ---------------------------------------------------------------------------
// GCD & LCM — Euclidean algorithm
// ---------------------------------------------------------------------------

export const GCD_CODE = [
  "gcd(a, b):",
  "  r = a mod b",
  "  r == 0? answer is b",
  "  else gcd(b, r)",
  "lcm = a / gcd × b",
];

export type GcdStep = {
  a: number;
  b: number;
  r: number | null;
  desc: string;
  codeLine: number;
};

export type GcdResult = {
  steps: GcdStep[];
  gcd: number;
  lcm: number;
  answer: string;
};

export function gcdTrace(a0: number, b0: number, lang: Lang = "en"): GcdResult {
  const bn = lang === "bn";
  const steps: GcdStep[] = [];
  let a = Math.abs(a0);
  let b = Math.abs(b0);
  if (b === 0 && a === 0) {
    steps.push({ a: 0, b: 0, r: null, desc: bn ? "দুটোই ০ — gcd অনির্ণেয়" : "both zero — gcd undefined", codeLine: 0 });
    return { steps, gcd: 0, lcm: 0, answer: "—" };
  }
  if (b === 0) {
    steps.push({ a, b, r: null, desc: bn ? `gcd(${a}, 0) = ${a}` : `gcd(${a}, 0) = ${a}`, codeLine: 2 });
    return { steps, gcd: a, lcm: 0, answer: String(a) };
  }
  steps.push({ a, b, r: null, desc: bn ? `gcd(${a}, ${b}) বের করো` : `find gcd(${a}, ${b})`, codeLine: 0 });
  while (b !== 0) {
    const r = a % b;
    steps.push({
      a,
      b,
      r,
      desc: r === 0
        ? bn ? `${a} mod ${b} = 0 → উত্তর ${b} ✓` : `${a} mod ${b} = 0 → answer ${b} ✓`
        : bn ? `${a} mod ${b} = ${r} → এবার gcd(${b}, ${r})` : `${a} mod ${b} = ${r} → now gcd(${b}, ${r})`,
      codeLine: r === 0 ? 2 : 3,
    });
    a = b;
    b = r;
  }
  const gcd = a;
  const lcm = Math.abs(a0 * b0) === 0 ? 0 : Math.abs((a0 * b0) / gcd);
  steps.push({ a: gcd, b: 0, r: null, desc: bn ? `lcm = ${a0}÷${gcd}×${b0} = ${lcm}` : `lcm = ${a0}÷${gcd}×${b0} = ${lcm}`, codeLine: 4 });
  return { steps, gcd, lcm, answer: String(gcd) };
}

// ---------------------------------------------------------------------------
// Sieve of Eratosthenes
// ---------------------------------------------------------------------------

export const SIEVE_CODE = [
  "assume all 2..n prime",
  "p = next unmarked",
  "  strike p×p, p×p+p, …",
  "p² > n? survivors win",
  "leftovers are primes",
];

export type SieveStep = {
  alive: boolean[];
  p: number;
  struck: number[];
  primes: number[];
  desc: string;
  codeLine: number;
};

export type SieveResult = {
  steps: SieveStep[];
  primes: number[];
  answer: string;
};

export function sieveTrace(n: number, lang: Lang = "en"): SieveResult {
  const bn = lang === "bn";
  const alive = Array(n + 1).fill(true);
  alive[0] = false;
  if (n >= 1) alive[1] = false;
  const steps: SieveStep[] = [];
  const primes: number[] = [];
  const snap = (p: number, struck: number[], desc: string, codeLine: number): SieveStep => ({
    alive: [...alive],
    p,
    struck: [...struck],
    primes: [...primes],
    desc,
    codeLine,
  });
  steps.push(snap(-1, [], bn ? `২–${n} সবাই প্রার্থী` : `2–${n} all candidates`, 0));
  for (let p = 2; p * p <= n; p++) {
    if (!alive[p]) continue;
    primes.push(p);
    const struck: number[] = [];
    for (let m = p * p; m <= n; m += p) {
      if (alive[m]) {
        alive[m] = false;
        struck.push(m);
      }
    }
    steps.push(snap(p, struck, struck.length > 0 ? bn ? `${p} মৌলিক ✓ — ${struck.join(", ")} কাটো` : `${p} is prime ✓ — strike ${struck.join(", ")}` : bn ? `${p} মৌলিক ✓ — নতুন কাটা নেই` : `${p} is prime ✓ — nothing new`, 2));
  }
  for (let p = 2; p <= n; p++) if (alive[p] && !primes.includes(p)) primes.push(p);
  primes.sort((x, y) => x - y);
  steps.push(snap(-1, [], bn ? `শেষ — মৌলিক ${primes.length}টি` : `done — ${primes.length} primes`, 4));
  return { steps, primes, answer: primes.join(", ") || "—" };
}

// ---------------------------------------------------------------------------
// Fast exponentiation — binary method
// ---------------------------------------------------------------------------

export const FEXP_CODE = [
  "read n in binary",
  "square x each bit",
  "  bit 1? res ×= x",
  "  x = x×x, shift n",
  "O(log n) mults",
];

export type FExpStep = {
  bit: number;
  res: number;
  base: number;
  exp: number;
  desc: string;
  codeLine: number;
};

export type FExpResult = {
  steps: FExpStep[];
  value: number;
  mults: number;
  naive: number;
  answer: string;
};

export function fastExpTrace(x0: number, n0: number, lang: Lang = "en"): FExpResult {
  const bn = lang === "bn";
  const steps: FExpStep[] = [];
  let res = 1;
  let base = x0;
  let exp = n0;
  let mults = 0;
  const bits = n0.toString(2);
  steps.push({ bit: -1, res, base, exp, desc: bn ? `${x0}^${n0} — বাইনারিতে ${bits}` : `${x0}^${n0} — binary ${bits}`, codeLine: 0 });
  let k = 0;
  while (exp > 0) {
    const bit = exp % 2;
    if (bit === 1) {
      res *= base;
      mults++;
      steps.push({ bit, res, base, exp, desc: bn ? `বিট 1 → res = res×${base} = ${res}` : `bit 1 → res = res×${base} = ${res}`, codeLine: 2 });
    } else {
      steps.push({ bit, res, base, exp, desc: bn ? `বিট 0 → res ছোঁয়া নয়` : `bit 0 → res untouched`, codeLine: 2 });
    }
    exp = Math.floor(exp / 2);
    if (exp > 0) {
      base *= base;
      mults++;
      steps.push({ bit, res, base, exp, desc: bn ? `বর্গ: base = ${base} (বাকি n=${exp})` : `square: base = ${base} (n=${exp} left)`, codeLine: 3 });
    }
    k++;
    if (k > 64) break;
  }
  steps.push({ bit: -1, res, base, exp: 0, desc: bn ? `শেষ — ${x0}^${n0} = ${res} (${mults} গুণ)` : `done — ${x0}^${n0} = ${res} (${mults} mults)`, codeLine: 4 });
  return { steps, value: res, mults, naive: Math.max(n0 - 1, 0), answer: String(res) };
}

// ---------------------------------------------------------------------------
// Pascal's triangle
// ---------------------------------------------------------------------------

export const PASCAL_CODE = [
  "row 0 = [1]",
  "edges are always 1",
  "inside = up-left + up",
  "row r has r+1 cells",
  "C(n,k) lives here",
];

export type PascalStep = {
  rows: number[][];
  cell: [number, number] | undefined;
  refs: [number, number][];
  desc: string;
  codeLine: number;
};

export type PascalResult = {
  steps: PascalStep[];
  answer: string;
};

export function pascalTrace(n: number, lang: Lang = "en"): PascalResult {
  const bn = lang === "bn";
  const rows: number[][] = [];
  const steps: PascalStep[] = [];
  const push = (cell: [number, number] | undefined, refs: [number, number][], desc: string, codeLine: number) =>
    steps.push({ rows: rows.map((r) => [...r]), cell, refs, desc, codeLine });

  for (let r = 0; r < n; r++) {
    rows.push([]);
    for (let c = 0; c <= r; c++) {
      if (c === 0 || c === r) {
        rows[r].push(1);
        push([r, c], [], bn ? `[${r},${c}] = 1 (কিনারা)` : `[${r},${c}] = 1 (edge)`, 1);
      } else {
        const v = rows[r - 1][c - 1] + rows[r - 1][c];
        rows[r].push(v);
        push([r, c], [[r - 1, c - 1], [r - 1, c]], bn ? `[${r},${c}] = ${rows[r - 1][c - 1]}+${rows[r - 1][c]} = ${v}` : `[${r},${c}] = ${rows[r - 1][c - 1]}+${rows[r - 1][c]} = ${v}`, 2);
      }
    }
  }
  steps.push({ rows: rows.map((r) => [...r]), cell: undefined, refs: [], desc: bn ? `শেষ — ${n} সারি, C(n,k) প্রস্তুত` : `done — ${n} rows, C(n,k) ready`, codeLine: 4 });
  return { steps, answer: rows.length > 0 ? rows[rows.length - 1].join(" ") : "—" };
}
